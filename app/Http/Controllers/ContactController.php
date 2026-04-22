<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Contact;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::orderByDesc("read")->get();
        return Inertia::render("Contact/List", ["contacts" => ContactResource::collection($contacts)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContactRequest $request)
    {
        try {
            DB::beginTransaction();
            Contact::create($request->validated());
            DB::commit();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["data" => $e->errors()]);
            return redirect()->back()->with($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure d'exception lors d ela création du contact", ["data" => $e->getMessage()]);
            return redirect()->back()->with(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        try {
            DB::beginTransaction();
            $contact->update($request->all());
            DB::commit();
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["data" => $e->errors()]);
            return redirect()->back()->with($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure d'exception lors d ela création du contact", ["data" => $e->getMessage()]);
            return redirect()->back()->with(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        //
    }
}
