{
    let view = {
        el: 'section.songList',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <li class="song">
            <a href="./song.html?id={{song.id}}" class="playSong">
                <div class="songName">
                    <p>{{song.name}}</p>
                    <span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink: href="#icon-wusunyinzhi"></use>
                        </svg>
                        {{song.singer}}
                    </span>
                </div>
                <svg class="playicon" aria-hidden="true">
                    <use xlink: href="#icon-bofang"></use>
                </svg>
            </a >
        </li >
        `,

        render(songs) {
            songs.map((song) => {
                let $li = $(this.template
                        .replace('{{song.name}}',song.name)
                        .replace('{{song.singer}}',song.singer)
                        .replace('{{song.id}}',song.id))
                this.$el.find('#songs').append($li)
            })

            this.$el.find('.musicload').removeClass('active')
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
                this.view.render(this.model.data.songs)
            })
        }
    }
    controller.init(view, model)
}