var $, TicTacToe, cell, cellClicked, cellElement, cellsGroup, createSVGElement, drawCell, drawGame, drawOverlay, game, l, movesGroup, oPlayerIndicator, overlayGroup, restartGame, xPlayerIndicator,
  indexOf = [].indexOf;

TicTacToe = (function() {
  class TicTacToe {
    startGame(initialTurn = TicTacToe.PLAYER_X) {
      this.board = [null, null, null, null, null, null, null, null, null];
      this.turn = initialTurn;
      this.status = TicTacToe.GAME_STATUS.IN_PROGRESS;
      this.winner = null;
    }

    constructor() {
      this.startGame();
      return;
    }

    checkForWinner() {
      var currentWinner, i, j, k, position, ref, ref1;
      currentWinner = (function() {
        var l, len, ref, results;
        ref = TicTacToe.WINNING_POSITIONS;
        results = [];
        for (l = 0, len = ref.length; l < len; l++) {
          [i, j, k] = ref[l];
          results.push([this.board[i], this.board[j], this.board[k]]);
        }
        return results;
      }).call(this);
      currentWinner = (function() {
        var l, len, results;
        results = [];
        for (l = 0, len = currentWinner.length; l < len; l++) {
          position = currentWinner[l];
          results.push(position.every((cell) => {
            return cell === position[0];
          }) ? position[0] : null);
        }
        return results;
      }).call(this);
      if ((ref = TicTacToe.PLAYER_X, indexOf.call(currentWinner, ref) >= 0)) {
        this.status = TicTacToe.GAME_STATUS.ENDED_WITH_WINNER;
        this.winner = TicTacToe.PLAYER_X;
        return;
      }
      if ((ref1 = TicTacToe.PLAYER_O, indexOf.call(currentWinner, ref1) >= 0)) {
        this.status = TicTacToe.GAME_STATUS.ENDED_WITH_WINNER;
        this.winner = TicTacToe.PLAYER_O;
        return;
      }
      if (!(this.board.some((cell) => {
        return cell === null;
      }))) {
        this.status = TicTacToe.GAME_STATUS.ENDED_WITH_DRAW;
        return;
      }
    }

    playChance(cell) {
      if (this.board[cell] !== null) {
        return TicTacToe.MOVE_STATUS.MOVE_INVALID;
      }
      this.board[cell] = this.turn;
      this.turn = this.turn === TicTacToe.PLAYER_X ? TicTacToe.PLAYER_O : TicTacToe.PLAYER_X;
      this.checkForWinner();
      return TicTacToe.MOVE_STATUS.MOVE_COMPLETED;
    }

  };

  TicTacToe.PLAYER_X = "player x";

  TicTacToe.PLAYER_O = "player o";

  TicTacToe.GAME_STATUS = {
    IN_PROGRESS: "in progress",
    ENDED_WITH_DRAW: "ended with draw",
    ENDED_WITH_WINNER: "ended with winner"
  };

  TicTacToe.MOVE_STATUS = {
    MOVE_INVALID: "move invalid",
    MOVE_COMPLETED: "move completed"
  };

  TicTacToe.WINNING_POSITIONS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  return TicTacToe;

}).call(this);

game = new TicTacToe;

$ = function(element) {
  return document.querySelector(element);
};

createSVGElement = function(element, attrs) {
  var attr, el, value;
  el = document.createElementNS("http://www.w3.org/2000/svg", element);
  for (attr in attrs) {
    value = attrs[attr];
    el.setAttributeNS(null, attr, value);
  }
  return el;
};

movesGroup = $("#moves");

drawCell = function(cell, player) {
  if (game.turn === TicTacToe.PLAYER_X) {
    movesGroup.appendChild(createSVGElement("circle", {
      r: 60,
      cx: ((cell % 3) * 200) + 100,
      cy: ((Math.floor(cell / 3)) * 200) + 100,
      opacity: 1,
      fill: "none",
      stroke: '#ff1744',
      'stroke-width': 30
    }));
  } else {
    movesGroup.appendChild(createSVGElement("line", {
      x1: ((cell % 3) * 200) + 40,
      x2: ((cell % 3) * 200) + 160,
      y1: ((Math.floor(cell / 3)) * 200) + 40,
      y2: ((Math.floor(cell / 3)) * 200) + 160,
      opacity: 1,
      fill: "none",
      stroke: '#2979ff',
      'stroke-width': 30
    }));
    movesGroup.appendChild(createSVGElement("line", {
      x2: ((cell % 3) * 200) + 40,
      x1: ((cell % 3) * 200) + 160,
      y1: ((Math.floor(cell / 3)) * 200) + 40,
      y2: ((Math.floor(cell / 3)) * 200) + 160,
      opacity: 1,
      fill: "none",
      stroke: '#2979ff',
      'stroke-width': 30
    }));
  }
};

overlayGroup = $("#overlay");

drawOverlay = function(text) {
  var textEl;
  overlayGroup.appendChild(createSVGElement("rect", {
    width: 600,
    height: 600,
    opacity: 0.75,
    fill: "#ffffff"
  }));
  textEl = createSVGElement("text", {
    x: '50%',
    y: '50%',
    class: "game-message",
    'dominant-baseline': "middle",
    'text-anchor': "middle",
    fill: "#000000"
  });
  textEl.innerHTML = text;
  return overlayGroup.appendChild(textEl);
};

xPlayerIndicator = $("#player-x-indicator");

oPlayerIndicator = $("#player-o-indicator");

drawGame = function() {
  switch (game.status) {
    case TicTacToe.GAME_STATUS.ENDED_WITH_DRAW:
      return drawOverlay("Draw!");
    case TicTacToe.GAME_STATUS.ENDED_WITH_WINNER:
      switch (game.winner) {
        case TicTacToe.PLAYER_X:
          return drawOverlay("X won!");
        case TicTacToe.PLAYER_O:
          return drawOverlay("O won!");
      }
      break;
    case TicTacToe.GAME_STATUS.IN_PROGRESS:
      switch (game.turn) {
        case TicTacToe.PLAYER_X:
          if (!((' ' + xPlayerIndicator.className + ' ').indexOf(' turn ') > -1)) {
            xPlayerIndicator.className += " turn";
          }
          return oPlayerIndicator.className = oPlayerIndicator.className.replace(/(?:^|\s)turn(?!\S)/, "");
        case TicTacToe.PLAYER_O:
          if (!((' ' + oPlayerIndicator.className + ' ').indexOf(' turn ') > -1)) {
            oPlayerIndicator.className += " turn";
          }
          return xPlayerIndicator.className = xPlayerIndicator.className.replace(/(?:^|\s)turn(?!\S)/, "");
      }
  }
};

restartGame = function() {
  game.startGame();
  movesGroup.innerHTML = "";
  overlayGroup.innerHTML = "";
  return drawGame();
};

cellClicked = function(n) {
  return function() {
    var moveStatus;
    if (game.status === TicTacToe.GAME_STATUS.IN_PROGRESS) {
      moveStatus = game.playChance(n);
      if (moveStatus === TicTacToe.MOVE_STATUS.MOVE_COMPLETED) {
        drawCell(n);
        drawGame();
      }
    }
  };
};

cellsGroup = $("#cells");

for (cell = l = 0; l <= 8; cell = ++l) {
  cellsGroup.appendChild(createSVGElement("rect", {
    class: "cell",
    width: 200,
    height: 200,
    x: (cell % 3) * 200,
    y: (Math.floor(cell / 3)) * 200,
    opacity: 0
  }));
  cellElement = $(`#cells .cell:nth-child(${cell + 1})`);
  if (cellElement != null) {
    cellElement.addEventListener("click", cellClicked(cell));
  }
}


//# sourceMappingURL=game.js.map
//# sourceURL=coffeescript