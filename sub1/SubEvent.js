let score = 0;
let canvas
let ctx
let bufCanvas
let bufCtx
let bulletCanvas
let bulletCtx
let drawObject = []
let playerBullet = []
let bossBullet = []
let inputKey = []
let isStart = false;
let interval = []

const playerImg = []
const bossImg = []
const bulletImg = []
const img1 = new Image()
const backgroundImage = new Image()

window.onload = () => {

    img1.src = "imgs/img.jpg"
    backgroundImage.src = "./imgs/bg2.png"
    for (let i = 1; i <= 24; i += 1) {
        // 플레이어 사진 준비
        let img = new Image()
        img.src = './imgs/player/images/' + '우동게인_' + (i <= 9 ? '0' + i : i) + '.png'
        playerImg[i - 1] = img
    }

    for (let i = 1; i <= 28; i += 1) {
        // 적 보스 사진 준비
        let img = new Image()
        img.src = './imgs/boss/images/' + '1_' + (i <= 9 ? '0' + i : i) + '.png'
        bossImg[i - 1] = img
    }

    for (let i = 1; i <= 144; i += 1) {
        // 탄환 사진 준비
        let img = new Image()
        img.src = './imgs/bullet/images/' + 'bullet_' + (i <= 9 ? '0' + i : i) + '.png'
        bulletImg[i - 1] = img
    }

    console.log("load")

    canvas = document.querySelector('canvas')
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
        ctx.save();
    } else {
        document.querySelector('#interface').innerHTML = `<p>현재 브라우저에서 게임을 실행할 수 없습니다`
        return
    }

    gameSet()

    window.addEventListener("keydown", (e) => inputKey.push(e.code == 'ArrowUp' || e.code == 'ArrowDown' || e.code == 'ArrowRight' || e.code == 'ArrowLeft' || e.code == 'KeyZ' || e.code == 'ShiftLeft' ? e.code : ''));
    window.addEventListener("keyup", (e) => {
        inputKey = inputKey.filter(x => {
            return x != e.code && x != '';
        })
        if (e.code == 'KeyZ') {
            if (!isStart) {
                isStart = true
                gameStart()
            }
        }
    });
}

function gameSet() {
    // 버퍼 캔버스
    bufCanvas = document.createElement("canvas");
    bufCtx = bufCanvas.getContext("2d");

    bufCanvas.width = canvas.width;
    bufCanvas.height = canvas.height;

    // 탄환 캔버스 (탄환을 회전하고 그 캔버스를 붙여넣을때 사용)
    bulletCanvas = document.createElement("canvas");
    bulletCtx = bufCanvas.getContext("2d");

    bulletCanvas.width = canvas.width;
    bulletCanvas.height = canvas.height;

    drawObject = [
        {
            'name': 'background1',
            'speed': 4,
            'x': -100,
            'y': 0,
            'sizeX': 700,
            'sizeY': 800,
            'image': backgroundImage
        },
        {
            'name': 'background2',
            'speed': 4,
            'x': -100,
            'y': -800,
            'sizeX': 700,
            'sizeY': 800,
            'image': backgroundImage
        },
        {
            'name': 'player',
            'hp': 5,
            'score': 0,
            'speed': 5,
            'x': 220,
            'y': 650,
            'sizeX': 40,
            'sizeY': 60,
            'image': playerImg[0]
        },
        {
            'name': 'boss',
            'hp': 1200,
            'score': 0,
            'speed': 3,
            'x': 225,
            'y': 50,
            'sizeX': 50,
            'sizeY': 80,
            'image': bossImg[0]
        }
    ]
}

function gameStart() {
    isStart = true;
    interval[0] = setInterval(drawFrame, 10)
    interval[1] = setInterval(playerMove, 10)
    interval[2] = setInterval(cleaning, 2000)
    interval[3] = setInterval(bulletControl, 10);
    interval[4] = setInterval(playerBulletShooting, 80)
    interval[5] = setInterval(isContant, 15)
    interval[6] = setInterval(bossControl, 3000)
    interval[7] = setInterval(backgroundControl, 10)

    bulletSet1()
    playerImageChange(0)
    bossImageChange(0, false)
}

function gameOver() {
    interval.forEach(x => {
        clearInterval(x)
    })

    document.querySelector('#explanation').innerHTML = 'Game Over'
}

function gameClear() {
    drawFrame()

    interval.forEach(x => {
        clearInterval(x)
    })

    document.querySelector('#explanation').innerHTML = 'Game Clear'
}

function cleaning() {
    for (let i = 0; i < playerBullet.length; i += 1) {
        if (playerBullet[i].isContant) {
            // 적에게 닿은 탄환 삭제
            playerBullet.splice(i, 1)
        } else if (playerBullet[i].x > canvas.width + 20 || playerBullet[i].y > canvas.height + 20 || playerBullet[i].x < -20 || playerBullet[i].y < -20) {
            //화면 밖으로 나간 오브젝트 삭제
            playerBullet.splice(i, 1)
        }
    }
    for (let i = 0; i < bossBullet.length; i += 1) {
        if (bossBullet[i].x > canvas.width + 20 || bossBullet[i].y > canvas.height + 20 || bossBullet[i].x < -20 || bossBullet[i].y < -20) {
            //화면 밖으로 나간 오브젝트 삭제
            bossBullet.splice(i, 1)
        }
        else if (bossBullet[i].isContant) {
            // 플레이어에게 닿은 탄환 삭제
            bossBullet.splice(i, 1)
        }
    }
    for (let i = 2; i < drawObject.length; i += 1) {
        // 화면 밖으로 나간 오브젝트 삭제
        if (drawObject[i].x > canvas.width + 150 || drawObject[i].y > canvas.height + 150 || drawObject[i].x < -150 || drawObject[i].y < -150) {
            drawObject.splice(i, 1)
        }
    }
}

let isDrawing = false

function drawFrame() {
    // if(isDrawing){
    //     return
    // }
    // isDrawing = true

    // 초기화
    bufCtx.clearRect(0, 0, bufCanvas.width, bufCanvas.height)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawObject.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY);
    })

    playerBullet.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY);
    })

    bossBullet.forEach(x => {
        bufCtx.drawImage(x.image, x.x, x.y, x.sizeX, x.sizeY)
    })

    // 화면에 출력
    ctx.drawImage(bufCanvas, 0, 0);

    // isDrawing = false
}

function backgroundControl() {
    // 배경을 무한 반복함
    drawObject.forEach(x => {
        if (x.name == 'background1') {
            x.y += x.speed
            if (x.y > 800) {
                x.y = -780
            }
        } else if (x.name == 'background2') {
            x.y += x.speed
            if (x.y > 800) {
                x.y = -780
            }
        }
    })
}

function playerImageChange(n) {
    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        setTimeout(playerRightImageChange, 10, 17)
    } else if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        setTimeout(playerLeftImageChange, 10, 9)
    } else {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerImageChange, 70, n > 8 ? 0 : n + 1)
    }
}

function playerLeftImageChange(n) {
    if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerLeftImageChange, 70, n > 14 ? 12 : n + 1)
    } else {
        playerImageChange(1)
    }
}

function playerRightImageChange(n) {
    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        drawObject.forEach(x => {
            if (x.name == 'player') {
                x.image = playerImg[n]
            }
        })
        setTimeout(playerRightImageChange, 70, n > 22 ? 19 : n + 1)
    } else {
        playerImageChange(1)
    }
}

function playerMove() {
    let x = 0;
    let y = 0;
    let point = -1

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'player') {
            point = i
            break
        }
    }

    let speed = drawObject[point].speed
    // 캔버스는 아래로 갈 수록 y값이 증가
    if (inputKey.find(x => x == 'ArrowUp') == 'ArrowUp') {
        y = -1 * speed
    }
    else if (inputKey.find(x => x == 'ArrowDown') == 'ArrowDown') {
        y = speed
    }

    if (inputKey.find(x => x == 'ArrowRight') == 'ArrowRight') {
        x = speed
    }
    else if (inputKey.find(x => x == 'ArrowLeft') == 'ArrowLeft') {
        x = -1 * speed
    }

    if (x != 0 && y != 0) {
        y /= 1.7
        x /= 1.7
    }

    if (inputKey.find(x => x == 'ShiftLeft') == 'ShiftLeft') {
        x /= 2
        y /= 2
    }

    if (0 < drawObject[point].x + x && drawObject[point].x + x < canvas.width - 30) {
        drawObject[point].x += x
    }

    if (0 < drawObject[point].y + y && drawObject[point].y + y < canvas.height - 30) {
        drawObject[point].y += y
    }
}

function playerBulletShooting() {
    if (inputKey.find(x => x == 'KeyZ') != 'KeyZ') {
        return
    }

    let point = -1;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'player') {
            point = i
            break
        }
    }

    playerBullet.push({
        'name': 'playerBullet',
        'speed': 15,
        'x': drawObject[point].x + drawObject[point].sizeX / 2 - 10,
        'y': drawObject[point].y,
        'sizeX': 20,
        'sizeY': 20,
        'image': bulletImg[132],
        'isContant': false
    })
}

function bulletControl() {
    playerBullet.forEach(x => {
        // 플레이어 탄환은 앞으로만 이동
        x.y -= x.speed
    })
    for (let i = 0; i < bossBullet.length; i++) {
        // 나아가던 방향으로 계속 나아감
        bossBullet[i].x -= bossBullet[i].speedX
        bossBullet[i].y -= bossBullet[i].speedY
        if (bossBullet[i].name != 'bossBullet') {
            if (bossBullet[i].name == 'bossBullet2') {
                if (bossBullet[i].patternCheck) {
                    bossBullet[i].sizeX += 1
                    bossBullet[i].sizeY -= 1
                    if (bossBullet[i].sizeY <= 50) {
                        bossBullet[i].patternCheck = false
                    }
                } else {
                    bossBullet[i].sizeX -= 1
                    bossBullet[i].sizeY += 1
                    if (bossBullet[i].sizeX <= 50) {
                        bossBullet[i].patternCheck = true
                    }
                }
            } else if (bossBullet[i].name == 'bossBullet3' && !bossBullet[i].isExplosion) {
                if (parseInt(Math.random() * 2000) == 1) {
                    bossBullet[i].isExplosion = true
                    bullet3Control(i)
                }
            } else if (bossBullet[i].name == 'bossBullet4' && !bossBullet[i].isExplosion) {
                bossBullet[i].isExplosion = true

                bullet4Explosion(i)
            }
        }
    }
}

function bossBulletInit(b) {
    const bCanvas = document.createElement("canvas");
    const bCtx = bCanvas.getContext('2d');

    bCanvas.width = b.sizeX;
    bCanvas.height = b.sizeY;

    bCtx.translate(b.sizeX / 2, b.sizeY / 2);
    bCtx.rotate((b.rotate + 80) * 180 / Math.PI * Math.PI / 180);
    bCtx.translate(-(b.sizeX / 2), -(b.sizeY / 2));
    bCtx.drawImage(b.image, 0, 0);

    b.image = bCanvas;
}

function bulletSet1() {
    // 패턴 1
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 원형으로 발사
    for (let i = Math.random() * 10; i <= 360; i += 10) {
        x = Math.cos(i) * 3.5;
        y = Math.sin(i) * 3.5;

        const bullet = {
            'name': 'bossBullet',
            'speedX': x,
            'speedY': y,
            'x': drawObject[point].x + drawObject[point].sizeX / 2 - 8,
            'y': drawObject[point].y + drawObject[point].sizeY / 2,
            'sizeX': 15,
            'sizeY': 30,
            'rotate': i,
            'image': bulletImg[133],
            'isContant': false
        };
        bossBulletInit(bullet);
        bossBullet.push(bullet);
    }

    if (drawObject[point].hp > 1050) {
        setTimeout(bulletSet1, 600)
    } else {
        setTimeout(bulletSet2, 600)
    }
}

function bulletSet2() {
    // 패턴 2
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 아래로 발사
    bossBullet.push({
        'name': 'bossBullet',
        'speedX': 0,
        'speedY': -2,
        'x': Math.random() * 510,
        'y': -10,
        'sizeX': 8,
        'sizeY': 8,
        'rotate': 1,
        'image': bulletImg[50],
        'isContant': false
    })

    if (drawObject[point].hp > 900) {
        setTimeout(bulletSet2, 70)
    } else if (drawObject[point].hp > 750) {
        setTimeout(bulletSet2, 100)
        setTimeout(bulletSet3, 100)
    } else {
        bossBullet = []
        setTimeout(bulletSet4, 100)
    }
}

function bulletSet3() {
    // 패턴 3 (패턴 2와 같이 나감)
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    // 옆으로
    bossBullet.push({
        'name': 'bossBullet',
        'speedX': -1,
        'speedY': 0,
        'x': 0,
        'y': Math.random() * 810,
        'sizeX': 10,
        'sizeY': 5,
        'rotate': 1,
        'image': bulletImg[54],
        'isContant': false
    })
}

function bulletSet4() {
    // 패턴 4
    let point = 0;

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    bossBullet.push({
        'name': 'bossBullet2',
        'speedX': Math.random() * 1,
        'speedY': Math.random() * 5 * -1 + 1,
        'x': Math.random() * 510,
        'y': -10,
        'sizeX': 150,
        'sizeY': 30,
        'image': bulletImg[35],
        'patternCheck': false,
        'isContant': false
    })

    if (drawObject[point].hp > 550) {
        setTimeout(bulletSet4, 500)
    } else {
        bossBullet = []
        setTimeout(bulletSet5, 600, 50)
    }
}

function bulletSet5(n) {
    // 패턴 5
    let point = -1

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    bossBullet.push({
        'name': 'bossBullet3',
        'speedX': 0,
        'speedY': -2,
        'x': n,
        'y': -20,
        'sizeX': 20,
        'sizeY': 20,
        'rotate': 1,
        'image': bulletImg[50],
        'isExplosion': false,
        'isContant': false
    })

    if (drawObject[point].hp > 350) {
        setTimeout(bulletSet5, Math.random() * 300, n + 130 > 500 ? 50 : n + 130)
    } else {
        setTimeout(bulletSet6, 2000)
    }
}

function bullet3Control(point) {
    for (let i = 0; i < 6; i++) {
        setTimeout(ChangeBullet3Image, i * 200, i % 2 == 0 ? 37 : 50, point)
    }

    setTimeout(bullet3Explosion, 1200, point)
}

function bullet3Explosion(point) {
    for (let i = 0; i <= 360; i += 30) {
        let x = Math.cos(i) * 1.5;
        let y = Math.sin(i) * 1.5;

        bossBullet.push({
            'name': 'bossBullet',
            'speedX': x,
            // 'speedY': i%60==0?y*1.5:y,
            'speedY': y,
            'x': bossBullet[point].x + bossBullet[point].sizeX / 2 - 10,
            'y': bossBullet[point].y + bossBullet[point].sizeY / 2,
            'sizeX': 10,
            'sizeY': 10,
            'rotate': 1,
            'image': bulletImg[50],
            'isContant': false
        })
    }
    bossBullet.splice(point, 1)
}

function ChangeBullet3Image(imgNum, point) {
    bossBullet[point].image = bulletImg[imgNum]
}

function bulletSet6() {
    // 패턴 6
    let point = -1

    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    bossBullet.push({
        'name': 'bossBullet4',
        'speedX': 0,
        'speedY': -2,
        'x': 225,
        'y': -20,
        'sizeX': 50,
        'sizeY': 50,
        'rotate': 1,
        'image': bulletImg[55],
        'isExplosion': false,
        'isContant': false
    })

    if (drawObject[point].hp > 0) {
        setTimeout(bulletSet6, 4000)
    }
}

async function bullet4Explosion() {

    for (let j = 0; j < 10; j++) {
        bossBullet.forEach(x => {
            if (x.name == 'bossBullet4') {
                x.image = j % 2 == 0 ? bulletImg[55] : bulletImg[52]
            }
        })
        await sleep(100);
    }

    let point = 0

    for (let i = 0; i < bossBullet.length; i += 1) {
        if (bossBullet[i].name === 'bossBullet4') {
            point = i
            break
        }
    }

    for (let i = 0; i <= 360; i += 10) {
        let x = Math.cos(i) * 0.8;
        let y = Math.sin(i) * 0.8;

        bossBullet.push({
            'name': 'bossBullet3',
            'speedX': x,
            'speedY': y,
            'x': bossBullet[point].x + bossBullet[point].sizeX / 2 - 20,
            'y': bossBullet[point].y + bossBullet[point].sizeY / 2,
            'sizeX': 20,
            'sizeY': 20,
            'rotate': 1,
            'image': bulletImg[50],
            'isContant': false
        })
    }
    bossBullet.splice(point, 1)
}

function isContant() {
    // 충돌체크
    drawObject.forEach(item => {
        if (item.name == 'boss') {
            playerBullet.forEach(item2 => {
                positionChecking(item, item2)
            })
        }
        if (item.name == 'player') {
            bossBullet.forEach(item2 => {
                positionChecking(item, item2)
            })
        }
    })
}

//충돌 판정 소스
    // 전체 충돌 판정
    // if (!(item2.x + item2.sizeX >= item.x && item2.x <= item.x + item.sizeX && item2.y + item2.sizeY >= item.y && item2.y <= item.y + item.sizeY) || item2.isContant) {
    //     return
    // }
    //
    // 플레이어 충돌 판정
    // if (!(item2.x + item2.sizeX >= item.x + 15 && item2.x <= item.x + item.sizeX - 15 && item2.y + item2.sizeY >= item.y + 25 && item2.y <= item.y + item.sizeY - 25)) {
    //     return
    // }

function positionChecking(item, item2) {
    // 충돌 판정

    // 두 히트박스의 반지름을 더함
    // (item.sizeX + item.sizeY) / 4 + (item2.sizeX + item2.sizeY) / 4
    // 두 오브젝트의 거리를 구함 
    // Math.sqrt(Math.pow(item.x + item.sizeX/2 - (item2.x + item2.sizeX/2), 2) + Math.pow(item.y + item.sizeY/2 - (item2.y + item2.sizeY/2), 2))

    // // 타원의 초점
    // let point = [[abs(sqrt(sizeX + sizeY)), y],
    //             [-1 * abs(sqrt(sizeX + sizeY)), y]]

    

    if (item.name == 'player') {
        if((item.sizeX + item.sizeY) / 40 + (item2.sizeX + item2.sizeY) / 4 < Math.sqrt(Math.pow(item.x + item.sizeX/2 - (item2.x + item2.sizeX/2), 2) + Math.pow(item.y + item.sizeY/2 - (item2.y + item2.sizeY/2), 2))){
            return
        }

        item.hp -= 1
        document.querySelector('#life').innerHTML = 'life : ' + item.hp
        score -= ((score - 10000) >= 0 ? 10000 : score)
        bossBullet = []
    } else {
        if((item.sizeX + item.sizeY) / 4 + (item2.sizeX + item2.sizeY) / 4 < Math.sqrt(Math.pow(item.x + item.sizeX/2 - (item2.x + item2.sizeX/2), 2) + Math.pow(item.y + item.sizeY/2 - (item2.y + item2.sizeY/2), 2))){
            return
        }

        item.hp -= 1.2
        score += 100
        if (!isBossMove) {
            item.image = bossImg[Math.round(Math.random()) + 21]
        }
    }

    // 충돌된 객체를 바로 지우기 위하여 실행
    cleaning()

    item2.isContant = true;
    document.querySelector('#score').innerHTML = 'score : ' + score

    if (item.hp <= 0) {
        for (let i = 0; i < drawObject.length; i += 1) {
            if (drawObject[i].name == item.name) {
                drawObject.splice(i, 1);
            }
            if (item.name == 'player') {
                // player hp가 0 이하면 게임오버
                gameOver()
            }
            if (item.name == 'boss') {
                // boss hp가 0 이하면 게임 클리어
                gameClear()
            }
        }
    }

}

let bossDirection = 0
let isBossMove = false

function bossControl() {
    let point = -1
    for (let i = 0; i < drawObject.length; i += 1) {
        if (drawObject[i].name === 'boss') {
            point = i
            break
        }
    }

    isBossMove = true
    bossMove(point, drawObject[point].speed)
}

function bossMove(point, n) {
    drawObject[point].x += n * (bossDirection == 0 ? 1 : bossDirection == 1 ? 1 : bossDirection == 6 ? 1 : bossDirection == 7 ? 1 : -1)

    if (n > 0) {
        setTimeout(bossMove, 10, point, n - 0.05)
    } else {
        bossDirection = bossDirection > 6 ? 0 : bossDirection + 1
        isBossMove = false
    }
}

function bossImageChange(n, replay) {
    if (!isBossMove) {
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        if (n > 5) {
            replay = true
        } else if (n < 1) {
            replay = false
        }

        setTimeout(bossImageChange, 100, replay ? n - 1 : n + 1, replay)
    } else if (bossDirection == 2 || bossDirection == 3 || bossDirection == 4 || bossDirection == 5) {
        setTimeout(bossLeftImageChange, 10, 14)
    } else {
        setTimeout(bossRightImageChange, 10, 7)
    }
}

function bossLeftImageChange(n) {
    if (isBossMove) {
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        setTimeout(bossLeftImageChange, 70, n > 17 ? 16 : n + 1)
    } else {
        bossImageChange(1)
    }
}

function bossRightImageChange(n) {
    if (isBossMove) {
        drawObject.forEach(x => {
            if (x.name == 'boss') {
                x.image = bossImg[n]
            }
        })
        setTimeout(bossRightImageChange, 70, n > 10 ? 9 : n + 1)
    } else {
        bossImageChange(1)
    }
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}