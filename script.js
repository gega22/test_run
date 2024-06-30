document.addEventListener('DOMContentLoaded', function() {
    const character = document.getElementById('character');
    const barrier1 = document.getElementById('barrier1');
    const barrier2 = document.getElementById('barrier2');
    const scoreElement = document.getElementById('score');

    let characterBottom = 0;
    let gravity = 4;
    let isJumping = false;
    let score = 0;

    // Function to update score
    function updateScore() {
        score++;
        scoreElement.textContent = 'Score: ' + score;
    }

    // Function to reset game state
    function restartGame() {
        // Reset character position
        characterBottom = 0;
        character.style.bottom = characterBottom + 'px';

        // Restart moving barriers
        moveBarriers();

        // Reset score
        score = 0;
        updateScore();
    }

    // Function to move barriers automatically
    function moveBarriers() {
        let barrier1Left = 1000; // Initial position of barrier1, start further to the right
        let barrier2Left = 1500; // Initial position of barrier2, start even further to the right
        let barrierGap = 400; // Initial gap between barriers

        let moveInterval = setInterval(function() {
            barrier1Left -= 2; // Adjust speed as needed
            barrier2Left -= 2; // Adjust speed as needed

            barrier1.style.left = barrier1Left + 'px';
            barrier2.style.left = barrier2Left + 'px';

            // Reset barriers when they move out of view and ensure minimum gap between them
            if (barrier1Left <= -80) {
                barrier1Left = Math.max(barrier1Left, barrier2Left + barrierGap + Math.random() * 100); // Reset barrier1 to a position after barrier2
                barrier1.style.left = barrier1Left + 'px';
                updateScore(); // Increment score when barrier1 moves out of view
            }

            if (barrier2Left <= -80) {
                barrier2Left = Math.max(barrier2Left, barrier1Left + barrierGap + Math.random() * 100); // Reset barrier2 to a position after barrier1
                barrier2.style.left = barrier2Left + 'px';
                updateScore(); // Increment score when barrier2 moves out of view
            }

            // Check for collision with barriers
            if (checkCollision(character, barrier1) || checkCollision(character, barrier2)) {
                handleCollision();
            }
        }, 4); // Adjust interval speed as needed

        return moveInterval;
    }

    // Start moving barriers
    let moveInterval = moveBarriers();

    function jump() {
        if (isJumping) return;
        isJumping = true;

        let timerUp = setInterval(function() {
            if (characterBottom >= 250) {
                clearInterval(timerUp);
                let timerDown = setInterval(function() {
                    if (characterBottom <= 0) {
                        clearInterval(timerDown);
                        isJumping = false;
                    } else {
                        characterBottom -= 5;
                        character.style.bottom = characterBottom + 'px';
                    }
                }, 20);
            } else {
                characterBottom += 30;
                character.style.bottom = characterBottom + 'px';

                // Check for collision with barriers
                if (checkCollision(character, barrier1) || checkCollision(character, barrier2)) {
                    clearInterval(timerUp);
                    let timerDown = setInterval(function() {
                        if (characterBottom <= 0) {
                            clearInterval(timerDown);
                            isJumping = false;
                        } else {
                            characterBottom -= 5;
                            character.style.bottom = characterBottom + 'px';
                        }
                    }, 20);
                }
            }
        }, 20);
    }

    // Add event listener for mouse click
    document.addEventListener('click', function() {
        jump();
    });

    function checkCollision(char, barrier) {
        let charTop = char.offsetTop;
        let charBottom = charTop + char.offsetHeight;
        let charLeft = char.offsetLeft;
        let charRight = charLeft + char.offsetWidth;

        let barrierTop = barrier.offsetTop;
        let barrierBottom = barrierTop + barrier.offsetHeight;
        let barrierLeft = barrier.offsetLeft;
        let barrierRight = barrierLeft + barrier.offsetWidth;

        if (charBottom >= barrierTop && charTop <= barrierBottom && charRight >= barrierLeft && charLeft <= barrierRight) {
            return true; // collision detected
        }

        return false;
    }

    function handleCollision() {
        clearInterval(moveInterval); // Stop moving barriers
        alert('Game Over! Your Score: ' + score); // Replace with desired game over logic

        // Optionally, you can restart the game automatically after collision
        // restartGame();
    }

    function fall() {
        characterBottom -= gravity;
        character.style.bottom = characterBottom + 'px';

        if (characterBottom <= 0) {
            characterBottom = 0;
        }

        requestAnimationFrame(fall);
    }

    fall(); // Start the character falling animation
});
