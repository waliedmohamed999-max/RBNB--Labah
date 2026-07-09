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
            @include('dashboard.components.breadcrumb', ['heading' => __('Message Notification')])
            {{--Start Content--}}
            @if(Session::has('status'))
            <div class="alert alert-success">
              <strong>{{ Session::get('status') }}</strong>
            </div>
            @endif
            @if(Session::has('erorr'))
            <div class="alert alert-danger">
              <strong>{{ Session::get('erorr') }}</strong>
            </div>
            @endif
            <div class="card-box card-list-post">
                <div class="header-area d-flex align-items-center">
                    <h4 class="header-title mb-0">{{__('Message Notification')}}</h4>
                    
                </div>
                <form class="form-horizontal" role="form" enctype="multipart/form-data" method="post" action="{{route('Send-specific')}}">
                    @csrf
                       <input type="text" class="form-control" placeholder="{{__('Mobile')}}" aria-label="" name="mobile" aria-describedby="basic-addon1"></br>
                          <div class="input-group mb-3">
                              
                              <input type="text" class="form-control" placeholder="{{__('Message text')}}" aria-label="" name="message" aria-describedby="basic-addon1">
                              
                               
                              
                            </div>  
                             <button class="btn btn-outline-secondary" type="submit">{{__('Send Message')}}</button>
                       
             </form>
                <?php
                enqueue_style('datatables-css');
                enqueue_script('datatables-js');
                enqueue_script('pdfmake-js');
                enqueue_script('vfs-fonts-js');
                enqueue_script('nice-select-js');
                enqueue_style('nice-select-css');
                ?>
              
               
               
            </div>
          

            <!-- Modal -->

            @include('dashboard.components.qr-modal')
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>
@include('dashboard.components.footer')
