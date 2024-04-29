let playerState = "idle";
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change',function(e){
    playerState = e.target.value;
})
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = 575;
const CANVAS_HEIGHT = canvas.height = 523;
const playerImage = new Image();
playerImage.src = "/asset/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;


let gameFrame = 0;
const straggerFrame = 5;
const spriteAnimations = []; 

const animationStates = [
    { 
        name: 'idle', 
        frames: 7 
    },
    { 
        name: 'jump', 
        frames: 7 
    },
    { 
        name: 'fall', 
        frames: 7 
    }, // Ajout de virgule ici
    { 
        name: 'run', 
        frames: 9 
    },   // Ajout de virgule ici
    { 
        name: 'dizzy', 
        frames: 11 
    },// Ajout de virgule ici
    { 
        name: 'sit', 
        frames: 5 
    },   // Ajout de virgule ici
    { 
        name: 'roll', 
        frames: 7 
    },  // Ajout de virgule ici
    { 
        name: 'bite', 
        frames: 7 
    },  // Ajout de virgule ici
    { 
        name: 'ko', 
        frames: 12 
    },   // Ajout de virgule ici
    { 
        name: 'gethit', 
        frames: 4 
    } // Ajout de virgule ici
];

animationStates.forEach((state, index) => {
    let frames = { loc: [] };
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth;
        let positionY = index * spriteHeight; 
        frames.loc.push({ x: positionX, y: positionY }); 
    }
    spriteAnimations[state.name] = frames;
});

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let position = Math.floor(gameFrame / straggerFrame) % spriteAnimations[playerState].loc.length;
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

    gameFrame++;
    requestAnimationFrame(animate);
};
animate();
