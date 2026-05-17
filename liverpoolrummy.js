/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * LiverpoolRummy implementation : © Bryan Chase <bryanchase@yahoo.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 *
 * MIT License
 * 
 * Copyright (c) 2020 Bryan Chase
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * -----
 *
 * liverpoolrummy.js
 *
 * LiverpoolRummy user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */
var isDebug = window.location.host == 'studio.boardgamearena.com';
var debug = isDebug ? console.info.bind(window.console) : function () { };

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
	"ebg/stock"
],
function (dojo, declare) {
    return declare("bgagame.liverpoolrummy", ebg.core.gamegui, Object.assign({
        constructor: function(){
            console.log('liverpoolrummy constructor');
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;

            this.cardwidth = 72;
            this.cardheight = 96;
			this.handlers = {};
			// this.showingButtons = 'No';
			this.prepSetLoc = 0; // 1st spot in the array of Target Hands
			this.prepRunLoc = 3; // 4th spot in the array of Target Hands
			this.currentHandType = 'None';
			this.playerSortBy = 'Run';
			//this.buyCounted = 'No';
			this.buyCounterTimerShouldExist = 'No';
			this.buyCounterTimerExists = 'No';
			this.firstLoad = 'Yes';
			this.handReviewed = 'No';
			this.drawCounter = 400; // Start with a number bigger than the # of cards
			// this.buyTimeInSecondsDefault = 10;
			// this.buyTimeInSeconds = this.buyTimeInSecondsDefault;
console.log("[bmc] Clear this.prepAreas2");
			this.prepAreas = 0; // No card are prepped on the board upon refresh
			// New variables for new timers on static buttons
			//this.enableDBStatic = 'Yes'; // (except the player whose turn it is
			this.enDisStaticBuyButtons('Yes');

			// this.enableDBTimer = 'No';
			this.playedSoundWentOut = false;
			this.actionTimerLabelDefault = "Don't Buy";
			this.dealMeInClicked = false;
			this.buyRequested = false;

			// this.setsRuns = [ // Places in the downArea where the cards should go, per hand (set, set, set, run, run, run)
				// [ "Area_A", "Area_B", "None",   "None",   "None",   "None"],
				// [ "Area_A", "None",   "None",   "Area_B", "None",   "None"],
				// [ "None",   "None",   "None",   "Area_A", "Area_B", "None"],
				// [ "Area_A", "Area_B", "Area_C", "None",   "None",   "None"],
				// [ "Area_A", "Area_B", "None",   "Area_C", "None",   "None"],
				// [ "Area_A", "None",   "None",   "Area_B", "Area_C", "None"],
				// [ "None",   "None",   "None",   "Area_A", "Area_B", "Area_C"]
				// ];
				// So, accessing setsRuns[3][3] (shows as 'None') means in the 4th hand, no runs are needed.
        },
            // setup:
            
            // This method must set up the game user interface according to current
			// game situation specified in parameters.
            
            // The method is called each time the game interface is displayed to a player, ie:
            // _ when the game starts
            // _ when a player refreshes the game page (F5)
            
            // "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
////////
////////
////////
// Bugs / TODO:
//
// 2025-03-01: There are ZERO PHP syntax errors and ZERO UNEXPECTED ERRORS on the game servers!! Yay!
// 
// 2025-01-19: I am at table 618031393
// 2025-01-19: Down card doesn't slide after go DOWN nor joker swap?
// 2025-01-19: Make the wishlist buy after the person draws (not before)
// Card backs: maybe grapes or beach or palm trees... Not winter because it's summer in Australia 
//
// 19/01 12:29:57 [error] [T617611414] [1.159.82.180] [91612041/Lindajak] Error with notification service
// (code: 0, "cURL error 28: Connection timed out after 1001 milliseconds (see
//  https://curl.haxx.se/libcurl/c/libcurl-errors.html) for http://ws.boardgamearena.com/bgamsg") first
//  error (message length = 825). Automatic retry - /player/p89557171 - 65703dba0f1665eca0e87129089903af
//  - drawCard","log":"","....  
// 
// 12/8/2024: It doesn't update the score until after everyone clicks on to the next
//
// 2024-11-27: WISHLIST didn't buy and something strange happened before move ~10:
//     https://boardgamearena.com/archive/replay/230921-1000/?table=420280348&player=94627511&comments=86675870;
//     Should add to the game log which cards are in the wishList.
//
// 2024-10-14: is it possible to add a "i'm here" or "i'm ready" button that
//  everyonbe has to click when they've arrived at the actual play screen? several
//  times the game doesn't load right away or takes you to the "click here to start" 
//  screen and other people have already played.  
//       
// 10/28/2023: if you refresh before selecting deal me in, it shows the previous round person going out.    
// 10/28/2023: On a phone: When on the phone and it's more than 2 rows and someone else goes down it
//     covers a row. But refresh fixes it.
// Make it more playable on phone screens.
// Display "You bought X" from wishlist buy (not sure how to display it)
// 09/10/2022: Add a sound "It fits right there!" when your buy goes through.
// 08/13/2022: Don't allow zombie to buy (or draw).
// 08/09/2022: Chat window doesn't launch auto after SORT buttons are pressed.
// 08/08/2022: Player reported they type and the chat you can usually type and the chat box will just
//     do its thing. However, after clicking the SORT button, you have to click back to the chat window.
//      normallly you just type and the chat comes up, but if you click to sort sets or runs anf then start
//     typing it doesnt work.
// 08/06/2022: update the player boards first before doing the final score.
// 07/30/2022: In JS, when you have 2 identical cards they cannot be sorted unless one is put into a PREP area.
// 1/29/2022: When a player takes a joker, show a message they can put the joker anywhere.
// 1/29/2022: Make the message to select joker FIRST so it's easier to see.
// 1/29/2022: Request to make buyers anonymous if they didn't win. "Someone wants to buy..."
// 8/21/2021: 4 people played with 2 decks and the discard pile didn't reshuffle
// 7/24/2021: 6 people played with 2 decks and discard pile was not shuffled back into deck.
// 7/24/2021: Need to cover when both deck and discard pile run out of cards. Need to change to bypass
//    the requirement to draw if cards are left in draw deck + discard pile.
// 4/24: SCORING: I think this functional form is a perfectly great alternative - there are likely many
//  many ways to go about implementing this scoring feature. 
//Is there one numPlayerTurns value for all players, or does each player have a potentially unique one? 
//I think it is important each player has a unique multiplier instead of heavily discounting everyone’s
//   score when someone goes out early - I highly value the relative discounting between players within a round.


// X 2025-01-19: Add delay between draw and discard. Reason: Derusian able to give others a chance to buy.
// X 12/29/2024: Joker replacements go to the wrong player.
// X TODO: Check all actions for public, variable type, statemachine
// X test/public/int       /states actDiscardCard
// X public/int       /states 'actPlayerHasReviewedHand'
// X testnotplayer/public/int(na)   /states 'actBuyRequest'
// X testnotplayer/public/int(na)   /states(na) 'actNotBuyRequest'
// X testnotplayer/public/int(na)   /states(na) 'actDisableWishList'
// X testnotplayer/public/int       /states(na) 'actLiverpoolButton'
// X testnotplayer/public/intarray  /states(na) 'actSubmitWishList'
// X na/public/int       /states 'actPlayCard'
// X na/public/intarray  /states 'actPlayCardMultiple'
// X testplayer/public/int       /states 'actDrawCard'
// X testplayer/public/intarray  /states 'actPlayerGoDown'
// X public/intarray  /states(na) 'actSavePrep'
// X public/int       /states(na) 'actLoadPrep'
// X 2024-12-07: Move the discard pile to the other side of the deck
// X Momma_BearLike make sure you don't have in the prep area all the cards that could go down       04:01 PM
// X And just to be clear, you clicked GO DOWN and then it also discarded a card into the discard pile, right?       04:01 PM
// X Momma_BearIt can't be playable for when you hit go down       04:01 PM
// X It didn't go down, it just discarded my card because my cards were not complete without it       04:02 PM
// X Without the joker       04:02 PM
// X I was trying to add it to my prep but it didn't go, so it was highlighted in my hand       04:02 PM
// X Then hit go down and it discarded        04:02 PM
// X Oh it didn't go down? I see. And you clicked GO DOWN but it discarded instead?       04:02 PM
// X Momma_BearYes       04:02 PM
// X 2024-10-27: Reports wrong person went out at top, not in log(?). See Screenshot. https://boardgamearena.com/bug?id=101319
// X 2024-10-27: Could not LIVERPOOL on the Q diamonds. https://boardgamearena.com/bug?id=133855
// X 2024-10-27: Unable to play https://boardgamearena.com/bug?id=106295
// X Drawn card doesn't always slide
// X Cannot always buy by clicking DISCARDED card
// X Board doesn't always sort until CTRL-F5
// X 2024-12-27: These tables totally hang the browser and are unrecoverable:
// X   Pegs 1x CPU at 100%: https://boardgamearena.com/archive/replay/241211-1034/?table=600467831
// X   Also table: 568800147 (https://boardgamearena.com/bug?id=140186)
// X 
// X 112624: 2024-04-14: https://boardgamearena.com/table?table=467776865
// X       HANG. Pegs the CPU to high %.
// X       endacot drew a card but then could not discard.
// X       Options for the game 3 decks, no jokers, unlimited buys
// X       endacot hand: Spades: AA24. Clubs: 210J Hearts: 510 Diamonds: 2. Drew the AH
// X 
// X Tables:
// X 446864256
// X 485302497
// X 
// X 115666: 2024-04-14: https://boardgamearena.com/table?table=479420597
// X       HANG. After Joyeous went down. Move 247. Pegs the CPU to high %.
// X       2nd hand of 7. Someone went down and the whole game hung.
// X 
// X 2024-04-14: https://boardgamearena.com/table?table=480704288
// X       HANG. Move 17.
// X       Derusian tried to go down with 3J and 3Jokers and the game just hung.
// X 
// X 118484: 2024-04-14: https://boardgamearena.com/table?table=490903234
// X       HANG after go down
// X 
// X 118145: 2024-04-214: https://boardgamearena.com/table?table=489669547
// X       HANG: Shortest replay of a hang. After starshinep went down.
// X Condition of invalid draw:
// X 1) Cards exist in discard PILE
// X 2) someone discards a playable CARD
// X 3) someone declares liverpool
// X 4) the card gets picked up
// X 5) someone tries to buy the next card but should not
// X 
// X Order:
// X 1. Player 1: Discard a card
// X    a. Check action is OK and player is ALLOWED
// X    b. ResolveBuyers()
// X       i.   Check empty deck
// X       ii.  getPlayerBuying()
// X       iii. findthebuyer and increment buy count
// X       iv.  clearplayersbuying()
// X       v.   move a deck card to buyer's hand
// X       vi.  notifyPlayers
// X       vii. move a discarded card to buyer's hand
// X       viii.notifyplayers
// X       ix.  disable the buyer's wishlist
// X    c. ClearPlayersBuying & notify cleared buyers
// X    d. Put card on discard pile
// X    e. If Liverpool Found then set players for Liverpool processing; Else normal
// X    f. Check empty deck
// X    g. Notify of discard
// X    h. nextState discardCard
// X       i. stWaitForAll
// X      
// X 2. Player 3: I'll buy it
// X 3. Player 2: Draw deck
// X 4. Player 2: discard
// X 5. Player 3: Execute buy
//
// X Advice on avoiding deadlocks:
// X Do you have any for () or while () loops without super explicit ending conditions?  Are there any such
// X    loops that MIGHT have their condition variable modified mid-loop?
// X Do you use any recursive function calls?
// X (the browser maxing the CPU could indicate a JS bug instead of PHP -- similar questions would then 
// X apply, but it should be much easier to use a browser debugger in this case) 
// X if(leftOverJokers>0){for(let e=h-1;e>1;e--)
// X @SevronOaks it appears you have an unbounded loop due to "h" being infinite / not defined, possibly 
// X I waited until Firefox offered me the Debug Script button, and it immediately brought me to the loop.
// X    Good luck!  Feel free to ask in Discord/javascript if you have further issues with it.
// X SevronOaks — Today at 1:38 PM
// X Oh wow good catch!! You found this with Firefox? I use Chrome alot but can try FF.  And yeah that
// X    joker analysis code is a ratsnest of terrible memories and many re-attempts, trying to get it to work
// X    right. I've spent dozens of hours in there... I wouldn't be surprised if that's it.
// X GTSchemer — Today at 1:39 PM
// X Yeah, normally you can type "debugger" in the console, but in this case it was stuck...but fortunately
// X  if you let it sit like 30 seconds, it gives a warning about the script slowing the browser, and let me
// X   click Debug Script.
// X 12/9/2023: Transition from LIVERPOOLPENATLY in 2 states.
// X 12/9/2023: Table hung and players must quit. 
// X 10/22/2023: Should not be able to declare LIVERPOOL on yourself
// X 10/28/2023 Wrong player designated "WENT OUT" after liverpool go out
// X kriskeith tried to buy but it didn't go through (filed bug)
// X Person went down, discarded and went out and handcount reports as NAN
// X TODO: 8/13/2023: Chrissy NZ says she was not able to put 2 5s onto table 5s, no joker
// X Add the $this->bSelectGlobalsForUpdate = true; code to PHP constructor, will cause lock before an AJAX transaction runs.
// X 9/23/2023: tim183: The discard pile and Prep A are really close together...
// X DrKarotte 9/23/2023 regading Solo:
// X I think it had to be on PHP side; normally at the beginning of an PHP action function there is a line
// X    like "self::checkAction("drawCard");"
// X For solo in the play card action function I have replaced it by the following:
//      $this->gamestate->checkPossibleAction( "playCard" );
// X Probably this reduces the procedure to the bare check if an action is allowed, without further
//      built-in checks (is it the player's turn?)
// X hope that helps
// X Side note: There seems to be a rare bug in Solo which I could never fix that might be related to this
//     change, so it is probably not without risk; on the other side the site founders had given their ok to that    
// X End message from DrKarotte
// X CANNOT BUY - this is expected behavior.
// X After someone draws it makes them draw again
// X Check for Liverpool on refresh and light up the but9iton
// X Add option for penalty for Liverpool, or benefit.
// X 2023-08-05 When someone draws from deck  card animation doesn't. but when they draw from discard pile it shows.
// X Add extra PREP area just for storing cards to get rid of later.
// X Joker placement: it’s a two in a run from ace to 5, but it will show up like it was the 6
// X Turn off the wishlist after a player goes down.
// X 09/10/2022: K could not go down with 9C replacing a joker, and 2 runs, and her 2 melds each needed a joker.
// X 09/10/2022: Add "you" to the wish list logs
// X 09/10/2022: without wishlist option, notifcation "WISH LIST DISABLED" appeared in the log and should not have
// X 09/10/2022: 789 onto 10*QK gives "NOT A RUN DOESNT REACH" but it should reach.
// X 09/10/2022: Konni's WL still tried to buy after she went down and disable swishlist.
// X 09/05/2022: Cannot play on low end of run with joker. 567* won't allow 3 to play.
// X 09/05/2022: I usually wait until someone draws their card to try to buy something, so that I don't influence them
// X 09/05/0222: it didn't tell me WISH LIST CLEARED when I clicked clear button (after I went down).
// X 09/05/2022: Spectators aren't supposed to see the wish list controls.  
// X 08/22/2022: Remove wishlist from spectator area
// X 08/13/2022: I clicked BUY right when someone else drew
// X 08/08/2022: Spectator, the WANTS TO BUY lights up very quickly, then disappears.
// X 08/06/2022: Sorting wrong: **A10* should be 10***A
// X 07/30/2022: Don't unlight the BUY button when a player draws from the deck. Only when they discard
// X 07/16/2022: Replays keep cards in hand when they go down.
// X 07/14/2022: Upon replay, the cards still show in the hand (except the jokers). Card count is right.
// X 1/29/2022: Mark Fong got a Syntax error by drawing a card.
// X 1/29/2022: Make BUY IT not unlight when someone draws and player can still buy.
// X 1/29/2022: Disable buys in a 2 player game. Deal out the right number of cards. No.
// X 9/15/2021: Spectator Draw card doesn't show. See drawCardSpect line ~1227.
// X 8/16/2021: Spectator doesn't log the drawing of the card and doesn't hear the swoosh sound when drawing
// X 8/4/2021: Spectators don't see message log when someone draws a card.
// X 7/21/2021: 2 player game, someone could not go down with 3 runs, had to quit.
// X 7/18/21: Run with 6-Q does not allow 45 to be added "Not a run doesn't reach"

//  2/13: Everyone should get at least 1 turn
// 11/26: Get everyone at least 2 turns, or half points
//  2/13: Scale the points by the number of turns the person had.
//  2/13: Order the player table by score.
//  2/13: Have an option where jokers on the table could not be replaced
//  1/16: Allow players to specify where each joker plays
// 12/26: Hover-over a joker shows what cards can be substituted.
//  2/13: Having an option where bids to buy aren't revealed until they are successful would be appreciated
//  2/13: Make the board FLASH when a person has 1 card
//  2/13: Change the player board color to RED when player has 1 card
// 11/10: Add KNOCK requirement feature, or you can't go down next turn
//  2/6: Sort meld box as run and place joker properly
//  1/3/2021: Reduce  "Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first"? Seems coming from the history log.
// 12/26: Show the options in the message log when the game starts.
// 11/26: For early hands, make 4 cards needed for a set
// 11/27: With expelled players, the active turn player's table did not turn green.
// 11/10: IT'S NOT YOUR TURN is not needed
// 11/1:  [forum] If 2 of same card (e.g. 2x 6 of hearts) is in hand cannot move just one of them
// 11/7:  MAYBE Limit the set size???
// 11/10: MAYBE In 2 sets with many players, allow every other player one more play
// 11/14: MAYBE: Player should not be able to buy their own discard
// 11/10: Maybe not: Get bonus if you go out? NO.
//
// Resolved Bugs:
// --------------
//  X 2/13: When someone wants to buy, light-up the DISCARD card so people can see it has a buyer (lit up player)
// X 12/26: When drawing a card, if the same card is in player hand they both go to the right. Highlight new cards.
//  X 1/15: If discarded card is playable, allow players to call RUMMY, play it, and discard a card
// X 12/26: MAYBE Should not be able to buy own discard (or if double-click then CONFIRM). Leave it
// X 11/7:  Maybe not: Add a table with the players in an oval.
// X 11/10/2020: Maybe not: Notify players are prepping cards. No.
// X 2024-11-05: Inconsistent & wrong info regading who went down in the ribbon and log.
// X 12/29/2024: PHP Warning:  Trying to access array offset on value of type null in .../liverpoolrummy.game.php on line 1634
// X 555, 888, 5*5, QQQ, JJJ, AAAAA, 22222, QQQ
// X and then 4H and 10H were able to be picked up.
// X AC and LK both clicked. it was LK's turn. LK got the discarded card BUT
// X AC also got another card.
// X Cards stay in hand after liverpool pickup.
// X There is a JS or PHP error where player 745 thinks its their turn (board goes green)
// X but the text shows that 744 is really the active player. The card play is proper.
// X Also when someone does liverpool their board does not light up green.
// X 1/16: When I have enough melds prepped to go down and it becomes my turn, the GO DOWN button doesn't light up but should
// X 1/16: When someone clicks BUY IT and someone clicks the card there can be a race condition?
// X 12/26/2020: Konni discarded at same time as I clicked BUY it. It was my turn. Game thought i wanted to buy
//     Konni's discard. I drew, but now it won't let me discard: "You cannot buy any more this hand(decPlayerBuyCount)."
// X 9/4/2023: 3 new bugs added (some translations)
//    Translations:
//      Xboard: "Voices"
//      Xboard: "Target Hand..."
//      Xboard: "Prep A, B C"
//      Xlog: "the 3 of diamonds"
//      Xlog: "a joker!"
//         Xmight need: "$value_displayed = clienttranslate( ' joker ' );"
//      Xlog: "remove exclamations. separate articles"
//      Xlog: '<player_name> draws a card from the deck"
//         Xsearch for showmessage
//      Xlog: "It's your draw"
// X 9/4/2023: Add joker count at stats end
// X 9/4/2023: ADD STAT: How many jokers each player used in the game       
// X 9/4/2023: Add ability to SAVE PREP areas on the server.
// X 09/10/2022: Mark and I both tried to buy a QD but someone picked it up and got a 3D instead, and we could not buy.
// X 08/13/2022: BUY and NOT BUY buttons don't light right.
// X 07/16/2023: Cannot swap out a 2 Spade for a joker on a 14-card run.
// X 09/05/2022: Flip WL closed or open. When I don't need it anymore, it could close.
// X 09/06/2022: Ability to hide wishlist (especially for phone players)
// X 09/05/2022: the wishlist is still active from one hand to the next and should not be.
// X 12/26/2022: Someone went down with 12 cards and then could not discard. The card quantity check was not right. Need to verify the fix.
// X 12/26/2022:   Spades: AKQ Hearts: 7890J Diamonds: 789* then swapped out for the 7H on the board.
// X 12/26/2022:   On board is C:A23*56 H:56*89 H:*QKA
// X 2022-08-27: Konni automaticily wants to buy when she selected all 4 seves and then a 2S and 2D werer discarded.
// X 08/16/2022: Jo found 2x jokers on K** and put K in CARD for joker didn't allow to go down without selecting a joker.
// X 08/16/2022: The Joker in Jo's K*K is still selected after she used the other one.
// X 09/01/2022: Change buy button back to blue. Gray out text if not selectable.	
// X 09/01/0222: Add mouse-over text for the wishlist.
// X 09/01/2022: Could process wishlist requests on the server side instead of the client. Implement a queue instead of database access. Implement a handshake instead of queue.
// X 08/31/2022: I put the function on the server side. No deadlocks now. The issue with the deadlock is this: Multiple players request to buy at the same time. One PHP function is processing buyRequest while another PHP function is trying to get the buyCount, but the other one hasn't finished the web transaction. So there is a database conflict. See this log:
// X 08/13/2022: Spectators don't see the DRAWCARD in the log and should.
// X 08/15/2022: 2 Runs someone went down with 678T* and 8JQA* but the latter is not a valid run.
// X 08/08/2022: Need to refresh to see correct hand target, should update automatically.
// X 08/06/2022: Icon is GOMOKU icon. Should be liverpool!
// X 07/30/2022: On new hand, 1 player had RED Boarder around deck but it wasn't their turn. The active player had red boxes around both (as it should be).
// X 07/30/2022: Don't do the CHECK RUN message 'not a run' if the target is sets.
// X 07/30/2022: On first buy, not all players saw buyer as RED player board.
// X 07/30/2022: If someone tries to discard but is not allowed, it will clear the buyers. Probably should not clear the buyers until the discard is deemed legitimate.
// X 07/16/0222: undo a buy? (request from Marsh A, meeplehead55, matmcv)
// X 9/4/2021: Spectator TARGET doesn't update upon new hand.
// X 8/16/2021: After 1st hand is done, Spectator doesn't see names on board
// X 2/13: When people want to buy, and the DECK is drawn, the BUYERS are discolored and should not be.
// X 7/18/2021: Cannot find image file (it shows the default gomoku instead) 
// X 2/13: 11 card deal for all hands (option) & can go out without a discard (no)
// X 1/28: [group] We had multiple cases where people tried buying and the log reported they were unable, with no explanation as to why
// X 1/28: [group] Somehow show that the unbuyable downcard is not buyable
// X 1/28: [group] The list of games in progress shows a placeholder that says "Game icon 50 x 50"
// X 1/20: If there are 14 cards in an area then unlight all greens and put a joker on the left if no ace.
// X 1/20: rightmost joker of A*3* lights up green and should not.
// X 1/16: 4 in a set and 4 in a run and GO DOWN didn't light up
// X 1/16: when going down with 4 in a set and a run as AKQ* it says "RUN CARDS MUST BE SEQUENTIAL"
// X 12/26: Spectator should not see MELD A, MELD B, MELD and CARD FOR JOKER
// X 12/26: "Tried but could not buy" does not show up but should.
// X 12/26: Allow go down with deficient joker and have it figure out that it's in the middle of the run.
// X 12/24: Add the ranking of each player to the player boards
// X 11/28: After playing last card, got NaN in number of cards
// X 11/26: Add a graphic show progression
// X 11/21: SAFARI: GO DOWN button caused NOT ENOUGH SETS
// X 11/26: https://boardgamearena.com/2/liverpoolrummy?table=127049675# Mom couldn't end 
// X 11/10: Got Nice Try doesn't reach from 89 on 0*QKA, but they played OK individually.
// X 11/14: MAYBE If click BUY after draw, it lights up but doesn't let you draw
// X 11/5:  Maybe not: Cannot go down with 2356s and replacing a joker (can do it with 235s).
// X 08/08/2022: Add a NOT BUY button. There is still an issue with the lighting up of the BUY buttons but the function works.
// X 08/09/2022: Must go down with exactly TARGET melds (i.e. not 4 in a set)
// X 08/06/2022: Add the hand number to the TARGET line.
// X 07/08/2022: Someone claimed the translation needs to be parsed differently.
// X 2/13: Deal 11 each hand. Added the game option.
// X 08/06/2022: Repaired the CHECKRUN function. Draw box around the discard pile so players know where to click.
// X 11/24: Have an elegant way to end the game early.
// X 6/2022: Game ended while playable cards were in the deck.
// X 7/8/2021: Reported by mavhc Chrome v91 "When moving to the second round my new hand of cards wasn't visible until I reloaded the page" https://boardgamearena.com/table?table=185758192
// X 7/8/2021: Reported by mavhc Chrome v91 "When replaying a game it seems that the cards are missing from hands and the board quite often"
// X  1/27: Somehow show the non-buyable discarded card as non-buyable
// X 12/26: Landscape to portrait shows every card in discard pile.
// X  2/13: A7890JQ* did not sort properly. Should have been 7890JQ*A.
//  X 2/13: Change button text MELD A...
// X 7/17/2021: Board sorting used to be not right on 7890*QK*A (* should be low) but it's fixed.
// X 7/10/2021: There is a problem with 2 jokers on the board, 2 sets, 1 joker in PlayerAraea and 1 in A of different player. Trying to swap the joker in playerAreaB. The joker gets added wrong.
// X 7/8/2021: Reported by mavhc Chrome v91 "Move 39, I'd selected card for joker, 2 cards for meld A and 3 10s for meld B, the joker, and a 9 to swap with the joker, before drawing a card. So I couldn't click Go Down. Then I worked out the problem, drew a card, but still couldn't click Go Down, until I'd click a card in the meld/prep A to send back to my hand, and then resent it back to meld A."
// X 11/26: Have the board joker selection be automatic if there is only 1 joker
// X  2/13: After 1 hand is played, PREP A, PREP B and PREP C disappear from the board.
// X  1/27: Add option: Deal 1 more card than size of contract "May I" variant.
// X  1/27: Add option: Add 2, 3, or 4 extra jokers to the deck
// X  1/28: [group] Change rules text to match # of cards dealt
// X 12/26 (Cannot reproduce) In PHP:
// [Sun Dec 27 07:14:39.479873 2020] [php7:notice] [pid 9172] [client 51.178.130.161:59540] PHP Notice: Undefined index: in /var/tournoi/release/games/liverpoolrummy/201214-0437/liverpoolrummy.game.php on line 717, referer: https://boardgamearena.com/2/liverpoolrummy?table=134280648
// X 1/16: BGA Service Error. Unexpected error: BGA service error (2.boardgamearena.com 17/01 04:29:26       
// 1/16: [Sun Jan 10 07:03:41.742951 2021] [php7:notice] [pid 18038] [client 51.178.130.161:15152] PHP Notice: Undefined offset: 1 in /var/tournoi/release/games/liverpoolrummy/210110-0525/liverpoolrummy.game.php on line 452, referer: https://boardgamearena.com/table?table=138111919
// [Sun Jan 10 07:11:30.029970 2021] [php7:notice] [pid 18035] [client 51.178.130.161:41188] PHP Notice: Undefined offset: 1 in /var/tournoi/release/games/liverpoolrummy/210110-0525/liverpoolrummy.game.php on line 452, referer: https://boardgamearena.com/table?table=138111919&acceptinvit
// [Sun Jan 10 07:12:11.446814 2021] [php7:notice] [pid 19220] [client 51.178.130.161:6946] PHP Notice: Undefined offset: 1 in /var/tournoi/release/games/liverpoolrummy/210110-0525/liverpoolrummy.game.php on line 452, referer: https://boardgamearena.com/table?table=138111919&acceptinvit
// [Sun Jan 17 04:14:39.169605 2021] [php7:notice] [pid 29756] [client 51.178.130.161:32786] PHP Notice: Undefined index: in /var/tournoi/release/games/liverpoolrummy/210110-0717/liverpoolrummy.game.php on line 1163, referer: https://boardgamearena.com/2/liverpoolrummy?table=139975005
// [Sun Jan 17 04:14:39.169650 2021] [php7:notice] [pid 29756] [client 51.178.130.161:32786] PHP Notice: Undefined index: in /var/tournoi/release/games/liverpoolrummy/210110-0717/liverpoolrummy.game.php on line 1164, referer: https://boardgamearena.com/2/liverpoolrummy?table=139975005
// X 1/28: [group] Green boxes around jokers on table makes it impossible to tell if you've selected the joker. This also makes going down with a joker from the table much harder to tell if you are missing the joker selection or not.
// X 1/28: [group] Allow unlimited buys
// X 1/16: Highlight player board color 1 when someone goes down, and color 2 after they've gone done.
// X 12/26: Remove the DEAL ME IN when the game is over.
// X 11/26: if it's your turn and you click BUY then treat it like you drew the card
// X 11/26: After 1 hand, the PREP areas didn't have their titles on the board
// X 11/26: Chrome 87 vs. Chrome 86 the 87 people saw a run placed as 4235. Chrome 86 saw 2345.
// X 1/2: Game needs to end before DEAL ME IN.
// X 1/16: When clicked BUY It, someone drew and the red border went away and it should stay.
// X 1/16: A3** didn't sort right on a run
// X 12/13: After a new hand is dealt the discard pile doesn't border red
// X 12/11: The buy counter isn't right
// X 12/26: Show the floating jokers as ghosted on the board instead of solid.
// X 11/28: Unexpected error: Error while processing Database request (2.boardgamearena.com 29/11 07:36:08)
// X 12/26: When try to buy and it's your turn, should not hear "I"LL BUT IT" Jo is sending me a console log.
// X 12/26: player clicked BUY IT button to buy but it's there turn causes DAD, but should hear my Mom.
// X 12/26: Once discard was chosen as the draw card, don't let anyone try to buy. (Now it still allows the buy-try to be registered).
// X 12/26: After someone draws the DISCARD, the player board is still lit up as a BUYER and should not be.
// X 1/7: Let user disable/enable hearing voices
// X 1/3: Get the joker sort to work.
// X 1/3: Undo all the border1 / buyerLit stuff
// X 1/2: If ACE is high and there are extra jokers then put them on the left.
// X 12/26: Spectators are offered a button: THIS PLAYER IS NOT PLAYING WHAT CAN I DO.
// X 12/24: ENTIRELY Remove nag screen when discarding with prepped cards.
// X 1/2/21: Add text to say that runs can begin and end with Ace.
// X 12/26: ONly 1 person's BUY it is red on game launch. Clicking SORT RUNS may delight it.
// X 11/27: Mention the source when a card is drawn.
// X 11/26: Make the deck and discard piles red, to show that you need to draw a card
// X 11/26: Once you have clicked I'll buy it don't let them do it again
// X 11/26: Only 10 cards dealt to 2 RUNS, should be 11 (just changed options)
// X 11/29: Add 1 mode per hand per game
// X 11/26: for the runs, deal 11 cards
// X 12/4: If the highest priority buyer is buying, resolve it
// X 12/10: Don't AJAX for a buy if the discard pile is empty.
// X 12/4:  Remove definition of runs if not runs needed.
// X 11/24: Remove state numbers from the ACTIION BAR.
// X 11/21: When card put in discard and then brought back, it still asks for CONFIRM when discarding
// X 11/21: After first hand was done, wrong players were green.
// X 11/24: Can go down with 3 sets, but should not.
// X 11/21: Buy BUTTON NOT LIGHTING UP When they can buy
// X 11/21: Change prep TO meld
// X 11/21: Change prep joker to swap joker
// X 11/14: Mark's PREP cards and salmon did not refresh
// X 11/7:  Make the text of gray buttons also gray.
// X 11/14: Hard to see white text on yellow background
// X 11/10: Remove jokers with more players or decks
// X 11/14: After a hand, 1st player didn't turn green
// X 11/14: Change must discard or go down (and then play if you go down).
// X 11/14: Buy it button turns red when you cannot buy
// X 11/14: Buy should be allowed until the next person discards (added 5 second timer)
// X 11/14: After putting a card into PREP it should unselect
// X 11/14: I CONFIRM button appears twice, should be only once
// X 11/14: Need to end the game after the last person goes out
// X 11/10: Add tooltips for how to play, definition of set and run, buy, cards left...
// X 11/6: 2Runs: Going down with 568 spades and 456* hearts and ace of spaces swapping a joker. It did the swap but somehow the jokers have the same IDs! I think one of the functions took the wrong joker (in PHP).
// X 11/10: Play a different sound when it's your turn and/or another message
// X 11/14: Going down with a joke and a card in a set is broken (not sure if it worked
// X 11/10: Remove NOT BUY button (and timer?)
// X 11/10: Add graphic explaining how to go down with joker
// X 11/10: ipad the cards are too big, wrap on table. PC looks fine
// X 11/10: ipad mini doesn't load studio
// X 11/10: Set it up to start after 1S1R or 2Runs or 3Runs, and skip 2sets.
// X 11/10: in TARGET area, add definition of runs and sets
// X 11/7: (Deleted by timer) Put BUYING & BUYTIMER in different tables to remove deadlock. (PHP line 901)
// X 11/8: Make 6 across
// X 11/7: 3 people are light blue (changed to 12 players)
// X 11/7: Some people cannot see coral BUY IT coloring.
// X 11/7: Dad chose the 7s but 2c was discarded
// X 11/7: Make 2 side-by-side down areas (Spectator and Gary and Kristi cannot see whole board)
// X 11/10: Run of *QKA shows as QK*A
// X 11/10: When player plays on a run, their card count is not updated
// X 11/7: Remove "play" from the options if you cannot play.
// X 11/7: Put everyone's prep area just below the DECK.
// X 11/7: Review buttons reappear even though they were clicked
// X 11/7: Konni had A890jqk but ace is still on the left
// X 11/8: Only notify of buy requests, not not-buys.
// X 11/8: Put prep area to the right of the discard pile.
// X 11/7: Clear prepped coloring after the hand ends
// X 11/7: Make the DRAW DECK be a single card, not covering most of the table.
// X 11/1: One player has BUY buttons shown but in fact cannot buy, but should be allowed (#0).
// X 11/5: Buy buttons don't appear after new hand but should (but buy works).
// X 11/1: Add game option of buyer precedence or buyer click-speed.
// X 11/7: Game option for no timers. 10 seconds is too quick to. Allow buy up to the next player discard.
// X 11/7: Played card moves from my hand instead of the player board.
// X 11/7: Put the GO DOWN button next to Prep ABC buttons.
// X 11/7: Add confirmation screen after player prepped cards and hit DISCARD.
// X 11/7: Shuffling deck threw JS error (2385).
// X 11/5: After the hand, the SO FAR table shows only the current values, not the totals.
// X 11/5: 7810** both jokers went to the 9 spot
// X 11/5: Game ended after 2 runs and should have kept going
// X 11/5: After someone goes out, show a page with points per player
// X 11/5: 5 player table isn't big enough vertically.
// X 11/5: "It's your turn!" should not be shown after BUY REQUEST.
// X 11/5: Hard to know who wants to buy it. Make it more prominent, like a pop-up. Or color the board.
// X 11/5: Make it so that if > 1 card is selected and discard pile is selected it will discad but should not
// X 10/29: Board Player names don't show up after new hand is dealt.
// X 10/28: Change # of cards dealt each hand? and the rules for 3 runs???
// X 10/24: When a buyer exists, update the action bar to show everyone "player wants to buy."
// X 11/1: Runs on board, jokers always go to right when they sometimes should be elsewhere.
// X 11/1: Runs on board, Aces always go to left but sometimes should go to right.
// X 11/2: [B] Firefox doesn't show dollar sign and card images in the player board areas. Change to use only PNG.
// X 11/1: [B] Spectators should not see the buttons and the hand area. They should see TARGET.
// X 11/1: [B] Spectators should not see HAND and buttons.
// X 10/30: The GODOWN sound doesn't play, but you can hear the cards move.
// X 10/30: After a hand is over, draw deck shows 50 when it should be 66.
// X 10/28: MAY BE OK (because stuff was prepped): GO DOWN button appears when no cards are selected in hand, should not.
// X 10/29: ASK GROUP: Change allowed run to require sequential values. Now 5668 is an OK run.
// X 10/29: Play a 4 on a set of 4s in AREA A got RED RUN CARDS MUST ALL BE SAME SUIT. But tried it again and it worked!
// X 11/2: After the deal of 1Set 1 Run, all players show the same cards (dodyoaks1, not dealer)! F5 refresh clears.
// X 10/29: Change pictures to show game board.
// X 10/29: Add How To Play
// X 10/28: Keep the highlighting on after the turn moves around. Now it turns off, not sure why.
// X 10/29: At REVIEW time, not all the blue buttnos appear
// X 10/24: Prep border lit up before anyone went down!
// X 10/24: Something happened where player 2 tried to draw, but it didn't register, and still had only 1 card, then discarded.
// X 10/28: Sometimes after discard, clicking discard or somewhere quickly the player's draw is not registered and it goes to PLAY. Seems like if I click DRAW before the DISCARD completes then there is an issue (timing).
// X 10/29: move the sound to a later function, since it says "YEAH" too many times.
// X 9/28 When you go down, it should play a sound "Yes!" or something.
// X 9/28 After player has gone down, when they click their hand do not show PREP buttons. (discard and sort)
// X 10/28: Add options for fewer hands
// X 10/24: After a new deal, wait until click, or allow 45 seconds (?) to figure out if want to buy.
// X 10/26: Target on the board doesn't update when the hand goes to next hand and should.
// X 10/13 Player can trade card for joker.
// X Players can buy a card 1, 2 or 3 times.
// X When a player discards, the buy-card timer starts but it stops right away.
// X Game progression didn't progress.
// X 10/17 Add player color to the ACTION bar (it's black/white now, b/c send only the text not the whole player object
// X 10/17 Add quantity of BUYS left to the player panel.
// X 10/13 New hand should sort by sets but doesn't
// X 10/13 Even with just 1 window open, the timer went through once then it went through twice then it ended.
// X Also 1 browser ending the timer kicked off another browser timer coutning down. Eventually they stopped
// X but it needs to be fixed.
// X TODO: Verify the RUN plays still work. I fixed SETS, after getting runs to work SETS was broken with jokers.
// X Make sure to go down with jokers and runs.
// X 10/14 players can play and discard whenever. That needs to be restricted.
// X 10/18 The jokers don't always move to right places. Sometimes show in 2 places: where they were and where really went.
// X 10/18 The going down of a RUN, the NOTIFY OF OTHER PLAYERS gave an error: Cannot read property 'image' of undefined.
// X 10/19 Still having trouble with the drawnotify. Might want to go back to the previous code.
// X 10/12: The discard 1 card NOTIFY is not being noticed by the other tables.
// X 10/16: When playing a card for a joker, joker comes to hand and also stays on board. It should not stay on board.
// X 9/28 When coming back from godownprep, all the buttons disappear. Instead, show button 'go down'.
// X 9/28 When coming back from godownprep, selecting a card doesn't allow discard, only nothing or 'godown'.
// X 9/28 Remove the DISCARD button if > 1 card is selected.
// X 9/28 Get GO DOWN button to appear after 2nd PREP is placed.
// X 9/28 Get the 2nd set of DOWN cards to appear on other players screens.
// X Add the automatic addition to a run, if it is possible to be played.
// X Add double-click-discards card. NO: This causes inadvertent discards. Show a button instead.
// X 9/26 Add "Joker swap if it's there"
// X Stop the JS from calling playcard twice. It works, but then it calls it again and fails.
// X 10/14 Game does not allow a joker to be placed on a pile with another joker ("shouldn't happen")
// X 10/7: Each of the windows is using/seeing the same value for this.actionTimerId. Need to figure out how to separate them.
// X 10/7:  TODO: TRACE THROUGH THE TIMER CODE AND FIGUER OUT WHY IT'S STOPPING. ALSO SOME IDS ARE SAME SOME NOT.
// X 10/10: Change comparison player-whose-turn-it-is to be this.gamedatas.gamestate.active_player, throughout file.
// X 10/18: Add button for onPlayerReviewedHandButton
// X    and the functions wentout and notif.
// X 10/1 When prepping to go down, change the color back to 'normal' if it was in 'prep' color.
// X 10/20: Player 3 went down with a joker and the playerboards show 4 card when player really has 3. F5 didn't fix it.
// X 9/28 Player was allowed to pull an old card from the discard pile. Leave AS-IS to reduce testing time.
// X 10/20 Consider adding a database access to PHP (playerHasReviewedHand) to track when players hit the button ON TO THE NEXT.
// X 10/20 After a hand is over and a new hand, other players should be able to buy the discard.
// X 10/21 Played a card onto a run with a joker. The joker came to hand and also
// X       stayed on board (bad). The card did not move from hand to board. But the
// X       game took the action. The PHP worked OK, but the JS player doing the action
// X       did not get updated correctly.
// X 10/21 When the player draws the discard, stop the BUY timers.
// X 10/21 Use setSelectionAppearance to show the DOWN PREP. No, show a border.
// X 10/24: Update the HAND card count after buys, and after every draw and discard, and end of the hand.
// X 10/24: PREP RUN didn't light up the borders.
// X 10/24: X Sometimes the draw card doesn't go all the way to the right.
// X 10/24: Player buy count didn't update after buy (2 runs)
// X 10/24: Hand count doesn't show accurately after buys.
// X 10/24: You cannot buy any more this hand shown to wrong player.
// X 10/24: Drawing player IS ABLE to draw other cards from teh discard pile and should not be allowed to.
// X 10/24: In this.playerhand, somehow a null card item (id: null, type: -14) got into ITEMS under 'modified drawsource'.
// X 10/26: The player names on the board disappeared! get them back.
// X 10/26: Still the names don't show up. VERIFY THE unplayed and played values stuff.
// X 10/28: Let me put >1 card onto the board at the same time as a PLAY
// X 10/28: Click next to hand to clear selections
////////
////////
////////
        setup: function( gamedatas ) {
console.log( "[bmc] ENTER game setup" );
            // Setting up player boards
//            for( var player_id in gamedatas.players )
//            {
//                var player = gamedatas.players[player_id];
//                         
//                // TODO: Set up each players down area
//            }
            
            // Player hand
            this.playerHand = new ebg.stock(); // new stock object for hand
//console.log(this.playerHand)
//console.log("[bmc] myhand:");
//console.log($('myhand'));

            this.playerHand.create( this, $('myhand'), this.cardwidth, this.cardheight );
            // 13 images per row in the sprite file
			this.playerHand.image_items_per_row = 13;
            // Create 52 cards types:
            for (var color = 1; color <= 4; color++) {
                for (var value = 1; value <= 13; value++) {
                    // Build card type id. Only create 52 here, 2 jokers below
				
					let card_type_id = this.getCardUniqueId(color, value);
					this.playerHand.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
                }
            }

            // Add 2 jokers to the card types
            this.playerHand.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
            this.playerHand.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
            this.playerHand.setOverlap( 50, 0 );

console.log("[bmc] GAMEDATAS");
console.log(this.gamedatas);
console.log(this.gamedatas.hand);

//console.log("[bmc] Add cards to hand");

            // Cards in player's hand
            for ( var i in this.gamedatas.hand) {
//console.log( "i: " + i);
                var card = this.gamedatas.hand[i];
                var color = card.type;
                var value = card.type_arg;
				
//console.log( "CCV: " + card.id + " / " + color + " / " + value );
//console.log(card);
//console.log("[bmc] getCardUnique and card.id:");
//console.log(this.getCardUniqueId(color, value));
//console.log(card.id);

                this.playerHand.addToStockWithId(this.getCardUniqueId(color, value), card.id);
            }

			this.playerHand.setSelectionAppearance( 'class' );

			this.deckAll = new ebg.stock(); // New stock for the draw pile (the rest of the deck)
            this.deckAll.create( this, $('deckAll'), this.cardwidth, this.cardheight );            
			this.deckAll.image_items_per_row = 13;

			// Item 54, color 5, value 3 is red back of the card
			this.deckAll.addItemType( 1, 1, g_gamethemeurl + 'img/4ColorCardsx5.png', 54); // Red back
			this.deckAll.addItemType( 2, 1, g_gamethemeurl + 'img/4ColorCardsx5.png', 55); // Blue back
//			this.deckAll.addToStockWithId(1, this.gamedatas.deckTopCard );

//console.log("[bmc] deckIDs");
//console.log(this.gamedatas.deckIDs); // deckIDs has all the IDs of the cards in the deck

//const clonedDeckAll = Array.from(this.deckAll);
//console.log(clonedDeckAll);

//console.log( "this.deckAll(1)" );
//console.log( this.deckAll );

			
			let evenOdd = 1;
			
			if ( this.isEven( this.gamedatas.deckIDs.length )) {
				evenOdd = 0;
			}
			
			if ( this.gamedatas.deckIDs.length != 0 ) {

				// Color half the deck blue and half red
				for ( let i = 0; i < this.gamedatas.deckIDs.length; i++ ){
				
					// console.log( this.gamedatas.deckIDs[i] );
					
					if ( this.isEven( this.gamedatas.deckIDs[i] )){
						// console.log( "even" );
						
						this.deckAll.addToStockWithId( 1, Number( this.gamedatas.cardIDsInDeck[ i ]));
					} else {
						// console.log( "odd" );
						this.deckAll.addToStockWithId( 2, Number( this.gamedatas.cardIDsInDeck[ i ]));
					}
				}
				
console.log("[bmc] this.deckAll(2)");
console.log( this.deckAll );

			}

			this.deckAll.item_margin = 0 ;
			this.deckAll.setOverlap( 100, 100 );
			this.deckAll.autowidth = true;
			this.deckAll.horizontal_overlap  = -1; // current bug in stock - this is needed to enable z-index on overlapping items
			this.deckAll.use_vertical_overlap_as_offset = false; // this is to use normal vertical_overlap

			// Create the images for the fronts of all the cards
			this.discardPileOne = new ebg.stock(); // New stock for the top of the discard pile
            this.discardPileOne.create( this, $('discardPileOne'), this.cardwidth, this.cardheight );
			this.discardPileOne.image_items_per_row = 13;

			// Item 54, color 5, value 3 is red back of the card
			this.discardPileOne.addItemType( 1, 1, g_gamethemeurl + 'img/4ColorCardsx5.png', 54);
            for (var color = 1; color <= 4; color++) {
                for (var value = 1; value <= 13; value++) {
                    // Build card type id. Only create 52 here, 2 jokers below
				
						let card_type_id = this.getCardUniqueId(color, value);
						this.discardPileOne.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
                }
            }
console.log( "Made 52 cards. Now add jokers." );
			
            this.discardPileOne.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
// console.log( "line 1" );
            this.discardPileOne.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
// console.log( "line 2" );

            var card = this.gamedatas.discardTopCard;
// console.log( "this.gamedatas.discardTopCard" );
// console.log( this.gamedatas.discardTopCard );
// console.log( card ); 

			if ( card != null ) {
// console.log( "line 3" );
				var color = card.type;
// console.log( "line 4" );
				var value = card.type_arg;

console.log( "this.gamedatas.discardTopCard" );
console.log( this.gamedatas.discardTopCard );
console.log( this.gamedatas.discardTopCard.id );
console.log( card );
console.log( color );
console.log( value );
console.log( this.getCardUniqueId(color, value) );

				this.discardPileOne.addToStockWithId( this.getCardUniqueId(color, value), this.gamedatas.discardTopCard.id );

console.log( "this.discardPileOne" );
console.log( this.discardPileOne );
			} else {
console.log( "discardTopCard was null" );
			}

console.log( this.gamedatas.playerOrderTrue );

console.log("[bmc] this.gamedatas.enableWishList");
console.log( this.gamedatas.enableWishList );

			var isReadOnly = this.isReadOnly();
			
console.log("[bmc] spectatorMode:");
console.log( isReadOnly );

			// if ( isReadOnly ) { // If spectator then hide wishlist (spectators are readOnly)
			if ( this.isSpectator ) { // If spectator then hide wishlist (spectators are readOnly)
				
console.log("[bmc] spectator mode is true");
				var obj = { display: "none" };
				dojo.setAttr("wishListAreaC",          "style", obj );
				dojo.setAttr("wishListAreaS",          "style", obj );
				dojo.setAttr("wishListAreaH",          "style", obj );
				dojo.setAttr("wishListAreaD",          "style", obj );
				dojo.setAttr("wishListAreaWrap",       "style", obj );
				dojo.setAttr("myhand_wrap",            "style", obj );
				dojo.setAttr("TLeftBox",               "style", obj );
				dojo.setAttr("myHandArea",             "style", obj );
				dojo.setAttr("MYHANDTRANSLATED",       "style", obj );
				dojo.setAttr("myHandSize",             "style", obj );
				dojo.setAttr("myhand",                 "style", obj );
				dojo.setAttr("buttonPlayerSortBySet",  "style", obj );
				dojo.setAttr("SORTSETSTRANSLATED",     "style", obj );
				dojo.setAttr("buttonPlayerSortByRun",  "style", obj );
				dojo.setAttr("SORTRUNSTRANSLATED",     "style", obj );
				dojo.setAttr("buttonBuy",              "style", obj );
				dojo.setAttr("BUYTRANSLATED",          "style", obj );
				dojo.setAttr("buttonNotBuy",           "style", obj );
				dojo.setAttr("NOTBUYTRANSLATED",       "style", obj );
				dojo.setAttr("buttonLiverpool",        "style", obj );
				dojo.setAttr("buttonGoDownStatic",     "style", obj );
				dojo.setAttr("buttonShowHideWishList", "style", obj );
				dojo.setAttr("buttonSavePrep",         "style", obj );
				dojo.setAttr("buttonLoadPrep",         "style", obj );
				dojo.setAttr("voice",                  "style", obj );
				dojo.setAttr("LIVERPOOL",              "style", obj );
				dojo.setAttr("myPrepA",                "style", obj );
                dojo.setAttr("myPrepB",                "style", obj );
                dojo.setAttr("myPrepC",                "style", obj );
                dojo.setAttr("myPrepJoker",            "style", obj );

			} else if ( this.gamedatas.enableWishList == true ) {	// Show the wishlist stuff if they set the game up this way

console.log("[bmc] Wishlist was == true");

				dojo.query( '.wishListMode' ).removeClass( 'wishListMode' );

				this.wishListClubs = new ebg.stock();
				this.wishListSpades = new ebg.stock();
				this.wishListHearts = new ebg.stock();
				this.wishListDiamonds = new ebg.stock();
				this.wishListCardWidth = 36;
				this.wishListCardHeight = 48;

				// Create wishList area
				this.wishListClubs.create( this, $('myWishListClubs'), this.wishListCardWidth, this.wishListCardHeight );
				this.wishListSpades.create( this, $('myWishListSpades'), this.wishListCardWidth, this.wishListCardHeight );
				this.wishListHearts.create( this, $('myWishListHearts'), this.wishListCardWidth, this.wishListCardHeight );
				this.wishListDiamonds.create( this, $('myWishListDiamonds'), this.wishListCardWidth, this.wishListCardHeight );
				
				// this.showHideWishList = false;
				this.showHideWishList = true;

				// 13 images per row in the sprite file
				this.wishListClubs.image_items_per_row = 13;
				this.wishListSpades.image_items_per_row = 13;
				this.wishListHearts.image_items_per_row = 13;
				this.wishListDiamonds.image_items_per_row = 13;
				
				// Create 52 cards types:
				for (var value = 1; value <= 13; value++) {
					// Build card type id. Only create 52 here, 2 jokers below
				
					let wishListCardTypeClubID = this.getCardUniqueId(1, value);
					let wishListCardTypeSpadeID = this.getCardUniqueId(2, value);
					let wishListCardTypeHeartID = this.getCardUniqueId(3, value);
					let wishListCardTypeDiamondID = this.getCardUniqueId(4, value);

					this.wishListClubs.addItemType(wishListCardTypeClubID, wishListCardTypeClubID, g_gamethemeurl + 'img/4ColorCardsHalfSize.png', wishListCardTypeClubID);
					this.wishListClubs.addToStockWithId( this.getCardUniqueId( 1, value ) , value );

					this.wishListSpades.addItemType(wishListCardTypeSpadeID, wishListCardTypeSpadeID, g_gamethemeurl + 'img/4ColorCardsHalfSize.png', wishListCardTypeSpadeID);
					this.wishListSpades.addToStockWithId( this.getCardUniqueId( 2, value ) , value );

					this.wishListHearts.addItemType(wishListCardTypeHeartID, wishListCardTypeHeartID, g_gamethemeurl + 'img/4ColorCardsHalfSize.png', wishListCardTypeHeartID);
					this.wishListHearts.addToStockWithId( this.getCardUniqueId( 3, value ) , value );

					this.wishListDiamonds.addItemType(wishListCardTypeDiamondID, wishListCardTypeDiamondID, g_gamethemeurl + 'img/4ColorCardsHalfSize.png', wishListCardTypeDiamondID);
					this.wishListDiamonds.addToStockWithId( this.getCardUniqueId( 4, value ) , value );

					dojo.connect( $('myWishListClubs_item_' + value), 'onclick', this, 'onWishListCardClick');
					dojo.connect( $('myWishListSpades_item_' + value), 'onclick', this, 'onWishListCardClick');
					dojo.connect( $('myWishListHearts_item_' + value), 'onclick', this, 'onWishListCardClick');
					dojo.connect( $('myWishListDiamonds_item_' + value), 'onclick', this, 'onWishListCardClick');
						
				}
				this.wishListClubs.setOverlap( 80, 0 );
				this.wishListSpades.setOverlap( 80, 0 );
				this.wishListHearts.setOverlap( 80, 0 );
				this.wishListDiamonds.setOverlap( 80, 0 );


				// Get wishList settings from the server and apply to grid

				this.wishListAllObj = this.gamedatas.wishList;
				console.log("[bmc] this.wishListAll");
	//			console.log(this.wishListAllObj);
				
				this.wishListAll = Object.values(this.wishListAllObj);
				console.log(this.wishListAll);

				if ( this.wishListAll != null ){
					if ( this.wishListAll.length > 0 ) {
						
						this.setWishListColor( true );
						this.notif_wishListSubmitted();

						for ( item in this.wishListAll ) {
							console.log(item);
							console.log(this.wishListAll[ item ][ 'card_type' ]);
							//console.log('myWishListClubs_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');

							switch( this.wishListAll[ item ][ 'card_type' ]) {
								case '1' :
									console.log('myWishListClubs_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									dojo.addClass('myWishListClubs_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									break;
								case '2' :
									console.log('myWishListSpades_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									dojo.addClass('myWishListSpades_item_'   + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									break;
								case '3' :
									console.log('myWishListHearts_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									dojo.addClass('myWishListHearts_item_'   + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									break;
								case '4' :
									console.log('myWishListDiamonds_item_'    + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									dojo.addClass('myWishListDiamonds_item_' + this.wishListAll[ item ][ 'card_type_arg' ], 'wishListItem_selected');
									break;
							}
						}
					}
				}
			} else {
			
console.log("[bmc] Show what should be shown");

				// Show the hand area if not spectator
				// dojo.removeClass( 'wishListAreaWrap', "spectatorMode" );
				// dojo.removeClass( 'myhand_wrap', "spectatorMode" );	
				// dojo.removeClass('myhandArea', "spectatorMode");	

			}
			
console.log("[bmc] Make Deck, ");

			// Create the variables which show how many cards in each pile (deck, hand, discard)
			this.drawDeckSize = new ebg.counter();
			this.drawDeckSize.create( 'drawDeckSize' );
			this.drawDeckSize.setValue( this.gamedatas.deckIDs.length );
			
			this.myHandSize = new ebg.counter();
			this.myHandSize.create( 'myHandSize' );
			this.myHandSize.setValue( this.gamedatas.allHands[ this.player_id ] );
			
			this.handCount = this.gamedatas.allHands[ this.player_id ];
			
			// NEW DISCARD PILE HANDLING
			this.discardSize = new ebg.counter();
			this.discardSize.create( 'discardSize' );
			this.discardSize.setValue( this.gamedatas.discardSize );

			this.buyCount = {};
			this.handCount = {};

			for ( var player_id in this.gamedatas.players ) {
				// console.log("[bmc] Making buy counters.");
				// console.log( player_id );
				
				var player_board_div = $('player_board_' + player_id );
				// console.log("[bmc] player_board_div:");
				// console.log( player_board_div );
				
				var playergomoku = this.gamedatas.players[ player_id ];
			
				dojo.place( this.format_block( 'jstpl_player_board', playergomoku ), player_board_div );
				
				// Track the # of buys per player
				this.buyCount[ player_id ] = new ebg.counter();
				this.buyCount[ player_id ].create( 'buycount_p' + player_id );
				this.buyCount[ player_id ].setValue( this.gamedatas.buyCount[ player_id ] );

				this.handCount[ player_id ] = new ebg.counter();
				this.handCount[ player_id ].create( 'handcount_p' + player_id );
				this.handCount[ player_id ].setValue( this.gamedatas.allHands[ player_id ] );
			}

			// Create images for the Down Areas (1 stock for each)
			
			this.downArea_A_ = new Array();
			this.downArea_B_ = new Array();
			this.downArea_C_ = new Array();
			
            for ( var player in this.gamedatas.players) {
//console.log( "i: " + i);
// console.log(player);
				
				this.downArea_A_[player] = new ebg.stock(); // new stock object for the down cards

				// Create stock for Area A
				
				var containerName = 'playerDown_A_' + player;
				this.downArea_A_[player].create( this, $(containerName), this.cardwidth, this.cardheight );            
				this.downArea_A_[player].image_items_per_row = 13; // 13 images per row in the sprite file
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						// Build card type id. Only create 52 here, 2 jokers below
					
						let card_type_id = this.getCardUniqueId(color, value);
						this.downArea_A_[player].addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.downArea_A_[player].addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.downArea_A_[player].addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.downArea_A_[player].setOverlap( 10, 0 );

				// Create stock for Area B
				this.downArea_B_[player] = new ebg.stock(); // new stock object for the down cards
				var containerName = 'playerDown_B_' + player;
				this.downArea_B_[player].create( this, $(containerName), this.cardwidth, this.cardheight );            
				this.downArea_B_[player].image_items_per_row = 13; // 13 images per row in the sprite file
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						// Build card type id. Only create 52 here, 2 jokers below
					
						let card_type_id = this.getCardUniqueId(color, value);
						this.downArea_B_[player].addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.downArea_B_[player].addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.downArea_B_[player].addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.downArea_B_[player].setOverlap( 10, 0 );

				// Create stock for Area C
				this.downArea_C_[player] = new ebg.stock(); // new stock object for the down cards
				var containerName = 'playerDown_C_' + player;
				this.downArea_C_[player].create( this, $(containerName), this.cardwidth, this.cardheight );            
				this.downArea_C_[player].image_items_per_row = 13; // 13 images per row in the sprite file
				
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						// Build card type id. Only create 52 here, 2 jokers below
					
						let card_type_id = this.getCardUniqueId(color, value);
						this.downArea_C_[player].addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.downArea_C_[player].addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.downArea_C_[player].addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.downArea_C_[player].setOverlap( 10, 0 );

				// Show the cards in the down areas
//console.log("[bmc] SHOW THE CARDS IN DOWN AREAS");
//console.log(this.gamedatas);
				
				// Populate Area A
				for ( var cardIndex in this.gamedatas.downArea_A_[ player ]) {
// console.log("[bmc] CARD IN DOWN AREA:");
					card = this.gamedatas.downArea_A_[ player ][ cardIndex ];
// console.log(card);
					var card_id = card.id;
					var color = card.type;
					var value = card.type_arg;
// console.log("[bmc] 3 VALUES:");
// console.log(card_id);
// console.log(color);
// console.log(value);
					this.downArea_A_[ player ].addToStockWithId( this.getCardUniqueId( color, value ), card_id );
				}
				
				// Populate Area B
				for ( var cardIndex in this.gamedatas.downArea_B_[ player ]) {
// console.log("[bmc] CARD IN DOWN AREA:");
					card = this.gamedatas.downArea_B_[ player ][ cardIndex ];
// console.log(card);
					var card_id = card.id;
					var color = card.type;
					var value = card.type_arg;
// console.log("[bmc] 3 VALUES:");
// console.log(card_id);
// console.log(color);
// console.log(value);
					this.downArea_B_[ player ].addToStockWithId( this.getCardUniqueId( color, value ), card_id );
				}
				// Populate Area C
				for ( var cardIndex in this.gamedatas.downArea_C_[ player ]) {
// console.log("[bmc] CARD IN DOWN AREA:");
					card = this.gamedatas.downArea_C_[ player ][ cardIndex ];
// console.log(card);
					var card_id = card.id;
					var color = card.type;
					var value = card.type_arg;
// console.log("[bmc] 3 VALUES:");
// console.log(card_id);
// console.log(color);
// console.log(value);
					this.downArea_C_[ player ].addToStockWithId( this.getCardUniqueId( color, value ), card_id );
				}

				// Use the CSS style definition .stockitem_selected
				this.downArea_A_[ player ].setSelectionAppearance( 'class' );
				this.downArea_B_[ player ].setSelectionAppearance( 'class' );
				this.downArea_C_[ player ].setSelectionAppearance( 'class' );
				
				// Add playername text to down areas
				$("playerDown_A_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_B_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_C_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];

				// New stock objects for the prep areas
				this.myPrepA = new ebg.stock();
				this.myPrepB = new ebg.stock();
				this.myPrepC = new ebg.stock();
				this.myPrepJoker = new ebg.stock();
				
				this.myPrepA.create( this, $('myPrepA'), this.cardwidth, this.cardheight );
				this.myPrepB.create( this, $('myPrepB'), this.cardwidth, this.cardheight );
				this.myPrepC.create( this, $('myPrepC'), this.cardwidth, this.cardheight );
				this.myPrepJoker.create( this, $('myPrepJoker'), this.cardwidth, this.cardheight );
				
				//var tooltip_myPrep = _('To go down, put 1 meld per prep area per the Target Hand. To take a joker, PREP full melds and 1 partial meld (2 cards for a set or 3 cards for a run). Put the card to replace the joker in the area CARD FOR JOKER. Select board joker. Click GO DOWN.');

				//this.addTooltipHtmlToClass('myPrepA', tooltip_myPrep);
				this.myPrepA.image_items_per_row = 13;
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						let card_type_id = this.getCardUniqueId(color, value);
						this.myPrepA.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.myPrepA.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.myPrepA.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.myPrepA.setOverlap( 10, 0 );

				//this.addTooltipHtmlToClass('myPrepB', tooltip_myPrep);
				this.myPrepB.image_items_per_row = 13;
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						let card_type_id = this.getCardUniqueId(color, value);
						this.myPrepB.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.myPrepB.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.myPrepB.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.myPrepB.setOverlap( 10, 0 );

				//this.addTooltipHtmlToClass('myPrepC', tooltip_myPrep);
				this.myPrepC.image_items_per_row = 13;
				for (var color = 1; color <= 4; color++) {
					for (var value = 1; value <= 13; value++) {
						let card_type_id = this.getCardUniqueId(color, value);
						this.myPrepC.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
					}
				}
				this.myPrepC.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
				this.myPrepC.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
				this.myPrepC.setOverlap( 10, 0 );
			}
			
			//this.addTooltipHtmlToClass('myPrepJoker', tooltip_myPrep);
			this.myPrepJoker.image_items_per_row = 13;
            for (var color = 1; color <= 4; color++) {
                for (var value = 1; value <= 13; value++) {
					let card_type_id = this.getCardUniqueId(color, value);
					this.myPrepJoker.addItemType(card_type_id, card_type_id, g_gamethemeurl + 'img/4ColorCardsx5.png', card_type_id);
                }
            }
            this.myPrepJoker.addItemType( 52, 52, g_gamethemeurl + 'img/4ColorCardsx5.png', 52) // Color 5 Value 1
            this.myPrepJoker.addItemType( 53, 53, g_gamethemeurl + 'img/4ColorCardsx5.png', 53) // Color 5 Value 2
            this.myPrepJoker.setOverlap( 10, 0 );			

			this.goneDown = new Array();
//			console.log(this.gamedatas);
//			console.log(this.gamedatas.players);

			console.log( this.gamedatas.liverpoolExists );

			// Players asked to hide LIVERPOOL condition. If you don't want it hidden, uncomment this IF:
			// if ( this.gamedatas.liverpoolExists == 1 ){ // 0=Not exist; 1=Exists
				// dojo.replaceClass( 'buttonLiverpool', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
			// }
		
			for (var player in this.gamedatas.players) {
 console.log(player);
				this.goneDown[ player ] = parseInt( this.gamedatas.goneDown[ player ]);
console.log("[bmc] this.gonedown[]:");
console.log(this.goneDown[player]);
				if ( this.goneDown[ player ] == 1 ) {
console.log("[bmc] lighting ", player );
console.log('overall_player_board_' + player, 'playerWentDown' );
					dojo.addClass( 'overall_player_board_' + player, 'playerWentDown' );
				}
			}
			
			if ( this.goneDown[ this.player_id ] == 1 ) { // If we went down, gray the buttons
				dojo.replaceClass( 'buttonLoadPrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonSavePrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			}

console.log(this.player_id);
console.log("[bmc] DOJO CONNECT Stuff:");

			dojo.connect( $('myhand'), 'ondblclick', this, 'onPlayerHandDoubleClick' );

            dojo.connect( this.playerHand,   'onChangeSelection', this, 'onPlayerHandSelectionChanged' );
            // dojo.connect( this.deckOne,      'onChangeSelection', this, 'onDeckSelectionChanged' );
            dojo.connect( this.deckAll,      'onChangeSelection', this, 'onDeckSelectionChanged' );
            //dojo.connect( this.discardPile,  'onChangeSelection', this, 'onDiscardPileSelectionChanged' );
            dojo.connect( this.discardPileOne,  'onChangeSelection', this, 'onDiscardPileSelectionChanged' );
//			dojo.connect( $('discardPile' ), 'onclick',           this, 'onDiscardPileSelectionChanged');
			dojo.connect( $('discardPileOne' ), 'onclick',           this, 'onDiscardPileSelectionChangedClick');
			dojo.connect( $('myhand' ),      'onclick',           this, 'onMyHandAreaClick');
			//dojo.connect( $('wantedArea' ),      'onclick',           this, 'onWantedAreaClick');

			//dojo.connect( $('deck'), 'onclick', this, 'onDeckSelectionChanged');

			// Set the cards in the down areas as clickable, so players can play on them and trade for jokers
			
console.log("[bmc] DOWN CARD SELECT SETUP");
			
			for ( var player in this.gamedatas.players) {
//				console.log( 'playerDown_A_, _B_, and _C_' + player);
				dojo.connect( this.downArea_A_[player], 'onChangeSelection', this, 'onDownAreaSelect' );
				dojo.connect( this.downArea_B_[player], 'onChangeSelection', this, 'onDownAreaSelect' );
				dojo.connect( this.downArea_C_[player], 'onChangeSelection', this, 'onDownAreaSelect' );
			}

			// Set the down area for this player only, to pull cards back to hand before they go down
			dojo.connect( $('myPrepA'), 'onclick', this, 'onDownAreaAClick');
			dojo.connect( $('myPrepB'), 'onclick', this, 'onDownAreaBClick');
			dojo.connect( $('myPrepC'), 'onclick', this, 'onDownAreaCClick');
			dojo.connect( $('myPrepJoker'), 'onclick', this, 'onDownAreaJokerClick');

			// dojo.connect( this.myPrepA, 'onChangeSelection', this, 'onDownAreaSelect' );
			// dojo.connect( this.myPrepB, 'onChangeSelection', this, 'onDownAreaSelect' );
			// dojo.connect( this.myPrepC, 'onChangeSelection', this, 'onDownAreaSelect' );
			// dojo.connect( this.myPrepJoker, 'onChangeSelection', this, 'onDownAreaSelect' );

			dojo.connect( this.myPrepA, 'onChangeSelection', this, 'onDownAreaAClick' );
			dojo.connect( this.myPrepB, 'onChangeSelection', this, 'onDownAreaBClick' );
			dojo.connect( this.myPrepC, 'onChangeSelection', this, 'onDownAreaCClick' );
			dojo.connect( this.myPrepJoker, 'onChangeSelection', this, 'onDownAreaJokerClick' );

			// Connect up the buy buttons
			dojo.connect( $('buttonPlayerSortBySet'), 'onclick', this, 'onPlayerSortByButtonSet' );
			dojo.connect( $('buttonPlayerSortByRun'), 'onclick', this, 'onPlayerSortByButtonRun' );

			// dojo.connect( $('buttonPrepAreaA'), 'onclick', this, 'onPlayerPrepArea_A_Button' );
			// dojo.connect( $('buttonPrepAreaB'), 'onclick', this, 'onPlayerPrepArea_B_Button' );
			// dojo.connect( $('buttonPrepAreaC'), 'onclick', this, 'onPlayerPrepArea_C_Button' );
			// dojo.connect( $('buttonPrepJoker'), 'onclick', this, 'onPlayerPrepJoker_Button' );
			
			dojo.connect( $('buttonSavePrep'), 'onclick', this, 'onPlayerSavePrep_Button' );
			dojo.connect( $('buttonLoadPrep'), 'onclick', this, 'onPlayerLoadPrep_Button' );

			dojo.connect( $('buttonGoDownStatic'), 'onclick', this, 'onPlayerGoDownButton' );

			dojo.connect( $('buttonBuy'), 'onclick', this, 'onPlayerBuyButton' );
			dojo.connect( $('buttonNotBuy'), 'onclick', this, 'onPlayerNotBuyButton' );

			dojo.connect( $('voice'), 'onclick', this, "onVoiceCheckbox");

			dojo.connect( $('buttonShowHideWishList'), 'onclick', this, "onShowHideWishList");
			dojo.connect( $('buttonSubmitWishList'), 'onclick', this, 'onSubmitWishList' );
			dojo.connect( $('buttonClearWishList'), 'onclick', this, 'onClearWishList' );

			dojo.connect( $('buttonLiverpool'), 'onclick', this, "onLiverpoolButton");

			let tooltip_text1 = _('Click this button to disable and clear the wish list.');

			this.addTooltipHtmlToClass('buttonClearWishList', tooltip_text1);

			let tooltip_text2 = _('If you wish to buy while away from play, do 3 things: (1) Select cards from the small grid; (2) Click this button; (3) Wait for someone a matching discard. If no one ahead of you wants to buy it, the game will buy 1 card and disable the wish list.  Clicking an additional card in the wish list will disable it until you again click SUBMIT.');

			this.addTooltipHtmlToClass('buttonSubmitWishList', tooltip_text2);

			let tooltip_myPrepA = _('To go down, select cards for one meld & click a meld button or meld area (1 meld per area). See the cards move. To take a joker while going down, prepare all melds and 1 partial meld. Select the board joker. Put an appropriate card to replace the joker in CARD FOR JOKER. Click GO DOWN.');

			this.addTooltipHtmlToClass('prepButton', tooltip_myPrepA);

			let tooltip_saveload = _('To save contents of the prep areas click SAVE PREP. To later reload them click LOAD PREP.');

			this.addTooltipHtmlToClass('saveload', tooltip_saveload);

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();
			
			this.currentHandType = this.gamedatas.currentHandType;
			this.totalHandCount = this.gamedatas.totalHandCount;
			currentHandNumber = parseInt (this.currentHandType) + 1;
			
			//this.showHideButtons(); // Show the buttons

            console.log( "[bmc] game setup: About to do onPlayerSortButton:" );
			
			this.onPlayerSortByButton(); // click it once because the default is runs
			
            console.log( "[bmc] game setup: About to do showBuyButton:" );
			console.log( this.player_id );
			console.log( this.gamedatas.buyers[ this.player_id ] );
			
			this.turnPlayer = this.gamedatas.activeTurnPlayer_id;
			
			if (this.player_id == this.turnPlayer ) {
				dojo.addClass('myhand_wrap', "borderDrawer");				
			}
			// Draw a border around the discard pile so players know where to click
			dojo.addClass('discardPileOne', 'discardPileArea');
			
			// If this the first load and it's not our turn, then show the BUY buttons. Or,
			// if buy status is unknown and it's not our turn and not
			// the next player's turn, and the state is playerTurnDraw
			// then show BUY buttons.
			// (0==unknown, 1==Not buying 2==Buying) 

			// this.buyTimeInSecondsDefault = this.gamedatas.options.buyTimeInSeconds;
			// console.log( this.buyTimeInSecondsDefault );
			
			console.log("[bmc] Buy setup");
			console.log(this.firstLoad);
			console.log(this.player_id);
			console.log(this.gamedatas.buyCount[ this.player_id ]);
			console.log(this.turnPlayer);

			// Show neither buy nor notBuy buttons if:
			//   It's my turn
			//
			// Show buy button if:
			//   First load
			//   Not my turn
			//   undefined or not buying (0 or 1)
			//
			// Show not buy button if:
			//   First load
			//   Not my turn
			//   Status is buying (2)
			//
			this.clearButtons();

			if (( this.player_id != this.gamedatas.activeTurnPlayer_id ) &&
			    ( this.player_id != this.gamedatas.discardingPlayer_id)) {
			    if (( this.gamedatas.buyers[ this.player_id ] == 0 ) || // buy undefined
					( this.gamedatas.buyers[ this.player_id ] == 1 )) { // buy notbuying
					this.showBuyButton2();
					console.log("showBuyButton");
				} else {
					this.showNotBuyButton();
					console.log("showNotBuyButton");
				}
			}

// Debug CSS comment / uncomment these:
// });

			$(handNumber).innerHTML = _("Target Hand ") + currentHandNumber + _(" of ") + this.totalHandCount + ": ";
			$(redTarget).innerHTML = this.gamedatas.handTarget;
			console.log( $(redTarget) );
			if ( this.gamedatas.gameVersion ) {
				$('gameVersion').innerHTML = 'v' + this.gamedatas.gameVersion;
			}
			
			// After they refresh, if they already requested buy, don't let them try to buy again
			if ( this.gamedatas.buyers[ this.player_id ] == 2 ) {
				this.buyRequested = true;
			} else {
				this.buyRequested = false;
			}

			// Highlight the potential buyer, if any
			for ( let player_id in this.gamedatas.buyers ) {
				if ( this.gamedatas.buyers[ player_id ] == 2 ) {
					dojo.addClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
					console.log(player_id);
				}
			}
			
//			let gda = this.gamedatas.playerorder.length * 114;
			let gda = ( Object.keys( this.gamedatas.playerOrderTrue ).length - 1 ) * 120;
            console.log( "height: " + gda + "px;" );
			dojo.setStyle( 'goDownArea_wrap', "height: " + gda + "px;" );

			// Move the board jokers, if any, to appropriate places, after the window has loaded
//			window.onload = function() {
console.log("[bmc] Doing the window.onload");
			window.onload = this.sortBoard();
			
//console.log("[bmc] fake onplayersortbybutton");
//				this.onPlayerSortByButton(); // click it once because the default is runs

				// extraJokerArray = "";
				
				// setTimeout(
					// this.removeJokerBorder( extraJokerArray ), 2000
				// );


				//this.onPlayerSortByButton(), 10000
				// setTimeout(
					// this.sortBoard(), 10000
				// );

			// Get status of the voices box
			if ( $('voice').checked ) {
				console.log("Voices CHECKED");
				this.voices = true;
			} else {
				console.log("Voices UNCHECKED");
				this.voices = false;
			}

			// Keep track every card if someone declared LP or not
			this.someoneLP = false;
			console.log( "Setting someoneLP false");

			// Run through the function onDiscardPileSelectionChanged only once by checking this variable
			this.alreadyODPSC = false;
			this.alreadyODeckSC = false;
			
			// Get status of the wishList box
			// if ( $('wishListEnabled').checked ) {
				// console.log("WishList CHECKED");
				// this.wishListEnabled = true;
			// } else {
				// console.log("WishLIst UNCHECKED");
				// this.wishListEnabled = false;
			// }

			// Color wishlist appropriately if it's on or off
			this.setWishListColor( this.wishListEnabled );
		
			// Define table text variables which can be translated by each client. Each ID must be unique. The syntax for translation is underscore parentheses _('').
			$(MYHANDTRANSLATED).innerHTML = _('My Hand'); 
			// $(CARDFORJOKERTRANSLATED).innerHTML = _('Card For Joker');
			$(CARDFORJOKERTRANSLATED2).innerHTML = _('Card For Joker');
			$(BUYTRANSLATED).innerHTML = _('Buy');
			$(NOTBUYTRANSLATED).innerHTML = _('Not Buy');
			$(SORTSETSTRANSLATED).innerHTML = _('Sort Sets');
			$(SORTRUNSTRANSLATED).innerHTML = _('Sort Runs');
			$(GODOWNTRANSLATED).innerHTML = _('Go Down');
			$(DRAWDECKTRANSLATED).innerHTML = _('Draw Deck');
			$(DISCARDPILETRANSLATED).innerHTML = _('Discard Pile');
			$(WISHLISTTRANSLATED).innerHTML = _('Submit Wish List');
			$(CLEARWISHLISTTRANSLATED).innerHTML = _('Clear Wish List');
			$(SHOWHIDEWISHLIST).innerHTML = _('Show / Hide Wish List');
			$(LIVERPOOL).innerHTML = _('Liverpool');
			$(PREPATRANSLATED).innerHTML = _('Prep A');
			$(PREPBTRANSLATED).innerHTML = _('Prep B');
			$(PREPCTRANSLATED).innerHTML = _('Prep C');
			// $(BUTPREPATRANSLATED).innerHTML = _('Prep A');
			// $(BUTPREPBTRANSLATED).innerHTML = _('Prep B');
			// $(BUTPREPCTRANSLATED).innerHTML = _('Prep C');
			$(BUTSAVEPREPTRANSLATED).innerHTML = _('Save Prep');
			$(BUTLOADPREPTRANSLATED).innerHTML = _('Load Prep');
			$(VOICESTRANSLATED).innerHTML = _('Voices');

console.log( this.gamedatas.tabletop );

			// Draw the tabletop, based on selected option
			if (  this.gamedatas.tabletop == 0 ){ // 1 = Yellow ; 0 = Sky
				dojo.removeClass( 'goDownArea_wrap', 'goDownWrapYellowTable' );
				dojo.addClass(    'goDownArea_wrap', 'goDownWrapSkyOverField' );
			} else {
				dojo.removeClass( 'goDownArea_wrap', 'goDownWrapSkyOverField' );
				dojo.addClass(    'goDownArea_wrap', 'goDownWrapYellowTable' );
			}

            console.log( "[bmc] EXIT game setup" );
        },

    }, LRCardHelpers, LRBoardDisplay, LRStateHandlers, LRDrawDeck, LRHandInteraction, LRDownArea, LRBuying, LRWishlist, LRPrepArea, LRCardPlaying, LRLiverpool, LRNotifications, LRUIHelpers));
/////////
/////////
////////////////////////////////////////////////////////////
///////////// Game & client states
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
/////////
/////////
/////////
        // From this point and below, you can write your game notifications handling methods
        
        // Example:
        
        // notif_cardPlayed: function( notif )
        // {
            // console.log( 'notif_cardPlayed' );
            // console.log( notif );
            
            // Note: notif.args contains the arguments specified during your
			// "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        // },    
        
});