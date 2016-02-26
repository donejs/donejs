@page SettingUp Setting Up DoneJS
@parent DoneJS
@hide sidebar
@outline 2 ol
@description На этой странице содержится информация о настройке DoneJS. Вы настроите все необходимые зависимости перед установкой DoneJS, эта информация не содержится в быстром старте или более подробном гайде. 

DoneJS официально поддерживает:

 - [Node](https://nodejs.org) 0.10.x, 0.12.x, and IOjs
 - [npm](https://www.npmjs.com/) 2.x

Мы сделаем поддержку [Node 4.0 and npm 3.0 version](https://github.com/donejs/donejs/issues/376) максимально скоро.

@body

## Windows

### Предустановки

Это поможет вам установить DoneJS на Windows. Чтобы использовать DoneJS вам понадобится C++ компилятор (для нативных приложений). Для начала вам нужна последняя версия [Node.js](https://nodejs.org/en/). DoneJS официально поддерживает Node 0.10.x, 0.12.x, and IOjs, но другие версии должны также работать.

#### Управление пакетами

В этом гайде мы будем использовать [chocolatey](https://chocolatey.org/) для установки нужных пакетов. Вы можете не использовать chocolatey, и установить все зависимости с помощью Windows установщиков, но мы будем использовать потому что это облегчает многие вещи.

После установки chocolatey, следуя инструкциям [на главной странице](https://chocolatey.org/) **откройте административную консоль** и переходите к следующему шагу.

#### Python 2.x

Нативные зависимости Node.js устанавливаются с помощью [node-gyp](https://github.com/nodejs/node-gyp) который использует Python. Он ожидает Python 2.x:

```shell
choco install python2 -y
```

#### Windows SDK

Теперь нам нужен Windows SDK. Мы будем использовать Windows 7, но вы можете изменить версию Windows которую вы используете:

```shell
choco install windows-sdk-7.1 -y
```

#### Visual Studio Express

Установка Visual Studio Express даст нам C++ компилятор:

```shell
choco install visualstudioexpress2013windowsdesktop -y
```

### Переменные среды

Чтобы включить режим production вам нужно установить переменную среду `NODE_ENV`. В зависимости от той консоли которую вы используете, вы можете сделать это двумя способами:

**Command Prompt**

```
set NODE_ENV=production
```

**Powershell**

```
$env:NODE_ENV="production"
```

## Mac OS X

### Предустановки

Чтобы DoneJS работал на OS X вам понадобится Xcode command line tools которую вы можете получить набрав:

```shell
xcode-select --install
```

Чтобы создавать iOS приложения, после установки Node, установите `ios-sim` пакет:

```
npm install -g ios-sim
```

## Debian / Ubuntu

Установка на Debian / Ubuntu занимает немного больше времени потому что версия Node меньше, чем версия поддерживаемая DoneJS (как и все приложения основанные на Node).

### Предустановки

Вместо установки Node.js из репозитория мы рекомендуем использовать PPA. Для начала установите `curl` если у вас он еще не установлен:

```
sudo apt-get install curl
```

Добавьте PPA в ваш source list:

```
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
```

Установка Node.js:

```
sudo apt-get install nodejs
```

Важно также установить `build-essential` пакеты. Это позволит вам использовать C++ для компиляции нативных приложений:

```
sudo apt-get install build-essential
```
