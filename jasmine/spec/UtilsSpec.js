describe("Light", function() {

  describe('#toVector function', function() {

    it("should return new Vector with parameters from arguments", function() {
      v = toVector([1, 2, 3]);
      
      expect(v instanceof Vector).toBeTruthy();
      expect(v.x).toEqual(1);
      expect(v.y).toEqual(2);
      expect(v.z).toEqual(3);
    });

    it("should return new Vector from vector parameters", function() {
      v = new Vector(3, 4, 5);
      v2 = toVector([v]);

      expect(v2 instanceof Vector).toBeTruthy();
      expect(v2.x).toEqual(3);
      expect(v2.y).toEqual(4);
      expect(v2.z).toEqual(5);
    });

    it("should return new Vector from nested argumens", function() {
      v = toVector([[6, 7, 8]]);

      expect(v instanceof Vector).toBeTruthy();
      expect(v.x).toEqual(6);
      expect(v.y).toEqual(7);
      expect(v.z).toEqual(8);
    });

  });

  describe('#powerof2 function', function() {

    it("should return false if argument is 0", function() {
      expect(powerof2(0)).toBeFalsy();
    });

    it("should return true if argument is power of 2", function() {
      expect(powerof2(2)).toBeTruthy();
      expect(powerof2(4)).toBeTruthy();
      expect(powerof2(8)).toBeTruthy();
      expect(powerof2(16)).toBeTruthy();
    });

    it("should return false if argument is not power of 2", function() {
      expect(powerof2(11)).toBeFalsy();
      expect(powerof2(7)).toBeFalsy();
      expect(powerof2(19)).toBeFalsy();
      expect(powerof2(5)).toBeFalsy();
    });

  });

  describe('#trimWhitespace function', function() {

    it("should remove all empty elements", function() {
      arr = ['lorem', 'ipsum', ''];

      trimWhitespace(arr);

      expect(arr).toEqual(['lorem', 'ipsum']);
    });

  });

  describe('#trimString function', function() {

    it("should remove empty spaces from begining of string", function(){
      str = '  lorem';
      expect(trimString(str)).toEqual('lorem');
    });

    it("should remove empty spaces from end of string", function() {
      str = 'lorem  ';
      expect(trimString(str)).toEqual('lorem');
    });

  });

  describe('#compare function', function() {

    it('returns true if arrays are the same', function() {
      a1 = [1, 'a', 4];
      a2 = [1, 'a', 4];

      expect(compare(a1, a2)).toBeTruthy();
    });

    it('returns false if arrays are not the same', function() {
      a1 = [1, 'b', 5];
      a2 = [1, 'a', 4];

      expect(compare(a1, a2)).toBeFalsy();
    });

    it('returns true if arguments are the same', function() {
      a1 = 'a';
      a2 = 'a';
      expect(compare(a1, a2)).toBeTruthy();

      a1 = 1;
      a2 = 1;
      expect(compare(a1, a2)).toBeTruthy();      
    });

    it('returns false if arguments are not the same', function() {
      a1 = 'a';
      a2 = 'b';
      expect(compare(a1, a2)).toBeFalsy();

      a1 = 1;
      a2 = 2;
      expect(compare(a1, a2)).toBeFalsy();
    });

  });

});
