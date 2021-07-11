function scrool_check() {
    let web_height = document.querySelector('body').clientHeight;
    let scroll_bottom = document.querySelector('html').scrollTop + window.innerHeight
    
    let scroll = scroll_bottom / web_height
    if(scroll >= 0.7){
        clearInterval(interval)
        section_in()
    }
}

function section_in(){
    document.querySelectorAll('#numerical h2').forEach(e=>{
        setTimeout(number_up, 10, e, 1)
    })
}

function number_up(e, n){
    if(n-10 >= e.dataset.number){
        e.innerHTML = e.dataset.number+'표'
        return
    }
    
    e.innerHTML = n+'표'
    // 시간
    // y= a(x-5000)^2+10
    // 100 = a(10000-5000)^2+10
    // 90a = 2,500,000
    // console.log((9/8000000)*(n-5000)*(n-5000)+10)
    setTimeout(number_up, Math.round(((9/8000000)*(n-5000)*(n-5000)+10)/30), e, n+Math.round(e.dataset.number*40 / (n<5000?5000:n*3)))
}


let interval = setInterval(scrool_check, 100);