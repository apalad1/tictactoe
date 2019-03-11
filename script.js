var origBoard;

//icons for players, atm its player 1 and computer
const huPlayer = '0';
const aiPlayer = 'X';

//the combinations that will end the match
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
 
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
 
	[0, 4, 8],
	[2, 4, 6]
]

const boxes = document.querySelectorAll('.box');
startGame();

function startGame(){
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	//board clear on restart
	for(var i = 0; i < boxes.length; i++){
		boxes[i].innerText = '';
		//remove the background highlighted by the win combo
		boxes[i].style.removeProperty('background-color'); 
		boxes[i].addEventListener('click',turnClick, false);
		
	}
}
//determine turns
function turnClick(square){
		if(typeof origBoard[square.target.id] == 'number'){
			//unused box check ^
			turn(square.target.id, huPlayer)
		  if(!checkTie()) turn(bestSpot(), aiPlayer);
		}
		
}

function turn(squareId, player){
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player){
	//find used boxes
	let plays = board.reduce((a, e, i) => 
		(e === player) ? a.concat(i) : a, []);
		//e is element in board array, i is index
	let gameWon = null;
	//loop through all wincombos array
	for(let [index, win] of winCombos.entries()){
		if(win.every(elem => plays.indexOf(elem) > -1)){
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
	
}

function gameOver(gameWon){
	for(let index of winCombos[gameWon.index]){
		document.getElementById(index).style.backgroundColor = 
		 gameWon.player == huPlayer ? "lightblue" : "lightred";
		 //the boxes glow for the winner
	}
	for (var i = 0; i < boxes.length; i++){
		boxes[i].removeEventListener('click', turnClick, false);
	}
	
	declareWinner(gameWon.player == huPlayer ? "Match Won!" : "Match Lost.");
	
}

function declareWinner(who){
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(){
	return minimax(origBoard, aiPlayer).index;
	
}

function checkTie(){
	//glows green on tie
	
	if(emptySquares().length == 0){
		for(var i = 0; i< boxes.length; i++){
			boxes[i].style.backgroundColor = "lightgreen";
			boxes[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}







































































