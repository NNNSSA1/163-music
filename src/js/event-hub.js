window.eventHub = {
    events:{

    },
    emit(eventName,data){ //发射、发送、发布
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{
                    fn.call(undefined,data) //遍历然后传入更新信息
                })
            }
        }
    },
    on(eventName,fn){//监听、订阅 eventName监听的事件，然后有个回调
        if(this.events[eventName] === undefined){
            this.events[eventName]  = []        //初始化新入的会员
        }
         this.events[eventName].push(fn)

    }
}
