define(
    'UIComponents/UIPopup',
    ['jquery'],
    function($) {
        'use strict';

        /**
         * UIPopup принимает два параметра:
         * isFadeScreen - необходимо ли затемнять экран, вокруг popup (по умолчанию false),
         * isCloseByClick - закрывать ли popup при клике вне попапа (по умолчанию true),
         * isCloseButton - использовать ли кнопку для закрытия popup (по умолчанию true),
         * contentEl - контент popupа, задается селектор, либо jQuery объект
         */
        var defaults = {
            isFadeScreen: false,
            isCloseByClick: true,
            isCloseButton: true,
            contentEl: null
        };

        var cssClasses = {
            fade: 'popup-wrapper_fade'
        };

        var template = {
            popupWraper: '<div class="popup-wrapper"></div>',
            popup: '<div class="popup"></div>',
            content: '<div class="popup__content"></div>',
            close: '<div class="popup__close"></div>'
        };

        function UIPopup(el, options) {
            var settings = $.extend({}, defaults, options);
            var $contentEl = $(settings.contentEl);

            $contentEl.hide();

            this.$popupWrapper = $(template.popupWraper);
            settings.isFadeScreen && this.$popupWrapper.addClass(cssClasses.fade);

            this.$popup = $(template.popup);
            var $content = $(template.content);
            var $el = $(el);
            var $close = $(template.close);

            settings.isCloseButton && this.$popup.append($close);
            this.$popupWrapper.append(this.$popup.append($content.append($contentEl))).hide().appendTo('body');
            this._isShown = false;
            $contentEl.show();

            $el.on('click', this.trigger.bind(this));
            $el.on('trigger:popup', this.trigger.bind(this));
            this.$popup.on('click', function(e) {
                e.stopPropagation();
                return false;
            });
            settings.isCloseByClick && this.$popupWrapper.on('click', this.trigger.bind(this));
            settings.isCloseButton && $close.on('click', this.trigger.bind(this));

        }

        UIPopup.prototype.trigger = function() {
            if (!this._isShown) {
                this.$popupWrapper.show();
                this._isShown = true;
            } else {
                this.$popupWrapper.hide();
                this._isShown = false;
            }
        };

        UIPopup.create = function(el, options) {
            return new UIPopup(el, options);
        };

        return UIPopup;
    }
);
