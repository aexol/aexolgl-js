describe("Buffer", function() {
  var buffer;

  beforeEach(function() {
    buffer = new Buffer('target', 'type');
  });

  it("should create buffer with target and type", function() {
    expect(buffer.target).toEqual('target');
    expect(buffer.type).toEqual('type');
    expect(buffer.buffer).toEqual(null);
    expect(buffer.data).toEqual([]);
  });

  describe("#compile function", function() {

    xit("should add value to buffer map and unique", function() {
     
    });

  });

});
