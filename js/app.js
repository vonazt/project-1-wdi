const game = {};

//BATTLEFIELD GRID BUILDING AND CHARCTER PLACING
game.createGameGrid = function createGameGrid() {
  const gameGrid = [];

  //creates a 10 x 10 battlefield grid
  for (let i=0; i < 10; i++) {
    gameGrid.push([]);
    for (let j =0; j< 10; j++) {
      gameGrid[i].push(j);
    }
  }

  //starting positions for playerOne and playerTwo characters
  gameGrid[4][1] = 'playerOne';
  gameGrid[4][8] = 'playerTwo';
  return gameGrid;
};

game.drawBattlefield = function drawBattlefield() {
  const battlegrid = this.createGameGrid();
  $.each(battlegrid, (i, row) => {
    $.each(row, (j, cell) => {
      //fills grid with divs - if the grid is occupied by a player character (in game.createGrid) they're given a corresponding class
      //otherwise they default to class battle-cell
      const $battleSquare = $('<div />');
      if (cell === 'playerOne') {
        $battleSquare.addClass('playerOne');
      } else if (cell === 'playerTwo') {
        $battleSquare.addClass('playerTwo');
      } else {
        $battleSquare.addClass('battle-cell');
      }
      //assigns every cell an id for selection in other functions, such as movement
      $battleSquare.attr('id', `${i}-${j}`);
      //temp click function for checking grid coords in debugging
      // $battleSquare.on('click', function() {
      //   console.log($battleSquare);
      // });
      $battleSquare.appendTo('#battle-map');
    });
  });
};


//PLAYER OPTIONS AND TURN SWITCHING
game.playerOneTurn = true; //flag for switching between player turns

// game.enterKeydown = false;
//
// game.displayOptions = function displayOptions() {
//   $(document).on('keydown', function(e) {
//     if (e.which === 13) {
//       if (!game.enterKeydown) {
//         game.enterKeydown = true;
//         console.log(game.enterKeydown);
//         // game.$moveOptions.show();
//         game.pickOption();
//       }
//     }
//   });
//
// };



game.pickOption = function pickOption() {
  const $option = $('.option');
  $option.on('click', function() {
    if (this.id === 'wait-option') game.switchPlayers();
    // else if (this.id === 'cancel') game.$moveOptions.hide();
  });
};

game.switchPlayers = function switchPlayers() {
  game.playerOneTurn = !game.playerOneTurn;
  // game.$moveOptions.hide();
  game.clearSquares();
  game.checkMoveDistance();
  // game.enterKeydown = false;
  // console.log(game.enterKeydown);
};


game.clearSquares = function clearSquares() {
  const $availableSquares = $('.available');
  $availableSquares.toggleClass('available');
};

//CHARACTER MOVEMENT

game.checkMoveDistance = function checkMoveDistance() {
  if (this.playerOneTurn) {
    this.showAvailableSquares('.playerOne');
  } else {
    this.showAvailableSquares('.playerTwo');
  }
};

//checks which squares are available for character to move to based on current position and move stats (see character object)
game.showAvailableSquares = function showAvailableSquares(player) {
  const $characterStartPoint = $(player).attr('id');
  //gets current location from character's current div id
  const characterXStartpoint = parseInt($characterStartPoint[0]);
  const characterYStartPoint = parseInt($characterStartPoint[2]);

  const moveArray = [];
  let i = 0;
  const availableLength = character.moveStats.y;
  const xDistance = i + characterXStartpoint;
  const yDistance = i + characterYStartPoint;

  //this is a very convoluted way to get every necessary coordinate based on player stats
  //needs major refactoring - main problem is including the right space depending on move stats
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

  //compares an array of all battle-cells with the moveArray generated above and adds class .available to those that are the same
  const $gridIds = $('.battle-cell');
  $gridIds.each(function() {
    const id = this.id;
    if (moveArray.includes(id)) {
      $(this).addClass('available');
    }
  });
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


game.characterMovement = function characterMovement(player, e) {
  const $characterOnBoard = $(player);

  //gets the character position based on id
  //gets id of surrounding squares using character's current cell id
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

game.makeMove = function makeMove(direction, characterOnBoard) {
  if (this.playerOneTurn) {
    this.moveCells('playerOne', direction, characterOnBoard);
  } else {
    this.moveCells('playerTwo', direction, characterOnBoard);
  }
};

//swaps cell classes based on direction key pressed to give illusion of character movement
//available class is related to move stats below
game.moveCells = function moveCells(player, direction, characterOnBoard) {
  this.turnAttackOff();
  if (direction.attr('class') === 'battle-cell available') {
    direction.removeClass('battle-cell available').addClass(player);
    characterOnBoard.removeClass(player).addClass('battle-cell available');
  } if ($('.playerTwo').attr('id') === direction.attr('id')) {
    this.turnAttackOn();
  }

};





//BATTLE EVENTS
game.attackOn = false;

game.turnAttackOn = function turnAttackOn() {
  console.log('attack on');
  this.attackOn = true;
  console.log(this.attackOn);
  console.log(this.$attackOption);
  this.$attackOption.css({
    'color': 'white',
    'cursor': 'pointer'
  });
};

game.turnAttackOff = function turnAttackOff() {
  console.log('attack on');
  this.attackOn = false;
  console.log(this.attackOn);
  console.log(this.$attackOption);
  this.$attackOption.css({
    'color': 'gray',
    'cursor': 'default'
  });
};



//CHARACTER OBJECT
const character = {};

character.moveStats = {
  x: 2,
  y: 2
};

//GAME INIT

$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  // game.$moveOptions = $('#move-options'); //this needs to be internalised somewhere later
  // game.$moveOptions.hide();
  game.checkMoveDistance();
  game.$attackOption = $('#attack-option');
  game.pickOption();
});
