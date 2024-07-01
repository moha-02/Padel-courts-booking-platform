<?php

namespace App\Http\Requests\pricepista;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdatePricePistaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $userId = $this->route('id'); 
        
       
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
            "prange1"=> "nullable|numeric",
            "prange2"=> "nullable|numeric",
            "prange3"=> "nullable|numeric"
        ];
    }
}
