# Corner Booth — Music Player

A small, responsive web-based music player called **Corner Booth**. The project is built with plain HTML, CSS, and JavaScript and provides a clean music-library interface with playlists, search, genre filters, playback controls, seeking, and volume control.

## Project Structure

```text
.
├── index.html
├── style.css
├── script.js
└── README.md
```

## Features

- Browse all available tracks
- Search tracks by title or artist
- Filter tracks by genre
- Play / pause tracks
- Previous and ⏭️ next track controls
- Volume control
- Seek through the currently playing track
- Animated rotating disc while audio is playing
- Animated equalizer indicator for the active track
- Create custom playlists
- Add or remove tracks from playlists
- Delete playlists
- Responsive mobile layout with a slide-out sidebar
- Empty states for playlists and search results

## Technologies

- **HTML5** — page structure and the native `<audio>` element
- **CSS3** — layout, responsive design, animations, and custom styling
- **Vanilla JavaScript** — application state, rendering, playlist management, search, filtering, and audio controls
- **Google Fonts** — Fraunces and Inter

## How It Works

### HTML

`index.html` defines the main application structure:

- Sidebar for the library and playlists
- Main content area for tracks
- Search input
- Genre/category chips
- Track list
- Fixed music-player bar
- Native HTML audio element

The page loads `style.css` for styling and `script.js` for functionality.

## Music Library

The tracks are currently defined directly inside `script.js` in the `tracks` array.

Each track has:

```js
{
  id: 1,
  title: "Midnight Static",
  artist: "Nova Ray",
  genre: "Chill",
  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
}
```

The current demo library contains 10 tracks across these genres:

- Chill
- Electronic
- Acoustic
- Rock
- Jazz

The audio sources currently point to SoundHelix example MP3 URLs.

**Important:** Before using this project publicly or commercially, verify that every audio file you add has a license that permits your intended use. Keep a record of the source and license for each track.

## Default Playlists

The application starts with two playlists:

### Late Night

Tracks:

- Midnight Static
- Quiet Rooms
- Blue Hour

### Focus

Tracks:

- Neon Grid
- Pulse Drive

Users can create additional playlists from the sidebar.

## Main JavaScript State

The application keeps its current UI state in a `state` object.

It tracks:

- Current view
- Selected category
- Search query
- Playlists
- Current track
- Playing/paused state
- Open add-to-playlist menu
- Loaded track durations

The interface is re-rendered when the relevant state changes.

## Search and Filtering

The search box filters tracks by:

- Track title
- Artist name

Genre chips filter tracks by genre.

Both filters can work together with playlists, so the displayed list represents the currently selected playlist/category/search combination.

## Audio Controls

The player uses the browser's native HTML audio API.

Supported controls include:

- Play/pause
- Previous track
- Next track
- Seek bar
- Volume slider
- Automatic progression to the next track when the current track ends

The player also displays:

- Current track title
- Artist
- Current playback time
- Track duration
- Animated disc while playing

## Playlist Management

Users can:

1. Create a playlist using the input in the sidebar.
2. Add a track to a playlist using the `+` button.
3. Remove a track from a playlist by selecting it again.
4. Delete a playlist.

Deleting a playlist does **not** delete the underlying track.

## Responsive Design

The layout changes at screens narrower than `860px`.

On smaller screens:

- The sidebar becomes a slide-out menu.
- A mobile top bar appears.
- The track-list header is hidden.
- Genre and time columns are hidden.
- The player bar becomes vertically stacked.
- The main content receives mobile-friendly spacing.

## Visual Design

The interface uses a dark, warm color palette with:

- Deep plum background
- Cream text
- Gold highlights
- Muted secondary text
- Rose accents

Typography uses:

- **Fraunces** for branding and major headings
- **Inter** for interface text

CSS animations provide:

- Rotating record/disc
- Animated equalizer bars
- Mobile sidebar transitions

## Running the Project

This is a client-side HTML/CSS/JavaScript project, so it does not require a build step.

### Option 1 — Open directly

Open `index.html` in a modern browser.

### Option 2 — Run a local server

If you have VS Code, you can use a Live Server extension.

You can also use Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Adding Your Own Music

To add a track, edit the `tracks` array in `script.js`:

```js
const tracks = [
  {
    id: 11,
    title: "My Track",
    artist: "My Artist",
    genre: "Chill",
    src: "path-or-url-to-audio-file.mp3"
  }
];
```

If you host audio files yourself, you can use a relative path such as:

```js
src: "audio/my-track.mp3"
```

A recommended project structure is:

```text
.
├── audio/
│   └── my-track.mp3
├── index.html
├── style.css
├── script.js
└── README.md
```

Only use audio that you have permission or a suitable license to use.

## Browser Considerations

Because the player uses browser audio APIs:

- Audio playback can be affected by browser autoplay policies.
- Starting playback from a user click is the safest approach.
- Remote audio URLs must be accessible from the browser.
- If a remote server blocks cross-origin access or hotlinking, playback may fail.

## Current Limitations

- Track and playlist data are stored in JavaScript memory.
- Playlists are not persisted after a page refresh.
- There is no backend or database.
- There is no user authentication.
- Track metadata is manually defined.
- Audio URLs are hard-coded in `script.js`.
- The project does not currently upload music files.
- There is no persistent favorites/history system.

## Future Improvements

Possible next steps:

- Add `localStorage` so playlists survive page refreshes
- Add album artwork
- Add favorites/liked tracks
- Add shuffle and repeat modes
- Add playback queue
- Add keyboard shortcuts
- Add persistent volume settings
- Add audio upload support
- Move track metadata to JSON or a database
- Add a backend/API for larger music libraries
- Add proper licensed/royalty-free music sources
- Add loading/error states for unavailable audio

## Files Overview

### `index.html`

Contains the application's HTML structure and player controls.

### `style.css`

Contains the complete visual styling, responsive layout, colors, typography, animations, and mobile behavior.

### `script.js`

Contains the music data, application state, rendering logic, playlist functionality, search/filtering, and audio-player controls.

## License

No project license is specified in the current source files.

If you plan to publish this project, add an appropriate software license and separately verify the licenses/usage rights of all music and other third-party assets.

---

## Credits

**Corner Booth**  
*A small player for late tracks.*
