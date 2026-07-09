@include('dashboard.components.header')
<div id="wrapper">
    @include('dashboard.components.top-bar')
    @include('dashboard.components.nav')
    
    <?php


enqueue_style('dropzone-css');
enqueue_script('dropzone-js');

enqueue_style('confirm-css');
enqueue_script('confirm-js');

?>
<style>
    .awe-booking label{
        font-size:12px;
    }
</style>
    <div class="content-page">
        <div class="content">

            {{--Start Content--}}
            @include('dashboard.components.breadcrumb', ['heading' => __('voit ditails')])
            @if (!$newExperience)
            <div class="card-box">
                <div class="alert alert-danger">{{__('This item is invalid')}}</div>
            </div>
            @else
            <?php
                $serviceObject = get_post($newExperience, 'experience', true);
         
                ?>
            <div class="row">
                <div class="col-12 col-lg-12">
                    
                    <div class="card-box">
                        <div class="row">
                           
                   
                    <form class="form form-file-action"
                    action="{{ dashboard_url('vote-ditails-add', $serviceObject->post_id) }}"
                    method="post" data-tab="">
                    @csrf
                    
                           <div  class="row mb-3">
                                    <div  class="col-md-6" style="    margin-top: 45px;"> 
                         <span style="max-height: 50px;"
                                                class="btn btn-success btn-has-spinner right width-xl waves-effect waves-light "
                                                id="add_stage">
                                                    {{__('add stage')}}
                                        </span>
                    </div>
                       <div class="col-md-6">
                    
                                   <label for="Stage start date">{{__('start date for event')}}  </label>
                                    <input type="date" class="form-control" name="event_date" id=""
                                       value="{{ isset($Vote) ? $Vote->event_date : '' }}">
                                         <input type="hidden" name="experienceID" value="{{ $serviceObject->post_id }}" class="form-control">
                                </div>

               
                     
                    </div>
                    
                           
               
                            <div id="stage" data-condition="" data-unique="" data-operator="and"
                                class="form-group mb-12 col col-12 col-md-12 ">
                                @if(isset($Vote))
                                @foreach(unserialize($Vote->start_date) as $k => $item )
                                
                                 <div class="row" style="position: relative;">
                                      <div style="    position: absolute;top: 40px;right: -8px;">
                                       <button type="button" class="close closeSub" data-dismiss="modal" aria-hidden="true">×</button>
                                   </div>
                                <div class="col-md-3">
                                    <label for="stage number">
                                        {{__('stage number')}}
                                        
                                        
                                    </label>
                                  
                                    <input type="text" name="name[]" class="form-control"    value="{{  unserialize($Vote->name)[$k] }}">
                                </div>
                                   <div class="col-md-3">
                                    <label for="stage number">
                                       
                                         {{__('Excluded')}}
                                        
                                    </label>
                                    <input type="text" name="per[]" class="form-control" value="{{  unserialize($Vote->per)[$k] }}">
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="Stage start date">{{__('Stage start date')}}  </label>
                                    <input type="date" class="form-control" name="start_date[]" id="" value="{{   unserialize($Vote->start_date)[$k] }}">
                                </div>
                                <div class="col-md-3">
                                    <label for="Stage end date">
                                        {{__('Stage end date')}}
                                        
                                    </label>
                                       <input type="hidden" name="status[]" value="true" class="form-control" >
                                    <input type="date" class="form-control" name="end_date[]" id="" value="{{   unserialize($Vote->end_date)[$k] }}">
                                </div>
                             
                               </div>
                                @endforeach
                                @else
                               <div class="row" style="position: relative;">
                                      <div style="    position: absolute;top: 40px;right: -8px;">
                                       <button type="button" class="close closeSub" data-dismiss="modal" aria-hidden="true">×</button>
                                   </div>
                                <div class="col-md-3">
                                    <label for="stage number">
                                        {{__('stage number')}}
                                        
                                        
                                    </label>
                                    <input type="hidden" name="experienceID" value="{{ $serviceObject->post_id }}" class="form-control">
                                    <input type="text" name="name[]" class="form-control">
                                </div>
                                   <div class="col-md-3">
                                    <label for="stage number">
                                       
                                         {{__('Excluded')}}
                                        
                                    </label>
                                    <input type="text" name="per[]" class="form-control">
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="Stage start date">{{__('Stage start date')}}  </label>
                                    <input type="date" class="form-control" name="start_date[]" id="">
                                </div>
                                <div class="col-md-3">
                                    <label for="Stage end date">
                                        {{__('Stage end date')}}
                                        
                                    </label>
                                     <input type="hidden" name="status[]" value="true" class="form-control" >
                                    <input type="date" class="form-control" name="end_date[]" id="">
                                </div>
                             
                               </div>
                                  @endif
                                <div class="clearfix"></div>
                                
                            </div>
              
                              <div  class="row mb-3">
                       <div class="col-md-12">
                                    @php
                                        $thumbnail = get_attachment_url( isset($Vote) ? $Vote->image : '');
                                    @endphp
                                    
                                    <label for="stage number">
                                        {{__('image event')}}
                                        
                                        
                                    </label>
                                      <input name="image"id="file" type="file"
                        data-behaviour="custom-upload-input" value="multiple" onchange="readURL(this);" />
                    <img id="blah" src="{{ isset($thumbnail) ? $thumbnail  : '' }}"     width="25%";>
                                </div>
                                
                     
                    </div>
                         
                            <button class="btn btn-success btn-has-spinner right width-xl waves-effect waves-light "
                            type="submit">
                        {{__('Save Options')}}
                    </button>
                </form>
                        </div>
                    </div>
              
                </div>
                
                <?php
                $serviceObject = get_post($newExperience, 'experience', true);
                ?>
                
                <!--<div class="d-none d-lg-block col-lg-4">-->
                <!--    @include('dashboard.components.services.experience.experience_preview')-->
                <!--</div>-->
            </div>
            <div class="row">
                <div class="col-12 col-lg-8">
                    @include("dashboard.seo.index", ['serviceObject' => $serviceObject])
                </div>
            </div>
            @endif
            {{--End content--}}
            @include('dashboard.components.footer-content')
        </div>
    </div>
</div>

@include('dashboard.components.footer')
