let puppeteer = require("puppeteer");
let fs = require("fs");
let cfile = process.argv[2];
(async function(){
    let data = await fs.promises.readFile(cfile);
    let {url,pwd,user,flightno,model} =JSON.parse(data);
    let browser = await puppeteer.launch({
        headless:false,
        defaultViewport:null,
        args:["--start-maximised","--disable-notifications"]

    })
    let tabs = await browser.pages();
  let tab = tabs[0];
  await tab.goto(url,{waitUntil:"networkidle0"});
    await tab.waitForSelector(".important-banner__footer .btn.btn-blue",{visible:true});
    tab.click(".important-banner__footer .btn.btn-blue")
    await tab.waitForSelector(".dropdown-toggle.logout",{visible:true});
    tab.click(".dropdown-toggle.logout")
      await tab.waitForSelector("#fr24_SignInEmail",{visible:true});
      await tab.type("#fr24_SignInEmail",user,{delay:100})
    await tab.type("#fr24_SignInPassword",pwd,{delay:100})
      await Promise.all([
        tab.click("#fr24_SignIn"),tab.waitForNavigation({waitUntil:"networkidle0"})
    ]);
    await tab.waitForSelector("#searchBox",{visible:true});
  await tab.type("#searchBox",flightno,{delay:100})
        let href = flightno;
        let mpUrl = url + href;
  await tab.goto(mpUrl, { waitUntil: "networkidle0" });
  await tab.screenshot({path: 'screenshot.jpg'});
  let newtab = await browser.newPage()
  await handlefilter(newtab,url,model)
})()
async function handlefilter(newtab,browser,model){
    await newtab.goto(browser)
    await newtab.waitForSelector("#fr24_FiltersMenu",{visible:true})
    await newtab.click("#fr24_FiltersMenu")
    await newtab.waitFor(5000);
    await newtab.waitForSelector("#fr24_enableFilters",{visible:true})
    await newtab.click("#fr24_enableFilters")
    await newtab.waitForSelector("#fr24_FilterType",{visible:true})
    await newtab.click("#fr24_FilterType")
    await newtab.waitForSelector("a[data-value=aircraft]",{visible:true})
    await newtab.click("a[data-value=aircraft]")
    await newtab.waitForSelector(".show .form-control",{visible:true})
    await newtab.type(".show .form-control",model,{delay:100})
    await newtab.waitForSelector("#fr24_FilterAdd",{visible:true})
    await newtab.click("#fr24_FilterAdd")
    await newtab.waitFor(5000);
    
  }