$(function(){
    'use strict';

    new UIDropdown('.dropdown-container_top_left', {
        position: 'top',
        content: 'UIDropdown example',
        arrow: 'start'
    });

    new UIDropdown('.dropdown-container_top_middle', {
        position: 'top',
        content: 'UIDropdown example',
        arrow: 'middle'
    });

    new UIDropdown('.dropdown-container_top_right', {
        position: 'top',
        content: 'UIDropdown example',
        arrow: 'end'
    });

    new UIDropdown($('.dropdown-container_left_top'), {
        position: 'left',
        content: 'UIDropdown example',
        arrow: 'start'
    });

    new UIDropdown('.dropdown-container_left_middle', {
        position: 'left',
        content: 'UIDropdown example',
        arrow: 'middle'
    });

    new UIDropdown('.dropdown-container_left_bottom', {
        position: 'left',
        content: 'UIDropdown example',
        arrow: 'end'
    });

    new UIDropdown('.dropdown-container_right_top', {
        position: 'right',
        content: 'UIDropdown example',
        arrow: 'start'
    });

    new UIDropdown('.dropdown-container_right_middle', {
        position: 'right',
        content: 'UIDropdown example',
        arrow: 'middle'
    });

    new UIDropdown($('.dropdown-container_right_bottom'), {
        position: 'right',
        content: 'UIDropdown example',
        arrow: 'end'
    });

    new UIDropdown('.dropdown-container_bottom_left', {
        content: 'UIDropdown example',
        arrow: 'start'
    });

    new UIDropdown('.dropdown-container_bottom_middle', {
        content: 'UIDropdown example',
        arrow: 'middle'
    });

    new UIDropdown('.dropdown-container_bottom_right', {
        content: 'UIDropdown example',
        arrow: 'end'
    });

    new UIDropdown('.dropdown-container_without_arrow',{
        content: 'UIDropdown example without arrow'
    })

});