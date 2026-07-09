<?php
$logo_footer = get_option('footer_logo');
if (empty($logo_footer)) {
    $logo_footer = get_option('logo');
}
$list_social = get_option('list_social');
$screen = current_screen();
$setup_mailc_api = get_option('mailchimp_api_key');
$setup_mailc_list_id = get_option('mailchimp_list');
enqueue_script('nice-select-js');
enqueue_style('nice-select-css');

?>
</div>
<style>
    .ifot{ color: #37abae; padding: 6px;}
  #footer .footer-title { color: #37abae;}
  
@media only screen and (min-width: 768px){

    .sta{max-width:70%;}
.send-link{
    
    bottom: -10px;left: 48px;text-align: -webkit-center; position: absolute;
}
}
 @media only screen and (max-width: 600px) {
     .mobile-f{
        margin-right: 22%;
   
}
     
 }
@media (min-width: 1600px)
{
    .sta{
  max-width:60%;  
    
}
.send-link{
    
    bottom: -10px;left: 48px;text-align: -webkit-center; position: absolute;
}
    
    
}
</style>
<footer id="footer" class="{{ $screen == 'home-search-result' ? 'hide-footer' : '' }}" >
    <div class="container" style="background: url('https://labayh.sa/map.caeeab2f.png');">
        <div class="row">
            <div class="col-lg-2 col-md-12"style="text-align:center">
                @if(!empty($logo_footer))
                    <img src="{{ get_attachment_url($logo_footer) }}" alt="footer logo" class="footer-logo"/>
                @endif
                 <p style="font-size: 11px; margin-bottom: 0;" style="margin-top: -3%;">
                          
                             {{__('Labayh registered trademark number')}}
                         <br>
                         <span style="font-weight: bold;color: #37abae;">
                             {{__('by number')}}126674 {{__('date of registration')}} 04/04/1443
                         </span>
                         
                         </p>
                        <img data-src="{{asset('public/images/stars-labayh.png')}}" style="max-width:50%"  src="{{asset('public/images/stars-labayh.png')}}" >
                     
               
            </div>
            <div class="col-lg-8 col-md-12">
                <div class="row">
                    <div class="col-lg-2 col-md-12">
                        <h4 class="footer-title" >{{ get_option('footer_menu1_label') }}</h4>
                        <?php
                        $menu_id = get_option('footer_menu1');
                        get_nav_by_id($menu_id);
                        ?>
                    </div>
                    <div class="col-lg-3 col-md-12">
                        <h4 class="footer-title"  >{{ get_option('footer_menu2_label') }}</h4>
                        <?php
                        $menu_id = get_option('footer_menu2');
                        get_nav_by_id($menu_id);
                        ?>
                        
                       
                        
                    </div>
                         <div class="col-lg-6 col-md-12">
                        <h4 class="footer-title"  >{{ __('Asked assistant') }}</h4>
                   <div class="row">
                                <div class="col-md-3">
                  <img data-src="{{asset('public/images/operator-27@2x.png')}}" style="border-left: solid 2px #f1b84b;"
                  src="{{asset('public/images/operator-27@2x.png')}}" data-was-processed="true">

                                </div>
                                <div class="col-md-9">
                                     <p style="margin-bottom:0px;font-size: 14px;"><i class="fas fa-phone ifot" ></i>581633837 (966+)</p>
                                     <p style="margin-bottom:0px;font-size: 14px;"><i class="fas fa-calendar-alt ifot" ></i>{{__('from Saturday to Thursday')}}</p>
                                     <p style="margin-bottom:0px;font-size: 14px;"><i class="fas fa-clock ifot" ></i>{{__('From 9 am to 9 pm')}}</p>
                                     <p style="margin-bottom:0px;font-size: 14px;"><i class="fas fa-map-marker-alt ifot" ></i>{{__('King Fahd Road - Al-Washam, Riyadh 12735 - Al-Washam Tower - Sixth Floor - Blajat Offices')}}</p>

                                     <!--<p style="margin-bottom:0px"><i class="fa fa-envelope" style="padding: 6px;"></i>info@labayh.sa</p>-->
                                </div>
                            </div>

                     
                       
                        
                    </div>
                </div>
            </div>
            <div class="col-lg-2 col-md-12 ">
                        <img data-src="{{asset('public/images/STA.png')}}" class="sta" src="{{asset('public/images/STA.png')}}" >
                        <div class="col-md-12 send-link">
                            

                            <label for="footerPhone" class="form-label colorWhite" style=" font-size: 12px;width: 175px;text-align: -webkit-left;">أرس� رابط ا�تطب�`� إ��0 ا�ر��&</label>                                                  <div class="d-flex mobile-f">
                                <input type="text" id="footerPhone" name="mobile" class="form-control" placeholder="ر��& ا�ج��ا�" required style="border-radius: 0; width: 185px;height: 34px;border: 1px solid #ced4da;">
                                <button  class="btn btn-sendSms" style="color: #1f2835;background: white;height: 34px;width: 33px;border: 1px solid #ced4da;border-right: 0px; border-radius: 0px;"><i class="far fa-paper-plane" style="position: relative; top: -5px; left: 5px;"></i></button>
                            </div>
                        </div>
                    
                </div>
                        <!--<img data-src="{{asset('public/images/roh.png')}}" style="max-width:50% "  src="{{asset('public/images/roh.png')}}" >-->

<!--                  <h4 class="footer-title"  >{{ __('pay method') }}</h4>-->
<!--                <img data-src="{{asset('public/images/visa.png')}}" style="width:90%" alt="�&ت��فر ع��0 ا�٬ app store �� ا�٬ andriod" loading="lazy" class="loaded" src="{{asset('public/images/visa.png-->
<!--')}}" data-was-processed="true">-->

                <!--@if(!empty($setup_mailc_api) && !empty($setup_mailc_list_id))-->
                <!--    <h4 class="footer-title"  style="color: aliceblue;">{{ get_option('footer_subscribe_label') }}</h4>-->
                <!--    <p>{{ get_option('footer_subscribe_description') }}</p>-->
                <!--    <form action="{{ url('subscribe-email') }}" class="subscribe-form form-sm form-action"-->
                <!--          data-validation-id="form-subscribe"-->
                <!--          method="post" data-reload-time="1000">-->
                <!--        <input type="email" id="mc-email" name="email" placeholder="{{__('Enter your email')}}"-->
                <!--               class="form-control has-validation" data-validation="required"/>-->
                <!--        <button type="submit"><i class="fe-arrow-right"></i> <span class="hh-loading"></span></button>-->
                <!--        <div class="form-message"></div>-->
                <!--    </form>-->
                <!--@else-->
                <!--    <small><i>{{__('Please setup Mailchimp in Settings')}}</i></small>-->
                <!--@endif-->
            </div>
        </div>
        
          <div class="row">
                    
                        
                        
                       
                             
                        </div>
                        
        <div class="copy-right d-flex align-items-center justify-content-between">
            <div class="row" style="    max-width: 100%;">
                <div class="col-md-6">
                     <div class="clearfix" style="    border-left: solid 1px #c3bebe;">
                {!! balanceTags(get_option('copy_right')) !!}
            </div>
                </div>
                <div class="col-md-3">
                      @if(!empty($list_social))
                    <ul class="social">
                        @foreach($list_social as $item)
                            <li>
                                <a href="{{ $item['social_link'] }}">
                                    {!! get_icon($item['social_icon']) !!}
                                </a>
                            </li>
                        @endforeach
                         <li style="width: 11%;">
                           <a href="https://maroof.sa/213090" target="_blank" rel="noopener">
                          <img data-src="{{asset('public/images/m.png')}}" style="border-right: solid 1px #c3bebe;   max-width:200%"  src="{{asset('public/images/m.png')}}" ></a>
                        </li>
                    </ul>
                @endif
                </div>
                <div class="col-md-3">
                      <img data-src="{{asset('public/images/pay.png')}}" style="width:90%" 
                        loading="lazy" class="load
                       ed" src="{{asset('public/images/pay.png')}}" data-was-processed="true">
                </div>
            </div>
           
        </div>
    </div>
</footer>
</div>
<?php do_action('footer'); ?>
<?php do_action('init_footer'); ?>
<?php do_action('init_frontend_footer'); ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.countdown/2.2.0/jquery.countdown.min.js"></script>

<script src="{{asset('js/frontend.js')}}"></script>
@yield('js')
<script>
    
     $(".btn-sendSms").on('click', function () {
          $('.btn-sendSms').prop('disabled', true);
          var fd = new FormData();
        fd.append('mobile', $('#footerPhone').val());
      
         $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        type: 'POST',
        url: "/sendDownloadLink",
        cache: false,
        data: fd,
        contentType: false,
        processData: false,
        success: (data) => {
           if(data.status===0){
                $('.btn-sendSms').prop('disabled', false);
          $.toast({
                        heading: data.title || '',
                        text: data.message,
                        icon: 'error',
                        loaderBg: '#bf441d',
                        position: 'bottom-right',
                        allowToastClose: false,
                        hideAfter: 2000
                    });}
                    else{
                        $('.btn-sendSms').prop('disabled', false);
                        $('#footerPhone').val('');
                         $.toast({
                            heading: data.title || '',
                            text: data.message,
                            icon: 'success',
                            loaderBg: '#5ba035',
                            position: 'bottom-right',
                            allowToastClose: false,
                            hideAfter: 2000
                        });
                    }
        },
        error: function (data) {
            console.log(data);
        }
    });
     });
</script>
</body>
</html>


