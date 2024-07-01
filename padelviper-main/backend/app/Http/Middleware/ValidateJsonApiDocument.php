<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateJsonApiDocument
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('POST') || $request->isMethod('PUT')) {
            $request->validate([
                'data' => ['required', 'array'],
                'data.type' => ['required', 'string'],
                'data.attributes' => ['required', 'array'],
            ]);
        }
        
        return $next($request);
    }

}
