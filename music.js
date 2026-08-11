/**
 * music.js — Floating Music Player
 * Website Ulang Tahun Zafran Kaysan Ammar
 * 
 * Cara pakai: taruh file musik (mp3/ogg) di folder yang sama,
 * lalu ubah MUSIC_SRC di bawah sesuai nama file-nya.
 */

(function () {
  var MUSIC_SRC = 'musik.mp4'; // ← file musik

  /* ─── Inject CSS ─── */
  var style = document.createElement('style');
  style.textContent = [
    '/* ===== MUSIC PLAYER ===== */',
    '.music-player{',
    '  position:fixed;',
    '  bottom:22px;right:22px;',
    '  z-index:8000;',
    '  display:flex;',
    '  flex-direction:column;',
    '  align-items:flex-end;',
    '  gap:8px;',
    '}',

    /* Panel expand */
    '.music-panel{',
    '  background:rgba(255,253,247,0.95);',
    '  backdrop-filter:blur(12px);',
    '  -webkit-backdrop-filter:blur(12px);',
    '  border-radius:20px;',
    '  padding:14px 16px;',
    '  box-shadow:0 8px 32px rgba(62,40,24,0.18), 0 0 0 1.5px rgba(242,169,59,0.25);',
    '  display:flex;',
    '  flex-direction:column;',
    '  gap:10px;',
    '  min-width:220px;',
    '  opacity:0;',
    '  transform:translateY(10px) scale(0.95);',
    '  pointer-events:none;',
    '  transition:opacity 0.25s ease, transform 0.25s ease;',
    '}',
    '.music-panel.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}',

    '.music-panel-title{',
    '  font-family:"Fredoka",sans-serif;',
    '  font-size:0.82rem;',
    '  color:#6B4423;',
    '  opacity:0.7;',
    '  letter-spacing:0.3px;',
    '  display:flex;align-items:center;gap:6px;',
    '}',
    '.music-track-name{',
    '  font-family:"Fredoka",sans-serif;',
    '  font-size:0.95rem;',
    '  color:#3E2818;',
    '  font-weight:600;',
    '  white-space:nowrap;',
    '  overflow:hidden;',
    '  text-overflow:ellipsis;',
    '  max-width:180px;',
    '}',

    /* Progress bar */
    '.music-progress-wrap{',
    '  display:flex;align-items:center;gap:8px;',
    '}',
    '.music-progress{',
    '  flex:1;',
    '  height:4px;',
    '  background:#FFE8B7;',
    '  border-radius:4px;',
    '  overflow:hidden;',
    '  cursor:pointer;',
    '}',
    '.music-progress-fill{',
    '  height:100%;',
    '  width:0%;',
    '  background:linear-gradient(90deg,#F2A93B,#FF7043);',
    '  border-radius:4px;',
    '  transition:width 0.4s linear;',
    '}',
    '.music-time{',
    '  font-size:0.7rem;',
    '  color:#6B4423;',
    '  opacity:0.6;',
    '  font-weight:700;',
    '  white-space:nowrap;',
    '}',

    /* Controls */
    '.music-controls{',
    '  display:flex;align-items:center;justify-content:center;gap:8px;',
    '}',
    '.music-vol-row{',
    '  display:flex;align-items:center;gap:6px;',
    '}',
    '.music-vol-icon{font-size:0.85rem;color:#6B4423;opacity:0.6;}',
    '.music-volume{',
    '  flex:1;',
    '  height:3px;',
    '  -webkit-appearance:none;',
    '  appearance:none;',
    '  background:#FFE8B7;',
    '  border-radius:3px;',
    '  outline:none;',
    '  cursor:pointer;',
    '}',
    '.music-volume::-webkit-slider-thumb{',
    '  -webkit-appearance:none;',
    '  width:13px;height:13px;',
    '  border-radius:50%;',
    '  background:linear-gradient(135deg,#F2A93B,#FF7043);',
    '  box-shadow:0 2px 6px rgba(242,169,59,0.4);',
    '}',

    /* FAB button */
    '.music-fab{',
    '  width:52px;height:52px;',
    '  border-radius:50%;',
    '  background:linear-gradient(135deg,#F2A93B,#FF7043);',
    '  border:none;',
    '  color:#fff;',
    '  font-size:1.3rem;',
    '  cursor:pointer;',
    '  box-shadow:0 6px 20px rgba(242,112,67,0.42);',
    '  display:flex;align-items:center;justify-content:center;',
    '  transition:transform 0.2s,box-shadow 0.2s;',
    '  position:relative;',
    '  overflow:hidden;',
    '  flex-shrink:0;',
    '}',
    '.music-fab::before{',
    '  content:"";',
    '  position:absolute;inset:0;',
    '  background:linear-gradient(135deg,rgba(255,255,255,0.2),transparent);',
    '  border-radius:50%;',
    '}',
    '.music-fab:hover{transform:scale(1.08);box-shadow:0 8px 24px rgba(242,112,67,0.55);}',
    '.music-fab:active{transform:scale(0.95);}',

    /* Pulse ring when playing */
    '.music-fab.playing::after{',
    '  content:"";',
    '  position:absolute;',
    '  inset:-4px;',
    '  border-radius:50%;',
    '  border:2.5px solid rgba(242,169,59,0.55);',
    '  animation:musicPulse 1.6s ease-in-out infinite;',
    '}',
    '@keyframes musicPulse{',
    '  0%,100%{transform:scale(1);opacity:0.7;}',
    '  50%{transform:scale(1.18);opacity:0.1;}',
    '}',

    /* Control buttons */
    '.mc-btn{',
    '  width:34px;height:34px;',
    '  border-radius:50%;',
    '  background:#FFF8EC;',
    '  border:1.5px solid #FFE8B7;',
    '  color:#C97D1E;',
    '  font-size:0.95rem;',
    '  cursor:pointer;',
    '  display:flex;align-items:center;justify-content:center;',
    '  transition:background 0.15s,transform 0.15s;',
    '}',
    '.mc-btn:hover{background:#FFE8B7;transform:scale(1.08);}',
    '.mc-btn.mc-play-pause{',
    '  width:40px;height:40px;',
    '  background:linear-gradient(135deg,#F2A93B,#FF7043);',
    '  color:#fff;border-color:transparent;',
    '  font-size:1.1rem;',
    '  box-shadow:0 4px 12px rgba(242,112,67,0.35);',
    '}',
    '.mc-btn.mc-play-pause:hover{transform:scale(1.1);}',

    '@media(max-width:400px){',
    '  .music-player{bottom:14px;right:14px;}',
    '  .music-panel{min-width:190px;}',
    '}',

    /* Admin password popup */
    '.music-admin-popup{',
    '  background:rgba(255,253,247,0.97);',
    '  backdrop-filter:blur(12px);',
    '  -webkit-backdrop-filter:blur(12px);',
    '  border-radius:16px;',
    '  padding:10px 12px;',
    '  box-shadow:0 8px 28px rgba(62,40,24,0.18), 0 0 0 1.5px rgba(242,169,59,0.25);',
    '  display:flex;',
    '  align-items:center;',
    '  gap:8px;',
    '  min-width:210px;',
    '  opacity:0;',
    '  transform:translateY(8px) scale(0.95);',
    '  pointer-events:none;',
    '  transition:opacity 0.22s ease, transform 0.22s ease;',
    '  position:relative;',
    '}',
    '.music-admin-popup.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all;}',
    '.music-admin-popup-arrow{',
    '  position:absolute;',
    '  bottom:-7px;right:18px;',
    '  width:14px;height:7px;',
    '  background:rgba(255,253,247,0.97);',
    '  clip-path:polygon(0% 0%, 100% 0%, 50% 100%);',
    '}',
    '.music-admin-pw-input{',
    '  flex:1;',
    '  font-family:"Nunito",sans-serif;',
    '  border:1.5px solid #FFE8B7;',
    '  background:#FFF8EC;',
    '  border-radius:10px;',
    '  padding:7px 11px;',
    '  font-size:0.88rem;',
    '  color:#3E2818;',
    '  outline:none;',
    '  min-width:0;',
    '  transition:border-color 0.2s;',
    '}',
    '.music-admin-pw-input:focus{border-color:#F2A93B;}',
    '.music-admin-pw-go{',
    '  flex-shrink:0;',
    '  width:30px;height:30px;',
    '  border-radius:9px;',
    '  background:linear-gradient(135deg,#3E2818,#6B4423);',
    '  color:#fff;',
    '  border:none;cursor:pointer;',
    '  font-size:0.9rem;',
    '  display:flex;align-items:center;justify-content:center;',
    '  transition:transform 0.15s;',
    '}',
    '.music-admin-pw-go:hover{transform:scale(1.1);}',
    '.music-admin-pw-shake{animation:musicAdminShake 0.35s ease;}',
    '@keyframes musicAdminShake{',
    '  0%,100%{transform:translateX(0);}',
    '  25%{transform:translateX(-5px);}',
    '  75%{transform:translateX(5px);}',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  /* ─── Build HTML ─── */
  var wrapper = document.createElement('div');
  wrapper.className = 'music-player';
  wrapper.id = 'music-player';
  wrapper.innerHTML = [
    '<div class="music-panel" id="music-panel">',
    '  <div class="music-panel-title">',
    '    <span>🎵</span> Musik',
    '  </div>',
    '  <div class="music-track-name" id="music-track-name">—</div>',
    '  <div class="music-progress-wrap">',
    '    <div class="music-progress" id="music-progress-bar">',
    '      <div class="music-progress-fill" id="music-progress-fill"></div>',
    '    </div>',
    '    <span class="music-time" id="music-time">0:00</span>',
    '  </div>',
    '  <div class="music-controls">',
    '    <button class="mc-btn" id="mc-prev" title="Ulangi dari awal">⏮</button>',
    '    <button class="mc-btn mc-play-pause" id="mc-play" title="Play / Pause">▶</button>',
    '    <button class="mc-btn" id="mc-loop" title="Loop" style="font-size:0.8rem;">🔁</button>',
    '  </div>',
    '  <div class="music-vol-row">',
    '    <span class="music-vol-icon">🔊</span>',
    '    <input type="range" class="music-volume" id="music-volume" min="0" max="1" step="0.01" value="0.7">',
    '  </div>',
    '</div>',
    '<!-- Admin password popup di bawah FAB musik -->',
    '<div class="music-admin-popup" id="music-admin-popup">',
    '  <div class="music-admin-popup-arrow"></div>',
    '  <input type="password" class="music-admin-pw-input" id="music-admin-pw-input" placeholder="Password admin..." autocomplete="off" maxlength="30">',
    '  <button class="music-admin-pw-go" id="music-admin-pw-go" title="Masuk">→</button>',
    '</div>',
    '<button class="music-fab" id="music-fab" title="Musik / Admin" aria-label="Buka musik">🎵</button>',
  ].join('');
  document.body.appendChild(wrapper);

  /* ─── Audio ─── */
  var audio = new Audio(MUSIC_SRC);
  audio.loop   = true;
  audio.volume = 0.7;
  audio.preload = 'metadata';

  /* ─── State ─── */
  var isPlaying = false;
  var panelOpen = false;

  var fab        = document.getElementById('music-fab');
  var panel      = document.getElementById('music-panel');
  var btnPlay    = document.getElementById('mc-play');
  var btnPrev    = document.getElementById('mc-prev');
  var btnLoop    = document.getElementById('mc-loop');
  var volSlider  = document.getElementById('music-volume');
  var progressBar= document.getElementById('music-progress-bar');
  var progressFill=document.getElementById('music-progress-fill');
  var timeEl     = document.getElementById('music-time');
  var trackName  = document.getElementById('music-track-name');
  /* Set nama lagu dari filename */
  var rawName = MUSIC_SRC.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  trackName.textContent = rawName || 'Lagu Ulang Tahun';

  function pad(n){ return n < 10 ? '0'+n : ''+n; }
  function fmtTime(s){
    var m = Math.floor(s/60);
    return m + ':' + pad(Math.floor(s%60));
  }

  function setPlaying(val){
    isPlaying = val;
    btnPlay.textContent = isPlaying ? '⏸' : '▶';
    if(isPlaying) fab.classList.add('playing');
    else          fab.classList.remove('playing');
    fab.textContent = isPlaying ? '🎵' : '🎵';
  }

  function togglePlay(){
    if(isPlaying){
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(function(){});
      setPlaying(true);
    }
  }

  /* FAB toggle panel */
  fab.addEventListener('click', function(){
    panelOpen = !panelOpen;
    if(panelOpen) panel.classList.add('open');
    else          panel.classList.remove('open');
  });

  /* Play/Pause */
  btnPlay.addEventListener('click', togglePlay);

  /* Restart */
  btnPrev.addEventListener('click', function(){
    audio.currentTime = 0;
    if(!isPlaying){ audio.play().catch(function(){}); setPlaying(true); }
  });

  /* Loop toggle */
  var loopOn = true;
  btnLoop.addEventListener('click', function(){
    loopOn = !loopOn;
    audio.loop = loopOn;
    btnLoop.style.opacity = loopOn ? '1' : '0.35';
    btnLoop.title = loopOn ? 'Loop aktif' : 'Loop mati';
  });

  /* Volume */
  volSlider.addEventListener('input', function(){
    audio.volume = parseFloat(this.value);
  });

  /* Progress update */
  audio.addEventListener('timeupdate', function(){
    if(!audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
  });

  /* Click progress bar to seek */
  progressBar.addEventListener('click', function(e){
    if(!audio.duration) return;
    var rect = progressBar.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });

  /* Loop jika habis dan loop aktif */
  audio.addEventListener('ended', function(){
    if(loopOn){ audio.currentTime=0; audio.play().catch(function(){}); }
    else { setPlaying(false); }
  });

  /* Error handling */
  audio.addEventListener('error', function(){
    trackName.textContent = '⚠️ File musik tidak ditemukan';
    fab.style.background  = 'rgba(62,40,24,0.3)';
    fab.classList.remove('playing');
  });

  /* Auto-play setelah interaksi pertama user */
  var autoStarted = false;
  function tryAutoPlay(){
    if(autoStarted) return;
    autoStarted = true;
    audio.play().then(function(){
      setPlaying(true);
    }).catch(function(){
      /* browser block autoplay, tunggu user klik */
    });
    document.removeEventListener('click', tryAutoPlay);
    document.removeEventListener('touchstart', tryAutoPlay);
    document.removeEventListener('keydown', tryAutoPlay);
  }
  document.addEventListener('click',      tryAutoPlay, {once:true});
  document.addEventListener('touchstart', tryAutoPlay, {once:true});
  document.addEventListener('keydown',    tryAutoPlay, {once:true});

  /* Close panel kalau klik di luar */
  document.addEventListener('click', function(e){
    if(panelOpen && !e.target.closest('#music-player')){
      panel.classList.remove('open');
      panelOpen = false;
    }
  });

})();
