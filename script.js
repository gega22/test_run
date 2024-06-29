document.addEventListener('DOMContentLoaded', function() {
    const character = document.getElementById('character');
    const barrier1 = document.getElementById('barrier1');
    const barrier2 = document.getElementById('barrier2');

    let characterBottom = 0;
    let gravity = 4;
    let isJumping = false;

    // Function to move barriers automatically
    function moveBarriers() {
        let barrier1Left = 500; // Initial position of barrier1
        let barrier2Left = 1000; // Initial position of barrier2

        let moveInterval = setInterval(function() {
            barrier1Left -= 2; // Adjust speed as needed
            barrier2Left -= 2; // Adjust speed as needed

            barrier1.style.left = barrier1Left + 'px';
            barrier2.style.left = barrier2Left + 'px';

            // Reset barriers when they move out of view
            if (barrier1Left <= -80) {
                barrier1Left = 800;
                barrier1.style.left = barrier1Left + 'px';
            }

            if (barrier2Left <= -80) {
                barrier2Left = 800;
                barrier2.style.left = barrier2Left + 'px';
            }

            // Check for collision with barriers
            if (checkCollision(character, barrier1) || checkCollision(character, barrier2)) {
                clearInterval(moveInterval); // Stop moving barriers
                alert('წააგე ბრატ!'); // Replace with game over logic
            }
        }, 4);
    }

    // Start moving barriers
    moveBarriers();

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

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            jump();
        }
    });

    function fall() {
        characterBottom -= gravity;
        character.style.bottom = characterBottom + 'px';

        if (characterBottom <= 0) {
            characterBottom = 0;
        }

        requestAnimationFrame(fall);
    }

    fall();
});
