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


// Slider
class CustomSlider {
    #onUpdate;
    #onMove;
    
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
    }

    disable() {
        this.slider.style.pointerEvents = "none"
    }
}


// Subtitles Markers
class SubtitleMarker {
    constructor(element, start, end, text) {
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
    }
}

const createSubtitleMarker = (slider, time) => {
    const subtitleMarkerElement = document.createElement("div");
    subtitleMarkerElement.className = "sub-marker";
    subtitleMarkerElement.classList.add("sub-marker-unfinished");
    
    slider.appendChild(subtitleMarkerElement);

    const object = new SubtitleMarker(subtitleMarkerElement, time, "Sample Text");

    return object;
}