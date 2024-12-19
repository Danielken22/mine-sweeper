'use strict'

// 1. Create a 4x4 gBoard Matrix containing Objects.
var mine = '💣'
var marked = '🚩'
var gElSelectedCell = null

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gBoard = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0

}
function onInit() {
    var gBoard = buildboard(gLevel)
    renderBoard(gBoard)
    onCellClicked()
}

function buildboard(SIZE) {
    var board = []
    var emptycell = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        gBoard = {
            minesAroundCount: 4,
            isShown: false,
            isMine: false,
            isMarked: true
        }

        for (var j = 0; j < gLevel.SIZE; j++) {
            // 2. Set 2 of them to be mines 
            board[i][j] = (Math.random() > 0.2) ? gBoard.isMine : gLevel.MINES
        }
        gLevel.MINES = mine
    }
    console.log(board)
    return board
}
function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]

            // 3. Present the mines using renderBoard() function.
            var className = (cell) ? gBoard.isMine : gLevel.isMine

            strHTML += `<td class="${className}"
                        onclick="onCellClicked(this,${i},${j})"
                        data-i="${i}" data-j="${j}">
                           ${cell}
                        </td>`
        }
        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.game-board')
    elBoard.innerHTML = strHTML
    var elMinesCount = document.querySelector('.neighboring')
    elMinesCount.innerHTML = setMinesNegsCount(board, i, j)
    setMinesNegsCount(board, i, j)
    onCellClicked(this, i, j)

    // 2. Update the renderBoard() function to also display the
    // neighbor count and the mines

}
// 1. Create setMinesNegsCount() and store the numbers
function setMinesNegsCount(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine && !currCell.isShown) count++
        }
    }

    return count

}
function checkAndShowMine(cell, elCell) {
    if (cell.isMine) {
        elCell.innerText = '💣'; // Show mine
    }
}
function expandShown(board, elCell, i, j) {
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

function onCellClicked(elCell, i, j) {
    
    document.addEventListener('DOMContentLoaded', (event) => {
        var cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', function () {
                var i = parseInt(this.getAttribute('data-i'));
                var j = parseInt(this.getAttribute('data-j'));
                onCellClicked(this, i, j);
            });
        });
    })
        var board = buildboard();
        const cell = board[i][j];
        // ignore none mine and marked
        if (cell.isShown || cell.isMine) return;

        console.log('Cell clicked: ', elCell, i, j);

        elCell.classList.add('selected');
        if (gElSelectedCell) {
            gElSelectedCell.classList.remove('selected')
        }
        gElSelectedCell = (gElSelectedCell !== elCell) ? elCell : null;
        checkAndShowMine(cell, elCell);

        if (!cell.isMine) {
            var minesAroundCount = setMinesNegsCount(board, i, j)
            elCell.innerText = minesAroundCount
            cell.isShown = true
            if (minesAroundCount === 0) {
                expandShown(board, elCell, i, j);
            }
        }    
}



// 3. Add a console.log – to help you with debugging

// 1. When clicking a cell, call the onCellClicked() function.
// 2. Clicking a safe cell reveals the minesAroundCount of this cell

// Step4 – randomize mines' location:
// 1. Add some randomicity for mines location
// 2. After you have this functionality working– its best to comment
// the code and switch back to static location to help you focus