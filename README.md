Online Tile Map Editor [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
======================

A web based tile map editor for all kinds of 2d games and applications.  
**Open source under the [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.**  
**Live Demo: [http://elias-schuett.de/git/Online-Tile-Map-Editor/](http://elias-schuett.de/git/Online-Tile-Map-Editor/)**  

Please note that this is just a hobby project with no set goals to finish it in the future. Also the code is a little messy here and there and could use some thorough optimizations.

----

![preview](http://elias-schuett.de/img/content/online-tile-map-editor.png)

##Features

###### Implemented
  
  * Menubar
  * Tileset handling
  * Layer handling
  * Drawing
  * Fancy UI

###### In Progress

  * Animated tiles `(for a more alive environment)`
  * Viewport `(for in-game effects e.g. parallax)`
  * Tools `(select, fill, flip/rotate, ...)`
  * Save/Load `(JSON, XML, ...)`


##Dependencies

  * **[HTML5 FileReader API](http://www.w3.org/TR/FileAPI/#dfn-filereader)** [1]
  * **[jQuery](http://jquery.com/), [jQuery UI](http://jqueryui.com/)**
  * **[Underscore.js](http://underscorejs.org/)**, **[RequireJS](http://requirejs.org/)**


######Browser Support

  * Google Chrome
  * Mozilla Firefox
  * Opera (latest)
  * Internet Explorer 9+ [2]

Version info will be added soon.

[1] Ajax is used as a fallback solution  
[2] No alpha definition support (yet)


##How to Contribute

1. Install [**git**](http://git-scm.com/), [**node**](http://nodejs.org/)  and [**grunt-cli**](http://gruntjs.com/getting-started) and fork this repo:  
   `git clone https://github.com/elias94xx/Online-Tile-Map-Editor.git`
3. Enter the direcotry:  
   `cd Online-Tile-Map-Editor`
3. Install grunt and its plugins to your directory:  
   `npm install`
4. Once you've made your changes, run grunt to minify all css/js files inside the `src` directory:  
   `grunt`

Also make sure to direct all your pull request to the `pull-requests` branch.
