@include('dashboard.components.right-nav')
<?php do_action('footer'); ?>
<?php do_action('init_footer'); ?>
<?php do_action('init_dashboard_footer'); ?>
<script src="{{asset('js/option.js')}}"></script>
<script src="{{asset('js/dashboard.js')}}"></script>
<script>

$(document).on('click','.getLastHome',function(e){ 
   var home_id= $(this).parent().find('.home_id').val();
   var home_price_id=  $(this).parent().find('.home_price_id').val();
    $(document).find('#home_id').val(home_id);
    $(document).find('#home_price_id').val(home_price_id);

  
    });
</script>
</body>
</html>
