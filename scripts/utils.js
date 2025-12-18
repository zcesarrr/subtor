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
        this.slider.querySelector(".slider-track").style.background = "#3f3e3e";
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
    constructor(element, guide, start, end, text) {
        this.id = crypto.randomUUID();
        this.element = element;
        this.guide = guide;
        this.start = start;
        this.end = end;
        this.text = text;

        this.element.addEventListener("click", () => {
            this.active();
        });
    }

    updateElement(targetDuration) {
        const percent = this.start / targetDuration;

        const duration = this.end - this.start;
        const durationPercent = (duration / targetDuration);

        this.element.style.left = `${percent * 100}%`;
        this.guide.style.left = `${percent * 100}%`;
        this.guide.style.width = `${durationPercent * 100}%`;
    }

    active() {
        const others = document.getElementsByClassName("sub-marker-active");
        for (let i = 0; i < others.length; i++) {
            others[i].classList.remove("sub-marker-active");
        }
        this.element.classList.add("sub-marker-active");

        activeSubtitleListElement(this.id);

        removeSubMarkerButton.disabled = false;
    }
}

const createSubtitleMarker = (slider, start, end) => {
    const subtitleMarkerElement = document.createElement("div");
    subtitleMarkerElement.className = "sub-marker";
    subtitleMarkerElement.classList.add("sub-marker-unfinished");

    const guideElement = document.createElement("div");
    guideElement.className = "duration-guide";
    
    slider.appendChild(subtitleMarkerElement);
    slider.appendChild(guideElement);

    const object = new SubtitleMarker(subtitleMarkerElement, guideElement, start, end);

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
        if (subtitleMarkersSorted[i].text) {
            if (subtitleMarkersSorted[i].text.trim("").length > 0) {
                if (subtitleMarkersSorted[i].element.classList.contains("sub-marker-unfinished")) {
                    subtitleMarkersSorted[i].element.classList.remove("sub-marker-unfinished");
                }
            } else {
                if (!subtitleMarkersSorted[i].element.classList.contains("sub-marker-unfinished")) {
                    subtitleMarkersSorted[i].element.classList.add("sub-marker-unfinished");
                }
            }
        } else {
            if (!subtitleMarkersSorted[i].element.classList.contains("sub-marker-unfinished")) {
                subtitleMarkersSorted[i].element.classList.add("sub-marker-unfinished");
            }
        }

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

    if (subtitleMarkers.length <= 0) {
        exportButton.disabled = true;
    } else {
        exportButton.disabled = false;
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

    const textContent = selected.querySelector(".list-subtitle-text").innerHTML;

    startInput.value = timersElement[0].textContent || "";
    endInput.value = timersElement[1].textContent || "";
    textEditor.value = textContent === undefined ?  "" : textContent;
};

const checkAndGetMs = (value) => {
    const valueStr = value.toString();

    const checkTimestampFormat = (v) => {
        const regex = /^\d+:[0-5]\d:[0-5]\d,\d{3}$/;
        return regex.test(v);
    };

    if (checkTimestampFormat(valueStr)) {
        return formatToMs(valueStr);
    }

    if (!valueStr.includes(".")) {
        return parseInt(valueStr);
    }

    if (valueStr.includes(".")) {
        return parseFloat(valueStr) * audio.duration;
    }
};

const createMarkersByBuffer = (buffer) => {
    for (let i = 0; i < subtitleMarkers.length; i++) {
        subtitleMarkers[i].element.remove();
        subtitleMarkers[i].guide.remove();
    }

    subtitleMarkers = [];

    for (let i = 0; i < buffer.length; i++) {
        addSubMarkerBuffer(buffer[i][0], buffer[i][1], buffer[i][2]);
    }

    subtitlesMarkersToList(subtitleMarkers);
    subtitleMarkers[subtitleMarkers.length - 1].active();
};

const validateRanges = (start, end) => {
    if (start < 0 || start > audio.duration) {
        return false;
    } 

    if (end < 0 || end > audio.duration) {
        return false;
    }

    return true
};

const srtToMarkers = (content) => {
    const linesData = content.split('\n\n');

    let markersBuffer = [];

    for (let i = 0; i < linesData.length; i++) {
        const datas = linesData[i].split('\n');
        const timestamps = datas[1].split(' --> ');

        const start = checkAndGetMs(timestamps[0]);
        const end = checkAndGetMs(timestamps[1]);

        if (!validateRanges(start, end)) {
            console.error(`The line #${i + 1} has a timestamp out of the range.`);
            return;
        }

        markersBuffer.push([start, end, datas[2]]);
    }

    createMarkersByBuffer(markersBuffer);
};

const jsonToMarkers = (content) => {
    const obj = JSON.parse(content);

    let markersBuffer = [];

    for (let i = 0; i < obj.length; i++) {
        const start = checkAndGetMs(obj[i].start);
        const end = checkAndGetMs(obj[i].end);
        const text = obj[i].text;

        if (!validateRanges(start, end)) {
            console.error(`The line #${i + 1} has a timestamp out of the range.`);
            return;
        }

        markersBuffer.push([start, end, text]);
    }

    createMarkersByBuffer(markersBuffer);
};

const psvToMarkers = (content) => {
    const lines = content.split('\n');

    let markersBuffer = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].split('|');

        const start = checkAndGetMs(line[1]);
        const end = checkAndGetMs(line[2]);
        const text = line[3];

        if (!validateRanges(start, end)) {
            console.error(`The line #${i + 1} has a timestamp out of the range.`);
            return;
        }

        markersBuffer.push([start, end, text]);
    }

    createMarkersByBuffer(markersBuffer);
};

const getCountMethod = (value) => {
    return (() => {
        switch (formatOption.value) {
            case "format":
                return getMsToFormat(value);
            case "ms":
                return value;
            case "normalized":
                return value / audio.duration;
        }
    })()
};

const getMarkersToSrt = (markers) => {
    let content = "";

    for (let i = 0; i < markers.length; i++) {
        const start = getMsToFormat(markers[i].start);
        const end = getMsToFormat(markers[i].end);

        content += `${i + 1}\n${start} --> ${end}\n${markers[i].text}`;
        if (i < markers.length - 1) content += "\n\n";
    }

    return content;
};

const getMarkersToJson = (markers) => {
    let content = [];

    for (let i = 0; i < markers.length; i++) {
        content.push({
            id: i + 1,
            start: getCountMethod(markers[i].start),
            end: getCountMethod(markers[i].end),
            text: markers[i].text
        });
    }

    return JSON.stringify(content);
};

const getMarkersToTxt = (markers) => {
    let content = "";

    for (let i = 0; i < markers.length; i++) {
        const start = getCountMethod(markers[i].start);
        const end = getCountMethod(markers[i].end);

        content += `${i+1}|${start}|${end}|${markers[i].text}`;
        if (i < markers.length - 1) content += "\n";
    }

    return content;
};
