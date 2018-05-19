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
  x: 2,
  y: 2
};

game.checkMoveDistance = function checkMoveDistance() {
  const $characterStartPoint = $('.character').attr('id');
  const characterXStartpoint = parseInt($characterStartPoint[0]);
  const characterYStartPoint = parseInt($characterStartPoint[2]);
  console.log(characterXStartpoint);

  const moveArray = [];
  let i = 0;
  const availableLength = character.moveStats.x;
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
  }

  const $gridIds = $('.battle-cell');
  console.log($gridIds);
  $gridIds.each(function() {
    const id = this.id;
    if (moveArray.includes(id)) {
      console.log(this.id);
    }
  });


  //OR MAKE MAX MOVE VALUE AND

  // console.log(moveArray);

  // console.log(characterMoveDistance);
  // const $availableSquare = $(`#${parseInt(characterMoveDistance[0])}-${characterMoveDistance[2]}`);
  // console.log($availableSquare);
  // $availableSquare.addClass('available');
  // return $availableSquare;
};



$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  game.checkMoveDistance();




});
