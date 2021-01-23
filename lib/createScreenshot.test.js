import createScreenshot from './createScreenshot';
import {isCacheValid, captureScreenshot,} from './createScreenshot';
import fs from 'fs';
import captureWebsite from 'capture-website';

jest.mock('fs');
jest.mock('capture-website');
const onehour = 1000*60*60;

jest.setTimeout(5000);
describe('screnshot tests', ()=>{


  beforeAll(()=>{
    fs.existsSync.mockClear();
    fs.statSync.mockClear();
  });

  it('should create a screenshot', async () => {
  
    let data = {
      url: 'https://google.es',
      filePath: '/home/daniel/test.png',
      cache: onehour,
    };

    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({
      mtime: {
        getTime: () => new Date().getTime()-onehour/2,
      },
    });
    let result = await createScreenshot(data);


    expect(result).toBe(true);
  });

  it('should handle cache', () => {
    const path = '/home/daniel/test.png';
    const cacheTime = onehour;

    //file not exists - return false
    fs.existsSync.mockReturnValue(false);
    let result = isCacheValid(path, cacheTime);
    expect(result).toBe(false);

    //check for valid cache
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({
      mtime: {
        getTime: () => new Date().getTime()-onehour/2,
      },
    }); 
    result = isCacheValid(path, cacheTime);
    expect(result).toBe(true);
  });

  it('should capture a website', async ()=>{
    const url = 'https://google.es';
    captureWebsite.buffer.mockReturnValue(async()=>await new Buffer.from("test"));
    let result = await captureScreenshot(url);
    expect(result).not.toBe(null);    
  });

});
