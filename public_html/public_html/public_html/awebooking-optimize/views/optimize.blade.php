@include('dashboard.components.header')
<?php
enqueue_style('optimize-css');
enqueue_script('optimize-js');
?>
<div id="wrapper">
    @include('dashboard.components.top-bar')
    @include('dashboard.components.nav')
    <div class="content-page">
        <div class="content mt-2">
            {{--Start Content--}}
            <div class="card-box">
                <div class="header-area">
                    <h4 class="header-title">{{__('Optimize Tool')}}</h4>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="optimize-container">
                            <form action="{{dashboard_url('optimize')}}" class="form form-optimize" method="post">
                                <h4 class="heading">{{__('Optimize Tool')}}</h4>
                                <div class="row">
                                    <div class="col-left col-12 col-md-7 order-md-2">
                                        <button type="submit" class="optimize-button"
                                                data-text-run="{{__('Cleaning')}}">{{__('Clean')}}</button>
                                    </div>
                                    <div class="col-right col-12 col-md-5 order-md-1">
                                        <div class="optimize-item">
                                            <div class="checkbox">
                                                <?php
                                                $count_home = \App\Addons\OptimizeController::get_inst()->_count_home_availability();
                                                ?>
                                                <input id="delete_home_availability" type="checkbox"
                                                       <?php if ($count_home) echo 'checked'; else echo 'disabled'; ?>
                                                       name="action[]" value="delete_home_availability">
                                                <label
                                                    for="delete_home_availability">{{__('Home Price Expired')}}
                                                    <span class="count <?php if ($count_home) echo 'has-item'; ?>">
                                                        <?php
                                                        if ($count_home) {
                                                            echo e($count_home);
                                                        } else {
                                                            echo '<i class="ti-check"></i>';
                                                        }
                                                        ?>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="optimize-item">
                                            <div class="checkbox">
                                                <?php
                                                $count_experience = \App\Addons\OptimizeController::get_inst()->_count_experience_availability();
                                                ?>
                                                <input id="delete_experience_availability" type="checkbox"
                                                       <?php if ($count_experience) echo 'checked'; else echo 'disabled'; ?>
                                                       name="action[]" value="delete_experience_availability">
                                                <label
                                                    for="delete_experience_availability">
                                                    {{__('Experience Price Expired')}}
                                                    <span class="count <?php if ($count_experience) echo 'has-item'; ?>">
                                                        <?php
                                                        if ($count_experience) {
                                                            echo e($count_experience);
                                                        } else {
                                                            echo '<i class="ti-check"></i>';
                                                        }
                                                        ?>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="optimize-item">
                                            <div class="checkbox">
                                                <?php
                                                $count_temp_data = \App\Addons\OptimizeController::get_inst()->_count_temp_data_items();
                                                ?>
                                                <input id="delete_temp_data" type="checkbox"
                                                       <?php if ($count_temp_data) echo 'checked'; else echo 'disabled'; ?>
                                                       name="action[]" value="delete_temp_data">
                                                <label
                                                        for="delete_temp_data">
                                                    {{__('Temp Data')}}
                                                    <span class="count <?php if ($count_temp_data) echo 'has-item'; ?>">
                                                        <?php
                                                        if ($count_temp_data) {
                                                            echo e($count_temp_data);
                                                        } else {
                                                            echo '<i class="ti-check"></i>';
                                                        }
                                                        ?>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="optimize-item">
                                            <div class="checkbox">
                                                <?php
                                                $count_trash = \App\Addons\OptimizeController::get_inst()->_count_trash_items();
                                                ?>
                                                <input id="delete_trash_item" type="checkbox"
                                                       <?php if ($count_trash) echo 'checked'; else echo 'disabled'; ?>
                                                       name="action[]" value="delete_trash_item">
                                                <label
                                                    for="delete_trash_item">
                                                    {{__('Trash Items')}}
                                                    <span class="count <?php if ($count_trash) echo 'has-item'; ?>">
                                                        <?php
                                                        if ($count_trash) {
                                                            echo e($count_trash);
                                                        } else {
                                                            echo '<i class="ti-check"></i>';
                                                        }
                                                        ?>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="optimize-item">
                                            <div class="checkbox">
                                                <?php
                                                $count_notifications = \App\Addons\OptimizeController::get_inst()->_count_notifications();
                                                ?>
                                                <input id="delete_notification" type="checkbox"
                                                       <?php if ($count_notifications) echo 'checked'; else echo 'disabled'; ?>
                                                       name="action[]" value="delete_notification">
                                                <label
                                                    for="delete_notification">
                                                    {{__('Old Notifications')}}
                                                    <span class="count <?php if ($count_notifications) echo 'has-item'; ?>">
                                                        <?php
                                                        if ($count_notifications) {
                                                            echo e($count_notifications);
                                                        } else {
                                                            echo '<i class="ti-check"></i>';
                                                        }
                                                        ?>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="optimize-footer">
                                    {{__('Clean up expired availability, revision items, temp data ...')}}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>
@include('dashboard.components.footer')
