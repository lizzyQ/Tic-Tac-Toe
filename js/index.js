var td = document. getElementsByTagName("td");
var board = [null,null,null,null,null,null,null,null,null];
var aiMove = false;
var pr,ai,restart;

function initial(){
  board = board.map(function(val){return val = null;});
  aiMove = false;
  clearTimeout(restart);
  document.getElementById("winner").style.display = "none";
  document.getElementById("popup").style.display = "block";
  // make the userInterface clean
  updateMove();
}

function iconSelect(e){
  if(e.value == "x"){
      pr = "x";
      ai = "o";
  }else{
     pr = "o";
     ai = "x";
  }
  document.getElementById("popup").style.display = "none";
  playerMove();
}


function playerMove(){
  for(var i=0; i<td.length; i++){
     if(!aiMove && board[i] == null){
       td[i].addEventListener("click", playerTakeMove, false);
       td[i].style.cursor = "pointer";
     }
  }//for loop over
}

function playerTakeMove(){
  var ele = this.id[1];
  board[ele] = false; 
  aiMove = true;
  updateMove();
  aiTakeMove();
}

 function updateMove(){
   updateBtn();
   var winner = updateBoard(board);
   if( winner !== null){ gameOver(winner); }
 }

function updateBtn(){
  board.map(function(val,idx){
    document.getElementById("c"+ idx).innerHTML = val == false ? pr : val == true ? ai: "";
  });
}

function updateBoard(board){
  var winComb = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  var empty = true;
  for(var j=0; j<winComb.length; j++){
     for(var n=0; n<3; n++){
          var ele = winComb[j][n];
          winComb[j][n] = board[ele];
          if(winComb[j][n] == null){
            empty = false;
            winComb[j][n] = "e";
          }
          if(winComb[j][n]== true){
            winComb[j][n] = "a";
          }else if(winComb[j][n]== false){
            winComb[j][n] = "p";
          }
     } // small forloop over
     var combEle = winComb[j].join('');
     if(combEle == "ppp"){
       return 0;
     }
     if(combEle == "aaa"){
       return 1;
     }
  }
  if(empty){ return -1;}
  return null;
}

function aiTakeMove(){
  board = recurseMinimax(board,true)[1];
  aiMove = false;
  updateMove();
}

/*
referrence
https://blog.vivekpanyam.com/how-to-build-an-ai-that-wins-the-basics-of-minimax-search/
*/
function recurseMinimax(tempBoard, player) {
    var winner = updateBoard(tempBoard);
    if (winner != null){
          switch(winner) {
              case 1:  // AI wins
                return [1, tempBoard];
              case 0: // opponent wins
                 return [-1, tempBoard];
              case -1: // Tie
                return [0, tempBoard];
          }//switch over
    }else{

        var nextVal = null;
        var nextBoard = null;

        for (var k = 0; k < tempBoard.length; k++) {
                 if (tempBoard[k] == null){
                     tempBoard[k] = player; //board [false, true,false,true]
                     var value = recurseMinimax(tempBoard, !player)[0]; //1, -1, 0/ null//true/false
                     //player is AI && max or player is human && min
                      if ( (player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                             //duplicate board so we can foresee
                             nextBoard = tempBoard.map(function(val){return val; });
                             nextVal = value;
                       }
                       tempBoard[k] = null;
                 }
        }
       //console.log(JSON.stringify(nextBoard));
       return [nextVal, nextBoard]; //[1/-1/0, [board] ];
    }
}

function gameOver(winner){
  document.getElementById("winner").style.display = "block";
  document.getElementById("winInfo").innerHTML = winner == 1 ? "AI won" : winner == 0 ? "You won" : winner == -1 ? "Tie": "";
  restart = setTimeout(initial, 2000);
}
