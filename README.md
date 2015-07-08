aexolgl-js
==========
Create browser games to be run on any platform possible and of course expand your 3d business on internet websites. AexolGL Web engine is a open source free 3d game engine. It runs directly on your website without ANY plugins. Display your 3d content on personal or corporate website. Make 3d browser games that work on PC, MAC, Linux, Android Code in most popular language in the world - Javascript

Quick Start
==========
Here is a quick example to get started
```javascript
var setup = function() {
  world = new Scene();
  camera = new Camera(0.1, 100, 45)
  camera.setLookAt(new Vector(17,0,0),new Vector(0,0,0),new Vector(0,1,0))
}
var logic = function() {
  if (!gamePaused) {
    // DO SOMETHING RUNTIME
  }
}
var draw = function() {
  world.draw(camera)
}
// agl is canvas id
app = AexolGL("agl",{
  setup:setup,
  logic:logic,
  draw:draw
})
```
