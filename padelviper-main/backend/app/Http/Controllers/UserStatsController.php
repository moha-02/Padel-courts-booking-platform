<?php

namespace App\Http\Controllers;

use App\Http\Requests\userstats\GetUserStatsRequest;
use App\Http\Resources\userstats\UserStatsResource;
use App\Models\UserStats;
use App\Http\Requests\userstats\StoreUserStatsRequest;
use App\Http\Requests\userstats\UpdateUserStatsRequest;
use App\Models\User;
use PhpParser\Error;
use Throwable;

class UserStatsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
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
    public function store(StoreUserStatsRequest $request, string $id)
    {
        try{
            if(!User::find($id)->first()){
                throw new Error('undefinde id');
            }
            if(UserStats::where('user_id',$id)->exists()){
                throw new Error('user already have defined stats');
            }
            $storeUserStats = new UserStats();
            $storeUserStats->birth = $request->birth;
            $storeUserStats->weight = $request->weight;
            $storeUserStats->height = $request->height;
            $storeUserStats->hand = $request->hand;
            $storeUserStats->playTime = $request->playTime;
            $storeUserStats->gameType = $request->gameType;
            $storeUserStats->racketBrand = $request->racketBrand;
            $storeUserStats->user_id = $id;
            $storeUserStats->save();
            
            return response()->json(new UserStatsResource($storeUserStats),201);
        }catch(Throwable $e){
            return response()->json(['Error '.$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(GetUserStatsRequest $request,  string $id)
    {
        try{
            $userStats = UserStats::where('user_id', $id)->first();
            if($userStats){
                return response()->json(new UserStatsResource($userStats));
            }else{
                throw new Error('canot fin user_stats');
            }
        }catch(Throwable $e){
            return response()->json(["error"=>$e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserStats $userStats)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserStatsRequest $request,string $id)
    {
        try{
            $userStats = UserStats::where('user_id', $id)->first();
            if($userStats){ 
                $userStats->birth = $request->birth; 
                $userStats->weight = $request->weight; 
                $userStats->height = $request->height; 
                $userStats->playTime = $request->playTime; 
                $userStats->hand = $request->hand; 
                $userStats->gameType = $request->gameType; 
                $userStats->racketBrand = $request->racketBrand; 
                $userStats->save();
                
                return response()->json(new UserStatsResource($userStats));
            }else{
                throw new Error ('User undefined');
            }
        }catch(Throwable $e){
            return response()->json(['error'=>$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserStats $userStats)
    {
        //
    }
}
