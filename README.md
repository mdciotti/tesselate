Tesseract Tile Engine
=====================

Tesseract is a 2D tilemap engine written in Javascript. It is comprised of several modules:

+ *tesseract-world* - Stores world data in layers and provides an interface to accessing and manipulating the world data
+ *tesseract-layer* - Provides methods to add and remove tiles from a layer
+ *tesseract-scene* - Abstracts the rendering code
+ *tesseract-canvas2d* - Renders the tilemap to an HTML5 canvas
+ *tesseract-webgl* - Renders the tilemap to a WebGL context
+ *tesseract-util* - Contains several common methods used in tesseract

Please note: tesseract is in active and volatile development; it is not intended to be used in any production environments for now.

Building
--------

This project uses [Browserify](http://browserify.org/) to compile all source scripts into a single browser-ready bundle.

To build tesseract for development, I use [beefy](http://didact.us/beefy/). To test in a browser, simply run the following command in a terminal where [npm](https://www.npmjs.com/) is available and then navigate to [127.0.0.1:9966](http://127.0.0.1:9966).

```
npm run serve
```

To build tesseract for production, use `npm run build`.

To-do
-----

* Use chunked map loading
* Implement sparse array storage
* Implement continuous (infinite) worlds
* Write WebGL renderer
* Implement level saving/export/import
* Rebuild local edge/corner cache on world edit

Thanks
------

* [David Michael](http://www.gamedev.net/page/resources/_/technical/game-programming/tilemap-based-game-techniques-handling-terrai-r934)

Helpful Links
-------------

* http://www.metanetsoftware.com/technique/tutorialA.html#section1
* http://higherorderfun.com/blog/2012/05/20/the-guide-to-implementing-2d-platformers/
* https://www.youtube.com/playlist?list=PL006xsVEsbKjSKBmLu1clo85yLrwjY67X

Resources
---------

* https://github.com/mikolalysenko/ndarray
* https://github.com/hughsk/ndarray-continuous
* https://github.com/hughsk/continuous-observer
* https://github.com/hughsk/game-modules/wiki/Modules
* https://github.com/andrewrk/chem
* https://github.com/maxogden/level.js
* https://github.com/chrisdickinson/collide-2d-tilemap
* https://github.com/andrewrk/node-tmx-parser/blob/master/index.js

* http://www-cs-students.stanford.edu/~amitp/gameprog.html
* http://crtrdg.com/
* https://gist.github.com/maxogden/9557700#file-index-js
* https://www.npmjs.org/package/cave-automata-2d

License
-------

The MIT License (MIT)

Copyright (c) 2015 Maxwell Ciotti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.