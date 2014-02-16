## UIFormStorage.js

JQuery плагин, сохраняющий данные c формы в localStorage и позволяющий восстанавливать из localStorage

 Для своей работы использует префикс, определенный в переменной: storageNamespace

 Для работы необходимо каждому элементу формы, за которым необходимо следить (input\select и т.д.) добавить аттрибут data-id с уникальным значением.
 Элементы формы без data-id отслеживаться не будет. input type=password также не отслеживаются

## Demo
http://xnimorz.github.io/UIFormStorage.js/DEMO/


## Тестировался

Chrome\Opera\Mozilla\Safari
IE10+

## Использование

Для работы с данным плагином, необходимо подключить JQuery версии 1.8 и выше, подключить плагин -
UIFormStorage.js

Стандартное использование предполагает верстку по типу

````html
<form class="test-form" method="get">


        <!-- input -->
        <input type="text" data-id="login" name="login"/>
        <input type="text" data-id="user-name" name="userName"/>
        <!-- В отличие от первых два - данный аттрибут не осталеживается, так как ему не установлен data-id -->
        <input type="text" name="userAge"/>
        <input type="password" name="pass"/>

        <!-- select -->
        <select data-id="select" name="select">
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
        </select>
        <!-- Аналогично поддерживаются и select с аттрибутом multiple -->


        <!-- checkbox -->
            <input type="checkbox" name="check" data-id="check1" value="1" id="check1">
            <label for="check1">First</label>
            <input type="checkbox" name="check" data-id="check2" value="2" id="check2">
            <label for="check2">Second</label>
            <input type="checkbox" name="check" data-id="check3" value="3" id="check3">
            <label for="check3">Third</label>


    </form>
````

Стандартный вызов:
````javascript
$(".test-form").UIFormStorage();
````

Поддерживаемые параметры:
````html
  onSave {Function} - функция-обработчик после сохранения данных в localStorage - принимает DOM ноду, в которой произошли изменения
  onLoad {Function} - функция-обработчик после загрузки данных на форму
  onReset {Function} - функция вызываемая после очищения localStorage
````

Параметры передаются в виде JSON объекта:

Пример вызова с перечислением СТАНДАРТНЫХ параметров:
````javascript
$(".test-form").UIFormStorage({
    onSave: function(changedInput){},
    onLoad: function(){},
    onReset: function(){}
});
````

Управление localStorage:
````javascript
$(".test-form").UIFormStorageClear();
````
Очищает данные из localStorage.
При вызове:

````javascript
$(".test-form").UIFormStorageClear(true);
````
Очистит форму



