// Define variables
let playerX = 400; // Initial X position of the player
let playerY = 300; // Initial Y position of the player
let tacos = []; // Array to store taco objects
let catStatues = []; // Array to store cat statue objects
let score = 0; // Initial score
let lives = 3; // Initial lives
// Define a speed variable
let playerSpeed = 7; // Adjust the value to control the speed
// Define constant variables for speeds
const tacoSpeed = 4; // Speed of tacos
const catStatueSpeed = 4; // Speed of cat statues
// Define variables for player size
const playerWidth = 200; // Width of the player image
const playerHeight = 200; // Height of the player image

// Define variables for object dimensions
const tacoWidth = 130; // Width of a taco
const tacoHeight = 120; // Height of a taco
const catStatueWidth = 150; // Width of a cat statue
const catStatueHeight = 150; // Height of a cat statue

// Get canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerImage, tacoImage, catStatueImage;

let tacoSound = new Audio('dog-sound.wav');
document.body.appendChild(tacoSound); // Optional: Append to body if needed for broader support

let catStatueSound = new Audio('ghost.wav');
document.body.appendChild(catStatueSound); // Optional: Append to body if needed for broader support


function preloadImages() {
    playerImage = new Image();
    tacoImage = new Image();
    catStatueImage = new Image();

    let imagesLoaded = 0;
    const totalImages = 3;

    playerImage.onload = tacoImage.onload = catStatueImage.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            initGame();
            requestAnimationFrame(gameLoop);
        }
    };

    playerImage.src = 'Doge.png';
    tacoImage.src = 'Doge2.png';
    catStatueImage.src = 'Pepe.png';
}

preloadImages();


function initGame() {
    playerX = 400;
    playerY = 300;
    score = 0;
    lives = 3;
    tacos = [];
    catStatues = [];
    keysPressed = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
    };

    // Generate initial set of tacos and cat statues
    generateTaco(); // Generates a single taco initially
    generateCatStatue(); // Generates a single cat statue initially
}
// Start regular generation of tacos and cat statues
generateTacosLoop();
generateCatStatuesLoop();

// Function to handle player movement
function movePlayer(dx, dy) {
    playerX += dx;
    playerY += dy;
}

// Function to generate a taco
function generateTaco() {
    let x = -20; // Initial x position outside the left edge of the canvas
    let y = Math.random() * (canvas.height - tacoHeight); // Random y position within canvas height
    tacos.push({ x: x, y: y }); // Add taco object to tacos array
}

// Function to generate tacos at a low frequency
function generateTacosLoop() {
    setInterval(generateTaco, 1000); // Generate taco every 3 seconds (adjust frequency as needed)
}


// Function to generate a cat statue
function generateCatStatue() {
    let x = -20; // Initial x position outside the left edge of the canvas
    let y = Math.random() * (canvas.height - catStatueHeight); // Random y position within canvas height
    catStatues.push({ x: x, y: y }); // Add statue object to statue array
}

// Function to generate cat statues at a low frequency
function generateCatStatuesLoop() {
    setInterval(generateCatStatue, 2000); // Generate cat statue every 5 seconds (adjust frequency as needed)
}


// Define variables to track pressed keys
let keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Event listeners for keydown and keyup events
document.addEventListener('keydown', function(event) {
    keysPressed[event.key] = true;
});

document.addEventListener('keyup', function(event) {
    keysPressed[event.key] = false;
});



// Function to handle player movement based on pressed keys
function handlePlayerMovement() {
    if (keysPressed.ArrowUp && keysPressed.ArrowLeft) {
        movePlayer(-playerSpeed, -playerSpeed); // Move player left-up diagonally
    } else if (keysPressed.ArrowUp && keysPressed.ArrowRight) {
        movePlayer(playerSpeed, -playerSpeed); // Move player right-up diagonally
    } else if (keysPressed.ArrowDown && keysPressed.ArrowLeft) {
        movePlayer(-playerSpeed, playerSpeed); // Move player left-down diagonally
    } else if (keysPressed.ArrowDown && keysPressed.ArrowRight) {
        movePlayer(playerSpeed, playerSpeed); // Move player right-down diagonally
    } else if (keysPressed.ArrowUp) {
        movePlayer(0, -playerSpeed); // Move player up
    } else if (keysPressed.ArrowDown) {
        movePlayer(0, playerSpeed); // Move player down
    } else if (keysPressed.ArrowLeft) {
        movePlayer(-playerSpeed, 0); // Move player left
    } else if (keysPressed.ArrowRight) {
        movePlayer(playerSpeed, 0); // Move player right
    }
}



function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(playerImage, playerX, playerY, playerWidth, playerHeight);
    
    tacos.forEach(taco => {
        ctx.drawImage(tacoImage, taco.x, taco.y, tacoWidth, tacoHeight);
    });

    catStatues.forEach(catStatue => {
        ctx.drawImage(catStatueImage, catStatue.x, catStatue.y, catStatueWidth, catStatueHeight);
    });

    ctx.fillStyle = 'black';
    ctx.font = '45px Arial';
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`Lives: ${lives}`, 10, 90);
}

function playTacoSound() {
    if (!tacoSound.paused) {
        tacoSound.currentTime = 0; // Reset the sound to the beginning
    }
    tacoSound.play();
}

function playcatStatueSound() {
    if (!catStatueSound.paused) {
        catStatueSound.currentTime = 0; // Reset the sound to the beginning
    }
    catStatueSound.play();
}

// Function to check collision with player
function checkCollision(objectX, objectY, objectWidth, objectHeight) {
    // Check if any part of the object is inside the player's bounding box
    return (
        playerX < objectX + objectWidth &&
        playerX + playerWidth > objectX &&
        playerY < objectY + objectHeight &&
        playerY + playerHeight > objectY
    );
}



// Render the game initially
render();

// Initialize the game
initGame();

// Game loop
function gameLoop() {
    // Update game logic
    update();

    // Handle player movement based on pressed keys
    handlePlayerMovement();
    
    // Render the game
    render();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

function update() {
    // Update taco positions
    for (let i = tacos.length - 1; i >= 0; i--) {
        const taco = tacos[i];
        taco.x += tacoSpeed; // Move tacos from left to right
        // Check for collision with player
        if (checkCollision(taco.x, taco.y, tacoWidth, tacoHeight)) {
            playTacoSound();
            // Player collected a taco
            score += 1; // Increase score
            ctx.fillText('Score: ' + score, 10, 20); // Display score
            // Remove taco from array
            tacos.splice(i, 1);
        }
        // Remove tacos that go off-screen
        if (taco.x > canvas.width) {
            tacos.splice(i, 1);
        }
    }

    // Update cat statue positions
    for (let i = catStatues.length - 1; i >= 0; i--) {
        const catStatue = catStatues[i];
        catStatue.x += catStatueSpeed; // Move cat statues from left to right
        // Check for collision with player
        if (checkCollision(catStatue.x, catStatue.y, catStatueWidth, catStatueHeight)) {
            playcatStatueSound();
            // Player collided with a cat statue
            lives--; // Decrease lives
            // Remove cat statue from array
            catStatues.splice(i, 1);
        }
        // Remove cat statues that go off-screen
        if (catStatue.x > canvas.width) {
            catStatues.splice(i, 1);
        }
    }


    // Check for game over
    if (lives === 0) {
        // Game over logic (e.g., display game over message, reset game, etc.)
        alert('Game over! Your final score: ' + score);
        // Reset game
        score = 0;
        lives = 3;
        tacos = [];
        catStatues = [];
        render(); // Render the game after resetting
        initGame();
    }

}



