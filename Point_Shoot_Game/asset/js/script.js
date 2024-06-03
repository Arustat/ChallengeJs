const logo = document.getElementById("logo");
const logoContainer = document.getElementById("logoContainer");

// Fonction pour afficher le bouton de démarrage après l'animation du logo
function showStartButton() {
    startButton.style.opacity = '1';
}

// Animation du logo au chargement de la page
window.addEventListener('load', function () {
    // Ajouter la classe pour le fond gris foncé au chargement de la page
    document.body.classList.add('dark-bg');

    // Affichage du logo avec fondu et effet de zoom
    logoContainer.style.opacity = '1';
    logo.style.width = '500px'; // Zoom du logo
    // Après un court délai, masquer le logo avec fondu
    setTimeout(function () {
        // Transition pour afficher le fond coloré avec un fondu
        document.body.classList.remove('dark-bg');

        logoContainer.style.opacity = '0';
        // Après l'animation de fondu, afficher le bouton de démarrage
        setTimeout(showStartButton, 1000); // Afficher le bouton après 4 secondes
    }, 2000); // Durée de l'animation de zoom (2000ms = 2s)
});

// Reste du code JavaScript...


// Reste du code JavaScript...

  

// Reste du code JavaScript...



// Reste du code JavaScript...


const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

let score = 0;
let gameOver = false;
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
let explosions = [];
let particles = [];

ctx.font = '50px Impact';

class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = 'asset/raven.png';
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
        this.hasTrail = Math.random() > 0.5;
    }

    update(deltatime) {
        if (this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;
        if (this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;
        if (this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if (this.hasTrail) {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
                }
            }
        }
        if (this.x < 0 - this.width) gameOver = true;
    }

    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = 'asset/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'asset/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }
    update(deltatime) {
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if (this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
    }
}

class Particle {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2;
        this.y = y + this.size / 3;
        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update() {
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText
    ('Score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText("GAME OVER, your score is " + score, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = 'white';
    ctx.fillText("GAME OVER, your score is " + score, canvas.width / 2 + 5, canvas.height / 2 + 5);
    restartButton.style.display = 'block';
}

window.addEventListener('click', function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColor[0] === pc[0] && object.randomColor[1] === pc[1] && object.randomColor[2] === pc[2]) {
            //colision detected
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
            console.log(explosions);
        }
    });
});

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function (a, b) {
            return a.width - b.width;
        });
    }
    drawScore();
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    if (!gameOver) {
        requestAnimationFrame(animate);
    } else {
        drawGameOver();
    }
}

function resetGame() {
    score = 0;
    gameOver = false;
    timeToNextRaven = 0;
    lastTime = 0;
    ravens = [];
    particles = [];
    explosions = [];
    ctx.font = '50px Impact';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
}

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    resetGame();
    animate(0);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

startButton.style.display = 'block';
restartButton.style.display = 'none'; // Masquer le bouton Restart au chargement de la page
