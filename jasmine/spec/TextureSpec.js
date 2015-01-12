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

});
