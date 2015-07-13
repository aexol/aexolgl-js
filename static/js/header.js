(function(){
var world, camera, flap, gamePaused, jump, boxes, lastObstacle, lights,currentScore,score;
var unitsToMeters = 0.66
var pause = function() {
  gamePaused = !gamePaused
}
var setup = function() {
  gamePaused = false
  world = new Scene();
  camera = new Camera(0.1, 100, 45)
  camera2 = new Camera(0.1, 100, 45)
  niebo = basicShader({})
  shad = basicShader({
    useLights: true
  })
  lights = new Light([
    //POINT LIGHT
  {
    lightPosition: new Vector(20.0, 20.0, -20.0),
    attenuation: 200.0,
    intensity:1.5,
    color: [1.0, 0.9, 0.9]
  },
  //AMBIENT LIGHT
{
  intensity:0.3,
  lightType: 2.0,
  color: [0.8, 0.8, 0.8]
}
])
obstacles = []
materials = {
  sfera: new Material({
    color: [0.6,0.6,0.5]
  }),
 mat: new Material({
    color: [0.6,0.6,0.5]
  }),
 okobialko: new Material({
    color: [1.0,1.0,1.0]
  }),
}
materials.mat.setParent(shad)
meshes = {}
objects = {}

pivots = {
  wholebird: new Pivot(),
  wholebirdRotate: new Pivot(),
  wing1: new Pivot(),
  wing2: new Pivot(),
  look: new Pivot()
}
shadery = {
  sfera: niebo
}
Mesh.obj("/static/obj/flappy3d.obj", function(e) {
  console.log(e)
  for (var i in e) {

    meshes[i] = e[i].rotate(0, -90, 0)
    if (i != "dol" && i != "gora") {
      objects[i] = new GameObject(world, {
        shader: shadery[i] || shad,
        material: materials[i] || materials.mat,
        light: lights,
        mesh: meshes[i]
      })
      objects[i].aex.centerPivot()
    }
    else{
      meshes[i].setParent(materials.mat)
    }

  }

  for (var i = 0; i < 60; i++) {
    obstacles.push(new Obstacle(meshes.gora,meshes.dol))
  }

  pivots.wing1.add(objects.skrzydlo1).setPivot(new Vector(-0.2,0,0).add(objects.skrzydlo1.position))
  pivots.wing2.add(objects.skrzydlo2).setPivot(new Vector(0.2,0,0).add(objects.skrzydlo2.position))
  pivots.wholebirdRotate.add(objects.bird).add(objects.dziob).add(objects.okobialko).add(objects.okosrodek).add(pivots.wing1).add(pivots.wing2).setPivotToCenter()
  pivots.wholebird.add(pivots.wholebirdRotate).setPivotToCenter()
  sferaPivot = new Pivot()
  sferaPivot.add(objects["sfera"])
  sferaPivot.scale(4.0,4.0,4.0)
},"usemtl")

Obstacle = function (mesh,mesh2,start) {
  var scale = 15.0
  var segHeight = 1.0
  this.index = start
  this.segDown = new Aex()
  this.segDown.setParent(mesh2)
  this.segDown.move(0,-2,0)
  this.segDown.scale(1,scale,1)
  this.down = new Aex()
  this.down.setParent(mesh)
  this.upperPipe = new Pivot()
  this.lowerPipe = new Pivot()
  this.lowerPipe.add(this.down).add(this.segDown)
  this.lowerPipe.setPivotToCenter()
  this.lowerPipe.move(0,-11,0,1)
  this.game = new Pivot()
  this.game.add(this.lowerPipe).add(this.upperPipe).setPivotToCenter()
  this.insert()
}
lastObstacle = {z:100}
Obstacle.prototype.insert = function () {
  var mr = -1+Math.random()*8
  mr = Math.floor(mr)
  var newZ = lastObstacle.z-2
  this.game.y = mr
  this.game.z = newZ
  var ll = Math.random()
  if(ll > 0.75){
    this.movable = true
    this.przes = Math.random()*3
    this.speed = Math.random()*1
  }else{
    this.movable = false
  }
  lastObstacle = this.game
}

Flappy = function () {
  this.game = pivots.wholebird
  this.gameR = pivots.wholebirdRotate
  this.mass = 1.0
  this.velocity = 0.0
  this.imm = false
  this.acceleration = 0.1
}
flap = new Flappy()
function flappyFlap() {
  if(gamePaused){
    restart()
  }
  else{

    if (flap.velocity < -.10 && flap.acceleration<0.02){
      flap.acceleration = .11
      flap.velocity = 0.0
    }
  }
}
gl.canvas.addEventListener("touchstart", function (e) {
  e.preventDefault()
  flappyFlap()
})
gl.canvas.addEventListener("mousedown", function (e) {
  e.preventDefault()
  flappyFlap()
})
camera.setLookAt(new Vector(17,0,0),new Vector(0,0,0),new Vector(0,1,0))
menu = new Scene()
score = new Label(menu, "0","Helvetica", 240).scale(0.25,0.5,0.5)
score.x =3; score.y = 1
currentScore = 0
}
var restart = function(){
  gamePaused= false
  flap.velocity=0.0
  flap.acceleration=0.08
  flap.game.y = 5
  flap.imm = true
  setTimeout(function() {
    flap.imm=false
  }, 500);
  currentScore = 0
      score.text = 0
}
var logic = function() {
  if (!gamePaused) {
    sbfr = Math.floor(currentScore);
    currentScore += 0.01
    satr = Math.floor(currentScore);
    if(satr != sbfr){
      score.text = satr
    }
  for (var o in obstacles) {
    var ob = obstacles[o]
    var zpos = ob.game.z
    var ypos = ob.game
    if (zpos<lastObstacle.z){
      lastObstacle = ob.game
    }
    if (zpos < 40.0) {
      ob.game.z += 0.1
      if(ob.movable){
        ob.game.y = ob.game.y+Math.sin(ob.game.z+ob.przes)*ob.speed
      }
    } else {
      ob.insert()
    }
    //COLLISIONS
    if( !flap.imm ){

    if(Math.abs(ob.game.z-flap.game.z)<1.0){

    if(ob.game.y > flap.game.y+2.8){
      gamePaused = true
    }
    }
    }
  }
  newVel = flap.velocity - 9.81 * 0.00094 +flap.acceleration
  flap.acceleration = flap.acceleration*0.7
  flap.velocity = newVel > -300.0?newVel:flap.velocity
  flap.game.y += flap.velocity
  var nV = (-flap.game.rotX+flap.velocity*300)/3.0
  flap.gameR.rotX = flap.velocity*300

  wingsrot = -flap.acceleration*300*2
  wingsrot = wingsrot<90?wingsrot>-90?wingsrot:-90:90
  pivots.wing1.rotZ = Math.sin(wingsrot*.3)*30
  pivots.wing2.rotZ = -Math.sin(wingsrot*.3)*30
  var pY = (flap.game.y - (camera.position.y-1)) / 5.0
  camera.y += camera.y>(flap.game.y-3)?-0.03:0.03
  }
}
var draw = function() {
  if (!gamePaused) {
    world.draw(camera)
    menu.draw(camera2)
  }
  if(gl.frame == 2){
    world.draw(camera)
  }
}
app = AexolGL("agl",{
  setup:setup,
  logic:logic,
  draw:draw
})
gamePaused=true
})()