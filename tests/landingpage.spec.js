const { chromium } = require("playwright");
const { test, expect } = require('@playwright/test');
const axios = require('axios');
const { timeout } = require("../playwright.config");
const config = require('../config.json');
var testNameImagium = "Playwright Integration";
var projectKeyImagium = '77ee9a9c-1707-4eb4-9a82-32d59eb843b5';
var uidEndPointImagium = 'http://192.168.1.51:80/api/GetUID';
var validateEndPointImagium = 'http://192.168.1.51:80/api/Validate';
var testUID;


test('has title',async()=>{
    const jsonFilePaths = config.jsonFilePaths;
    console.log(jsonFilePaths);
    for (let i = 0; i < jsonFilePaths.length; i++) {

 //Using axios to make API Call
 //Get unique test ID from Imagium project
 const folderName = jsonFilePaths[i].slice(jsonFilePaths[i].lastIndexOf('/') + 1, jsonFilePaths[i].lastIndexOf('.'));
 await  axios.post(uidEndPointImagium, {TestName: testNameImagium+' '+folderName, ProjectKey: projectKeyImagium })
    .then((res) => {
        console.log(`Status: ${res.status}`);   
        //Store unique test ID
        testUID = res.data;
        console.log('Body: ', res.data);
    }).catch((err) => {
        console.error(err);
    });

//Playwright methods to navigate and get screenshot as a Base64  
//const browser = await chromium.launch({headless:false});
//const page = await browser.newPage();
//const jsonFilePaths = config.jsonFilePaths;
//console.log(jsonFilePaths);
//for (let i = 0; i < jsonFilePaths.length; i++) {
    const browser = await chromium.launch({headless:false});
    const page = await browser.newPage();
    const jsonFilePath = jsonFilePaths[i];
    // Load JSON file
    const { scenarios } = require(jsonFilePath);
    let jsonlength = scenarios.length;
for(let j=0;j<jsonlength; j++){
await page.goto(scenarios[j].url);
await page.waitForLoadState();
test.setTimeout(1200000);
const buffer= await page.screenshot({ path: 'screenshot.png', fullPage: true });
//Using axios to make API Call
//Validate the page screenshot inside Imagium
await  axios.post(validateEndPointImagium, {StepName: 'Step '+(j+1), TestRunID: testUID, ImageBase64:  buffer.toString('base64')})
.then((res) => {
    console.log(`Status: ${res.status}`);
    console.log('Body: ', res.data);
}).catch((err) => {
    console.error(err);
});
}

await browser.close();
}
});

