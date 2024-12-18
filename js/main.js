'use strict'
const Mine = '💣'
const Mark = '🚩'
var Size = 4
var gElSelectedTile=null
var gLevel = { Mines: 2, size: buildBoard() }
var gBoard = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard(board) {
    board = []
    var level1 = 4
    for (var i = 0; i < level1; i++) {
        board[i] = []
        for (var j = 0; j < level1; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            }
        }
    } return board
}
function renderBoard(board) {
    var cells = []
        var strHTML = ''
        for (var i = 0; i < board.length; i++) {
            strHTML += '<tr>'
            for (var j = 0; j < board[0].length; j++) {
                var currCell = board[i][j]
                var cellClass = (board[i][j]) ? 'isMine' : ''
                var cellData = 'data-i="' + i + '" data-j="' + j + '"'
                strHTML += `
        <td class="cell ${cells}" ${cells} onclick="onCellClicked(${i}, ${j})">
        ${cells}
        </td>
        `
            }
            strHTML += '</tr>'

        }
        var elBoard = document.querySelector('.game-board')
        elBoard.innerHTML = strHTML
    
}
function setMinesNegsCount(){
    
}

function onCellClicked(elCell, i, j){
    const cell = gBoard[i][j]

    // ignore none seats and booked seats
    if (!cell.isMarked || cell.isMine) return

    console.log('Cell clicked: ', elCell, i, j)

    // Selecting a seat
    elCell.classList.add('selected')
    
    // Only a single seat should be selected
    if (gElSelectedTile) {
        gElSelectedTile.classList.remove('selected')
    }
    gElSelectedTile = (gElSelectedTile !== elCell) ? elCell : null

    if (gElSelectedTile) {
        showTile({ i, j })
    } else {
        hideTile()
    }
}

 function minesAroundCount(board, rowIdx, colIdx){
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMarked && !currCell.isShown) count++
        }
    }
    return count

 }

function createmines(){
}
function showTile(pos){
const tile=gBoard[pos.i][pos.j]
tile.style= 'red'

}
function hideTile(){

}
