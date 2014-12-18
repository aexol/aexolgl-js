describe("Animation", function() {
  var gameobject;
  var animation;

  beforeEach(function() {
    gameobject = jasmine.createSpyObj('gameobject', ['addAnimation']);
  });

  describe("default values", function() {

    beforeEach(function() {
      animation = new Animation(gameobject);
    });  

    it("should initialize with default values", function() {
      expect(animation.runs).toEqual(false);
      expect(animation.to).toEqual({});
      expect(animation.from).toEqual({});
      expect(animation.type).toEqual("standard");
      expect(animation.interval).toEqual({});
      expect(animation.keyOptions).toEqual(["loops","onComplete","r"]);
      expect(animation.settings.loops).toEqual(1);
    });

    it("should set parent and run addAnimation on parent", function() {
      expect(animation.parent).toEqual(gameobject);

      expect(gameobject.addAnimation).toHaveBeenCalled();
    });

  });

  describe("with options", function() {

    beforeEach(function() {
      animation = new Animation(gameobject, 500, {loops: 10, r: 'lorem', x: 100, y: 20});
    });

    it("should initialize with options", function() {
      expect(animation.settings.r).toEqual('lorem');
      expect(animation.settings.loops).toEqual(10);
      expect(animation.to.x).toEqual(100);
      expect(animation.to.y).toEqual(20);
      expect(animation.time).toEqual(500*(60/1000));
    });

    describe("#run function", function() {

      beforeEach(function() {
        animation = new Animation(gameobject);
      });

      xit("should set proper fields", function() {
        spyOn(gl, 'frame').and.returnValue(100);

        animation.run();

        expect(animation.runs).toEqual(true);
        expect(animation.start).toEqual(100);
        expect(animation.end).toEqual(100 + animation.time);
      });

    });

    describe('#execute function', function() {

      xit("execute")

    });

  });


  

});
