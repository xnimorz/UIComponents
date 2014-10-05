(function($) {
    'use strict';

    /**
     * UIPopup принимает два параметра:
     * isFadeScreen - необходимо ли затемнять экран, вокруг popup (по умолчанию false),
     * isCloseByClick - закрывать ли popup при клике вне попапа (по умолчанию true),
     * contentEl - контент popupа, задается селектор, либо jQuery объект, Должен существовать в DOM дереве
     */
    var defaults = {
        isFadeScreen: false,
        isCloseByClick: true,
        contentEl: null
    };

    var template = {
        popup: '<div class="popup"></div>',
        content: '<div class="popup__content"></div>'
    };

    function UIPopup(el, options) {
        var settings = $.extend({}, defaults, options);
        var $contentEl = $(settings.contentEl);
        $contentEl.hide();
        this.$popup = $(template.popup);
        var $content = $(template.content);
        var $el = $(el);
        this.$popup.append($content.append($contentEl)).hide().appendTo('body');
        this._isShown = false;
        $contentEl.show();
        $el.on('click', this.trigger.bind(this));
        $el.on('trigger:popup', this.trigger.bind(this));
    }

    UIPopup.prototype.trigger = function() {
        if (!this._isShown) {
            this.$popup.show();
        } else {
            this.$popup.hide();
        }
    };

    (function(UIPopup) {
        if (typeof define === 'function' && define.amd) {
            //AMD. Анонимный модуль
            define(UIPopup);
        } else if (typeof exports === 'object') {
            //CommonJS
            module.exports = UIPopup;
        } else {
            //Глобальный scope
            window.UIPopup = UIPopup;
        }
    })(UIPopup);

})(jQuery);