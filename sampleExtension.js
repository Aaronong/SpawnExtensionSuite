function registerExtension(coreFunctions, dataTypes) {
  let {
    SpawnID,
    SpawnRandom,
    SpawnString,
    SpawnBoolean,
    SpawnFloat,
    SpawnInteger,
    SpawnLastN,
    SpawnFVG
  } = dataTypes;

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

  coreFunctions.registerFVG(testFVG);
}

module.exports = registerExtension;
