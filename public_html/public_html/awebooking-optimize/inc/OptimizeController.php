<?php

namespace App\Addons;

use App\Http\Controllers\Controller;
use App\Models\HomeAvailability;
use App\Models\Post;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;

class OptimizeController extends Controller
{

    public function _optimizePost(Request $request)
    {
        $action = request()->get('action');
        if (!empty($action) && is_array($action)) {
            foreach ($action as $_action) {
                if (method_exists($this, $_action)) {
                    $this->$_action();
                }
            }
            return $this->sendJson([
                'status' => 1,
                'text' => __('Done'),
            ]);
        } else {
            return $this->sendJson([
                'status' => 0,
                'text' => __('Clean'),
                'message' => __('Nothing to clean')
            ]);
        }
    }

    public function delete_home_availability()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));
        $deleted = DB::table('home_price')->where('end_time', '<=', $time)->delete();
        return $deleted;
    }

    public function delete_experience_availability()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));
        $deleted = DB::table('experience_price')->where('end_date', '<=', $time)->delete();
        return $deleted;
    }

    public function delete_notification()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));
        $deleted = DB::table('notification')->where('created_at', '<=', $time)->delete();
        return $deleted;
    }

    public function delete_trash_item()
    {
        DB::table('post')->whereIn('status', ['trash', 'revision'])->delete();
        DB::table('page')->whereIn('status', ['trash', 'revision'])->delete();
        DB::table('home_availability')->join('home', 'home_availability.home_id', '=', 'home.post_id')->where('status', 'trash')->delete();
        DB::table('home')->whereIn('status', ['trash', 'revision'])->delete();
        DB::table('experience_availability')->join('experience', 'experience_availability.experience_id', '=', 'experience.post_id')->where('experience.status', 'trash')->delete();
        DB::table('experience')->whereIn('status', ['trash', 'revision'])->delete();
        DB::table('car')->whereIn('status', ['trash', 'revision'])->delete();
    }

    public function _count_notifications()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));
        $count = DB::table('notification')->where('created_at', '<=', $time)->get()->count();

        return $count;
    }

    public function _count_trash_items()
    {
        $count_post = DB::table('post')->where('status', 'trash')->get()->count() + DB::table('post')->where('status', 'revision')->get()->count();
        $count_page = DB::table('page')->where('status', 'trash')->get()->count() + DB::table('page')->where('status', 'revision')->get()->count();
        $count_home = DB::table('home')->where('status', 'trash')->get()->count() + DB::table('home')->where('status', 'revision')->get()->count();
        $count_experience = DB::table('experience')->where('status', 'trash')->get()->count() + DB::table('experience')->where('status', 'revision')->get()->count();
        $count_car = DB::table('car')->where('status', 'trash')->get()->count() + DB::table('car')->where('status', 'revision')->get()->count();

        return $count_post + $count_page + $count_home + $count_experience + $count_car;
    }

    public function _count_temp_data_items()
    {
        $services = get_posttypes(true, true, true);

        $count = 0;

        foreach ($services as $service_key => $service_name) {
            $result = DB::table('term_relation')->selectRaw('count(term_id) as count')->where('post_type', $service_key)->whereRaw("service_id NOT IN (select post_id from {$service_key})")->get()->first();
            $count += is_object($result) ? (int)$result->count : 0;
        }

        return $count;
    }

    public function delete_temp_data()
    {
        $services = get_posttypes(true, true, true);

        foreach ($services as $service_key => $service_name) {
            DB::table('term_relation')->where('post_type', $service_key)->whereRaw("service_id NOT IN (select post_id from {$service_key})")->delete();

            DB::statement("DELETE t1 FROM term_relation t1 INNER JOIN term_relation t2  WHERE  t1.ID < t2.ID AND t1.term_id =  t2.term_id AND  t1.service_id = t2.service_id AND t1.post_type = '{$service_key}'");
        }
    }

    public function _count_home_availability()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));

        $count = DB::table('home_price')->where('end_time', '<=', $time)->get()->count();

        return (int)$count;

    }

    public function _count_experience_availability()
    {
        $time = strtotime(date('Y-m-d', strtotime('-1 day')));

        $count = DB::table('experience_price')->where('end_date', '<=', $time)->get()->count();

        return (int)$count;

    }

    public function _optimize(Request $request)
    {
        return view('optimize::optimize');
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

OptimizeController::get_inst();
