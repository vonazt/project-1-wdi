const game = {};

//CHARACTER CONSTRUCTOR CLASSES

class BaseCharacter {
  constructor(name, hp, moveStats, def, dmg, type, player) {
    this.name = name;
    this.hp = hp;
    this.moveStats = moveStats;
    this.def = def;
    this.dmg = dmg;
    this.type = type;
    this.player = player;
    this.isDead = false;
  }
}

class MagicCharacter extends BaseCharacter {
  constructor(name, hp, mp, mgdmg, spellCost, magicType, moveStats, def, dmg, type, player) {
    super(name, hp, moveStats, def, dmg, type, player);
    this.mp = mp;
    this.mgdmg = mgdmg;
    this.spellCost = spellCost;
    this.magicType = magicType;
  }
}
class MeleeCharacter extends BaseCharacter {
  constructor(name, hp, moveStats, def, dmg, type, player) {
    super(name, hp, moveStats, def, dmg, type, player);
  }
}

const jonSnow = new MagicCharacter('Jon Snow', 10, 3, 12, 3, 'Ice', 3, 5, 15, 'magic', 'playerOne');
const theMountain = new MeleeCharacter('The Mountain', 15, 1, 6, 20, 'melee', 'playerOne');
const daenerysTargaryen = new MagicCharacter('Daenarys Targaryen', 6, 16, 20, 4, 'Fire', 5, 5, 2, 'magic', 'playerOne');
const tyrionLannister = new MagicCharacter('Tyrion Lannister', 10, 10, 12, 4, 'Ice', 4, 6, 5, 'magic', 'playerOne');
const nedStark = new MeleeCharacter('Ned Stark', 15, 3, 5, 15, 'melee', 'playerOne');
const melissandre = new MagicCharacter('Melissandre', 8, 12, 18, 4, 'Fire', 3, 5, 5, 'magic', 'playerOne');

const jorahMormont = new MeleeCharacter('Jorah Mormont', 10, 2, 5, 16, 'melee', 'playerTwo');
const cerseiLannister = new MagicCharacter('Cersei Lannister', 9, 12, 15, 3, 'Ice', 4, 4, 1, 'magic', 'playerTwo');
const theHound = new MeleeCharacter('The Hound', 12, 2, 5, 14, 'melee', 'playerTwo');
const aryaStark = new MagicCharacter('Arya Stark', 10, 6, 12, 3, 'Fire', 6, 5, 11, 'magic', 'playerTwo');
const jaimeLannister = new MeleeCharacter('Jaime Lannister', 14, 4, 6, 16, 'melee', 'playerTwo');
const whiteWalker = new MagicCharacter('White Walker', 15, 10, 18, 5, 'Ice', 2, 4, 15, 'magic', 'playerTwo');

//THIS SHOULD BE INCREMENTED EVERY INSTANCE OF A CHARACTER
game.playerOneCharactersAlive = 6;
game.playerTwoCharactersAlive = 6;


//GAME SETUP

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
  gameGrid[3][1] = 'characterOne';
  gameGrid[3][0] = 'characterTwo';
  gameGrid[4][1] = 'characterThree';
  gameGrid[4][0] = 'characterFour';
  gameGrid[5][1] = 'characterFive';
  gameGrid[5][0] = 'characterSix';
  gameGrid[3][8] = 'characterSeven';
  gameGrid[3][9] = 'characterEight';
  gameGrid[4][8] = 'characterNine';
  gameGrid[4][9] = 'characterTen';
  gameGrid[5][8] = 'characterEleven';
  gameGrid[5][9] = 'characterTwelve';

  return gameGrid;
};

//assigns class attributes in drawBattlefield()
game.cellTypes = {
  characterOne: jonSnow,
  characterTwo: daenerysTargaryen,
  characterThree: tyrionLannister,
  characterFour: theMountain,
  characterFive: nedStark,
  characterSix: melissandre,
  characterSeven: jorahMormont,
  characterEight: cerseiLannister,
  characterNine: theHound,
  characterTen: aryaStark,
  characterEleven: jaimeLannister,
  characterTwelve: whiteWalker
};

game.drawBattlefield = function drawBattlefield() {
  const battlegrid = this.createGameGrid();
  $.each(battlegrid, (i, row) => {
    $.each(row, (j, cell) => {
      //fills grid with divs
      //if cell is a string, then it assigns the cell a character based on its character number and object by referencing the cellTypes object above
      //defaults to .battle-cell class otherwise
      const $battleSquare = $('<div />');
      if (typeof cell === 'string') {
        $battleSquare.addClass(cell).attr(game.cellTypes[cell]);
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

game.canSwitchCharacters = true; //turned to false after player has moved character to prevent leapfrogging across gameboard
//player cannot switch characters after moving

//these are the default starting points to be used when referencing which character to switch to
game.playerOneCharacter = '.characterOne';
game.playerOneCharacterObjectReference = 'characterOne'; //this is called in checkCharacterToSwapTo to get right value in playerCharacterSwitches object
//THESE SHOULD ONLY BE REFERENCED IN TERMS OF MOVEMENT - NOT FOR DESIGNATING DEFENDER
game.playerTwoCharacter = '.characterSeven';
game.playerTwoCharacterObjectReference = 'characterSeven';

//all the characters and which class they should switch to when tabbing through
game.playerCharacterSwitches = {
  characterOne: '.characterTwo',
  characterTwo: '.characterThree',
  characterThree: '.characterFour',
  characterFour: '.characterFive',
  characterFive: '.characterSix',
  characterSix: '.characterOne',

  characterSeven: '.characterEight',
  characterEight: '.characterNine',
  characterNine: '.characterTen',
  characterTen: '.characterEleven',
  characterEleven: '.characterTwelve',
  characterTwelve: '.characterSeven'
};

game.playerCharacterObjectReference = {
  characterOne: 'characterTwo',
  characterTwo: 'characterThree',
  characterThree: 'characterFour',
  characterFour: 'characterFive',
  characterFive: 'characterSix',
  characterSix: 'characterOne',

  characterSeven: 'characterEight',
  characterEight: 'characterNine',
  characterNine: 'characterTen',
  characterTen: 'characterEleven',
  characterEleven: 'characterTwelve',
  characterTwelve: 'characterSeven'
};

//references the objects above and changes the current selected character accordingly
game.checkPlayerOneCharacterToSwapTo = function checkPlayerOneCharacterToSwapTo(currentCharacter) {
  this.playerOneCharacter = this.playerCharacterSwitches[currentCharacter];
  this.playerOneCharacterObjectReference = this.playerCharacterObjectReference[currentCharacter];
};

//these two need to be separate because of need for different starting points at beginning of player turn

game.checkPlayerTwoCharacterToSwapTo = function checkPlayerTwoCharacterToSwapTo(currentCharacter) {
  this.playerTwoCharacter = this.playerCharacterSwitches[currentCharacter];
  this.playerTwoCharacterObjectReference = this.playerCharacterObjectReference[currentCharacter];
};


game.switchCharacter = function switchCharacter() {
  $(document).on('keydown', function(e) {
    if (e.which === 9) {
      e.preventDefault(); //stops tab from moving around the window
      if (game.canSwitchCharacters) {
        if (game.playerOneTurn) {
          //switches character according to what the characterObjectReference is
          $('#selected-attacker').removeClass(game.playerOneCharacterObjectReference);
          game.checkPlayerOneCharacterToSwapTo(game.playerOneCharacterObjectReference);
          $('#selected-attacker').addClass(game.playerOneCharacterObjectReference);
        } else if (!game.playerOneTurn) {
          $('#selected-attacker').removeClass(game.playerTwoCharacterObjectReference);
          game.checkPlayerTwoCharacterToSwapTo(game.playerTwoCharacterObjectReference);
          $('#selected-attacker').addClass(game.playerTwoCharacterObjectReference);
        }
        //these loops are necessary to make sure that a dead character isn't selected while switching characters - don't ask me why
        for (let i=1; i < 6; i++) {
          if ($(game.playerTwoCharacter).attr('class').includes('dead')) {
            game.checkPlayerTwoCharacterToSwapTo(game.playerTwoCharacterObjectReference);
          }
        }

        for (let j=1; j < 6; j++) {
          if ($(game.playerOneCharacter).attr('class').includes('dead')) {
            game.checkPlayerOneCharacterToSwapTo(game.playerOneCharacterObjectReference);
          }
        }
        //resets all the movement, display stats and available spaces while tabbing through characters
        game.turnAttackOff();
        game.turnMagicOff();
        game.clearSquares();
        game.setStatsWindow();
        //these are so a character doesn't have to move if already adjacent to a defender
        const $playerOneId = $(game.playerOneCharacter).attr('id');
        const $playerTwoId = $(game.playerTwoCharacter).attr('id');
        game.playerOneTurn ? game.getDefencePositionsForAttack($playerOneId) : game.getDefencePositionsForAttack($playerTwoId);
        game.checkMoveDistance();
      }
    }
  });
};

game.switchPlayers = function switchPlayers() {
  // if ($(this.playerOneCharacter).attr('class').includes('dead')) {
  //   game.checkPlayerOneCharacterToSwapTo(game.playerOneCharacterObjectReference);
  // }
  // if ($(this.playerTwoCharacter).attr('class').includes('dead')) {
  //   game.checkPlayerTwoCharacterToSwapTo(game.playerTwoCharacterObjectReference);
  // }
  if (this.playerOneTurn){
    $('#selected-attacker').removeClass(game.playerOneCharacterObjectReference);
    $('#selected-attacker').addClass(game.playerTwoCharacterObjectReference);
  }
  this.canSwitchCharacters = true; //resets canSwitchCharacters flag so that players can tab through character select
  this.playerOneTurn = !game.playerOneTurn; //flag that switches player control
  this.turnAttackOff(); //resets Attack in options window to gray
  this.turnMagicOff();
  this.clearSquares();
  this.setStatsWindow();

  const $playerOneId = $(this.playerOneCharacter).attr('id');
  const $playerTwoId = $(this.playerTwoCharacter).attr('id');
  this.playerOneTurn ? this.getDefencePositionsForAttack($playerOneId, this.playerOneCharacter) : this.getDefencePositionsForAttack($playerTwoId, this.playerTwoCharacter);
  this.checkMoveDistance();
};

game.pickOption = function pickOption() {
  const $option = $('.option'); //selects option window
  $option.on('click', function() {
    if (this.id === 'wait-option') {
      if (this.playerOneTurn) {
        $('#selected-attacker').removeClass(game.playerOneCharacterObjectReference);
        $('#selected-attacker').addClass(game.playerTwoCharacterObjectReference);
        console.log(game.playerTwoCharacterObjectReference);
      } else if (!this.playerOneTurn) {
        $('#selected-attacker').removeClass(game.playerTwoCharacterObjectReference);
        $('#selected-attacker').addClass(game.playerOneCharacterObjectReference);
        console.log(game.playerOneCharacterObjectReference);
      }
      game.switchPlayers();
    }
    if (this.id === 'attack-option') {
      if (game.attackOn) { //flag for checking that attacker is in range of defender
        if (game.playerOneTurn) {
          //NEED REFERENCE FUNCTION TO MAKE SURE THAT game.playerOneCharacter AND game.playerTwoCharacter are correct
          game.attackDefender(game.playerOneCharacter, game.defenderPosition[game.defenderIndex]); //this is set below in makeMove()
        } else {
          game.attackDefender(game.playerTwoCharacter, game.defenderPosition[game.defenderIndex]);
        }
      }
    } if (this.id === 'magic-option') {
      if (game.magicOn) { //flag for checking that attacker is in magic range
        if (game.playerOneTurn) {
          //NEED REFERENCE FUNCTION TO MAKE SURE THAT game.playerOneCharacter AND game.playerTwoCharacter are correct
          game.castMagic(game.playerOneCharacter, game.defenderPosition[game.defenderIndex]);
        } else {
          game.castMagic(game.playerTwoCharacter, game.defenderPosition[game.defenderIndex]);
        }
      }
    }
  });
};

//resets available squares each time characters or players switch
game.clearSquares = function clearSquares() {
  const $availableSquares = $('.available');
  $availableSquares.toggleClass('available');
};

//CHARACTER MOVEMENT

game.checkMoveDistance = function checkMoveDistance() {
  if (this.playerOneTurn) {
    this.showAvailableSquares(this.playerOneCharacter);
  } else {
    this.showAvailableSquares(this.playerTwoCharacter);
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
      game.characterMovement(game.playerOneCharacter, e);
      $('#selected-attacker').addClass(game.playerOneCharacterObjectReference);
    } else {
      game.characterMovement(game.playerTwoCharacter, e);
      $('#selected-attacker').addClass(game.playerTwoCharacterObjectReference);
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
  game.canSwitchCharacters = false; //switches flag so player can no longer tab through characters to prevent leapfrogging
  $('.defender-stats-window').hide();
  if (this.playerOneTurn) {
    //playerCharacterObjectReference has to be passed because of selector in moveCells() that requires 'character', not .'character'
    //this.playerTwoCharacter is wrong - there needs to be a check as to which character is the adjacent one
    this.moveCells(this.playerOneCharacterObjectReference, direction, character);
  } else {
    this.moveCells(this.playerTwoCharacterObjectReference, direction, character);
  }
};

//swaps cell classes based on direction key pressed to give illusion of character movement
//available class is related to move stats below
game.moveCells = function moveCells(characterClass, direction, characterObj) {
  //all these variables are necessary for passing character attributes between divs - not sure how to refactor these
  const $characterDetails = $(characterObj);
  const $characterName = $characterDetails.attr('name');
  const $characterHp = $characterDetails.attr('hp');
  const $characterMp = $characterDetails.attr('mp');
  const $characterMgdmg = $characterDetails.attr('mgdmg');
  const $characterSpellCost = $characterDetails.attr('spellCost');
  const $characterMagicType = $characterDetails.attr('magicType');
  const $characterMove = $characterDetails.attr('moveStats');
  const $characterDef = $characterDetails.attr('def');
  const $characterDmg = $characterDetails.attr('dmg');
  const $characterType = $characterDetails.attr('type');
  const $characterPlayer = $characterDetails.attr('player');
  const $characterIsDead = $characterDetails.attr('isDead');

  const $directionId = $(direction).attr('id');

  this.turnAttackOff();
  this.turnMagicOff();

  //passes all the character's attributes from one div into the one being moved into
  if (direction.attr('class') === 'battle-cell available') {
    direction.attr('class', characterClass);
    direction.attr('name', $characterName);
    direction.attr('hp', $characterHp);
    direction.attr('mp', $characterMp);
    direction.attr('mgdmg', $characterMgdmg);
    direction.attr('spellCost', $characterSpellCost);
    direction.attr('magicType', $characterMagicType);
    direction.attr('movestats', $characterMove);
    direction.attr('def', $characterDef);
    direction.attr('dmg', $characterDmg);
    direction.attr('type', $characterType);
    direction.attr('player', $characterPlayer);
    direction.attr('isDead', $characterIsDead);

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
    this.playerOneTurn ? this.getDefencePositionsForAttack($directionId, game.playerOneCharacter) : this.getDefencePositionsForAttack($directionId, game.playerTwoCharacter);
  }
  //THIS CREATES A GAME-KILLING BUG
  // else if (direction.attr('player') === 'playerTwo') {
  //   const $playerOneId = $(game.playerOneCharacter).attr('id');
  //   game.getDefencePositionsForAttack($playerOneId, game.playerOneCharacter);
  // } else if (direction.attr('player') === 'playerOne') {
  //   const $playerTwoId = $(game.playerTwoCharacter).attr('id');
  //   game.getDefencePositionsForAttack($playerTwoId, game.playerTwoCharacter);
  // }
};

game.getDefencePositionsForAttack = function getDefencePositionsForAttack(playerPositionOrMovement, character) {
  const $characterType = $(character).attr('type');
  const $characterMP = $(character).attr('mp');
  game.defenderPosition = []; //this is what's referred to for attack function
  let $defenderPositions;
  this.playerOneTurn ? $defenderPositions = $("div[player*='playerTwo']") : $defenderPositions = $("div[player*='playerOne']"); //searches by attribute so only opposition characters will be selected for attack
  //iterates through all these oppostion characters and sees if they match
  $defenderPositions.each(function() {
    const id = this.id;
    const itemClass = this.className;
    if (!itemClass.includes('dead')) { //this is so dead characters don't display

      game.defenderIndex = 0;

      //these are all the up, down, left and right squares of the player
      if (`${parseInt(id[0]) - 1}-${parseInt(id[2])}` === playerPositionOrMovement
        || `${parseInt(id[0]) + 1}-${parseInt(id[2])}` === playerPositionOrMovement
        || `${parseInt(id[0])}-${parseInt(id[2]) - 1}` === playerPositionOrMovement
        || `${parseInt(id[0])}-${parseInt(id[2]) + 1}` === playerPositionOrMovement) {
        game.defenderPosition.push('.' + itemClass);
        game.turnAttackOn();
        if ($characterType === 'magic') game.turnMagicOn($characterMP);
        $('.defender-stats-window').show();
        if (game.defenderPosition.length > 1) {
          $(document).on('keydown', function(e) {
            if (e.which === 83) {
              game.defenderIndex++;
              if (game.defenderIndex >= game.defenderPosition.length) game.defenderIndex = 0;
              game.displayStats(game.defenderPosition[game.defenderIndex], 'defence');
            }
          });
        } else {
          game.displayStats(game.defenderPosition[game.defenderIndex], 'defence');
        }
      }
    }
  });
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

game.turnMagicOn = function turnMagicOn(attackerMP) {
  if (parseInt(attackerMP) > 0) {
    this.magicOn = true;
    this.$magicOption.css({
      'color': 'white',
      'cursor': 'pointer'
    });
  }
};

game.turnMagicOff = function turnMagicOff() {
  this.magicOn = false;
  this.$magicOption.css({
    'color': 'gray',
    'cursor': 'default'
  });
};

game.castMagic = function castMagic(attacker, defender, magic) {
  const attackType = 'magic'; //for displayDamageMessage() below
  const spellPower = $(attacker).attr('mgdmg');
  const spellCost = $(attacker).attr('spellCost');
  let mp = $(attacker).attr('mp');
  magic = $(attacker).attr('magicType');
  const magicResistance = $(defender).attr('def');
  let defenderDmgStat = $(defender).attr('dmg');

  //sets the amount of hp that is taken off by spell, weighted by defender's def stat
  const magicDamage = Math.floor(parseInt(spellPower) * (1 / (magicResistance - 1)));

  //sets the amount the defender's def or dmg is decreased relative to def stat and spell power - NEEDS TWEAKING
  const statDamage = Math.floor(parseInt(spellPower) * (0.8 / (magicResistance - 0.8)));
  let defDamage = parseInt(magicResistance) - statDamage;
  if (defDamage < 1) defDamage = 1;
  defenderDmgStat = parseInt(defenderDmgStat) - statDamage;
  if (defenderDmgStat < 1) defenderDmgStat = 1;
  let $defenderHP = $(defender).attr('hp');
  $defenderHP = parseInt($defenderHP) - magicDamage;
  $(defender).attr('hp', $defenderHP);

  //sets whether def or dmg stat is affected depending on magic type
  if (magic === 'Fire') {
    $(defender).attr('def', defDamage);
  } else if (magic === 'Ice') {
    $(defender).attr('dmg', defenderDmgStat);
  }

  //reduces the attacker's mp by amount of spell cost
  mp = parseInt(mp) - parseInt(spellCost);
  $(attacker).attr('mp', mp);

  this.displayDamageMessage(attackType, attacker, defender, magicDamage, magic, statDamage);
  this.checkForDeath(defender);
  this.switchPlayers();
};

game.attackDefender = function attackDefender(attacker, defender) {
  const attackType = 'attack';
  const attackPower = $(attacker).attr('dmg');
  const defPower = $(defender).attr('def');

  const actualDamage = Math.floor(parseInt(attackPower) * (1 / (defPower - 1)));
  let $defenderHP = $(defender).attr('hp');
  $defenderHP = parseInt($defenderHP) - actualDamage;
  $(defender).attr('hp', $defenderHP);

  this.displayDamageMessage(attackType, attacker, defender, actualDamage);
  this.checkForDeath(defender);
  this.switchPlayers();
};

//condense into one function
game.displayDamageMessage = function displayDamageMessage(attackType, attacker, defender, damage,  magic, statDamage) {
  $('.feedback').show();
  const $messageWindow = $('#damage-message');
  const attackerName = $(attacker).attr('name');
  const defenderName = $(defender).attr('name');
  if (attackType === 'attack') {
    $messageWindow.html(`${attackerName} attacked ${defenderName} and did ${damage} damage!`);
    setTimeout(function() {
      $('.feedback').hide();
    }, 2000);
  } else if (attackType === 'magic') {
    let statType;
    magic === 'Fire' ? statType = 'DEF' : statType = 'DMG';
    $messageWindow.html(`${attackerName} cast ${magic} and did ${damage} damage to ${defenderName}. ${defenderName}'s ${statType} decreased by ${statDamage}!`);
    setTimeout(function() {
      $('.feedback').hide();
    }, 3000);
  }
};

game.checkForDeath = function checkForDeath(defender) {
  const $defenderHP = $(defender).attr('hp');
  if (parseInt($defenderHP) <= 0) this.actionOnDeath(defender);
};

//THIS IS CURRENTLY BREAKING THE GAME BECAUSE IT CAN'T FIND THE CHARACTER
game.actionOnDeath = function actionOnDeath(defender) {
  const $deadCharacter = $(defender);
  const $deadCharacterName = $deadCharacter.attr('name');
  const $deadCharacterPlayer = $deadCharacter.attr('player');
  let $deadCharacterIsDead = $deadCharacter.attr('isDead');
  $deadCharacterIsDead = $deadCharacter.attr('isDead', true);
  const defenderObject = defender.substr(1);
  game.cellTypes[defenderObject].isDead = true;


  $('#damage-message').html(`${$deadCharacterName} was killed!`);
  $deadCharacter.addClass('dead');


  //BASIC ENDGAME BIT
  $deadCharacterPlayer === 'playerOne' ? this.playerOneCharactersAlive -= 1 : this.playerTwoCharactersAlive -=1;
  if (this.playerOneCharactersAlive === 0 || this.playerTwoCharactersAlive === 0) {
    $('#damage-message').html('GAME OVER!!');
  }
};


//STATS DISPLAY WINDOW
game.setStatsWindow = function setStatsWindow() {
  if ($(this.playerOneCharacter).attr('class').includes('dead')) {
    game.checkPlayerOneCharacterToSwapTo(game.playerOneCharacterObjectReference);
  }
  if ($(this.playerTwoCharacter).attr('class').includes('dead')) {
    game.checkPlayerTwoCharacterToSwapTo(game.playerTwoCharacterObjectReference);
  }
  $('.defender-stats-window').hide();
  this.playerOneTurn ? this.displayStats(this.playerOneCharacter, 'attack') : this.displayStats(this.playerTwoCharacter, 'attack');
};

game.displayStats = function displayStats(character, attackOrDefend) {
  //sets which character image will be displayed in defender window
  if (attackOrDefend === 'defence') {
    const defenderObjectRef = character.substr(1);
    $('#selected-defender').removeClass();
    $('#selected-defender').addClass(defenderObjectRef);
  }

  const $character = $(character);
  // const characterClass = $character.attr('class');
  const $nameStat = $character.attr('name');
  const $hpStat = $character.attr('hp');
  let $mpStat = $character.attr('mp');
  const $mgDmgStat = $character.attr('mgdmg');
  const $mgTypeStat = $character.attr('magicType');
  const $mgCostStat = $character.attr('spellCost');
  const $dmgStat = $character.attr('dmg');
  const $defStat = $character.attr('def');
  const $typeStat = $character.attr('type');
  const $isDead = $character.attr('isdead');

  // game.cellTypes.characterOne.mp
  // const initialHP = game.cellTypes[characterClass].hp;
  // const initialMP = game.cellTypes[characterClass].mp;

  let battleType;
  //
  attackOrDefend === 'attack' ? battleType = 'attack' : battleType = 'defend';
  // battleType = attackOrDefend === 'attack' ? 'attack' : 'defend';

  const $nameDisplay = $(`#${battleType}-character-name`);
  $nameDisplay.html(`Name: ${$nameStat}`);

  const $hpDisplay = $(`#${battleType}-hp-stats`);
  $hpDisplay.html(`HP: ${$hpStat}`);

  const $mpDisplay = $(`#${battleType}-mp-stats`);
  const $mgDmgDisplay = $(`#${battleType}-mg-dmg-stats`);
  const $mgTypeDisplay = $(`#${battleType}-mg-type-stats`);

  if ($typeStat === 'melee' || !$mpStat) {
    $mpDisplay.hide();
    $mgDmgDisplay.hide();
    $mgTypeDisplay.hide();
  } else {
    $mpDisplay.show();
    if (parseInt($mpStat) < 0) $mpStat = 0;
    $mpDisplay.html(`MP: ${$mpStat}`);
    $mgDmgDisplay.show();
    $mgDmgDisplay.html(`M. DMG: ${$mgDmgStat}`);
    $mgTypeDisplay.show();
    $mgTypeDisplay.html(`Type: ${$mgTypeStat} | Cost: ${$mgCostStat}MP`);
  }

  const $dmgDisplay = $(`#${battleType}-dmg-stats`);
  $dmgDisplay.html(`DMG: ${$dmgStat}`);

  const $defDisplay = $(`#${battleType}-def-stats`);
  $defDisplay.html(`DEF: ${$defStat}`);
};

//GAME INIT
game.hideOpeningCredits = function hideOpeningCredits() {
  const $gameTitle = $('.game-title');
  const $startButton = $('#start-button');
  $startButton.on('click', function() {
    $('.gameboard').show();
    $('.options-display').show();
    $('.attacker-stats-window').show();
    $('nav').hide();
    $gameTitle.css({
      'font-size': '3em',
      'margin-bottom': '10px'
    });
  });
};

$(() => {
  game.drawBattlefield();
  game.moveCharacter();
  // game.$moveOptions = $('#move-options'); //this needs to be internalised somewhere later
  // game.$moveOptions.hide();
  game.checkMoveDistance();
  game.switchCharacter();
  game.$attackOption = $('#attack-option');
  game.$magicOption = $('#magic-option');
  game.pickOption();
  game.setStatsWindow(game.playerOneCharacter);

  $('#selected-attacker').addClass(game.playerOneCharacterObjectReference);
  // $('.gameboard').hide();
  // $('.options-display').hide();
  // $('.attacker-stats-window').hide();
  // $('.defender-stats-window').hide();
  // game.hideOpeningCredits();

});
