const logo = document.getElementById("logo");
const logoContainer = document.getElementById("logoContainer");

function showStartButton() {
    startButton.style.opacity = '1';
}

window.addEventListener('load', function () {
    document.body.classList.add('dark-bg');
    logoContainer.style.opacity = '1';
    logo.style.width = '500px';
    setTimeout(function () {
        document.body.classList.remove('dark-bg');
        logoContainer.style.opacity = '0';
        setTimeout(showStartButton, 1000);
    }, 2000);
});

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const CANVAS_WIDTH = canvas.width ;
const CANVAS_HEIGHT = canvas.height;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const initialGameSpeed = 1
let gameSpeed = initialGameSpeed;
const speedIncreaseInterval = 10000;
let timeSinceLastSpeedIncrease = 0;

let initialRavenInterval = 1000;
let ravenInterval = initialRavenInterval;
const ravenIntervalDecrease = 100; 


let score = 0;
let gameOver = false;
let timeToNextRaven = 0;
let lastTime = 0;
let currentLayerSet = 0;

const gameObjects = [];
let ravens = [];
let explosions = [];
let particles = [];

ctx.font = '50px Impact';

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    collisionCanvas.width = window.innerWidth;
    collisionCanvas.height = window.innerHeight;
});

const layerSets = [
    'asset/Clouds/Clouds1',
    'asset/Clouds/Clouds2',
    'asset/Clouds/Clouds4',
    'asset/Clouds/Clouds5',
    'asset/Clouds/Clouds6',
    'asset/Clouds/Clouds7',
    'asset/Clouds/Clouds8'
];

function loadLayerSet(path) {
    return [
        new Layer(loadImage(`${path}/1.png`), 0.2),
        new Layer(loadImage(`${path}/2.png`), 0.4),
        new Layer(loadImage(`${path}/3.png`), 0.6),
        new Layer(loadImage(`${path}/4.png`), 0.8),
    ];
}

function loadImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => console.log(`Image ${src} loaded`);
    img.onerror = () => console.log(`Failed to load image ${src}`);
    return img;
}

let timeElapsed = 0;
const timeToChangeBackground = 600;

function changeBackground() {
    timeElapsed++;
    if (timeElapsed >= timeToChangeBackground && currentLayerSet < layerSets.length - 1) {
        currentLayerSet++;
        gameObjects.length = 0;
        gameObjects.push(...loadLayerSet(`${layerSets[currentLayerSet]}`));
        timeElapsed = 0;
    }
}

function animateBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    requestAnimationFrame(animateBackground);
}

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }

    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        this.x -= this.speed;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}


class Raven {
    constructor() {
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.baseDirectionX = Math.random() * 2 + 1; // Base speed in X direction (initially slow)
        this.directionY = Math.random() * 5 - 2.5; // Speed in Y direction
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
        this.x -= this.baseDirectionX * (initialGameSpeed + gameSpeed - 1); // Adjusted speed calculation
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
    ctx.fillText('Score: ' + score, 55, 80);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 100);
    ctx.fillText("Your score is " + score, canvas.width / 2, canvas.height / 2);
    
    const gameOverMusic = new Audio('path/to/gameOverMusic.mp3');
    gameOverMusic.loop = true;
    gameOverMusic.volume = 0.5;
    gameOverMusic.play();

    restartButton.style.display = 'block';
    restartButton.style.position = 'absolute';
    restartButton.style.left = '50%';
    restartButton.style.top = '60%';
    restartButton.style.transform = 'translate(-50%, -50%)';
}

window.addEventListener('click', function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.clientX, e.clientY, 1, 1);
    console.log(detectPixelColor);
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if (object.randomColor[0] === pc[0] && object.randomColor[1] === pc[1] && object.randomColor[2] === pc[2]) {
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

    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    timeSinceLastSpeedIncrease += deltatime;

    if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function (a, b) {
            return a.width - b.width;
        });
    }

    // Augmenter la vitesse de jeu après un certain intervalle de temps
    if (timeSinceLastSpeedIncrease > speedIncreaseInterval) {
        gameSpeed += 0.1; // Augmentez cette valeur pour ajuster la vitesse de progression
        ravenInterval = Math.max(200, ravenInterval - ravenIntervalDecrease); // Réduire l'intervalle d'apparition des ravens
        timeSinceLastSpeedIncrease = 0; // Réinitialiser le compteur de temps
    }

    drawScore();
    [...particles, ...ravens, ...explosions].forEach(object => object.update(deltatime));
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    particles = particles.filter(object => !object.markedForDeletion);
    changeBackground(score);

    if (!gameOver) {
        requestAnimationFrame(animate);
    } else {
        drawGameOver();
    }
}

function resetGame() {
    gameSpeed = initialGameSpeed;
    ravenInterval = initialRavenInterval;
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
    gameObjects.length = 0;
    gameObjects.push(...loadLayerSet(`${layerSets[1]}`));
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
restartButton.style.display = 'none';



