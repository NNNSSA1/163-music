{
    let view = {
        el:'#disc',
        template:`
        <audio autoplay src="{{url}}"></audio>
        <div>
            <button id="play">播放</button>
            <button id="pause">暂停</button>
        </div>
        `,
        rander(data){
            let button =  $(this.el).html(this.template.replace('{{url}}',data.url))
            console.log(button)
            $(this.el).append(button)
        },
        play(){
           let audio = $(this.el).find('audio')[0]
           audio.play()
        },
        pause(){
            let audio = $(this.el).find('audio')[0]
            audio.pause()
        }
    }
    let model = {
        data: {
            id: '',
            url: '',
            name: '',
            singer: ''
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data, {id:song.id,...song.attributes})
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
            $(this.view.el).on('click','#play',()=>{
                this.view.play()
            })
            $(this.view.el).on('click','#pause',()=>{
                this.view.pause()
            })

        },
    }
    controller.init(view, model)
}



