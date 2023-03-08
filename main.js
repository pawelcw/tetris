window.onload = (event) => {

    const ctx = document.getElementById('game_canvas').getContext('2d'),
        CANVAS_WIDTH = 400,
        CANVAS_HEIGHT = 800;
    BLOCK_COLOUR = 1, //default 
        BLOCK_ID = 8;
    activeBlock = [{ x: 1, y: 1 }, { x: 0, y: 0 }];
    blockOrigin = [];
    GAME_STATE = 0;
    PAUSE_END = false;
    GAME_SCORE = 0;
    GAME_SPEED =10;
    MOVE_BLOCK = 0;

    let blockLine = 0;
    let gameFields = [];
    let gameScore = document.querySelector('h1');

    let fields = new Image();
    fields.src = 'field.png';
    const block = [];


    for (let i = 0; i < 7; i++) {
        block[i] = new Image();
        block[i].src = 'block' + i + '.png';
    }


    function generateNumber(maxRange) {
        return Math.floor(Math.random() * maxRange);

    }

    function fieldsInit() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                gameFields[i] = [];
            }
        }

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                gameFields[i][j] = 0;
            }
        }
    }

    function blockRotate() {
        let x = getLastX();
        let y = getOriginX();
        let collision;
        let duplicateBlock = [...activeBlock.map(x => ({
            ...x
        }))]
        if (BLOCK_ID != 0) {

            for (let i = 0; i < activeBlock.length; i++) {
                duplicateBlock[i].x = x - (duplicateBlock[i].y - blockLine);
                duplicateBlock[i].y = blockOrigin[i].x + blockLine;

            }

            collision = blockCollision(duplicateBlock);

            if (!collision) {
                activeBlock = [...duplicateBlock.map(x => ({
                    ...x
                }))]
                for (let j = 0; j < blockOrigin.length; j++) {
                    const dx = blockOrigin[j].x;
                    blockOrigin[j].x = y - blockOrigin[j].y;
                    blockOrigin[j].y = dx;
                }
            }
        }


    }
    function getOriginX() {
        let x = 0;
        blockOrigin.forEach((element) => {
            if (element.x > x) {
                x = element.x;
            }
        })
        return x;
    }
    function getLastX() {
        let x = 0;
        activeBlock.forEach((element) => {
            if (element.x > x) {
                x = element.x;
            }
        })
        return x;
    }

    let mobile = document.querySelector('#mobile');   
    mobile.addEventListener('touchstart', (event) => {
        
        if (GAME_STATE != 1) 
        {
            GAME_STATE = 1;
            mobile.value = 'TOUCHE TO PAUSE';
        } 
        else  
        {
            GAME_STATE = 0;
            mobile.value = 'TOUCHE TO PLAY';
        }
    });
        



 

    document.addEventListener('keydown', (event) => {

        if (event.key === "p") {
            if (GAME_STATE === 0) {
                PAUSE_END = true;
                GAME_STATE = 1;
            } else {
                GAME_STATE = 0;
            }

        }
        if (event.key == 'ArrowUp') {

            blockRotate();

        }
        if (event.key == 'ArrowDown') {
            const id = checkDirection(3);
            let collision = blockCollision(activeBlock);
 
            if (!collision) {
                if (activeBlock[id].y < 19) {
                    activeBlock.forEach(element => {
                        gameFields[element.x][element.y] = 0;
                        element.y++;

                    })
                    blockLine++;
                } else {
                    activeBlock.forEach(element => {
                        gameFields[element.x][element.y] = 1;
                    })
                    generateBlock();

                }
            } else {
                activeBlock.forEach(element => {
                    gameFields[element.x][element.y] = 1;
                })
                generateBlock();


            }

        }

        if (event.key == 'ArrowLeft') {

            const id = checkDirection(1);
            let x = 0;

            activeBlock.forEach(element => {
                if (element.x > 1) {
                    if (gameFields[element.x - 1][element.y] === 1) {
                        x = 1;

                    }
                }
            })

            if (activeBlock[id].x > 0 && x === 0) {
                activeBlock.forEach(element => {
                    // gameFields[element.x][element.y] = 0;
                    element.x--;
                })
            } else { }

        }

        if (event.key == 'ArrowRight') {
            const id = checkDirection(2);
            let x = 0;
            activeBlock.forEach(element => {
                if (element.x + 1 < 9) {
                    if (gameFields[element.x + 1][element.y] === 1) {
                        x = 1;
                    }
                }
            })
            if (activeBlock[id].x < 9 && x === 0) {
                activeBlock.forEach(element => {
                    // gameFields[element.x][element.y] = 0;
                    element.x++;
                })
            } else { }

        }
        if (event.key === 's'){
            GAME_STATE = 1;
        }
    });



    function drawBoard() {
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'rgb(45, 45, 45)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 10; i++) {
            ctx.moveTo(CANVAS_WIDTH / 10 * i, 0);
            ctx.lineTo(CANVAS_WIDTH / 10 * i, CANVAS_HEIGHT);
        }
        for (let j = 0; j < 20; j++) {
            ctx.moveTo(0, CANVAS_HEIGHT / 20 * j);
            ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 20 * j);
        }
        ctx.stroke();
        ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    function setBoard() {
        activeBlock.forEach((element, index) => {
            gameFields[element.x][element.y] = 1;
        })
    }
    function blockCollision(array) {
        let collision = 0;

        array.forEach(element => {
            if (gameFields[element.x][element.y + 1] === 1) {

                collision = 1;
            }

        })

        if (collision === 1) return true;
    }

    function drawFields() {
        ctx.fillStyle = 'rgb(102, 102, 102)';
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                if (gameFields[i][j] === 1) {

                    //  ctx.fillRect(CANVAS_WIDTH / 10 * i, CANVAS_HEIGHT / 20 * j, CANVAS_WIDTH / 10, CANVAS_HEIGHT / 20);
                    ctx.drawImage(fields, CANVAS_WIDTH / 10 * i, CANVAS_HEIGHT / 20 * j);
                } else {
                    ctx.clearRect(CANVAS_WIDTH / 10 * i, CANVAS_HEIGHT / 20 * j, CANVAS_WIDTH / 10, CANVAS_HEIGHT / 20)
                }
            }

        }
        generateColour();
        activeBlock.forEach(element => {
            // ctx.fillRect(CANVAS_WIDTH / 10 * element.x, CANVAS_HEIGHT / 20 * element.y, CANVAS_WIDTH / 10, CANVAS_HEIGHT / 20)
            ctx.drawImage(block[BLOCK_ID], CANVAS_WIDTH / 10 * element.x, CANVAS_HEIGHT / 20 * element.y);
        })
        // blockOrigin.forEach(element =>{
        //     ctx.fillRect(CANVAS_WIDTH / 10 * element.x, CANVAS_HEIGHT / 20 * element.y, CANVAS_WIDTH / 10, CANVAS_HEIGHT / 20)
        // })
    }
    function drawPause() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.strokeStyle = "green";
        ctx.strokeRect(50, 350, 300, 100);
        ctx.font = "50px Arial ";
        ctx.fillStyle = "green";
        ctx.fillText("Pause", 125, 415);
        ctx.font = "16px Arial";
        ctx.fillText("Press P to continue...", 125, 435);
        ctx.font = "50px Arial";
    };
    function drawEnd(){
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.strokeStyle = "green";
        ctx.strokeRect(50, 350, 300, 100);
        ctx.font = "50px Arial ";
        ctx.fillStyle = "green";
        ctx.fillText("Koniec gry", 75, 415);
        ctx.font = "16px Arial";
        ctx.fillText("Press s to start...", 130, 435);
        ctx.font = "50px Arial";
    };



    function generateBlock() {

        // 0 - klocek kwadrat
        // 1 - klocek linia
        // 2 - klocek T
        // 3 - klocek L
        // 4 - kloecek l odwrocony
        // 5 - klocek z
        // 6 - klocek z odwrocony
        let x = generateNumber(7);
        blockLine = 0;
        if (x != BLOCK_ID) {
            switch (x) {
                case 0:
                    activeBlock = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];
                    BLOCK_COLOUR = 1; BLOCK_ID = 0;
                    break;
                case 1:
                    activeBlock = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }];
                    BLOCK_COLOUR = 2; BLOCK_ID = 1;
                    break;
                case 2:
                    activeBlock = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }];
                    BLOCK_COLOUR = 3; BLOCK_ID = 2;
                    break;
                case 3:
                    activeBlock = [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 0 }];
                    BLOCK_COLOUR = 4; BLOCK_ID = 3;
                    break;
                case 4:
                    activeBlock = [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 0 }];
                    BLOCK_COLOUR = 5; BLOCK_ID = 4;
                    break;
                case 5:
                    activeBlock = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }];
                    BLOCK_COLOUR = 6; BLOCK_ID = 5;
                    break;
                case 6:
                    activeBlock = [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
                    BLOCK_COLOUR = 7; BLOCK_ID = 6;
                    break;
            }

            blockOrigin = [...activeBlock.map(x => ({
                ...x
            }))]

            activeBlock.forEach(element =>{
                element.x +=3;
            })
                  
                if(blockCollision(activeBlock)) {
                    GAME_STATE = 2;
                }
        }

    }

    function generateColour() {

        switch (BLOCK_COLOUR) {
            case 1: ctx.fillStyle = 'rgb(255, 255, 0)';
                break;
            case 2: ctx.fillStyle = 'rgb(0, 255, 255)';
                break;
            case 3: ctx.fillStyle = 'rgb(255, 0, 255)';
                break;
            case 4: ctx.fillStyle = 'rgb(255, 129, 0)';
                break;
            case 5: ctx.fillStyle = 'rgb(0, 0, 255)';
                break;
            case 6: ctx.fillStyle = 'rgb(255, 0, 0)';
                break;
            case 7: ctx.fillStyle = 'rgb(0, 255, 0)';
                break;
        }
    }


    function checkLines() {
        let x = 0;
        let tmp;
        for (let i = 0; i < 20; i++) {
            x = 0;
            for (let j = 0; j < 10; j++) {
                if (gameFields[j][i] === 1) {
                    x++;
                }
                if (x === 10) {
                    GAME_SCORE += 10;
                    for (let k = 0; k < 10; k++) { // kasownanie zapelnionej linijki
                        gameFields[k][i] = 0;
                    }
                    for (let l = i; l > 1; l--) {  //przesuwanie tablic
                        for (let h = 0; h < 10; h++) {
                            gameFields[h][l] = gameFields[h][l - 1];
                        }
                    }
                    checkLines();
                }
            }

        }
    }
    function checkDirection(directon) {
        // 1 - lewy
        // 2 - prawy
        // 3 - dol
        let id = 0;
        if (directon === 1) {
            for (let i = 1; i < activeBlock.length; i++) {
                if (activeBlock[i].x < activeBlock[id].x) {
                    id = i;
                }

            }
        };

        if (directon === 2) {
            for (let i = 1; i < activeBlock.length; i++) {
                if (activeBlock[i].x > activeBlock[id].x) {
                    id = i;
                }

            }
        };

        if (directon === 3) {

            for (let i = 1; i < activeBlock.length; i++) {
                if (activeBlock[i].y > activeBlock[id].y) {
                    id = i;
                }
            }


        };

        return id;
    }
    function moveActiveBlock() {

        const id = checkDirection(3);
        let collision = blockCollision(activeBlock);

        if (!collision) {

            if (activeBlock[id].y > 18) {
                activeBlock.forEach(element => {
                    gameFields[element.x][element.y] = 1;
                })
                generateBlock();

            } else {
                activeBlock.forEach(element => {
                    element.y += 1;
                })
                blockLine++;
            }
        } else {

            activeBlock.forEach(element => {
                gameFields[element.x][element.y] = 1;
            }
            )
            generateBlock();

        }
    }

    function gameLoop() {

        gameScore.innerText = GAME_SCORE;
        switch (GAME_STATE) {
            case 0:
                drawPause();
                break;
            case 1:
                MOVE_BLOCK++;
                if (MOVE_BLOCK === GAME_SPEED) {
                    if(GAME_SCORE === 100 && GAME_SPEED === 10) {
                        GAME_SPEED -=5;
                    }
                     MOVE_BLOCK = 0;
                    moveActiveBlock();
                }
                drawFields();
                drawBoard();
                checkLines();
                break;
            case 2: 
                fieldsInit();
                GAME_SCORE = 0;
                drawEnd();
                generateBlock();
                GAME_SPEED = 10;
                blockLine = 0;
                break;
        }

    };
    fieldsInit();
    generateBlock();
    setInterval(gameLoop, 1000 / 15);
}