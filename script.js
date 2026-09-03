(function(){

  const tracks = [
    { id: 1, title: "Midnight Static",   artist: "Nova Ray",              genre: "Chill",       src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Slow Tide",          artist: "Hollow Coast",          genre: "Chill",       src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Neon Grid",          artist: "Vektr",                 genre: "Electronic",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 4, title: "Pulse Drive",        artist: "Kilotone",              genre: "Electronic",  src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 5, title: "Paper Boats",        artist: "Wren & Sable",          genre: "Acoustic",    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 6, title: "Quiet Rooms",        artist: "Marlowe Fields",        genre: "Acoustic",    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: 7, title: "Rust & Signal",      artist: "The Long Static",       genre: "Rock",        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { id: 8, title: "Broken Radio",       artist: "Ashline",               genre: "Rock",        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: 9, title: "Blue Hour",          artist: "Sasha Vane Trio",       genre: "Jazz",        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { id: 10, title: "Smoke Ring",        artist: "Corner Booth Quartet",  genre: "Jazz",        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  ];

  const genres = ["All", ...Array.from(new Set(tracks.map(t => t.genre)))];

  const state = {
    view: "all",           
    category: "All",
    query: "",
    playlists: [
      { id: "p1", name: "Late Night", trackIds: [1, 6, 9] },
      { id: "p2", name: "Focus", trackIds: [3, 4] }
    ],
    currentTrackId: null,
    isPlaying: false,
    openMenuId: null,
    durations: {}   
  };

  const audio = document.getElementById('audio-el');

  function fmtTime(s){
    if (!isFinite(s) || s == null) return "0:00";
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return m + ":" + String(r).padStart(2, "0");
  }

  function getPlaylist(id){ return state.playlists.find(p => p.id === id); }

  function currentTrackList(){
    let list = tracks;
    if (state.view !== "all"){
      const pl = getPlaylist(state.view);
      const ids = pl ? pl.trackIds : [];
      list = ids.map(id => tracks.find(t => t.id === id)).filter(Boolean);
    }
    if (state.category !== "All"){
      list = list.filter(t => t.genre === state.category);
    }
    if (state.query.trim()){
      const q = state.query.trim().toLowerCase();
      list = list.filter(t => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    }
    return list;
  }

  function renderSidebar(){
    document.getElementById('count-all').textContent = tracks.length;

    const nav = document.getElementById('playlist-nav');
    nav.innerHTML = "";
    state.playlists.forEach(pl => {
      const el = document.createElement('div');
      el.className = 'nav-item' + (state.view === pl.id ? ' active' : '');
      el.innerHTML = `
        <span>${escapeHtml(pl.name)}</span>
        <span class="item-right">
          <span class="count">${pl.trackIds.length}</span>
          <button class="pl-delete" data-id="${pl.id}" title="Delete playlist">&times;</button>
        </span>
      `;
      el.addEventListener('click', (e) => {
        if (e.target.closest('.pl-delete')) return;
        state.view = pl.id;
        render();
        closeMobileSidebar();
      });
      el.querySelector('.pl-delete').addEventListener('click', (e) => {
        e.stopPropagation();
        deletePlaylist(pl.id);
      });
      nav.appendChild(el);
    });

    document.querySelectorAll('.nav-item[data-view="all"]').forEach(el => {
      el.classList.toggle('active', state.view === 'all');
    });
  }

  function renderChips(){
    const wrap = document.getElementById('category-chips');
    wrap.innerHTML = "";
    genres.forEach(g => {
      const chip = document.createElement('button');
      chip.className = 'chip' + (state.category === g ? ' active' : '');
      chip.textContent = g;
      chip.addEventListener('click', () => { state.category = g; renderChips(); renderTracks(); });
      wrap.appendChild(chip);
    });
  }

  function renderHeader(){
    const titleEl = document.getElementById('view-title');
    const subEl = document.getElementById('view-sub');
    if (state.view === 'all'){
      titleEl.textContent = 'All Tracks';
      subEl.textContent = 'Everything in the booth, sorted your way.';
    } else {
      const pl = getPlaylist(state.view);
      titleEl.textContent = pl ? pl.name : 'Playlist';
      subEl.textContent = pl ? pl.trackIds.length + ' track(s) in this playlist.' : '';
    }
  }

  function escapeHtml(s){
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function renderTracks(){
    const list = currentTrackList();
    const rowsEl = document.getElementById('track-rows');
    const emptyEl = document.getElementById('empty-state');
    rowsEl.innerHTML = "";

    if (list.length === 0){
      emptyEl.style.display = 'block';
      emptyEl.querySelector('div:last-child').textContent =
        state.query.trim() ? "No matches for your search." : "Nothing here yet — add some tracks.";
      return;
    }
    emptyEl.style.display = 'none';

    list.forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'track-row' + (state.currentTrackId === t.id ? ' playing' : '');
      row.innerHTML = `
        <span class="t-index">
          <span class="t-index-num">${i + 1}</span>
          <span class="eq"><span></span><span></span><span></span></span>
        </span>
        <div class="t-meta">
          <div class="t-title">${escapeHtml(t.title)}</div>
          <div class="t-artist">${escapeHtml(t.artist)}</div>
        </div>
        <span class="t-genre">${escapeHtml(t.genre)}</span>
        <span class="t-time">${state.durations[t.id] ? fmtTime(state.durations[t.id]) : '--:--'}</span>
        <div style="position:relative;">
          <button class="t-add" title="Add to playlist" data-id="${t.id}">+</button>
        </div>
      `;
      row.addEventListener('click', (e) => {
        if (e.target.closest('.t-add') || e.target.closest('.add-menu')) return;
        playTrack(t.id, list);
      });
      const addBtn = row.querySelector('.t-add');
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.openMenuId = (state.openMenuId === t.id) ? null : t.id;
        renderTracks();
      });
      if (state.openMenuId === t.id){
        const menu = document.createElement('div');
        menu.className = 'add-menu';
        let html = `<div>Add to playlist</div>`;
        if (state.playlists.length === 0){
          html += `<button disabled style="color:var(--muted);cursor:default;">No playlists yet</button>`;
        } else {
          state.playlists.forEach(pl => {
            const already = pl.trackIds.includes(t.id);
            html += `<button data-pl="${pl.id}" data-track="${t.id}">${already ? '✓ ' : ''}${escapeHtml(pl.name)}</button>`;
          });
        }
        menu.innerHTML = html;
        menu.addEventListener('click', (e) => {
          e.stopPropagation();
          const btn = e.target.closest('button[data-pl]');
          if (!btn) return;
          togglePlaylistTrack(btn.dataset.pl, parseInt(btn.dataset.track, 10));
        });
        row.querySelector('div[style]').appendChild(menu);
      }
      rowsEl.appendChild(row);
    });
  }

  function togglePlaylistTrack(plId, trackId){
    const pl = getPlaylist(plId);
    if (!pl) return;
    const idx = pl.trackIds.indexOf(trackId);
    if (idx === -1) pl.trackIds.push(trackId);
    else pl.trackIds.splice(idx, 1);
    state.openMenuId = null;
    renderSidebar();
    renderTracks();
  }

  function render(){
    renderSidebar();
    renderHeader();
    renderTracks();
  }

  // close add-menu when clicking elsewhere
  document.addEventListener('click', () => {
    if (state.openMenuId !== null){ state.openMenuId = null; renderTracks(); }
  });

  function playTrack(id, contextList){
    const t = tracks.find(tr => tr.id === id);
    if (!t) return;
    if (state.currentTrackId !== id){
      state.currentTrackId = id;
      audio.src = t.src;
      audio.play().catch(()=>{});
    } else {
      togglePlayPause();
      return;
    }
    state.isPlaying = true;
    state._context = contextList || currentTrackList();
    updateNowPlaying();
    renderTracks();
  }

  function togglePlayPause(){
    if (!state.currentTrackId){
      const list = currentTrackList();
      if (list.length) playTrack(list[0].id, list);
      return;
    }
    if (audio.paused){ audio.play().catch(()=>{}); state.isPlaying = true; }
    else { audio.pause(); state.isPlaying = false; }
    updatePlayIcon();
  }

  function skip(dir){
    const list = (state._context && state._context.length) ? state._context : currentTrackList();
    if (!list.length) return;
    let idx = list.findIndex(t => t.id === state.currentTrackId);
    if (idx === -1) idx = 0;
    idx = (idx + dir + list.length) % list.length;
    playTrack(list[idx].id, list);
  }

  function updateNowPlaying(){
    const t = tracks.find(tr => tr.id === state.currentTrackId);
    document.getElementById('np-title').textContent = t ? t.title : 'Nothing playing';
    document.getElementById('np-artist').textContent = t ? t.artist : 'Pick a track to start';
    document.getElementById('disc').classList.toggle('spin', state.isPlaying);
    updatePlayIcon();
  }

  function updatePlayIcon(){
    document.getElementById('play-icon').style.display = state.isPlaying ? 'none' : 'block';
    document.getElementById('pause-icon').style.display = state.isPlaying ? 'block' : 'none';
    document.getElementById('disc').classList.toggle('spin', state.isPlaying);
  }

  audio.addEventListener('timeupdate', () => {
    const seek = document.getElementById('seek-bar');
    if (audio.duration){
      const pct = (audio.currentTime / audio.duration) * 100;
      seek.value = pct;
      seek.style.setProperty('--fill', pct + '%');
    }
    document.getElementById('cur-time').textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    document.getElementById('dur-time').textContent = fmtTime(audio.duration);
    if (state.currentTrackId){
      state.durations[state.currentTrackId] = audio.duration;
      renderTracks();
    }
  });

  audio.addEventListener('ended', () => { skip(1); });

  document.getElementById('seek-bar').addEventListener('input', (e) => {
    if (audio.duration){
      audio.currentTime = (e.target.value / 100) * audio.duration;
    }
  });

  document.getElementById('volume-bar').addEventListener('input', (e) => {
    audio.volume = e.target.value / 100;
  });
  audio.volume = 0.7;

  document.getElementById('play-btn').addEventListener('click', togglePlayPause);
  document.getElementById('prev-btn').addEventListener('click', () => skip(-1));
  document.getElementById('next-btn').addEventListener('click', () => skip(1));

  document.querySelector('.nav-item[data-view="all"]').addEventListener('click', () => {
    state.view = 'all'; render(); closeMobileSidebar();
  });

  document.getElementById('search-input').addEventListener('input', (e) => {
    state.query = e.target.value; renderTracks();
  });

  document.getElementById('new-playlist-btn').addEventListener('click', createPlaylist);
  document.getElementById('new-playlist-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') createPlaylist();
  });
  function createPlaylist(){
    const input = document.getElementById('new-playlist-input');
    const name = input.value.trim();
    if (!name) return;
    const id = 'p' + Date.now();
    state.playlists.push({ id, name, trackIds: [] });
    input.value = '';
    render();
  }

  function deletePlaylist(id){
    const pl = getPlaylist(id);
    if (!pl) return;
    if (!confirm(`Delete playlist "${pl.name}"? This won't delete the tracks themselves.`)) return;
    state.playlists = state.playlists.filter(p => p.id !== id);
    if (state.view === id) state.view = 'all';
    render();
  }

  const sidebarEl = document.getElementById('sidebar');
  const overlayEl = document.getElementById('sidebar-overlay');
  function openMobileSidebar(){
    sidebarEl.classList.add('open');
    overlayEl.classList.add('show');
  }
  function closeMobileSidebar(){
    sidebarEl.classList.remove('open');
    overlayEl.classList.remove('show');
  }
  document.getElementById('menu-btn').addEventListener('click', () => {
    sidebarEl.classList.contains('open') ? closeMobileSidebar() : openMobileSidebar();
  });
  overlayEl.addEventListener('click', closeMobileSidebar);

  render();
  renderChips();

})();
