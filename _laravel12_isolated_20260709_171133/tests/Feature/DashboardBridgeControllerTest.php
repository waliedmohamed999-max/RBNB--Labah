<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Sentinel;

class DashboardBridgeControllerTest extends TestCase
{
    use DatabaseTransactions;

    public function test_reviews_search_escapes_like_wildcards_and_returns_matching_rows(): void
    {
        $email = 'codex-review-' . uniqid('', true) . '@example.test';
        $user = Sentinel::registerAndActivate([
            'email' => $email,
            'password' => 'ChangeMe123!',
            'first_name' => 'Review',
            'last_name' => 'Owner',
            'mobile' => '9665' . random_int(10000000, 99999999),
        ]);
        Sentinel::login($user);

        $postId = DB::table('home')->insertGetId([
            'post_title' => 'Codex Test Home',
            'post_slug' => 'codex-test-home-' . uniqid(),
            'post_content' => '',
            'post_description' => '',
            'author' => $user->id,
            'created_at' => date('Y-m-d H:i:s'),
            'status' => 'publish',
            'use_external_link' => '',
            'text_external_link' => '',
            'video' => '',
        ]);

        DB::table('comments')->insert([
            'post_id' => $postId,
            'comment_title' => 'Codex wildcard review',
            'comment_content' => 'Literal 100%_safe review content',
            'comment_name' => 'Codex Reviewer',
            'comment_email' => 'reviewer@example.test',
            'comment_author' => $user->id,
            'comment_rate' => '5',
            'post_type' => 'home',
            'parent' => 0,
            'status' => 'approved',
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        $this->getJson('/bridge/v1/dashboard/reviews/home?_s=100%25_safe')
            ->assertOk()
            ->assertJsonPath('status', 1)
            ->assertJsonFragment([
                'content' => 'Literal 100%_safe review content',
            ]);
    }
}
