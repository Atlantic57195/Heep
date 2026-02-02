# Heep

**Heep** is a modern, cross-platform video downloader application built with [Tauri](https://tauri.app/), [React](https://react.dev/), and [Vite](https://vitejs.dev/).

It leverages powerful open-source tools to provide high-quality video downloading and processing capabilities:
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)**: For robust video extraction from thousands of sites.
- **[FFmpeg](https://ffmpeg.org/)**: For media processing and conversion.

## Features

- 🎥 **Video Downloading**: Download videos from YouTube and other supported platforms.
- 💻 **Cross-Platform**: Runs natively on Windows (and other platforms supported by Tauri).
- ⚡ **Fast & Lightweight**: Built on Rust and web technologies for optimal performance.

## Prerequisites

To run or build this application, you need the following external binaries.

1.  **yt-dlp**: Place the executable in `src-tauri/binaries/`.
    -   Rename it to `yt-dlp-<target-triple>` (e.g., `yt-dlp-x86_64-pc-windows-msvc.exe`) for production builds, or strictly follow Tauri's [sidecar naming conventions](https://v2.tauri.app/develop/sidecar/).
    -   *Note: Ensure the filename matches what is configured in `tauri.conf.json`.*

2.  **FFmpeg**: Place the `ffmpeg.exe` binary in `src-tauri/binaries/`.

## Development Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run in Development Mode**
    ```bash
    npm run tauri dev
    ```
    This will start the Vite dev server and the Tauri application window.

## Building for Production

To create a production build/installer:

```bash
npm run tauri build
```

The build artifacts will be located in `src-tauri/target/release/bundle/`.

## Project Structure

- **`src/`**: React frontend code (UI, components, logic).
- **`src-tauri/`**: Rust backend code (Tauri core, system interactions).
- **`src-tauri/binaries/`**: Location for external tools (`yt-dlp`, `ffmpeg`).

## License

[Add your license here]
