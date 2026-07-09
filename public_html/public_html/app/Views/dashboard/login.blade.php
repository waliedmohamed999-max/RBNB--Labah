@include('dashboard.components.header')
<style>
    
    .digit-group input {
    width: 55px;
    height: 55px;
    border-radius: 13px;
    background-color: #ffffff;
    line-height: 50px;
    text-align: center;
    font-size: 24px;
    font-weight: 400;
    color: #3c3c3c;
    margin: 0 2px;
    border: 1px solid #e2e1e1;
    box-shadow: rgb(0 0 0 / 15%) 0px 1px 5px;
    /* border-radius: 0.65rem; */
}
</style>
<div class="account-pages login-page hh-dashboard mt-5 mb-5">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6 col-xl-5">
                <div class="card bg-pattern">
                    <div class="card-body p-4 hh-relative">
                        <form id="hh-login-form" class="form form-sm form-action" action="{{ url('auth/check') }}"
                              data-validation-id="form-login"
                              data-reload-time="1500"
                              method="post">
                            @include('common.loading')
                            <div class="text-center m-auto">
                                <a class="logo" href="{{ dashboard_url() }}">
                                    <?php
                                    $logo = get_option('dashboard_logo');
                                    $logo_url = get_attachment_url($logo);
                                    ?>
                                    <img src="{{ $logo_url }}" alt="{{get_attachment_alt($logo)}}">
                                </a>
                                <p class="text-muted mb-4 mt-3">{{__('Enter your mobile number to access dashboard.')}}</p>
                            </div>
                            <div class="form-group mb-3">
                                 <label for="email-login-form">{{__('Enter the mobile number')}}</label>
                                <input class="form-control has-validation" data-validation="required" type="text"
                                       id="email-login-form" name="mobileCheck" placeholder="{{__('The Phone is required')}}">

                                <!--<label for="email">{{__('Email address')}}</label>-->
                                <!--<input class="form-control has-validation" data-validation="required" type="text"-->
                                <!--       id="email" name="email" placeholder="{{__('Enter your email')}}">-->
                            </div>
                            <!--<div class="form-group mb-3">-->
                            <!--    <label for="password">{{__('Password')}}</label>-->
                            <!--    <input class="form-control has-validation" data-validation="required|min:6:ms"-->
                            <!--           type="password" id="password" name="password"-->
                            <!--           placeholder="{{__('Enter your password')}}">-->
                            <!--</div>-->
                            <!--<div class="form-group mb-3">-->
                            <!--    <div class="custom-control custom-checkbox">-->
                            <!--        <input type="checkbox" class="custom-control-input" id="checkbox-signin" checked>-->
                            <!--        <label class="custom-control-label"-->
                            <!--               for="checkbox-signin">{{__('Remember me')}}</label>-->
                            <!--    </div>-->
                            <!--</div>-->
                            <div class="form-group mb-0 text-center">
                                <button class="btn btn-primary btn-block text-uppercase"
                                        type="submit"> {{__('Log In')}}</button>
                            </div>
                            <div class="form-message">

                            </div>
                            @if(has_social_login())
                                <div class="text-center">
                                    <p class="mt-3 text-muted">{{__('Log in with')}}</p>
                                    <ul class="social-list list-inline mt-3 mb-0">
                                        @if(social_enable('facebook'))
                                            <li class="list-inline-item">
                                                <a href="{{ FacebookLogin::get_inst()->getLoginUrl() }}"
                                                   class="social-list-item border-primary text-primary"><i
                                                        class="mdi mdi-facebook"></i></a>
                                            </li>
                                        @endif
                                        @if(social_enable('google'))
                                            <li class="list-inline-item">
                                                <a href="{{ GoogleLogin::get_inst()->getLoginUrl() }}"
                                                   class="social-list-item border-danger text-danger"><i
                                                        class="mdi mdi-google"></i></a>
                                            </li>
                                        @endif
                                    </ul>
                                </div>
                            @endif
                        </form>
                    </div> <!-- end card-body -->
                </div>
                <!-- end card -->

                <div class="row mt-3">
                    <div class="col-12 text-center">
                        <!--<p><a href="{{ url('auth/reset-password') }}"-->
                        <!--      class="text-white ml-1">{{__('Forgot your password?')}}</a></p>-->
                        <div class="d-flex align-items-center justify-content-center">
                            <p class="text-white-50 mr-2">
                                {{__('Back to')}}
                                <a class="text-white mr-1" href="{{url('/')}}">{{__('Home')}}</a>
                            </p>
                            <!--<p class="text-white-50 ml-2">-->
                            <!--    {{__("Don't have an account?")}}-->
                            <!--    <a href="{{ url('auth/sign-up') }}" class="text-white ml-1"><b>{{__('Sign Up')}}</b></a>-->
                            <!--</p>-->
                        </div>


                    </div> <!-- end col -->
                </div>
                <!-- end row -->
            </div> <!-- end col -->
        </div>
        <!-- end row -->
    </div>
    <!-- end container -->
</div>
<!-- /.modal -->
    <div id="hh-fogot-password-modal" class="modal fade modal-no-footer" tabindex="-1" role="dialog"
         aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-uppercase" style="color: #5a409b;">{{__('Enter Code')}}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
                    </button>
                </div>
                 
                <div class="modal-body">
                     <label for="email-address-reset-pass-form" >{{__('sent a message to the number')}}<span id="SendMobile"> </span></label>
                    <form id="hh-reset-password-form" action="{{ url('auth/login') }}" method="post"
                          data-validation-id="form-reset-password"
                          data-reload-time="1500"
                          class="form form-action">
                        @include('common.loading')
                        <div class="form-group digit-group">
                          
                            <input class="form-control has-validation"  type="hidden"
                            id="email-address-reset-pass-form" name="mobile" >

                            <!--<input class="form-control h d code"  type="text" style="letter-spacing: 28px;border-radius: 25px;padding-right: 0.9rem;"-->
                            <!--  maxlength="4"      name="password" placeholder="{{__('code')}}">-->
                              <input type="text" id="digit-1" name="digit1" data-previous="digit-2" maxlength="1">
                                    <input type="text" id="digit-2" name="digit2" data-next="digit-1" data-previous="digit-3" maxlength="1" >
                                    <input type="text" id="digit-3" name="digit3" data-next="digit-2" data-previous="digit-4" maxlength="1">
                                    <input type="text" id="digit-4" name="digit4" data-next="digit-3" maxlength="1" >
                        </div>
                        <div class="form-group  text-center">
                            <button class="btn btn-primary btn-block text-uppercase code"
                                    type="submit"> {{__('check')}}</button>
                        </div>
                         <div class="form-group mb-0 text-center">
                               <div>{{__('If you check the verification code you can do')}} 
                               <span id="time" style="color: red;">02:00</span>
                               <button class="btn btn-primary btn-block text-uppercase resendcode" id="submitCode" style="display: none;    background: #f4f4f5;border-color: #dad9dd;color: #5a409b;"> {{__('Resend Code')}}</button>
                               </div>
                              
                                
                                
                                
                          
                        </div>
                        
                        <div class="form-message"></div>
                    </form>
                </div>
            </div>
        </div>
    </div><!-- /.modal -->
@include('dashboard.components.footer')
