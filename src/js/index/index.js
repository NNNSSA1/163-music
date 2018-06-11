{
    let view = {
        el:'#tabs',
        init(){
            this.$el = $(this.el)
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
        },
        bindEventHub(){
            this.view.$el.on('click','li',(e)=>{
                let $li = $(e.currentTarget)
                $li.addClass('active').siblings('.active').removeClass('active')
                let tabName = $li.attr('data-tab-name')
                window.eventHub.emit('selectorTab',tabName)
            })
        }
    }
    controller.init(view,model)
}