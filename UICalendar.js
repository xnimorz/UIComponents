/**
 * Создает экземпляр нового виджета календарь
 * @param {String} jquerySelector - css селектор DOM элемента, внутри которого расположится календарь
 * @param multipleSelect - разрешение на мультивыборку (по умолчанию запрешена)
 * @constructor
 */
function UICalendar(jquerySelector, multipleSelect) {
    this.target = $(jquerySelector);
    this.targetSelector = jquerySelector;
    this.ctrlKey = multipleSelect;
    this.firstMounthDate;
    this.currentDate;
    this.mounth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    this.calendarListDiv = $("<div></div>");
    this.dateRange;
    this.init();
    this.initMounth();
    this.selectedDates = [];
}

/**
 * Расширение даты - получает количество дней в месяце
 * @returns {number}
 */
Date.prototype.getDaysInMonth = function () {
    return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
};

/**
 * Инициализация месяца. Установка отображения чисел и названия месяца
 */
UICalendar.prototype.initMounth = function()
{

    this.calendarListDiv.html("");
    var daysList = '<ol class="ui-calendar-list-mounth ui-calendar-list ui-calendar-list-up ui-calendar-font-white-color ui-calendar-text-left-side">';
    var startMounthDay = this.firstMounthDate;
    this.dateRange.html(this.mounth[this.firstMounthDate.getMonth()] + ' ' + this.firstMounthDate.getFullYear());
    var startIndex = startMounthDay.getDay() - 1;
    if (startIndex < 0) startIndex = 6;
    for (var i = 0; i < startIndex; i++) {
        daysList += "<li class='left-side ui-calendar-list-item'></li>";
    }
    for (var i = 0; i < startMounthDay.getDaysInMonth() ; i++) {
        daysList += "<li class='left-side ui-calendar-cursor ui-calendar-list-item  ui-calendar-selectable'>"+(i+1)+"</li>";
    }
    daysList += '</ol><div class=ui-calendar-clear></div>';
    this.calendarListDiv.append($(daysList));


    var currentObject = this;

    /**
     * Реакция на выбор даты. (выбор даты, сброс значений) Формирование массива выбранных дат
     */
    $(this.targetSelector + " .ui-calendar-list-mounth li").bind("click",function(e)
    {
        var selectedDate = new Date(currentObject.firstMounthDate.getFullYear(),currentObject.firstMounthDate.getMonth(), $(this).html());

        if ($(this).hasClass('ui-calendar-select'))
        {
            $(this).removeClass('ui-calendar-select');
            for (var i = 0 ; i < currentObject.selectedDates.length; i++)
            {
                if (currentObject.selectedDates[i] == selectedDate)
                    currentObject.selectedDates.splice(i,1);
            }
        }
        else
        {
            if (!e.ctrlKey || !currentObject.ctrlKey)
            {
                $(currentObject.targetSelector +" .ui-calendar-select").removeClass('ui-calendar-select');
                currentObject.selectedDates = [];
            }
            $(this).addClass('ui-calendar-select');
            currentObject.selectedDates.push(selectedDate);
        }
    });
};

/**
 * Возвращает выбранные даты
 * @returns {Array}
 */
UICalendar.prototype.getSelectedDates = function () {
    return this.selectedDates;
};

/**
 * Инициализация блока календаря
 */
UICalendar.prototype.init = function () {
    var calendar = $("<div class='ui-calendar-font ui-calendar-div'></div>");
    var calendarHead = $("<div class='ui-calendar-head ui-calendar-margin'></div>");
    var leftSpan = $("<span class='ui-calendar-cursor ui-calendar-move left-side'>&lt</span>");
    var rightSpan = $("<span class='ui-calendar-cursor ui-calendar-move right-side'>&gt</span>");
    this.dateRange = $("<span class='ui-calendar-daterange'></span>");
    this.currentDate = new Date();
    this.firstMounthDate = this.currentDate;
    this.firstMounthDate.setDate(1);



    calendarHead.append(leftSpan, this.dateRange, rightSpan);

    calendar.append(calendarHead);
    this.target.append(calendar);

    var currentObject = this;

    leftSpan.bind("click", function () {
        currentObject.move(-1);
    });
    rightSpan.bind("click", function () {
        currentObject.move(1);
    });

    var daysDiv = $('<div class="ui-calendar-margin"></div>');
    var mainList = $('<ol class="ui-calendar-list">\
                <li class="left-side ui-calendar-list-item" title="Понедельник">Пн</li>\
                <li class="left-side ui-calendar-list-item" title="Вторник">Вт</li>\
                <li class="left-side ui-calendar-list-item" title="Среда">Ср</li>\
                <li class="left-side ui-calendar-list-item" title="Четверг">Чт</li>\
                <li class="left-side ui-calendar-list-item" title="Пятница">Пт</li>\
                <li class="left-side ui-calendar-list-item" title="Суббота">Сб</li>\
                <li class="left-side ui-calendar-list-item" title="Воскресенье">Вс</li>\
                </ol><div class=ui-calendar-clear></div>');
    daysDiv.append(mainList);


    daysDiv.append(this.calendarListDiv);
    calendar.append(daysDiv);


};

/**
 * Переход на другой месяц
 * @param {Number} direction - направление переход (-1 - предыдущий, 1 - следующий)
 */
UICalendar.prototype.move = function(direction) {
    this.selectedDates = [];
    this.firstMounthDate.setMonth(this.firstMounthDate.getMonth()+direction);
   this.initMounth()


};



   