
{
    let view = {
        el: '.page-2',
        template: `
            <li class="songs">
                <a href="./song.html?id=song.id" class="HotSong">
                    <p class="Hotnumber">order</p>
                    <div class="songName">
                        <h2>__song.name</h2>
                        <div class="songSinger">
                            <span>
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#icon-wusunyinzhi"></use>
                                </svg>
                            </span>
                            <span>__song.singer -__a__ </span> 
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
                let $li = $(this.template
                    .replace('song.id', song.id)
                    .replace('__song.singer', song.singer)
                    .replace('__a__', song.name)
                    .replace('__song.name', song.name)
                    .replace('order',this.number(n)))
                $(this.el).find('.HotSongList').append($li)
            })
        },

        init() {
            this.$el = $(this.el)
        },
        number(n){
            if(n<10){
                n =`0${n}`
                
            }
            return n
        },
        show() {
            this.$el.addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
        },
        clearload() {
            this.$el.find('.hotmusicloadding').removeClass('active')
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
                this.view.clearload()
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
