<?php

namespace App\Http\Controllers;

use App\Http\Requests\parcialclubs\storeParcialClubRequest;
use App\Http\Resources\clubs\ParcialsClubsResource;
use App\Http\Resources\parcialsclubs\ParcialsClubsCollection;
use App\Models\ParcialClub;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

class ParcialClubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            if ($user->acces == 'superadmin') {
                $clubs = ParcialClub::all();
                return response()->json(new ParcialsClubsCollection($clubs));
            } else {
                return response()->json(['message' => 'Usuario no autorizado'], 401);
            }
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(storeParcialClubRequest $request)
    {
        try {

            $storeClub = new ParcialClub();
            $storeClub->name = $request['name'];
            $storeClub->calle = $request['calle'];
            $storeClub->zip = $request['zip'];
            $storeClub->numero = $request['numero'];
            $storeClub->localidad = $request['localidad'];
            $storeClub->pais = $request['pais'];
            $storeClub->horario = $request['horario'];
            $storeClub->contact_number = $request['contact_number'];
            if ($request['img']) {
                $file = $request['img'];
                $imagePath = time() . '.' . $file->getClientOriginalExtension();
                $storeClub->img = ('/upload/images/' . $imagePath);
                $file->move(public_path('/upload/images/'), $imagePath);
            }
            $storeClub->save();

            return response()->json(new ParcialsClubsResource($storeClub), 201);
        } catch (Throwable $e) {
            return response()->json(['Error ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = Auth::user();

            if ($user->acces == 'superadmin') {
                $pista = ParcialClub::find($id);
                return response()->json(new ParcialsClubsResource($pista));
            } else {
                return response()->json(['message' => 'Usuario no autorizado'], 401);
            }
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $user = Auth::user();

            if ($user->acces == 'superadmin') {
                $club = ParcialClub::find($id);

                if (!$club) {
                    return response()->json(['error' => 'Club no encontrado'], 404);
                }
                // Eliminar el club
                $club->delete();

                return response()->json(['message' => 'Club eliminado correctamente'], 200);
            } else {
                return response()->json(['message' => 'Usuario no autorizado'], 401);
            }
        } catch (Throwable $e) {

            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
