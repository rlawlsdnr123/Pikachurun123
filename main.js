var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 8;
canvas.height = window.innerHeight - 21;

var background_sound = new Audio('background_sound.mp3');
var jump_sound = new Audio('jump.mp3')
var end_sound = new Audio('end.mp3');

var img_background = new Image();
img_background.src = 'background.jpg';
var back = {
    x:0,
    y:0,
    width:canvas.width*1,
    height:canvas.height*1,

    draw(){
        ctx.drawImage(img_background, this.x, this.y, this.width, this.height);
    }
}

var img_user=[]
var img_user1 = new Image();
img_user1.src = 'pika1.png'
var img_user2 = new Image();
img_user2.src = 'pika2.png'
var img_user3 = new Image();
img_user3.src = 'pika3.png'
var img_user4 = new Image();
img_user4.src = 'pika4.png'

img_user = [img_user1,img_user2,img_user3,img_user4]

var user = {
    x:10,
    y:400,
    width:200,
    height:200,
    img_index:0,

    draw(a){
        // ctx.fillStyle = 'green';
        // ctx.fillRect(this.x,this.y,this.width,this.height);
        if(a%5==0){
            this.img_index = (this.img_index+1)%4
        }
        if(user.y<400){
            ctx.drawImage(img_user[0], this.x, this.y, this.width, this.height);
        }
        else{
            ctx.drawImage(img_user[this.img_index], this.x, this.y, this.width, this.height);
        }
    }
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

user.draw(0);

// var img_bomb = new Image();
// img_bomb.src = 'bomb.png';

var img_bomb1 = new Image();
img_bomb1.src = 'bomb1.png';
var img_bomb2 = new Image();
img_bomb2.src = 'bomb2.png';
var img_bomb3 = new Image();
img_bomb3.src = 'bomb3.png';

img_bomb = [img_bomb1, img_bomb2, img_bomb3];

class Bomb {
    constructor() {
        this.x = 1500;
        this.y = 470;
        this.width = 80;
        this.height = 80;

        // 랜덤하게 1, 2, 3 중 하나를 선택
        this.type = Math.floor(Math.random() * 3) + 1;
    }

    draw() {
        // 선택된 타입에 따라 이미지를 그림
        ctx.drawImage(img_bomb[this.type - 1], this.x, this.y, this.width, this.height);
    }
}

// ctx는 캔버스의 2D context로 이미 정의되었다고 가정합니다.


var img_point = new Image();
img_point.src = 'point.png';

class Point{
    constructor(){
        this.x=1500;
        this.y=300;
        this.width=100;
        this.height=80;
    }
    draw(c){
        ctx.drawImage(img_point, this.x, this.y, this.width, this.height);
    }
}

// var bomb = new Bomb();
// bomb.draw();

var timer = 0 //프레임 측정
var bombs = [] //장애물 리스트
var jumpingTimer = 0; //60프레임을 세주는 변수
var animation;
var speed = 500;
var points = [];

function frameSecond(){
    background_sound.play();
    if(speed < 1500){
        speed++;
    }

    //1초마다 60번 코드 실행
    animation = requestAnimationFrame(frameSecond);
    timer++;

    //프레임 돌떄마다 프레임에 있는 요소들claer 해주는 함수
    ctx.clearRect(0,0,canvas.width, canvas.height);

    
    back.draw();
    
    if(timer % rand(120, 150) == 0){ //2초마다
        var bomb = new Bomb();
        bombs.push(bomb);
    }


    bombs.forEach((b,i,o)=>{
        if(b.x<0){
            //i가 가리키는 값에서부터 1개 삭제
            o.splice(i,1);
        }

        b.x=b.x-(speed/50);
        collision(user,b);
        b.draw();
    })

    if(timer%400 == 0){
        var point = new Point();
        points.push(point);
    }

    points.forEach((d, i, o)=>{
        if(d.x<0){
            o.splice(i,1);
        }
        d.x=d.x-(speed/50);
        PP(user, d);
        d.draw();
    })

    // //상승
    // if(jumping == true){
    //     jump_sound.play();
    //     user.y=user.y - 10;
    //     jumpingTimer++;
    // }
    
    // //점프 n초 후
    // if(jumpingTimer > 30){
    //     jumping = false
    //     jumpingTimer = 0;
    // }

    // //jumping이 false이고 user.y가 n 미만이면 하강
    // if(jumping == false && user.y<400){
    //     user.y = user.y + 10;
    // }

    if(jumping == true){
        user.y=user.y-10;
        jumpingTimer++;
    }
    if(jumpingTimer>30){
        jumping = false;
        jumpingTimer = 0;
    }
    if(jumping ==false && user.y<400){
        user.y = user.y + 10;
    }
    if(double == true && user.y == 400){
        double = false;
    }

    user.draw(timer);
    gameScore();
}

frameSecond();

var jumping = false;
var double = false;

document.addEventListener('keydown', function(e){
    if(e.code == 'Space'){
        if(jumping == false && double == false){
            jumping = true;
        }
        if(user.y < 400 && double == false){
            double = true;
            jumping = true;
            jumpingTimer = 0;
        }
    }
})

//충돌 확인 코드
function collision(user, bomb){
    var x_diff = bomb.x - (user.x+user.width);
    var y_diff = bomb.y - (user.y+user.height);
    if(x_diff < 0 && y_diff < 0){
        //프레임 돌 때마다 프레임에 있는 요소들 clear 해주는 함수
        ///ctx.clearRect(0,0,canvas.width, canvas.height);
        cancelAnimationFrame(animation);

        ctx.fillStyle = 'red';
        ctx.font = '100px Cooper';

        ctx.fillText('GAME OVER', canvas. width/3.7, canvas.height/3)
        background_sound.pause();
        end_sound.play();
    }
}

// document.addEventListener('keydown', function(e){
//     if(e.code =="Space"){
//         jumping = true;
//     }
// })

var pp = 0;

var plus_sound = new Audio('plus.mp3');

var pflag = false;
function PP(user, point){
    var x_diff = point.x - (user.x+user.width);
    var y_diff = point.y - (user.y+user.height);
    if(x_diff < 0 && y_diff < 0){
        pflag = true;
        plus_sound.play();
        o.splice(i, 1);
    }
}

function gameScore(){
    ctx.fillStyle = 'black';
    ctx.font = '50px Cooper';
    score = timer;
    if (pflag==true){
        pp = pp + 1000;
        setTimeout(function(){
            pflag = false
        }, 2000);
    }
    ctx.fillText('SCORE : '+ Math.round((score+(pp/121))/100), 10, 50);
}

var score = 0;

// function bomb_gameScore(x){
//     ctx.font = '50px Cooper';
//     ctxfillStyle = 'black';

//     if(x==0){
//         score++;
//     }
//     ctx.fillText('SCORE : ' + score, 10, 100)
// }