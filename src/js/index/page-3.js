{
    let view = {
        el: '.page-3',
        template: `
        <li class="hotitem">
            <a href="#">世界杯</a>
        </li>
        `,
        rander(data) {
            let { songs } = data
            songs.map((song) => {
                let $li = $(this.template.replace('世界杯', song.name).replace('#', `./song.html?id=${song.id}`))
                $('#hotmusiclist').append($li)
            })
        },
        init() {
            this.$el = $(this.el)
        },
        show() {
            this.$el.addClass('active')
            $('footer').addClass('active')
        },
        hide() {
            this.$el.removeClass('active')
            $('footer').addClass('active').removeClass('active')
        },
        clearInput() {
            $(this.el).find('.search>input').val('').addClass('active')
        },
        searchTab() {
            this.$el.find('.searchinner').addClass('active').siblings('.hotSearch').addClass('active')
        },
        hotmusicTab() {
            this.$el.find('.searchinner').removeClass('active').siblings('.hotSearch').removeClass('active')
        },
        appendSearchSong(data) {
            let id = data.id
            let { name, singer, url } = data.attributes
            let li = `
            <li class="searchSong">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-search"></use>
                </svg>
                <a href="./song.html?id=${id}">${name} - ${singer}</a>
            </li>`
            $(this.el).find('.searchList').removeClass('active').append(li)
        },
        clearSearchSong() {
            $(this.el).find('.searchList').addClass('active').html('"不好意思暂无搜素结果"')
        }
    }
    let model = {
        data: {

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
        search() {
            let Inputval = $('.search>input').val()
            var query1 = new AV.Query('Song')
            query1.contains('name', Inputval)
            
            var query2 = new AV.Query('Song')
            query2.contains('singer', Inputval)

            var query = AV.Query.or(query1, query2)

            return query.find().then((songs) => {
                return songs
            })
        }
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
                if (tabName === 'page-3') {
                    this.view.show()
                } else {
                    this.view.hide()
                }
            })


            this.view.$el.one('click', '.search>input', () => {
                this.view.clearInput()
            })


            let timer = null
            this.view.$el.find('.search>input').on('input', () => {
                let Pval = this.view.$el.find('.searchContent>p')
                let Inputval = this.view.$el.find('.search>input').val()
                if (timer) { window.clearTimeout(timer) }
                timer = setTimeout(() => {
                    this.model.search().then((songs)=>{
                        $(this.view.el).find('.searchList').empty()
                        if (songs.length === 0) {
                            this.view.clearSearchSong()
                        } else {
                            songs.map((song) => {
                                this.view.appendSearchSong(song)
                            })
                        }
                    })
                }, 300)
                if (Inputval === '') {
                    this.view.hotmusicTab()
                    window.clearTimeout(timer)
                } else {
                    Pval.text(`搜索"${Inputval}"`)
                    this.view.searchTab()
                }
            })


        },

    }
    controller.init(view, model)
}
