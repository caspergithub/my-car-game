var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;
var mySound;
var myMusic;
var myCreditsmusic;

function startGame() {
    myGamePiece = new component(72, 42, "content/images/player_car.png", 10, 120, "image");
    myScore = new component("22px", "Arial", "black", 320, 20, "text");
    myBackground = new component(28000, 270, "content/images/road2.jpg", 0, 0, "image");
    mySound = new sound ("content/sounds/Crash.mp3");
    myMusic = new sound ("content/sounds/Let_Her_In.mp3");
    myMusic.play();
    myCreditsmusic = new sound ("content/sounds/Apocalypse.mp3");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 550;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        /* brug piltasterne til at flytte myGamePiece */
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        /* brug piltasterne til at flytte myGamePiece */
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    //game over koden
    stop: function () {
        clearInterval(this.interval);
    }
}

//kode til at lave components
function component(width, height, color, x, y, type) {
    this.type = type;
    //kode til at lave bilen png start og bg img
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
      }
      //bilen end 
    /* this.gamearea = myGameArea; */
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        //kode til bg img loop
        if (type == "image" || type == "background") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }
    }
        /* if (type == "background") {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
          } */
          //kode til score start
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        //kode til score end
        //bil image
        if (type == "image") {
            ctx.drawImage(this.image,
              this.x,
              this.y,
              this.width, this.height);
          } 
          //bil image 
    }
    //kode til controls
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        //kode til bg loop
        if (this.type == "background") {
            if (this.x == -(this.width)) {
              this.x = 0;
            }
          }
          //kode til bg loop
          //kode til at blive inden for canvas
          this.hitBottom();
          this.hitTop();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
    this.hitTop = function() {
        var rocktop = 0 - 0;
        if (this.y < rocktop) {
            this.y = rocktop;
        }
    }
    //kode til at blive inden for canvas
    //kode til crash
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    //kode til at lave flere obstacles
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myMusic.stop();
            mySound.play();
            myGamePiece.image.src = "content/images/explosion.gif";
            myCreditsmusic.play();
            setTimeout(() => {
                myGameArea.stop();
                return;
            }, 100);
        }
    }
    myGameArea.clear();
    //kode til bg img
    myBackground.speedX = -10;
    myBackground.newPos();
    myBackground.update();
    //kode til bg img
    //obstacles start
    
    setTimeout(() => {
        
        myGameArea.frameNo += 1;
        
            if (myGameArea.frameNo == 1 || everyinterval(40)) {
                x = myGameArea.canvas.width;
                //spawn randomly on the y axe
                y = Math.floor((Math.random() * 220) + 1);
                /* y = myGameArea.canvas.height - 150; */
                myObstacles.push(new component(72, 42, "content/images/other_car.png", x, y, "image"));
            }
    }, 6500);
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -14;
        myObstacles[i].update();
    }
    //obstacles end
    //kode til score
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    //kode til score
    //player controls start
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -5; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 5; }
    if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -5; }
    if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 5; }
    myGamePiece.newPos();
    myGamePiece.update();
    //player controls end

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
      this.sound.play();
    }
    this.stop = function(){
      this.sound.pause();
    }
  }

//noget til at lave flere obstacles tror jeg
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}





/*
var myGamePiece;
var myObstacles = [];
var myScore;
var myBackground;

function startGame() {
    myGamePiece = new component(45, 30, "content/images/player_car.png", 25, 20, "image");
    myBackground = new component (656, 270, "content/images/road.jpg", 0, 0, "image");
    myScore = new component("28px", "Consolas", "black", 400, 20, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
          })
          window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
          })
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background") {
            ctx.drawImage (this.image, this.x, this.y, this.width, this.height);
            if (type == "background") {
                ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
              }
        } else {
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
              this.x = 0;
            }
          }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGamePiece.image.src = "content/images/explosion.gif";

console.log("collided");
setTimeout(() => {
    myGameArea.stop();
            return;
}, 200);

        }
    }
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update ();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

 */