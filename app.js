document.addEventListener('DOMContentLoaded', () => {

    const boardLayout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,1,0,0,0,0,0,1,
        1,3,1,1,1,0,1,0,1,1,1,3,1,
        1,0,1,0,0,0,0,0,0,0,1,0,1,
        1,0,1,0,1,1,0,1,1,0,1,0,1,
        1,0,0,0,1,2,2,2,1,0,0,0,1,
        1,1,1,0,1,2,2,2,1,0,1,1,1,
        1,0,0,0,1,2,2,2,1,0,0,0,1,
        1,0,1,0,1,1,1,1,1,0,1,0,1,
        1,0,1,0,0,0,0,0,0,0,1,0,1,
        1,3,1,1,1,0,1,0,1,1,1,3,1,
        1,0,0,0,0,0,1,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,
    ]

    // 0 - pac-dots
    // 1 - wall
    // 2 - ghost-lair
    // 3 - power-pellet

    const scoreDisplay = document.getElementById('score')
    let score = 0
    scoreDisplay.innerHTML = score;
    const updateScore = points => {
        score = score + points;
        scoreDisplay.innerHTML = score;
    };
    const grid = document.getElementById('grid')
    const width = 13
    const arrayOfEls = [];

    function createBoard() {
        for (i = 0; i < width*width; i++) {
            const gridSquare = document.createElement('div');
            gridSquare.dataset.index = i;
            grid.appendChild(gridSquare);
            arrayOfEls.push(gridSquare);

            if (boardLayout[i] === 0) {
                arrayOfEls[i].classList.add('pac-dot');
                arrayOfEls[i].innerHTML = '.';
            } else if (boardLayout[i] === 1) {
                arrayOfEls[i].classList.add('wall');
            } else if (boardLayout[i] === 2) {
                arrayOfEls[i].classList.add('ghost-lair');
            } else if (boardLayout[i] === 3) {
                arrayOfEls[i].classList.add('power-pellet');
            }
        }
    }
    createBoard();
  
    // draw pacman onto the board in starting location
    let pacmanCurrentIndex = 146;
    let startingLocation = arrayOfEls[pacmanCurrentIndex];
    startingLocation.innerHTML = '';
    drawPacman();
    
    function drawPacman () {
        let location = arrayOfEls[pacmanCurrentIndex];
        const dotInSquare = location.innerHTML === '.';
        if (dotInSquare) {
            updateScore(10);
            location.innerHTML = '';
        }  
        location.classList.add('pac-man');
    };
    
    const movePacman = (e) => {
        let newIndex;
        switch (e.code) {
            case 'ArrowRight': 
                newIndex = pacmanCurrentIndex + 1;
                break;
            case 'ArrowLeft': 
                newIndex = pacmanCurrentIndex - 1;
                break;
            case 'ArrowUp': 
                newIndex = pacmanCurrentIndex - width;
                break;
            case 'ArrowDown': 
                newIndex = pacmanCurrentIndex + width;
                break;
            default:
                return;
                break;
        }
        if (newIndex) {
            if (boardLayout[newIndex] === 1 || boardLayout[newIndex] === 2) {
                return;
            } else if (arrayOfEls[newIndex].classList.contains('power-pellet')) {
                eatPowerPellet(newIndex);
            } else if (arrayOfEls[newIndex].classList.contains('inky' || 'blinky' || 'clyde' || 'pinky')) {
                alert('Pacman eats ghost  - Game Over!');
                ghosts.forEach(ghost => stopMoving(ghost));
                return;
            } else if (arrayOfEls[newIndex].classList.contains('blue-ghost')) {
                eatGhost(newIndex);
            }
            let originalIndex = pacmanCurrentIndex;
            pacmanCurrentIndex = newIndex;
            drawPacman(pacmanCurrentIndex);
            let originalLocation = arrayOfEls[originalIndex];
            originalLocation.classList.remove('pac-man');
        };
    }
    document.addEventListener('keyup', movePacman);  
    
    class Ghost {
        constructor(className, startingIndex, speed) {
            this.className = className;
            this.startingIndex = startingIndex;
            this.currentIndex = startingIndex;
            this.speed = speed;
            this.blueMode = false;
            this.intervalId;
        }
    }
    
    // instantiate the ghosts
    const ghosts = [
        new Ghost('blinky', 70, 200),
        new Ghost('pinky', 96, 300),
        new Ghost('inky', 97, 170),
        new Ghost('clyde', 85, 400)
    ]
    
    const drawGhost = (ghost) => {
        const location = arrayOfEls[ghost.currentIndex];
        if (ghost.blueMode) {
            location.classList.add('blue-ghost');
        } else {
            location.classList.add('ghost', ghost.className);
        }
    }

    // draw my ghosts onto the grid
    ghosts.forEach((ghost) => drawGhost(ghost));
    
    // start the ghosts moving randomly
    ghosts.forEach(ghost => moveGhost(ghost));

    function moveGhost(ghost) {
        
        function attemptMove() {
            const directions = [1, -1, width, -width];
            const limitedDirections = [1, -1, -width];
            const getRandomDirection = (array) => {
                return array[Math.floor(Math.random() * array.length)]
            };

            const ghostInLair = boardLayout[ghost.currentIndex] === 2;
            const randomDirection =
                ghostInLair ? getRandomDirection(limitedDirections) : getRandomDirection(directions);
            const newIndex = ghost.currentIndex + randomDirection;
            
            // once ghost has left ghost lair they can't move back there
            if (ghost.currentIndex === 58 && newIndex === 71) {
                return;
            } else if (boardLayout[newIndex] === 1 || 
                arrayOfEls[newIndex].classList.contains('ghost' || 'blue-ghost')) {
                return;
            } else if (arrayOfEls[newIndex].classList.contains('pac-man')) {
                if (ghost.blueMode) {
                    eatGhost(ghost.currentIndex);
                } else {
                    alert('Ghost eats pacman - Game Over!');
                    ghosts.forEach(ghost => stopMoving(ghost));
                }
            } else {
                let originalIndex = ghost.currentIndex;
                ghost.currentIndex = newIndex;
                drawGhost(ghost);
                let originalLocation = arrayOfEls[originalIndex];
                originalLocation.classList.remove('ghost', ghost.className, 'blue-ghost');
            };
        }

        function startMoving() {
            if (!ghost.intervalId) {
                ghost.intervalId = setInterval(attemptMove, ghost.speed);
            }
        }

        startMoving();
    };

    function stopMoving(ghost) {
        clearInterval(ghost.intervalId);
        ghost.intervalId = null;
    }
    
    function eatPowerPellet (index) {
        updateScore(50);
        arrayOfEls[index].classList.replace('power-pellet', 'pac-dot');

        ghosts.forEach(ghost => {ghost.blueMode = true});
        const stopFlashing = () => {
            ghosts.forEach(ghost => {ghost.blueMode = false});
        }
        setTimeout(stopFlashing, 10000);
    };

    function eatGhost (index) {
        updateScore(200);
        const dyingGhost = ghosts.find(ghost => ghost.currentIndex === index);
        stopMoving(dyingGhost);
        dyingGhost.currentIndex = null;
        arrayOfEls[index].classList.replace('blue-ghost', 'pac-dot');
        checkForWin();
    }

    function checkForWin () {
        const isDead = ghost => ghost.currentIndex === null;
        if (ghosts.every(isDead)) {
            alert(`Game over! You win with a score of ${score} points`);
        } else return;
    }

  })
  