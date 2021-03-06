#Утилиты
[Редактор шейдеров - плагин для Chrome](https://github.com/spite/ShaderEditorExtension)

#Работа приложения

В самом начале размещаем все элементы на сцене. Добавляем сцену звездной системы.
Колесом мыши управляем z координатой камеры. Значение координаты управляет видимостью тех или иных объектов. Видимость
этих объектов изменяется в методе update этих объектов. Яркий пример:
```
oortCloud.update = function(){
		if( camera.position.z > 40 && camera.position.z < 600 )
			this.visible = true;
		else
			this.visible = false;
	}
```
Еще точно не знаю в какие моменты вызывается этот метод у разных объектов, точно
не при каждой отрисовке у каждого объекта. Буду уточнять.

Переход к звездной системе происходит по клику на заголовок этой системы. Заголовок - DOMElement, размещенный и перемещаемый
с помощью преобразования его координат, положения камеры в css преобразования transform. "Переход" заключается в том,
чтобы изменить координаты размещения звездной системы (по-умолчанию это Солнце), преобразовать эту солнечную систему в
соответствии со звездой на которую кликнули и переместить камеру к 3D объекту звездной системы. Одна невыясненная до конца
деталь: зачем для отображения звездной системы отдельная сцена, и отдельная камера.

Других переходов в этой демке нет - только управление видимостью ранее созданных объектов в соответствии с z координатой
камеры.

##Старт и инициализация

После загрузки страницы, выполняем функцию start (main.js)

В start проверяем, поддерживает ли браузер WebGL, загружаем картинку с палитрой цветов звезд. После загрузки палитры,
будет вызван коллбек postStarGradientLoaded

В postStarGradientLoaded создается canvas, из которого будут считываться цвета с помощью метода getColor. getColor
заберет из canvas один пиксель, расположение которого будет определятся входным параметром - процентом от высоты шкалы
всего столбца. После определения canvas, вызывается лоадер шейдеров (loadShaders) из списка shaderList. Лоадер и список
определены в файле js/shaderlist.js. После загрузки шейдеров, будет вызван колбек postShadersLoaded.

В postShadersLoaded загружаются данные координат звезд. Каждая звезда представляет собой объект вида:
``{c: 0.656, d: 0.000004848, dec: 0, name: "Sol", ra: 0}``.
После загрузки звезд, инициируем сцену (initScene) и запускаем рендеринг (animate);

В initScene создаем сцену Threejs в переменной ``scene``. К сцене добавляем свет (?) и три объекта, вложенные друг в
друга: ``translating``, ``rotating``, ``galacticCentering``. translating вложен в galacticCentering, который вложен в
rotating.
Тут же создается объект, который рендерит картинку ``renderer``, вешаются обработчики событий мыши и клавиатуры.
После создания объекта, который отрисует сцену, создается объект камеры ``camera``.
Инициируется солнечная система (еще одна сцена и еще одна камера). Она применяется для отображения окрестностей любой
звезды.
Инициируются элементы интерфейса.
buildGUI - ? тут скорее всего тоже что-то интерфейсное инициируется, но непонятно что.

sceneSetup:

 - создаем модель солнца (makeStarModels). Она же будет прототипом для создания других солнечных систем, содержащих до
6 (захардкожено в makeStarModels) субзвезд. Модель солнца (не системы) добавляется к сцене

 - создаются объекты звезд(generateHipparcosStars), все 1000000 (или сколько будет полученно загрузкой stars_all.json),
каждая имеет метод переключения с 3D на спектральный цвет - задействуется кнопочкой слева вверху.

 - создается 3D изображение галактики(generateGalaxy), которое видно при удалении

 - создается 3D солнечной (именно солнечной системы) с деталями: расположением планет, облака Оорта

 - создается сетка в эклиптике галактики (createSpacePlane), видимая при приближении к именованым звездам

initCSS3D: Преобразует данные WebGL камеры в данные отображение маркеров звезд с помощью CSS. Маркеры звезд (marker.js)
используются для перехода к звездной системе.

animate: запускается основной цикл прорисовки приложения. Здесь происходит обновление координат камеры, управление
видимостью DOMElement, в частности маркеров звезд, рендеринг новой картинки и запуск нового цикла отрисовки.

#Используемые three объекты

``scene``				``THREE.Scene``				main.js
						``THREE.AmbientLight``		main.js		добавлена в ``csene``
``rotating``			``THREE.Object3D``			main.js		добавлен в ``csene``
``galacticCentering``	``THREE.Object3D``			main.js		добавлен к ``rotating``
``translating``			``THREE.Object3D``			main.js		добавлен к ``galacticCentering``. Основной объект, к
которому добавляются другие объекты космоса
``renderer``			``THREE.WebGLRenderer``		main.js
``camera``				``THREE.PerspectiveCamera``	main.js		добавлена в ``csene``

#Шейдеры

starsurface - шейдеры тела звезды

#Назначение js файлов

main - инициализация, цикл перерисовки. Ядро приложения.

spacehelpers - функции плавного перемещения, центрирования камеры, наплыва/отъезда камеры при переходе к звездной
системе, пересчет расстояний между еденицами измерения

marker - создание маркеров звезд

plane - создание координатной сетки в эклиптике галактики

dust - создание звездной пыли. Эффект слабо заметен

galaxy - создание модели диска галактики, видимого при максимальном удалении

css3worldspace - преобразование координат камеры и объектов THREE в данные для transform преобразований DOMElement

mousekeyboard - функции считывания действий пользователя

minimap - управление пользовательским интерфесом (?)

starmodel - создание модели-прототипа солнечных систем

sun - создание центральной (или главной) звезды

hipparcos - создание всех звезд, примитивные модели

infocallout - методы для отображения информационных штук: подсветка галактики и температуры звезд в туре, отображение
диаграммы Земля - Солнце

tour - файл со списком координат, времени задержки и времени перехода между ними, описания каждого шага

solarsystem - создание модели системы Солнца. С планетами и прочим

skybox - создание модели звезды, с короной и прочими эффектами
