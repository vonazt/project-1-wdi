const game = {
};


game.createGameGrid = function createGameGrid() {
  const gameGrid = [];

  for (let i=0; i < 10; i++) {
    gameGrid.push([]);
    for (let j =0; j< 10; j++) {
      gameGrid[i].push(j);
    }
  }
  gameGrid[4][1] = 'playerOne';
  gameGrid[4][8] = 'playerTwo';
  return gameGrid;
};

game.playerOneTurn = false;

game.switchPlayers = function switchPlayers() {
  $(document).on('keydown', function(e) {
    if (e.which === 13) {
      game.playerOneTurn = !game.playerOneTurn;
      game.clearSquares();
      game.checkMoveDistance();
    }
  });
};

game.clearSquares = function clearSquares() {
  const $availableSquares = $('.available');
  $availableSquares.toggleClass('available');
};



game.drawBattlefield = function drawBattlefield() {
  const battlegrid = this.createGameGrid();
  $.each(battlegrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $battleSquare = $('<div />');
      if (cell === 'playerOne') {
        $battleSquare.addClass('playerOne');
      } else if (cell === 'playerTwo') {
        $battleSquare.addClass('playerTwo');
      } else {
        $battleSquare.addClass('battle-cell');
      }
      $battleSquare.attr('id', `${i}-${j}`);
      $battleSquare.on('click', function() {
        console.log($battleSquare);
      });
      $battleSquare.appendTo('#battle-map');
    });
  });
};

game.characterMovement = function characterMovement(player, e) {
  const $characterOnBoard = $(player);
  const characterId = $characterOnBoard.attr('id');
  const upSquare = $(`#${parseInt(characterId[0])-1}-${parseInt(characterId[2])}`);
  const downSquare = $(`#${parseInt(characterId[0])+1}-${parseInt(characterId[2])}`);
  const leftSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) -1}`);
  const rightSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) + 1}`);

  if (e.which === 38) {
    game.makeMove(upSquare, $characterOnBoard);
  } else if (e.which === 40) {
    game.makeMove(downSquare, $characterOnBoard);
  } else if (e.which === 39) {
    game.makeMove(rightSquare, $characterOnBoard);
  } else if (e.which === 37) {
    game.makeMove(leftSquare, $characterOnBoard);
  }
};

game.moveCharacter = function moveCharacter() {
  $(document).on('keydown', function(e) {
    if (game.playerOneTurn) {
      game.characterMovement('.playerOne', e);
    } else {
      game.characterMovement('.playerTwo', e);
    }
  });
};

game.moveCells = function moveCells(player, direction, characterOnBoard) {
  if (direction.attr('class') === 'battle-cell available') {
    direction.removeClass('battle-cell available').addClass(player);
    characterOnBoard.removeClass(player).addClass('battle-cell available');
  }
};

game.makeMove = function makeMove(direction, characterOnBoard) {
  if (this.playerOneTurn) {
    this.moveCells('playerOne', direction, characterOnBoard);
  } else {
    this.moveCells('playerTwo', direction, characterOnBoard);
  }
};

const character = {};

character.moveStats = {
  x: 2,
  y: 2
};

game.showAvailableSquares = function showAvailableSquares(player) {
  const $characterStartPoint = $(player).attr('id');
  const characterXStartpoint = parseInt($characterStartPoint[0]);
  const characterYStartPoint = parseInt($characterStartPoint[2]);

  const moveArray = [];
  let i = 0;
  const availableLength = character.moveStats.y;
  const xDistance = i + characterXStartpoint;
  const yDistance = i + characterYStartPoint;

  for (i; i <= availableLength; i++) {
    moveArray.push((i + xDistance) + '-' + (i + yDistance));
    moveArray.push((i + xDistance) + '-' + (yDistance - i));
    moveArray.push((xDistance - i) + '-' + (yDistance - i));
    moveArray.push((xDistance - i) + '-' + (i + yDistance));
    moveArray.push(xDistance + '-' + (i + yDistance));
    moveArray.push(xDistance + '-' + (yDistance - i));
    moveArray.push((xDistance + i) + '-' + (yDistance));
    moveArray.push((xDistance - i) + '-' + (yDistance));
    moveArray.push((xDistance + i) + '-' + (yDistance - i+1));
    moveArray.push((xDistance + i) + '-' + (yDistance + i-1));
    moveArray.push((xDistance - i) + '-' + (yDistance - i + 1));
    moveArray.push((xDistance - i) + '-' + (yDistance + i-1));
  }

  const $gridIds = $('.battle-cell');
  $gridIds.each(function() {
    const id = this.id;
    if (moveArray.includes(id)) {
      $(this).addClass('available');
    }
  });
};

game.checkMoveDistance = function checkMoveDistance() {
  if (this.playerOneTurn) {
    this.showAvailableSquares('.playerOne');
  } else {
    this.showAvailableSquares('.playerTwo');
  }
};

$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  game.checkMoveDistance();
  game.switchPlayers();

});
