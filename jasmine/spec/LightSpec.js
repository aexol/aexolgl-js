describe("Light", function() {
  var light;

  beforeEach(function() {
    light = new Light();
  });

  it("should create light object with default values", function() {
    expect(light.ssse).toEqual(0);
    expect(light.lights[0].attenuation).toEqual(20);
    expect(light.lights[0].intensity).toEqual(1);
    expect(light.lights[0].color).toEqual([1.0, 1.0, 0.0]);
    expect(light.lights[0].shadow).toEqual(false);
    expect(light.lights[0].lightType).toEqual(1);
  });

  describe('#draw function', function() {

    it("should add light settings to uniforms", function() {
      var uniforms = {tiling: [1.0, 1.0], material: {}};
      light.draw(uniforms);
      expect(uniforms.light).toEqual(light.settings);
    });

    it("should run draw function for each children", function() {
      light2 = new Light();
      light.addChilds(light2);

      spyOn(light2, 'draw');

      light.draw();

      expect(light2.draw).toHaveBeenCalled();
    });

  });

});
