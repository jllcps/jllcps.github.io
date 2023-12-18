import * as script from "./index.js";

const app = PetiteVue.createApp({
    submitText() {
        script.submitText();
    },

    prevPage(event) {
        const mySidenav = document.getElementById('mySidenav');
        if (mySidenav.classList.contains("hidden")) {
            script.prevPage();
        }
    },

    nextPage(event) {
        const mySidenav = document.getElementById('mySidenav');
        if (mySidenav.classList.contains("hidden")) {
            script.nextPage();
        }
    },

    changeFontSize(isIncrement) {
        script.changeFontSize(isIncrement);
    },

    expandToolbar(event) {
        const toolbarElement = event.currentTarget;
        script.toggleNav();
        toolbarElement.classList.toggle("active");
        if (toolbarElement.classList.contains("active")) {
            script.highlightChapter();
        } else {
            script.foldAll();
        }
    },

    dropFile(event) {
        const inputElement = event.currentTarget;
        inputElement.files = event.dataTransfer.files;

        var changeEvent = document.createEvent("HTMLEvents");
        changeEvent.initEvent("change", false, true);
        inputElement.dispatchEvent(changeEvent);
    },

    loadFile(event) {
        if (!window.FileReader) {
            return;
        }

        const file = event.target.files[0];
        const filename = file.name;
        const filetype = file.type;

        let reader = new FileReader();
        reader.addEventListener("load", ev => {   // onloadend
            script.handleFile(ev, filetype);
            document.title = filename;
        });

        if (filetype.includes("epub")) {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    },

    initStates() {
    },

    mounted() {
        // this.initStates();
        document.getElementById("vueapp").classList.remove("hidden");
    }
})

app.mount('#vueapp');