/**
@module Physics
*/
Physics = function(parent){
	MObject.call(this,parent)
}
Physics.prototype =  Object.create(MObject.prototype);
Physics.prototype.constructor = Physics
Body = function(parent,kind){
	MObject.call(this,parent)
}
Body.prototype =  Object.create(MObject.prototype);
Body.prototype.constructor = Body