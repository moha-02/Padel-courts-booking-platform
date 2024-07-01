<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            //\App\Http\Middleware\ValidateJsonApiDocument::class,
            \App\Http\Middleware\ValidateJsonApiheaders::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            '*/api/login/',
            '*/api/register/',
            '*/api/pricepista/',
            '*/api/pistas/'

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        \App\Http\Responses\JsonApiValidationErrorResponse::class;
    })->create();
