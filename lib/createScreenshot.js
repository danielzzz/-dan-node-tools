/**
 * creates a screenshot for a given url using capture-website/puppeteer
 * @module createScreenshot
 */

import captureWebsite from 'capture-website';
import fs from 'fs';
import path from 'path';

/**
 * create cached screenshot from a given config object
 * once the screenshot is created, it is stored at give filePath
 * 
 * @param {object} config a configuration object
 * @example {url:"https://google.es", filePath: '/tmp/image.png', cache:'10000', {width: 300, height: 400}} 
 * @returns {bool} 
 */
export default async function createScreenshot({url, filePath, cache=-1, captureConfig,}) {
  if (isCacheValid(filePath, cache)) {
    return true;
  }

  try {
   
    let imageData = await captureScreenshot(url, captureConfig);
    //console.log(imageData);
    fs.writeFileSync(filePath, imageData);
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
export function isCacheValid(filePath, cacheTime) {
  
  if (!fs.existsSync(filePath)) {
    return false;
  }
  const now = new Date().getTime();
  let mtime = fs.statSync(filePath).mtime.getTime();
  
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
export async function captureScreenshot(url, config = {}) {
  const defaultConfig = {
    width: 400,
    height: 300,
  };
  config = {...defaultConfig, ...config,};

  let imageData = await captureWebsite.buffer(url, config);
  return imageData;
}
