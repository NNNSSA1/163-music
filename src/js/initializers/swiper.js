{
    let mySwiper = new Swiper ('.swiper-container', {
        direction: 'horizontal',
        autoplay: true,
        loop: true,
        width: window.innerWidth,

        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          clickable:true,
        },
        
      })  
}