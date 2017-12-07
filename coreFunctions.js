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

function getTypeTestArray(type, outputType) {
  const idArray = [0, 100, 2975, 2049350, 0xfe4522];
  const randomArray = [0, 0.25, 0.5, 0.75, 0.99999999999];
  const stringArray = ["", "Hello World", "A@!#(}]", "Tan's Rice", "23", null];
  const booleanArray = [true, false, null];
  const floatArray = [-234.22355, 1029852.238, 0, 213124, -1, null];
  const integerArray = [-12982329, -1, 0, 1, 98423094741287, null];

  if (type.key === "SpawnLastN") {
    return [getTypeTestArray(outputType, null)];
  } else if (type.prototype.key === "SpawnID") {
    return idArray;
  } else if (type.prototype.key === "SpawnRandom") {
    return randomArray;
  } else if (type.prototype.key === "SpawnString") {
    return stringArray;
  } else if (type.prototype.key === "SpawnBoolean") {
    return booleanArray;
  } else if (type.prototype.key === "SpawnFloat") {
    return floatArray;
  } else if (type.prototype.key === "SpawnInteger") {
    return integerArray;
  }
  return [];
}

/**
 * Generates a list of test input for the specific FVG
 * @param {the FVG requiring the test input} descriptor
 */
function generateTestInputList(descriptor) {
  let testInputList = [{}];

  for (let arg in descriptor.arguments) {
    let newInputList = [];
    let argVal = descriptor.arguments[arg];
    let argTestList = getTypeTestArray(argVal.type, descriptor.output.type);

    testInputList.forEach(obj => {
      argTestList.forEach(item => {
        let newObj = Object.assign({}, obj);
        newObj[arg] = item;
        newInputList.push(newObj);
      });
    });
    testInputList = newInputList;
  }
  return testInputList;
}

/**
 * Registers a field value generator(FVG) onto Spawn.
 * All registered FVGs are first tested to ensure that:
 *   - they handle a range of valid inputs well
 *   - they return the correct type
 *   - they are deterministic
 * @param {the FVG being registered} fvg
 */
function registerFVG(fvg) {
  record.addFVG(fvg.descriptor.name);
  let testList = generateTestInputList(fvg.descriptor);
  let totalTestNum = testList.length;
  let outputType = fvg.descriptor.output.type;
  for (let currTestNum = 0; currTestNum < totalTestNum; currTestNum++) {
    let currTest = testList[currTestNum];
    let output = fvg.run(currTest, fvg.descriptor);
    if (!outputType.prototype.isInputValid(output)) {
      throw new Error(
        "Failed test " +
          currTestNum +
          " of " +
          totalTestNum +
          ". The following input " +
          JSON.stringify(fvg.cleanInput(currTest, fvg.descriptor)) +
          "returned an output of " +
          output +
          " which is not of type " +
          outputType.prototype.key
      );
    }
    let output2 = fvg.run(currTest, fvg.descriptor);
    if (output !== output2) {
      throw new Error(
        "Failed test " +
          currTestNum +
          " of " +
          totalTestNum +
          ". FVGs must be deterministic. The following input " +
          JSON.stringify(fvg.cleanInput(currTest, fvg.descriptor)) +
          "returned an output of " +
          output +
          " on the first run and returned " +
          output2 +
          " on the second."
      );
    }
  }
  console.log(
    totalTestNum + " tests passed. '" + fvg.descriptor.name + "' is registered."
  );
}

class ExtensionRecords {
  constructor() {
    this.FVGs = [];
  }
  addFVG(name) {
    if (this.FVGs.find(element => element === name)) {
      throw new Error("You may not register two FVGs of the same name.");
    }
    this.FVGs.push(name);
  }
}

let record = new ExtensionRecords();

module.exports = { registerFVG };
