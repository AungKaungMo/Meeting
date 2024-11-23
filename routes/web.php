<?php

use App\Http\Controllers\Auth\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web\v1\CompanyController;
use App\Http\Controllers\Web\v1\DepartmentController;
use App\Http\Controllers\Web\v1\EmployeeController;
use App\Http\Controllers\Web\v1\MeetingInvitationController;
use App\Http\Controllers\Web\v1\MeetingRoomLocationController;
use App\Http\Controllers\Web\v1\PackageController;
use App\Http\Controllers\Web\v1\RegionAndStateController;
use App\Http\Controllers\Web\v1\TownshipController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::redirect('/', '/company/login');
// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    //USER
    Route::resource('/users', UserController::class);

    //PACKAGE
    Route::resource('/packages', PackageController::class);

    //REGION & STATE
    Route::resource('/region-states', RegionAndStateController::class);

    //TOWNSHIP
    Route::resource('/townships', TownshipController::class);

    //COMPANY
    Route::resource('/companies', CompanyController::class);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


//COMPANY
Route::get('/company/login', [CompanyController::class, 'showLoginForm'])->name('company.loginForm');
Route::post('/company/login', [CompanyController::class, 'login'])->name('company.login');

Route::middleware(['auth:company'])->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))->name('dashboard');

    Route::resource('/departments', DepartmentController::class);
    Route::post('/departments/import', [DepartmentController::class, 'importDepartments']);

    Route::resource('/room-locations', MeetingRoomLocationController::class);

    Route::resource('/employees', EmployeeController::class);
    Route::post('/employees/import', [EmployeeController::class, 'importEmployees']);

    //MEETING INVITATION
    Route::resource('/meeting-invitations', MeetingInvitationController::class);

    //MEETING MINUTE
    Route::resource('/meeting-minutes', MeetingInvitationController::class);
});

//EMPLOYEE
Route::get('/employee/login', [EmployeeController::class, 'showLoginForm'])->name('employee.loginForm');
Route::post('/employee/login', [EmployeeController::class, 'login'])->name('employee.login');

Route::get('/employee/change-password', [EmployeeController::class, 'showChangePasswordForm'])->name('employee.changePasswordForm');
Route::post('/employee/change-password', [EmployeeController::class, 'changePassword'])->name('employee.changePassword');
// Route::middleware(['auth:employee'])->group(function () {

// });

Route::fallback(function () {
    return Inertia::render('PageNotFound');
});


require __DIR__ . '/auth.php';
