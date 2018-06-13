{

    let view = {
        el:'.page-1',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        }
    }
    let model = {}
    let controller = {
        init(view,model){
            this.view = view
            this.model = model
            this.view.init()
            this.bindEventHub()
            this.loadModel1()
            this.loadModel2()
        },
        bindEventHub(){
            window.eventHub.on('selectorTab',(tabName)=>{
                if(tabName === 'page-1'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        loadModel1(){
            let script1 = document.createElement('script')
            script1.src = './js/index/page-1-1.js'
            document.body.appendChild(script1)
            script1.onload = function(){
                console.log('模块一加载成功')
            }
        },
        loadModel2(){
            let script2 = document.createElement('script')
            script2.src = './js/index/page-1-2.js'
            document.body.appendChild(script2)
            script2.onload = function(){
                console.log('模块二加载成功')
            }
        
        }
    }
    controller.init(view,model)
}