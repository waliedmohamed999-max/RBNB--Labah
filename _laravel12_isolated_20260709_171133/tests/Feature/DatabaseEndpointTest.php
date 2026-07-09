<?php

namespace Tests\Feature;

use Tests\TestCase;

class DatabaseEndpointTest extends TestCase
{
    public function test_products_endpoint_returns_database_backed_payload(): void
    {
        $this->getJson('/bridge/v1/products?type=home')
            ->assertOk()
            ->assertJsonPath('status', 1)
            ->assertJsonStructure([
                'status',
                'data',
            ]);
    }
}
