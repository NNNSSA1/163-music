{
    let view = {
        el: 'section.songList',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let {songs} = data
            songs.map((song)=>{
                let $li = $(`
                <li class="song">
                    <a href="${song.url}" class="playSong">
                        <div class="songName">
                            <p>${song.name}</p>
                            <span>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink: href="#icon-wusunyinzhi"></use>
                                </svg>
                               ${song.singer}
                            </span>
                        </div>
                        <svg class="playicon" aria-hidden="true">
                            <use xlink: href="#icon-play"></use>
                        </svg>
                    </a >
                </li >
                `)
                this.$el.find('#songs').append($li)
            })

        }
    }
    let model = {
        data: {
            songs: []
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((songs) => {
                this.data.songs = songs.map((song) => {
                    let id = song.id
                    let { name, url, singer } = song.attributes
                    return { id, name, url, singer }
                    // return {id:song.id,...song.attributes}
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}