    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = 'F8-PLAYER'

    const heading = $("header h2");
    const cdThumb = $(".cd-thumb");
    const audio = $("#audio");
    const cd = $(".cd")
    const playBtn = $(".btn-toggle-play");
    const player = $(".player");
    const progress = $("#progress");
    const nextBtn = $(".btn-next");
    const prevBtn = $(".btn-prev");
    const randomBtn = $(".btn-random")
    const repeatBtn = $(".btn-repeat")
    const playlist = $(".playlist");


    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs : [
                {
                name: "Đã Lỡ Yêu Em Nhiều",
                singer: "JustaTee",
                path: "./assest/music/daloyeuemnhieu.mp3",
                image: "https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/14/8f/fe/148ffe2a-30f4-0484-1b5e-b9792ba17ab3/759005080691_cover.jpg/592x592bb.webp"
            },
            {
                name: "The Good Part",
                singer: "AJR",
                path: "/assest/music/y2mate.com - AJR  The Good Part Official Audio.mp3",
                image:
                    "https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/59/aa/15/59aa15b8-cb64-02cc-a8bc-5969612b5d63/886446478777.jpg/632x632bb.webp"
            },
            {
                name: "Until I Found You",
                singer: "Stephen Sanchez",
                path:
                    "/assest/music/y2mate.com - Stephen Sanchez  Until I Found You Official Music Video.mp3",
                image: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/64/d2/c5/64d2c511-67f4-ae09-5153-d39c3da413a3/21UMGIM75467.rgb.jpg/592x592bb.webp"
            },
            {
                name: "Night Changes",
                singer: "One Direction ",
                path: "/assest/music/y2mate.com - One Direction  Night Changes.mp3",
                image:
                    "https://is2-ssl.mzstatic.com/image/thumb/Music125/v4/14/e4/98/14e49846-57a9-dc8d-6fa3-5e03ccf3606c/dj.ljogvxod.jpg/592x592bb.webp"
            },
            {
                name: "Sinh Ra Đã Là Thứ Đối Lập Nhau",
                singer: "Emcee L",
                path: "./assest/music/y2mate.com - Sinh Ra Đã Là Thứ Đối Lập Nhau  Emcee L Da LAB ft Badbies Official MV.mp3",
                image:
                    "https://is5-ssl.mzstatic.com/image/thumb/Music115/v4/84/75/be/8475beaf-6724-7ab3-43e5-880ed84a1e98/190296441967.jpg/592x592bb.webp"
            },
            {
                name: "Somebody That I Used To Know",
                singer: "Gotye ",
                path:
                    "./assest/music/y2mate.com - Gotye  Somebody That I Used To Know feat Kimbra Official Music Video.mp3",
                image:
                    "https://www.billboard.com/wp-content/uploads/media/Gotye-feat.-Kimbra-Somebody-That-I-Used-to-Know-screenshot-2019-billboard-1500.jpg"
            },
            {
                name: "THẰNG ĐIÊN",
                singer: "JUSTATEE x PHƯƠNG LY",
                path: "./assest/music/thangdien.mp3",
                image:
                    "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ef/0c/eb/ef0ceb8e-ee43-42d2-07b8-e6061cf0d47d/3615938759684.jpg/592x592bb.webp"
            }
        ],
        setConfig: function(key,value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        render: function() {
            const htmls = this.songs.map( (song,index) => {
                return ` 
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                `
            })
            playlist.innerHTML = htmls.join("");
        },
        defineProperties: function(){
            Object.defineProperty(this, "currentSong", {
                get: function(){
                    return this.songs[this.currentIndex];
                }
            })

        },
        handleEvents: function() {
            const _this = this
            const cdWidth = cd.offsetWidth;
            // Xu ly 
            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.pause();
            // Xu ly phong to/ thu nho cd
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const newCdWidth = cdWidth - scrollTop

                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth;
            }

            // Xu ly khi click play

            playBtn.onclick = function(){
                if(_this.isPlaying){
                    audio.pause();
                } else {
                    audio.play();
                }
                
            }
            // khi bai hat duoc play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add("playing");
                cdThumbAnimate.play();
            }
            // khi pause
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove("playing");
                cdThumbAnimate.pause();


            }

            // Tien trinh bai hat thay doi
            audio.ontimeupdate = function(){
                if(audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;

                }
            }
            //Xu ly khi tua song
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }

            // Khi next bai hat
            nextBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playrandomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong()
            }

            // Khi next bai hat
            prevBtn.onclick = function(){
                if(_this.isRandom){
                    _this.playrandomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong()
            }
            //Random bai
            randomBtn.onclick = function(e){
                _this.isRandom = !_this.isRandom;
                _this.setConfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle("active", _this.isRandom);


            }

            // Xu ly phat lai bai hat
            repeatBtn.onclick = function(){
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRandom', _this.isRepeat)
                repeatBtn.classList.toggle("active", _this.isRepeat);
            }

            // Xu ly next song khi audio ended
            audio.onended = function(){
                if(_this.isRepeat) {
                    audio.play();
                } else {
                    nextBtn.click();
                }
            }
            playlist.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)')
                if(songNode || e.target.closest('.option')) {
                    if(songNode) {
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        _this.render();
                        audio.play();
                    }

                    if(e.target.closest(".option")){
                    }
                }
            }
        },
        scrollToActiveSong: function(){
            setTimeout( () => {
                $(".song.active").scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                })
            },300)
        },
        loadCurrentSong: function(){
            

            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path


        },
        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },
        nextSong: function(){
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length - 1){
                this.currentIndex = 0;
            }
            this.loadCurrentSong()
        },
        prevSong: function(){
            this.currentIndex--;
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length - 1;
            }
            this.loadCurrentSong()
        },
        playrandomSong: function(){
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while(newIndex === this.currentIndex)

            this.currentIndex = newIndex;
            this.loadCurrentSong();

            
        },
        start: function(){
            this.loadConfig();
            this.defineProperties();
            this.handleEvents();
            // Tai thong tin bai dau tien
            this.loadCurrentSong();
            this.render();


            // hien thi trang thai ban dau 
        }

    }

    app.start();








 