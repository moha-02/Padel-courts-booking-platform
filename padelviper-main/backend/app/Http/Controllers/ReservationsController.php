<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\User;
use PhpParser\Error;
use App\Models\Reservations;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Http\Resources\reservations\ReservationsResource;
use App\Http\Resources\reservations\ReservationsCollection;
use App\Http\Requests\reservations\StoreReservationsRequest;
use App\Http\Requests\reservations\UpdateReservationsRequest;
use App\Models\Pistas;
use App\Models\PricePista;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class ReservationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Obtener todas las reservas con datos de la pista y el club
            $reservations = Reservations::with('pista.club')->get();

            // Devolver las reservas con los datos de la pista y el club
            return response()->json(['reservations' => $reservations], 200);
        } catch (Throwable $e) {
            throw new Error('Nos se pudo recuperar tabla reservations');
        }
    }

    /**
     * Para obtener las reservas de un usuario en especifico
     */

    public function userReservations($user_id)
    {

        try {
            $user = User::find($user_id);
            if (!$user) {
                return response()->json(['error' => 'Usuario no encontrado'], 404);
            }
            $user = Auth::user();
            if ($user->tokenCan('read') && $user_id == $user->id) {
                $reservations = Reservations::with('pista.club')->where('user_id', $user_id)->get();
                return response()->json(['reservations' => $reservations], 200);
            }
            return response()->json(['error' => 'Usuario no autorizado'], 401);
        } catch (Throwable $e) {
            throw new Error('No se pudo recuperar las reservas del usuario');
        }
    }

    /**
     * Reservas disponibles
     */
    public function availableReservations(Request $request)
    {
        try {
            // Obtenemos los parámetros 
            $filtros = $request->only(["fecha", "hora_inicio", "hora_fin", "duracion"]);
            $reservasDisponibles = [];

            $today = Carbon::today();
            $oneWeekLater = $today->copy()->addDays(7);
            $apertura = Carbon::parse('09:00:00');
            $cierre = Carbon::parse('23:00:00');
            $minutosReserva = [60, 90, 120];

            // Obtener reservas agrupadas por pista y fecha
            $reservasAgrupadas = $this->obtenerReservasAgrupadas($today, $oneWeekLater);

            // Obtener las pistas con su club
            $pistas = Pistas::with('club')->get();

            // Calcular las reservas disponibles
            foreach ($pistas as $pista) {
                $reservasDisponibles = array_merge($reservasDisponibles, $this->calcularReservasDisponibles($pista, $today, $oneWeekLater, $apertura, $cierre, $minutosReserva, $reservasAgrupadas));
            }

            // Filtrar las reservas disponibles según los filtros proporcionados
            $reservasDisponibles = $this->filtrosDispoibiladad($reservasDisponibles, $filtros);

            return response()->json(['Disponibles' => $reservasDisponibles], 200);
        } catch (Throwable $e) {
            return response()->json(['error' => 'No se pudo recuperar las reservas disponibles'], 500);
        }
    }

    private function obtenerReservasAgrupadas($inicio, $fin)
    {
        return Reservations::whereBetween('reservation_date', [$inicio, $fin])
            ->get()
            ->groupBy(['pistas_id', 'reservation_date']);
    }

    //Calaculo de las reservas disponibles
    private function calcularReservasDisponibles($pista, $today, $oneWeekLater, $apertura, $cierre, $minutosReserva, $reservasAgrupadas)
    {
        $reservasDisponibles = [];
        $pistaId = $pista->id;
        $periodo = CarbonPeriod::create($today, '1 day', $oneWeekLater);

        foreach ($periodo as $fecha) {
            $fechaStr = $fecha->format('Y-m-d');
            foreach ($minutosReserva as $duracion) {
                for ($hour = $apertura->hour; $hour < $cierre->hour; $hour++) {
                    if ($hour == 22 && $duracion != 60) continue;
                    $inicio = $fecha->copy()->setTime($hour, 0);
                    $fin = $inicio->copy()->addMinutes($duracion);

                    if (!$this->haySolapamiento($reservasAgrupadas, $pistaId, $fechaStr, $inicio, $fin)) {
                        $reservasDisponibles[] = [
                            'club' => $pista->club->name,
                            'pista_id' => $pista->id,
                            'pista_name' => $pista->nombre,
                            'fecha' => $fecha->format('Y-m-d'),
                            'inicio' => $inicio->format('H:i'),
                            'fin' => $fin->format('H:i'),
                            'duracion' => $duracion
                        ];
                    }
                }
            }
        }

        return $reservasDisponibles;
    }
    //Verifica si hay solapamiento de reservas
    private function haySolapamiento($reservasAgrupadas, $pistaId, $fechaStr, $inicio, $fin)
    {
        if (!isset($reservasAgrupadas[$pistaId][$fechaStr])) {
            return false;
        }

        foreach ($reservasAgrupadas[$pistaId][$fechaStr] as $reserva) {
            $reservaInicio = Carbon::parse($reserva->reservation_date . ' ' . $reserva->start_time);
            $reservaFin = Carbon::parse($reserva->reservation_date . ' ' . $reserva->end_time);
            if (!($fin->lte($reservaInicio) || $inicio->gte($reservaFin))) {
                return true;
            }
        }

        return false;
    }


    /**
     * filtros de las reservas disponibles
     */

    private function filtrosDispoibiladad($reservas, $filtros)
    {
        // Si no se pasan filtros, devolver todas las reservas disponibles
        if (!empty($filtros['fecha'])) {
            $reservas = array_filter($reservas, function ($reserva) use ($filtros) {
                return $reserva['fecha'] === $filtros['fecha'];
            });
            $reservas = array_values($reservas); // Reindexar
        }

        if (!empty($filtros['hora_inicio'])) {
            $reservas = array_filter($reservas, function ($reserva) use ($filtros) {
                return $reserva['inicio'] == $filtros['hora_inicio'];
            });
            $reservas = array_values($reservas); // Reindexar
        }

        if (!empty($filtros['hora_fin'])) {
            $reservas = array_filter($reservas, function ($reserva) use ($filtros) {
                return $reserva['fin'] == $filtros['hora_fin'];
            });
            $reservas = array_values($reservas); // Reindexar
        }

        if (!empty($filtros['duracion'])) {
            $reservas = array_filter($reservas, function ($reserva) use ($filtros) {
                return $reserva['duracion'] == $filtros['duracion'];
            });
            $reservas = array_values($reservas); // Reindexar
        }

        return $reservas;
    }




    /**
     * Para eliminar una reserva en de un usuario
     */
    public function deleteReservationUser($user_id, $reservation_id)
    {
        try {
            $user = User::find($user_id);
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }
            $user = Auth::user();
            if (!$user->tokenCan('delete')) {
                return response()->json(['message' => 'Usuario no autorizado'], 401);
            }
            // Verificar que la reserva pertenece al usuario autenticado


            $reservations = Reservations::where('user_id', $user_id)->where('id', $reservation_id)->first();
            if ($reservations && $reservations->user_id == $user->id) {
                $reservations->delete();
                return response()->json(['message' => 'Reserva eliminada correctamente'], 200);
            }
            return response()->json(['message' => 'No se encontro la reserva'], 404);
        } catch (Throwable $e) {
            throw new Error('No se pudo eliminar la reserva');
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReservationsRequest $request)
    {
        try {
            $user = Auth::user();

            $validatedData = $request->validated(); // Retrieve only validated data


            if ($user->tokenCan('read')) {
                //Comprobacion si el usuario esta reservando antes de la apertura del club y despues

                $inicioReserva = Carbon::parse($validatedData['data']['start_time']);
                $finReserva = Carbon::parse($validatedData['data']['end_time']);

                $aperturaClub = Carbon::parse('09:00:00');
                $cierreClub = Carbon::parse('23:00:00');

                if ($inicioReserva->lt($aperturaClub) || $finReserva->gt($cierreClub)) {
                    return response()->json(['error' => 'El club esta cerrado a la hora seleccionada. Por favor seleccione otra hora.']);
                }

                //Comprobacion si hay un horario reservado
                $reservaExistente = Reservations::where('pistas_id', $validatedData['data']['pistas_id'])
                    ->whereDate('reservation_date', $validatedData['data']['reservation_date'])
                    ->where(function ($query) use ($validatedData) {
                        $query->where('start_time', '>=', $validatedData['data']['start_time'])
                            ->where('start_time', '<', $validatedData['data']['end_time'])
                            ->orWhere('end_time', '>', $validatedData['data']['start_time'])
                            ->where('end_time', '<=', $validatedData['data']['end_time']);
                    })->first();

                if ($reservaExistente) {
                    return response()->json(['error' => 'La franja horaria selecionada ya esta reservada.Por favor seleccione otra.']);
                }



                try {
                    $model = new Reservations();
                    $model->pistas_id = $validatedData['data']['pistas_id'];
                    $model->user_id = $validatedData['data']['user_id'];
                    $model->start_time = $validatedData['data']['start_time'];
                    $model->end_time = $validatedData['data']['end_time'];
                    $model->reservation_date = $validatedData['data']['reservation_date'];
                    $model->price = $validatedData['data']['price'];
                    $model->save();
                } catch (Throwable $e) {
                    return response()->json(['error' => 'No se ha podido realizar la reserva.Revise los datos e intente de nuevo.']);
                }
                return new ReservationsResource($model);
            }
            throw new Error('Usuario no autorizado');
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    /**
     * Filtros de las reservas disponibles
     */





    /**
     * Display the specified resource.
     */
    public function show(Reservations $reservations)
    {
        //
    }





    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservations $reservations)
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReservationsRequest $request, Reservations $reservations)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservations $reservations)
    {
        //Eliminar reserva


    }
}
