const game = {};

game.createGameGrid = function createGameGrid() {
  const gameGrid = [];

  for (let i=0; i < 10; i++) {
    gameGrid.push([]);
    for (let j =0; j< 10; j++) {
      gameGrid[i].push(j);
    }
  }
  gameGrid[4][1] = 'character';
  return gameGrid;
};

game.drawBattlefield = function drawBattlefield() {
  const battlegrid = this.createGameGrid();
  $.each(battlegrid, (i, row) => {
    $.each(row, (j, cell) => {
      const $battleSquare = $('<div />');
      cell === 'character' ? $battleSquare.addClass('character') : $battleSquare.addClass('battle-cell');
      $battleSquare.attr('id', `${i}-${j}`);
      $battleSquare.appendTo('#battle-map');
    });
  });
};


game.moveCharacter = function moveCharacter() {
  $(document).on('keydown', function(e) {
    const $characterOnBoard = $('.character');
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
  });
};

game.makeMove = function makeMove(direction, characterOnBoard) {
  if (direction.attr('class') === 'battle-cell available') {
    direction.removeClass('battle-cell available').addClass('character');
    characterOnBoard.removeClass('character').addClass('battle-cell');
  }
};

const character = {};

character.moveStats = {
  x: 1,
  y: 0
};

game.checkMoveDistance = function checkMoveDistance() {
  const $characterStartPoint = $('.character').attr('id');
  console.log($characterStartPoint);
  const characterMoveDistance = `${parseInt($characterStartPoint[0]) + character.moveStats.x}-${parseInt($characterStartPoint[2]) + character.moveStats.y}`;
  console.log(characterMoveDistance);
  const $availableSquare = $(`#${characterMoveDistance[0]}-${characterMoveDistance[2]}`);
  console.log($availableSquare);
  $availableSquare.addClass('available');
  return $availableSquare;
};



$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  game.checkMoveDistance();




});
