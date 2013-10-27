Date.prototype.getFullString = function()
{
    return this.getDate() + "." + this.getMonth() + "." + this.getFullYear().toString().substr(2,2);
}

/**
 * Класс для предоставления временной шкалы.
 * @param {String} selector - место для виджета
 * @param {Date} startDate - Начальная дата. По умолчанию (new Date())
 * @param {Number} days - количество дней. По умолчанию 1
 * @param {Number} intervalInMinutes - цена деления в минутах. По умолчанию 30
 * @param {Boolean} rightTimeLine - отображение правой линеки времени. По умолчанию true
 * @param {Number} widgetSizeInPx - размер виджета в пикселах. По умолчанию - авторазмер
 * @param {Boolean} useChangeDatesButtons - по умолчанию true
 * @constructor создание и отображение виджета
 */
function UITimeLine(selector,days, startDate, intervalInMinutes, rightTimeLine, widgetSizeInPx, useChangeDatesButtons)
{
	this.selector = selector;
	this.target = $(selector);

	this.interval = intervalInMinutes || 30;
	this.interval = this.interval < 30 ? 30:this.interval;
	this.pxPerItem = widgetSizeInPx?(widgetSizeInPx / Math.ceil(24*60/intervalInMinutes)) : 12;
    this.eventsTime = [];
	this.days = days || 1;
	this.date;
	this.itemsContainer;
    this.changeDatesButtons = useChangeDatesButtons
	this.itemsCount = this.init(this.changeDatesButtons?-1:undefined);
	this.setDate(startDate);
    this.selectedTime = [];


}

UITimeLine.prototype.updateWidget = function()
{
    this.init(this.changeDatesButtons);
    this.setDate(this.date);

}

UITimeLine.prototype.setDate = function(date)
{
	this.date = date || new Date();
	this.initDates();
}

UITimeLine.prototype.init = function(direction)
{
    this.target.html("");
	var divGeneral = $("<div class='ui-timeline-font ui-timeline-div'></div>");
	var divText = $("<div class='ui-timeline-textbar'></div>");
	this.itemsContainer = $("<div class='ui-timeline-items ui-timeline-nonselectable'></div>");
	divGeneral.append(divText,this.itemsContainer);
	this.target.append(divGeneral);
	return this.initText(divText,this.interval,this.pxPerItem);
};

UITimeLine.prototype.initText = function(target, interval, px)
{
	var hour = 0;
	var minutes = 0;
	var counter = 0;
	var template = "<div class='ui-timeline-textbar__item' style='height:{1}px;'>{0}</div>";
	while (hour < 24)
	{
		var label = $(template.replace("{0}",(hour >= 10? hour : '0' + hour)+":"+(minutes >= 10 ? minutes:"0"+minutes)).replace('{1}',px));
		target.append(label);
		minutes += interval;
		counter++;
		while (minutes >= 60)
		{
			hour++;
			minutes -= 60;
		}
	}
	return counter;
};

UITimeLine.prototype.initDates = function()
{

	var dayTemplate = "<div class=ui-timeline-items__bar>{0}</div>";
	var template = "<div class='ui-timeline-items__bar__item {3}' time='{0}' style='top:{1}px; height:{2}px'></div>";
    this.date.setDate(this.date.getDate() - 1);
    for (var i = 0; i < this.days; i++)
    {
        this.date.setDate(this.date.getDate() + 1);
        var currentDay = $(dayTemplate.replace("{0}", this.date.getFullString()));
        for (var j = 0; j < this.itemsCount; j++)
        {
            var hour = (j*this.interval/60 >> 0);
            var min = (j*this.interval%60);
            var timeLeft = hour*60 + min;
            var timeRight = timeLeft + this.interval;
            var asEvent = false
           for (var index = 0; index < this.eventsTime.length && !asEvent; index++)
            {

                if (this.eventsTime[index].date.getFullYear() == this.date.getFullYear() &&
                        this.date.getMonth() == this.eventsTime[index].date.getMonth() &&
                        this.date.getDate() == this.eventsTime[index].date.getDate())
                {
                    var eventTimeLeft = this.eventsTime[index].date.getHours()*60 + this.eventsTime[index].date.getMinutes();;
                    var eventTimeRight = eventTimeLeft + this.eventsTime[index].long
                    if ((timeLeft <= eventTimeLeft && timeRight > eventTimeLeft) || (timeLeft < eventTimeRight && timeRight >= eventTimeRight))
                        asEvent = true;
                }
            }
            currentDay.append($(template
                .replace('{0}',this.date.getFullYear() + "." +  this.date.getMonth() + "." + this.date.getDate() + " " +
                        (hour >= 10? hour : '0' + hour) +":" + (min >= 10? min:'0'+min)).replace('{1}',10*j)
                .replace('{2}',this.pxPerItem - 1)
                .replace('{3}',asEvent?"ui-timeline-event":"")));
        }
        this.itemsContainer.append(currentDay);
    }
    this.date.setDate(this.date.getDate() - this.days + 1);

    var selectItem = function(item)
    {
        item.addClass("ui-timeline-selected");
    }

    var releaseItems = function()
    {
        $(".ui-timeline-selected").removeClass("ui-timeline-selected");
    }

    var currentObject = this;
    $(".ui-timeline-items__bar__item").bind("mouseover",function(e)
    {
        e = e || window.event;
        if (e.button > 0 || e.which > 0)
        {
            currentObject.selectedTime.push($(this).attr('time'));
            selectItem($(this));
        }
    }).bind('click keypress mousedown', function(e)
        {
            e = e || window.event;
            if (!e.ctrlKey && !e.altKey && !e.shiftKey)
            {
                currentObject.selectedTime = [];
                releaseItems();
            }
                currentObject.selectedTime.push($(this).attr('time'));
                selectItem($(this));

        });
};

UITimeLine.prototype.setEvent = function(date, longInMinutes, event)
{
    this.eventsTime.push(
        {
            date:date,
            long:longInMinutes,
            event:event
        }
    );
};

UITimeLine.prototype.clearEvent = function(date)
{
    this.eventsTime = [];
};

UITimeLine.prototype.getEvents = function()
{
    return this.eventsTime;
};

UITimeLine.prototype.getSortedSelectedTimes = function()
{
    this.selectedTime.sort();
    return this.getSelectedTimes();
};

UITimeLine.prototype.getSelectedTimes = function()
{
    return this.selectedTime;
};

UITimeLine.prototype.checkLocalStorage = function()
{
    try {
        return 'localStorage' in window && window['localStorage'] != null && localStorage != undefined;
    } catch (e) {
        console.log("localStorage недоступен");
        return false;
    }
};

UITimeLine.prototype.saveEventsToLocalStorage = function()
{
    if (!this.checkLocalStorage()) return false;
    for (var i in this.eventsTime)
    {
        localStorage.setItem("timeEvent" + i, JSON.stringify(this.eventsTime[i]));
    }
};

UITimeLine.prototype.loadEventsFromLocalStorage = function()
{
    if (!this.checkLocalStorage()) return false
    var i = 0;
    while (("timeEvent"+i) in localStorage && localStorage["timeEvent"+i] != null)
    {
        this.eventsTime.push(JSON.parse(localStorage["timeEvent" + i]));
        i++;
    }
};