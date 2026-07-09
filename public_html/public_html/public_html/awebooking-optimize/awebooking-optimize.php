<?php
/*
 * Name: Optimize Tool
 * Slug: awebooking-optimize
 * Description: Clean up expired availability
 * Author: Salim Mlare
 * Version: 1.2
 * Tags: system-tools
 */

use Illuminate\Foundation\Application;

class OptimizeRegister
{
    public $path;
    public $url;

    public function __construct()
    {
        $this->path = dirname(__FILE__);
        $this->url = asset('addons/' . basename(__DIR__));

        require_once 'inc/OptimizeProvider.php';

        require_once 'inc/OptimizeController.php';

    }

    public static function get_inst()
    {
        static $instance;
        if (is_null($instance)) {
            $instance = new self();
        }

        return $instance;
    }
}

OptimizeRegister::get_inst();
