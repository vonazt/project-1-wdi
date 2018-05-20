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
  gameGrid[4][1] = 'characterOne';
  gameGrid[4][8] = 'characterTwo';
  return gameGrid;
};

game.drawBattlefield = function drawBattlefield() {
  const battlegrid = this.createGameGrid();
  $.each(battlegrid, (i, row) => {
    $.each(row, (j, cell) => {
      //fills grid with divs - if the grid is occupied by a player character (in game.createGrid) they're given a corresponding class
      //otherwise they default to class battle-cell
      const $battleSquare = $('<div />');
      if (cell === 'characterOne') {
        $battleSquare.addClass('characterOne').attr(jonSnow);
      } else if (cell === 'characterTwo') {
        $battleSquare.addClass('characterTwo').attr(theMountain);
      } else {
        $battleSquare.addClass('battle-cell');
      }
      //assigns every cell an id for selection in other functions, such as movement
      $battleSquare.attr('id', `${i}-${j}`);
      //temp click function for checking grid coords in debugging
      $battleSquare.on('click', function() {
        console.log($battleSquare);
      });
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
    if (this.id === 'attack-option') {
      if (game.attackOn) {
        if (game.playerOneTurn) {
          game.attackDefender('.characterOne', '.characterTwo');
        } else {
          game.attackDefender('.characterTwo', '.characterOne');
        }
      }
    }
    // else if (this.id === 'cancel') game.$moveOptions.hide();
  });
};

game.switchPlayers = function switchPlayers() {
  //checks if players are still on board for endgame

  this.playerOneTurn = !game.playerOneTurn;
  this.turnAttackOff();
  this.turnMagicOff();
  // game.$moveOptions.hide();
  this.clearSquares();
  this.setStatsWindow();
  this.checkMoveDistance();
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
    this.showAvailableSquares('.characterOne');
  } else {
    this.showAvailableSquares('.characterTwo');
  }
};

//checks which squares are available for character to move to based on current position and move stats (see character object)
game.showAvailableSquares = function showAvailableSquares(character) {
  const $characterStartPoint = $(character).attr('id');
  //gets current location from character's current div id
  const characterXStartpoint = parseInt($characterStartPoint[0]);
  const characterYStartPoint = parseInt($characterStartPoint[2]);

  const moveArray = [];
  let i = 0;
  const availableDistance = $(character).attr('moveStats');
  const xDistance = i + characterXStartpoint;
  const yDistance = i + characterYStartPoint;

  //this is a very convoluted way to get every necessary coordinate based on player stats
  //needs major refactoring - main problem is including the right space depending on move stats
  for (i; i <= availableDistance; i++) {
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
      game.characterMovement('.characterOne', e);
    } else {
      game.characterMovement('.characterTwo', e);
    }
  });
};


game.characterMovement = function characterMovement(character, e) {
  const $character = $(character);
  //gets the character position based on id
  //gets id of surrounding squares using character's current cell id
  const characterId = $character.attr('id');
  const upSquare = $(`#${parseInt(characterId[0])-1}-${parseInt(characterId[2])}`);
  const downSquare = $(`#${parseInt(characterId[0])+1}-${parseInt(characterId[2])}`);
  const leftSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) -1}`);
  const rightSquare = $(`#${parseInt(characterId[0])}-${parseInt(characterId[2]) + 1}`);

  if (e.which === 38) {
    game.makeMove(upSquare, $character);
  } else if (e.which === 40) {
    game.makeMove(downSquare, $character);
  } else if (e.which === 39) {
    game.makeMove(rightSquare, $character);
  } else if (e.which === 37) {
    game.makeMove(leftSquare, $character);
  }
};

game.makeMove = function makeMove(direction, character) {
  $('.defender-stats-window').hide();
  if (this.playerOneTurn) {
    this.moveCells('characterOne', direction, character, '.characterTwo');
  } else {
    this.moveCells('characterTwo', direction, character, '.characterOne');
  }
};

//swaps cell classes based on direction key pressed to give illusion of character movement
//available class is related to move stats below
game.moveCells = function moveCells(characterClass, direction, characterObj, defender) {
  const $characterDetails = $(characterObj);
  const $characterName = $characterDetails.attr('name');
  const $characterHp = $characterDetails.attr('hp');
  const $characterMp = $characterDetails.attr('mp');
  const $characterMove = $characterDetails.attr('moveStats');
  const $characterDef = $characterDetails.attr('def');
  const $characterDmg = $characterDetails.attr('dmg');
  const $characterType = $characterDetails.attr('type');
  const $characterPlayer = $characterDetails.attr('player');

  const $defender = $(defender).attr('id');
  const $defenderLeftId = `${parseInt($defender[0]) - 1}-${parseInt($defender[2])}`;
  const $defenderRightId = `${parseInt($defender[0]) + 1}-${parseInt($defender[2])}`;
  const $defenderUpId = `${parseInt($defender[0])}-${parseInt($defender[2]) - 1}`;
  const $defenderDownId = `${parseInt($defender[0])}-${parseInt($defender[2]) + 1}`;

  const $magicLeftId = `${parseInt($defender[0]) - 2}-${parseInt($defender[2])}`;
  const $magicRightId = `${parseInt($defender[0]) + 2}-${parseInt($defender[2])}`;
  const $magicUpId = `${parseInt($defender[0])}-${parseInt($defender[2]) - 2}`;
  const $magicDownId = `${parseInt($defender[0])}-${parseInt($defender[2]) + 2}`;

  const $directionId = $(direction).attr('id');

  this.turnAttackOff();
  this.turnMagicOff();

  if (direction.attr('class') === 'battle-cell available') {
    direction.attr('class', characterClass);
    direction.attr('name', $characterName);
    direction.attr('hp', $characterHp);
    direction.attr('mp', $characterMp);
    direction.attr('movestats', $characterMove);
    direction.attr('def', $characterDef);
    direction.attr('dmg', $characterDmg);
    direction.attr('type', $characterType);
    direction.attr('player', $characterPlayer);

    //removes all attributes except id and then reapplies correct class after
    $characterDetails.each(function() {
      const attributes = $.map(this.attributes, function(item) {
        return item.name;
      });
      const details = $(this);
      $.each(attributes, function(i, item) {
        if (item !== 'id') details.removeAttr(item);
      });
    });
    $characterDetails.attr('class', 'battle-cell available');

  } if ($directionId === $magicLeftId
      || $directionId === $magicRightId
      || $directionId === $magicDownId
      || $directionId === $magicUpId
      && $characterType === 'magic') {
    this.turnMagicOn();
    $('.defender-stats-window').show();
    if ($characterPlayer === 'playerOne') {
      this.displayStats('.characterTwo', 'defence');
    } else {
      this.displayStats('.characterOne', 'defence');
    }
  } else if ($directionId === $defender
      || $directionId === $defenderLeftId
      || $directionId === $defenderRightId
      || $directionId === $defenderDownId
      || $directionId === $defenderUpId) {
    this.turnAttackOn();
    if ($characterType === 'magic') this.turnMagicOn();
    $('.defender-stats-window').show();
    if ($characterPlayer === 'playerOne') {
      this.displayStats('.characterTwo', 'defence');
    } else {
      this.displayStats('.characterOne', 'defence');
    }
  }
};


//BATTLE EVENTS
game.attackOn = false;
game.magicOn = false;

game.turnAttackOn = function turnAttackOn() {
  this.attackOn = true;
  this.$attackOption.css({
    'color': 'white',
    'cursor': 'pointer'
  });
};

game.turnAttackOff = function turnAttackOff() {
  this.attackOn = false;
  this.$attackOption.css({
    'color': 'gray',
    'cursor': 'default'
  });
};

game.turnMagicOn = function turnMagicOn() {
  this.magicOn = true;
  this.$magicOption.css({
    'color': 'white',
    'cursor': 'pointer'
  });
};

game.turnMagicOff = function turnMagicOff() {
  this.magicOn = false;
  this.$magicOption.css({
    'color': 'gray',
    'cursor': 'default'
  });
};


game.attackDefender = function attackDefender(attacker, defender) {
  const attackPower = $(attacker).attr('dmg');
  const defPower = $(defender).attr('def');
  const actualDamage = Math.floor((parseInt(attackPower) * (defPower/.7)));
  let $defenderHP = $(defender).attr('hp');
  $defenderHP = parseInt($defenderHP) - actualDamage;
  $(defender).attr('hp', $defenderHP);
  this.displayDamageMessage(attacker, defender, actualDamage);
  this.checkForDeath(defender);
  this.switchPlayers();
};

game.checkForDeath = function checkForDeath(defender) {
  const $defenderHP = $(defender).attr('hp');
  if (parseInt($defenderHP) <= 0) this.actionOnDeath(defender);
};

game.actionOnDeath = function actionOnDeath(defender) {
  const $deadCharacter = $(defender);
  const $deadCharacterName = $deadCharacter.attr('name');
  const $deadCharacterPlayer = $deadCharacter.attr('player');
  $('#damage-message').html(`${$deadCharacterName} was killed!`);
  $deadCharacter.attr('class', 'battle-cell available');

  //BASIC ENDGAME BIT
  $deadCharacterPlayer === 'playerOne' ? this.playerOneCharactersAlive -= 1 : this.playerTwoCharactersAlive -=1;

  if (this.playerOneCharactersAlive === 0 || this.playerTwoCharactersAlive === 0) {
    $('#damage-message').html('GAME OVER!!');
  }
};

game.displayDamageMessage = function displayDamageMessage(attacker, defender, damage) {
  $('.feedback').show();
  const $messageWindow = $('#damage-message');
  const attackerName = $(attacker).attr('name');
  const defenderName = $(defender).attr('name');
  $messageWindow.html(`${attackerName} attacked ${defenderName} and did ${damage} damage!`);
  setTimeout(function() {
    $('.feedback').hide();
  }, 1200);
};

//STATS DISPLAY WINDOW
game.setStatsWindow = function setStatsWindow() {
  $('.defender-stats-window').hide();
  if (this.playerOneTurn) {
    this.displayStats('.characterOne', 'attack');
  } else {
    this.displayStats('.characterTwo', 'attack');
  }
};

game.displayStats = function displayStats(character, attackOrDefend) {
  const $character = $(character);
  const $nameStat = $character.attr('name');
  const $hpStat = $character.attr('hp');
  const $mpStat = $character.attr('mp');
  const $dmgStat = $character.attr('dmg');
  const $defStat = $character.attr('def');
  const $typeStat = $character.attr('type');

  const initialHP = $hpStat;
  const initialMP = $mpStat;

  let battleType;

  attackOrDefend === 'attack' ? battleType = 'attack' : battleType = 'defend';

  const $nameDisplay = $(`#${battleType}-character-name`);
  $nameDisplay.html(`Name: ${$nameStat}`);

  const $hpDisplay = $(`#${battleType}-hp-stats`);
  $hpDisplay.html(`HP: ${$hpStat}/${initialHP}`);

  const $mpDisplay = $(`#${battleType}-mp-stats`);
  if ($typeStat === 'melee' || $mpStat === undefined) {
    $mpDisplay.hide();
  } else {
    $mpDisplay.show();
    $mpDisplay.html(`MP: ${$mpStat}/${initialMP}`);
  }

  const $dmgDisplay = $(`#${battleType}-dmg-stats`);
  $dmgDisplay.html(`DMG: ${$dmgStat}`);

  const $defDisplay = $(`#${battleType}-def-stats`);
  $defDisplay.html(`DEF: ${$defStat}`);
};

//CHARACTER CLASSES

class BaseCharacter {
  constructor(name, hp, moveStats, def, dmg, type, player) {
    this.name = name;
    this.hp = hp;
    this.moveStats = moveStats;
    this.def = def;
    this.dmg = dmg;
    this.type = type;
    this.player = player;
  }
}

class MagicCharacter extends BaseCharacter {
  constructor(name, hp, mp, moveStats, def, dmg, type, player) {
    super(name, hp, moveStats, def, dmg, type, player);
    this.mp = mp;
  }
}
// class MeleeCharacter extends BaseCharacter {
//   constructor(name, hp, moveStats, def, dmg, type, player) {
//     super(name, hp, moveStats, def, dmg, player);
//   }
// }

const jonSnow = new MagicCharacter('Jon Snow', 10, 3, 6, 4, 7, 'magic', 'playerOne');
const theMountain = new BaseCharacter('The Mountain', 15, 1, 6, 7, 'melee', 'playerTwo');

//THIS SHOULD BE INCREMENTED EVERY INSTANCE OF A CHARACTER
game.playerOneCharactersAlive = 1;
game.playerTwoCharactersAlive = 1;
//GAME INIT

$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  // game.$moveOptions = $('#move-options'); //this needs to be internalised somewhere later
  // game.$moveOptions.hide();
  game.checkMoveDistance();
  game.$attackOption = $('#attack-option');
  game.$magicOption = $('#magic-option');
  game.pickOption();
  game.setStatsWindow('.characterOne');
});
