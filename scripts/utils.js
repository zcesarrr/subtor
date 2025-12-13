// AudioSettings
class AudioSettings {
    constructor(duration) {
        this.duration = duration;
    }
}


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
    };
}


// Subtitles Markers
class SubtitleMarker {
    constructor(element, time) {
        this.element = element;
        this.time = time;
    }

    updateElement(targetDuration) {
        const percent = this.time / targetDuration;

        this.element.style.left = `${percent * 100}%`;
    }
}

const createSubtitleMarker = (time) => {
    const subtitleMarkerElement = document.createElement("div");
    subtitleMarkerElement.className = "sub-marker";
    
    audioSlider.slider.appendChild(subtitleMarkerElement);

    const object = new SubtitleMarker(subtitleMarkerElement, time);

    return object;
}


const audioSlider = new CustomSlider(document.getElementById("audio-slider"));

let subtitleMarkers = [];
subtitleMarkers.push(createSubtitleMarker());


// Test
audio = new AudioSettings(2500);