# 🎬 Subtor

**A lightweight subtitle editor for quick and efficient subtitle creation.**

Subtor is a simple, browser-based subtitle editor designed for projects that don't require complex subtitle systems. Perfect for content game engines, creators, video editors, and anyone who needs to create subtitles quickly without the overhead of professional tools.

---

## ✨ Features

### 🎵 Audio Management
- **Audio Loader** with visual timeline system
- Supports multiple audio formats: `.mp3`, `.wav`, `.ogg`
- Real-time audio playback with visual progress tracking
- Precise timeline navigation with keyboard shortcuts

### 📝 Subtitle Management
- **Visual Subtitle Markers** on the timeline
- **Live Subtitle Preview** while audio plays
- **Collision Detection** prevents overlapping subtitles
- Interactive subtitle list with quick navigation
- Text editor with start/end time controls
- Restore function to revert unsaved changes

### 📁 Import & Export
**Import Formats:**
- `.srt` (SubRip)
- `.json` (JSON format)
- `.txt` (Pipe-Separated Values)

**Export Options:**
- File Formats: `.srt`, `.json`, `.txt` (PSV)
- Timestamp Formats:
  - `hh:mm:ss,ms` (Standard format)
  - `ms` (Milliseconds)
  - `Normalized` (0-1 values based on the current Audio Duration)

---

## ⌨️ Keyboard Shortcuts

### Subtitle Marker Movement
- **Q / E** : Move selected marker left/right (500ms)
  - Hold **Shift** for precise movement (50ms)

### Audio Timeline Navigation
- **A / D** : Move playback position left/right (750ms)
  - Hold **Shift** for precise movement (50ms)

### Duration Adjustment
- **Scroll Wheel** : Adjust subtitle end time (500ms increments)
  - Hold **Shift** for fine control (50ms increments)

### Marker Management
- **Ctrl + A** : Add new subtitle marker at current position
- **Ctrl + X** or **Delete** : Remove selected marker

### Playback Control
- **Spacebar** : Play/Pause audio

---

## 🚀 Getting Started

1. **Load Audio** : Click "Load Audio" and select your audio file
2. **Add Markers** : Use `Ctrl + A` or click "Add Marker" to create subtitle points
3. **Edit Subtitles** : Click markers to edit start/end times and text
4. **Export** : Choose your format and export when finished

---

## 🔮 Future Features

This editor is designed for simplicity and it's currently a prototype, but some features are planned:
- Undo/Redo functionality (Ctrl + Z)
- Waveform visualizer for precise timing

---

## 👤 Author

[**CesarZ**](https://bio.link/cesarz)

---

## 📄 License

This project is open source. View the [source code on GitHub](https://github.com/zcesarrr/subtor).