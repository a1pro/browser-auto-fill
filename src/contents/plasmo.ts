import type { PlasmoCSConfig } from "plasmo"
import { SecureStorage } from "@plasmohq/storage/secure"
import { sendToBackground, sendToContentScript } from "@plasmohq/messaging"

import {
  titleNameRe,
  firstNameRe,
  lastNameRe,
  fullNameRe,
  countryRe,
  dobDayRe,
  dobMonthRe,
  dobYearRe,
  dobRe
} from "../regex-patterns.tsx";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const STORAGE_KEY = "mystic_data"
const PASSWORD    = "ZcerumvGGnkqumZCNKllFMUQxK"
const storage     = new SecureStorage

// hardcoded website urls need to be mapped
let permittedUrls = [
  "https://www.datamystic.com/buy/presales",
  "https://www.ahpra.gov.au/Registration/Renewal-Received-Confirmation.aspx",
  "https://www.ahpra.gov.au/Login#loginFld",
  "https://www.datamystic.com/buy/quote?dontadd=1&cookies=1&backlink=https%3A%2F%2Fwww.datamystic.com%2Fbuy%2F&PRODUCT%5B131686%5D=2&PRODUCT%5B131902%5D=4310&PRODUCT%5B190386%5D=1&PRODUCT%5B216285%5D=1",
  "https://order.shareit.com/cart/view"
]

// function to simulate human keyboard press behaviour
function simulate(el, value=""){
  let opts = {view:window, bubbles:true, cancelable:true, buttons:1};
  if (value != ""){
    el.value = value;
    el.dispatchEvent(new window.Event("change", { bubbles: true }));
    el.dispatchEvent(new window.Event("keypress", { bubbles: true }));
    el.dispatchEvent(new window.Event("focus", { bubbles: true }));
    el.dispatchEvent(new window.Event("keyup", { bubbles: true }));
  }
  el.dispatchEvent(new Event('focus'));
  el.dispatchEvent(new MouseEvent("mousedown", opts));
  el.dispatchEvent(new MouseEvent("mouseup", opts));
  el.dispatchEvent(new MouseEvent("click", opts));
}

// function to change the html element value
function changeHtmlElementValue(input,value){
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    var inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);

  var event = document.createEvent("HTMLEvents");  
  input.value = value;
  event.initEvent("input", true, true);
  input.dispatchEvent(event);
}

// function to get the user data back from the storage
async function loadStorage() {
  // Must set password then watch, otherwise the namespace key will mismatch
  await storage.setPassword(PASSWORD)
  // keep eye on data change by user & update on webforms instantly
  storage.watch({
    [STORAGE_KEY]: (data) => {
      console.log("!!in store watch, data has been changed")
      fillWebsiteForm(window.location.href)
    }
  })
  let userData = await storage.get(STORAGE_KEY)
  userData = (userData !== undefined)?userData:{title: "",first_name: "",last_name: "",gender: "",country: "",dob_day:"",dob_month:"",dob_year:"",date_of_birth:""}
  return userData
}

// function to find all input type elements & store values
function inputElementStoreValues(storageData){
  var inputElements = document.querySelectorAll('input[type="text"]');
  for (const inputEle of inputElements) {
    let inputEleNameAttr = inputEle.name;

    if (inputEleNameAttr !== ""){
      // match with regex & fill the values
      if (inputEleNameAttr.match(new RegExp(titleNameRe, 'g')) !== null)
        changeHtmlElementValue(inputEle, storageData["title"]); // set title

      if (inputEleNameAttr.match(new RegExp(firstNameRe, 'g')) !== null)
        changeHtmlElementValue(inputEle, storageData["first_name"]); // set first name

      if (inputEleNameAttr.match(new RegExp(lastNameRe, 'g')) !== null)
        changeHtmlElementValue(inputEle, storageData["last_name"]); // set last name
      
      if (inputEleNameAttr.match(new RegExp(fullNameRe, 'g')) !== null)
        changeHtmlElementValue(inputEle, storageData["first_name"] + " " + storageData["last_name"]); // set full name*/
    }
  }  
}

// function to select & store values
function selectElementStoreValues(storageData){
  // get all select (dropdown) elements
  var selectElements = document.getElementsByTagName('select');
  for (const selectEle of selectElements) {
    let selectEleNameAttr = selectEle.name;
    if (selectEleNameAttr !== ""){
      // match with regex & fill the values
      if (selectEleNameAttr.match(new RegExp(dobDayRe, 'g')) !== null)
        selectEle.value = storageData['dob_day']; // set day

      if (selectEleNameAttr.match(new RegExp(dobMonthRe, 'g')) !== null)
        selectEle.value = storageData['dob_month']; // set month

      if (selectEleNameAttr.match(new RegExp(dobYearRe, 'g')) !== null)
        selectEle.value = storageData['dob_year']; // set year

      if (selectEleNameAttr.match(new RegExp(countryRe, 'g')) !== null)
        selectEle.value = storageData['country']; // set country
    }
  }
}

/* 
function to fill the matched website 
* (provided by the backend document or variables) forms
* @input currentWebsiteUrl
* @output none
*/
async function fillWebsiteForm(currentWebsiteUrl){
  // load the data from the storage
  let storageData = await loadStorage();

  // fill form is current website url matched with the backend permitted ones
  let currentUrlIndex = permittedUrls.indexOf(currentWebsiteUrl);
  if (currentUrlIndex > -1 ){
    // fill data all input[type="text"] elements on DOM
    inputElementStoreValues(storageData)
    // fill data for all select (dropdown) elements on DOM
    selectElementStoreValues(storageData)
  }
}

window.addEventListener("load", async e => {
  // fill data into web forms
  await fillWebsiteForm(window.location.href);  
})