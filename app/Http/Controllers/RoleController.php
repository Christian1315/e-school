<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Getting all roles
     */
    public function index()
    {
        $roles = Role::with(['permissions', 'users'])->latest()->get();

        return Inertia::render('Role/List', [
            "roles" => $roles,
        ]);
    }

    /**
     * Getting all permissions
     */
    public function getPermissions(Request $request, $id)
    {
        $role = Role::with("permissions")->find($id);

        return Inertia::render('Role/Permissions', [
            "role" => $role,
        ]);
    }

    /**
     * Getting all users
     */
    public function getUsers(Request $request, $id)
    {
        $role = Role::with(["users.detail", "users.school"])->find($id);

        return Inertia::render('Role/Users', [
            "role" => $role,
        ]);
    }

    /**
     * Create roles
     */
    public function create()
    {
        $permissions = Permission::latest()->get();

        return Inertia::render('Role/Create', [
            "permissions" => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'required|array'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'web'
        ]);

        $role->syncPermissions($request->permissions);

        return response()->json([
            'success' => true,
            'message' => 'Rôle créé avec succès'
        ]);
    }

    public function edit($id)
    {
        $role = Role::with('permissions')->findOrFail($id);

        return response()->json([
            'role' => $role,
            'rolePermissions' => $role->permissions->pluck('name')
        ]);
    }

    /**
     * Actualisation 
     * des permissions d'un rôle
     */
    public function updatePermissions(Request $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas!");
            }
            DB::beginTransaction();

            /**
             * Permissions
             */
            $permissions = collect($request->permissions);
            if ($permissions->isEmpty()) {
                throw new Exception("Choississez au moins une permission");
            }

            $request->validate([
                'permissions' => 'required|array'
            ]);

            /**
             * Synchronisation des permissions
             */
            $role->syncPermissions($permissions->pluck("name"));

            DB::commit();
            return Redirect::route("role.index", ["id" => $role->id]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de d'exception", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    /**
     * Actualisation 
     * des users d'un rôle
     */
    public function updateUsers(Request $request, $id)
    {
        try {
            $role = Role::find($id);

            if (!$role) {
                throw new \Exception("Ce rôle n'existe pas!");
            }
            DB::beginTransaction();

            /**
             * Users
             */
            $users = collect($request->users);
            if ($users->isEmpty()) {
                throw new Exception("Choississez au moins un utilisateur");
            }

            $request->validate([
                'users' => 'required|array'
            ]);

            /**
             * Synchronisation des users
             */
            foreach (User::whereIn("id", [$users->pluck("id")])->get() as $user) {
                $user->syncRoles([$role->name]);
            }

            DB::commit();
            return Redirect::route("role.index", ["id" => $role->id]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            Log::debug("Erreure de validation", ["errors" => $e->errors()]);
            return back()->withErrors($e->errors());
        } catch (Exception $e) {
            DB::rollBack();
            Log::debug("Erreure de d'exception", ["exception" => $e->getMessage()]);
            return back()->withErrors(["exception" => $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        if ($role->name === 'super-admin') {
            return response()->json([
                'success' => false,
                'message' => 'Le rôle super-admin ne peut pas être supprimé'
            ], 403);
        }

        if ($role->users()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Ce rôle est attribué à des utilisateurs'
            ], 403);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rôle supprimé avec succès'
        ]);
    }
}
