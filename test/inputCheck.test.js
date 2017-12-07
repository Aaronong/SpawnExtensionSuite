let assert = require("assert");
let {
  SpawnID,
  SpawnRandom,
  SpawnString,
  SpawnBoolean,
  SpawnFloat,
  SpawnInteger,
  SpawnLastN,
  SpawnFVG
} = require("../dataTypes");

const str1 = "str";
const str2 = "";
const zero = 0;
const positiveInt = 1;
const negativeInt = -1;
const positiveFloat1 = 0.5;
const positiveFloat2 = 1.5;
const negativeFloat1 = -0.5;
const negativeFloat2 = -1.5;
const bool1 = true;
const bool2 = false;
const list1 = [];
const obj1 = {};
const invalid1 = null;
const invalid2 = undefined;

const FVGdescriptor = {
  name: "Test FVG",
  description: "A field value generator used to test input validation",
  arguments: {
    id: { type: SpawnID },
    rand: { type: SpawnRandom },
    str: { type: SpawnString, defaultValue: "" },
    bool: { type: SpawnBoolean, defaultValue: true },
    float: { type: SpawnFloat, defaultValue: 0.4 },
    int: { type: SpawnInteger, defaultValue: 1 },
    lastN: { type: SpawnLastN(5), defaultValue: [2.2, 4.2, 6.4, 7.2, 10] }
  },
  output: {
    type: SpawnFloat
  },
  generator: ({ id, rand, str, bool, float, int, lastN }) => {
    return 0;
  }
};

let testFVG = SpawnFVG(FVGdescriptor);

/**
 * Creates a list with n copies of an item
 * @param {the element placed into the list} item
 * @param {the length of the created list} n
 */
function makeList(item, n) {
  let list = [];
  for (let i = 0; i < n; i++) {
    list.push(item);
  }
  return list;
}

describe("SpawnID", () => {
  describe("should only accept zero and positive integers", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnID.prototype.isInputValid(str1), false);
      assert.equal(SpawnID.prototype.isInputValid(str2), false);
    });
    it("should not accept booleans", () => {
      assert.equal(SpawnID.prototype.isInputValid(bool1), false);
      assert.equal(SpawnID.prototype.isInputValid(bool2), false);
    });
    it("should not accept floats", () => {
      assert.equal(SpawnID.prototype.isInputValid(positiveFloat1), false);
      assert.equal(SpawnID.prototype.isInputValid(positiveFloat2), false);
      assert.equal(SpawnID.prototype.isInputValid(negativeFloat1), false);
      assert.equal(SpawnID.prototype.isInputValid(negativeFloat2), false);
    });
    it("should not accept negative integers", () => {
      assert.equal(SpawnID.prototype.isInputValid(negativeInt), false);
    });
    it("should accept positive integers", () => {
      assert.equal(SpawnID.prototype.isInputValid(positiveInt), true);
    });
    it("should accept zero", () => {
      assert.equal(SpawnID.prototype.isInputValid(zero), true);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnID.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnID.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnRandom", () => {
  describe("should only accept booleans", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(str1), false);
      assert.equal(SpawnRandom.prototype.isInputValid(str2), false);
    });
    it("should not accept booleans", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(bool1), false);
      assert.equal(SpawnRandom.prototype.isInputValid(bool2), false);
    });
    it("should not accept negative floats", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(negativeFloat1), false);
      assert.equal(SpawnRandom.prototype.isInputValid(negativeFloat2), false);
    });
    it("should not accept positive floats greater than 1", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(positiveFloat2), false);
    });
    it("should accept positive floats lesser than 1", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(positiveFloat1), true);
    });
    it("should not accept negative integers", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(negativeInt), false);
    });
    it("should accept positive integers", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(positiveInt), false);
    });
    it("should accept zero", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(zero), true);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnRandom.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnRandom.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnString", () => {
  describe("should only accept strings", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnString.prototype.isInputValid(str1), true);
      assert.equal(SpawnString.prototype.isInputValid(str2), true);
    });
    it("should not accept booleans", () => {
      assert.equal(SpawnString.prototype.isInputValid(bool1), false);
      assert.equal(SpawnString.prototype.isInputValid(bool2), false);
    });
    it("should not accept floats", () => {
      assert.equal(SpawnString.prototype.isInputValid(negativeFloat1), false);
      assert.equal(SpawnString.prototype.isInputValid(negativeFloat2), false);
      assert.equal(SpawnString.prototype.isInputValid(positiveFloat1), false);
      assert.equal(SpawnString.prototype.isInputValid(positiveFloat2), false);
    });
    it("should not accept integers", () => {
      assert.equal(SpawnString.prototype.isInputValid(negativeInt), false);
      assert.equal(SpawnString.prototype.isInputValid(positiveInt), false);
      assert.equal(SpawnString.prototype.isInputValid(zero), false);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnString.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnString.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnBoolean", () => {
  describe("should only accept booleans", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnBoolean.prototype.isInputValid(str1), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(str2), false);
    });
    it("should accept booleans", () => {
      assert.equal(SpawnBoolean.prototype.isInputValid(bool1), true);
      assert.equal(SpawnBoolean.prototype.isInputValid(bool2), true);
    });
    it("should not accept floats", () => {
      assert.equal(SpawnBoolean.prototype.isInputValid(positiveFloat1), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(positiveFloat2), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(negativeFloat1), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(negativeFloat2), false);
    });
    it("should not accept integers", () => {
      assert.equal(SpawnBoolean.prototype.isInputValid(negativeInt), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(positiveInt), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(zero), false);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnBoolean.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnBoolean.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnFloat", () => {
  describe("should only accept floats", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnFloat.prototype.isInputValid(str1), false);
      assert.equal(SpawnFloat.prototype.isInputValid(str2), false);
    });
    it("should not accept booleans", () => {
      assert.equal(SpawnFloat.prototype.isInputValid(bool1), false);
      assert.equal(SpawnFloat.prototype.isInputValid(bool2), false);
    });
    it("should accept floats", () => {
      assert.equal(SpawnFloat.prototype.isInputValid(negativeFloat1), true);
      assert.equal(SpawnFloat.prototype.isInputValid(negativeFloat2), true);
      assert.equal(SpawnFloat.prototype.isInputValid(positiveFloat1), true);
      assert.equal(SpawnFloat.prototype.isInputValid(positiveFloat2), true);
    });
    it("should accept integers", () => {
      assert.equal(SpawnFloat.prototype.isInputValid(negativeInt), true);
      assert.equal(SpawnFloat.prototype.isInputValid(positiveInt), true);
      assert.equal(SpawnFloat.prototype.isInputValid(zero), true);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnFloat.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnFloat.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnInteger", () => {
  describe("should only accept integers", () => {
    it("should not accept strings", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(str1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(str2), false);
    });
    it("should not accept booleans", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(bool1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(bool2), false);
    });
    it("should not accept floats", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(negativeFloat1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(negativeFloat2), false);
      assert.equal(SpawnInteger.prototype.isInputValid(positiveFloat1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(positiveFloat2), false);
    });
    it("should accept integers", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(negativeInt), true);
      assert.equal(SpawnInteger.prototype.isInputValid(positiveInt), true);
      assert.equal(SpawnInteger.prototype.isInputValid(zero), true);
    });
    it("should not accept lists or objects", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(obj1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(list1), false);
      assert.equal(
        SpawnInteger.prototype.isInputValid(makeList(zero, 5)),
        false
      );
    });
    it("should not accept invalids", () => {
      assert.equal(SpawnInteger.prototype.isInputValid(invalid1), false);
      assert.equal(SpawnInteger.prototype.isInputValid(invalid2), false);
    });
  });
});

describe("SpawnLastN", () => {
  describe("should only accept lists in first argument", () => {
    it("should not accept any strings", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(str1, SpawnString, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(str2, SpawnString, 1),
        false
      );
    });
    it("should not accept booleans", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(bool1, SpawnBoolean, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(bool2, SpawnBoolean, 1),
        false
      );
    });
    it("should not accept floats", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(negativeFloat1, SpawnFloat, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(negativeFloat2, SpawnFloat, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(positiveFloat1, SpawnFloat, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(positiveFloat2, SpawnFloat, 1),
        false
      );
    });
    it("should not accept integers", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(negativeInt, SpawnInteger, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(positiveInt, SpawnInteger, 1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(zero, SpawnInteger, 1),
        false
      );
    });
    it("should accept lists", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, 1),
        true
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(zero, 5), SpawnInteger, 5),
        true
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(str1, 3), SpawnString, 7),
        true
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(bool1, 10),
          SpawnBoolean,
          12
        ),
        true
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(negativeFloat2, 5),
          SpawnFloat,
          25
        ),
        true
      );
    });
    it("should not accept invalids", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(invalid1, SpawnBoolean, 4),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(invalid2, SpawnBoolean, 3),
        false
      );
    });
  });
  describe("should only accept some SpawnTypes in second argument", () => {
    it("should accept SpawnIntegers", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(zero, 5), SpawnInteger, 7),
        true
      );
    });
    it("should accept SpawnFloats", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(negativeFloat2, 26),
          SpawnFloat,
          27
        ),
        true
      );
    });
    it("should accept SpawnStrings", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(str1, 3), SpawnString, 6),
        true
      );
    });
    it("should accept SpawnBooleans", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(bool1, 15),
          SpawnBoolean,
          123
        ),
        true
      );
    });
    it("should not accept SpawnID", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(positiveInt, 7), SpawnID, 7),
        false
      );
    });
    it("should not accept SpawnRandom", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(positiveFloat1, 26),
          SpawnRandom,
          27
        ),
        false
      );
    });
    it("should not accept anything else", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(zero, 5), Number, 7),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(str2, 5), String, 7),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(bool1, 5), Boolean, 7),
        false
      );
    });
  });
  describe("should only accept zero and positive integers in third argument", () => {
    it("should accept zero", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, 0),
        true
      );
    });
    it("should accept positive integers", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(bool1, 21),
          SpawnBoolean,
          23
        ),
        true
      );
    });
    it("should not accept any other input", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, negativeFloat1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, negativeFloat2),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, positiveFloat1),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, positiveFloat2),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, negativeInt),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(list1, SpawnBoolean, obj1),
        false
      );
    });
    it("should not accept numbers shorter than list length", () => {
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(zero, 5), SpawnInteger, 4),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(makeList(str1, 3), SpawnString, 2),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(bool1, 15),
          SpawnBoolean,
          12
        ),
        false
      );
      assert.equal(
        SpawnLastN.prototype.isInputValid(
          makeList(negativeFloat2, 26),
          SpawnFloat,
          25
        ),
        false
      );
    });
  });
});

describe("SpawnFVG", () => {
  it("should not accept invalid SpawnID", () => {
    invalidId = {
      id: negativeInt,
      rand: positiveFloat1,
      str: str2,
      bool: bool1,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidId, testFVG.descriptor),
      {
        id: false,
        rand: true,
        str: true,
        bool: true,
        float: true,
        int: true,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnRandom", () => {
    invalidRandom = {
      id: positiveInt,
      rand: str2,
      str: str2,
      bool: bool1,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidRandom, testFVG.descriptor),
      {
        id: true,
        rand: false,
        str: true,
        bool: true,
        float: true,
        int: true,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnString", () => {
    invalidStr = {
      id: positiveInt,
      rand: positiveFloat1,
      str: bool1,
      bool: bool1,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidStr, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: false,
        bool: true,
        float: true,
        int: true,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnBoolean", () => {
    invalidBool = {
      id: positiveInt,
      rand: positiveFloat1,
      str: str2,
      bool: negativeFloat2,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidBool, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: true,
        bool: false,
        float: true,
        int: true,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnFloat", () => {
    invalidFloat = {
      id: positiveInt,
      rand: positiveFloat1,
      str: str2,
      bool: bool1,
      float: obj1,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidFloat, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: true,
        bool: true,
        float: false,
        int: true,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnInteger", () => {
    invalidInt = {
      id: positiveInt,
      rand: positiveFloat1,
      str: str2,
      bool: bool1,
      float: negativeFloat2,
      int: positiveFloat2,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidInt, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: true,
        bool: true,
        float: true,
        int: false,
        lastN: true
      }
    );
  });
  it("should not accept invalid SpawnLastN", () => {
    invalidLastN = {
      id: positiveInt,
      rand: positiveFloat1,
      str: str2,
      bool: bool1,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3, 2, 5, 3, 2]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(invalidLastN, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: true,
        bool: true,
        float: true,
        int: true,
        lastN: false
      }
    );
  });
  it("should accept any correct combination of input", () => {
    validInput = {
      id: positiveInt,
      rand: positiveFloat1,
      str: str2,
      bool: bool1,
      float: negativeFloat2,
      int: negativeInt,
      lastN: [2.46, -12.3]
    };
    assert.deepEqual(
      SpawnFVG.prototype.isInputValid(validInput, testFVG.descriptor),
      {
        id: true,
        rand: true,
        str: true,
        bool: true,
        float: true,
        int: true,
        lastN: true
      }
    );
  });
});
