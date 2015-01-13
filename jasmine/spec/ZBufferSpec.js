describe("ZBuffer", function() {
  var zbuffer;

  beforeEach(function() {
    zbuffer = new ZBuffer();
  });

  it("should create ZBuffer with default parameters", function() {
    expect(zbuffer.width).toEqual(1024);
    expect(zbuffer.height).toEqual(1024);
  });

  it("should create ZBuffer buffer with parameters from zbuffer", function() {
    expect(zbuffer.buffer.width).toEqual(zbuffer.width);
    expect(zbuffer.buffer.height).toEqual(zbuffer.height);
  });

  it("should create ZBuffer texture with parameters from zbuffer", function() {
    expect(zbuffer.texture.width).toEqual(zbuffer.width);
    expect(zbuffer.texture.height).toEqual(zbuffer.height);
    expect(zbuffer.texture.complete).toEqual(0);
  });

});
