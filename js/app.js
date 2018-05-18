
const game = {

  createGameGrid: function() {
    const gameGrid = [];

    for (let i=0; i < 10; i++) {
      gameGrid.push([]);
      for (let j =0; j< 10; j++) {
        gameGrid[i].push(j);
      }
    }
    gameGrid[4][1] = 'character';
    return gameGrid;
  },

  drawBattlefield: function() {
    const battlegrid = this.createGameGrid();
    $.each(battlegrid, (i, row) => {
      $.each(row, (j, cell) => {
        const $battleSquare = $('<div />');
        cell === 'character'? $battleSquare.addClass('character') : $battleSquare.addClass('battle-cell');
        $battleSquare.data({x: i, y: j});
        // $battleSquare.on('click', function() {
        //   // console.log($(this).data());
        // });
        $battleSquare.appendTo('#battle-map');
      });
    });
  },




};

$(() => {
  game.drawBattlefield();

});
