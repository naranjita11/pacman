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
    // 4 - empty

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
            } else if (boardLayout[i] === 4) {
                arrayOfEls[i].classList.add('empty');
            } 
        }
    }
    createBoard();
  
    // draw pacman onto the board
    let pacmanCurrentIndex = 146;
    let startingLocation = arrayOfEls[pacmanCurrentIndex];
    startingLocation.innerHTML = '';
    
    const drawPacman = () => {
        let location = arrayOfEls[pacmanCurrentIndex];
        const dotInSquare = location.innerHTML === '.';
        if (dotInSquare) {
            updateScore(10);
            location.innerHTML = '';
        }  
        location.classList.add('pac-man');
    };
    drawPacman();
    
    // get the coordinates of pacman on the grid with X and Y axis
    // function getCoordinates(index) {
    //   return [index % width + 1, Math.floor(index / width) + 1]
    // }
    
    // move pacman
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
                console.log(`This key doesn't do anything!`);
                break;
        }
        if (newIndex) {
            if (boardLayout[newIndex] === 1) {
                return;
            } else if (boardLayout[newIndex] === 3) {
                eatPowerPellet(newIndex);
            }
            let originalIndex = pacmanCurrentIndex;
            pacmanCurrentIndex = newIndex;
            drawPacman(pacmanCurrentIndex);
            let originalLocation = arrayOfEls[originalIndex];
            originalLocation.classList.remove('pac-man');
        };
    }
    document.addEventListener('keyup', movePacman);  
    
    // create ghosts using a Ghost class
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
    
    // the ghosts
    const ghosts = [
        new Ghost('blinky', 70, 200),
        new Ghost('pinky', 96, 300),
        new Ghost('inky', 97, 170),
        new Ghost('clyde', 85, 400)
    ]
    
    const drawGhost = (ghost) => {
        const location = arrayOfEls[ghost.currentIndex];
        location.classList.add('ghost', ghost.className);
    }

    // draw my ghosts onto the grid
    ghosts.forEach((ghost) => drawGhost(ghost));
    
    // move the Ghosts randomly
    ghosts.forEach(ghost => moveGhost(ghost));

    function moveGhost(ghost) {
        const directions = [1, -1, width, -width];
        const getRandomDirection = () => {
            return directions[Math.floor(Math.random() * directions.length)]
        };
        
        const attemptMove = () => {
            let randomDirection = getRandomDirection();
            const newIndex = ghost.currentIndex + randomDirection;

            if (newIndex) {
                if (boardLayout[newIndex] === 1 || arrayOfEls[newIndex].classList.contains('ghost')) {
                    return;
                } else {
                    let originalIndex = ghost.currentIndex;
                    ghost.currentIndex = newIndex;
                    drawGhost(ghost);
                    let originalLocation = arrayOfEls[originalIndex];
                    originalLocation.classList.remove('ghost', ghost.className);
                } 
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
        console.log('stopMoving:', ghost);
        clearInterval(ghost.intervalId);
        ghost.intervalId = null;
    }
    
    //what happens when you eat a power-pellet
    function eatPowerPellet (index) {
        // 50 points added to score for eating pellet
        updateScore(50);

        // power pellet disappears
        arrayOfEls[index].classList.replace('power-pellet', 'pac-dot');

        // ghosts turn to blue mode for 10 seconds
        ghosts.forEach(ghost => {ghost.blueMode = true});


        // pacman can eat ghosts and get 200 points for each!
    
    };

    //make the ghosts stop flashing


    //check for a game over

  
    //check for a win - more is when this score is reached

  })
  