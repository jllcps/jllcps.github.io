// reverse image search:
// https://github.com/dessant/search-by-image/blob/master/src/utils/data.js
// https://github.com/yimingliu/reverse-image-search-safari/blob/master/Shared/search_engines.plist

const quicklinks = {
    // https://lens.google.com/uploadbyurl?url=[url]
    "Google Cache": "https://webcache.googleusercontent.com/search?q=cache:[url]",
    "Internet Archive": "https://web.archive.org/web/*/[url]",
    "Archive.today": "https://archive.ph/[url]",
    "Downfor.io": "https://downforeveryoneorjustme.com/[url]",
    // "Freshping": "https://www.freshworks.com/website-monitoring/is-it-down/[hostname]",
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
    var search_url = document.getElementById("search-url"),
        search_buttons = document.querySelectorAll('.search-btn');

    search_buttons.forEach((search_button) => {
        search_button.onclick = (ev) => {
            let inputs = document.querySelectorAll('input');
            for (const input of inputs) {
                let is_valid = input.reportValidity();
                if (!is_valid)  return;
            }

            let target_url = new URL(search_url.value);
            let base_url = quicklinks[ev.currentTarget.dataset.name];

            let url = "";
            if (base_url.indexOf("[domain]") !== -1)
                url = base_url.replace("[domain]", extractRootDomain(target_url.hostname));
            else if (base_url.indexOf("[hostname]") !== -1)
                url = base_url.replace("[hostname]", target_url.hostname);
            else if (base_url.indexOf("[url]") !== -1)
                url = base_url.replace("[url]", target_url.href);
            else if (base_url.indexOf("[sencoded_url]") !== -1)
                url = base_url.replace("[sencoded_url]", encodeURIComponent(target_url.href));
            else if (base_url.indexOf("[dencoded_url]") !== -1)
                url = base_url.replace("[dencoded_url]", encodeURIComponent(encodeURIComponent(target_url.href)));
            
            window.open(url, '_blank');
        };
    });
}


addListeners();
