<?php

namespace App\Http\Requests\user;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNivel extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $userId = $this->route('id'); 
       
        $accessToken = Auth::user()->currentAccessToken();

        if ($accessToken && $accessToken->tokenable_id == $userId && $accessToken->can('create')) {
            return true;
        }
        
        // Check if the token belongs to an admin user
        if ( ($accessToken->tokenable->acces === 'superadmin' || $accessToken->tokenable->acces === 'admin')  && $accessToken->can('read') ) {
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
            'nivel'=>[
                'required',
                'string',
                'max:1',
                'regex:/^[0-5]$/'
            ]
        ];
    }
}
