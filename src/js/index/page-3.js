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
                let $li = $(this.template.replace('世界杯', song.name))
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
        clear() {
            $(this.el).find('.search>input').val('')
        },
        searchTab() {
            this.$el.find('.searchinner').addClass('active').siblings('.hotSearch').addClass('active')
        },
        hotmusicTab() {

            this.$el.find('.searchinner').removeClass('active').siblings('.hotSearch').removeClass('active')
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
        search(data) {
            var query = new AV.Query('Song');
            return query.startsWith('name', data);

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
                this.view.clear()
            })
            this.view.$el.find('.search>input').on('input', () => {
                let Pval = this.view.$el.find('.searchinner>p')
                let Inputval = this.view.$el.find('.search>input').val()
                let query = new AV.Query('Song');
                query.contains('name', Inputval);
                query.find().then((res)=>{
                    console.log(res)
                })




                if (Inputval === '') {
                    this.view.hotmusicTab()
                } else {
                    Pval.text(`搜索"${Inputval}"`)
                    this.view.searchTab()
                }
            })
        },

    }
    controller.init(view, model)
}