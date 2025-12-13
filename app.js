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
const audioSlider = document.getElementById("audio-slider");
const audioSliderThumb = document.getElementById("audio-slider-thumb");

let isDragging = false;

const updateThumb = (clientX) => {
    const rect = audioSlider.getBoundingClientRect();
    let x = clientX - rect.left;

    x = Math.max(0, Math.min(x, rect.width));
    const percent = x / rect.width;

    audioSliderThumb.style.left = `${percent * 100}%`;

    console.log(Math.round(percent * 100));
};

audioSliderThumb.addEventListener("mousedown", () => isDragging = true);
document.addEventListener("mouseup", () => isDragging = false);

document.addEventListener("mousemove", (e) => {
    if (isDragging) updateThumb(e.clientX);
});

audioSlider.addEventListener("click", (e) => {
    updateThumb(e.clientX);
});


// Initialization
setupWorkspace();