@include('dashboard.components.header')
<?php
enqueue_style('confirm-css');
enqueue_script('confirm-js');
?>

<div id="wrapper">
    @include('dashboard.components.top-bar')
    @include('dashboard.components.nav')
    <div class="content-page">
        <div class="content">
            @include('dashboard.components.breadcrumb', ['heading' => __('My Favourite '.$type)])
            {{--Start Content--}}
            <div class="card-box card-list-post">
                <div class="header-area d-flex align-items-center">
                    <h4 class="header-title mb-0">{{__('All Homes')}}</h4>
                    <form class="form-inline right d-none d-sm-block" method="get">
                        <div class="form-group">
                            <?php
                            $search = request()->get('_s');
                            $order = request()->get('order', 'desc');
                            ?>
                            <!--<input type="text" class="form-control" name="_s"-->
                            <!--       value="{{ $search }}"-->
                            <!--       placeholder="{{__('Search by id, title')}}">-->
                        </div>
                        <!--<button type="submit" class="btn btn-default"><i class="ti-search"></i></button>-->
                    </form>
                </div>
                <?php
                enqueue_style('datatables-css');
                enqueue_script('datatables-js');
                enqueue_script('pdfmake-js');
                enqueue_script('vfs-fonts-js');
                enqueue_script('nice-select-js');
                enqueue_style('nice-select-css');
                ?>
                <!--<div class="action-toolbar">-->
                <!--    <form class="hh-form form-inline" action="{{dashboard_url('home-bulk-actions')}}"-->
                <!--          data-target="#table-my-home" method="post">-->
                <!--        <select class="mr-1 min-w-100" name="action" data-plugin="customselect">-->
                <!--            <option value="none">{{__('Bulk Actions')}}</option>-->
                <!--            <option value="publish">{{__('Publish')}}</option>-->
                <!--            <option value="pending">{{__('Pending')}}</option>-->
                <!--            <option value="draft">{{__('Draft')}}</option>-->
                <!--            <option value="trash">{{__('Trash')}}</option>-->
                <!--            <option value="delete">{{__('Delete')}}</option>-->
                <!--        </select>-->
                <!--        <button type="submit" class="btn btn-success">{{__('Apply')}}</button>-->
                <!--    </form>-->
                <!--</div>-->

                <?php
                $tableColumns = [1, 2, 3, 4, 5];
                ?>

                <table id="table-my-home" class="table table-large mb-0 dt-responsive nowrap w-100"
                       data-plugin="datatable"
                       data-paging="false"
                       data-export="on"
                       data-csv-name="{{__('Export to CSV')}}"
                       data-pdf-name="{{__('Export to PDF')}}"
                       data-cols="{{ base64_encode(json_encode($tableColumns)) }}"
                       data-ordering="false">
                    <thead>
                    <tr>
                        <?php
                        $_order = ($order == 'asc') ? 'desc' : 'asc';
                        $url = add_query_arg([
                            'orderby' => 'post_title',
                            'order' => $_order
                        ]);
                        ?>

                       
                        <th data-priority="1" class="force-show">
                            <a href="{{ $url }}" class="order">
                                <span class="exp">{{__('Name')}}</span>
                                @if($order == 'asc') <i class="icon-arrow-down"></i> @else <i
                                    class="icon-arrow-up"></i> @endif
                            </a>
                        </th>
                        <?php
                        $_order = ($order == 'asc') ? 'desc' : 'asc';
                        $url = add_query_arg([
                            'orderby' => 'base_price',
                            'order' => $_order
                        ]);
                        ?>
                        <th data-priority="3">
                            <a href="{{ $url }}" class="order">
                                <span class="exp">{{__('Price')}}</span>
                                @if ($order == 'asc') <i class="icon-arrow-down"></i> @else <i
                                    class="icon-arrow-up"></i> @endif
                            </a>
                        </th>
                      
                        <th data-priority="6"><span class="exp">{{__('Home Type')}}</span></th>
                       
                    </tr>
                    </thead>
                    <tbody>
                    @if ($allHomes['total'])
                        @foreach ($allHomes['results'] as $item)
                            <?php
                            $homeID = $item->post_id;
                            $thumbnail_id = get_home_thumbnail_id($homeID);
                            $thumbnail = get_attachment_url($thumbnail_id, [75, 75]);
                            $homeType = $type=="home"?$item->home_type:$item->experience_type;
                            $term = get_term_by('term_id', $homeType);
                            ?>
                            <tr>
                                
                                <td class="align-middle force-show">
                                    <div class="media align-items-center">
                                        <img src="{{ $thumbnail }}" class="d-none d-md-block mr-3"
                                             alt="{{ get_attachment_alt($thumbnail_id) }}">
                                        <div class="media-body">
                                            <h5 class="m-0 title-overflow">
                                                <a class="text"
                                                   href="{{ get_home_permalink($homeID, $item->post_slug) }}"
                                                   target="_blank">{{ get_translate($item->post_title) }}</a>
                                                <span
                                                    class="d-none d-md-inline-block text-muted"> - {{ $homeID }}</span>
                                            </h5>
                                            <span
                                                class="exp d-none">[{{ $homeID }}] {{ get_translate($item->post_title) }}</span>
                                           
                                        </div>
                                    </div>
                                </td>
                                <td class="align-middle">
                                    <span class="exp">{{ convert_price($item->base_price) }}</span>
                                </td>
                              
                                
                                <td class="align-middle">
                                    <span class="exp">@if($term) {{ get_translate($term->term_title) }} @endif</span>
                                </td>
                            </tr>
                        @endforeach
                    @else
                        <tr>
                            <td class="d-none"></td>
                            <td class="d-none"></td>
                            <td class="d-none"></td>
                            <td class="d-none"></td>
                            <td class="d-none"></td>
                            <td class="d-none"></td>
                            <td colspan="7">
                                <h4 class="mt-3 text-center">{{__('No home yet.')}}</h4>
                            </td>
                        </tr>
                    @endif
                    </tbody>
                </table>
                  
                <div class="clearfix mt-2">
                    {{ dashboard_pagination(['total' => $allHomes['total']]) }}
                </div>
            </div>
            @include('dashboard.components.qr-modal')
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>
@include('dashboard.components.footer')
