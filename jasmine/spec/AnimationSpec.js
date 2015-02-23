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

      it("should set proper fields", function() {
        canvas_temp = document.createElement('canvas')
        canvas_temp.setAttribute('id', 'canvas_temp')
        document.body.appendChild(canvas_temp)
        setGL('canvas_temp')
        agl = document.createElement('div')
        agl.setAttribute('id', 'agl')
        document.body.appendChild(agl)

        animation.run();

        expect(animation.runs).toEqual(true);
      });

    });

  });

});
