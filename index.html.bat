<!doctype html>
<html lang="en" class="h-100">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>jllcps</title>
    <link rel="icon" type="image/png" href="assets/favicon.png">

    <link async href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" rel="stylesheet">
    <link async href="assets/index.css" rel="stylesheet">

    <script defer src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" type="text/javascript"></script>
    <script defer src="assets/index.js" type="text/javascript"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous" type="text/javascript"></script>
    <script defer src="https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit" type="text/javascript"></script>
    <script defer src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
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
            <p class="lead">HKU Computer Science Graduate</p>
        </footer>
    </div>

    <script src="assets/particle-network.min.js" type="text/javascript"></script>
</body>

    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> -->

<script>

    // $('#modal_body').on('hidden.bs.modal', function () {
    //     $(this).find('form').trigger('reset');
    // });

    // $("#message_form").on("submit", function(ev){
    //     ev.preventDefault();
    //     if (grecaptcha.getResponse() === "") {
    //         alert('Error: please complete the reCAPTCHA first');
    //         return false;
    //     }
    //     $.ajax({
    //         type : "POST",
    //         url: message_webhook,
    //         data: {
    //             from: $("#contact_info").val(),
    //             message: $("#message_body").val()
    //         },
    //         success: function(data, textStatus) {
    //             alert("The message is sent successfully.");
    //             $("#close_btn").click();
    //             grecaptcha.reset();
    //         },
    //         error: function(jqXHR, textStatus, errorThrown) {
    //             alert("Failed to send the message.");
    //             console.log(JSON.stringify(jqXHR));
    //             console.log(textStatus);
    //             console.log(errorThrown);
    //         }
    //     });
    // });

    // $('#modal_body').on('shown.bs.modal', function () {
    //     $('#contact_info').trigger('focus');
    // });

    // $('#modal_body').on('hidden.bs.modal', function () {
    //     grecaptcha.reset();
    // });

</script>

</html>
