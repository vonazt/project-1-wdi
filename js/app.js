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

const jonSnow = new MagicCharacter('Jon Snow', 10, 3, 3, 3, 'Ice', 3, 5, 7, 'magic', 'playerOne');
const theMountain = new MeleeCharacter('The Mountain', 15, 1, 4, 7, 'melee', 'playerOne');
const daenerysTargaryen = new MagicCharacter('Daenarys Targaryen', 6, 12, 15, 4, 'Fire', 6, 5, 2, 'magic', 'playerOne');
const tyrionLannister = new MagicCharacter('Tyrion Lannister', 10, 10, 4, 4, 'Ice', 4, 3, 3, 'magic', 'playerOne');
const nedStark = new MeleeCharacter('Ned Stark', 15, 3, 8, 6, 'melee', 'playerOne');

const jorahMormont = new MeleeCharacter('Jorah Mormont', 10, 2, 13, 6, 'melee', 'playerTwo');
const cerseiLannister = new MagicCharacter('Cersei Lannister', 15, 10, 4, 3, 'Ice', 6, 3, 1, 'magic', 'playerTwo');
const theHound = new MeleeCharacter('The Hound', 12, 2, 8, 6, 'melee', 'playerTwo');
const aryaStark = new MagicCharacter('Arya Stark', 10, 9, 3, 3, 'Fire', 6, 6, 5, 'magic', 'playerTwo');
const jaimeLannister = new MeleeCharacter('Jaime Lannister', 14, 4, 7, 6, 'melee', 'playerTwo');

//THIS SHOULD BE INCREMENTED EVERY INSTANCE OF A CHARACTER
game.playerOneCharactersAlive = 5;
game.playerTwoCharactersAlive = 5;


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
  gameGrid[4][1] = 'characterTwo';
  gameGrid[5][1] = 'characterThree';
  gameGrid[6][1] = 'characterFour';
  gameGrid[7][1] = 'characterFive';
  gameGrid[3][8] = 'characterSix';
  gameGrid[4][8] = 'characterSeven';
  gameGrid[5][8] = 'characterEight';
  gameGrid[6][8] = 'characterNine';
  gameGrid[7][8] = 'characterTen';

  return gameGrid;
};

//assigns class attributes in drawBattlefield()
game.cellTypes = {
  characterOne: jonSnow,
  characterTwo: daenerysTargaryen,
  characterThree: tyrionLannister,
  characterFour: theMountain,
  characterFive: nedStark,
  characterSix: jorahMormont,
  characterSeven: cerseiLannister,
  characterEight: theHound,
  characterNine: aryaStark,
  characterTen: jaimeLannister
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
      // $battleSquare.on('click', function() {
      //   console.log($battleSquare);
      // });
      $battleSquare.appendTo('#battle-map');
    });
  });
};


//PLAYER OPTIONS AND TURN SWITCHING
game.playerOneTurn = true; //flag for switching between player turns


game.pickOption = function pickOption() {
  const $option = $('.option'); //selects option window
  $option.on('click', function() {
    if (this.id === 'wait-option') game.switchPlayers();
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

game.switchPlayers = function switchPlayers() {
  //checks if players are still on board for endgame
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

game.canSwitchCharacters = true; //turned to false after player has moved character to prevent leapfrogging across gameboard
//player cannot switch characters after moving

//these are the default starting points to be used when referencing which character to switch to
game.playerOneCharacter = '.characterOne';
game.playerOneCharacterObjectReference = 'characterOne'; //this is called in checkCharacterToSwapTo to get right value in playerCharacterSwitches object
//THESE SHOULD ONLY BE REFERENCED IN TERMS OF MOVEMENT - NOT FOR DESIGNATING DEFENDER
game.playerTwoCharacter = '.characterSix';
game.playerTwoCharacterObjectReference = 'characterSix';

//all the characters and which class they should switch to when tabbing through
game.playerCharacterSwitches = {
  characterOne: '.characterTwo',
  characterTwo: '.characterThree',
  characterThree: '.characterFour',
  characterFour: '.characterFive',
  characterFive: '.characterOne',

  characterSix: '.characterSeven',
  characterSeven: '.characterEight',
  characterEight: '.characterNine',
  characterNine: '.characterTen',
  characterTen: '.characterSix'
};

game.playerCharacterObjectReference = {
  characterOne: 'characterTwo',
  characterTwo: 'characterThree',
  characterThree: 'characterFour',
  characterFour: 'characterFive',
  characterFive: 'characterOne',

  characterSix: 'characterSeven',
  characterSeven: 'characterEight',
  characterEight: 'characterNine',
  characterNine: 'characterTen',
  characterTen: 'characterSix'
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
          game.checkPlayerOneCharacterToSwapTo(game.playerOneCharacterObjectReference);
        } else if (!game.playerOneTurn) {
          game.checkPlayerTwoCharacterToSwapTo(game.playerTwoCharacterObjectReference);
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
    } else {
      game.characterMovement(game.playerTwoCharacter, e);
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
  } else if (direction.attr('player') === 'playerTwo') {
    const $playerOneId = $(game.playerOneCharacter).attr('id');
    game.getDefencePositionsForAttack($playerOneId, game.playerOneCharacter);
  } else if (direction.attr('player') === 'playerOne') {
    const $playerTwoId = $(game.playerTwoCharacter).attr('id');
    game.getDefencePositionsForAttack($playerTwoId, game.playerTwoCharacter);
  }
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
    game.defenderIndex = 0;

    //these are all the up, down, left and right squares of the player
    if ((`${parseInt(id[0]) - 1}-${parseInt(id[2])}` === playerPositionOrMovement
      || `${parseInt(id[0]) + 1}-${parseInt(id[2])}` === playerPositionOrMovement
      || `${parseInt(id[0])}-${parseInt(id[2]) - 1}` === playerPositionOrMovement
      || `${parseInt(id[0])}-${parseInt(id[2]) + 1}` === playerPositionOrMovement)
      ||
      ($characterType === 'magic'
        && (`${parseInt(id[0]) - 2}-${parseInt(id[2])}` === playerPositionOrMovement
        || `${parseInt(id[0]) + 2}-${parseInt(id[2])}` === playerPositionOrMovement
        || `${parseInt(id[0])}-${parseInt(id[2]) - 2}` === playerPositionOrMovement
        || `${parseInt(id[0])}-${parseInt(id[2]) + 2}` === playerPositionOrMovement))) {
      game.defenderPosition.push('.' + itemClass); //makes string into a class for displaying defender stats and making attack
      game.turnAttackOn();
      if ($characterType === 'magic') game.turnMagicOn($characterMP);

      $('.defender-stats-window').show();
      if (game.defenderPosition.length > 1) {
        $(document).on('keydown', function(e) {
          //this entire if statement is checking if a player is surrounded - if they are then they can switch the selected defender by pressing 's'
          if (e.which === 83) {
            game.defenderIndex++;
            if (game.defenderIndex === game.defenderPosition.length) game.defenderIndex = 0;
            game.displayStats(game.defenderPosition[game.defenderIndex], 'defence');
          }
        });
      } else {
        game.displayStats(game.defenderPosition[game.defenderIndex], 'defence');
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
  const magicDamage = Math.ceil((parseInt(spellPower) / (magicResistance*0.6)));

  //sets the amount the defender's def or dmg is decreased relative to def stat and spell power - NEEDS TWEAKING
  let statDamage = Math.ceil(parseInt(magicResistance) / (parseInt(spellPower*0.9)));
  statDamage = parseInt(magicResistance) - statDamage;
  defenderDmgStat = parseInt(defenderDmgStat) - statDamage;

  let $defenderHP = $(defender).attr('hp');
  $defenderHP = parseInt($defenderHP) - magicDamage;
  $(defender).attr('hp', $defenderHP);

  //sets whether def or dmg stat is affected depending on magic type
  if (magic === 'Fire') {
    $(defender).attr('def', magicResistance);
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

  const actualDamage = Math.ceil((parseInt(attackPower) / (defPower*0.4)));
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
  $('#damage-message').html(`${$deadCharacterName} was killed!`);
  $deadCharacter.attr('class', 'battle-cell available');

  //BASIC ENDGAME BIT
  $deadCharacterPlayer === 'playerOne' ? this.playerOneCharactersAlive -= 1 : this.playerTwoCharactersAlive -=1;

  if (this.playerOneCharactersAlive === 0 || this.playerTwoCharactersAlive === 0) {
    $('#damage-message').html('GAME OVER!!');
  }
};


//STATS DISPLAY WINDOW
game.setStatsWindow = function setStatsWindow() {
  $('.defender-stats-window').hide();
  this.playerOneTurn ? this.displayStats(this.playerOneCharacter, 'attack') : this.displayStats(this.playerTwoCharacter, 'attack');
};

game.displayStats = function displayStats(character, attackOrDefend) {
  const $character = $(character);
  // const characterClass = $character.attr('class');
  const $nameStat = $character.attr('name');
  const $hpStat = $character.attr('hp');
  const $mpStat = $character.attr('mp');
  const $mgDmgStat = $character.attr('mgdmg');
  const $mgTypeStat = $character.attr('magicType');
  const $mgCostStat = $character.attr('spellCost');
  const $dmgStat = $character.attr('dmg');
  const $defStat = $character.attr('def');
  const $typeStat = $character.attr('type');

  // game.cellTypes.characterOne.mp
  // const initialHP = game.cellTypes[characterClass].hp;
  // const initialMP = game.cellTypes[characterClass].mp;

  let battleType;
  //
  attackOrDefend === 'attack' ? battleType = 'attack' : battleType = 'defend';

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
    $mpDisplay.html(`MP: ${$mpStat}`);
    $mgDmgDisplay.show();
    $mgDmgDisplay.html(`MAGIC DMG: ${$mgDmgStat}`);
    $mgTypeDisplay.show();
    $mgDmgDisplay.html(`Type: ${$mgTypeStat} | Cost: ${$mgCostStat}MP`);
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


  // $('.gameboard').hide();
  // $('.options-display').hide();
  // $('.attacker-stats-window').hide();
  // $('.defender-stats-window').hide();
  // game.hideOpeningCredits();

});
