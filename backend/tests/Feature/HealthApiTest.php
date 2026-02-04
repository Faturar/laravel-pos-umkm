<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthApiTest extends TestCase
{
    /** @test */
    public function it_can_get_health_status()
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'status',
                    'timestamp',
                    'version',
                    'database',
                    'storage',
                ]
            ])
            ->assertJson([
                'success' => true,
                'message' => 'System is healthy',
                'data' => [
                    'status' => 'ok',
                ]
            ]);
    }
}