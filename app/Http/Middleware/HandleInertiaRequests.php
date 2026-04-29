<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        Log::debug("roles du user", ["data" => $user && $user->hasRole(["Super Administrateur", "Administrateur"])]);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user?->load("roles"),
                'school' => $user?->school,
                'trimestres' => $user->school?->trimestres ?? Trimestre::with("school")->get(),
                'receivedNotificationsNbr' => $user ? $user->notificationsReceived->count() : 0,
                'base_url' => env("APP_URL"),
                'permissions' => $user?->getAllPermissions(),
                'showDashboard' => $user && $user->hasRole(["Super Administrateur", "Administrateur"])
            ],
        ];
    }
}
