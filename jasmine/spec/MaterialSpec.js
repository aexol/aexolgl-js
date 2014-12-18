describe("Material", function() {
  var material;

  beforeEach(function() {
    material = new Material();
  });

  it("should create material object with default values", function() {
    expect(material.compl).toEqual(0);
    expect(material.settings.color).toEqual([1.0, 1.0, 1.0]);
    expect(material.settings.specularWeight).toEqual(1);
    expect(material.settings.mappingType).toEqual(1);
    expect(material.settings.shininess).toEqual(15);
    expect(material.settings.alpha).toEqual(1);
  });

  it("should check settable array", function() {
    expect(Material._settable).toEqual(["color", "specularWeight", "mappingType", "alpha", "shininess"]);
  });

  describe('#setTexture function', function() {

    beforeEach(function() {
      spyOn(material, 'setTexture');
    });

    it("should be called from setDiffuse", function() {
      material.setDiffuse();

      expect(material.setTexture).toHaveBeenCalled();
    });

    it("should be called from setBump", function() {
      material.setBump();

      expect(material.setTexture).toHaveBeenCalled();
    });

    it("should be called from setSpecular", function() {
      material.setSpecular();

      expect(material.setTexture).toHaveBeenCalled();
    });

    it("should be called from setCube", function() {
      material.setCube();

      expect(material.setTexture).toHaveBeenCalled();
    });

  });

});
