// Header and Workspace
const loadProjectInput = document.getElementById("load-project-input");
const loadSongInput = document.getElementById("load-song-input");

const filenameEl = document.getElementById("filename");
const projectName = document.getElementById("project-name");
const newProjectButton = document.getElementById("new-project-button");
const loadProjectButton = document.getElementById("load-project-button");
const exportButton = document.getElementById("export-button");
const filenameExt = document.getElementById("filename-ext");

const audioPlayPauseButton = document.getElementById("audio-playplause-button");
const addSubMarkerButton = document.getElementById("add-sub-marker-button");
const removeSubMarkerButton = document.getElementById("remove-sub-marker-button");

const setupWorkspace = () => {
    if (!projectOpened) {
        filenameEl.style.display = "none";
        exportButton.disabled = true;

        return;
    }

    filenameEl.style.display = "flex";
};

newProjectButton.addEventListener("click", () => {
    loadSongInput.click();
});

loadSongInput.addEventListener("change", (e) => {
    if (audio) audio.element.pause();

    const file = e.target.files[0];
    console.log (file);

    if (file) {
        const fileURL = URL.createObjectURL(file);
        const audioLoaded = document.createElement('audio');

        audioLoaded.addEventListener("loadedmetadata", () => {
            const duration = Math.round(audioLoaded.duration * 1000);

            audio = new AudioSettings(audioLoaded, duration);

            projectName.value = "untitled";

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
    console.log(file);
    if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            const text = event.target.result;
            strToMarkers(text);
        };
        
        reader.onerror = (err) => {
            console.error(err);
        };
        
        reader.readAsText(file);
    }
});

exportButton.addEventListener("click", () => {
    const content = (() => {
        switch (filenameExt.value) {
            case ".str":
                return getMarkersToSrt(subtitleMarkers);
            case ".json":
                return getMarkersToJson(subtitleMarkers);
        }
    })();
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    
    a.style.display = 'none';
    a.href = url;
    a.download = `${projectName.value}${filenameExt.value}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);

    console.log(getMarkersToSrt(subtitleMarkers));
});

function canPutMarker() {
    const currentTime = audio.element.currentTime * 1000;

    if (subtitleMarkers.find(sub => sub.start === currentTime)) {
        console.error("The subtitles markers can not be on the same position");
        return false;
    }

    if (subtitleMarkers.find(sub => sub.start < currentTime && sub.end > currentTime)) {
        console.error("The subtitles markers can not be between other markers.");
        return false;
    }

    return true
}

function addSubMarker() {
    if (!canPutMarker()) return;

    const startTime = audio.element.currentTime * 1000;
    subtitleMarkers.push(createSubtitleMarker(audioSlider.slider, startTime, startTime))
    subtitleMarkers[subtitleMarkers.length - 1].updateElement(audio.duration);
    
    subtitlesMarkersToList(subtitleMarkers);
    subtitleMarkers[subtitleMarkers.length - 1].active();
}

function addSubMarkerBuffer(start, end, text) {
    subtitleMarkers.push(createSubtitleMarker(audioSlider.slider, start, end))
    subtitleMarkers[subtitleMarkers.length - 1].updateElement(audio.duration);
    subtitleMarkers[subtitleMarkers.length - 1].text = text;
}

function playPauseAudio() {
    if (audio.element.paused) {
        audio.element.play()
    } else {
        audio.element.pause();
    }
}

const subtitleViewerText = document.getElementById("subtitle-viewer-text");

let currentText = "";
const checkInterval = setInterval(() => {
    if (!projectOpened) return;

    if (audio.element.paused) return;
        
    const clientX = audioSlider.getSliderOffset() + audioSlider.getSliderWidth() * (audio.element.currentTime * 1000 / audio.duration);

    audioSlider.updateThumb(clientX);

    if (subtitleMarkers.length > 0) {
        const selectedSub = subtitleMarkers.find(sub => {
            if (sub.text) {
                if (sub.start < audio.element.currentTime * 1000 && sub.end > audio.element.currentTime * 1000 && sub.text.trim("").length > 0) {
                    return sub;
                }
            }
        })

        if (selectedSub) {
            if (currentText != selectedSub.text) {
                currentText = selectedSub.text;
                subtitleViewerText.innerHTML = currentText;

                if (subtitleViewerText.parentElement.style.opacity !== "100%") {
                    subtitleViewerText.parentElement.style.opacity = "100%";
                }
            }
        } else {
            if (subtitleViewerText.parentElement.style.opacity !== "0%") {
                subtitleViewerText.parentElement.style.opacity = "0%";

                currentText = "";
            }
        }
    }
}, 25);

function removeActiveMarker() {
    const selected = subtitleMarkers.find(sub => sub.element.classList.contains("sub-marker-active"));

    if (!selected) return;

    selected.element.remove();
    selected.guide.remove();
    subtitleMarkers.splice(subtitleMarkers.indexOf(selected), 1);

    subtitlesMarkersToList(subtitleMarkers);
    
    removeSubMarkerButton.disabled = true;
}

removeSubMarkerButton.addEventListener("click", () => {
    removeActiveMarker();
});

const projectLoaded = () => {
    for (let i = 0; i < subtitleMarkers.length; i++) {
        subtitleMarkers[i].element.remove();
        subtitleMarkers[i].guide.remove();
    }
    subtitleMarkers = [];
    audioSlider.updateThumb(0);
    subtitlesMarkersToList(subtitleMarkers);

    addSubMarkerButton.removeEventListener("click", addSubMarker);

    if (subtitleViewerText.parentElement.style.opacity !== "0%") {
        subtitleViewerText.parentElement.style.opacity = "0%";

        currentText = "";
    }

    loadProjectButton.disabled = false;

    projectOpened = true;
    setupWorkspace();

    const endDuration = getMsToFormat(audio.duration);
    document.getElementById("audio-end").textContent = endDuration;

    audioPlayPauseButton.disabled = false;
    audioPlayPauseButton.addEventListener("click", playPauseAudio);

    audio.element.addEventListener('timeupdate', (e) => {
        
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
restoreButton.addEventListener("click", () => {
    const selected = document.getElementsByClassName("list-subtitle-active")[0];

    setControlsInfo(selected);
    restoreButton.disabled = true;
});

saveSubtitleButton.addEventListener("click", () => {
    const selected = subtitleMarkers.find(sub => sub.element.classList.contains("sub-marker-active"));

    const start = formatToMs(startInput.value);
    const end = formatToMs(endInput.value);

    if (start < 0 || start > audio.duration) return console.error("The start time is out of the range.");

    if (end < 0 || end > audio.duration) return console.error("The end time is out of the range.");

    if (end < start) return console.error("The end time can not be lower than the start time");

    const hasCollision = subtitleMarkers.find(sub => {
        if (sub !== selected) {
            if ((start >= sub.start && start < sub.end) || 
                (end > sub.start && end <= sub.end) ||
                (start <= sub.start && end >= sub.end)) {
                return true;
            }
        }
        return false;
    });

    if (hasCollision) {
        return console.error("The subtitle marker cannot overlap with another marker.");
    }

    selected.start = start;
    selected.end = end;
    selected.text = textEditor.value;
    
    subtitlesMarkersToList(subtitleMarkers);
    selected.active();
    selected.updateElement(audio.duration);
});

audioPlayPauseButton.disabled = true;
startInput.disabled = true;
endInput.disabled = true;
textEditor.disabled = true;
setupWorkspace();


// Keyboards Hotkeys
let shiftHold = false;
let ctrlHold = false;

let mouseOnControls = false;

const subtitlesMarkersContainer = document.getElementById("subtitles-markers-container");
subtitlesMarkersContainer.addEventListener("mouseenter", () => {
    mouseOnControls = true;
});

subtitlesMarkersContainer.addEventListener("mouseleave", () => {
    mouseOnControls = false;
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
    }

    if (!projectOpened) return;

    if (document.activeElement === textEditor) return;
    if (document.activeElement ===  startInput) return;
    if (document.activeElement ===  endInput) return;
    if (document.activeElement === projectName) return;

    document.activeElement.blur();

    function moveSubMarker(force) {
        if (subtitleMarkers.length <= 0) return;

        const subMarkerSelected = subtitleMarkers.find(sub => sub.element.classList.contains("sub-marker-active"));

        if (subMarkerSelected) {
            const newStart = subMarkerSelected.start + force;
            const newEnd = subMarkerSelected.end + force;

            if (newStart < 0 || newStart > audio.duration) {
                return console.log("Cannot move marker outside audio duration.");
            }

            if (newEnd < 0 || newEnd > audio.duration) {
                return console.log("Cannot move marker outside audio duration.");
            }

            const hasCollision = subtitleMarkers.find(sub => {
                if (sub !== subMarkerSelected) {
                    if ((newStart >= sub.start && newStart < sub.end) || 
                        (newEnd > sub.start && newEnd <= sub.end) ||
                        (newStart <= sub.start && newEnd >= sub.end)) {
                        return true;
                    }
                }
                return false;
            });

            if (hasCollision) {
                return console.log("The selected subtitle marker cannot be moved forward.");
            }

            subMarkerSelected.start = newStart;
            subMarkerSelected.end = newEnd;

            subtitlesMarkersToList(subtitleMarkers);
            subMarkerSelected.active();
            subMarkerSelected.updateElement(audio.duration);
        }
    }

    function moveSlider(force) {
        const forceReal = force / 1000;

        audio.element.currentTime += forceReal;

        const clientX = audioSlider.getSliderOffset() + audioSlider.getSliderWidth() * (audio.element.currentTime * 1000 / audio.duration);

        audioSlider.updateThumb(clientX);
    }

    const pressedKey = e.key.toLowerCase();

    if (pressedKey === "shift") {
        shiftHold = true;
    }

     if (pressedKey === "control") {
        ctrlHold = true;
    }

    if (pressedKey === "e") {
        if (!shiftHold) { 
            moveSubMarker(500);
        } else {
            moveSubMarker(50);
        }
    }

    if (pressedKey === "q") {
        if (!shiftHold) { 
            moveSubMarker(-500);
        } else {
            moveSubMarker(-50);
        }
    }

    if (pressedKey === "d") {
        if (!shiftHold) {
            moveSlider(750);
        } else {
            moveSlider(50);
        }
    }

    if (pressedKey === "a") {
        if (ctrlHold) {
            addSubMarker()
            return;
        }

        if (!shiftHold) {
            moveSlider(-750);
        } else {
            moveSlider(-50);
        }
    }

    if (pressedKey === "delete") {
        removeActiveMarker();
    }

    if (pressedKey === "x") {
        if (ctrlHold) {
            removeActiveMarker();
        }
    }

    if (pressedKey === " ") {
        playPauseAudio();
    }
});

document.addEventListener("wheel", (e) => {
    if (!projectOpened) return;

    if (document.activeElement === textEditor) return;
    if (document.activeElement ===  startInput) return;
    if (document.activeElement ===  endInput) return;
    if (document.activeElement ===  projectName) return;

    if (mouseOnControls) return;

    function moveDuration(force) {
        if (subtitleMarkers.length <= 0) return;

        const subMarkerSelected = subtitleMarkers.find(sub => sub.element.classList.contains("sub-marker-active"));

        if (subMarkerSelected) {
            const newStart = subMarkerSelected.start + force;
            const newEnd = subMarkerSelected.end + force;

            if (newEnd < 0 || newEnd > audio.duration) {
                return console.log("Cannot move marker outside audio duration.");
            }

            const hasCollision = subtitleMarkers.find(sub => {
                if (sub !== subMarkerSelected) {
                    if ((newStart >= sub.start && newStart < sub.end) || 
                        (newEnd > sub.start && newEnd <= sub.end) ||
                        (newStart <= sub.start && newEnd >= sub.end)) {
                        return true;
                    }
                }
                return false;
            });

            if (hasCollision) {
                return console.log("The selected subtitle marker cannot be moved forward.");
            }

            subMarkerSelected.end += force;
            if (subMarkerSelected.end < subMarkerSelected.start) subMarkerSelected.end = subMarkerSelected.start;

            subtitlesMarkersToList(subtitleMarkers);
            subMarkerSelected.active();
            subMarkerSelected.updateElement(audio.duration);
        }
    }

    if (e.deltaY > 0) {
        if (!shiftHold) {
            moveDuration(-500);
        } else {
            moveDuration(-50);
        }
    } else {
        if (!shiftHold) {
            moveDuration(500);
        } else {
            moveDuration(50);
        }
    }
});

document.addEventListener("keyup", (e) => {
    const keyUp = e.key.toLowerCase();

    if (keyUp === "shift") shiftHold = false;

    if (keyUp === "control") ctrlHold = false;
});