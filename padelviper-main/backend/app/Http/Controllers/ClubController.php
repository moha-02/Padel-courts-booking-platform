<?php

namespace App\Http\Controllers;

use App\Http\Resources\clubs\ClubsResource;
use Throwable;
use App\Models\Club;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Http\Requests\clubs\StoreClubRequest;

use App\Http\Requests\clubs\UpdateClubRequest;
use App\Http\Resources\clubs\ClubsCollection;

class ClubController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $clubs = Club::all();
            return response()->json(new ClubsCollection($clubs));
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }



    public function upload(Request $request, $id)
    {
        //
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
    public function store(StoreClubRequest $request)
    {
        try {
            $storeClub = new Club();
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

            return response()->json(new ClubsResource($storeClub), 201);
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

            $pista = Club::find($id);
            return response()->json(new ClubsResource($pista));
        } catch (Throwable $e) {
            return response()->json(["error" => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Club $club)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClubRequest $request, Club $club)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Club $club)
    {
        //
    }
}
