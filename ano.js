const playlistEl = document.getElementById("playlist");
    const audio = document.getElementById("audioPlayer");
    const nowPlaying = document.getElementById("nowPlaying");

    let tracks = [];
    let currentIndex = 0;

    async function loadSongs() {
      try {
        const res = await fetch("https://raw.githubusercontent.com/Anomgames/runing/refs/heads/main/anom.json");
        if (!res.ok) throw new Error("Sunucu hatası: " + res.status);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Veri dizisi bekleniyordu.");
        tracks = data.filter(track => track.url);
        renderPlaylist(tracks);
      } catch (err) {
        playlistEl.innerHTML = `<li>Şarkılar yüklenemedi: ${err.message}</li>`;
        console.error("Liste yükleme hatası:", err);
      }
    }

    function renderPlaylist(songs) {
      playlistEl.innerHTML = "";
      songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.className = "track";
        li.innerHTML = `
          <div class="info">
            <div class="title">${song.title || "Bilinmeyen Şarkı"}</div>
            <div class="artist">${song.artist || "Bilinmeyen Sanatçı"}</div>
          </div>
        `;
        li.onclick = () => playTrack(index);
        playlistEl.appendChild(li);
      });
    }

    function playTrack(index) {
      currentIndex = index;
      const track = tracks[currentIndex];
      audio.src = track.url;
      audio.play();
      nowPlaying.textContent = `Çalan parça: ${track.title || "?"} - ${track.artist || "?"}`;
    }

    function togglePlay() {
      if (audio.src) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      } else if (tracks.length > 0) {
        playTrack(currentIndex);
      }
    }

    function nextTrack() {
      if (tracks.length > 0) {
        currentIndex = (currentIndex + 1) % tracks.length;
        playTrack(currentIndex);
      }
    }

    function prevTrack() {
      if (tracks.length > 0) {
        currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        playTrack(currentIndex);
      }
    }

    loadSongs();
