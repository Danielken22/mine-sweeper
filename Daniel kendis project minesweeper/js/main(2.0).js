'use strict'

// 1. Create a 4x4 gBoard Matrix containing Objects.
var mine = '💣'
var marked = '🚩'
var gElSelectedCell = null
var gGameOver

// // 2. Add a console.log – to help you with debugging
// // 3. Add a console.log – to help you with debugging

// // 1. When clicking a cell, call the onCellClicked() function.
// // 2. Clicking a safe cell reveals the minesAroundCount of this cell

// // Step4 – randomize mines' location:
// // 1. Add some randomicity for mines location
// // 2. After you have this functionality working– its best to comment
// // the code and switch back to static location to help you focus
var gLevel = {
    SIZE: 4,
    MINES: 2
};
var gBoard;
var gElSelectedCell = null;
var isFirstClick = true;

function setDifficulty(elBtn) { //adjusts the difficulty of the game by changing the size of the board and the number of mines
    gLevel.SIZE = parseInt(elBtn.getAttribute('data-size'));
    gLevel.MINES = parseInt(elBtn.getAttribute('data-mines'));
    console.log('Difficulty set to:', gLevel.SIZE, 'Size:', gLevel.SIZE, 'Mines:', gLevel.MINES); 
    onInit();
}

function onInit() {
    gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
    renderBoard(gBoard);
    isFirstClick = true;
    gGameOver = false;
    document.querySelector('.mines-on-board').innerText= 'mines on board :'+gLevel.MINES
}

function buildBoard(size, mines) { //builds the board
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                isShown: false,
                isMine: false,
                minesAroundCount: 0,
                isMarked: false
            };
        }
    }
    placeMines(board, mines);
    return board;
}

function placeMines(board, mines) { //places the mines on the board
    var size = board.length;
    var placedMines = 0;
    while (placedMines < mines) {
        var i = Math.floor(Math.random() * size);
        var j = Math.floor(Math.random() * size);
        if (!board[i][j].isMine) {
            board[i][j].isMine = true;
            placedMines++;
        }
    }
}

function renderBoard(board) { //renders the board and the variables inside (mines, numbers, etc.)
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[i].length; j++) {
            var cellClass = 'cell';
            strHTML += `<td class="${cellClass}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this, ${i}, ${j})"></td>`;
        }
        strHTML += '</tr>';
    }
    var elBoard = document.querySelector('.game-board');
    elBoard.innerHTML = strHTML;
}

function onCellClicked(elCell, i, j) { //responisable for the user interaction with the board
    var gGameOver = false;
    if (gGameOver) return; 

    if (isFirstClick) {
        isFirstClick = false;
        while (gBoard[i][j].isMine) {
            gBoard = buildBoard(gLevel.SIZE, gLevel.MINES);
            renderBoard(gBoard);
        }
    }

    const cell = gBoard[i][j];
    if (cell.isShown) return;

    console.log('Cell clicked: ', elCell, i, j);

    elCell.classList.add('selected');
    if (gElSelectedCell) {
        gElSelectedCell.classList.remove('selected');
    }
    gElSelectedCell = (gElSelectedCell !== elCell) ? elCell : null;

    if (cell.isMine) {
        checkAndShowMine(cell, elCell);
        gameOver();
        return;
    }

    var minesAroundCount = setMinesNegsCount(gBoard, i, j); // Count mines around the cell
    elCell.innerText = minesAroundCount;
    cell.isShown = true;
    if (minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j);
    }
}

function checkAndShowMine(cell, elCell) { //checks if the cell is a mine and shows it
    if (cell.isMine) {
        elCell.innerText = '💣'; // Show mine
    }
}

function setMinesNegsCount(board, rowIdx, colIdx) { //counts the mines around the cell
    var minesAroundCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (board[i][j].isMine) minesAroundCount++;
        }
    }
    return minesAroundCount;
}
function gameOver() { //ends the game
    if ( gGameOver = true){
        alert('Game Over! You clicked on a mine.')
        revealAllMines()
    }else{   
        revealAllMines()
        alert('You Won!')

    }
}
function expandShown(board, elCell, i, j) { //expands the shown cells
    for (var x = i - 1; x <= i + 1; x++) {
        if (x < 0 || x >= board.length) continue;
        for (var y = j - 1; y <= j + 1; y++) {
            if (y < 0 || y >= board[0].length) continue;
            if (x === i && y === j) continue;
            var neighborCell = board[x][y];
            var neighborElCell = document.querySelector(`[data-i="${x}"][data-j="${y}"]`);
            if (!neighborCell.isShown && !neighborCell.isMine) {
                neighborCell.isShown = true;
                var minesAroundCount = setMinesNegsCount(board, x, y);
                neighborElCell.innerText = minesAroundCount;
                neighborElCell.classList.add('selected');
                if (minesAroundCount === 0) {
                    expandShown(board, neighborElCell, x, y);
                }
            }
        }
    }
}
function revealAllMines() { //reveals all the mines on the board when game ends
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                elCell.innerText = '💣';
                elCell.classList.add('mine');
            }
        }
    }
}

