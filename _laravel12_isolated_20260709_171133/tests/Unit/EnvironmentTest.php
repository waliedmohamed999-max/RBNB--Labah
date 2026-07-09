<?php

namespace Tests\Unit;

use Tests\TestCase;

class EnvironmentTest extends TestCase
{
    public function test_application_boots_in_testing_environment(): void
    {
        $this->assertSame('testing', app()->environment());
    }
}
