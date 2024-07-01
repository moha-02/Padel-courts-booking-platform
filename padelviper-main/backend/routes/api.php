<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ClubController;
use App\Http\Controllers\ParcialClubController;
use App\Http\Controllers\PistasController;
use App\Http\Controllers\PricePistaController;
use App\Http\Controllers\ReservationsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserStatsController;
use App\Http\Middleware\ValidateJsonApiheaders;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->name('login');

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

Route::get('/clubs', [ClubController::class, 'index'])->name('clubs.index');
Route::get('/clubs/{id}', [ClubController::class, 'show'])->name('clubs.show');
Route::middleware('auth:sanctum')->post('/club/store', [ClubController::class, 'store'])->withoutMiddleware(ValidateJsonApiheaders::class)->name('club.store');

Route::get('/pistas', [PistasController::class, 'index'])->name('pistas.index');
Route::get('/pistas/{id}', [PistasController::class, 'show'])->name('pistas.show');

Route::get('/pricepista', [PricePistaController::class, 'index'])->name('pricepista.index');
Route::get('/pricepista/{id}', [PricePistaController::class, 'show'])->name('pricepista.show');
Route::post('/pricepista/{id}/showprice', [PricePistaController::class, 'showPrice'])->name('pricepista.showPrice');


Route::middleware('auth:sanctum')->group(function () {
    // Pistas routes
    Route::post('/pista/store', [PistasController::class, 'store'])->name('pistas.store');

    // PricePista routes
    Route::post('/pricepista/store', [PricePistaController::class, 'store'])->name('pistas.store');
    Route::put('/pricepista/{id}/update', [PricePistaController::class, 'update'])->name('pricepista.update');
    Route::delete('/pricepista/delete/{pricepista}', [PricePistaController::class, 'destroy'])->name('pricepista.destroy');

    // Reservations routes
    Route::get('/reservations/myReservations/{user_id}', [ReservationsController::class, 'userReservations'])->name('reservations.userReservations');
    Route::delete('/reservations/delete/{user_id}/{reservation_id}', [ReservationsController::class, 'deleteReservationUser'])->name('reservations.deleteReservationUser');
    Route::post('/reservations/create', [ReservationsController::class, 'store'])->name('reservations.store');

    // User routes
    Route::put('/user/{id}/update', [UserController::class, 'update'])->name('user.update');
    Route::delete('/user/delete/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    Route::put('/user/{id}/updatenivel', [UserController::class, 'updateNivel'])->name('updateNivel.update');
    Route::put('/user/updateacces', [UserController::class, 'changeacces'])->name('user.changeacces');
    Route::get('/user/userlist', [UserController::class, 'index'])->name('user.index');

    // UserStats routes
    Route::get('/userstats/{id}', [UserStatsController::class, 'show'])->name('userstats.show');
    Route::put('/userstats/{id}/update', [UserStatsController::class, 'update'])->name('userstats.update');
    Route::post('/userstats/{id}/store', [UserStatsController::class, 'store'])->name('userstats.store');

    // Parcial Clubs endpoints
    // obtener todas los clubes parciales
    Route::get('/parcialsclubs', [ParcialClubController::class, 'index'])->name('parcialsclubs.index');
    // obtener un club parcial en especifico
    Route::get('/parcialclub/{id}', [ParcialClubController::class, 'show'])->name('parcialclub.show');
    // eliminar un club parcial
    Route::delete('/parcialclub/{id}/delete', [ParcialClubController::class, 'destroy'])->withoutMiddleware(ValidateJsonApiheaders::class)->name('parcialclub.destroy');
});

Route::post('/parcialclub/store', [ParcialClubController::class, 'store'])->withoutMiddleware(ValidateJsonApiheaders::class)->name('parcialclub.store');


Route::get('/reservations', [ReservationsController::class, 'index'])->name('reservations.index');
Route::get('/reservations/available', [ReservationsController::class, 'availableReservations'])->name('reservations.availableReservations');


