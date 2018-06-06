{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <form>
        <h1>新建歌曲</h1>
        <div class="row">
            <label>
                歌名
                <input name="name" type="text" value="__name__">
            </label>
        </div>
        <div class="row">
            歌手
            <input name="singer" type="text" value="__singer__">
        </div>
        <div class="row">
            外链
            <input name="url" type="text" value="__url__">
        </div>
        <div class="row">
            <input type="submit" value="保存">
        </div>
    </form>
    `,
        render(data = {}) { //es6语法  如果用户没传数据那么就是空  
            let placeholders = ['name', 'singer','url','id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')  //兼容undefined 如果是那么就是空字符串
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer: '', url: '', id: ''
        },
        create(data) {
            // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            return song.save().then((newSong)=>{
            let {id,attributes} = newSong
            // this.data.id = id
            // this.data.name = attributes.name
            // this.data.singer = attributes.singer
            // this.data.url = attributes.url
            Object.assign(this.data,{
                id:id,          //key和值是一样的可以只写一个
                ...attributes,  //attri的所有值===下面三行
                                // name:attributes.name,
                                // singer:attributes.singer,
                                // url:attributes.url
            })
            },  (error)=>{
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('upload', (data) => {
                console.log(data)
                console.log('获取到了songform data')
                this.view.render(data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string) => {
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                this.model.create(data).then(()=>{
                    this.view.reset()
                    window.eventHub.emit('create',this.model.data)
                })
            })
        }
    }
    controller.init(view, model)
}   