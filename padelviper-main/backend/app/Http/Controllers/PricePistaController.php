<?php

namespace App\Http\Controllers;

use App\Http\Requests\pricepista\StorePricePistaRequest;
use App\Http\Requests\pricepista\UpdatePricePistaRequest;
use App\Http\Resources\pricepista\PricePistaCollection;
use App\Http\Resources\pricepista\PricePistaResource;
use App\Models\PricePista;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Error;
use Throwable;

class PricePistaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $pricepistaList = PricePista::all();
            return response()->json(new PricePistaCollection($pricepistaList));
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePricePistaRequest $request)
    {
        try {
            $storePrice = new PricePista();
            $storePrice->pista_id = $request['pista_id'];
            $storePrice->prange1 = $request['prange1'];
            $storePrice->prange2 = $request['prange2'];
            $storePrice->prange3 = $request['prange3'];
            $storePrice->save();

            return response()->json(new PricePistaResource($storePrice), 201);
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

            $pricepista = PricePista::where('pista_id', $id)->first();
            return response()->json(new PricePistaResource($pricepista));
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }
    public function showPrice(Request $request, string $pistaId, string $startTime)
    {
        try {

            $price = 0;

            $pricepista = PricePista::where('pista_id', $pistaId)->first();

            if (!$pricepista) {
                throw new Error('Pricepista not found');
            }

            $hour = (int)date('H', strtotime($startTime));

            if ($hour <= 12) {
                $price = $pricepista->prange1;
            } elseif ($hour <= 17) {
                $price = $pricepista->prange2;
            } else {
                $price = $pricepista->prange3;
            }

            return response()->json(['price' => $price]);
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePricePistaRequest $request, string $id)
    {
        try {
            $pricepista = PricePista::where('pista_id', $id)->first();
            if ($pricepista) {
                $dataToUpdate = $request->only([
                    'prange1',
                    'prange2',
                    'prange3',
                ]);
                $pricepista->update($dataToUpdate);
                return response()->json(['message' => 'price updated successfully']);
            } else {
                throw new Error('pricepista undefined');
            }
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $accessToken = Auth::user()->currentAccessToken();

            if ( ($accessToken->tokenable->acces === 'superadmin' || $accessToken->tokenable->acces === 'admin')  && $accessToken->can('delete') ) {
                throw new Error('Unauthorized');
            }

            $id = $request->route('pricepista');
            $record = PricePista::find($id);

            if (!$record) {
                throw new Error('Record not found');
            }
            $record->delete();

            return response()->json(['mesage' => 'pricepista deleted']);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}
