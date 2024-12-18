'use strict'
const Mine = '💣'
const FLAG = '🚩'
var smileyFace='😊'
var gLevel = { Size: 4, mines: 2 } //board size and mine count
var gFlagsOnBoardCount
var gFirstClickedCell
var gMinesOnBoard
var elMinesOnBoard
var minesAroundCount
var gBoard = { //the modal
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: true
}

var gGame = {
    isOn: false, //when  ison:true user can play
    shownCount: 0, //shows how many tiles are reveled 
    markedCount: 0, //shows how many cells are marked('🚩') 
    secsPassed: 0 //how many secons passed (timer )
}

var resetBtn = document.querySelector('.reset-game')

function onInit() { //activates upon opening page 
    var gLevel = { Size: 4, mines: 2 }
    gGame.isOn = false
    var gBoard = buildBoard()
    var smileyFace='😊'
    var elBoard = document.querySelector('.game-board')
    renderBoard(gBoard,'.game-board')
    gFlagsOnBoardCount = 0
    gMinesOnBoard = +gLevel.mines
    
    // elMinesOnBoard.innerText = gLevel.mines
    gFirstClickedCell ={}

}
//builds the board ,sets mines ,calls upon function setMinesCount() and returns board
// 1. Create a 4x4 gBoard Matrix containing Objects.  

function renderBoard(board, selector) { //renders board as table
    // 2. Set 2 of them to be mines 
    // 3. Present the mines using renderBoard() function. 
    var strHTML = ''
    
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount =  setMinesNegsCount(i, j, board)
            }
            var strClass
            strHTML += `
            \t<td
            class="cell"
                    data-i="${i}" 
                    data-j="${j}" 
                    onclick="onCellClicked(this,${i}, ${j})"
                    >
                </td>\n
            `
        }
        strHTML += '</tr>\n'
    }
    var elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML

}

function onCellClicked(elCell, i, j) {//called when cell is clicked 
    // When clicking a cell, call the onCellClicked() function. 
    // 2. Clicking a safe cell reveals the minesAroundCount of this cell
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j


    if (!gFirstClickedCell) {
        gFirstClickedCell = { i: elCellI, j: elCellJ }
        if (gBoard[gFirstClickedCell.i][gFirstClickedCell.j].isMine) {
            replaceMineLocation(gFirstClickedCell, gBoard)
        }
    }
    if (gGame.isOn = false) return

}

function onCellMarked(elCell) {//called when cell is right clicked 
    
    var elCellI = elCell.dataset.i
    var elCellJ = elCell.dataset.j

    if (gBoard[elCellI][elCellJ].isShown) return

    gBoard[elCellI][elCellJ].isMarked = !gBoard[elCellI][elCellJ].isMarked
    gBoard[elCellI][elCellJ].isMarked ? gFlagsOnBoardCount++ : gFlagsOnBoardCount--

    elCell.innerText = gBoard[elCellI][elCellJ].isMarked ? FLAG : ""
    elCell.classList.toggle('marked')

    var minesOnBoardCount = +elMinesOnBoard.textContent
    elMinesOnBoard.innerText = gBoard[elCellI][elCellJ].isMarked ? minesOnBoardCount - 1 : minesOnBoardCount + 1

    checkGameOver()

}

function minesAroundCount(board, rowIdx, colIdx) {//counts the mine around cells
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


function expandShown(board, elCell, i, j) { //reveals hidden tiles and skips mines 
    var cellI = elCell.dataset.i
    var cellJ = elCell.dataset.j
    for (var i = cellI - 1; i <= celli + 1; i++) {
        if (i < 0 || i > board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var elCell = document.querySelector(`[data-i = '${i}'][data-j = '${j}']`)
            if (!board[i][j].isMine && board[i][j].minesAroundCount <= 3) onCellClicked(elCell)
        }

    }
}

function setMinesNegsCount(board) { //count mines around each cell and sets minesAroundCount 
    var neighborsCount = 0;
    var cellI

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}
function randomizeMinesLocation(location, board) {
    var coordI = location.i
    var coordJ = location.j
    for (var i = coordI - 1; i <= coordI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = coordJ - 1; j <= coordJ + 1; j++) {
            if (i === coordI && j === coordJ) continue
            if (j < 0 || j >= board[i].length) continue
            var tempCell = gBoard[coordI][coordJ]
            if (!board[i][j].isMine) {
                gBoard[coordI][coordJ] = board[i][j]
                board[i][j] = tempCell
            }
        }
    }
}

function buildBoard() {
    const genArr = []
    const board = []
    for (var i = 0; i < gLevel.size ** 2; i++) {
        var cellData = {
            isShown: false,
            isMine: i < gLevel.mines ? true : false,
            isMarked: false,
            minesAroundCount: null
        }
        genArr.push(cellData)
    }
    var currentIndex = genArr.length;
    var temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        temporaryValue = genArr[currentIndex]
        genArr[currentIndex] = genArr[randomIndex]
        genArr[randomIndex] = temporaryValue
    }
        while (genArr.length) board.push(genArr.splice(0, gLevel.size))
        return board;

}

function checkGameOver() {//game ends when all mines are marked||allthe other tiles are shown
    if (!isOnMine) {

        var flaggedMinesCount = 0
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
                    flaggedMinesCount++
                }
            }
        }
        if (flaggedMinesCount === gMinesOnBoard && gMinesOnBoard === gFlagsOnBoardCount) {
            gIsGameOver = true
            resetBtn.innerText = WIN
        }
    }
}
function setDifficulty(elLevel){
    var size = elLevel.dataset.size
    var mines = elLevel.dataset.mines
    gLevel.size = size
    gLevel.mines = mines
    onInit()
}