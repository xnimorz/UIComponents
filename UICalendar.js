/**
 * Создает экземпляр нового виджета календарь
 * @param {String} jquerySelector - css селектор DOM элемента, внутри которого расположится календарь
 * @param multipleSelect - разрешение на мультивыборку (по умолчанию запрешена)
 * @param startYear - год отображения
 * @param startMonth - месяц отображения
 * @constructor
 */
function UICalendar(jquerySelector, multipleSelect, calendarType, autoSwitch, startYear, startMonth) {
    this.target = $(jquerySelector);
    this.targetSelector = jquerySelector;
    this.ctrlKey = multipleSelect;
	this.mounth = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
   this.currentDate = new Date();
	this.calendar;
	this.daysDiv = $('<div class="ui-calendar-margin"></div>');
	this.firstMonthDate = this.currentDate;
	this.firstMonthDate.setDate(1);
	this.autoSwitch = autoSwitch;
	this.calendarListDiv = $("<div></div>");
	this.dateRange;
	this.init();
    switch (calendarType)
    {
	    case "month": this.calendar = new UICalendarMonthProvider(this);
		        break;
	    case "year": this.calendar = new UICalendarYearProvider(this);
		    break;
	    default ://"date"
		    this.calendar = new UICalendarDateProvider(this);
		    break;
    }

    if (startYear)
    {
        this.currentDate.setYear(startYear);
    }
    if (startMonth)
    {
        this.currentDate.setMonth(startMonth);
    }


    this.calendar.initValues();
    this.selectedDates = [];
}

/**
 * Возвращает выбранные даты
 * @returns {Array}
 */
UICalendar.prototype.getSelectedDates = function () {
	return this.selectedDates;
};


/**
 * Общая реакция для всех классов реакция на клик по дате\месяцу\году
 * @param currentObject - календарь
 * @param selectedDate - выбранная дата
 * @param e - параметры клика
 */
UICalendar.prototype.dateClick = function(currentObject,selectedDate,e)
{
	if ($(this).hasClass('ui-calendar-select'))
	{
		$(this).removeClass('ui-calendar-select');
		for (var i = 0 ; i < currentObject.selectedDates.length; i++)
		{

			if (currentObject.selectedDates[i].toString() == selectedDate.toString())
			{
				currentObject.selectedDates.splice(i,1);
			}

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
}

/**
 * Инициализация блока календаря
 */
UICalendar.prototype.init = function ()
{
	var calendar = $("<div class='ui-calendar-font ui-calendar-div'></div>");
	var calendarHead = $("<div class='ui-calendar-head ui-calendar-margin'></div>");
	var leftSpan = $("<span class='ui-calendar-cursor ui-calendar-move left-side'>&lt</span>");
	var rightSpan = $("<span class='ui-calendar-cursor ui-calendar-move right-side'>&gt</span>");
	this.dateRange = this.autoSwitch?$("<span class='ui-calendar-daterange ui-calendar-daterange-clickable'></span>"):$("<span class='ui-calendar-daterange'></span>");


	calendarHead.append(leftSpan, this.dateRange, rightSpan);

	calendar.append(calendarHead);
	this.target.append(calendar);

	var currentObject = this;

	leftSpan.bind("click", function () {

		currentObject.calendar.move(-1);
	});
	rightSpan.bind("click", function () {
		currentObject.calendar.move(1);
	});


	this.weekDescription = $('<ol class="ui-calendar-list">\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Понедельник">Пн</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Вторник">Вт</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Среда">Ср</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Четверг">Чт</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Пятница">Пт</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Суббота">Сб</li>\
                <li class="left-side ui-calendar-list-item ui-calendar-list-item-width" title="Воскресенье">Вс</li>\
                </ol><div class=ui-calendar-clear></div>');
	this.daysDiv.append(this.weekDescription );


	this.daysDiv.append(this.calendarListDiv);
	calendar.append(this.daysDiv);


};

/**
 * Задает месяц для отображения
 * @param month - месяц, необходимый для отображения
 */
UICalendar.prototype.setMonth = function(month)
{
	this.firstMonthDate.setMonth(month);
	this.calendar.initValues();
};

/**
 * Задает год для отображения
 * @param year
 */
UICalendar.prototype.setYear = function(year)
{
	this.firstMonthDate.setYear(year);
	this.calendar.initValues();
} ;

/**
 * Расширение даты - получает количество дней в месяце
 * @returns {number}
 */
Date.prototype.getDaysInMonth = function () {
	return (new Date(this.getFullYear(), this.getMonth() + 1, 0)).getDate();
};



/**
 * класс, определяющий методы для смены дат в календаре.
 *
 * определяет
 *
 * 1)Метод смены интервала выборки (move)
 *
 * 2) Инициализацию выбранных вариантов
 *
 * @constructor
 */
function UICalendarProvider()
{
	this.move = function(direction){};
	this.initValues = function(){};
};



/**
 * Работа с интервалом в 30 лет
 * @param UICalendarItem - основной класс
 * @constructor
 */
function UICalendarYearProvider(UICalendarItem)
{
	this.UICalendarItem = UICalendarItem;
	this.UICalendarItem.daysDiv.html("");
	this.UICalendarItem.daysDiv.append(this.UICalendarItem.calendarListDiv);

	/**
	 * Переход на другие 30 лет
	 * @param {Number} direction - направление переход (-1 - предыдущий, 1 - следующий)
	 */
	this.move = function(direction)
	{
		this.UICalendarItem.selectedDates = [];
		this.UICalendarItem.firstMonthDate.setYear(this.UICalendarItem.firstMonthDate.getFullYear()+direction*30);
		this.initValues();
	};

	/**
	 * Представление 30 лет, инициализация реакции нажатия на кнопку
	 */
	this.initValues = function()
	{
		this.UICalendarItem.calendarListDiv.html("");
		var daysList = '<ol class="ui-calendar-list-mounth ui-calendar-list ui-calendar-list-up ui-calendar-font-white-color ui-calendar-text-left-side">';

		this.UICalendarItem.dateRange.html(this.UICalendarItem.firstMonthDate.getFullYear() + "-" + (this.UICalendarItem.firstMonthDate.getFullYear() + 30) );

		for (var i = 0; i < 30 ; i++) {
			daysList += "<li class='left-side ui-calendar-cursor ui-calendar-list-item  ui-calendar-selectable'>"+(this.UICalendarItem.firstMonthDate.getFullYear()+i)+"</li>";
		}
		daysList += '</ol><div class=ui-calendar-clear></div>';
		this.UICalendarItem.calendarListDiv.append($(daysList));

		var currentObject = this.UICalendarItem;

		/**
		 * Реакция на выбор даты. (выбор даты, сброс значений) Формирование массива выбранных дат
		 */
		$(this.UICalendarItem.targetSelector + " .ui-calendar-list-mounth li").bind("click",function(e)
		{
			var selectedDate = new Date($(this).html(),0,1);
			if (currentObject.autoSwitch)
			{
				currentObject.firstMonthDate.setFullYear($(this).html());
				currentObject.calendar = new UICalendarMonthProvider(currentObject);
				currentObject.calendar.initValues();
				return;
			}
			currentObject.dateClick.call(this,currentObject,selectedDate,e);
		});
	}
}

UICalendarYearProvider.prototype = new UICalendar();
UICalendarYearProvider.prototype.constructor = UICalendarYearProvider;

/**
 * Работа с интервалом в год (выбор месяца)
 * @param UICalendarItem - основной класс
 * @constructor
 */
function UICalendarMonthProvider(UICalendarItem)
{
	this.UICalendarItem = UICalendarItem;
	this.UICalendarItem.daysDiv.html("");
	this.UICalendarItem.daysDiv.append(this.UICalendarItem.calendarListDiv);

	var currentObject = UICalendarItem;
	/**
	 * При нажатии на верхний интервал - переход в выборке более объемной (с даты на месяц, с месяца на год)
	 */
	$(".ui-calendar-daterange-clickable").bind("click keypress",function()
	{
		currentObject.calendar = new UICalendarYearProvider(currentObject);
		currentObject.calendar.initValues();
	});
	/**
	 * Переход на другой год
	 * @param {Number} direction - направление переход (-1 - предыдущий, 1 - следующий)
	 */
	this.move = function(direction)
	{
		this.UICalendarItem.selectedDates = [];
		this.UICalendarItem.firstMonthDate.setYear(this.UICalendarItem.firstMonthDate.getFullYear()+direction);
		this.initValues();
	}
	/**
	 * Вывод месяцев в году. Возможность выбора
	 */
	this.initValues = function()
	{
		this.UICalendarItem.calendarListDiv.html("");
		var daysList = '<ol class="ui-calendar-list-mounth ui-calendar-list ui-calendar-list-up ui-calendar-font-white-color ui-calendar-text-left-side">';
		var startMounthDay = this.UICalendarItem.firstMonthDate;
		this.UICalendarItem.dateRange.html(this.UICalendarItem.firstMonthDate.getFullYear());

		for (var i = 0; i < this.UICalendarItem.mounth.length ; i++) {
			daysList += "<li class='left-side ui-calendar-cursor ui-calendar-list-item  ui-calendar-selectable' index="+i+">"+this.UICalendarItem.mounth[i].slice(0,3)+"</li>";
		}
		daysList += '</ol><div class=ui-calendar-clear></div>';
		this.UICalendarItem.calendarListDiv.append($(daysList));

		var currentObject = this.UICalendarItem;

		/**
		 * Реакция на выбор даты. (выбор даты, сброс значений) Формирование массива выбранных дат
		 */
		$(this.UICalendarItem.targetSelector + " .ui-calendar-list-mounth li").bind("click",function(e)
		{
			var selectedDate = new Date(currentObject.firstMonthDate.getFullYear(),$(this).attr("index"),1);
			if (currentObject.autoSwitch)
			{
				currentObject.firstMonthDate.setMonth($(this).attr("index"));
				currentObject.calendar = new UICalendarDateProvider(currentObject);
				currentObject.calendar.initValues();
				return;
			}
			currentObject.dateClick.call(this,currentObject,selectedDate,e);
		});
	}
}

UICalendarMonthProvider.prototype = new UICalendarProvider();
UICalendarMonthProvider.prototype.constructor = UICalendarMonthProvider;

/**
 * Выбор даты (интервал в месяц)
 * @param UICalendarItem - экземпляр календаря
 * @constructor
 */
function UICalendarDateProvider(UICalendarItem)
{
	this.UICalendarItem = UICalendarItem;

	this.UICalendarItem.daysDiv.html("");
	this.UICalendarItem.daysDiv.append(this.UICalendarItem.weekDescription);
	this.UICalendarItem.daysDiv.append(this.UICalendarItem.calendarListDiv);

	var currentObject = UICalendarItem;
	/**
	 * При нажатии на верхний интервал - переход в выборке более объемной (с даты на месяц, с месяца на год)
	 * при включенном autoSwitch
	 */
	$(".ui-calendar-daterange-clickable").bind("click keypress",function()
	{
		currentObject.selectedDates = [];
		currentObject.calendar = new UICalendarMonthProvider(currentObject);
		currentObject.calendar.initValues();
	});

	/**
	 * Переход на другой месяц
	 * @param {Number} direction - направление переход (-1 - предыдущий, 1 - следующий)
	 */
	this.move = function(direction)
	{
		this.UICalendarItem.selectedDates = [];
		this.UICalendarItem.firstMonthDate.setMonth(this.UICalendarItem.firstMonthDate.getMonth()+direction);
		this.initValues()
	}

	/**
	 * Инициализация месяца. Установка отображения чисел и названия месяца
	 */
	this.initValues = function()
	{
		this.UICalendarItem.calendarListDiv.html("");
		var daysList = '<ol class="ui-calendar-list-mounth ui-calendar-list ui-calendar-list-up ui-calendar-font-white-color ui-calendar-text-left-side">';
		var startMounthDay = this.UICalendarItem.firstMonthDate;
		this.UICalendarItem.dateRange.html(this.UICalendarItem.mounth[this.UICalendarItem.firstMonthDate.getMonth()] + ' ' + this.UICalendarItem.firstMonthDate.getFullYear());
		var startIndex = startMounthDay.getDay() - 1;
		if (startIndex < 0) startIndex = 6;
		for (var i = 0; i < startIndex; i++) {
			daysList += "<li class='left-side ui-calendar-list-item ui-calendar-list-item-width'></li>";
		}
		for (var i = 0; i < startMounthDay.getDaysInMonth() ; i++) {
			daysList += "<li class='left-side ui-calendar-cursor ui-calendar-list-item  ui-calendar-selectable ui-calendar-list-item-width'>"+(i+1)+"</li>";
		}
		daysList += '</ol><div class=ui-calendar-clear></div>';
		this.UICalendarItem.calendarListDiv.append($(daysList));


		var currentObject = this.UICalendarItem;


		/**
		 * Реакция на выбор даты. (выбор даты, сброс значений) Формирование массива выбранных дат
		 */
		$(this.UICalendarItem.targetSelector + " .ui-calendar-list-mounth li").bind("click",function(e)
		{
			var selectedDate = new Date(currentObject.firstMonthDate.getFullYear(),currentObject.firstMonthDate.getMonth(), $(this).html());
			currentObject.dateClick.call(this,currentObject,selectedDate,e);

		});
	}
}

UICalendarDateProvider.prototype = new UICalendarProvider();
UICalendarDateProvider.prototype.constructor = UICalendarDateProvider;