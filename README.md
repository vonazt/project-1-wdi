## WDI 34 Project 1 - Game of Shining Thrones
### Client-based game
##### by Richard Tzanov

<p align="left"><img src="https://i.imgur.com/ou6DZvu.png" width="1000"></p>

The brief for this project was to build a browser-based game using HTML, CSS and JavaScript within a week.
The game I created is Game of Shining Thrones. It is a turn-based strategy game for two players that was inspired by the Shining Force series of games I loved playing as a child (and also from the Game of Thrones series for its aesthetic design).

The app is deployed on [Github ](https://vonazt.github.io/wdi-1-project/)

#### Game description

Game of Shining Thrones uses a 10 x 10 grid that is filled with six characters on each player's team.
<p align="left"><img src="https://i.imgur.com/7uxhldA.png" width="500"></p>

The initial challenge was placing a character on the board and having them move in any direction around the board. This was a surprisingly challenging problem and one I solved by having each div literally swap its class with the character's - that is, every time the player presses an arrow key to move, a series of functions check the class of div of the cell that the character is trying to move into, and then swap classes between the divs, giving the illusion of movement. Each cell has an x, y coordinate designated by its id that is assigned when the battlefield is initially created at the beginning of the game.

<p align="left"><img src="https://i.imgur.com/gB1me7b.png" width="1000"></p>

The next challenge was limiting the number of spaces a character could move on each turn. This was done for gameplay reasons so that players would have to plan how far to move their characters and make strategic choices. Each character has a specific move stat that dictates how far they can move on each turn.

My solution to this was to create an array and fill it with the cells that are within a certain range of the character's initial starting coordinate (their current cell id) and add the class 'available' to those cells. This means that when the character tries to move into a cell, it must have the class 'available', otherwise the 'div class swap' won't happen. The available squares are highlighted in white to let the player know the movement range of their character.

<p align="left"><img src="https://i.imgur.com/ptxCm8G.png" width="1000"></p>

And the code in action:

<p align="left"><img src="https://i.imgur.com/yKYIS8Z.gif" width="1000"></p>

Putting two characters - one for each player - on the battlefield and swapping between players at the end of each turn was an easy step. It simply required the use of a playerOneTurn flag which is then checked in all the functions that display attacker stats and available squares and displays accordingly.

Fundamental to Game of Shining Thrones is the ability for opposition players to attack each other. From the beginning, I wanted to have two kinds of attack: normal attack, which would take place when characters were in adjacent squares, and magic, which would be a ranged attack from two squares distance.

<p align="left"><img src="https://i.imgur.com/bXQDXXb.gif" width="1000"></p>

The implementation of this when there was just one character on the battlefield for each player was relatively simple. In a similar way to how the availableSquares function works, every time a character moves, the getDefencePositionsForAttack function checks all the surrounding squares for an opposing player based on their id coordinates - if there is a defender in an adjacent square then it makes the Attack option light up, which allows the player to click on it and activate the attackDefender function. Similarly, if a defender is within two squares, the Magic option will light up, which in turn makes the castMagic function available. From there it was simply a case of calculating how much damage an attack or spell would do based on the defender's defence (DEF) stat and the attacker's damage (DMG) stat and subtracting the result from the defender's health (HP). Magic attacks also decrement the defender's DMG or DEF stats depending on the magic type (Ice or Fire) and deplete the attacker's MP - all of these things have to be calculated every time a spell is cast.

With only one character on each side, all of this was relatively simple and functioned as I wanted it to. Things became a lot more complicated when I added multiple characters to each side.

<p align="left"><img src="https://i.imgur.com/dJDrO0y.png" width="1000"></p>

(N.B. - this is a good example of the kind of overengineered code that I discuss below that I would like to refactor once my JS knowledge has improved.)

Giving players the ability to swap between characters was essential to the strategic core for the game, and implementing the initial switchCharacter function was relatively simple. Every character class (characterOne, characterTwo, etc) is a key in an object, with the corresponding value being the next character to switch to (e.g., `{characterOne: '.characterTwo'}`). When the player switches character, the function checks the playerCharacter object and then uses that to fill in the corresponding functions to do with movement and stats window display.

The challenge came in incorporating this setup into attack and defence and making sure that the right attacker/defender displayed in the stats windows. This involved a lot of rewriting and refactoring of functions to make sure that the game worked properly. Having the playerCharacter object helped a lot with streamlining the process, but it was also a challenge making sure that options were displayed correctly and led to a lot of bugs, both big and small.

<p align="left"><img src="https://i.imgur.com/I3XlNC3.png" width="700"></p>
<p align="left"><img src="https://i.imgur.com/dBXNUYT.png" width="1000"></p>

And in action:
<p align="left"><img src="https://i.imgur.com/T7uoWCY.gif" width="1000"></p>

Being able to select between defenders when more than one is in range required rewriting the getDefencePositionsForAttack function to include an array that would hold all the available defender positions, and then allow the player to cycle through them by pressing 'S', which would increment an index counter.

This caused a problem of how to incorporate both Attack and Magic, as both were checking for defenders at different positions but the `getDefencePositionsForAttack` function was populating the same array with both sets of defenders, meaning that a Magic character could Attack from two squares away. I tried multiple solutions to this, including using `.concat()` on two separate arrays and separating the `getDefencePositionsForAttack` into two separate functions for Attack and Magic, but could not get the game to function as intended. In the end, I compromised by making it so that Magic characters can only cast Magic and not Attack at all. This is not the ideal fix, and is something I would like to come back to in the future.

Another challenge was getting the available defenders to display correctly - currently the character has to move back and forth to make sure that they can switch between all the defenders. So far, attempted solutions to this problem have caused more bugs in terms of attackers being able to select defenders across the battlefield, and the current setup is a compromise that I hope to fix.

The final, and biggest, challenge was dealing with events when a character dies. Due to the foundations of the game relying on divs having the character classes (i.e., '.characterOne', etc) and all their associated attributes, simply removing the dead character's div class from the gameboard causes all the functions checking for the character class to malfunction. I spent hours working on multiple solutions, including adding the object flag isDead, adding the attribute 'isDead' and various other solutions, none of which worked. In the end, I settled on adding the class 'dead' and assigning that a gravestone image in the CSS.

<p align="left"><img src="https://i.imgur.com/V6Dpw4I.gif" width="1000"></p>

This worked in that the rest of the game could function but it meant that other characters couldn't move into the gravestone cell and when switching between characters, the dead character would also be selected. Finding a solution to this was the biggest challenge of the project, and in the end I inserted a for loop into the switchCharacter function that checks if the character has the class '.dead', and if so, continues to cycle through the characters until it finds the correct one.

<p align="left"><img src="https://i.imgur.com/7sUMFGc.png" width="1000"></p>

While this solution largely works, it does still cause a bug whereby the incorrect image is displayed in the stats window until the player moves the character. I've tried coming up with multiple solutions to this unsuccessfully and ultimately I think that it's down to the fundamentals of the game requiring switching classes and attributes from one div to another.

#### Planned features

There are a few features I would like to implement in the game. The initial idea was in order for Attack or Magic to be successful, the player would have to complete a small minigame, such as solving an anagram or memorising a series of keystrokes. I didn't implement this due to time constraints, but I think it would add a nice extra level to the game.

I would also like to add a third class of Maester to the game, who would be able to heal themselves and teammates, as this would add another interesting strategic level to the game.

I also initially planned for items to randomly spawn on the battlefield that would add perks to whichever character picked them up, but again, this was scrapped due to time constraints.

Finally, I would like to include Special Attacks for characters.

##### In review
Overall, I am satisfied with how Game of Shining Thrones turned out. Its core gameplay functions largely as I want it to and, barring a couple of bugs with regard to which picture is displayed in the display window following a character's death, it runs smoothly and achieves what I intended.

I was able to construct a relatively complex codebase and get all the separate components running together. I think some of it is overengineered - which is probably the source of the more persistent bugs - and there is the potential for a lot of refactoring, but given its size and complexity, I'm happy with how well it works. If I were starting again, I would probably have another look at how I handle character movement and would try to update the character objects directly, rather than relying on divs switching attributes and taking the information from there, as this initial starting point was ultimately the source of most of my debugging headaches.
