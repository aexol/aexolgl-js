describe("Texture", function() {
  var texture;

  it("should create Texture with default parameters", function() {
    texture = new Texture();

    expect(texture.binded).toEqual(false);
    expect(texture.format).toEqual(6408);
    expect(texture.type).toEqual(5121);
  });

  it("should create Texture with parameters from options", function() {
    texture = new Texture({format: 123, type: 555});

    expect(texture.format).toEqual(123);
    expect(texture.type).toEqual(555);
  });

  describe('#handle function', function() {

    it('should call handleAtlas if isAtlas', function() {
      texture = new Texture();
      texture.isAtlas = true;

      spyOn(texture, 'handleAtlas');

      texture.handle();
      expect(texture.handleAtlas).toHaveBeenCalled();
    });

    it('should call handle2DTexture unless isAtlas', function() {
      texture = new Texture();
      texture.isAtlas = false;

      spyOn(texture, 'handle2DTexture');

      texture.handle();
      expect(texture.handle2DTexture).toHaveBeenCalled();
    });

  });

});
