require.config({
    baseUrl: '../'
});
require(
    [
        'jquery',
        'UIComponents/UIDropdown'
    ],
    function($, UIDropdown) {
        'use strict';

        $(function() {

            UIDropdown.create('.dropdown-container_top_left', {
                position: 'top',
                content: 'UIDropdown example [top_left]',
                arrow: 'start'
            });

            UIDropdown.create('.dropdown-container_top_middle', {
                position: 'top',
                content: 'UIDropdown example [top_middle]',
                arrow: 'middle'
            });

            UIDropdown.create('.dropdown-container_top_right', {
                position: 'top',
                content: 'UIDropdown example [top_right]',
                arrow: 'end'
            });

            UIDropdown.create($('.dropdown-container_left_top'), {
                position: 'left',
                content: 'UIDropdown example [left_top]',
                arrow: 'start'
            });

            UIDropdown.create('.dropdown-container_left_middle', {
                position: 'left',
                content: 'UIDropdown example [left_middle]',
                arrow: 'middle'
            });

            UIDropdown.create('.dropdown-container_left_bottom', {
                position: 'left',
                content: 'UIDropdown example [left_bottom]',
                arrow: 'end'
            });

            UIDropdown.create('.dropdown-container_right_top', {
                position: 'right',
                content: 'UIDropdown example [right_top]',
                arrow: 'start'
            });

            UIDropdown.create('.dropdown-container_right_middle', {
                position: 'right',
                content: 'UIDropdown example [right_middle]',
                arrow: 'middle'
            });

            UIDropdown.create($('.dropdown-container_right_bottom'), {
                position: 'right',
                content: 'UIDropdown example [right_bottom]',
                arrow: 'end'
            });

            UIDropdown.create('.dropdown-container_bottom_left', {
                content: 'UIDropdown example [bottom_left]',
                arrow: 'start'
            });

            UIDropdown.create('.dropdown-container_bottom_middle', {
                content: 'UIDropdown example [bottom_middle]',
                arrow: 'middle'
            });

            UIDropdown.create('.dropdown-container_bottom_right', {
                content: 'UIDropdown example [bottom_right]',
                arrow: 'end'
            });

            UIDropdown.create('.dropdown-container_without_arrow',{
                content: 'UIDropdown example without arrow'
            });
        });
    }
);
