"use strict";
/**
 * A file holding the definition of all of Spawn's data types.
 * These types must be implemented in all of Spawn's FVG extensions.
 */
function SpawnString() {
  if (!(this instanceof SpawnString)) return new SpawnString();
}

SpawnString.prototype.key = "SpawnString";

SpawnString.prototype.isInputValid = input => {
  return typeof input === "string";
};

function SpawnInteger() {
  if (!(this instanceof SpawnInteger)) return new SpawnInteger();
}

SpawnInteger.prototype.key = "SpawnInteger";

SpawnInteger.prototype.isInputValid = input => {
  return (
    typeof input === "number" && isFinite(input) && Math.floor(input) === input
  );
};

function SpawnFloat() {
  if (!(this instanceof SpawnFloat)) return new SpawnFloat();
}

SpawnFloat.prototype.key = "SpawnFloat";

SpawnFloat.prototype.isInputValid = input => {
  return typeof input === "number" && isFinite(input);
};

function SpawnBoolean() {
  if (!(this instanceof SpawnBoolean)) return new SpawnBoolean();
}

SpawnBoolean.prototype.key = "SpawnBoolean";

SpawnBoolean.prototype.isInputValid = input => {
  return typeof input === "boolean";
};

function SpawnRandom() {
  if (!(this instanceof SpawnRandom)) return new SpawnRandom();
}

SpawnRandom.prototype.key = "SpawnRandom";

SpawnRandom.prototype.isInputValid = input => {
  return typeof input === "number" && input >= 0 && input < 1;
};

function SpawnID() {
  if (!(this instanceof SpawnID)) return new SpawnID();
}

SpawnID.prototype.key = "SpawnID";

SpawnID.prototype.isInputValid = input => {
  return (
    typeof input === "number" &&
    isFinite(input) &&
    Math.floor(input) === input &&
    input >= 0
  );
};

function SpawnLastN(n) {
  if (!SpawnID.prototype.isInputValid(n))
    throw new Error("SpawnLastN: input n has to be a positive integer");
  if (!(this instanceof SpawnLastN)) return new SpawnLastN(n);
  this.n = n;
}

SpawnLastN.prototype.key = "SpawnLastN";

SpawnLastN.prototype.isInputValid = (input, type, n) => {
  const validType =
    type === SpawnBoolean ||
    type === SpawnFloat ||
    type === SpawnInteger ||
    type === SpawnString;
  return (
    Array.isArray(input) &&
    validType &&
    SpawnID.prototype.isInputValid(n) &&
    input.length <= n &&
    input.every(type.prototype.isInputValid)
  );
};

function SpawnFVG(fvgDescriptor) {
  if (!(this instanceof SpawnFVG)) return new SpawnFVG(fvgDescriptor);
  this.validate(fvgDescriptor);
  this.descriptor = fvgDescriptor;
}

SpawnFVG.prototype.key = "SpawnFVG";

SpawnFVG.prototype.isInputValid = (input, fvgDescriptor) => {
  let returnValue = {};
  for (let arg in fvgDescriptor.arguments) {
    let argVal = fvgDescriptor.arguments[arg];

    if (
      argVal.type === SpawnID ||
      argVal.type === SpawnRandom ||
      argVal.type === SpawnBoolean ||
      argVal.type === SpawnFloat ||
      argVal.type === SpawnInteger ||
      argVal.type === SpawnString
    ) {
      if (argVal.type.prototype.isInputValid(input[arg])) {
        returnValue[arg] = true;
      } else {
        returnValue[arg] = false;
      }
    }
    if (argVal.type.key === "SpawnLastN") {
      if (
        SpawnLastN.prototype.isInputValid(
          input[arg],
          fvgDescriptor.output.type,
          argVal.type.n
        )
      ) {
        returnValue[arg] = true;
      } else {
        returnValue[arg] = false;
      }
    }
  }
  return returnValue;
};

SpawnFVG.prototype.cleanInput = (input, fvgDescriptor) => {
  let processedInput = Object.assign({}, input);
  let validity = SpawnFVG.prototype.isInputValid(input, fvgDescriptor);
  for (let arg in validity) {
    if (validity[arg] === false) {
      let defaultVal = fvgDescriptor.arguments[arg].defaultValue;
      processedInput[arg] = defaultVal;
    }
  }
  return processedInput;
};

/**
 * Runs the FVG and returns the output.
 * inputs are validated, failed inputs are replaced with default inputs
 * @param {the input of the field value generator} input
 * @param {the descriptor of the field value generator} fvgDescriptor
 */
SpawnFVG.prototype.run = (input, fvgDescriptor) => {
  let processedInput = SpawnFVG.prototype.cleanInput(input, fvgDescriptor);
  return fvgDescriptor.generator(processedInput);
};

/**
 * The validate function ensures that all written Field Value Generators
 * are well-defined.
 */
SpawnFVG.prototype.validate = fvgDescriptor => {
  let hasId = false;
  let hasRand = false;
  if (typeof fvgDescriptor !== "object") {
    throw new Error("SpawnFVG: fvgDescriptor has to be an object.");
  }
  if (!SpawnString.prototype.isInputValid(fvgDescriptor.name)) {
    throw new Error("SpawnFVG: fvgDescriptor.name has to be a string");
  }
  if (!SpawnString.prototype.isInputValid(fvgDescriptor.description)) {
    throw new Error("SpawnFVG: fvgDescriptor.description has to be a string");
  }
  if (typeof fvgDescriptor.output !== "object") {
    throw new Error("SpawnFVG: fvgDescriptor.output has to be an object.");
  }
  if (
    fvgDescriptor.output.type !== SpawnBoolean &&
    fvgDescriptor.output.type !== SpawnFloat &&
    fvgDescriptor.output.type !== SpawnInteger &&
    fvgDescriptor.output.type !== SpawnString
  ) {
    throw new Error(
      "SpawnFVG: fvgDescriptor.output.type has to be of type " +
        "SpawnBoolean, SpawnFloat, SpawnInteger, or SpawnString"
    );
  }
  if (typeof fvgDescriptor.arguments !== "object") {
    throw new Error("SpawnFVG: fvgDescriptor.arguments has to be an object.");
  }
  for (let arg in fvgDescriptor.arguments) {
    let argVal = fvgDescriptor.arguments[arg];
    // Ensure that only one input implements each SpawnID and SpawnRandom
    if (argVal.type === SpawnID) {
      if (hasId)
        throw new Error("SpawnFVG: only one input of SpawnID type is allowed.");
      hasId = true;
    } else if (argVal.type === SpawnRandom) {
      if (hasRand)
        throw new Error(
          "SpawnFVG: only one input of SpawnRandom type is allowed."
        );
      hasRand = true;
    } else if (
      argVal.type === SpawnBoolean ||
      argVal.type === SpawnFloat ||
      argVal.type === SpawnInteger ||
      argVal.type === SpawnString
    ) {
      // For other basic input types, enforce default values
      if (!argVal.type.prototype.isInputValid(argVal.defaultValue)) {
        throw new Error(
          "SpawnFVG: input " +
            arg +
            " has an invalid default value " +
            argVal.defaultValue +
            "."
        );
      }
    } else if (argVal.type.key === "SpawnLastN" && argVal.type.n) {
      // For lastN input types, enforce default values
      if (
        !argVal.type.isInputValid(
          argVal.defaultValue,
          fvgDescriptor.output.type,
          argVal.type.n
        )
      ) {
        throw new Error(
          "SpawnFVG: input " +
            arg +
            " has an invalid default value [" +
            argVal.defaultValue +
            "]."
        );
      }
    } else {
      throw new Error("SpawnFVG: input " + arg + " has an invalid type.");
    }
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SpawnString,
    SpawnInteger,
    SpawnFloat,
    SpawnBoolean,
    SpawnRandom,
    SpawnID,
    SpawnLastN,
    SpawnFVG
  };
}
