# UIComponents

Демо: http://xnimorz.github.io/UIComponents/

UIComponents - Это бибилиотека различных UI элементов, которые можно использовать (каждый отдельно) в своем проекте.

Каждый компонент находится в своей, отдельной папке - это позволяет заиспользовать его отдельно, как с прилагающимися к нему дефолтными стилями, так и определяя свои.

Минимальный набор элемента при включении в свой проект - JavaScript файл, имя которого соответствует названию компонента (название_компонента.js)
При использовании компонента в максимальной "комплектации" - JavaScript файл + стили выбранного интерфейса (как правило, название состоит из - название_компонента.css)

В списке компонентов присутсвуют:

- UIDropdown - выпадающей контент
- UICarriage - Скрипт каретки (скролла), с возможностью нелинейного изменения состояния. Простой способ создать пользовательский скролл, счетчик, контролл (как горизонтальный, так и вертикальный) (например ввод валюты)
- UIScroll - пользовательский скролл для вертикального\горизонтального скролла
- UIPageScrolling - постраничный скролл (презентационный)
- UIFormStorage - сохранение состояния инпутов формы (в localStorage) при последующей перезагрузке
- UICalendar - календарь (с возможностью настройки выбора года, месяца, дня)
- UIHint - простейший скрипт вывода подсказок интерфейса
- UIPopup - попап открывающийся поверх контента на весь экран с небольшими отступами.