// AudioSettings
class AudioSettings {
    constructor(element, duration) {
        this.element = element;
        this.duration = duration;
    }
}

const getMsToFormat = (time) => {
    const ms = Math.floor(time) % 1000;
    const seconds = Math.floor(time / 1000) % 60
    const minutes = Math.floor(time / 60000) % 60
    const hours = Math.floor(time / (60 * 60000));

    return`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};

const formatToMs = (format) => {
    const timers = format.split(':');
    const secondsSplit = timers[2].split(',');

    const hoursToMs = parseInt(timers[0]) * 1000 * 60 * 60;
    const minutesToMs = parseInt(timers[1]) * 1000 * 60;
    const secondsToMs = parseInt(secondsSplit[0]) * 1000;
    const msToMs = parseInt(secondsSplit[1]);

    const msTotal = hoursToMs + minutesToMs + secondsToMs + msToMs;

    return msTotal;
};


// Slider
class CustomSlider {
    #onUpdate;
    #onMove;
    #enabledColors = () => {
        this.slider.querySelector(".slider-track").style.background = "#ddd";
        this.slider.querySelector(".slider-thumb").style.background = "red";
        this.slider.querySelector("#guide-thumb").style.opacity = "100%";
    }
    #disabledColors = () => {
        this.slider.querySelector(".slider-track").style.background = "#222";
        this.slider.querySelector(".slider-thumb").style.background = "#444";
        this.slider.querySelector("#guide-thumb").style.opacity = "0%";
    }
    
    constructor(slider, onUpdate, onMove) {
        this.slider = slider;
        this.thumb = slider.querySelector(".slider-thumb");
        this.isDragging = false;
        this.#onUpdate = onUpdate;
        this.#onMove = onMove;

        this.thumb.addEventListener("mousedown", () => {
            this.isDragging = true;
        });

        document.addEventListener("mouseup", () => this.isDragging = false);

        document.addEventListener("mousemove", (e) => {
            if (this.isDragging) {
                this.updateThumb(e.clientX);
                this.#onMove(this.getPercent());
            }
        });

        this.slider.querySelector(".slider-track").addEventListener("click", (e) => {
            this.updateThumb(e.clientX);
            this.#onMove(this.getPercent());
        });
    }

    getSliderWidth() {
        const rect = this.slider.getBoundingClientRect();

        return rect.width;
    }

    getSliderOffset() {
        const rect = this.slider.getBoundingClientRect();

        return rect.left;
    }

    getPositionAtBar(posX = null) {
        const rectSlider = this.slider.getBoundingClientRect();

        const currentPosX = posX === null ? this.thumb.getBoundingClientRect().left + this.thumb.getBoundingClientRect().width / 2 : posX;

        let x = currentPosX - rectSlider.left;
        
        return Math.max(0, Math.min(x, rectSlider.width));
    }

    getPercent(posX = null) {
        const rectSlider = this.slider.getBoundingClientRect();
        const x = this.getPositionAtBar(posX);

        return (x / rectSlider.width);
    }

    updateThumb(clientX) {
        const percent = this.getPercent(clientX);

        this.thumb.style.left = `${percent * 100}%`;
        this.#onUpdate(percent);
    };

    enable() {
        this.slider.style.pointerEvents = "all"

        this.#enabledColors();
    }

    disable() {
        this.slider.style.pointerEvents = "none"
       
        this.#disabledColors();
    }
}


// Subtitles Markers
class SubtitleMarker {
    constructor(element, start, end, text) {
        this.id = crypto.randomUUID();
        this.element = element;
        this.start = start;
        this.end = end;
        this.text = text;

        this.element.addEventListener("click", () => {
            this.active();
        });
    }

    updateElement(targetDuration) {
        const percent = this.start / targetDuration;

        this.element.style.left = `${percent * 100}%`;
    }

    active() {
        const others = document.getElementsByClassName("sub-marker-active");
        for (let i = 0; i < others.length; i++) {
            others[i].classList.remove("sub-marker-active");
        }
        this.element.classList.add("sub-marker-active");

        activeSubtitleListElement(this.id);
    }
}

const createSubtitleMarker = (slider, start, end) => {
    const subtitleMarkerElement = document.createElement("div");
    subtitleMarkerElement.className = "sub-marker";
    subtitleMarkerElement.classList.add("sub-marker-unfinished");
    
    slider.appendChild(subtitleMarkerElement);

    const object = new SubtitleMarker(subtitleMarkerElement, start, end);

    return object;
}

const startInput = document.getElementById("start-editor");
const endInput = document.getElementById("end-editor");
const textEditor = document.getElementById("text-editor");
const saveSubtitleButton = document.getElementById("save-subtitle-button");
const restoreButton = document.getElementById("restore-button");

textEditor.addEventListener("input", (e) => {
    if (restoreButton.disabled) {
        restoreButton.disabled = false;
    }
});

// Sync Subtitle Markers
const subtitlesMarkersToList = (subtitleMarkers) => {
    startInput.disabled = true;
    endInput.disabled = true;
    textEditor.disabled = true;
    saveSubtitleButton.disabled = true;
    restoreButton.disabled = true;

    startInput.value = "";
    endInput.value = "";
    textEditor.value = "";

    const subtitleMarkersSorted = [...subtitleMarkers].sort((a, b) => a.start - b.start);

    const subMarkersList = document.getElementById("subtitles-markers-list");

    while (subMarkersList.firstChild) {
        subMarkersList.removeChild(subMarkersList.firstChild);
    }

    for (let i = 0; i < subtitleMarkersSorted.length; i++) {
        const subMarkerItem = document.createElement("li");
        subMarkerItem.className = "list-subtitle";
        subMarkerItem.id = `list-subtitle-${subtitleMarkersSorted[i].id}`
        subMarkerItem.innerHTML = `
            <p class="list-subtitle-count">${i + 1}</p>
            <p>:</p>
            <p class="list-subtitle-timer">${getMsToFormat(subtitleMarkersSorted[i].start)}</p>
            <p>-</p>
            <p class="list-subtitle-timer">${getMsToFormat(subtitleMarkersSorted[i].end)}</p>
            <p>:</p>
            <p class="list-subtitle-text">${subtitleMarkersSorted[i].text || ""}</p>
        `;

        subMarkerItem.addEventListener("click", () => {
            subtitleMarkers.find(sub => sub.id === subtitleMarkersSorted[i].id).active();
        });

        subMarkersList.appendChild(subMarkerItem);
    }
};

const activeSubtitleListElement = (id) => {
    const subMarkersList = document.getElementById("subtitles-markers-list");

    for (let i = 0; i < subMarkersList.childElementCount; i++) {
        subMarkersList.children[i].classList.remove("list-subtitle-active");
    }

    const selected = document.getElementById(`list-subtitle-${id}`);
    selected.classList.add("list-subtitle-active");

    startInput.disabled = false;
    endInput.disabled = false;
    textEditor.disabled = false;
    saveSubtitleButton.disabled = false;

    setControlsInfo(selected);
};

const setControlsInfo = (selected) => {
    const timersElement = selected.querySelectorAll(".list-subtitle-timer");

    const textContent = selected.querySelector(".list-subtitle-text").textContent;

    startInput.value = timersElement[0].textContent || "";
    endInput.value = timersElement[1].textContent || "";
    textEditor.value = textContent === undefined ?  "" : textContent;
};