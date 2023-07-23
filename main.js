
$("#time-progress").progress({ percent: 0 });

      var songs = [
        {
          artist: "Cartoon",
          image:
            "https://linkstorage.linkfire.com/medialinks/images/563e70c8-6767-4733-99f1-1f06d7e7e3aa/artwork-440x440.jpg",
          title: "On & on",
          song: "onandon.mp3",
        },
        {
          artist: "Owl City",
          image:"https://img.discogs.com/qsJxQMo1InDM5J58voZhGWT4wv0=/fit-in/600x531/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-2687651-1458914707-6165.jpeg.jpg",
          title: "Fireflies",
          song: "fireflies.mp3",
        },
      ];

      var list_of_songs = songs
        .map(function (song, index) {
          return ` <div class="item" data-src="${song.song}"" data-title="${song.title}" data-artist="${song.artist}" data-index=${index} data-image=${song.image}>
       <img class="ui avatar image" src="${song.image}"">
        <div class="content">
            <div id="equalizer">
                <div id="bar1"></div>
                <div id="bar2"></div>
                <div id="bar3"></div>
                <div id="bar4"></div>
                </div>
            <i class="icon button-overlay circle outline"></i>
          <span class="header">${song.title}</span>
          <div class="description">${song.artist}</div>
        </div>
      </div>`;
        })
        .join("");
      var audio = new Audio();
      var play = document.querySelector("#play");

      $(document).on("click", ".item", function () {
        var { src, artist, title, image, index } = this.dataset;

        list_items.forEach((e) => {
          e.classList.remove("active");
          e.querySelector(".button-overlay").style.visibility = "hidden";
          e.querySelector("#equalizer").style.visibility = "hidden";
        });
        this.classList.add("active");
        var newaudio = new Audio(`./music/${src}`);

        this.querySelector(".button-overlay").style.visibility = "visible";
        this.querySelector("#equalizer").style.visibility = "visible";
        if (
          audio.currentTime > 0 &&
          !audio.paused &&
          audio.src == newaudio.src
        ) {
          audio.pause();
          this.querySelector(".button-overlay").classList.add("play");
          this.querySelector(".button-overlay").classList.remove("pause");
        } else if (
          audio.currentTime > 0 &&
          audio.paused &&
          audio.src == newaudio.src
        ) {
          this.querySelector(".button-overlay").classList.add("pause");
          this.querySelector(".button-overlay").classList.remove("play");
          audio.play();
        } else {
          this.querySelector(".button-overlay").classList.add("pause");
          this.querySelector(".button-overlay").classList.remove("play");
          currentSong = index;
          playSong(src, artist, title, image);
        }
      });

      document.getElementById("song-list").innerHTML = list_of_songs;
      var list_items = document.querySelectorAll(".item");
      console.log(list_items);
      var currentSong = 0;
      var audio = new Audio(`./music/${songs[0].song}`);
      var icons = document.querySelectorAll(".icon");

      var minutes = 0;
      var seconds = 0;
      audio.addEventListener("timeupdate", function (e) {
        var currentTime = audio.currentTime;
        var duration = audio.duration;
        minutes = Math.floor(currentTime / 60);
        minutes = minutes >= 10 ? minutes : "0" + minutes;
        seconds = Math.floor(currentTime % 60);
        seconds = seconds >= 10 ? seconds : "0" + seconds;
        document.querySelector("#timer").innerText = `${minutes}:${seconds}`;

        //progress
        var progress = document.getElementById("time-progress");
        var status = Math.floor((currentTime / duration) * 100);
        $("#time-progress").progress({ percent: status });
      });

      var artist_img = document.querySelector(".artist-image");
      var song_title = document.querySelector("#title");
      icons.forEach((icon) => {
        icon.addEventListener("click", (e) => {
          let type = e.target.dataset.type;
          switch (type) {
            case "play":
              if (audio.currentTime > 0) {
                play.classList.remove("play");
                play.classList.add("pause");
                play.dataset.type = "pause";
                audio.play();
              } else {
                currentSong = 0;

                document.querySelector(".item").classList.add("active");
                var { song, artist, title, image } = songs[0];
                playSong(song, title, artist, image);
              }
              break;
            case "pause":
              audio.pause();
              artist_img.classList.remove("rotate-image");
              e.target.classList.remove("pause");
              e.target.classList.add("play");
              e.target.dataset.type = "play";
              break;
            case "prev":
              console.log(currentSong);
              currentSong =
                currentSong - 1 < 0 ? songs.length - 1 : currentSong - 1;
              list_items.forEach((e) => {
                e.classList.remove("active");

                console.log(currentSong);
              });
              list_items[currentSong].classList.add("active");
              var image = songs[currentSong].image;
              var src = songs[currentSong].song;
              var artist = songs[currentSong].artist;
              var title = songs[currentSong].title;
              playSong(src, title, artist, image);

              break;
            case "next":
              currentSong =
                currentSong + 1 >= songs.length ? 0 : currentSong + 1;
              list_items.forEach((e) => {
                e.classList.remove("active");
              });
              list_items[currentSong].classList.add("active");
              var image = songs[currentSong].image;
              var src = songs[currentSong].song;
              var artist = songs[currentSong].artist;
              var title = songs[currentSong].title;
              playSong(src, title, artist, image);
              break;
            default:
              break;
          }
        });
      });

      function playSong(src, artist, title, image) {
        document.querySelector(
          ".artist-img-bg"
        ).style.backgroundImage = `url(${image})`;
        audio.src = `./music/${src}`;
        artist_img.src = `${image}`;

        artist_img.classList.add("rotate-image");
        song_title.innerText = `${artist} - ${title}`;
        document.querySelector("#title").classList.add("song-title");
        play.classList.remove("play");
        play.classList.add("pause");
        play.dataset.type = "pause";
        audio.play();
      }
      $(document).on("click", ".button-overlay", function () {
        if (audio.currentTime > 0) {
          this.classList.remove("play");
          this.classList.add("pause");
          audio.play();
        }
      });
