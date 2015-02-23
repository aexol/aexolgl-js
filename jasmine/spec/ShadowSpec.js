describe("Shadow", function() {
  var shadow;

  it('creates shadow with default params', function() {
    shadow = new Shadow();

    expect(shadow.map.width).toEqual(512);
    expect(shadow.map.height).toEqual(512);
    expect(shadow.far).toEqual(100);
    expect(shadow.near).toEqual(0.1);
  });

  it('creates shadow with params from arguments', function() {
    shadow = new Shadow('scene', 22, 3, 5, 640);

    expect(shadow.map.width).toEqual(640);
    expect(shadow.map.height).toEqual(640);
    expect(shadow.far).toEqual(5);
    expect(shadow.near).toEqual(3);
    expect(shadow.scene).toEqual('scene');
    expect(shadow.position).toEqual(22);
  });

});
