/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 1000;
const CANVAS_HEIGHT = canvas.height = 500;
const numberOfEnemies = 10;
const ennemiesArray = [];

let gameFrame = 0;

class Enemy {
    constructor(){
        this.image = new Image();
        this.image.src = 'asset/enemies/enemy1.png';
        //this.speed = Math.random() * 4 - 2;
        this.spriteWidth = 293;
        this.spriteHeight = 155;
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5; 
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    }
    update(){
        this.x+= Math.random() * 5 - 2.5;
        this.y+= Math.random() * 5 - 2.5;
        // Animate sprites
        if(gameFrame % this.flapSpeed === 0){
            this.frame > 4 ? this.frame = 0 : this.frame++; //Si la valeur de la propriété 'frame' de cet objet est supérieure à 4, alors assigne la valeur 0 à la propriété 'frame', sinon, incrémente la valeur de la propriété 'frame' de 1.
        }
        
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

for (let i= 0; i < numberOfEnemies; i++){
    ennemiesArray.push(new Enemy());
}   
function animate(){
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)
    ennemiesArray.forEach(ennemy =>{
        ennemy.update();
        ennemy.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();