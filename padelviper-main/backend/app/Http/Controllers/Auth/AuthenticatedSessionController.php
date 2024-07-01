<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;
use PhpParser\Node\Expr\Cast\Object_;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->input('data');
        $credentials = array_shift($data);
        $email = $credentials['email'];
        $password = $credentials['password'];

        if (Auth::attempt(['email' => $email, 'password' => $password])) {

            $user = $user = User::where('email', $email)->first();

            if ($user->acces == 'admin') {
                $token = $user->createToken('admin', ['create', 'delete', 'update'], now()->addDay())->plainTextToken;

                return response()->json(['user' => $user, 'token' => $token], 201);
            } else {
                $token = $user->createToken('user', ['read', 'create', 'delete'], now()->addDay())->plainTextToken;

                return response()->json(['user' => $user, 'token' => $token], 201);
            }
        } else {
            // Authentication failed
            return response()->json(['message' => 'Invalid email or password'], 401);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
