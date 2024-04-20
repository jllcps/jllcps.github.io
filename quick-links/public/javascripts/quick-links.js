// reverse image search:
// https://github.com/dessant/search-by-image/blob/master/src/utils/data.js
// https://github.com/yimingliu/reverse-image-search-safari/blob/master/Shared/search_engines.plist

const quicklinks = {
    // https://lens.google.com/uploadbyurl?url=[url]
    "Google Cache Full": "https://webcache.googleusercontent.com/search?q=cache:[url]",
    "Google Cache Text": "https://webcache.googleusercontent.com/search?q=cache:[url]&strip=1",
    "Internet Archive": "https://web.archive.org/web/*/[url]",
    "Archive.today": "https://archive.ph/[url]",
    "Downfor.io": "https://downforeveryoneorjustme.com/[url]",
    // "Freshping": "https://www.freshworks.com/website-monitoring/is-it-down/[hostname]",
    // https://doj.me/[hostname]
    // https://isitdown.us/[hostname]
    "IsItDown": "https://www.isitdownrightnow.com/[hostname].html",
    "SimilarWeb": "https://www.similarweb.com/website/[hostname]",
    "Lighthouse" :"https://googlechrome.github.io/lighthouse/viewer/?psiurl=[url]",
    // "PageSpeed": "https://pagespeed.web.dev/report?url=[url]",
    "DNSlytics": "https://dnslytics.com/domain/[domain]/",
    "VirusTotal": "https://www.virustotal.com/gui/search/[dencoded_url]",   // double encoded
    "Sucuri": "https://sitecheck.sucuri.net/results/[url]",
    // "Norton": "https://safeweb.norton.com/report/show?url=[url]",
    // "Safe Browsing": "https://transparencyreport.google.com/safe-browsing/search?url=[url]",
    "Google Image": "https://www.google.com/searchbyimage?sbisrc=cr_1_5_2&image_url=[url]",
    "Yandex Image": "https://yandex.com/images/search?rpt=imageview&url=[url]",
    "Bing Image": "https://www.bing.com/images/search?q=imgurl:[url]&view=detailv2&selectedIndex=0&pageurl=&mode=ImageViewer&iss=sbi",
    "TinEYE Image": "https://tineye.com/search/?url=[url]",
    "Carbon Dating": "https://carbondate.cs.odu.edu/#[url]/",
    "Google Search": "https://google.com/search?q=inurl:[url]&as_qdr=y15",
};


function checkURL(input) {
    var url = input.value;
    if (!url.match(/^(?:https?|data|blob):/) && url.length) {
        input.value = "http://" + url;
    }
}


function extractRootDomain(domain) {
    var splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}


function addListeners() {
    var searchUrl = document.getElementById("search-url"),
        searchButtons = document.querySelectorAll('.search-btn');

    searchButtons.forEach((searchButton) => {
        searchButton.onclick = (ev) => {
            let inputs = document.querySelectorAll('input');
            for (const input of inputs) {
                let valid = input.reportValidity();
                if (!valid)  return;
            }

            let targetUrl = new URL(searchUrl.value);
            let baseUrl = quicklinks[ev.currentTarget.dataset.name];

            let url = "";
            if (baseUrl.indexOf("[domain]") !== -1)
                url = baseUrl.replace("[domain]", extractRootDomain(targetUrl.hostname));
            else if (baseUrl.indexOf("[hostname]") !== -1)
                url = baseUrl.replace("[hostname]", targetUrl.hostname);
            else if (baseUrl.indexOf("[url]") !== -1)
                url = baseUrl.replace("[url]", targetUrl.href);
            else if (baseUrl.indexOf("[sencoded_url]") !== -1)
                url = baseUrl.replace("[sencoded_url]", encodeURIComponent(targetUrl.href));
            else if (baseUrl.indexOf("[dencoded_url]") !== -1)
                url = baseUrl.replace("[dencoded_url]", encodeURIComponent(encodeURIComponent(targetUrl.href)));
            
            window.open(url, '_blank');
        };
    });
}


addListeners();
