{
    let view = {
        el:'#app',
        rander(data){
            let {song,status} = data
            $('.cover').css('background-image',`url(${song.cover})`)
            $('.album').attr('src',song.cover)
            if($('audio').attr('src') !== song.url){
                $(this.el).find('audio').attr('src',song.url)
                $('audio').on('ended',()=>{
                    window.eventHub.emit('end')
                })
            }
            if(data.status === 'pause'){
                this.play()
            }else{
                this.pause()
            }
        },
        play(){
            $(this.el).find('audio')[0].play()
            $('.disc').removeClass('pause')
            $('.iconplay').removeClass('pause')
        },
        pause(){
            $(this.el).find('audio')[0].pause()
            $('.disc').addClass('pause')
            $('.iconplay').addClass('pause')
        }
    }
    let model = {
        data: {
            song:{
                id: '',
                url: '',
                name: '',
                singer: ''
            },
            status:'pause'
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data.song, {id:song.id,...song.attributes})
                return song
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.searchId()
            this.model.get(id).then(()=>{
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
        bindEvents(){
            $(this.view.el).on('click',()=>{
                if(this.model.data.status === 'pause'){
                    this.model.data.status = 'playing'
                    this.view.rander(this.model.data)
                }else{
                    this.model.data.status = 'pause'
                    this.view.rander(this.model.data)
                }
            })
            window.eventHub.on('end',()=>{
                this.model.data.status = 'playing'
                this.view.pause()
            })
        },

    }
    controller.init(view, model)
}



