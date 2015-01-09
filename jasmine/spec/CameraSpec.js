describe("Camera", function() {
  var camera;

  beforeAll(function() {
    canvas_temp = document.createElement('canvas')
    canvas_temp.setAttribute('id', 'canvas_temp')
    document.body.appendChild(canvas_temp)
    setGL('canvas_temp')
    agl = document.createElement('div')
    agl.setAttribute('id', 'agl')
    document.body.appendChild(agl)
  });

  it("should create new camera with parameters ", function() {
    camera = new Camera();
    spyOn(camera, 'setDisplay');

    expect(camera.position).toEqual(new Vector(0, 0, 0));
    expect(camera.positionBefore).toEqual(new Vector());
    expect(camera.rotation).toEqual(new Vector(0, 0, 0));
    expect(camera.forwardStep).toEqual(0.0);
    expect(camera.sideStep).toEqual(0.0);
    expect(camera.upStep).toEqual(0.0);
    expect(camera.factor).toEqual(0.09);
    expect(camera.forwardReduce).toEqual(1.0);
    expect(camera.name).toEqual('camera');
    expect(camera.sensitivity).toEqual(0.5);
    expect(camera.yawStep).toEqual(0.0);
    expect(camera.pitchStep).toEqual(0.0);
    expect(camera.mesh).toEqual(null);
    expect(camera.background).toEqual(null);
    expect(camera.tempX).toEqual(null);
    expect(camera.tempY).toEqual(null);
    expect(camera.near).toEqual(0.1);
    expect(camera.far).toEqual(100.0);
    expect(camera.angle).toEqual(45.0);
    expect(camera.eC).toEqual(0);
  });

  describe('#setCameraPosition function', function() {

    it('should set new position and call setDisplay', function() {
      camera = new Camera();
      spyOn(camera, 'setDisplay');

      camera.setCameraPosition([1, 2, 3]);

      expect(camera.position).toEqual([1, 2, 3]);
      expect(camera.setDisplay).toHaveBeenCalled();
    });

  });

  describe('#forward function', function() {

    it("should return true if parameter is 0.0", function() {
      camera = new Camera();

      expect(camera.forward(0.0)).toEqual(true);
    });

    it("should change positions", function() {
      camera = new Camera();

      camera.forward(5);

      expect(camera.position.x).toEqual(0);
      expect(camera.position.y).toEqual(0);
      expect(camera.position.z).toEqual(-5);
    });

  });

  describe('#side function', function() {

    it("should return true if parameter is 0.0", function() {
      camera = new Camera();

      expect(camera.side(0.0)).toEqual(true);
    });

    it("should change positions", function() {
      camera = new Camera();

      camera.side(5);

      expect(camera.position.x).toEqual(-5);
      expect(camera.position.y).toEqual(0);
      expect(camera.position.z).toEqual(0);
    });

  });

  describe('#updown', function() {

    it('should return true if parameter is 0.0', function() {
      camera = new Camera();

      expect(camera.updown(0.0)).toEqual(true);
    });

  });

});
