let fs = require("fs");
let puppeteer = require("puppeteer");
let cfile = process.argv[2];
(async function(){
  let data = await fs.promises.readFile(cfile);
  let {url,pwd,user} =JSON.parse(data);
  let browser = await puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximised"]
  });
  let tabs = await browser.pages();
  let tab = tabs[0];
  await tab.goto(url,{waitUntil:"networkidle0"});
  await tab.waitForSelector("#input-1",{visible:true});
  await tab.type("#input-1",user,{delay:100})
  await tab.type("#input-2",pwd,{delay:100})
  await Promise.all([
    tab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button"),tab.waitForNavigation({waitUntil:"networkidle0"})
  ]);
  await tab.waitForSelector(".backbone.nav_link.js-dropdown-toggle.js-link.toggle-wrap",{visible:true})
  Promise.all([
    await tab.click(".backbone.nav_link.js-dropdown-toggle.js-link.toggle-wrap"),tab.waitForNavigation({waitUntil:"networkidle0"})
  ])
  await tab.waitForSelector("a[data-analytics=NavBarProfileDropDownAdministration]",{visible:true})
  await Promise.all([
    await tab.click("a[data-analytics=NavBarProfileDropDownAdministration]"),tab.waitForNavigation({waitUntil:"networkidle0"})
  ])
  await tab.waitForSelector(".administration header",{visible:true})
  let mtabs = await tab.$$(".administration header ul li a")
  await Promise.all([
    mtabs[1].click("a[data-analytics=NavBarProfileDropDownAdministration]"),tab.waitForNavigation({waitUntil:"networkidle0"})
  ])
  await handleSinglePageQuestion(tab,browser)
})()

async function handleSinglePageQuestion(tab,browser){
  await tab.waitForSelector(".backbone.block-center");
  let qoncPage = await tab.$$(".backbone.block-center");
  let pArr = [];
  for(let i=0;i<qoncPage.length;i++){
    let href = await tab.evaluate(function (elem){
      return elem.getAttribute("href");
    },qoncPage[i]);
    let newTab = await browser.newPage();
    let mWillbeAddedPromisetocQ = handleSingleQuestion(newTab,"https://www.hackerrank.com" + href);
    pArr.push(mWillbeAddedPromisetocQ);
  }
  await Promise.all(pArr);
  await tab.waitForSelector(".pagination ul li");
  let paginationBtn = await tab.$$(".pagination ul li");
  let nxtBtn = paginationBtn[paginationBtn.length-2];
  let className = await tab.evaluate(function (nxtBtn){
    return nxtBtn.getAttribute("class");
  },nxtBtn);
  if(className==="disabled"){
    return;
  }
  else{
    await Promise.all([
      nxtBtn.click(),tab.waitForNavigation({waitUntil:"networkidle0"})
    ])
    await handleSinglePageQuestion(tab,browser);
  }
}

async function handleSingleQuestion(newTab,link){
  await newTab.goto(link,{waitUntil:"networkidle0"});
  await newTab.waitForSelector(".tag");
  await Promise.all([
    newTab.click("li[data-tab=moderators]"),
    newTab.waitForNavigation({waitUntil:"networkidle0"})
  ])
  await newTab.waitForSelector("input[id=moderator]", { visible: true });
  await newTab.type("#moderator", "theamanthakur");
  await newTab.keyboard.press("Enter")
  await newTab.click(".save-challenge.btn.btn-green");
  await newTab.close();
}



























// async function handleSinglePageQuestion(tab,browser){
//     await tab.waitForSelector(".backbone.block-center");
//     let qoncPage = await tab.$$(".backbone.block-center");
//     let pArr =[];
//     for(let i=0;i<qoncPage;i++){
//         let newTab = await browser.newPage();
//         let mWillbeAddedPromisetocQ = handleSingleQuestion(newTab,qoncPage[i]);
//         pArr.push(mWillbeAddedPromisetocQ);
//     }
//     await Promise.all(pArr);
//     await tab.waitForSelector(".pagination ul li");
//     let paginationBtn = await tab.$$(".pagination ul li");
//     let nxtBtn = paginationBtn[paginationBtn.length-2];
//     let className = await tab.evaluate(function (nxtBtn){
//         return nxtBtn.getAttribute("class");
//     },nxtBtn);
//     if(className==="disabled"){
//         return;
//     }
//     else{
//         await Promise.all([nxtBtn.click(), tab.waitForNavigation( {waitUntil: "networkidle0"})]);
//         await handleSinglePageQuestion(tab,browser);
//     }
// }
// async function handleSingleQuestion(newTab,link){
//     await newTab.goto(link,{waitUntil:"networkdidle0"});
//     await newTab.waitForSelector(".tag");
//     await Promise.all([
//         newTab.click("li[data-tab=moderators]"),
//         newTab.waitForNavigation({waitUntil:"networkidle0"})
//     ])
//     await newTab.waitForSelector("input[id=moderator]",{ visible : true});
//     await newTab.type("#moderator","Psackersacker9");
//     await newTab.keyboard.press("Enter");
//     await newTab.click(".save-challenge.btn.btn-green");
//     await newTab.close(); 
// }


// //