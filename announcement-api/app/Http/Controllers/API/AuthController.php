<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $token = Auth::guard('api')->login($user);

        return response()->json([
            'message' => 'Registered',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!$accessToken = Auth::guard('api')->attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::guard('api')->user();

        // Only allow admin to login (no role usage). Admin identified by email in env.
        $adminEmail = strtolower(env('ADMIN_EMAIL', 'admin@example.com'));
        if (strtolower((string) $user->email) !== $adminEmail) {
            Auth::guard('api')->logout();
            return response()->json(['message' => 'Only admin can login'], 403);
        }

        $refreshTtl = (int) config('jwt.refresh_ttl');
        JWTAuth::factory()->setTTL($refreshTtl);
        $refreshToken = JWTAuth::claims(['typ' => 'refresh'])->fromUser($user);
        JWTAuth::factory()->setTTL((int) config('jwt.ttl'));

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'csrf_token' => Str::random(40),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json(Auth::guard('api')->user());
    }

    public function logout()
    {
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function refresh(Request $request)
    {
        $token = JWTAuth::getToken();
        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        $payload = JWTAuth::getPayload($token);
        if ($payload->get('typ') !== 'refresh') {
            return response()->json(['message' => 'Invalid token type'], 401);
        }

        $user = JWTAuth::authenticate($token);
        $newAccess = JWTAuth::fromUser($user);

        return response()->json([
            'access_token' => $newAccess,
            'csrf_token' => Str::random(40),
        ]);
    }
}
