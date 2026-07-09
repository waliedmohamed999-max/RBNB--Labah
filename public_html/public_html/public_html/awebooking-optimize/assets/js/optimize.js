(function ($) {
    'use strict';
    let optimize_running = false;
    let container = $('.optimize-container');

    $('.optimize-button', container).click(function (e) {
        e.preventDefault();
        if (optimize_running) {
            return false;
        }
        optimize_running = true;

        let t = $(this);
        t.text(t.data('text-run')).addClass('running');


        let form = $('form', container);
        let data = form.serializeArray();
        data.push({
            name: '_token',
            value: $('meta[name="csrf-token"]').attr('content')
        });
        $.post(form.attr('action'), data, function (respon) {
            if (typeof respon == 'object') {
                t.text(respon.text);
                if (respon.message) {
                    alert(respon.message);
                }
                if (respon.status === 1) {
                    setTimeout(function () {
                        window.location.href = form.attr('action');
                    }, 1500);
                }
            }

            optimize_running = false;
        }, 'json');
    });
})(jQuery);
