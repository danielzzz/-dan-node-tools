"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createScreenshot;
exports.isCacheValid = isCacheValid;
exports.captureScreenshot = captureScreenshot;

var _captureWebsite = _interopRequireDefault(require("capture-website"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

/**
 * creates a screenshot for a given url using capture-website/puppeteer
 * @module createScreenshot
 */

/**
 * create cached screenshot from a given config object
 * once the screenshot is created, it is stored at give filePath
 * 
 * @param {object} config a configuration object
 * @example {url:"https://google.es", filePath: '/tmp/image.png', cache:'10000', {width: 300, height: 400}} 
 * @returns {bool} 
 */
async function createScreenshot({
  url,
  filePath,
  cache = -1,
  captureConfig
}) {
  if (isCacheValid(filePath, cache)) {
    return true;
  }

  try {
    let imageData = await captureScreenshot(url, captureConfig);
    console.log(imageData);

    _fs.default.writeFileSync(filePath, imageData);
  } catch (e) {
    throw e;
  }

  return true;
}
/**
 * it takes a given filePath and check if it exists and it's older than cacheTime
 * 
 * @param {string} filePath the path of the file to check 
 * @param {int} cacheTime maximum age in milisec
 * @returns {bool} is the cached version still valid
 */


function isCacheValid(filePath, cacheTime) {
  if (!_fs.default.existsSync(filePath)) {
    return false;
  }

  const now = new Date().getTime();

  let mtime = _fs.default.statSync(filePath).mtime.getTime();

  if (now - mtime > cacheTime) {
    return false;
  }

  return true;
}
/**
 * 
 * @param {string} url url to fetch 
 * @param {object} config puppeteer config object 
 * @returns {*} image buffer or null 
 */


async function captureScreenshot(url, config = {}) {
  const defaultConfig = {
    width: 400,
    height: 300
  };
  config = { ...defaultConfig,
    ...config
  };
  let imageData = await _captureWebsite.default.buffer(url, config);
  return imageData;
}