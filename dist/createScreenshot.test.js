"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _createScreenshot = _interopRequireWildcard(require("./createScreenshot"));

var _fs = _interopRequireDefault(require("fs"));

var _captureWebsite = _interopRequireDefault(require("capture-website"));

jest.mock('fs');
jest.mock('capture-website');
const onehour = 1000 * 60 * 60;
jest.setTimeout(5000);
describe('screnshot tests', () => {
  beforeAll(() => {
    _fs.default.existsSync.mockClear();

    _fs.default.statSync.mockClear();
  });
  it('should create a screenshot', async () => {
    let data = {
      url: 'https://google.es',
      filePath: '/home/daniel/test.png',
      cache: onehour
    };

    _fs.default.existsSync.mockReturnValue(true);

    _fs.default.statSync.mockReturnValue({
      mtime: {
        getTime: () => new Date().getTime() - onehour / 2
      }
    });

    let result = await (0, _createScreenshot.default)(data);
    expect(result).toBe(true);
  });
  it('should handle cache', () => {
    const path = '/home/daniel/test.png';
    const cacheTime = onehour; //file not exists - return false

    _fs.default.existsSync.mockReturnValue(false);

    let result = (0, _createScreenshot.isCacheValid)(path, cacheTime);
    expect(result).toBe(false); //check for valid cache

    _fs.default.existsSync.mockReturnValue(true);

    _fs.default.statSync.mockReturnValue({
      mtime: {
        getTime: () => new Date().getTime() - onehour / 2
      }
    });

    result = (0, _createScreenshot.isCacheValid)(path, cacheTime);
    expect(result).toBe(true);
  });
  it('should capture a website', async () => {
    const url = 'https://google.es';

    _captureWebsite.default.buffer.mockReturnValue(async () => await new Buffer.from("test"));

    let result = await (0, _createScreenshot.captureScreenshot)(url);
    expect(result).not.toBe(null);
  });
});