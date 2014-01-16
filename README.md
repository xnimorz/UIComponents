## UIPageScrolling

JQuery плагин, позволяющий представить web-страницу в виде слайдов.
Поддерживает возможность скролла вверх\вниз влева\вправо.

## Demo
Вертикальный скроллинг - http://xnimorz.github.io/UIPageScrolling/DEMO/UIPageScrolling-Vertical-DEMO.html
Горизонтальный скроллинг - http://xnimorz.github.io/UIPageScrolling/DEMO/UIPageScrolling-Horizontal-DEMO.html

## Тестировался

На последних версиях Chrome\Opera\Mozilla\Safari

## Использование

Для работы с данным плагином, необходимо подключить JQuery версии 1.8 и выше, подключить плагин -
UIPageScrolling.js и добавить таблицу стилей UIPageScrolling.css

Стандартное использование предполагает верстку по типу

<div class=main>
    <section>
        ....
    </section>
    <section>
        ....
    </section>
    <section>
        ....
    </section>
</div>

Стандартный вызов:

$(".main").UIPageScrolling();

Поддерживаемые параметры:
{String} sections : пользовательский селектор (по умолчанию section)</div>
{String} easing : transition-timing-function</div>
{Number} time : время анимации</div>
{Function} beforeMoveFunc : функция, исполняющаяся перед анимацией</div>
{Function} afterMoveFunc : функция, исполняющаяся после анимации</div>
{Boolean} isCyclic : цикличная прокрутка</div>
{Boolean} isVertical : вертикальная\горизонтальная прокрутка</div>
{String} sectionsControl : селектор на выбор слайда</div>
{Boolean} captureKeyboard : захват клавиатуры (управления курсором + Page Up\Down)</div>

Параметры передаются в виде JSON объекта:

Пример вызова с перечислением СТАНДАРТНЫХ параметров:
$(".main").UIPageScrolling({
    sections : "section",
    easing : "ease",
    time : 1000,
    beforeMoveFunc : null,
    afterMoveFunc : null,
    isCyclic : false,
    isVertical : true,
    sectionsControl : null,
    captureKeyboard : false
});

Примеры использования и вызовов в папке DEMO.



