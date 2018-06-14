{
    let view = {
        el: '#app',
        rander(data) {
            let { song, status, } = data
            $('.cover').css('background-image', `url(${song.cover})`)
            $('.album').attr('src', song.cover)
            $(this.el).find('.songName').text(song.name)
            $(this.el).find('.songSinger').text(song.singer)
            if ($('audio').attr('src')  !== song.url) {
                let audio = $(this.el).find('audio').attr('src', song.url).get(0)
                audio.onended = () => {
                    window.eventHub.emit('end')
                }
                $(audio).on('timeupdate', () => {
                    this.showLyric(audio.currentTime)
                })
                this.inputlyric(song)
            }
                if (data.status === 'pause') {
                    this.play()
                } else {
                    this.pause()
                }
        },
        // audio(){
            
        // }
        inputlyric(song) {
            let lyrics = song.lyric
            if(lyrics){
                let array = lyrics.split('\n').map((p) => {
                    let pTag = document.createElement('p')
                    let regex = /\[([\d:.]+)](.+)/
                    let word = p.match(regex)
                    let time = word[1].split(':')
                    let minutes = time[0]
                    let second = time[1]
                    let totalTime = parseInt(minutes, 10) * 60 + parseFloat(second, 10)
                    if (word) {
                        $(pTag).text(word[2]).attr('data-time', totalTime)
                    } else {
                        $(pTag).text(p)
                    }
                    $(this.el).find('.lyric').append(pTag)
                })
            }else{
                let pTag = document.createElement('p')
                $(pTag).text('暂无歌词')
                $(this.el).find('.lyric').append(pTag)
            }
        },
        showLyric(time) {
            let allP = $(this.el).find('.lyric>p')
            for (let i = 0; i < allP.length; i++) {
                if (i === allP.length - 1) {
                    p = allP[i]
                } else {
                    let currentTime = $(allP[i]).attr('data-time')
                    let nextTime = $(allP[i + 1]).attr('data-time')
                    if (currentTime < time && time < nextTime) {
                        $(allP[i]).addClass('active').siblings('.active').removeClass('active')
                        let pHeight = allP[i].getBoundingClientRect().top
                        let lineHeight = $(this.el).find('.lyric')[0].getBoundingClientRect().top
                        let height = pHeight - lineHeight
                        $('.lyric').css('transform', `translateY(${-height + 30}px)`)
                    }
                }

            }
        },
        play() {
            $(this.el).find('audio')[0].play()
            $('.disc').removeClass('pause')
            $('.iconplay').removeClass('pause')
        },
        pause() {
            $(this.el).find('audio')[0].pause()
            $('.disc').addClass('pause')
            $('.iconplay').addClass('pause')
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                url: '',
                name: '',
                lyric: '',
                singer: ''
            },
            status: 'pause'
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song) => {
                Object.assign(this.data.song, { id: song.id},song.attributes)
                return song
            })

        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.searchId()
            this.model.get(id).then(() => {
                this.view.rander(this.model.data)
            })
            this.bindEvents()
        },
        searchId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)

            }
            let array = search.split('&').filter((v => !!v))
            let id = ''
            for (let i = 0; i < array.length; i++) {
                let keyValue = array[i].split('=')
                let key = keyValue[0]
                let value = keyValue[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        },
        bindEvents() {
            $(this.view.el).on('click', () => {
                if (this.model.data.status === 'pause') {
                    this.model.data.status = 'playing'
                    this.view.rander(this.model.data)
                } else {
                    this.model.data.status = 'pause'
                    this.view.rander(this.model.data)
                }
            })
            window.eventHub.on('end', () => {
                this.model.data.status = 'playing'
                this.view.pause()
            })
        },

    }
    controller.init(view, model)
}



