<!doctype html>
<html lang="en" class="h-100">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>jllcps</title>
    <link rel="icon" type="image/png" href="assets/favicon.png">

    <script type="text/javascript">
        var recaptchaCallback = function () {
            grecaptcha.render("recaptcha", {
                    sitekey: '6Ld0DVoeAAAAAJglvvZgCqMEwZpp1rhTBLxvwHJE'
            });
        };
    </script>
    <script src="https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit" async defer></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link href="assets/index.css" rel="stylesheet">

    <script type="text/javascript" src="assets/particle-network.min.js"></script>
</head>

<body class="d-flex h-100">

    <div class="h-100 w-100 p-0 m-0" id="particle"></div>

    <div class="cover-container d-flex w-100 h-100 mx-auto flex-column card-img-overlay">

        <header class="mb-auto text-center">
                <nav class="nav nav-masthead justify-content-center float-md-start">
                    <a class="nav-link" href="text-editor/main.html">Text Editor</a>
                    <a class="nav-link" href="diff-checker/main.html">Diff Checker</a>
                    <a class="nav-link" href="epub-reader/main.html">EPUB Reader</a>
                    <a class="nav-link" href="quick-links/main.html">Quick Links</a>
                </nav>
                <nav class="nav nav-masthead justify-content-center float-md-end">
                    <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#modal_body">Contact</a>
                </nav>
        </header>

        <div class="modal fade" id="modal_body" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <form id="message_form">
                    <div class="modal-body">
                        <input type="text" class="form-control mb-1" id="contact_info" placeholder="Enter your contact details" required>
                        <textarea class="form-control" id="message_body" rows="5" placeholder="Enter the message" required></textarea>
                    </div>
                    <div class="modal-footer">
                        <div class="w-100">
                            <div id="recaptcha" class="float-md-end"></div>
                        </div>
                        <button type="button" class="btn btn-dark" data-bs-dismiss="modal" id="close_btn">Close</button>
                        <button type="submit" class="btn btn-dark">Send</button>
                    </div>
                    <form>
                </div>
            </div>
        </div>

        <div class="accordion shadow-sm" id="accordion_items">

            <div class="accordion-item">
                <h2 class="accordion-header" id="head_skills">
                    <label class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#body_skills" aria-expanded="false" aria-controls="body_skills">
                        Skills
                    </label>
                </h2>
                <div id="body_skills" class="accordion-collapse collapse" aria-labelledby="head_skills" data-bs-parent="#accordion_items">
                    <div class="accordion-body" id="accordion-body-skills"></div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="head_projects">
                    <label class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#body_projects" aria-expanded="false" aria-controls="body_projects">
                        Projects
                    </label>
                </h2>
                <div id="body_projects" class="accordion-collapse collapse" aria-labelledby="head_projects" data-bs-parent="#accordion_items">
                    <div class="accordion-body" id="accordion-body-projects"></div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="head_experience">
                    <label class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#body_experience" aria-expanded="false" aria-controls="body_experience">
                        Experience
                    </label>
                </h2>
                <div id="body_experience" class="accordion-collapse collapse" aria-labelledby="head_experience" data-bs-parent="#accordion_items">
                    <div class="accordion-body" id="accordion-body-experience"></div>
                </div>
            </div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="head_others">
                    <label class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#body_others" aria-expanded="false" aria-controls="body_others">
                        Others
                    </label>
                </h2>
                <div id="body_others" class="accordion-collapse collapse" aria-labelledby="head_others" data-bs-parent="#accordion_items">
                    <div class="accordion-body" id="accordion-body-others"></div>
                </div>
            </div>

        </div>

        <footer class="mt-auto text-center">
            <p class="lead">An Undergraduate at HKU CS</p>
        </footer>

    </div>

</body>

<script>

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

    document.getElementById('accordion-body-skills').innerHTML =
        marked.parse(skills);

    document.getElementById('accordion-body-projects').innerHTML =
        marked.parse(projects);

    document.getElementById('accordion-body-experience').innerHTML =
        marked.parse(experience);

    document.getElementById('accordion-body-others').innerHTML =
        marked.parse(others);

</script>


<script>
    var message_webhook = "http://34.123.12.53:3000/users/1/web_requests/39/notify";
    
    $('#modal_body').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');
    });

    $("#message_form").on("submit", function(ev){
        ev.preventDefault();
        if(grecaptcha.getResponse() === "") {
            alert('Error: please complete the reCAPTCHA first');
            return false;
        }
        $.ajax({
            type : "POST",
            url: message_webhook,
            data: {
                from: $("#contact_info").val(),
                message: $("#message_body").val()
            },
            success: function(data, textStatus) {
                alert("The message is sent successfully.");
                $("#close_btn").click();
                grecaptcha.reset();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Failed to send the message.");
                console.log(JSON.stringify(jqXHR));
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    });

    $('#modal_body').on('shown.bs.modal', function () {
        $('#contact_info').trigger('focus');
    });

    $('#modal_body').on('hidden.bs.modal', function () {
        grecaptcha.reset();
    });

</script>

<script>

    var canvas_div = document.getElementById("particle");

    var options = {
        particleColor: '#333',
        background: '#fafafa',
        interactive: false,
        speed: 0.16,
        density: 18000   // 'low': 20000, 'medium': 10000
    };

    var particle_canvas = new ParticleNetwork(canvas_div, options);

</script>

</html>