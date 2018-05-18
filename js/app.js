
const battlefield = {

  createGameGrid: function() {
    const gameGrid = [];

    for (let i=0; i < 10; i++) {
      gameGrid.push([]);
      for (let j =0; j< 10; j++) {
        gameGrid[i].push(j);
      }
    }
    console.log(gameGrid);
    return gameGrid;
  },

  drawBattlefield: function() {
    const battlegrid = this.createGameGrid();
    $.each(battlegrid, (i, row) => {
      $.each(row, (j, cell) => {
        const $battleSquare = $('<div />');
        $battleSquare.addClass('battle-cell');
        $battleSquare.data({x: i, y: j});
        if ($battleSquare.data({x: 4, y: 1})) {
          $battleSquare.addClass('character');
        }
        $battleSquare.appendTo('#battle-map');
      });
    });
  }

};

$(() => {
  battlefield.drawBattlefield();

});
