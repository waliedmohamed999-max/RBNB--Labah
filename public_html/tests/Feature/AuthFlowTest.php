<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Sentinel;

class AuthFlowTest extends TestCase
{
    use DatabaseTransactions;

    public function test_session_login_succeeds_with_valid_email_credentials(): void
    {
        $email = 'codex-login-' . uniqid('', true) . '@example.test';
        Sentinel::registerAndActivate([
            'email' => $email,
            'password' => 'ChangeMe123!',
            'first_name' => 'Codex',
            'last_name' => 'Baseline',
            'mobile' => '9665' . random_int(10000000, 99999999),
        ]);

        $this->postJson('/bridge/v1/session/login', [
            'email' => $email,
            'password' => 'ChangeMe123!',
        ])
            ->assertOk()
            ->assertJsonPath('status', 1)
            ->assertJsonPath('data.email', $email);
    }

    public function test_session_login_rejects_invalid_email_credentials(): void
    {
        $this->postJson('/bridge/v1/session/login', [
            'email' => 'missing-user@example.test',
            'password' => 'wrong-password',
        ])
            ->assertStatus(422)
            ->assertJsonPath('status', 0);
    }
}
