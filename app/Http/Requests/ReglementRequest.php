<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReglementRequest extends FormRequest
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
            "transactionId" => "nullable|string",
            "school_id" => "nullable|integer|exists:schools,id",
            "montant" => "required|numeric",
            "annee_scolaire" => "required|date"
        ];
    }

    /**
     * Les messages
     */
    public function messages(): array
    {
        return [
            'transactionId.string' => "L'identifiant de transaction doit être une chaîne de caractères.",

            'school_id.integer' => "L'identifiant de l'école doit être un nombre entier.",
            'school_id.exists' => "L'école sélectionnée est invalide.",

            'montant.required' => "Le montant est obligatoire.",
            'montant.numeric' => "Le montant doit être un nombre.",

            'annee_scolaire.required' => "L'année scolaire est obligatoire.",
            'annee_scolaire.date' => "L'année scolaire doit être une date valide.",
        ];
    }
}
