<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Config;

Route::group(['prefix' => Config::get('awebooking.prefix_dashboard'), 'middleware' => ['authenticate', 'locale']], function () {
    Route::get('/optimize', 'OptimizeController@_optimize')->name('optimize');
    Route::post('/optimize', 'OptimizeController@_optimizePost')->name('optimize-post');
});
