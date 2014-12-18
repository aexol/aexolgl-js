describe("Indexer", function() {
  var indexer;

  beforeEach(function() {
    indexer = new Indexer();
  });

  it("should create empty indexer", function() {
    expect(indexer.unique).toEqual([]);
    expect(indexer.indices).toEqual([]);
    expect(indexer.map).toEqual({});
  });

  describe("#add function", function() {

    it("should add value to indexer map and unique", function() {
      var a = 1;
      var b = 2;
      indexer.add(a);
      expect(indexer.map[JSON.stringify(a)]).toEqual(0);
      indexer.add(b);
      expect(indexer.map[JSON.stringify(b)]).toEqual(1);
      expect(indexer.unique).toEqual([a, b]);
    });

  });

});
