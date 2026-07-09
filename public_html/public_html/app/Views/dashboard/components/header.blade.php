<?php do_action('init'); ?>
<?php do_action('admin_init'); ?>
    <!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <?php
    $favicon = get_option('favicon');
    $favicon_url = get_attachment_url($favicon);
    ?>
    <link rel="shortcut icon" type="image/png" href="{{ $favicon_url }}"/>

    <title>{{ page_title(true) }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;1,400&display=swap"
          rel="stylesheet">
    <?php do_action('header'); ?>
    <?php do_action('init_header'); ?>
    <?php do_action('init_dashboard_header'); ?>
</head>
<body class="awe-booking {{is_rtl()? 'rtl': ''}} {{ isset($bodyClass)? $bodyClass: '' }}">
      <script>
    window.translations = {
          Libraries: "{{ __('Libraries') }}",
        Add_a_New_photo: "{{  __('Add a New photo')}}",
        Close: "{{ __('Close') }}",
        Load_More: "{{ __('Load More') }}",
    };
    
         window.vote = {
          Libraries: "{{ __('Libraries') }}",
        Add_a_New_photo: "{{  __('Add a New photo')}}",
         stageNumber: "{{__('stage number')}}",
          Excluded: " {{__('Excluded')}}",
           StageStartDate: "{{__('Stage start date')}}",
            StageEndDate: "{{__('Stage end date')}}",
        Close: "{{ __('Close') }}",
        Load_More: "{{ __('Load More') }}",
        
    };
</script>
@include('common.loading', ['class' => 'page-loading'])
