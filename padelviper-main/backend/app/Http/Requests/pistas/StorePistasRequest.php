<?php

namespace App\Http\Requests\pistas;
use Illuminate\Support\Str;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StorePistasRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        
       
        $accessToken = Auth::user()->currentAccessToken();
    
       
        if ( ($accessToken->tokenable->acces === 'superadmin' || $accessToken->tokenable->acces === 'admin')  && $accessToken->can('create') ) {
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
            "nombre" => 'required|string|max:255',
            "clubs_id" =>"required|exists:clubs,id"
        ];
    }
}
