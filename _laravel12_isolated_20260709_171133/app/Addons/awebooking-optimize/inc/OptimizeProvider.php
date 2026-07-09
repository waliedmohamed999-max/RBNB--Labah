<?php

use Illuminate\Support\Facades\Route;

class OptimizeProvider
{
    public function __construct()
    {
        add_filter('extension_config_path', [$this, '_config_path']);
        add_filter('extension_route_web', [$this, '_route_path']);
        add_filter('extension_view_path', [$this, '_view_path']);
        add_action('awebooking_dashboard_menu_advanced', [$this, '_add_menu']);
        add_action('awebooking_page_title', [$this, '_page_title'], 10, 3);

        add_action('hh_register_scripts', [$this, '_enqueueScripts']);
    }


    public function _enqueueScripts($enqueue)
    {
        $enqueue->addStyle('optimize-css', OptimizeRegister::get_inst()->url . '/assets/css/style.css', false, false, 'dashboard');
        $enqueue->addScript('optimize-js', OptimizeRegister::get_inst()->url . '/assets/js/optimize.js', false, false, 'dashboard');
    }

    public function _page_title($title, $is_dashboard, $route_name)
    {
        if ($route_name == 'optimize') {
            $title = get_option('site_name', Config::get('app.name', 'Laravel App')) . '-' . get_option('site_description', 'Awesome Booking System');
            $title = awe_lang('Optimize') . '-' . $title;
        }

        return $title;
    }

    public function _add_menu()
    {
        echo '
            <li class=""><a href="' . e(dashboard_url('optimize')) . '">' . awe_lang('Optimize') . '</a></li>
        ';
    }

    public function _view_path($path)
    {
        $path['optimize'] = OptimizeRegister::get_inst()->path . '/views';

        return $path;
    }

    public function _route_path($path)
    {
        $path[] = OptimizeRegister::get_inst()->path . '/routes/web.php';
        return $path;
    }

    public function _config_path($path)
    {
        $path[] = OptimizeRegister::get_inst()->path . '/config/config.php';

        return $path;
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

OptimizeProvider::get_inst();
