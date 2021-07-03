function scrool_check() {
    let current_scroll = document.querySelector('html').scrollTop;
    let web_height = document.querySelector('#height').clientHeight;

    let scroll = current_scroll / web_height

    if (scroll >= 0 && scroll <= 0.09 && !a) {
        allOff()
        a = true;
        setTimeout(content1On(), 1000);
    }
    else if (scroll > 0.09  && scroll <= 0.18 && !b) {
        allOff()
        b = true;
        setTimeout(content2On(), 1000);
    }
    else if (scroll > 0.18  && scroll <= 0.27 && !c) {
        allOff()
        c = true;
        setTimeout(content3On(), 1000);
    }
    else if (scroll > 0.27  && scroll <= 0.36 && !d) {
        allOff()
        d = true;
        setTimeout(content4On(), 1000);
    }
    else if (scroll > 0.36  && scroll <= 0.45 && !e) {
        allOff()
        e = true;
        setTimeout(content5On(), 1000);
    }
}

let a = false;
let b = false;
let c = false;
let d = false;
let e = false;

scrool_check()
let interval = setInterval(scrool_check, 100);


function allOff(){
    content1Off()
    content2Off()
    content3Off()
    content4Off()
    content5Off()
    
    a = false;
    b = false;
    c = false;
    d = false;
    e = false;
}

function content1On() {
    let content = document.querySelector('#content1')
    content.style.opacity = 1;
    setTimeout(() => {
        content.querySelector('.background').style.opacity = 0.5
        content.querySelector('.background').style.objectPosition = '50% 40%'
    }, 200);
    setTimeout(() => {
        content.querySelectorAll('*:not(.background)').forEach(x=>x.style.opacity = 1)
    }, 1200);
}

function content1Off() {
    let content = document.querySelector('#content1')
    content.style.opacity = 0;
    content.querySelector('.background').style.objectPosition = '50% 100%'
    content.querySelectorAll('*').forEach(x=>x.style.opacity = 0)
}

function content2On() {
    let content = document.querySelector('#content2')
    content.style.opacity = 1;
    setTimeout(() => {
        content.querySelector('.background').style.opacity = 0.6
        content.querySelector('.background').style.objectPosition = '50% 10%'
    }, 200);
    setTimeout(() => {
        content.querySelectorAll('*:not(.background)').forEach(x=>x.style.opacity = 1)
    }, 1200);
}

function content2Off() {
    let content = document.querySelector('#content2')
    content.style.opacity = 0;
    content.querySelector('.background').style.objectPosition = '50% 100%'
    content.querySelectorAll('*').forEach(x=>x.style.opacity = 0)
}

function content3On() {
    let content = document.querySelector('#content3')
    content.style.opacity = 1;
    setTimeout(() => {
        content.querySelector('.background').style.opacity = 0.2
        content.querySelector('.background').style.objectPosition = '50% 15%'
    }, 200);
    setTimeout(() => {
        content.querySelectorAll('*:not(.background)').forEach(x=>x.style.opacity = 1)
    }, 1200);
}

function content3Off() {
    let content = document.querySelector('#content3')
    content.style.opacity = 0;
    content.querySelector('.background').style.objectPosition = '50% 60%'
    content.querySelectorAll('*').forEach(x=>x.style.opacity = 0)
}

function content4On() {
    let content = document.querySelector('#content4')
    content.style.opacity = 1;
    setTimeout(() => {
        content.querySelector('.background').style.opacity = 0.2
        content.querySelector('.background').style.objectPosition = '50% 0%'
    }, 700);
    setTimeout(() => {
        content.querySelectorAll('*:not(.background)').forEach(x=>x.style.opacity = 1)
    }, 1700);
}

function content4Off() {
    let content = document.querySelector('#content4')
    content.style.opacity = 0;
    content.querySelector('.background').style.objectPosition = '50% 10%'
    content.querySelectorAll('*').forEach(x=>x.style.opacity = 0)
}

function content5On() {
    let content = document.querySelector('#content5')
    content.style.opacity = 1;
    setTimeout(() => {
        content.querySelector('.background').style.opacity = 0.6
        content.querySelector('.background').style.objectPosition = '50% 50%'
    }, 700);
    setTimeout(() => {
        content.querySelectorAll('*:not(.background)').forEach(x=>x.style.opacity = 1)
    }, 1700);
}

function content5Off() {
    let content = document.querySelector('#content5')
    content.style.opacity = 0;
    content.querySelector('.background').style.objectPosition = '50% 0%'
    content.querySelectorAll('*').forEach(x=>x.style.opacity = 0)
}