describe("Fog", function() {
  var fog;

  beforeEach(function() {
    fog = new Fog();
  });

  it("should create Fog with default parameters", function() {
    expect(fog.settings.zMinMax).toEqual([ 0, 100 ]);
    expect(fog.settings.intensity).toEqual(1);
    expect(fog.settings.color).toEqual([0.1, 0.3, 0.9]);
  });

  it("should change fog settings", function() {
    fog.settings.zMinMax = [1, 200];
    fog.settings.intensity = 2;
    fog.settings.color = [0.3, 0.2, 0.4];

    expect(fog.settings.zMinMax).toEqual([ 1, 200 ]);
    expect(fog.settings.intensity).toEqual(2);
    expect(fog.settings.color).toEqual( [0.3, 0.2, 0.4] );
  });

  it("should create Fog with no children", function() {
    expect(fog.children).toEqual([]);
  });

  describe('#draw function', function() {

    it("should add fog settings to uniforms", function() {
      var uniforms = {tiling: [1.0, 1.0], material: {}};
      fog.draw(uniforms);
      expect(uniforms.fog).toEqual(fog.settings);
    });

    it("should run draw function for each children", function() {
      fog2 = new Fog();
      fog.addChilds(fog2);

      spyOn(fog2, 'draw');

      fog.draw();

      expect(fog2.draw).toHaveBeenCalled();
    });

  });


});
