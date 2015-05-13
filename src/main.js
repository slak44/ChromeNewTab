'use strict';
document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', '<style id="plugin-css"></style>');
var pluginCss = byId('plugin-css');
var identity = 'Main page';
var mainButtons = [
  new Button('assets/gmail.png', 'https://mail.google.com/mail/?authuser=0', 'Gmail'),
  new Button('assets/youtube.png', 'https://www.youtube.com/?gl=RO&authuser=0', 'Youtube'),
  new Button('assets/translate.png', 'https://translate.google.com/?hl=en&authuser=0', 'Translate'),
  new Button('assets/reddit.png', 'https://www.reddit.com', 'Reddit'),
  new Button('assets/github.png', 'https://github.com/', 'GitHub'),
  new Button('assets/lolnexus.png', 'http://www.lolnexus.com/EUNE/search?name=slak44&region=EUNE', 'LoLNexus'),
  new Button('assets/extensions.png', undefined, 'Extensions')
];

storage.loadSettings(onSettings, function () {window.location.replace('/settings.html')});
storage.loadPlugins(executePluginsOnLoad, function () {});

function executePluginsOnLoad() {
  for (var p in plugins) {
    console.log('Executing plugin: ' + plugins[p].name);
    eval(plugins[p].code);
  }
}

function onSettings() {
  for (var i = 0; i < mainButtons.length; i++) {
    mainButtons[i].aHref.style.top = i * (75/*Button height*/ + 10/*Space between btns*/) + 'px';
    if (mainButtons[i].name === 'Extensions')
      mainButtons[i].aHref.addEventListener('click', function (e) {window.location.replace('chrome://extensions')});
  }
  byId('title').innerHTML = settings['Main page title'].value;
  byId('date').innerHTML = new Date().toLocaleString('intl', {year:'numeric', month: 'long', day:'2-digit'});
  setTime();
  function setTime() {
    byId('time').innerHTML = new Date().toLocaleTimeString().slice(0, -3);
    setTimeout(setTime, 1000);
  }
}