<?php

namespace App\Http\Requests\parcialclubs;

use Illuminate\Foundation\Http\FormRequest;
use  Illuminate\Support\Facades\Auth;

class storeParcialClubRequest extends FormRequest
{

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => 'required|string|max:255',
            "calle" => "required|string|max:255",
            "zip" => "required|string|max:255",
            "numero" => "required|numeric",
            "localidad" => "required|string|max:255",
            "pais" => "required|string|max:255",
            "img" => "max:1024|image|mimes:jpeg,png,jpg,gif",
            "horario" => "required|string|max:255",
            "contact_number" => "required|string|max:255",
        ];
    }
}
