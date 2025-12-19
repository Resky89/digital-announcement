<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            if ($e instanceof ValidationException) {
                return response()->json([
                    'status' => 'fail',
                    'code' => 422,
                    'message' => 'Validation error',
                    'errors' => $e->errors(),
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'status' => 'error',
                    'code' => 401,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            if ($e instanceof AuthorizationException) {
                return response()->json([
                    'status' => 'error',
                    'code' => 403,
                    'message' => 'Forbidden',
                ], 403);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'Not Found',
                ], 404);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'status' => 'error',
                    'code' => 405,
                    'message' => 'Method Not Allowed',
                ], 405);
            }

            if ($e instanceof HttpExceptionInterface) {
                $code = $e->getStatusCode();
                $message = $e->getMessage() ?: (\Symfony\Component\HttpFoundation\Response::$statusTexts[$code] ?? 'Error');
                return response()->json([
                    'status' => 'error',
                    'code' => $code,
                    'message' => $message,
                ], $code, $e->getHeaders());
            }

            return response()->json([
                'status' => 'error',
                'code' => 500,
                'message' => 'Server Error',
            ], 500);
        }

        return parent::render($request, $e);
    }
}
