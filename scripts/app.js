// Header and Workspace
const loadProjectInput = document.getElementById("load-project-input");
const loadSongInput = document.getElementById("load-song-input");

const projectName = document.getElementById("project-name");
const newProjectButton = document.getElementById("new-project-button");
const loadProjectButton = document.getElementById("load-project-button");
const saveButton = document.getElementById("save-button");
const saveAsButton = document.getElementById("save-as-button");
const exportButton = document.getElementById("export-button");

const audioPlayPauseButton = document.getElementById("audio-playplause-button");
const addSubMarkerButton = document.getElementById("add-sub-marker-button");

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
    loadSongInput.click();
});

loadSongInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log (file);

    if (file) {
        const fileURL = URL.createObjectURL(file);
        const audioLoaded = document.createElement('audio');

        audioLoaded.addEventListener("loadedmetadata", () => {
            const duration = Math.round(audioLoaded.duration * 1000);

            audio = new AudioSettings(audioLoaded, duration);

            projectName.textContent = "untitled.sbtr";

            projectLoaded();

            URL.revokeObjectURL(fileURL);
        });

        audioLoaded.src = fileURL;
        audioLoaded.preload = 'metadata';
    }
});

loadProjectButton.addEventListener("click", () => {
    loadProjectInput.click();
});

loadProjectInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log (file);
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

function addSubMarker() {
    if (subtitleMarkers.find(sub => sub.time === audio.element.currentTime * 1000)) {
        console.error("The subtitles markers can not be on the same position");
        return;
    }

    subtitleMarkers.push(createSubtitleMarker(audioSlider.slider, audio.element.currentTime * 1000))
    subtitleMarkers[subtitleMarkers.length - 1].updateElement(audio.duration);
}

const projectLoaded = () => {
    subtitleMarkers = [];
    audioSlider.updateThumb(0);
    const currentMarkersElements = document.querySelectorAll(".sub-marker");
    for (let i = 0; i < currentMarkersElements.length; i++) {
        currentMarkersElements[i].remove();
    }

    addSubMarkerButton.removeEventListener("click", addSubMarker);

    projectOpened = true;
    setupWorkspace();

    const endDuration = getMsToFormat(audio.duration);
    document.getElementById("audio-end").textContent = endDuration;

    audioPlayPauseButton.addEventListener("click", () => {
        if (audio.element.paused) {
            audio.element.play()
        } else {
            audio.element.pause();
        }
    });

    audioPlayPauseButton.disabled = false;

    audio.element.addEventListener('timeupdate', (e) => {
        if (e.target.paused) return;
        
        const clientX = audioSlider.getSliderOffset() + audioSlider.getSliderWidth() * (e.target.currentTime * 1000 / audio.duration);

        audioSlider.updateThumb(clientX);
    });

    addSubMarkerButton.disabled = false;
    addSubMarkerButton.addEventListener("click", addSubMarker);

    audioSlider.enable();
};


// Global Variables
addSubMarkerButton.disabled = true;
let projectOpened = false;
let audio;
const audioSlider = new CustomSlider(document.getElementById("audio-slider"), (percent) => {
    document.getElementById("audio-current").textContent = getMsToFormat(audio.duration * percent);
}, (percent) => {
    audio.element.currentTime = audio.duration / 1000 * percent;
});
audioSlider.disable();
let subtitleMarkers = [];

//Initialization
audioPlayPauseButton.disabled = true;
setupWorkspace();