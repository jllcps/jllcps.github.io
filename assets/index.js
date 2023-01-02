const message_webhook = "https://maker.ifttt.com/trigger/forward/json/with/key/be3RicnMbgIx-tnMHSVGyj";

const skills = `
- Programming Language
    - Most used: Python, JavaScript, C/C++, Java, Go
    - Less used: Haskell, ShellScript, Lua
- Machine Learning
    - Framework: PyTorch, TensorFlow
    - Library: NumPy, Pandas, Scikit-learn, Matplotlib
- Web Development
    - Backend: Django, Node.js
    - Frontend: HTML, CSS (+ Bootstrap); Basic React, AngularJS
- Others
    - Database: MySQL, PostgreSQL, MongoDB
    - Distributed System: etcd, Hazelcast, Hadoop/Spark
    - Blockchain: Ethereum (Solidity), Hyperledger Fabric
    - Collaborate: Agile (Scrum on Jira), Git
`;

const projects = `
- Highlights
    - P2T-mod (FYP): trajectory prediction for autonomous driving ([link](https://gitfront.io/r/jllcps/RhncPKZCuwvu/FYP21037/), [webpage](https://wp.cs.hku.hk/2021/fyp21037/))
    - Image Super Resolution: extension to real-world degradation ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Machine%20Learning/Image%20Super%20Resolution/))
    - Language Model: methods include N-gram, LSTM, Transformer ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Machine%20Learning/Language%20Model/))
    - Distributed Transaction System: enforce consistency, atomicity with RAFT consensus ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Blockchain/Distributed%20Transaction%20System/))
    - Library Management System: DBMS design scheme & report ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Data%20Science/Library%20Management%20System/))
    - HotZone: pandemic tracking/logging system built with Django ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/HotZone/), [webpage](https://jllcps-hotzone.herokuapp.com/))
- Others
    - Machine Learning: Sentiment Analysis ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Machine%20Learning/Sentiment%20Analysis%20with%20Grammar/)), Traditional Model ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Machine%20Learning/Traditional%20Model/))
    - Data Science: Hadoop/Spark Processing ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Data%20Science/Hadoop%20&%20Spark%20Data%20Processing/)), Spatial Indexing ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Data%20Science/Spatial%20Index/))
    - Blockchain: CRUD on Hyperledger Fabric ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Blockchain/Product%20Catalog%20on%20Hyperledger%20Fabric/)), Ethereum Solidity ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Blockchain/Solidity%20%28Ethereum%29%20codes/))
    - AWS SDK: EC2 Monitor ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/AWS%20SDK/EC2%20Monitor/)), Image Processor ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/AWS%20SDK/Image%20Processor/))
    - Applications: 24 Game ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/24%20Game/)), Commodity Inventory System ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/Commodity%20Inventory%20System/)), Mini-JavaScript ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Applications/Mini-JavaScript/))
    - Miscellaneous: Java ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Miscellaneous/Java%20codes/)), C ([link](https://gitfront.io/r/jllcps/18938c156943fd060834db4a7c953819356d7ac8/HKU/tree/Miscellaneous/C%20codes/))
`;

const experience = `
- [6/2021 - 8-2021] DeepTranslate (internship)
    - Work: improve PDF text extraction for preparing parallel corpus
    - Achievement: extracted 28% more text pairs from HK annual reports (now 91%)
    - Value: coding with a focus on efficiency and maintainability, identify deficiency in the design and redesign pipeline from scratch
`;

const others = `
- Static Web Apps
    - Text Editor ([link](https://jllcps.github.io/text-editor/main.html)): uses CodeMirror - [repo](https://github.com/codemirror/CodeMirror)
    - Diff Checker ([link](https://jllcps.github.io/diff-checker/main.html)): uses jsdiff - [repo](https://github.com/kpdecker/jsdiff)
    - EPUB Reader ([link](https://jllcps.github.io/epub-reader/main.html)): uses Epub.js - [repo](https://github.com/futurepress/epub.js/)
`;

var modal = document.getElementById("modal_body"),
    form = document.getElementById("message_form"),
    contact_info = document.getElementById("contact_info"),
    message_body = document.getElementById("message_body"),
    close_btn = document.getElementById("close_btn");

var recaptchaCallback = function() {
    grecaptcha.render("recaptcha", {
            sitekey: '6Ld0DVoeAAAAAJglvvZgCqMEwZpp1rhTBLxvwHJE'
    });
    addListeners();
};


function customSetContent() {
    document.getElementById('accordion-body-skills').innerHTML =
        marked.parse(skills);

    document.getElementById('accordion-body-projects').innerHTML =
        marked.parse(projects);

    document.getElementById('accordion-body-experience').innerHTML =
        marked.parse(experience);

    document.getElementById('accordion-body-others').innerHTML =
        marked.parse(others);
}


function addListeners() {
    modal.addEventListener('shown.bs.modal', () => {
        contact_info.focus();
        window.onbeforeunload = ev => false;
    });

    modal.addEventListener("hidden.bs.modal", () => {
        form.reset();
        grecaptcha.reset();
        window.onbeforeunload = undefined;
    });

    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        let response = grecaptcha.getResponse();
        if (!response || response.length === 0) {
            window.alert('Error: please complete the reCAPTCHA first');
            return false;
        }
        send_message()
            .then((data) => {
                window.alert("The message is sent successfully.");
                close_btn.click();
                grecaptcha.reset();
            })
            .catch((error) => {
                window.alert("Failed to send the message.");
                console.error('Error:', error);
            });
    });
}


async function send_message() {
    let options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            from: contact_info.value,
            message: message_body.value,
        })
    };
    const response = await fetch(message_webhook, options);
    return response.json();
}


customSetContent();
