<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::guard('api')->user();
        $adminEmail = strtolower(env('ADMIN_EMAIL', 'admin@example.com'));
        if (!$user || strtolower((string) $user->email) !== $adminEmail) {
            return response()->json(['message' => 'Forbidden'], 403);
        }
        return $next($request);
    }
}
