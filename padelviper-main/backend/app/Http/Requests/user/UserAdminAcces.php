<?php

namespace App\Http\Requests\user;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Http\FormRequest;

class UserAdminAcces extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    { 
       
        $accessToken = Auth::user()->currentAccessToken();

        if ( $accessToken->tokenable->acces === 'superadmin' && $accessToken->can('create') ) {
            return true;
        }
    
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id'=>"required|exists:users,id",
            'acces'=>"required|string|in:admin,user"
        ];
    }
}
