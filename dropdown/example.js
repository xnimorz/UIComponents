$(function(){
    'use strict';

    new Dropdown('.dropdown-container_top_left', {
        position: 'top',
        content: 'Dropdown example',
        arrow: 'start'
    });

    new Dropdown('.dropdown-container_top_middle', {
        position: 'top',
        content: 'Dropdown example',
        arrow: 'middle'
    });

    new Dropdown('.dropdown-container_top_right', {
        position: 'top',
        content: 'Dropdown example',
        arrow: 'end'
    });

    new Dropdown($('.dropdown-container_left_top'), {
        position: 'left',
        content: 'Dropdown example',
        arrow: 'start'
    });

    new Dropdown('.dropdown-container_left_middle', {
        position: 'left',
        content: 'Dropdown example',
        arrow: 'middle'
    });

    new Dropdown('.dropdown-container_left_bottom', {
        position: 'left',
        content: 'Dropdown example',
        arrow: 'end'
    });

    new Dropdown('.dropdown-container_right_top', {
        position: 'right',
        content: 'Dropdown example',
        arrow: 'start'
    });

    new Dropdown('.dropdown-container_right_middle', {
        position: 'right',
        content: 'Dropdown example',
        arrow: 'middle'
    });

    new Dropdown($('.dropdown-container_right_bottom'), {
        position: 'right',
        content: 'Dropdown example',
        arrow: 'end'
    });

    new Dropdown('.dropdown-container_bottom_left', {
        content: 'Dropdown example',
        arrow: 'start'
    });

    new Dropdown('.dropdown-container_bottom_middle', {
        content: 'Dropdown example',
        arrow: 'middle'
    });

    new Dropdown('.dropdown-container_bottom_right', {
        content: 'Dropdown example',
        arrow: 'end'
    });

    new Dropdown('.dropdown-container_without_arrow',{
        content: 'Dropdown example without arrow'
    })

});