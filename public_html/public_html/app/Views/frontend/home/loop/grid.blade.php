<style>
.fav1{
    cursor: pointer;
    font-size: 30px;
    position: absolute;
    top: 4%;
    left: 20px;
    z-index: 1;
    color: white;
    
}    
.hh-service-item.home.grid .detail .price-wrapper {
    
    bottom: -10px;
}
    
</style>

<div class="hh-service-item home grid" data-plugin="matchHeight">
     @if(is_user_logged_in())
                        @if(!is_fav($item->post_id,'home'))
                        <span  class="fav fav1"  data-status="off" data-id="{{$item->post_id}}" data-type="home"><i class="far fa-heart" style="font-size: 30px;"></i></span>
                        @else
                        <span  class="fav fav1" data-status="on" data-id="{{$item->post_id}}" data-type="home"> <i class="fas fa-heart" style="font-size: 30px; color:#f1556c"></i></span>
                        @endif
                        @else
                        <span class="fav fav1" data-toggle="modal"
                            data-target="#hh-login-modal" style="cursor: pointer;" ><i class="far fa-heart" style="font-size: 30px;padding-top: -21px;"></i></span>
                        @endif
    <a href="{{ get_the_permalink($item->post_id, $item->post_slug,isset($item->last) ? 'last' : '') }}">
        <div class="thumbnail">
            
            @if($item->is_featured == 'on')
                <div class="is-featured">{{ get_option('featured_text', __('Featured')) }}</div>
            @endif
            <div class="thumbnail-outer">
                <div class="thumbnail-inner">
                    <img src="{{ get_attachment_url($item->thumbnail_id, [650, 550]) }}"
                         alt="{{ get_attachment_alt($item->thumbnail_id ) }}"
                         class="img-fluid">
                </div>
            </div>
            <!--<div class="author">-->
            <!--    <img src="{{ get_user_avatar($item->author, [45, 45]) }}" alt="{{ get_username($item->author) }}">-->
            <!--</div>-->
        </div>
    </a>
    <div class="detail">
        <h2 class="title text-overflow"><a
                href="{{ get_home_permalink($item->post_id, $item->post_slug,isset($item->last) ? 'last' : '') }}">{{ get_translate($item->post_title) }}</a>
        </h2>
        @if($item->location_address)
            <p class="text-muted text-overflow mb-1"><i class="fe-map-pin mr-1"></i>
                {{ get_short_address($item) }}
                @if(isset($show_distance) && $show_distance && isset($item->distance))
                    <?php
                    $distance = round($item->distance, 2);
                    ?>
                    <strong>({{ $distance }}{{__('km')}})</strong>
                @endif
            </p>
        @endif
        <div class="facilities">
            <div class="item max-people">
                {{ _n("[0::%s guests][1::%s guest][2::%s guests]", (int)$item->number_of_guest) }}
            </div>
            <div class="item max-bedrooms">
                {{ _n("[0::%s bedrooms][1::%s bedroom][2::%s bedrooms]", (int)$item->number_of_bedrooms) }}
            </div>
            <div class="item max-baths">
                {{ _n("[0::%s bathrooms][1::%s bathroom][2::%s bathrooms]", (int)$item->number_of_bathrooms) }}
            </div>
        </div>
        <div class="w-100 mt-1"></div>
        @if(enable_review())
            @include('frontend.components.star', ['rate' => $item->rating, 'show_text' => true])
        @endif
        
         @if(isset($item->creattted_at) )
          <?php
                         $modelName = 'App\\Models\\LastMinute';
        $model = new $modelName();
       $book=$model->checkBookingLast($item->id);
     
      
                        ?>
            <div class="row">
               <div class="col-md-7"> 
                <div class="price-wrapper {{ (empty($item->rating) || !enable_review()) ? 'left' : '' }}" style="position: relative;">
                    
                
                    <!--<span style="  margin-top: 10px;font-size: 0.8em;text-decoration: line-through;color: #db0a0a;">-->
                    <!--    {{ convert_price($item->base_price) }}</span>-->
                        
                          <span class="price">{{ convert_price($item->price) }}</span><span
                        class="unit">/{{get_home_unit($item)}}</span>
                </div>
                 </div>
                 <div class="col-md-5">
                        @if ($book != null)
                    <div class="lastdemo">{{__('booked')}}</div>
                       @else
                   <div class="demo lastdemo" data-startdate="{{ $item->creattted_at }}"></div>
                    @endif
               </div>
                </div>
                @else
                   <div class="price-wrapper {{ (empty($item->rating) || !enable_review()) ? 'left' : '' }}">
                       
                        @if($item->use_offer=='on')
                        
            <span class="price">
                            {{ convert_price(($item->base_price-(($item->base_price*$item->offer)/100))) }}
                            </span>
                             <span class="price" style="position: absolute;top: 4px;text-decoration: line-through;color: red;font-size: 12px;">{{ convert_price($item->base_price) }}</span>
            @else
             <span class="price">{{ convert_price($item->base_price) }}</span>
            @endif
            <span
                class="unit">/{{get_home_unit($item)}}</span>
        </div>
         @if($item->use_offer=='on')
        <div class="price-wrapper {{ (empty($item->rating) || !enable_review()) ? 'left' : '' }}" style="
    left: 20px;
">  <span class="rtl-9tif1f" style="
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(230, 230, 230);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    height: 28px;
    padding: 0px 8px;
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
"><span style="box-sizing: border-box; display: inline-block; overflow: hidden; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; position: relative; max-width: 100%;"><span style="box-sizing: border-box; display: block; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px; max-width: 100%;"><img alt="" aria-hidden="true" src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2718%27%20height=%2718%27/%3e" style="display: block; max-width: 100%; width: initial; height: initial; background: none; opacity: 1; border: 0px; margin: 0px; padding: 0px;"></span><img alt="خصم %16" src="https://labayh.sa/special-star.svg" decoding="async" data-nimg="intrinsic" style="position: absolute; inset: 0px; box-sizing: border-box; padding: 0px; border: none; margin: auto; display: block; width: 0px; height: 0px; min-width: 100%; max-width: 100%; min-height: 100%; max-height: 100%; object-fit: contain;" srcset="https://labayh.sa/special-star.svg 1x, https://labayh.sa/special-star.svg 2x"></span><span class="rtl-2dse8b" style="    margin-right: 5px;">خصم %{{$item->offer}}</span></span>  </div>
 @endif
                @endif
                
             
       
    </div>
    <br>
</div>
