/**
@module Fog
*/
/**
@class Fog
@extends MObject
@constructor
@param tableOptions {Dict} fog options
@example
	fog = new Fog({
		zMinMax:[0.0,100.0],
		intensity:1.0,
		color:[0.1,0.3,0.9]
	})
*/
Fog = function(tableOptions){
	MObject.call(this)
    this.settings = {
        zMinMax:[0.0,100.0],
		intensity:1.0,
		color:[0.1,0.3,0.9]
    }
}
Fog.prototype =  Object.create(MObject.prototype);
Fog.prototype.constructor = Fog
Fog.prototype.draw = function(uniforms){
	var dic = uniforms || {}
	dic["fog"] = this.settings
	for( var child in this.children ){
		this.children[child].draw(dic)
	}
}