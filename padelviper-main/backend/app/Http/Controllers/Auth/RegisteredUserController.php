<?php

namespace App\Http\Controllers\Auth;

use Throwable;
use App\Models\User;
use PhpParser\Error;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use PhpParser\Node\Expr\Throw_;
use Illuminate\Validation\Rules;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Validation\Rule;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        try {
            try {
                $request->validate([
                    'user.name' => ['required', 'string', 'max:255'],
                    'user.email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                    'user.password' => ['required', 'string', 'max:255'],
                    'user.surname' => ['required', 'string', 'max:255'],
                    'user.tel' => ['required', 'string', 'max:255', 'unique:users,tel'],
                    'user.nivel' => ['string', 'max:255'],
                ]);
            } catch (Throwable $e) {
                return  response()->json('Error al validar datos, telefono u email duplicado: ' . $e->getMessage(), 405);
            }

            try {
                $user = User::create([
                    'name' => $request->input('user.name'),
                    'email' => $request->input('user.email'),
                    'password' => Hash::make($request->input('user.password')),
                    'surname' => $request->input('user.surname'),
                    'tel' => $request->input('user.tel'),
                    'nivel' => $request->input('user.nivel')
                ]);
            } catch (Throwable $e) {
                return  response()->json('No se ha podido registrar usuario,   ' . $e->getMessage());
            }
            event(new Registered($user));

            Auth::login($user);

            $token = $user->createToken('user', ['read', 'create', 'delete'], now()->addDay())->plainTextToken;

            return response()->json(['user' => $user, 'token' => $token], 201);
        } catch (Throwable $e) {
            return  response()->json('No se ha podido registrar usuario  ' . $e->getMessage());
        }
    }
}
