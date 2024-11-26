<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\FilterSortPaginate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    use FilterSortPaginate;

    public function index(Request $request)
    {
        try {
            $query = User::query();
            $query = $query->select('id', 'name', 'email', 'profile_image_url');

            $filterableFields = ['name', 'email'];

            $users = $this->filterSortPaginate($query, $request, $filterableFields);

            return Inertia::render('Adminstration/User/UserList', [
                'users' => $users,
                'sort' => $request->input('sort'),
                'direction' => $request->input('direction'),
                'filter' => $request->input('filterName'),
            ]);
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'photo' => 'nullable|image|max:2048',
        ]);

        $path = null;

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('photos', 'public');
        }

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'profile_image_url' => $path,
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        try {

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,'.$id,
            ]);

            $path = null;

            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('photos', 'public');
            }

            $user = User::findOrFail($id);

            if ($user) {

                if ($request->changeImage && $user->profile_image_url) {
                    Storage::disk('public')->delete($user->profile_image_url);
                }

                $photoPath = $request->changeImage && ! $request->hasFile('photo') ? null : ($path ?? $user->profile_image_url);

                $user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                    'profile_image_url' => $photoPath,
                ]);
            }

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            dd($e->errors());
        }
    }

    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            if ($user) {
                $user->delete();
            }

            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        } catch (\Throwable $th) {
            dd($th->getMessage());
        }
    }
}
