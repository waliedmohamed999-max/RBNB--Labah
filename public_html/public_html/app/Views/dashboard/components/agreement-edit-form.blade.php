<?php
enqueue_script('nice-select-js');
enqueue_style('nice-select-css');

enqueue_script('flatpickr-js');
enqueue_style('flatpickr-css');
// dd($user);
?>
<div class="form-group">
    <label for="user_email">{{__('Date')}}</label>
    <div class="form-control">
        {{ $Agreement->created_at }}
    </div>
</div>
<div class="row">
    <div class="col-12 col-sm-6">
        <div class="form-group">
            <label for="user_first_name">{{__('First Name')}} </label>
            <input type="text" class="form-control" id="user_first_name_edit" name="user_first_name"
                   value="{{ $user->first_name }}">
        </div>
    </div>
    <div class="col-12 col-sm-6">
        <div class="form-group">
            <label for="user_last_name">{{__('Last Name')}} </label>
            <input type="text" class="form-control" id="user_last_name_edit" name="user_last_name"
                   value="{{ $user->last_name }}">
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12 col-sm-6">
        <div class="form-group">
            <label for="user_role">{{__('status')}}</label>
                        <?php
                             $data = [
                                'ID' => $Agreement->id,
                                'userID' => $Agreement->user_id,
                            ];
                            
                       
                            ?>
                      
                            @if( $Agreement->status == "1") 
                            <button id="coupon_status" name="coupon_status" data-parent="div"
                            data-plugin="switchery"
                            style="background-color: red; border: red;"
                           data-color="#1abc9c" class="btn btn-info  hh-checkbox-action"
                            data-action="{{ dashboard_url('update-agreement-item') }}"
                            data-params="{{ base64_encode(json_encode($data)) }}"
                            >{{__('Cancelled the Approval')}}
                            @else
                            <button id="coupon_status" name="coupon_status" data-parent="div"
                            data-plugin="switchery"
                            style="background-color: forestgreen; border: forestgreen;"
                           data-color="#1abc9c" class="btn btn-info  hh-checkbox-action"
                            data-action="{{ dashboard_url('update-agreement-item') }}"
                            data-params="{{ base64_encode(json_encode($data)) }}"
                            data-value="1"
                            >{{__('Approval')}}
                      
                            </button>
                            
                               @endif
              
        </div>
    </div>

    <div class="row">
        <div class="col-12 col-sm-6">
            <div class="form-group">
                <label for="user_first_name">{{__('ID Number')}} </label>
                <input type="text" class="form-control" id="user_first_name_edit" name="ID_number"
                       value="{{ $Agreement->ID_number }}">
            </div>
        </div>

        <div class="col-12 col-sm-6 mt-4">
       
                <a href="{{ dashboard_url('agreement', $Agreement->user_id )}}"  target="_blank" class="btn btn-info waves-effect waves-light ">
                    {{ __('Show Contract') }}
                </a>
        </div>


   
    
</div>
<input type="hidden" name="userID" value="{{ $user->getUserId() }}">
<input type="hidden" name="userEncrypt" value="{{ hh_encrypt($user->getUserId()) }}">
