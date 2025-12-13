// Header and Workspace
const loadProjectInput = document.getElementById("load-project-input");

const projectName = document.getElementById("project-name");
const newProjectButton = document.getElementById("new-project-button");
const loadProjectButton = document.getElementById("load-project-button");
const saveButton = document.getElementById("save-button");
const saveAsButton = document.getElementById("save-as-button");
const exportButton = document.getElementById("export-button");

let projectOpened = false;

const setupWorkspace = () => {
    if (!projectOpened) {
        projectName.style.display = "none";
        saveButton.disabled = true;
        saveAsButton.disabled = true;
        exportButton.disabled = true;

        return;
    }

    projectName.style.display = "block";
    saveButton.disabled = false;
    saveAsButton.disabled = false;
    exportButton.disabled = false;
};

newProjectButton.addEventListener("click", () => {
    projectOpened = true;
    projectName.textContent = "untitled.sbtr";

    setupWorkspace();
});

loadProjectButton.addEventListener("click", () => {
    loadProjectInput.click();
});

loadProjectInput.addEventListener("change", (e) => {
    const files = e.target.files;
    console.log (files);
});

saveButton.addEventListener("click", () => {
    console.log("saved");
});

saveAsButton.addEventListener("click", () => {
    console.log("saved on a new location");
});

exportButton.addEventListener("click", () => {
    console.log("exported");
});


// Slider
class CustomSlider {
    constructor(slider) {
        this.slider = slider;
        this.thumb = slider.querySelector(".slider-thumb");
        this.isDragging = false;

        this.thumb.addEventListener("mousedown", () => this.isDragging = true);
        document.addEventListener("mouseup", () => this.isDragging = false);

        document.addEventListener("mousemove", (e) => {
            if (this.isDragging) this.updateThumb(e.clientX);
        });

        this.slider.addEventListener("click", (e) => {
            this.updateThumb(e.clientX);
        });
    }

    updateThumb(clientX) {
        const rect = this.slider.getBoundingClientRect();
        let x = clientX - rect.left;

        x = Math.max(0, Math.min(x, rect.width));
        const percent = x / rect.width;

        this.thumb.style.left = `${percent * 100}%`;

        console.log(Math.round(percent * 100));
    };
}

const audioSlider = new CustomSlider(document.getElementById("audio-slider"));


// Initialization
setupWorkspace();