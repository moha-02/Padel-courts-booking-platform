<?php

namespace App\Http\Controllers;

use App\Http\Requests\user\DeleteUserRequest;
use App\Http\Requests\user\UpdateNivel;
use App\Http\Resources\user\UserCollection;
use App\Models\User;
use App\Http\Requests\user\UpdateUser;
use App\Http\Requests\user\UserAdminAcces;
use App\Http\Requests\user\UsersList;
use Illuminate\Http\Request;
use PhpParser\Error;
use Throwable;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(UsersList $request )
    {
        try{
            $userList = User::all();
            return response()->json(new UserCollection($userList));
        }catch(Throwable $e){
            return response()->json(["error"=>$e->getMessage()]);
        }    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUser $request, string $id)
    {
        try{
            $user = User::find($id);
            if($user){ 
                $user->name = $request->name;
                $user->surname = $request->surname;
                $user->email = $request->email;
                $user->tel = $request->tel;
                $user->save();
                $user->tokens()->delete();
                $token = $user->createToken('user', ['read', 'create'], now()->addDay())->plainTextToken;
                return response()->json(['user'=>$user,'token'=>$token] ,200);
            }else{
                throw new Error ('User undefined');
            }
        }catch(Throwable $e){
            return response()->json(['error'=>$e->getMessage()]);
        }
    }
    public function updateNivel(UpdateNivel $request, string $id){
        try{
            $user = User::find($id);
            if($user){ 
                $user->nivel = $request->nivel;
                $user->save();
                return response()->json(['message'=>'updated successfully']);
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
    public function destroy(User $user)
    {
        try {
            $userId = $user->id;
            $accessToken = Auth::user()->currentAccessToken();
            
            if ($accessToken && $accessToken->tokenable_id == $userId && $accessToken->can('delete')) {
                $user->tokens()->delete();
                $user->delete();
                return response()->json(['message' => 'User deleted successfully'], 200);
            }

            if ( ($accessToken->tokenable->acces === 'superadmin' || $accessToken->tokenable->acces === 'admin')  && $accessToken->can('delete') ) {
                $user->tokens()->delete();
                $user->delete();
                return response()->json(['message' => 'User deleted successfully'], 200);
            }

            return response()->json(['error' => 'Unauthorized'], 401);

        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
    public function changeacces(UserAdminAcces $request){
        try{
            $neuAdminId = $request->input('user_id');
            $userUpdate = User::find($neuAdminId);

            if(!$userUpdate){
                throw new Error('user not found');
            }

            $userUpdate->acces = $request->input('acces');
            $userUpdate->save();

            return response()->json(["message: "=>"updated successfully"]);


        }catch(Throwable $e){
            return response()->json(["error"=> $e->getMessage()]);
        }
    }

}
