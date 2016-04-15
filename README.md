ChromeNewTab
============

A chrome extension that replaces the new tab.

Plugin format:  
This should be valid JSON.  
```
  {
    "name": "displayName",
    "desc": "message",
    "author": "name",
    "version": "ver",
    "preserveSettings": true,
    "settings": [],
    "dependencyCode": "(function () {})()",
    "js": {
      "init": "(function () {})()",
      "global": "(function () {})()",
      "main": "(function () {})()",
      "secondary": "(function () {})()"
    },
    "css": {
      "main": "cssText",
      "secondary": "cssText",
    },
    "html": {
      "main": {
        "querySelector": "htmlToAdd"
        ...
      },
      "secondary": {
        "querySelector": "htmlToAdd"
        ...
      }
    }
  }
```
- `name`: what it is
- `desc`: what it does
- `author`: self-explanatory
- `version`: self-explanatory
- `preserveSettings`: whether or not settings should be preserved after plugin update. If the settings array has been modified in an update, this should be false
- `settings`: array of objects, format described below
- `dependencyCode`: a stringified IIFE, is eval'd before the `js.global` function below. The bundler places all dependencies here

These objects should be generated by the bundler.
Each of them also has a `global` property, which is executed/added on every page.
- `js`: all functions are stringified IIFEs
  - `init`: executed when the plugin is added
  - `main`: executed in the main page, is passed this plugin object
  - `secondary`: executed in the options page
- `css`: the css from each property will be added to it's respective view
- `html`: every property targets a view. For every view, `htmlToAdd` will be added at the position specified by the `querySelector`. There can be multiple `querySelector`s

Plugin `package.json` format:  
This file is used by `npm`, by `babel`, and by the bundler.  
Paths are relative to the `package.json`'s directory.
```
  {
    "name": "displayName",
    "description": "message",
    "author": "name",
    "version": "ver",
    "preserveSettings": true,
    "settings": [],
    "dependencies": {},
    "babel": {},
    "html": {
      "main": {
        "path/to/file1.html": "querySelector1",
        "path/to/file2.html": "querySelector2"
        ...
      },
      "secondary": {
        "path/to/file1.html": "querySelector1",
        "path/to/file2.html": "querySelector2"
        ...
      },
      "global": {
        "path/to/file1.html": "querySelector1",
        "path/to/file2.html": "querySelector2"
        ...
      }
    },
    "css": {
      "main": ["path/to/file1.css", "path/to/file2.css", ...],
      "secondary": ["path/to/file3.css", "path/to/file4.css", ...],
      "global": ["path/to/file5.css", "path/to/file6.css", ...]
    },
    "js": {
      "main": ["path/to/file1.js", "path/to/file2.js", ...],
      "secondary": ["path/to/file3.js", "path/to/file4.js", ...],
      "global": ["path/to/file5.js", "path/to/file6.js", ...],
      "init": ["path/to/file7.js", "path/to/file8.js", ...]
    }
  }
```
- `name`: see above
- `description`: equivalent of `desc` above
- `author`: see above
- `version`: see above
- `preserveSettings`: see above
- `settings`: see above
- `dependencies`: npm's dependencies field
- `babel`: babel config
- `html`: each property represents a view. For each view, there are html files associated with a query selector. The html will be inserted in the element obtained from the selector
- `css`: each property represents a view. The css files for each view are concatenated, and the merged data is appended to a stylesheet after the html has been inserted
- `js`: each property represents a position. The positions are described above. Similar to the css files, all the js files are concatenated (in order of appearance), and the resulting script is executed at its respective position

Setting format:
```
  {
    "name": "displayName",
    "desc": "message",
    "type": "type",
    "value": undefined,
    "isVisible": true
  }
```
- `name`: title of setting
- `desc`: description of setting
- `type`: what kind of input tag is necessary. (number, text, checkbox, radiobox, etc)
- `value`: undefined until set
- `isVisible`: if false, it means this 'setting' is just storage

Button format:
```
  {
    "imagePath": "path",
    "href": "ref",
    "text": "text",
    "position": 0,
    "hotkey": "K",
    "openInNew": false
  }
```
- `imagePath`: path to image
- `href`: where does it point to
- `text`: displyed text
- `position`: used to determine order of buttons
- `hotkey`: using alt+key triggers the button
- `openInNew`: if true, opens the link in a new tab that replaces the current one

Color Scheme format:
```
{
  // Orange is default
  lighten5: "#fff3e0",
  lighten4: "#ffe0b2",
  lighten3: "#ffcc80",
  lighten2: "#ffb74d",
  lighten1: "#ffa726",
  main: 		"#ff9800",
  darken1: 	"#fb8c00",
  darken2: 	"#f57c00",
  darken3: 	"#ef6c00",
  darken4: 	"#e65100",
  accent1: 	"#ffd180",
  accent2: 	"#ffab40",
  accent3: 	"#ff9100",
  accent4: 	"#ff6d00",
  isDark: false
}
```

### Using the plugin bundler
- Run `npm init` in the plugin's folder and fill out the info
- Use `npm install --save` to add your dependencies
- Add the `html`, `css` and `js` sections described above
- Add the `babel` config
- Run the bundler (`bundler.js`) with `node`, the first argument being the plugin folder

The resulting .js file can be found in `$PWD/build/nameOfPlugin-plugin.js`.

## reddit API
This API is used in [/plugins/reddit.js](https://github.com/slak44/ChromeNewTab/tree/master/plugins/reddit.js).  
The page will perform GET requests for the user data associated with the given username.
## License
[CC-BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
