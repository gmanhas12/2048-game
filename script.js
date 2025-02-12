let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = () => {
    initializeGame();
};

function initializeGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("board").innerHTML = "";
    document.getElementById("new-game").style.display = "none"; 

    createBoard();
    placeTile();
    placeTile();
}

function createBoard() {
    const boardElement = document.getElementById("board");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            const num = board[r][c];
            updateTile(tile, num);
            boardElement.appendChild(tile);
        }
    }
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile"; 
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add(`x${num <= 4096 ? num : 8192}`);
    }
}

document.addEventListener('keyup', (event) => {
    let moved = false;
    if (event.code === "ArrowLeft") {
        moved = slideLeft();
    } else if (event.code === "ArrowRight") {
        moved = slideRight();
    } else if (event.code === "ArrowUp") {
        moved = slideUp();
    } else if (event.code === "ArrowDown") {
        moved = slideDown();
    }

    if (moved) {
        placeTile();
        document.getElementById("score").innerText = score;
    }

    if (isGameOver()) {
        endGame();
    }
});

function filterZeros(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = filterZeros(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZeros(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let original = [...board[r]];
        board[r] = slide(board[r]);
        if (JSON.stringify(original) !== JSON.stringify(board[r])) moved = true;
        updateRow(r);
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let original = [...board[r]];
        board[r] = slide([...board[r]].reverse()).reverse();
        if (JSON.stringify(original) !== JSON.stringify(board[r])) moved = true;
        updateRow(r);
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let original = [...column];
        column = slide(column);
        if (JSON.stringify(original) !== JSON.stringify(column)) moved = true;
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            updateTileElement(r, c);
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let column = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse();
        let original = [...column];
        column = slide(column).reverse();
        if (JSON.stringify(original) !== JSON.stringify(column)) moved = true;
        for (let r = 0; r < rows; r++) {
            board[r][c] = column[r];
            updateTileElement(r, c);
        }
    }
    return moved;
}

function placeTile() {
    if (!hasEmptyTile()) return;

    let placed = false;
    while (!placed) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * columns);

        if (board[r][c] === 0) {
            board[r][c] = 2;
            updateTileElement(r, c);
            placed = true;
        }
    }
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function updateRow(rowIndex) {
    for (let c = 0; c < columns; c++) {
        updateTileElement(rowIndex, c);
    }
}

function updateTileElement(row, col) {
    const tile = document.getElementById(`${row}-${col}`);
    const num = board[row][col];
    updateTile(tile, num);
}

function isGameOver() {
    if (hasEmptyTile()) return false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

function endGame() {
    alert("Game Over!");
    document.getElementById("new-game").style.display = "block";
}
