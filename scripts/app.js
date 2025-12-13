// Header and Workspace
const loadProjectInput = document.getElementById("load-project-input");

const projectName = document.getElementById("project-name");
const newProjectButton = document.getElementById("new-project-button");
const loadProjectButton = document.getElementById("load-project-button");
const saveButton = document.getElementById("save-button");
const saveAsButton = document.getElementById("save-as-button");
const exportButton = document.getElementById("export-button");

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


// Global Variables
let projectOpened = false;


//Initialization
setupWorkspace();