<?php

namespace Tests\Feature;

use Tests\TestCase;

class PublicRoutesTest extends TestCase
{
    public function test_home_route_returns_success(): void
    {
        $this->get('/')->assertOk();
    }

    public function test_legacy_login_page_returns_success(): void
    {
        $this->get('/auth/login')->assertOk();
    }

    public function test_partner_dashboard_login_is_served_by_premium_frontend_bridge(): void
    {
        $response = $this->get('/premium/partner-dashboard/login');

        $response->assertRedirect();
        $this->assertStringContainsString('/partner-dashboard/login', $response->headers->get('Location'));
    }
}
