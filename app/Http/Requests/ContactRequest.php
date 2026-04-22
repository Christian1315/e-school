<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "fullname" => "required",
            "phone" => "required",
            "email" => "required|email",
            "message" => "required"
        ];
    }

    /**
     * Les messages
     */
    public function messages(): array
    {
        return [
            'fullname.required' => 'Le nom complet est obligatoire.',
            'phone.required' => 'Le numéro de téléphone est obligatoire.',
            'email.required' => 'L’adresse email est obligatoire.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'message.required' => 'Le message est obligatoire.',
        ];
    }
}
