document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const scoreDisplay = document.getElementById("score");
    const newGameButton = document.getElementById("new-game");

    const gridSize = 4;
    let tiles = [];
    let score = 0;

    function createBoard() {
        tiles = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        gameBoard.innerHTML = '';
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            gameBoard.appendChild(tile);
        }
        addNewTile();
        addNewTile();
        updateBoard();
    }

    function addNewTile() {
        let emptyTiles = [];
        tiles.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                if (tile === 0) {
                    emptyTiles.push({ row: rowIndex, col: colIndex });
                }
            });
        });
        if (emptyTiles.length > 0) {
            const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            tiles[row][col] = Math.random() > 0.1 ? 2 : 4;
        }
    }

    function updateBoard() {
        const tileElements = document.querySelectorAll(".tile");
        tileElements.forEach((tile, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            const value = tiles[row][col];
            tile.textContent = value === 0 ? '' : value;
            tile.style.backgroundColor = getTileColor(value);
        });
        scoreDisplay.textContent = score;
    }

    function getTileColor(value) {
        const colors = {
            0: "#cdc1b4",
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#f59563",
            32: "#f67c5f",
            64: "#f65e3b",
            128: "#edcf72",
            256: "#edcc61",
            512: "#edc850",
            1024: "#edc53f",
            2048: "#edc22e"
        };
        return colors[value] || "#3c3a32";
    }

    function moveTiles(direction) {
        let moved = false;
        if (direction === "up" || direction === "down") {
            for (let col = 0; col < gridSize; col++) {
                let column = tiles.map(row => row[col]);
                if (direction === "up") column = moveArray(column);
                if (direction === "down") column = moveArray(column.reverse()).reverse();
                for (let row = 0; row < gridSize; row++) {
                    if (tiles[row][col] !== column[row]) {
                        moved = true;
                        tiles[row][col] = column[row];
                    }
                }
            }
        } else {
            for (let row = 0; row < gridSize; row++) {
                let rowArray = tiles[row];
                if (direction === "left") rowArray = moveArray(rowArray);
                if (direction === "right") rowArray = moveArray(rowArray.reverse()).reverse();
                for (let col = 0; col < gridSize; col++) {
                    if (tiles[row][col] !== rowArray[col]) {
                        moved = true;
                        tiles[row][col] = rowArray[col];
                    }
                }
            }
        }
        if (moved) {
            addNewTile();
            updateBoard();
            checkGameOver();
        }
    }

    function moveArray(arr) {
        arr = arr.filter(val => val);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr.splice(i + 1, 1);
            }
        }
        while (arr.length < gridSize) arr.push(0);
        return arr;
    }

    function checkGameOver() {
        if (!tiles.flat().includes(0)) {
            let movesAvailable = false;
            for (let row = 0; row < gridSize; row++) {
                for (let col = 0; col < gridSize; col++) {
                    if ((row < gridSize - 1 && tiles[row][col] === tiles[row + 1][col]) ||
                        (col < gridSize - 1 && tiles[row][col] === tiles[row][col + 1])) {
                        movesAvailable = true;
                        break;
                    }
                }
            }
            if (!movesAvailable) alert("Game Over!");
        }
    }

    newGameButton.addEventListener("click", createBoard);
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") moveTiles("up");
        if (e.key === "ArrowDown") moveTiles("down");
        if (e.key === "ArrowLeft") moveTiles("left");
        if (e.key === "ArrowRight") moveTiles("right");
    });

    createBoard();
});