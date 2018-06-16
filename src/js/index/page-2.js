
{
    let view = {
        el: '.page-2',
        template: `
            <li class="songs">
                <a href="./song.html?id=song.id" class="HotSong">
                    <p class="Hotnumber">0order</p>
                    <div class="songName">
                        <h2>song.name</h2>
                        <div class="songSinger">
                            <span>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-wusunyinzhi"></use>
                                </svg>
                            </span>
                            <span>song.singer - song.name</span>
                        </div>
                    </div>
                    <div class="playBtn">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-bofang"></use>
                        </svg>
                    </div>
                </a>
            </li>
        ` ,
        rander(data) {
            let { songs, order } = data
            let n = 0
            songs.map((song) => {
                n += 1
                let $li = $(this.template.replace('song.id', song.id).replace('song.name', song.name).replace('song.singer', song.singer).replace('order', n))
                $(this.el).find('.HotSongList').append($li)
            })
        },
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
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
                    })
                })
        },
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.model.find().then(() => {
                this.view.rander(this.model.data)
            })
        },
        bindEventHub() {
            window.eventHub.on('selectorTab', (tabName) => {
                if (tabName === 'page-2') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}
