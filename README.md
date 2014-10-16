
Game Engine
===========

To-do
-----

* Implement Browserify + Watchify + Beefy
* Use [Browserify](http://browserify.org/)
* Use [Watchify](https://github.com/substack/watchify)
* Use [Beefy](http://didact.us/beefy/)
* Use chunked map loading
* Only compute physics for chunks with active players
* Only check area around collidable entities for collisions
* Use structs to define tile properties, and reference the same struct multiple times in a map
* Use scripting to define unique tile interactions
* Use world fine coordinates for entities (not tile/offset)
* Use world fine coordinates for view (not tile/offset)
* Look into using quad-trees (for collision?)
* Look into using Box2D or other physics engine
* Look into using Native Client in Chrome
* Write WebGL renderer

Thanks
------

* [David Michael](http://www.gamedev.net/page/resources/_/technical/game-programming/tilemap-based-game-techniques-handling-terrai-r934)



Platforms:
1) If the player collides from the left or right or bottom, ignore the collision.
2) If the player is already overlapping the object then stop performing collision checks until they separate (this is an important but often overlooked detail to avoid some weird bugs when jumping while standing in front of such an object).
3) If the player collides form the top then stop the movement like a normal solid tile collision, unless the player is holding the "fall through" button (sometimes down or such; some games don't allow this at all).

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
