"use strict";
let coreContext = require("./coreFunctions");
let dataTypes = require("./dataTypes");
let extension = require("./sampleExtension");

let coreFunctions = coreContext("extName", "extVersion");

extension(coreFunctions, dataTypes);
