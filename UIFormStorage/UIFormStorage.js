(function($) {
    'use strict';
    /**
     * Дефолтные настройки:
     * onSave {Function} - функция-обработчик после сохранения данных в localStorage - принимает DOM ноду,
     *      в которой произошли изменения
     * onLoad {Function} - функция-обработчик после загрузки данных на форму
     * onReset {Function} - функция вызываемая после очищения localStorage
     * @type {{onSave: Function, onLoad: Function}}
     */
    var defaults = {
        onSave: function(changedInput){},
        onLoad: function(){},
        onReset: function(){}
    };

    /**
     * Плагин для сохранения изменений на форме и восстановления после перезагрузки страницы
     * Используется localStorage
     * @param {String} el - form selector
     * @param {JSON} settings
     */
     function UIFormStorage(el, settings) {
        var options = $.extend({}, defaults, settings);
        var storageNamespace = 'UIFStorage#';
        var filter = ':input[data-id]:not([data-recover="false"]):not([type="password"])';
        var $parent = $(el);

        /**
         * надстройка над localStorage
         * @type {{storage: Storage, check: Function, get: Function, set: Function}}
         */
        var localStorage = {

            storage: window.localStorage,

            check: function () {
                try {
                    return 'localStorage' in window && window.localStorage !== null;
                }
                catch(e) {
                    return false;
                }
            },

            get: function (key) {
                return this.storage[key];
            },

            set: function (key, value) {
                this.storage.setItem(key, value);
            }
        };

        /**
         * Восстановление данных из localStorage
         */
        function restore() {
            var $field;
            for (var i in localStorage.storage) {
                if (i.match(storageNamespace)) {
                    $field = $parent.find('[data-id="' + i.slice(storageNamespace.length, i.length) + '"]');
                    if ($field.length > 0) {
                        if ($field.attr('type') === 'checkbox' || $field.attr('type') === 'radio') {
                            $field.attr('checked', localStorage.get(i) === 'true');
                        } else {
                            $field.val(localStorage.get(i).split(','));
                        }
                    }
                }
            }
            options.onLoad();
        }

        restore();

        /**
         * Очищение localStorage от данных на форме,
         * очищение формы.
         * clearForm {Boolean} - если true - очищает форму.
         * @returns {*|HTMLElement}
         * @constructor
         */
        this.clear = function (clearForm) {
            var $field;
            for (var i in localStorage.storage) {
                if (i.match(storageNamespace)) {
                    $field = $parent.find('[data-id="' + i.slice(storageNamespace.length, i.length) + '"]');
                    if ($field.length) {
                        delete localStorage.storage[i];
                        if (clearForm) {
                            if ($field.attr('type') === 'checkbox' || $field.attr('type') === 'radio') {
                                $field.attr('checked', false);
                            } else {
                                $field.val('');
                            }
                        }
                    }
                }
            }
            options.onReset();
            return $(this);
        };

        /**
         * Сохранение данных при изменении в localStorage
         */
        $parent.on('input change', filter, function () {
            var $this = $(this);
            var value;
            var name;

            switch ($this.attr('type')) {
                case 'checkbox':
                        value = $this.is(':checked');
                    break;
                case 'radio':
                        value = $this.is(':checked');
                        if (value) {
                            $parent.find('input[name="' + $this.attr('name') + '"]')
                                   .not('[data-id="' + $this.attr('data-id') + '"]')
                                   .change();
                        }
                    break;
                default:
                        value = $this.val();
                    break;
            }

            name = storageNamespace + $this.attr('data-id');
            localStorage.set(name, value);
            options.onSave(this);
        });

    }

    window.UIFormStorage = UIFormStorage;
})(window.jQuery);