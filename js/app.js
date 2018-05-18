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
    const $character = $('.character');
    const characterId = $character.attr('id');
    const upSquare = $(`#${parseInt(characterId[0])-1}-${parseInt(characterId[2])}`);
    const downSquare = $(`#${parseInt(characterId[0])+1}-${parseInt(characterId[2])}`);
    const leftSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) -1}`);
    const rightSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) + 1}`);

    if (e.which === 38) {
      if (upSquare.attr('class') === 'battle-cell') {
        upSquare.removeClass('battle-cell').addClass('character');
        $character.removeClass('character').addClass('battle-cell');
      }
    } else if (e.which === 40) {
      if (downSquare.attr('class') === 'battle-cell') {
        downSquare.removeClass('battle-cell').addClass('character');
        $character.removeClass('character').addClass('battle-cell');
      }
    } else if (e.which === 39) {
      if (rightSquare.attr('class') === 'battle-cell') {
        rightSquare.removeClass('battle-cell').addClass('character');
        $character.removeClass('character').addClass('battle-cell');
      }
    } else if (e.which === 37) {
      if (leftSquare.attr('class') === 'battle-cell') {
        leftSquare.removeClass('battle-cell').addClass('character');
        $character.removeClass('character').addClass('battle-cell');
      }
    }
  });
};

$(() => {
  game.drawBattlefield();
  game.moveCharacter();



});
