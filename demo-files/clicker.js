$(function() {
    'use strict';

    $('.link').on('click', function(e) {
        var href = $(this).attr('href');
        if (href[0] === '#') {
            $('body, html').animate({scrollTop: $(href).offset().top - 70}, '500');
            e.preventDefault();
        }
    });
});