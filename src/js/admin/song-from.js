{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <form>
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
            let placeholders = ['name', 'singer', 'url', 'id']
            let html = this.template
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')  //兼容undefined 如果是那么就是空字符串
            })
            $(this.el).html(html)
            if (data.id) {    //false值
                this.$el.prepend('<h1>编辑歌曲</h1>')
            } else {
                this.$el.prepend('<h1>新建歌曲</h1>')
            }
        },
        reset() {
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
            return song.save().then((newSong) => {
                let { id, attributes } = newSong
                // this.data.id = id
                // this.data.name = attributes.name
                // this.data.singer = attributes.singer
                // this.data.url = attributes.url
                Object.assign(this.data, {
                    id: id,          //key和值是一样的可以只写一个
                    ...attributes,  //attri的所有值===下面三行
                    // name:attributes.name,
                    // singer:attributes.singer,
                    // url:attributes.url
                })
            }, (error) => {
                console.error(error);
            });
        },
        updata(data){
            var song = AV.Object.createWithoutData('Song',this.data.id);
            song.set('name', data.name);
            song.set('url', data.url);
            song.set('singer', data.singer);
            return song.save().then((response)=>{
                Object.assign(this.data,data)   
                return response
            })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.init()
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('new', (data) => {
                console.log(this.model.data.id)
                if (this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', singer: ''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
            window.eventHub.on('select', (data) => {
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.create(data).then(() => {
                this.view.reset()   
                window.eventHub.emit('create', JSON.parse(JSON.stringify(this.model.data))) //深拷贝
            })
        },
        updata(){
            let needs = 'name singer url'.split(' ')
            let data = {}
            needs.map((string) => {
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.updata(data).then(()=>{
                window.eventHub.emit('updata',JSON.parse(JSON.stringify(this.model.data)))
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault()
                if(this.model.data.id){
                    this.updata()
                }else{
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}   