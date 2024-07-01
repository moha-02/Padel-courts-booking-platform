<?php

namespace App\Http\Controllers;

use App\Models\Pistas;
use App\Http\Requests\pistas\StorePistasRequest;
use App\Http\Requests\pistas\UpdatePistasRequest;
use App\Http\Resources\pistas\PistasCollection;
use App\Http\Resources\pistas\PistasResource;
use Throwable;

class PistasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $pistas = Pistas::all();
            return response()->json(new PistasCollection($pistas));
        } catch (Throwable $e) {
            return response()->json(["error"=>$e->getMessage()]);
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
    public function store(StorePistasRequest $request)
    {
        try{
            $pista = new Pistas();
            $pista->nombre = $request['nombre'];
            $pista->clubs_id = $request['clubs_id'];
            $pista->save();
            return response()->json(["message"=>"pista created successfully"],201);
        }catch(Throwable $e){
            return response()->json(["error"=> $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
           
            $pista = Pistas::find($id);
            return response()->json(new PistasResource($pista));
        }catch(Throwable $e){
            return response()->json(["error"=> $e->getMessage()]);
        }
       
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pistas $pistas)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePistasRequest $request, Pistas $pistas)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pistas $pistas)
    {
        //
    }
}
