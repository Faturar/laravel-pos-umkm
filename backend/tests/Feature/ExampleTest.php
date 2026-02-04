<?php

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

test('the application returns a successful response', function () {
    $response = $this->getJson('/health');

    $response->assertStatus(200);
});