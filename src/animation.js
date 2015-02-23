/**
All animations are executed during window.logic loop
@module Animation
*/
/**
Class for animating `GameObject`'s to desired state
@class Animation
@constructor
@param parent {GameObject} Parent in render tree
@param time {Int} time in miliseconds
@param [options={}] options of Animation
@example
    var world = new Scene()
    var gameobject = new GameObject(world,{})
    var ani = new Animation(gameobject, 500, {
        x: planet.x + Math.sin(this.angle * Math.degToRad) * (pll - 1),
        y: planet.y + Math.cos(this.angle * Math.degToRad) * (pll - 1),
        onComplete: function (e) {
            e.remove()
        }
    })
    ani.run()
*/
Animation = function(parent,time,options){
	this.parent = parent
	this.runs = false
	this.to = {}
	this.from = {}
	this.type = "standard"
	this.interval = {}
	this.settings = {
		onComplete:function(){},
		loops:1
	}
	this.keyOptions = ["loops","onComplete","r"]
	for(var o in options){
		if( this.keyOptions.indexOf(o) == -1 ){
			var val = options[o]
			this.time = time*(60/1000)
			this.to[o] = val
			this.from[o] = Object.byString(this.parent, o);
			this.interval[o] = (1/this.time)*(val-this.from[o])
		}else{
			this.settings[o] = options[o]
		}
		
	}
	parent.addAnimation(this)
}
Animation.prototype =  Object.create(MObject.prototype);
Animation.prototype.constructor = Animation
/**
Checks if animation should run and fires it when ready.
@private
@method execute
*/
Animation.prototype.execute = function(){
	if(this.runs){
		if(gl.frame < this.end){
			for( var f in this.from ){
				var vi = Object.byString(this.parent,f)+this.interval[f]		
				setDict(this.parent,f,vi)
			}
		}
		else{
			var loop = this.settings.loops
			if( loop == -1){
				this.run()
			}
			else if(loop>1){
				this.settings.loops -= 1
				this.run()
			}
			else if(loop == 1){
				this.runs = false
				this.settings.onComplete(this.parent)
			}
			else{
			}
		}
	}
}
/**
Runs animation
@private
@method run
*/
Animation.prototype.run = function(){
	this.runs = true
	this.start = gl.frame
	this.end = gl.frame +this.time
}
