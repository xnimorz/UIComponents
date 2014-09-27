/**
 * UIFormStorage.js v1.0
 *
 * JQuery plugin
 *
 * by Nikita Mostovoy
 */

(function($) {

    /**
     * Дефолтные настройки:
     * onSave {Function} - функция-обработчик после сохранения данных в localStorage - принимает DOM ноду, в которой произошли изменения
     * onLoad {Function} - функция-обработчик после загрузки данных на форму
     * onReset {Function} - функция вызываемая после очищения localStorage
     * @type {{onSave: Function, onLoad: Function}}
     */
    var defaults = {
        onSave: function(changedInput){},
        onLoad: function(){},
        onReset: function(){}
    }

    /**
     * Плагин для сохранения изменений на форме и восстановления после перезагрузки страницы
     * Используется localStorage
     * @param {JSON} settings
     */
    $.fn.UIFormStorage = function (settings) {
        var options = $.extend({}, defaults, settings),
            localStorage,
            storageNamespace = "UIFStorage#",
            filter = ':input[data-id]:not([data-recover="false"]):not([type="password"])',
            $parent = $(this);

        /**
         * надстройка над localStorage
         * @type {{storage: Storage, check: Function, get: Function, set: Function}}
         */
        localStorage = {

            storage: window.localStorage,

            check: function () {
                try {
                    return 'localStorage' in window && window['localStorage'] != null;
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
                    $field = $parent.find("[data-id='" + i.slice(storageNamespace.length, i.length) + "']");
                    if ($field.length > 0) {
                        if ($field.attr("type") === "checkbox" || $field.attr("type") === "radio") {
                            $field.attr("checked", localStorage.get(i) === "true");
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
        $.fn.UIFormStorageClear = function (clearForm) {
            var $field;
            for (var i in localStorage.storage) {
                if (i.match(storageNamespace)) {
                    $field = $parent.find("[data-id='" + i.slice(storageNamespace.length, i.length) + "']");
                    if ($field.length > 0) {
                        delete localStorage.storage[i];
                        if (clearForm) {
                            if ($field.attr("type") === "checkbox" || $field.attr("type") === "radio") {
                                $field.attr("checked", false);
                            } else {
                                $field.val("");
                            }
                        }
                    }
                }
            }

            options.onReset();
            return $(this);
        }

        /**
         * Сохранение данных при изменении в localStorage
         */
        return $(this).on("input change", filter, function () {

            var $this = $(this),
                value,
                name;


            switch ($this.attr("type")) {
                case "checkbox":
                        value = $this.is(":checked");
                    break;
                case "radio":
                        value = $this.is(":checked");
                        if (value) {
                            $parent.find("input[name='" + $this.attr("name") + "']").not("[data-id='" + $this.attr("data-id") + "']").change();
                        }
                    break;
                default:
                        value = $this.val();
                    break;
            }

            name = storageNamespace + $this.attr("data-id");
            localStorage.set(name, value);
            options.onSave(this);
        });

    }


})(window.jQuery);