<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('Login') }}</title>
</head>
<body class="{{ $bodyClass ?? '' }}">
    <main style="max-width: 420px; margin: 48px auto; font-family: Arial, sans-serif;">
        <h1>{{ __('Login') }}</h1>
        <form method="post" action="{{ url('auth/login') }}">
            @csrf
            <label for="mobile">{{ __('Mobile') }}</label>
            <input id="mobile" name="mobile" type="text" autocomplete="tel" style="display:block;width:100%;margin:8px 0 16px;">

            <label>{{ __('Code') }}</label>
            <div style="display:flex;gap:8px;margin:8px 0 16px;">
                <input name="digit1" maxlength="1" style="width:48px;">
                <input name="digit2" maxlength="1" style="width:48px;">
                <input name="digit3" maxlength="1" style="width:48px;">
                <input name="digit4" maxlength="1" style="width:48px;">
            </div>

            <button type="submit">{{ __('Login') }}</button>
        </form>
    </main>
</body>
</html>
