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
            @include('dashboard.components.breadcrumb', ['heading' => __('menu subscribers')])
            {{--Start Content--}}
            <div class="card-box card-list-post">
                <div class="header-area d-flex align-items-center">
                    <h4 class="header-title mb-0">{{__('menu subscribers')}}</h4>
                    <form class="form-inline right d-none d-sm-block" method="get">
                        <div class="form-group">
                            <?php
                            $search = request()->get('_s');
                            $order = request()->get('order', 'desc');
                            ?>
                            <input type="text" class="form-control" name="_s"
                                   value="{{ $search }}"
                                   placeholder="{{__('Search by id, title')}}">
                        </div>
                        <button type="submit" class="btn btn-default"><i class="ti-search"></i></button>
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

                <div class="action-toolbar">
                    <form class="hh-form form-inline" action="{{dashboard_url('experience-bulk-actions')}}"
                          data-target="#table-my-experience" method="post">
                        <select class="mr-1 min-w-100" name="action" data-plugin="customselect">
                            <option value="none">{{__('Bulk Actions')}}</option>
                            <option value="publish">{{__('Publish')}}</option>
                            <option value="pending">{{__('Pending')}}</option>
                            <option value="draft">{{__('Draft')}}</option>
                            <option value="trash">{{__('Trash')}}</option>
                            <option value="delete">{{__('Delete')}}</option>
                        </select>
                        <button type="submit" class="btn btn-success">{{__('Apply')}}</button>
                    </form>
                </div>
                <?php
                $tableColumns = [1, 2, 3, 4, 5];
                ?>

                <table id="table-my-experience" class="table table-large mb-0 dt-responsive nowrap w-100"
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
                        <th data-priority="-1" class="hh-checkbox-td">
                            <div class="checkbox checkbox-success hh-check-all d-none d-md-block">
                                <input id="hh-checkbox-all--my-experience" type="checkbox">
                                <label for="hh-checkbox-all--my-experience"><span
                                        class="d-none">{{__('Check All')}}</span></label>
                            </div>
                        </th>
                        <th data-priority="1">{{__('subscriber number')}}</th>
                        <th data-priority="1" class="force-show">
                            <a href="{{ $url }}" class="order">
                                <span class="exp">{{__('sub name')}}</span>
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
                        <!--<th data-priority="3">-->
                        <!--    <a href="{{ $url }}" class="order">-->
                        <!--        <span class="exp">{{__('Price')}}</span>-->
                        <!--        @if ($order == 'asc') <i class="icon-arrow-down"></i> @else <i-->
                        <!--            class="icon-arrow-up"></i> @endif-->
                        <!--    </a>-->
                        <!--</th>-->
                        <!--<th data-priority="4" class="text-center">-->
                        <!--    <div class="dropdown">-->
                        <!--        <a class="dropdown-toggle not-show-caret" id="dropdownFilterStatus"-->
                        <!--           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
                        <!--            <span class="exp">{{__('Status')}}</span>-->
                        <!--            <i class="icon-arrow-down"></i>-->
                        <!--        </a>-->
                        <!--        <div class="dropdown-menu" aria-labelledby="dropdownFilterStatus">-->
                        <!--            <a class="dropdown-item"-->
                        <!--               href="{{ remove_query_arg('status') }}">{{__('All')}}</a>-->
                                    <?php
                                    $status = service_status_info();
                                    foreach ($status as $key => $_status) {
                                    $url = add_query_arg('status', $key);
                                    ?>
                        <!--            <a class="dropdown-item"-->
                        <!--               href="{{ $url }}">{{ __($_status['name']) }}</a>-->
                                    <?php } ?>
                        <!--        </div>-->
                        <!--    </div>-->
                        <!--</th>-->
                           <th data-priority="4"><span class="exp">{{__('owner name')}}</span></th>
                        <th data-priority="5" class="text-center"><span class="exp">{{__('count vote')}}</span></th>
                        <th data-priority="6"><span class="exp">{{__('Type')}}</span></th>
                        <th data-priority="-1" class="text-center">{{__('Actions')}}</th>
                    </tr>
                    </thead>
                    <tbody>
                 
                        @foreach ($allExperiences as $key => $item)
                            <?php
                            $experienceID =  $item->id;
                            $thumbnail_id = get_experience_thumbnail_id($experienceID);
                            $thumbnail = get_attachment_url($item->image, [75, 75]);
                            $experienceType =  $item->experience->experience_type;
                            $term = get_term_by('term_id', $experienceType);
                            ?>
                            
                            <tr>
                                <td class="align-middle hh-checkbox-td">
                                    <div class="checkbox checkbox-success d-none d-md-block">
                                        <input type="checkbox" name="post_id" value="{{ $item->experience->post_id}}"
                                               id="hh-check-all-item-{{ $item->experience->post_id}}" class="hh-check-all-item">
                                        <label for="hh-check-all-item-{{ $item->experience->post_id}}"></label>
                                    </div>
                                </td>
                                <td class="align-middle force-show">{{ $key + 1 }}</td>
                                <td class="align-middle force-show">
                                    <div class="media align-items-center">
                                        <img src="{{ $thumbnail }}" class="d-none d-md-block mr-3"
                                             alt="">
                                        <div class="media-body">
                                            <h5 class="title-overflow m-0">
                                                <a class="text"
                                                   href="{{ get_experience_permalink($experienceID,  $item->experience->post_slug) }}"
                                                   target="_blank">{{ get_translate( $item->name ) }}</a>
                                                <span
                                                    class="text-muted d-none d-md-inline-block"> - {{ $experienceID }}</span>
                                            </h5>
                                            <span
                                                class="exp d-none">[{{ $experienceID }}] {{ get_translate( $item->experience->post_title) }}</span>
                                            <!--<div class="quick-action-links d-none d-md-block">-->
                                            <!--    <a class="quick-link-item" target="_blank"-->
                                            <!--       href="{{ dashboard_url('edit-experience', $experienceID) }}">{{__('Edit')}}</a>-->
                                            <!--    @if( $item->experience->status != 'trash')-->
                                                    <?php
                                                    $data = [
                                                        'serviceID' => $experienceID,
                                                        'serviceEncrypt' => hh_encrypt($experienceID),
                                                        'serviceType' => 'experience',
                                                        'status' => 'trash'
                                                    ];
                                                    ?>
                                            <!--        <a class="quick-link-item quick-link-item-trash hh-link-action hh-link-change-status-experience"-->
                                            <!--           data-action="{{ dashboard_url('change-status-experience') }}"-->
                                            <!--           data-parent="tr"-->
                                            <!--           data-is-delete="false"-->
                                            <!--           data-params="{{ base64_encode(json_encode($data)) }}"-->
                                            <!--           href="javascript: void(0)">{{ __('Trash') }}</a>-->
                                            <!--        @if( $item->experience->status == 'publish')-->
                                            <!--            <a class="quick-link-item"-->
                                            <!--               href="{{ get_experience_permalink($experienceID,  $item->experience->post_slug) }}"-->
                                            <!--               target="_blank">{{ __('View') }}</a>-->

                                            <!--            <a class="quick-link-item" href="javascript:void(0)"-->
                                            <!--               data-params="{{ base64_encode(json_encode($data)) }}"-->
                                            <!--               data-toggle="modal" data-target="#hh-get-qrcode-modal">-->
                                            <!--                {{ __('QR Code') }}-->
                                            <!--            </a>-->
                                            <!--        @endif-->
                                            <!--    @endif-->
                                            <!--</div>-->
                                        </div>
                                    </div>
                                </td>
                                <!--<td class="align-middle">-->
                                <!--    <span class="exp">{{ convert_price( $item->experience->base_price) }}</span>-->
                                <!--</td>-->
                                <!--<td class="align-middle text-center">-->
                                <!--    <div class="service-status {{  $item->experience->status }} status-icon"-->
                                <!--         data-toggle="tooltip" data-placement="right" title=""-->
                                <!--         data-original-title="{{ service_status_info( $item->experience->status)['name'] }}"><span-->
                                <!--            class="exp d-none">{{ service_status_info( $item->experience->status)['name'] }}</span>-->
                                <!--    </div>-->
                                <!--</td>-->
                                <td class="align-middle text-center">
                                    <span class="exp">{{  $item->user->first_name}} {{  $item->user->last_name}}</span>
                                </td>
                                <td class="align-middle text-center">
                                    <span class="exp">{{  $item->count_vote}}</span>
                                </td>
                                <td class="align-middle">
                                    <span class="exp">@if($term) {{ get_translate($term->term_title) }} @endif</span>
                                </td>
                                <td class="align-middle text-center">
                                    <div class="dropdown dropleft">
                                        <?php
                                        $data = [
                                            'serviceID' => $experienceID,
                                            'serviceEncrypt' => hh_encrypt($experienceID),
                                            'serviceType' => 'experience'
                                        ];
                                        ?>
                                        <a href="javascript: void(0)" class="dropdown-toggle table-action-link"
                                           data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i
                                                class="ti-settings"></i></a>
                                        <div class="dropdown-menu">
                                           
                                            <?php
                                            $service_status_info = service_status_info();
                                            ?>
                                        
                                            <a  type="button" class="dropdown-item addSub"  data-toggle="modal" data-experience_id="{{   $item->experienceID }}" data-id="{{   $item->id }}">
                                                {{__('add link')}}</a>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
               
                    </tbody>
                </table>
                
            </div>

            <div class="modal fade" id="vote" tabindex="-1" aria-labelledby="voteLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <form action="{{ url('participantsLink') }}" data-google-captcha="yes"
                    data-validation-id="form-enquiry" class="form-action form-sm has-reset"
                    data-loading-from=".form-body">
                
                    <div class="modal-header">
                      <h5 class="modal-title" id="voteLabel">{{__('event')}}</h5>
                      <button type="button" class="btn-close close closeModal" data-bs-dismiss="modal" aria-label="Close"> <i class="ti-close"></i></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            
                            <input type="hidden" name="experienceID" id="experienceID" value="">
                            <input type="hidden" name="id" id="id" value="">
                            <label for="email-enquiry-form">{{ __('link youtub') }} <span
                                    class="text-danger">*</span></label>
                            <input id="link" type="text" name="link"
                                class="form-control has-validation" >
                        </div>
                        
                          <div class="form-group">
                     
                            <label for="email-enquiry-form">{{ __('Sub name') }} <span
                                    class="text-danger">*</span></label>
                            <input  type="text" name="name" id="name"
                                class="form-control has-validation" data-validation="required|name">
                        </div>
                        <div class="form-group">
                            <label for="email-enquiry-form">{{ __('Sub age') }} <span
                                    class="text-danger">*</span></label>
                            <input  type="text" name="age" id="age"
                                class="form-control has-validation" data-validation="required|age">
                        </div>
                        <div class="form-group">
                            <label for="email-enquiry-form">{{ __('Sub type') }} <span
                                    class="text-danger">*</span></label>
                            <input  type="text" name="type" id="type"
                                class="form-control has-validation" data-validation="required|type">
                        </div>
                        <div class="form-group">
                            <label for="email-enquiry-form">{{ __('Sub image') }} <span
                                    class="text-danger">*</span></label>
                          
                                
                                     <input name="image" id="file" type="file" class="form-control has-validation"
                        data-behaviour="custom-upload-input" value="" onchange="readURL(this);" />
                    <img id="blah" width=" 30%">
                    
                    
                        </div>
                   </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary closeModal" data-bs-dismiss="modal">Close</button>
                      <button type="submit" class="btn btn-primary">Save changes</button>
                    </div>
                </form>
                  </div>
                </div>
              </div>

            @include('dashboard.components.qr-modal')
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>
@include('dashboard.components.footer')
