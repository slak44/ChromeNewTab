'use strict';
var startOfCircle = ($(window).width()-800)/2;
var buttons = {
  saveOptions:  new Button(undefined, undefined, "Save Options", true),
  savePlugins:  new Button(undefined, undefined, "Save Plugins", true),
  addPlugin:    new Button(undefined, undefined, "Add Plugin", true),
  removePlugin: new Button(undefined, undefined, "Remove Plugin", true)
};

var list = byId("pluginList");
list.style.width = (startOfCircle-40/*Padding*/)+"px";
byId("circle").style.left = startOfCircle+"px";
byId("messageDisplay").style.left = startOfCircle+"px";

addButtons();
populatePluginList();

buttons.addPlugin.setOnClick(function() {
  byId("fileInput").addEventListener('change', handlePlugin, false);
  $("#fileInput").click();
});
buttons.removePlugin.setOnClick(function() {
  removePlugin(prompt("Enter the name of the plugin to remove:"));
});
buttons.saveOptions.setOnClick(function() {
});
buttons.savePlugins.setOnClick(function() {
  chrome.storage.local.set(
    {"storedPlugins": plugins},
    function() {

    }
  );
});

function handlePlugin(event) {
  var file = event.target.files;
  var reader = new FileReader();
  reader.onload = (function(fileIn) {
    return function(e) {
      if (fileIn.type !== "application/javascript") {
        alert("Please choose a .js file.");
        return;
      }
      plugins.push(new Plugin(e.target.result, fileIn.name));
      list.appendChild(plugins[plugins.length-1].getDisplay());
    }
  })(file[0]);
  reader.readAsText(file[0]);
}

function removePlugin(pluginName) {
  if ($.type(pluginName) != "string") new Error("Plugin name must be a string.");
  for (var i = 0; i < plugins.length; i++) {
    if (plugins[i].title == pluginName) {
      list.removeChild(plugins[i].display);
      plugins.splice(i, plugins[i]);
    }
  }
}

function addButtons() {
  var i = 0;
  for (var key in buttons) {
    document.body.appendChild(buttons[key].aHref);
    buttons[key].aHref.style.top = i * (50/*Button height*/ + 10/*Space between btns*/) + "px";
    i++;
  }
}

function populatePluginList() {
  for (var i = 0; i < plugins.length; i++) list.appendChild(plugins[i].getDisplay());
}
