<?php

namespace App\Http\Requests\user;

use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateUser extends FormRequest
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
        $userId = $this->user()->id;
        return [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId, 'id'),
            ],
            'tel' => 'required|string|max:20',
        ];
    }
}
