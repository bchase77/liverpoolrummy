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
    return declare("bgagame.liverpoolrummy", ebg.core.gamegui, {
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
// 2025-01-19: I am at table 618031393
//
// 2025-01-19: Down card doesn't slide after go DOWN nor joker swap?
//
// 2025-01-19: Make the wishlist buy after the person draws
// 
// Card backs: maybe grapes or beach or palm trees... Not winter because it's summer in Australia 
//
// 19/01 12:29:57 [error] [T617611414] [1.159.82.180] [91612041/Lindajak] Error with notification service
// (code: 0, "cURL error 28: Connection timed out after 1001 milliseconds (see
//  https://curl.haxx.se/libcurl/c/libcurl-errors.html) for http://ws.boardgamearena.com/bgamsg") first
//  error (message length = 825). Automatic retry - /player/p89557171 - 65703dba0f1665eca0e87129089903af
//  - drawCard","log":"","....  
// 2025-01-19: Add delay between draw and discard. Reason: Derusian and others are able to quickly
//     draw and discard, not giving others a chance to buy.
//
// 29/12 15:40:39 [error] [T607825961] [126.60.172.101] [97104249/osorairo] Unexpected exception:
//     Can't manage zombie player in this game state (40)
// #0 /var/tournoi/release/tournoi-241223-1616-gs/www/include/APP_GameAction.inc.php(256): Table->checkReturnState()
// #1 /var/tournoi/release/tournoi-241223-1616-gs/www/include/APP_GameAction.inc.php(249):
//     APP_GameAction->ajaxResponseWithResult(NULL)
// #2 /var/tournoi/release/tournoi-241223-1616-gs/www/include/APP_GameAction.inc.php(195): APP_GameAction->ajaxResponse()
// #3 /var/tournoi/release/tournoi-241223-1616-gs/www/include/APP_GameAction.inc.php(602): APP_GameAction->wakeup()
// #4 /var/tournoi/release/tournoi-241223-1616-gs/www/include/webActionCore.inc.php(198):
//     APP_GameAction->performServerAction('...')
// #5 /var/tournoi/release/tournoi-241223-1616-gs/www/index.php(356):
//     launchWebAction('...', '...', '...', false, false, NULL, true, false)
// #6 {main}
// http://boardgamearena.com/8/liverpoolrummy/liverpoolrummy/wakeup.html?myturnack=true&table=607825961		
//
// TODO 12/29/2024: Joker replacements go to the wrong player.
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

            console.log( "[bmc] EXIT game setup" );
        },
/////////
/////////
////////////////////////////////////////////////////////////
///////////// Game & client states
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args ) {
            console.log( 'ENTER onEnteringState: ' + stateName );
			console.log( args );
			console.log( this.player_id);
			console.log( this.gamedatas.gamestate.active_player );
			console.log( this.gamedatas.activeTurnPlayer_id );

			console.log("[bmc] STATENAME:");
			console.log(stateName);

//			this.showHideButtons();
            
			switch( stateName ) {
								
				case 'newHand':
					console.log("[bmc] FOUND newHand");
					break;
				case 'playerTurnDraw':
					console.log("[bmc] FOUND PlayerTurnDraw");

					// Make it clear to the player they need to draw a card (border around card)
					if ( args.active_player == this.player_id ) {
						// var deck_items = this.deckOne.getAllItems();
	// console.log("[bmc] ALL deckOne:");
	// console.log(deck_items);
						// for ( let i in deck_items ) {
//	console.log( 'deckOne_item_' + deck_items[i]['id'] );
//	console.log( $('deckOne_item_' + deck_items[i]['id'] ));
							// dojo.addClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
						// }




						var deckAllItems = this.deckAll.getAllItems();
	console.log(deckAllItems);
						for ( let i in deckAllItems ) {
							dojo.addClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
						}

// TODO: MAKE discardpile only 1 card. Doing this in PHP, to try it there

//						var dp_items = this.discardPile.getAllItems();
						var dp_items = this.discardPileOne.getAllItems();
	console.log("[bmc] ALL discardPile:");
	console.log(dp_items);
						for ( let i in dp_items ) {
//							dojo.addClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
							dojo.addClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
						}
					} else {
						// for ( let i in deck_items ) {
							// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
						// }



						for ( let i in deckAllItems ) {
							dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
						}



						for ( let i in dp_items ) {
//							dojo.removeClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
							dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
						}
					}
					break;
				case 'checkEmptyDeck':
					console.log("[bmc] FOUND checkEmptyDeck");
					break;
				case 'drawDiscard':
					console.log("[bmc] FOUND drawDiscard");
					// Clear the buy requests since they cannot go through
					for ( player_id in this.gamedatas.players ) { 
						dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
					}
					break;
				case 'playerTurnPlay':
					console.log("[bmc] FOUND PlayerTurnPlay");
					//this.showHideButtons();
					break;
				case 'nextPlayer':
					console.log("[bmc] FOUND nextPlayer");
					break;
				case 'endHand':
					console.log("[bmc] FOUND endHand");
					this.playedSoundWentOut = false; // Reset to play the sound only once
					break;
				case 'resolveBuyers':
					console.log("[bmc] FOUND resolveBuyers");
					for ( player_id in this.gamedatas.players ) { 
						dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
					}
					break;
				case 'playerWantsToBuy':
					console.log("[bmc] FOUND playerWantsToBuy");
					break;
				case 'playerDoesNotWantToBuy':
					console.log("[bmc] FOUND playerDoesNotWantToBuy");
					break;
				case 'turnPlayerDrawingResolveBuyers':
					console.log("[bmc] FOUND turnPlayerDrawingResolveBuyers");
					break;
				case 'turnPlayerDrawFromDeck':
					console.log("[bmc] FOUND turnPlayerDrawFromDeck");
					break;
				case 'playCard':
					console.log("[bmc] FOUND playCard");
					break;
				case 'playerGoDown':
					console.log("[bmc] FOUND playerGoDown");
					break;
				case 'liverpoolDraw':
					console.log("[bmc] FOUND Liverpool and being processed");
					this.displayItsYourTurn( args.active_player, 'liverpool' );
					break;
				default:
					console.log("[bmc] OES DEFAULT");
//					this.showHideButtons();
					break;
            }
            // Example:
           
            // case 'myGameState':
            
                // Show some HTML block at this game state
                // dojo.style( 'my_html_block_id', 'display', 'block' );
                
                // break;
            // Example end
			
			console.log( 'EXITING ENTERING state: ' + stateName );
        },
/////////
/////////
/////////
        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName ) {
            console.log( 'Leaving state: ' + stateName );
            
            switch( stateName )
            {
            
             // Example:
            
            // case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                // dojo.style( 'my_html_block_id', 'display', 'none' );
                
                // break;
           
            case 'dummmy':
                break;
            }            
		}, 
/////////
/////////
/////////
        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
		onUpdateActionButtons : function( stateName, args ) {
console.log( '[bmc] ENTER onUpdateActionButtons: ' + stateName );
console.log( args );
console.log( this.player_id );

			// If someone clicked their button 'On To The Next' just ignore it
			// and replace the button. The state machine will continue after ALL have clicked.
			if ( stateName == 'wentOut' ) {
				if ( this.playedSoundWentOut == false ) {
					this.playedSoundWentOut = true;
					if ( this.voices ) {
						playSound('tutorialrumone_wentOutYeah');
					}
				}
				this.showReviewButton( args.player_id );
				return;
			}

console.log( '[bmc] EXIT onUpdateActionButtons: ' + stateName );
		},
/////////
/////////
/////////
		onPlayerReviewedHandButton : function() {
console.log("[bmc] ENTER onPlayerReviewedHandButton");
			this.dealMeInClicked = true;
			this.clearButtons();

			// var action = 'playerHasReviewedHand';
			
			var newAction = 'actPlayerHasReviewedHand';
			
			this.bgaPerformAction( newAction, { // 'actPlayerHasReviewedHand'
//				player_id : this.player_id,
			});


			// if (this.checkAction( action, true)) {
				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
				// });
			// }
		},
/////////
/////////
/////////
		onVoiceCheckbox : function() {
console.log("[bmc] ENTER onVoiceCheckbox");
			if ( $('voice').checked ) {
				console.log("CHECKED");
				this.voices = true;
			} else {
				console.log("UNCHECKED");
				this.voices = false;
			}
		},
/////////
/////////
/////////
		// onWishListCheckbox : function() {
// console.log("[bmc] ENTER onWishListCheckbox");
			// if ( $('wishListEnabled').checked ) {
				// console.log("WL CHECKED");
				// this.wishListEnabled = true;
				// this.setWishListColor( this.wishListSubmitted );
			// } else {
				// console.log("WL UNCHECKED");
				// this.wishListEnabled = false;
				// this.setWishListColor( false );
			// }
// console.log("[bmc] EXIT onWishListCheckbox");
		// },
/////////
/////////
/////////
		onPlayerBuyButton : function() {
console.log("[bmc] ENTER onPlayerBuyButton");
console.log(this.discardPileOne);
console.log(this.isSpectator);

			if ( !this.isSpectator ){
				var dpCard = this.discardPileOne.getAllItems();
	console.log(dpCard);
				if (dpCard.length > 0) {
					console.log("discardpile has a card");
					this.reallyBuy();
				}
			}
			return; // nothing should be called or done after calling this, all action must be done in the handler  
		},
/////////
/////////
/////////
		isEven : function (n) {
			return n % 2 == 0;
		},
/////////
/////////
/////////
		reallyBuy : function() {
			//this.clearButtons();
			// Do not acknowledge the buy if it's not our turn
			// if ( this.player_id == this.turnPlayer ) {
// console.log("[bmc] sound: It's Your Turn");
				// playSound( 'tutorialrumone_ItsYourTurn' );
			// } else {
				
				// Make sure there is a card to buy
				// Make sure we have buys remaining

console.log(this.buyRequested);
console.log(this.firstLoad);
console.log("[bmc] this.buyCount:", this.buyCount[ this.player_id ][ 'current_value' ]);

			if ( this.discardPileOne.length != 0 ) {
				if ( this.buyCount[ this.player_id ][ 'current_value' ] > 0 ) {

					// var action = 'buyRequest';
					var newAction = 'actBuyRequest';
//console.log(this.checkPossibleActions( action, true ));

					// If PHP is not resolving buyers then let the client try to buy
					if ( this.resolvingBuyers != true ) {

	//					if (( this.checkPossibleActions( action, true )  ||
	//						( this.firstLoad == 'Yes' )) && 
						if ( this.buyRequested != true ) {
							
							// Keep track so the button can only be hit once
							this.buyRequested = true;

							// console.log("[bmc] ajax " + action );

							this.bgaPerformAction( newAction, { // 'actBuyRequest'
								// player_id : this.player_id,
							},{ 
								checkAction: false,
								checkPossibleActions: false
							});
							
							// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
									// player_id : this.player_id,
									// lock : true
								// }, this, function(result) {
								// }, function(is_error) {
							// });
						} else {
							console.log("[bmc] Buy already requested or not allowed now");
						}
					}
				} else { // Turn off the BUY button
					this.clearButtons();
				}
			}
		},
/////////
/////////
/////////
		onPlayerNotBuyButton : function() {
console.log("[bmc] ENTER onPlayerNotBuyButton");
			// this.clearButtons();
			////this.stopActionTimer2();
			// console.log(this.gamedatas);
			
			// var action = 'notBuyRequest';
			var newAction = 'actNotBuyRequest';
			
//console.log( "[bmc] checkaction: " + this.checkPossibleActions( action, true));
console.log( "[bmc] buyrequested: " + this.buyRequested);

//			if ( this.checkPossibleActions( action, true) && ( this.buyRequested == true)) {
			if ( this.buyRequested == true ) {
				// console.log("[bmc] ajax " + action );
				
				this.bgaPerformAction( newAction, { // 'actNotBuyRequest'
					player_id : this.player_id,
				},{ 
					checkAction: false,
//						checkPossibleActions: true 
				});

				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
				// });
				
				// Clear out the buy request
				this.buyRequested = false;
				
			} else {
				console.log( "[bmc] checkAction false");
			}
		},
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Utility methods
        //
        // Here, you can defines some utility methods that you can use everywhere in your javascript script.
        //
        // Get card unique identifier based on its color and value (e.g. Ace of clubs is 0)
        getCardUniqueId : function(color, value) {
			var cui = (color - 1) * 13 + (value - 1); // Offset depending upon the image sprite file
//			console.log("return: " + cui)
            return cui;
        },
		
		getColorValue : function( type ) {
			color = parseInt ( type / 13) + 1;
			value = type - (( color - 1 ) * 13 ) + 1;
			
			return [ color, value ];
		},

/////////
/////////
/////////
        getXPixelCoordinates: function( intersection_x ) {
       	return this.gameConstants['X_ORIGIN'] + intersection_x * (this.gameConstants['INTERSECTION_WIDTH'] + this.gameConstants['INTERSECTION_X_SPACER']); 
        },
/////////
/////////
/////////
        getYPixelCoordinates: function( intersection_y ) {
       	return this.gameConstants['Y_ORIGIN'] + intersection_y * (this.gameConstants['INTERSECTION_HEIGHT'] + this.gameConstants['INTERSECTION_Y_SPACER']); 
        },
/////////
/////////
/////////

//11/3 TODO:  Validate this can go through the board areas properly.
//Maybe just do it after a card is played onto a run and after someone goes down.

		sortBoard : function( ) {
console.log( "[bmc] ENTER sortBoard" );
			for ( var player in this.gamedatas.players ) {
// console.log("SORTBOARD player");
// console.log(player);
				cards = this.downArea_A_[ player ].getAllItems();
// console.log(cards);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_A', player );
// console.log("[bmc] NEWRUN_board_a" );
// console.log( weightChange );
					this.downArea_A_[ player ].items = weightChange;
					this.downArea_A_[ player ].updateDisplay();
					// this.downArea_A_[ player ].changeItemsWeight( weightChange );
				}

				cards = this.downArea_B_[ player ].getAllItems();
// console.log("[bmc] BOSS CARDS");
// console.log(cards);
// console.log(this.downArea_B_[ player ]);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_B', player );
// console.log( weightChange );
// console.log("[bmc] NEWRUN_board_b" );
// console.log( weightChange );
					this.downArea_B_[ player ].items = weightChange;
					this.downArea_B_[ player ].updateDisplay();
//					this.downArea_B_[ player ].changeItemsWeight( weightChange );
				}
				
				cards = this.downArea_C_[ player ].getAllItems();
// console.log(cards);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_C', player );
// console.log("[bmc] NEWRUN_board_c" );
// console.log( weightChange );
					this.downArea_C_[ player ].items = weightChange;
					this.downArea_C_[ player ].updateDisplay();
//					this.downArea_C_[ player ].changeItemsWeight( weightChange );
				}
			}
			//this.updateCardsDisplay();

console.log( "[bmc] EXIT sortBoard" );
		},
/////////
/////////
/////////
		addJokerBorder : function( jokers ){
console.log("[bmc] Enter addJokerBorder");
// console.log( jokers );

			// for ( joker of jokers ) {

// console.log("[bmc] REALLY Add GREEN BORDER1");
// console.log(joker);
// console.log($(joker));

			// return;

				// if ( $(joker) != null ) {
					// dojo.addClass( joker, 'stockitem_extraJoker' );
					// if ( $(joker).classList.contains( "stockitem_selected" )) {
						// if ( $(joker).classList.contains( "blink" )) {
							// dojo.removeClass( joker, "blink" );
						// } else {
							// dojo.addClass( joker, "blink" );
						// }
					// }
				// }
			// }

console.log("[bmc] Exit addJokerBorder");
		},
/////////
/////////
/////////
		removeJokerBorder : function( jokers ){
console.log("[bmc] Enter removeJokerBorder");
// console.log( jokers );

			for ( joker of jokers ) {

// console.log("[bmc] REALLY Removing GREEN BORDER1");
// console.log(joker);
// console.log($(joker));

				if ( $(joker) != null ) {
					dojo.removeClass( joker, 'stockitem_extraJoker' );
				}
			}

console.log("[bmc] Exit removeJokerBorder");
		},
/////////
/////////
/////////
		sortRun : function( boardCards ) {
console.log( "[bmc] ENTER sortRunNew" );

/*
Dec 27 2024
todo: CAn return early but if 2089 is returned then nothing is drawn on the board. Then not sure how to go down (cannot play joker onto a meld.

It worked when the board sort was there. Maybe becuase then the variabl is not empty?!?!
*/
console.log( this.gamedatas.runsNeeded );
			if ( this.gamedatas.runsNeeded == 0 ) {
console.log( "[bmc] No runs needed, return." );
				return boardCards;
			}
// console.log( boardCards );

			if ( boardCards.length != 0 ) {
				var cards = new Array();

				var foundAnAce = false;
				
				// Reconstruct the card values from the type
				for ( cidx in boardCards ) {
// console.log("[bmc] In The Loop");
// console.log(cidx);
// console.log(boardCards[ cidx ]);
					cards[ cidx ] = {};
					
// console.log(boardCards[ cidx ][ 'type' ] );
					if (( boardCards[ cidx ][ 'type' ] == 52 ) || 
					    ( boardCards[ cidx ][ 'type' ] == 53 )) {
// console.log("[bmc] Yes card is a Joker");
						cards[ cidx ][ 'value' ] = 0; // Arbitrarily choosing value 0 for joker
						cards[ cidx ][ 'type' ]  = 0;
					} else if ((boardCards[ cidx ][ 'type' ] % 13 ) == 0 ) {
						if ( foundAnAce == false ){
							foundAnAce = true;
// console.log("Found first ace");
							cards[ cidx ][ 'value' ] = 1; // Set ace to low for first one found, it still might be high
							cards[ cidx ][ 'type' ]  = 1;
						} else {
// console.log("Found second ace");
							cards[ cidx ][ 'value' ] = 14; // Set ace to high for second one found
							cards[ cidx ][ 'type' ]  = 14;
						}
					} else {
// console.log("[bmc] Card is not a Joker");
						cards[ cidx ][ 'value' ] = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
						cards[ cidx ][ 'type' ]  = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
					}
					cards[ cidx ][ 'id' ] = boardCards[ cidx ][ 'id' ];
				}
	
				cards.sort( this.compareValue );

// console.log("[bmc] Sorted boardcards:");
// console.log(cards);
				// Count number of jokers and aces and track their IDs to set weights later
				
				var jokerCount = 0;
				var jokers = new Array();
				var thereIsAnAce = false;
				var aceCount = 0;
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] == 0 ) {
							jokers[ jokerCount ] = {
								"id" : cards[ i ][ 'id' ],
								"type" : 0 };	 // Start jokers at value 0
							jokerCount++;
					}
					if (( cards[ i ][ 'type' ] == 1 ) ||
					    ( cards[ i ][ 'type' ] == 14 )) {
						thereIsAnAce = true;
						aceCount++;
					}
				}
console.log("[bmc] jokers:");
console.log(jokers);
console.log(jokerCount);
console.log(thereIsAnAce);
console.log(aceCount);
				var cardValuesHard = new Array();
				
				for ( let i in cards ) {
					if (( cards[ i ][ 'type' ] != 0 ) &&  // Jokers here are type 0
					    ( cards[ i ][ 'type' ] != 1 )){   // Ignore aces for now
						cardValuesHard[ cards[ i ][ 'type' ]] = cards[ i ][ 'type' ];
					}
				}
console.log("[bmc] cardValuesHard");
console.log(cardValuesHard);
				var usedPositions = new Array(); // Temporary variable to track positions in the run while assigning jokers
				
				var jokerIndex = 0;
				var foundFirst = false;
				
				// Reindex cards with the IDs as the indices
				
				// Go through positions 1 through King and track 'real' cards if they exist
				for ( let i = 2; i < 14 ; i++) {
console.log( i );
console.log(cardValuesHard[ i ]);
console.log(foundFirst);
					if ( cardValuesHard[ i ] != null ) {
console.log("Location notNull:  (cards)");
console.log( i );
console.log( cards );
						foundFirst = true;
						index = cards.map( function(e) { return e.type; }).indexOf( i );
console.log("FOUND THE FIRST HARD CARD (index, value)");
console.log(index);
console.log(i);
						cards[ index ][ 'boardLieIndex' ] = i;
						usedPositions.push(i);
					} else {
console.log("card location is Null");
console.log( i );
						if ( foundFirst ) {
console.log("foundFirst");
console.log(cardValuesHard.length);
console.log("Nov2023cards");
console.log(cards);



							// if this is the last of the hard cards then ignore
							// Deal with the aces later
							// This presumes the cards which are down are indeed a valid run
							
console.log("[bmc] Assigning Joker!");
console.log(i);
							// if ( i < cardValuesHard.length + 1 ) {
							if ( i < cardValuesHard.length ) {
console.log(jokerIndex);
console.log(jokerCount);
								if ( jokerIndex < jokerCount ) {

									index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
console.log("[bmc] Assigning joker index");
console.log(index);
									jokerIndex++;

									cards[ index ][ 'boardLieIndex' ] = i;

									usedPositions.push(i);
console.log(usedPositions);
								} else {
console.log("[bmc] ERROR Not enough Jokers!");
//  Presume the other function did it's job and allowed only true runs.
								}
							} else {
console.log("[bmc] FINISHED HARD CARDS do not put high ace, yet");
							}
console.log("[bmc] FINISHED HARD CARDS");
						}
					}
console.log("[bmc] Spot near end of first loop");
				}

// All holes have been filled with jokers. Now figure out where to put the jokers (depends on ace and distance).

				leftOverJokers = jokerCount - jokerIndex;
				
console.log("[bmc] Assess remaining jokers");
console.log( jokerCount);
console.log( jokerIndex );
console.log( leftOverJokers );
console.log( jokers );
console.log( cards );
console.log( usedPositions );
console.log( aceCount );
				
// Put an ace as index 1 if any of these is true:
  // There are 2 aces
  // There are 14 cards
  // There are 13 cards and no joker
  // 12 cards and index 13 is empty
  // N cards and N+1 is empty
// else ace is index high
    
// If only 1 ace, determine if it's high or low, then assign remaining jokers

				var minUsed = Math.min.apply( Math, usedPositions );
				var maxUsed = Math.max.apply( Math, usedPositions );
console.log( minUsed );
console.log( maxUsed );

				if ( !isFinite( minUsed )){
					minUsed = 0;
				}
				if ( !isFinite( maxUsed )){
					maxUsed = 0;
				}

console.log( minUsed );
console.log( maxUsed );

				switch( aceCount ) {
					case 0 : // No need to assign aces, just place the jokers properly
console.log("[bmc] No aces.");

// 2024/12/27: This next if and for loop is causing the hung browser, because minUsed and/or maxUsed was Infinity:

						if ( leftOverJokers > 0 ) { // Start by assigning some below the lowest hard number
							for ( let i = minUsed - 1; i > 0; i-- ){
console.log( i );
								
								if ( jokerIndex < jokerCount ) {
									index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
console.log( index );
									cards[ index ][ 'boardLieIndex' ] = i;
									usedPositions.push(i);
									jokerIndex++;
								}
							}
							leftOverJokers = jokerCount - jokerIndex;
							
							if ( leftOverJokers > 0 ) { // If there are still some jokers then put them high
								// Put extra jokers on the right unless there is a High Ace
								for ( let i = jokerIndex; i < jokerCount; i++ ) {
									cards[ i ][ 'boardLieIndex' ] = 15;
									usedPositions.push(i);
								}
							}
						}
						break;
					case 1 : // There is 1 ace. Put the ace low if min is closer to 1 and high if max is closer to 14
console.log("[bmc] One ace.");
						if (( minUsed - 1) < ( 14 - maxUsed )){
							// Put ace low
							index = cards.map( function(e) {return e.type; }).indexOf(1);
console.log( index );
							if ( index > -1 ) {
								cards[ index ][ 'boardLieIndex' ] = 1;
								usedPositions.push( 1 );
							} else {
								console.log("[bmc] ASSERT DID NOT FIND LOW ACE");
							}
						 
							// Now assign jokers below the lowest hard number
						 
							if ( leftOverJokers > 0 ) {
	// console.log( minUsed );
// 2024/12/27: This next if and for loop should be checked to not go infinite:

								for ( let i = minUsed - 1; i > 1; i-- ){ // Don't assign to ace
									if ( jokerIndex < jokerCount ) {
										index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
	// console.log( index );
										cards[ index ][ 'boardLieIndex' ] = i;
										usedPositions.push(i);
										jokerIndex++;
									}
								}
								
								leftOverJokers = jokerCount - jokerIndex;
								// If there are still some jokers then put them high
								 
								if ( leftOverJokers > 0 ) {
									// Put extra jokers on the right but less than the ace
									for ( let i = jokerIndex; i < jokerCount; i++ ) {
										cards[ i ][ 'boardLieIndex' ] = 13.5;
										usedPositions.push(i);
									}
								}
							}
						} else {
							// Put ace high
							index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log( index );
							if ( index > -1 ) {
								cards[ index ][ 'boardLieIndex' ] = 14;
								usedPositions.push( 14 );
							} else {
								console.log("[bmc] ASSERT DID NOT FIND HIGH ACE");
							}
							// Now assign jokers above the highest hard number
						 
							if ( leftOverJokers > 0 ) {
	// console.log( minUsed );
								for ( let i = maxUsed + 1; i < 14; i++ ){ // Don't assign to ace
									if ( jokerIndex < jokerCount ) {
										index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
	// console.log( index );
										cards[ index ][ 'boardLieIndex' ] = i;
										usedPositions.push(i);
										jokerIndex++;
									}
								}
								
								leftOverJokers = jokerCount - jokerIndex;
								// If there are still some jokers then put them low
								 
								if ( leftOverJokers > 0 ) {
									// Put extra jokers on the left but above the ace
// Dec 2024: This for loop will certainly end:
									for ( let i = jokerIndex; i < jokerCount; i++ ) {
										cards[ i ][ 'boardLieIndex' ] = 1.5;
										usedPositions.push(i);
									}
								}
							}
						}

						break;
					case 2 : // There are 2 aces. Assign 1 low and 1 high
// console.log("[bmc] Two aces.");

						// Find the index of the ace (type == 1); Set to 1 if present
						index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log( index );
						if ( index > -1 ) {
							cards[ index ][ 'boardLieIndex' ] = 1;
							usedPositions.push( 1 );
						} else {
							console.log("[bmc] ASSERT DID NOT FIND LOW ACE");
						}

						// Set the 'other' ace to be lieIndex 14
						// Find the index of the ace (type == 14). It was set to 14 previously:
						index = cards.map( function(e) {return e.type; }).indexOf(14);
// console.log( index );
						if ( index > -1 ) {
							cards[ index ][ 'boardLieIndex' ] = 14;
							usedPositions.push( 14 );
						} else {
							console.log("[bmc] ASSERT DID NOT FIND HIGH ACE");
						}
						break;
				}

// console.log( cards );
console.log( usedPositions );
				
				// Sort the boardcards by boardLieIndex
				cards.sort( this.compareBoardLieIndex );
// console.log("[bmc] ALL SORTED cards:" );
// console.log( cards );

				var newRunItems = new Array();
				
				for ( let i in cards ) {
					index = boardCards.map( function(e) {return e.id; }).indexOf(cards[ i ][ 'id' ]);
// console.log("[bmc] i, cards[], index, boardCards[]:");
// console.log(i);
// console.log(cards[ i ][ 'id' ]);
// console.log(index);
// console.log(boardCards[ index ][ 'type' ]);
					newRunItems[ i ] = {
						id: cards[ i ][ 'id' ],
						type: boardCards[ index ][ 'type' ]
					};
// console.log(newRunItems);
				}
// console.log("[bmc] FINAL newRunItems");
console.log(newRunItems);

console.log( "[bmc] EXIT sortRun2" );
				return newRunItems;
			}
		},
/////////
/////////
/////////
		sortRunOld : function( boardCards, downArea, boardPlayer ) {
console.log( "[bmc] ENTER sortRun2" );
// console.log( boardPlayer );
// console.log( boardCards );

			// let weightChange = {};
					
			if ( boardCards.length != 0 ) {
				var cards = new Array();

				// Reconstruct the card values from the type
				for ( cidx in boardCards ) {
// console.log("[bmc] In The Loop");
// console.log(cidx);
// console.log(boardCards[ cidx ]);
					cards[ cidx ] = {};
					
// console.log(boardCards[ cidx ][ 'type' ] );
					if (( boardCards[ cidx ][ 'type' ] == 52 ) || 
					    ( boardCards[ cidx ][ 'type' ] == 53 )) {
// console.log("[bmc] Yes card is a Joker");
						cards[ cidx ][ 'value' ] = 0; // Arbitrarily choosing value 0 for joker
						cards[ cidx ][ 'type' ] = 0;
					} else {
// console.log("[bmc] Card is not a Joker");
						cards[ cidx ][ 'value' ] = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
						cards[ cidx ][ 'type' ]  = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
					}
					cards[ cidx ][ 'id' ] = boardCards[ cidx ][ 'id' ];
				}
	
				cards.sort( this.compareValue );

// console.log("[bmc] Sorted cards:");
// console.log(cards);
// console.log(downArea);
				
//console.log("[bmc] UPDATING DISPLAY FOR THAT BOARDPLAYER1");
//console.log( boardPlayer );
				// this.updatingBoardPlayer = boardPlayer;
				
//SHOULDNT SORT IF ITS A JOKER
				// Count number of jokers and aces and track their IDs to set weights later
				
				var jokerCount = 0;
				var jokers = new Array();
				var thereIsAnAce = false;
				var aceCount = 0;
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] == 0 ) {
							jokers[ jokerCount ] = {
								"id" : cards[ i ][ 'id' ],
								"type" : 0 };	 // Start jokers at value 0
							jokerCount++;
					}
					if ( cards[ i ][ 'type' ] == 1 ) {
						thereIsAnAce = true;
						aceCount++;
					}
				}
// console.log("[bmc] jokers:");
// console.log(jokers);
// console.log(jokerCount);
// console.log(thereIsAnAce);
// console.log(aceCount);
				var cardValuesHard = new Array();
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] != 0 ) { // Jokers here are type 0
						cardValuesHard[ cards[ i ][ 'type' ]] = cards[ i ][ 'type' ];
					}
				}
					
// console.log("[bmc] cardValuesHard");
// console.log(cardValuesHard);
				
				var usedPositions = new Array(); // Temporary variable to track positions in the run while assigning jokers
				
				var jokerIndex = 0;
// console.log("Looping over hard cards");				
				var foundFirst = false;
				
				// Reindex cards with the IDs as the indices
				
				// Go through positions 1 through King and track 'real' cards if they exist
				for ( let i = 1; i < 14 ; i++) {
// console.log( i );
// console.log(cardValuesHard[ i ]);
// console.log(foundFirst);

					if ( cardValuesHard[ i ] != null ) {
// console.log("card location is notNull");
// console.log( i );
// console.log( cards );
						if ((( cardValuesHard[ i ] == 1 )    &&
						   (( cardValuesHard.includes( 8 ))  ||
							( cardValuesHard.includes( 9 ))  ||
							( cardValuesHard.includes( 10 )) ||
							( cardValuesHard.includes( 11 )) ||
							( cardValuesHard.includes( 12 )) ||
							( cardValuesHard.includes( 13 ))))) {
								
								// There is an ace and some high cards, so the ace must be high (14)
// console.log("[bmc] Moving the ace to high");
								cards[ i ][ 'boardLieIndex' ] = 14;
								usedPositions.push(14);
								usedPositions.pop(1);
// console.log( "cards" );
// console.log( i );
// console.log( cards );
//exit(0);								
							} else {

							foundFirst = true;
						
							index = cards.map( function(e) { return e.type; }).indexOf( i );
// console.log("index");
// console.log(index);
							cards[ index ][ 'boardLieIndex' ] = i;
							usedPositions.push(i);
						}
					} else {
// console.log("card location is Null");
						if ( foundFirst ) {
// console.log("foundFirst");
// console.log(foundFirst);
// console.log(cardValuesHard.length);
// console.log("July2021cards");
// console.log(cards);
// console.log( i );

							// if this is the last of the hard cards then ignore
							// Deal with the aces later
							// This presumes the cards which are down are indeed a valid run
							if ( i < cardValuesHard.length + 1 ) {
								if ( jokerIndex < jokerCount ) {
//console.log("index");
//console.log(index);
// console.log("[bmc] Assigning Joker!");
// console.log(i);
// console.log(jokerIndex);
// console.log(jokerCount);
									cards[ jokerIndex ][ 'boardLieIndex' ] = i;
									usedPositions.push(i);
// console.log(usedPositions);
									jokerIndex++;
								} else {
//	I used to have this assert-style check here but it sorts the cards right, and
//  so let's presume the other function did it's job and allowed only true runs.
//	this.showMessage( "YIKES! That's not a sortable run!", 'error' ); // 'info' or 'error'
//	console.log("[bmc] Yikes!! This never should have been a run.");
								}
							} else {
// console.log("[bmc] FINISHED HARD CARDS do not put high ace, yet");
							}
// console.log("[bmc] FINISHED HARD CARDS");
						}
					}
// console.log("[bmc] Spot near end of loop");
				}

// console.log("[bmc] DEBUG]");
// console.log(cards);
// console.log(cards[0]);
// console.log(cards[1]);
// console.log(cards[2]);
// console.log(cards[3]);
// console.log(cards[4]);
// console.log(cards[5]);
// console.log(cards[6]);
// console.log(cards[7]);
// console.log(cards[8]);
// console.log(cards[9]);
// console.log(cards[10]);
// console.log(cards[11]);
// console.log(cards[12]);
// console.log(cards[13]);
// To debug, enter a specific card and id here, then you can see the variable before it gets chenged
// if (cards[0]['id'] == 23 ) {
	// exit(0);
// }

// It sorts 3 jokers and 1 ace with HIGH cards correctly to here (7/11/2021)

				leftOverJokers = jokerCount - jokerIndex;
				
// console.log("[bmc] Assess remaining jokers");
// console.log( jokerCount);
// console.log( jokerIndex );
// console.log( leftOverJokers );
// console.log( jokers );
// console.log( cards );
// console.log( usedPositions );

				// Move jokers to low if there is an ace and enough jokers to get to the next card
				if ( thereIsAnAce ) {
// console.log("[bmc] 1");
					if ( usedPositions.includes( jokerCount + 2 )) {
// console.log("[bmc] 2");
						// Ace should be low. Assign leftover jokers as missing cards are found
						for ( let i = 2; i < 13 ; i++) {
							if ( !usedPositions.includes( i ) ) {
								if ( jokerIndex < jokerCount ) {
// console.log("[bmc] 3");
// console.log( jokers[ jokerIndex ][ 'id' ] );
									index = cards.map( function(e) {return e.id; }).indexOf(jokers[ jokerIndex ][ 'id' ]);
									jokerIndex++;

									cards[ index ][ 'boardLieIndex' ] = i;
// console.log("[bmc] Assigning an ACE joker:");
// console.log( index );
// console.log( jokerIndex );
// console.log( cards );
								}
							}
						}
					} else {
// console.log("[bmc] 4");
						// Set the ace (in 1st position) to index 14;
						
						// Find the index of the ace (type == 1):
						index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log("[bmc] index finding ace:");
// console.log( index );
//exit(0);
						
						cards[ index ][ 'boardLieIndex' ] = 14;
						usedPositions.push( 14 );
						var aceIndex = usedPositions.indexOf(1);
						if ( aceIndex > -1 ) {
							usedPositions.splice( aceIndex, 1 );
						}
					}
				}
				
// console.log("[bmc] Final usedPositions" );
// console.log( usedPositions );


// 7/11 ace high 3 jokers correct to here.

// THERE USED TO BE AN ISSUE WITH THE PLACEMENT OF EXTRA JOKERS. THEY SHOULD GO ON LEFT BUT DON'T
// 7/10/2021
//
// 6790QKA ***
// Fixed it 7/17/2021

				// Move an ace to be high if there is a king (position 13)
				for (let i in cards ) {
					if ( cards[ i ][ 'type' ] == 1 ) {
// console.log("[bmc] MA1");
// console.log(i);

						if ( usedPositions.includes( 13 )) {
// console.log("[bmc] MA2");
// console.log(i);
							// If there is already a high ace then assign the 2nd one low
							if ( usedPositions.includes( 14 ) &&
							   ( cards.length > 13)) {
// console.log("[bmc] MA3");
// console.log(i);
								cards[ i ][ 'boardLieIndex' ] = 1;
								usedPositions.push(1);
							} else {
								cards[ i ][ 'boardLieIndex' ] = 14;
								usedPositions.push(14);
							}
						} else {
							cards[ i ][ 'boardLieIndex' ] = 1;
							usedPositions.push(1);
						}
					}
				}
// console.log("[bmc] cards and usedPositions");
// console.log( cards );
// console.log( usedPositions );
//exit(0);
if (cards[0]['id'] == 31 ) {
	//exit(0);
}
	 
				// Put extra jokers on the right unless there is a High Ace
				if ( !usedPositions.includes( 14 )) {
					for ( let i = jokerIndex; i < jokerCount; i++ ) {
						cards[ i ][ 'boardLieIndex' ] = 15;

// console.log("[bmc] EXTRA ON RIGHT");

					}
				} else {
					for ( let i = jokerIndex; i < jokerCount; i++ ) {
						cards[ i ][ 'boardLieIndex' ] = 0;
// console.log("[bmc] EXTRA ON LEFT");
					}
					
				}
				
				
// console.log("[bmc] ABOUT TO ADD JOKER TOOLTIPS");
				// var extraJokerArray = new Array();
				
				// for ( let i = jokerIndex; i < jokerCount; i++ ) {
// console.log(i);
					// var jokerExtraAddGreen = downArea + '_' + boardPlayer + '_item_' + cards[i]['id'];
// console.log("[bmc] ADDING GREEN BORDER1");
// console.log(jokerExtraAddGreen);
// console.log($(jokerExtraAddGreen));

					// Only make it green if there is not an ace
					// if ( !thereIsAnAce ) {
						// extraJokerArray.push( jokerExtraAddGreen );
					// }
				// }
// console.log("[bmc] extraJokerArray");				
// console.log(extraJokerArray);				

				// setTimeout(
					// this.addJokerBorder( extraJokerArray ), 5000
				// );
				
				
// console.log("[bmc] usedPositions:");
// console.log(usedPositions);

// console.log("[bmc] usedPositions:");
// console.log(usedPositions);
			
// console.log("[bmc] cards:");
// console.log( cards );

				// for ( let i = 0; i < 15 ; i++ ) {
					// if ( cards[ i ] != null ) {
						// weightChange[ i ] = cards[ i ][ 'boardLieIndex' ];
					// }
				// }
// console.log("[bmc] weightChange" );
// console.log( weightChange );

				// Sort the boardcards by boardLieIndex
				cards.sort( this.compareBoardLieIndex );
// console.log("[bmc] SORTED cards:" );
// console.log( cards );
				
				var newRunItems = new Array();
				
				for ( let i in cards ) {
					index = boardCards.map( function(e) {return e.id; }).indexOf(cards[ i ][ 'id' ]);
// console.log("[bmc] i, cards[], index, boardCards[]:");
// console.log(i);
// console.log(cards[ i ][ 'id' ]);
// console.log(index);
// console.log(boardCards[ index ][ 'type' ]);
					newRunItems[ i ] = {
						id: cards[ i ][ 'id' ],
						type: boardCards[ index ][ 'type' ]
					};
// console.log(newRunItems);
				}
// console.log("[bmc] FINAL newRunItems");
// console.log(newRunItems);

console.log( "[bmc] EXIT sortRun2" );
				return newRunItems;
			}

	// Create array downRunCards of all cards sorted by value.				
	// For each card, dojo.removeclass(greenborder);				
	// Make a group of the joker IDs.				
	// Set the jokerCount = number of jokers.				
	// Set the jokerIndex = 0.				
	// Loop over loopValues 2 to 13.				
	//	If there is a card in downRunCards with the value==loopValue then:			
	//		Give that card the boardLieIndex[loopValue].		
		// If not then:			
			// If the jokerIndex < jokerCount then:		
				// Give the joker[jokerIndex] the boardLieIndex[loopValue].	
				// Increment the jokerIndex.	
			// If not then throw a fatal error.		
	// Loop;				
	//LeftoverJokers = jokerCount - jokerIndex.				
	// Loop from 0 to LeftoverJokers				
		// dojo.addclass(greenborder);			
	// Loop;
	// If the 1st downRunCard is an ace then:				
		// If there is a card in boardLieIndex[13] then give the ace boardLieIndex=14.			
		// If the 2nd downRunCard is an ace then:			
			// Give it boardLieIndex=1		
	// Sort all by the boardLieIndex.				
		},
/////////
/////////
/////////
		ctxt : function ( toLog ) {
			console.log("[bmc] " + toLog );
		},
/////////
/////////
/////////
		craw : function ( toLog ) {
			console.log( toLog );
		},
/////////
/////////
/////////
		displayItsYourTurn : function ( player_id, soundtype ){
			console.log( "[bmc] displayItsYourTurn" );
			console.log( player_id );
			console.log( this.player_id );
			console.log( soundtype );
			
			if ( soundtype == 'liverpool' ) {
				console.log("[bmc] SOUND: liverpool");
				
				// Track it so players cannot easily abuse it
				
				this.someoneLP = true;
				console.log( "Setting someoneLP true");

				this.showMessage( _("Liverpool!"), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'Liverpool_audio' );
					this.disableNextMoveSound();
				}
			}
			if ( player_id == this.player_id ) {
				dojo.addClass('myhand_wrap', "borderDrawer");
				console.log("[bmc] SOUND: itsYourDraw");

				this.showMessage( _( "It's Your Draw!" ), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'tutorialrumone_itsyourdraw' );
					this.disableNextMoveSound();
				}
				// Make it clear to the player they need to draw a card (border around card)
				// var deck_items = this.deckOne.getAllItems();

// console.log("[bmc] ALL deckOne:");
// console.log( deck_items );
// console.log("[bmc] The deck to be turned red:");
// console.log( 'deckOne_item_' + deck_items[0]['id']);
				
				// dojo.addClass('deckOne_item_' + deck_items[0]['id'], 'stockitem_selected');





				var deckAllItems = this.deckAll.getAllItems();

console.log("[bmc] ALL deckAll:");
console.log( deckAllItems );
console.log("[bmc] The deck to be turned red:");
console.log( 'deckAll_item_' + deckAllItems[0]['id']);
				
				dojo.addClass('deckAll_item_' + deckAllItems[0]['id'], 'stockitem_selected');





			} else {
				dojo.removeClass('myhand_wrap', "borderDrawer");				
			}
		},
/////////
/////////
/////////
	      discardCard : function( player_id, color, value, card_id, nextTurnPlayer, allHands, discardSize, drawDeckSize ) {
//        discardCard : function( player_id, color, value, card_id, nextTurnPlayer, allHands, discardSize, drawDeckSize, buyers ) {
		// (from PHP) Purpose is to show the played cards on the table, not really to play the card.
		// Playing of the card is done on the server side (PHP).
console.log( "[bmc] ENTER discardCard" );
console.log( player_id );
console.log( this.player_id );
console.log( nextTurnPlayer );
console.log( color );
console.log( value );
console.log( card_id );
console.log( allHands );
console.log( discardSize );
console.log( drawDeckSize );
console.log( "discardPile and playerhand:" );
console.log( this.discardPileOne );
console.log( this.playerHand );

			// Clear the buy status because a new card has been discarded
			this.buyRequested = false;
			
			// Set status to resolving buys to give the PHP database time to clear
			this.resolvingBuyers = true;

			// If it is us, play a special sound and show an alert
//			this.displayItsYourTurn( this.gamedatas.playerOrderTrue[ player_id ], 'nextturn' );
			this.displayItsYourTurn( nextTurnPlayer, 'nextturn' );

			// Change the player in JS after the discard (gamedatas is not updated automatically)
			this.gamedatas.activeTurnPlayer_id = nextTurnPlayer;

			// Adjust all hand card-counts because of the discard
			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			// Set the draw deck and discard pile size for players to see
			this.discardSize.setValue( discardSize );
			this.drawDeckSize.setValue( drawDeckSize );
			
			if ( allHands[ this.player_id ] != undefined ) {
				this.myHandSize.setValue( allHands[ this.player_id ] );
			} else {
				this.myHandSize.setValue( 0 );
			}

			// Remove any existing discard pile card
			//if ( this.discardPile.items.length > 0 ) {
			//	this.discardPile.removeFromStockById( this.discardPile.items[ 0 ].id );
			//}

console.log( "this.discardPileOne" );
console.log( this.discardPileOne );

			// Remove any cards already in the discard pile
			this.discardPileOne.removeAll();
			
			// Add it to the pile and set the weight
			let cardUniqueId = this.getCardUniqueId( color, value );
			console.log( cardUniqueId );
			
			if ( player_id == this.player_id ) {
//				this.discardPile.addToStockWithId( cardUniqueId, card_id, 'myhand' );
				this.discardPileOne.addToStockWithId( cardUniqueId, card_id, 'myhand' );

			} else {
//				this.discardPile.addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + player_id );
				this.discardPileOne.addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + player_id );
			}
			
console.log( this.discardPileOne );

			// NEW FEATURE 4/24/2021. Make discard pile only 1 card
//			if ( this.discardPile.length > 1 ) {
//				this.discardPile = this.discardPile[this.discardPile.length - 1 ];
//			}
			if ( this.gamedatas.playerOrderTrue[ player_id ] == this.player_id ) {
//				var dp_items = this.discardPile.getAllItems();
				var dp_items = this.discardPileOne.getAllItems();
console.log("[bmc] ALL discardPile:");
console.log( dp_items );
				for ( let i in dp_items ) {
//					dojo.addClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
					dojo.addClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
				}
			}
			
			// Discarding a card means the turn shifts to the next player
			this.turnPlayer = player_id;

console.log( player_id );
console.log( this.player_id );

			if ( this.player_id == player_id ) {
console.log("[bmc] Card played by me");
                // You played a card. If it exists in your hand, move card from there and remove
                // corresponding item
                if ($('myhand_item_' + card_id)) {
console.log("[bmc] Was in hand");

//                    this.placeOnObject('myhand_item_' + card_id, 'discardPile');
                    // this.placeOnObject('myhand_item_' + card_id, 'discardPileOne');
                    this.playerHand.removeFromStockById(card_id);
                }
            } else {
				// Then we are the next player, who gets to draw it for free; No need for BUY buttons
				console.log( "[bmc] I am the 'Next Player' who can draw the discard for free" );
			}
			
			// Clear out if anyone declared LP
			this.someoneLP = false;
			console.log( "Setting someoneLP false");
			
console.log("[bmc] EXIT discardCard");
        },
/////////
/////////
/////////
		notif_wishListSubmitted : function( notif ){
console.log("[bmc] ENTER notif_wishListSubmitted");
			this.wishListSubmitted = true;
			this.wishListEnabled = true;
			this.setWishListColor( true ); 
			this.showClearWishListButton( true );
console.log("[bmc] EXIT notif_wishListSubmitted");
		},
/////////
/////////
/////////
		notif_loadPrepInfo : function( notif ){
console.log("[bmc] ENTER loadPrepInfo");
console.log(notif);
		// Take no action just let the message be in the game log
console.log("[bmc] EXIT loadPrepInfo");
		},
/////////
/////////
/////////
		notif_loadPrepDone : function( notif ){
console.log("[bmc] ENTER loadPrepDone");
console.log(notif);

			// First move all cards to hand, then to prep areas
			this.movePrepCardsToHand( this.myPrepA );
			this.movePrepCardsToHand( this.myPrepB );
			this.movePrepCardsToHand( this.myPrepC );
			this.movePrepCardsToHand( this.myPrepJoker );

			var ids = notif.args.card_idsA;
			console.log(ids);

			if ( ids != null ) {
				// Clear the prep area

				dojo.addClass( 'myPrepA', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeA;
				var values = notif.args.card_type_argA;
				this.populatePrepArea( ids, colors, values, this.myPrepA );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsB;
			console.log(ids);
			
			if ( ids != null ) {
				
				dojo.addClass( 'myPrepB', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeB;
				var values = notif.args.card_type_argB;
				this.populatePrepArea( ids, colors, values, this.myPrepB );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsC;
			console.log(ids);

			if ( ids != null ) {
				dojo.addClass( 'myPrepC', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeC;
				var values = notif.args.card_type_argC;
				this.populatePrepArea( ids, colors, values, this.myPrepC );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsJ;
			console.log(ids);

			if ( ids != null ) {
				dojo.addClass( 'myPrepJoker', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeJ;
				var values = notif.args.card_type_argJ;
				this.populatePrepArea( ids, colors, values, this.myPrepJoker );
				this.prepAreas++;
			}
			
			console.log(this.prepAreas);
			console.log("[bmc] INCREMENTED prepAreas");
console.log("[bmc] EXIT loadPrepDone");
		},
/////////
/////////
/////////
		movePrepCardsToHand : function( prepArea ){
			console.log("Enter: moveAllPrepCardsToHand");
			
			var area_Items = prepArea.getAllItems();
			console.log( area_Items );
			// var area_B_Items = this.myPrepB.getAllItems();
			// var area_C_Items = this.myPrepC.getAllItems();
			// var area_J_Items = this.myPrepJoker.getAllItems();
			
			for ( var card of area_Items ){
				cardUniqueId = card.type;
				cardId = card.id;
				this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				prepArea.removeFromStockById( card.id );
			}
			// for ( var card in area_B_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepB.removeFromStockById( card.id );
			// }
			// for ( var card in area_C_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepC.removeFromStockById( card.id );
			// }
			// for ( var card in area_J_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepJ.removeFromStockById( card.id );
			// }
		},
/////////
/////////
/////////
		populatePrepArea : function( ids, colors, values, prepArea ){
console.log( "[bmc] ENTER populatePrepArea");
console.log( ids );
console.log( colors );
console.log( values );
console.log( prepArea );

			
			for ( let id in ids ){
				console.log( id );
				console.log( ids[id] );
		
//				var from = 'myhand_item_' + ids[ id ];
				
//				prepArea.addToStockWithId( this.getCardUniqueId( colors[id], values[id] ), ids[id], $('myhand'));
				prepArea.addToStockWithId( this.getCardUniqueId( colors[id], values[id] ), ids[id]);
				
				this.playerHand.removeFromStockById ( ids[id] );
			}
console.log( "[bmc] EXIT populatePrepArea");
		},
/////////
/////////
/////////
		notif_savePrepDone : function( notif ){
console.log("[bmc] ENTER savePrepDone");
console.log(notif);
		},
/////////
/////////
/////////
		notif_liverpoolExists : function( notif ){
console.log("[bmc] ENTER Liverpool Exists");
console.log(notif);

			// Players asked to hide LIVERPOOL condition. If you don't want it hidden, uncomment this dojo:
//			dojo.replaceClass( 'buttonLiverpool', "bgabutton_red", "bgabutton_gray" ); // item, add, remove

			this.gamedatas.liverpoolExists = true;
console.log("[bmc] EXIT Liverpool Exists");
		},
/////////
/////////
/////////
		notif_liverpoolDeclared : function( notif ){
console.log("[bmc] ENTER Liverpool Declared");
console.log(notif);
//			dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red" ); // item, add, remove			
			dojo.replaceClass( 'buttonLiverpool', "bgabutton_blue", "bgabutton_red" ); // item, add, remove

			console.log( "Setting someoneLP true");
			this.someoneLP = true;
			
			if ( this.voices ) {
				playSound( 'Liverpool_audio' );
				this.disableNextMoveSound();
			}

console.log("[bmc] EXIT Liverpool Declared");
		},
/////////
/////////
/////////
		notif_liverpoolMissed : function( notif ){
console.log("[bmc] ENTER Liverpool Missed");
console.log(notif);

			if ( this.voices ) {
				// playSound( 'MissedIt' );
				// this.disableNextMoveSound();
			}

console.log("[bmc] EXIT Liverpool Declared");
		},
/////////
/////////
/////////
		notif_updateBuyers : function( notif ){
console.log("[bmc] updateBuyers");
console.log(notif.args.player_id);
console.log(notif.args.nextTurnPlayer);
console.log(notif.args.buyers);
console.log(this.player_id);

			// Set status to back to show buyers have resolved
			this.resolvingBuyers = false;

			// Separating the update of the buyer update to try to clear the DB deadlock issue.
		
			if (( this.player_id != notif.args.nextTurnPlayer ) && ( notif.args.buyers[ this.player_id ] > 0 )) {
				// If we are not the next player and we have buys left then show the BUY button

console.log("[bmc] Card played not by me");
				this.buyCounterTimerShouldExist = 'Yes'; // A timer and a button should exit
				this.showBuyButton2();
				
				// New variables for new timers on static buttons
				// this.enableDBStatic = 'Yes';
				// this.enableDBTimer = 'Yes';
				this.enDisStaticBuyButtons('Yes');
			}
		},
//function( mobile_obj, target_obj, duration, delay )
/////////
/////////
/////////		
		arraymove : function (arr, fromIndex, toIndex) {
			var element = arr[fromIndex];
			arr.splice(fromIndex, 1);
			console.log("::"+arr);
			arr.splice(toIndex, 0, element);
		},
/////////
/////////
/////////
		startActionTimerStatic: function () {
console.log("[bmc] ENTER startActionTimerStatic");
console.log("[bmc] EXIT(nothing) startActionTimerStatic");
			return;
		},
/////////
/////////
/////////
		isReadOnly: function () { // Check if spectator or not
//		  return this.isSpectator || typeof g_replayFrom != "undefined" || g_archive_mode;
		  return this.isSpectator || typeof g_replayFrom != "undefined" || g_archive_mode;
		},
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Player's action
        
        
        // Here, you are defining methods to handle player's action (ex: results
		// of mouse click on game objects).
            
            // Most of the time, these methods:
            // _ check the action is possible at this game state.
            // _ make a call to the game server
        
		// The left-ist thing in the draw pile is called drawPile_item_1. The next is drawPile_item_2.
		// The left-ist thing in the player's hand is called myhand_item_1. The next is myhand_item_2.
        
        // Example:
        
        // onMyMethodToCall1: function( evt )
        // {
			// function remove because the project analyzer wouldn't pass
        // },        
        
/////////
/////////
/////////
		showClearWishListButton : function( onOff ) {
console.log("[bmc] ENTER showClearWishListButton");
console.log(this.wishListEnabled);
console.log(this.wishListSubmitted);
console.log(onOff);
			if ( onOff == true ) {
				dojo.replaceClass( 'buttonClearWishList', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonClearWishList', "textWhite", "textGray" ); // item, add, remove
			} else {
				dojo.replaceClass( 'buttonClearWishList', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonClearWishList', "textGray", "textWhite" ); // item, add, remove
			}
console.log("[bmc] EXIT showClearWishListButton");
		},
/////////
/////////
/////////
		showBuyButton2 : function() {
console.log("[bmc] ENTER showBuyButton2");
console.log( this.buyCounterTimerShouldExist );
console.log( this.buyCounterTimerExists );

//			if (( this.buyCounterTimerShouldExist == 'Yes' ) || 
//				( this.buyCounterTimerExists == 'Yes' )) {

console.log("[bmc] BUY BUTTON RED!");
				dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove

//console.log("[bmc] Action buttons were just created.");

//			}
console.log("[bmc] EXIT showBuyButton2");
		},
/////////
/////////
/////////
		showNotBuyButton : function() {
console.log("[bmc] ENTER showNotBuyButton RED!");
				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textWhite", "textGray" ); // item, add, remove
console.log("[bmc] EXIT showNotBuyButton");
		},
/////////
/////////
/////////
		enDisStaticBuyButtons : function( setting ) {
console.log(this.enableDBStatic);
console.log(setting);

				if (( this.enableDBStatic == 'Yes' ) ||
			    ( setting == 'Yes' )) {
console.log("[bmc] YES enDisStaticBuyButtons");
//				dojo.replaceClass( 'buttonBuy', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				// dojo.replaceClass( 'buttonNotBuy', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove

				// Only start the timer if active during hand, not during game start nor hand start.
				// if ( this.enableDBTimer == 'Yes' ) {
// console.log("[bmc] YES enableDBTimer");
					// this.startActionTimerStatic();
				// }
			} else {
console.log("[bmc] NO enDisStaticBuyButtons");
//				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				// dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove
			}
		},
		
		
		
		
//			var notBuyButtonID = 'buttonPlayerNotBuy' + this.player_id;
//			this.startActionTimer( notBuyButtonID );



/////////
/////////
/////////
		showBuyButton : function() {
//			console.log("[bmc] this.buyCounted: ", this.buyCounted );
console.log("[bmc] ENTER showBuyButton");

			var buyButtonID = 'buttonPlayerBuy' + this.player_id;
			var notBuyButtonID = 'buttonPlayerNotBuy' + this.player_id;
console.log( "[bmc] BUTTONIDs:" );
console.log( buyButtonID );
console.log( notBuyButtonID );

			// Only show the buy buttons if they already don't exist
			
//			var notBuyButtonDOM = document.getElementById('buttonPlayerNotBuy');
			var notBuyButtonDOM = document.getElementById( notBuyButtonID );
console.log("[bmc] notBuyButtonDOM: ", notBuyButtonDOM);
console.log("[bmc] buyCounterTimerExists: ", this.buyCounterTimerExists );
console.log("[bmc] buyCounterTimerShouldExist: ", this.buyCounterTimerShouldExist );

			if (( this.buyCounterTimerShouldExist == 'Yes' ) && 
			    ( notBuyButtonDOM == null )) { // == null or undefined
//console.log("[bmc] notBuyButtonDOM is null");
//				if ( this.buyCounted == 'No' ) {
console.log("[bmc] Timer and buttons must exist, so create them.");
//					this.buyCounted = 'Yes';
					
//					this.addActionButton('buttonPlayerBuy', _("Buy2"), 'onPlayerBuyButton');
//					this.addActionButton('buttonPlayerNotBuy', _("Not Buy2"), 'onPlayerNotBuyButton');
//					this.startActionTimer( 'buttonPlayerNotBuy' );

//EXP 10/26					this.addActionButton( buyButtonID, _("Buy!"), 'onPlayerBuyButton' );
//					this.addActionButton( notBuyButtonID , _("Not Buy!"), 'onPlayerNotBuyButton' );
console.log("[bmc] Action buttons were just created.");
console.log( document.getElementById( notBuyButtonID ));

					if ( this.buyCounterTimerExists != 'Yes' ) {
						// this.startActionTimer( notBuyButtonID );
					}
//exit(0);
				} else {
console.log( "[bmc] Not Showing Buy Buttons. Might consider removing the button here if it's not cleared in other ways." );
				}
//			} else { // Wait for the buy to count out
//console.log("[bmc] notBuyButtonDOM is not null");
//				return;
//			}
console.log("[bmc] EXIT showBuyButton");
		},
////////
////////
////////
		getSelectedDownAreaCards : function() {
			var selectedCards_A_ = new Array();
			var selectedCards_B_ = new Array();
			var selectedCards_C_ = new Array();
			
			// Find the selected card on the board, if any
			var boardCard = {}; // Empty object
			var boardArea = ''; // Empty string
			var boardPlayer = ''; // Empty string
			

//todo: Can no longer play jokers onto melds, not sure why.
			
			// var selc_A_ = new Array();
			
			for ( var player in this.gamedatas.players) {
console.log( 'Cards in areas: playerDown_A_, _B_, and _C_' + player);
				
				// selc_A_[ player ] = this.playerDown_A_[player].getSelectedItems();
// console.log(selc_A_[player]);

				selectedCards_A_[ player ] = this.downArea_A_[player].getSelectedItems();
console.log(selectedCards_A_[player]);
				
				if ( selectedCards_A_[player].length === 1 ) {
console.log("[bmc] FOUND A");
					boardCard.id = selectedCards_A_[player][0]['id'];
					boardCard.type = selectedCards_A_[player][0]['type'];
					boardArea = 'playerDown_A';
					boardPlayer = player;
				}
				
				selectedCards_B_[player] = this.downArea_B_[player].getSelectedItems();
console.log(selectedCards_B_[player]);
				
				if (selectedCards_B_[player].length === 1) {
console.log("[bmc] FOUND B");
					boardCard.id = selectedCards_B_[player][0]['id'];
					boardCard.type = selectedCards_B_[player][0]['type'];
					boardArea = 'playerDown_B';
					boardPlayer = player;
				}
				
				selectedCards_C_[player] = this.downArea_C_[player].getSelectedItems();
console.log(selectedCards_C_[player]);
				
				
				if (selectedCards_C_[player].length === 1) {
console.log("[bmc] FOUND C");
					boardCard.id = selectedCards_C_[player][0]['id'];
					boardCard.type = selectedCards_C_[player][0]['type'];
					boardArea = 'playerDown_C';
					boardPlayer = player;
				}
			}
// console.log("[bmc] Selected Board Card(s):");
// console.log(selectedCards_A_);
// console.log(selectedCards_B_);
// console.log(selectedCards_C_);
			return [boardCard, boardArea, boardPlayer];
		},
/////////
/////////
/////////
		onMyHandAreaClick : function() {
console.log("[bmc] ENTER onMyHandAreaClick");
			this.playerHand.unselectAll();
			this.someoneLP = false;
			
			var handCards = this.playerHand.getAllItems();
console.log( handCards );
console.log( handCards.length );

			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}
console.log("[bmc] EXIT onMyHandAreaClick");
		},
/////////
/////////
/////////
		unselectWishList : function() {
			this.wishListClubs.unselectAll();
			this.wishListSpades.unselectAll();
			this.wishListHearts.unselectAll();
			this.wishListDiamonds.unselectAll();
			for ( value = 1; value <= 13; value++ ) {
				dojo.removeClass('myWishListClubs_item_'    + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListSpades_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListHearts_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListDiamonds_item_' + value, 'wishListItem_selected' );
			}
		},
/////////
/////////
/////////
		disableWishList : function() {
console.log("[bmc] ENTER disableWishList");
console.log(this.wishListEnabled);
//			this.showClearWishListButton( true );

			if ( this.wishListEnabled == true ) {
				this.wishListEnabled = false;
				this.setWishListColor( false );

				// Uncheck the box
				// document.getElementById("wishListEnabled").checked = false;

console.log( "[bmc] disabling wishlist ");

				// var action = 'disableWishList';
				var newAction = 'actDisableWishList';
				
				this.bgaPerformAction( newAction, { // 'actDisableWishList'
					player_id : this.player_id,
				},{ 
					checkAction: false,
//						checkPossibleActions: true 
				});

					
				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
				// });
			}
console.log("[bmc] EXIT disableWishList");
		},
/////////
/////////
/////////
		onLiverpoolButton : function() {
console.log("[bmc] ENTER onLiverpoolButton");
			// var action = 'liverpoolButton';
			var newAction = 'actLiverpoolButton';
				
console.log( "[bmc] Trying for Liverpool! ");
console.log( this.player_id );
console.log( this.gamedatas.activeTurnPlayer_id );
console.log( this.goneDown[ this.player_id ]);
console.log( this.someoneLP );

				// Player must have gone down in order for Liverpool button click to register
				
				if ( this.someoneLP == false) { // If no one has declared it this card, try it
					this.someoneLP = true;
					
					console.log( "Setting someoneLP true");

					if ( this.goneDown[ this.player_id ] == 1 ) { // 1 = they have gone down
						
						// If it's already this player's turn then do nothing
						// if ( this.player_id == this.gamedatas.activeTurnPlayer_id ){
							//this.onDiscardPileSelectionChanged();
						
						// } else {
	// console.log( "Ajax liverpool" );

						this.bgaPerformAction( newAction, { // 'actLiverpoolButton'
							player_id : this.player_id,
						},{ 
							checkAction: false,
							checkPossibleActions: false
						});
					
						// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
								// player_id : this.player_id,
								// lock : true
							// }, this, function(result) {
							// }, function(is_error) {
								// console.error( "Error Reported by LP Ajax:", is_error );
							// });	
						// }
					}
				} else { // Someone else beat you to it
					this.showMessage( _("Someone beat you to Liverpool!" ));
					// playSound( 'TooSlow' );
				}
console.log("[bmc] EXIT onLiverpoolButton");
		},
/////////
/////////
/////////
		onClearWishList : function() {
console.log("[bmc] ENTER onClearWishList");
console.log(this.wishListEnabled);
console.log(this.wishListSubmitted);

			this.showClearWishListButton( false );
			this.disableWishList();
			this.unselectWishList();

console.log("[bmc] EXIT onClearWishList");
		},
/////////
/////////
/////////
		onSubmitWishList : function() {
console.log("[bmc] ENTER onSubmitWishList");

			var isReadOnly = this.isReadOnly();
			
			if ( !isReadOnly ) { // Spectators are read only, no need to show wishlist stuff
			
				var wlClubs    = this.wishListClubs.getSelectedItems();
				var wlSpades   = this.wishListSpades.getSelectedItems();
				var wlHearts   = this.wishListHearts.getSelectedItems();
				var wlDiamonds = this.wishListDiamonds.getSelectedItems();

				var wishListAll = wlClubs.concat( wlSpades ).concat( wlHearts ).concat( wlDiamonds );
	console.log( wishListAll );

				wishList_type = new Array();
				wishList_type_arg = new Array();

					// if (this.wishListEnabled == true ) {
					
				for ( wLItem of wishListAll ) {
	console.log( wLItem );
	console.log( this.getColorValue( wLItem.type + 1 ));
					
					var [ dCColor, dCValue ] = this.getColorValue( wLItem.type );
					
					wishList_type.push( dCColor );
					wishList_type_arg.push( dCValue );
				}
	console.log("[bmc] wishList");
	console.log( wishList_type );
	console.log( wishList_type_arg );

				if ( wishList_type.length != 0 ){
	console.log( "[bmc] Submitting wishList!" );
					
					// var action = 'submitWishList';
					var newAction = 'actSubmitWishList';
					
					this.bgaPerformAction( newAction, { // 'actSubmitWishList'
						player_id : this.player_id,
						wishList_type : this.toNumberList( wishList_type ),
						wishList_type_arg : this.toNumberList( wishList_type_arg ),
					},{ 
						checkAction: false,
//						checkPossibleActions: true 
					});

					// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// wishList_type : this.toNumberList( wishList_type ),
						// wishList_type_arg : this.toNumberList( wishList_type_arg ),
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
					// });
				}
			}
console.log("[bmc] EXIT onSubmitWishList");
		},
/////////
/////////
/////////
		onDownAreaAClick : function() {
			console.log("[bmc] ENTER onDownAreaAClick");

			var handItems = this.playerHand.getSelectedItems();
//			if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaA';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaA';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaBClick : function() {
			console.log("[bmc] ENTER onDownAreaBClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaB';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaB';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaCClick : function() {
			console.log("[bmc] ENTER onDownAreaCClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaC';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaC';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaJokerClick : function() {
			console.log("[bmc] ENTER onDownAreaJokerClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length == 1 ) {
				this.prepAreaClicked = 'areaJoker';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaJoker';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaSelect : function() {
console.log("[bmc] ENTER onDownAreaSelect");
console.log(this.player_id);

			var isReadOnly = this.isReadOnly();
			if ( isReadOnly ) { // Spectators are read only
				return;
			}

			var handItems = this.playerHand.getSelectedItems();
console.log(handItems);
			var area_A_Items = this.downArea_A_[ this.player_id ].getSelectedItems();
			var area_B_Items = this.downArea_B_[ this.player_id ].getSelectedItems();
			var area_C_Items = this.downArea_C_[ this.player_id ].getSelectedItems();
console.log(area_A_Items);
console.log(area_B_Items);
console.log(area_C_Items);


			// for ( item of area_A_Items ) {
				// var DOMItem = "playerDown_A_" + this.player_id + "_item_" + item[ "id" ];
// console.log("[bmc] DOMItem");
// console.log(DOMItem);

				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// for ( item of area_B_Items ) {
				// var DOMItem = "playerDown_B_" + this.player_id + "_item_" + item[ "id" ];
// console.log("[bmc] DOMItem");
// console.log(DOMItem);
// console.log($(DOMItem));
				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// for ( item of area_C_Items ) {
				// var DOMItem = "playerDown_C_" + this.player_id + "_item_" + item[ "id" ];
				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// TODO: These if conditions overlap, could be simplified
			
			if (( this.goneDown[ this.player_id ] == 0 ) &&  //0 = Not gone down; 1 = Gone down.
				( handItems.length >= 1 )) {
				// Then put it into a prep area
				if        ( this.prepAreaClicked == 'areaA' ) {
					this.onPlayerPrepArea_A_Button();
				} else if ( this.prepAreaClicked == 'areaB' ) {
					this.onPlayerPrepArea_B_Button();
				} else if ( this.prepAreaClicked == 'areaC' ) {
					this.onPlayerPrepArea_C_Button();
				} else if ( this.prepAreaClicked == 'areaJoker' ) {
					this.onPlayerPrepJoker_Button();
				}
			} else if ( handItems.length === 1 )  { // Then try to play the card
console.log("try to play 1 card");

				var [ boardCard, boardArea, boardPlayer ] = this.getSelectedDownAreaCards ();
				
				let playerCard = handItems[ 0 ];

				if  (( boardCard != {} ) &&
					(  boardArea != '' )) { // There is a card there on the board, so try to have player play
					let playerCard = handItems[ 0 ];
console.log("[bmc] Will try to play card here:");
console.log(playerCard);
console.log(boardCard);
console.log(boardArea);
console.log(boardPlayer);

					// var action = 'playCard';
					var newAction = 'actPlayCard';

					// do the unselects before going to the server
//					this.playerHand.unselectAll();
					for ( var player in this.gamedatas.players ) {
						this.downArea_A_[ player ].unselectAll();
						this.downArea_B_[ player ].unselectAll();
						this.downArea_C_[ player ].unselectAll();
					}

					this.bgaPerformAction( newAction, { // 'actPlayCard'
						player_id : this.player_id,
						card_id : playerCard['id'],
						boardArea : boardArea,
						boardPlayer : boardPlayer,
					});

					// if (this.checkAction( action, true)) {
// console.log("[bmc] PlayCard Action true AJAX");
// console.log("/" + this.game_name + "/" + this.game_name + "/" + action + ".html");

						
						// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
							// card_id : playerCard['id'],
							// player_id : this.player_id,
							// boardArea : boardArea,
							// boardPlayer : boardPlayer,
							// lock : true
						// }, this, function(result) {
						// }, function(is_error) {
						// });
					// } else {
						// console.log("[bmc] PlayCard Action false");
					// }
				} else {
					console.log("[bmc] No card on board selected, do nothing (one card)");
				}
			// If the player has not gone down and clicks, pull the card back to their hand
			} else if ( this.goneDown[ this.player_id ] == 0 ) { //0 = Not gone down; 1 = Gone down.
console.log("Pull 1 card back");

				var area_A_Items = this.myPrepA.getSelectedItems();
				var area_B_Items = this.myPrepB.getSelectedItems();
				var area_C_Items = this.myPrepC.getSelectedItems();
				var area_Joker_Items = this.myPrepJoker.getSelectedItems();
			
				if ( area_A_Items.length === 1 ) {
console.log("[bmc] Card from prep A to hand");
					let card = area_A_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

//					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
					// this.downArea_A_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_A_[ this.player_id ].unselectAll();
					this.myPrepA.removeFromStockById( card.id );
					this.myPrepA.unselectAll();

				} else if ( area_B_Items.length === 1 ) {
console.log("[bmc] Card from prep B to hand");
					let card = area_B_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_B_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_B_[ this.player_id ].unselectAll();
					this.myPrepB.removeFromStockById( card.id );
					this.myPrepB.unselectAll();

				} else if ( area_C_Items.length === 1 ) {
console.log("[bmc] Card from prep C to hand");
					let card = area_C_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );
					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_C_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_C_[ this.player_id ].unselectAll();
					this.myPrepC.removeFromStockById( card.id );
					this.myPrepC.unselectAll();

				} else if ( area_Joker_Items.length === 1 ) {
console.log("[bmc] Card from prep Joker to hand");
					let card = area_Joker_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_C_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_C_[ this.player_id ].unselectAll();
					this.myPrepJoker.removeFromStockById( card.id );
					this.myPrepJoker.unselectAll();

				} else {
					console.log("[bmc] No card in hand selected, do nothing");
				}

			} else if ( handItems.length > 1 )  { // Then try to play multiple cards
console.log("mulitple");
				var [ boardCard, boardArea, boardPlayer ] = this.getSelectedDownAreaCards ();

				if  (( boardCard != {} ) &&
					(  boardArea != '' )) { // There is a card there on the board, so try to play cards there

					// do the unselects before going to the server
					for ( var player in this.gamedatas.players ) {
						this.downArea_A_[ player ].unselectAll();
						this.downArea_B_[ player ].unselectAll();
						this.downArea_C_[ player ].unselectAll();
					}
					
					// Make a list of the selected cards
					var handItemIds = this.getItemIds(handItems);
console.log("handItemIds");
console.log(handItemIds);
					
					// var action = 'playCardMultiple';
					var newAction = 'actPlayCardMultiple';
					
						this.bgaPerformAction( newAction, { // 'actPlayCardMultiple'
							player_id : this.player_id,
							card_ids : this.toNumberList( handItemIds ),
							boardArea : boardArea,
							boardPlayer : boardPlayer,
						});

					// if (this.checkAction( action, true)) {
// console.log("[bmc] PlayCard Action true AJAX");
// console.log("/" + this.game_name + "/" + this.game_name + "/" + action + ".html");

						// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
							// card_ids : this.toNumberList( handItemIds ),
							// player_id : this.player_id,
							// boardArea : boardArea,
							// boardPlayer : boardPlayer,
							// lock : true
						// }, this, function(result) {
						// }, function(is_error) {
						// });
					// } else {
						// console.log("[bmc] PlayCard Action false");
					// }
				} else {
					console.log("[bmc] No card on board selected, do nothing (multiple cards)");
				}
			}
			
			var area_A_Items = this.myPrepA.getAllItems();
			var area_B_Items = this.myPrepB.getAllItems();
			var area_C_Items = this.myPrepC.getAllItems();
			var area_Joker_Items = this.myPrepJoker.getAllItems();

			console.log( area_A_Items );
			console.log( area_B_Items );
			console.log( area_C_Items );
			console.log( area_Joker_Items );
			
			var i = 0;
			if ( area_A_Items.length == 0 ) {
				dojo.removeClass('myPrepA', "buyerLit");
			} else {
				i++;
			}
			
			if ( area_B_Items.length == 0 ) {
				dojo.removeClass('myPrepB', "buyerLit");
			} else {
				i++;
			}

			if ( area_C_Items.length == 0 ) {
				dojo.removeClass('myPrepC', "buyerLit");
			} else {
				i++;
			}

			if ( area_Joker_Items.length == 0 ) {
				dojo.removeClass('myPrepJoker', "buyerLit");
			} else {
				i++;
			}

console.log("[bmc]AreasPrepped(i):");
console.log(i);
			// If no areas are prepped then clear the variable
			if ( i == 0 ) {
console.log("[bmc] Clear this.prepAreas3");
				this.prepAreas = 0;
			}
			
			console.log("[bmc] EXIT onDownAreaSelect");
		},
////////
////////
////////
		cardWasPlayed : function ( card_id, player_id, color, value, boardArea, boardPlayer, allHands ) {
console.log("[bmc] (from PHP) ENTER cardWasPlayed");
console.log( card_id );
console.log( player_id );
console.log( color );
console.log( value );
//			console.log(boardCard);
console.log( boardArea );
console.log( boardPlayer );
console.log( allHands );
			
			if ( player_id == this.player_id) {
				var from = 'myhand';
			} else {
				var from = 'overall_player_board_' + player_id;
			}
			
			cardUniqueId = this.getCardUniqueId( color, value );
console.log( cardUniqueId );

			// Update card quantities in player hands
			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			if ( allHands != null ) {
				this.myHandSize.setValue( allHands[ this.player_id ] );
			}

// add joker if there
			
			if ( boardArea === 'playerDown_A' ) {
console.log(boardArea);
				this.downArea_A_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );

console.log("[bmc] Added.");
				this.playerHand.removeFromStockById( card_id );
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4017] Removed.");
				// this.sortArea_A( boardPlayer );
			}
			
			if ( boardArea === 'playerDown_B' ) {
console.log(boardArea);
				this.downArea_B_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );

console.log("[bmc] Added.");
				this.playerHand.removeFromStockById( card_id );
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4033] Removed.");
				// this.sortArea_B( boardPlayer );
			}
			if ( boardArea === 'playerDown_C' ) {
			console.log(boardArea);
				this.downArea_C_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );
console.log("[bmc] Added.");
				this.playerHand.removeFromStockById(card_id);
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4047] Removed.");
				//this.sortArea_C( boardPlayer );
			}

console.log("[bmc] Joker moved, now sort the board cards.");
			this.sortBoard();
			//this.updateCardsDisplay();
			
			console.log("[bmc] (from PHP) EXIT cardWasPlayed");
		},
/////////
/////////
/////////
		onShowHideWishList : function() {
			console.log("[bmc] ENTER onShowHideWishList");

			// Show the wishlist stuff if they set the game up this way
			if ( this.showHideWishList == true ) {
			console.log("[bmc] FALSE onShowHideWishList");
				this.showHideWishList = false;
				// var obj = { visibility: "hidden" };
				var obj = { display: "none" };
				
				// dojo.query( '.wishListMode' ).addClass( 'wishListMode' );
				// dojo.removeClass( 'TLeftBox2', 'wishListMode' );
				// dojo.removeClass( 'buttonClearWishList', 'wishListMode' );
			} else {
			console.log("[bmc] TRUE onShowHideWishList");
				this.showHideWishList = true;
				// var obj = { visibility: "visible" };
				// var obj = { display: "block" };
				var obj = { display: "inline" };
				
				// dojo.setAttr("TLeftBox2", "wishListMode", obj);
				// dojo.query( '.wishListMode' ).removeClass( 'wishListMode' );
				// dojo.addClass( 'TLeftBox2', 'wishListMode' );
				// dojo.addClass( 'buttonClearWishList', 'wishListMode' );
			}
console.log(obj);
			dojo.setAttr("TLeftBox2", "style", obj );

			console.log("[bmc] EXIT onShowHideWishList");
		},
/////////
/////////
/////////
		onDownAreaClick : function() {
			console.log("[bmc] ENTER onDownAreaClick");
			player_id = this.gamedatas.currentPlayerId;
			//player_id = this.gamedatas.playerorder[ 0 ];
			console.log( player_id );
			console.log( this.goneDown[player_id] );
			
			console.log("[bmc] EXIT onDownAreaClick");
			return;
			
			// If the player has not gone down and clicks, pull all the cards back to their hand
			if ( this.goneDown[ player_id ] == 0 ) { //0 = Not gone down; 1 = Gone down.
				console.log("[bmc] PULL BACK");
				
//				var cards = this.downArea_A_[ player_id ].getAllItems();
				var cards = this.myPrepA.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_A_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepA.removeAllTo( 'myhand' );

//				var cards = this.downArea_B_[ player_id ].getAllItems();
				var cards = this.myPrepB.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_B_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepB.removeAllTo( 'myhand' );
				//
//				var cards = this.downArea_C_[ player_id ].getAllItems();
				var cards = this.myPrepC.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_C_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepC.removeAllTo( 'myhand' );
				
				// dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
				// dojo.removeClass('playerDown_B_' + this.player_id, "buyerLit");
				// dojo.removeClass('playerDown_C_' + this.player_id, "buyerLit");

				dojo.removeClass('myPrepA', "buyerLit");
				dojo.removeClass('myPrepB', "buyerLit");
				dojo.removeClass('myPrepC', "buyerLit");

				this.prepSetLoc = 0; // Nothing is prepped, so clear the counters
				this.prepRunLoc = 3; 
console.log("[bmc] Clear this.prepAreas4");
				this.prepAreas = 0;

			} // else do nothing, they've already gone down.
			console.log("[bmc] EXIT onDownAreaClick");
		},
/////////
/////////
/////////
		onDeckSelectionChanged : function() {
			console.log("[bmc] ENTER OnDeckSelectionChanged.");
//			var items = this.deck.getSelectedItems();
			// var items = this.deckOne.getSelectedItems();
			// this.deckOne.unselectAll();

			// Remove the borders from the deck and discard pile after the player draws
			// var deck_items = this.deckOne.getAllItems();
			
console.log( this.alreadyODeckSC );

			// if ( this.alreadyODeckSC == false ){
				// this.alreadyODeckSC = true;
				// return; // 
			// }

//			var dp_items = this.discardPile.getAllItems();
			var dp_items = this.discardPileOne.getAllItems();
// console.log("[bmc] ALL deckOne:");
// console.log(deck_items);
console.log(dp_items);

			// for ( let i in deck_items ) {
				// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
			// }

			// for ( let i in dp_items ) {
				// dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			// }
			
			// console.log( items );
			console.log("[bmc] GAMEDATAS and this.player_id.");
			console.log(this.gamedatas);
			console.log(this.player_id);
//			this.drawCard2nd(items, 0 ); // 0 == 'deck', 1 == 'discardPile'
//			this.drawCard2nd(items, 'deck' ); // THIS WAS UNCOMMENTED ORIGINALLY

			var itemsAll = this.deckAll.getSelectedItems();
			
			this.deckAll.unselectAll();

			// Remove the borders from the deck and discard pile after the player draws
			var deckAllItems = this.deckAll.getAllItems();
			
console.log("[bmc] ALL deckAll:");
console.log( deckAllItems );

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

			console.log( itemsAll );
			console.log("[bmc] GAMEDATAS and this.player_id.");
			this.drawCard2nd(itemsAll, 'deck' ); // Should this be just 1 card selected???

			console.log("[bmc] EXIT OnDeckSelectionChanged.");
		},
/////////
/////////
/////////
		drawCard2nd : function ( items, drawSource ) {
console.log("[bmc] ENTER drawCard2nd.");
console.log( items );
console.log( drawSource );
			if (( items.length > 0 ) || ( drawSource == 'discardPile' )) {
console.log("[bmc] >0; Sending the card.");
				
				var card_id = items[0].id;
console.log(card_id);

				if ( isNaN( card_id ) ||   // Check for NAN
					 ( card_id == null )){ // Also check for null
console.log( '[bmc] Trace dc2:1' );
					card_id = 0; // Not really 0, trying to avoid PHP error for missing ID
					//  "Unexpected exception: Failed to get mandatory argument: id"
				}

				// var action = 'drawCard';
				var newAction = 'actDrawCard';
console.log( '[bmc] Trace dc2:2' );
				
				this.bgaPerformAction( newAction, { // 'actDrawCard' in drawCard2nd
					player_id : this.player_id,
					card_id : card_id,
					drawSource : drawSource,
				});
				// },{ 
					// checkAction: false,
//					checkPossibleActions: false
				// });
console.log( '[bmc] Trace dc2:3' );
					
				// if (this.checkAction( action, true )) {
					// console.log( "[bmc] Action true. AJAX next" );
					// console.log( "/" + this.game_name + "/" + this.game_name + "/" + action + ".html");
					
					// var card_id = items[0].id;
// console.log(card_id);

					// if ( isNaN( card_id ) ||   // Check for NAN
						 // ( card_id == null )){ // Also check for null
						// card_id = 0; // Not really 0, trying to avoid PHP error for missing ID
						//  "Unexpected exception: Failed to get mandatory argument: id"
					// }
// console.log(card_id);

					// this.ajaxcall( "/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// id : card_id,
						// drawSource : drawSource,
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
						// console.log( "Error status reported by DRAWCARD Ajax (false=no error:", is_error );
					// });
				// } else {
					// console.log("[bmc] Cannot Draw. Action false");
				// }
				this.discardPileOne.unselectAll();
console.log( '[bmc] Trace dc2:4' );

				// Clear the checks after the unselects are done
				this.alreadyODPSC = false;
				
				// this.deckOne.unselectAll();
				
				// Remove the borders from the deck and discard pile after the player draws
				// var deck_items = this.deckOne.getAllItems();
				var dp_items = this.discardPileOne.getAllItems();
	// console.log("[bmc] ALL deckOne:");
	// console.log(deck_items);
	// console.log(dp_items);

				// for ( let i in deck_items ) {
	// console.log(i);
					// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
				// }

				this.deckAll.unselectAll();
console.log( '[bmc] Trace dc2:5' );
				this.alreadyODeckSC = false;
				
				// Remove the borders from the deck and discard pile after the player draws
				var deckAllItems = this.deckAll.getAllItems();
console.log( '[bmc] Trace dc2:6' );
	// console.log("[bmc] ALL deckAll:");
	// console.log(deckAllItems);

				for ( let i in deckAllItems ) {
	// console.log(i);
console.log( '[bmc] Trace dc2:7' );
					dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
				}

				for ( let i in dp_items ) {
					dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
console.log( '[bmc] Trace dc2:8' );
				}
								
			} else {
console.log( '[bmc] Trace dc2:9' );
console.log("[bmc] No items; ignoring click on deck.");
			}
			console.log( "[bmc] EXIT drawCard2nd." );
		},
/////////
/////////
/////////
		onPlayerPlayCardButton : function() {
		},
/////////
/////////
/////////
		clearButtons : function () {
console.log( "[bmc] ENTER clearButtons" );
		    this.removeActionButtons(); // Remove the button because they discarded
			// dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			// dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove

			dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
			dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove

			// this.showingButtons === 'No';
		},
/////////
/////////
/////////		
		onPlayerDiscardButton : function() {
console.log( "[bmc] ENTER onPlayerDiscardButton" );
			let action = "reallyDiscard";
console.log( this.prepAreas );

			var selectedDiscards = this.playerHand.getSelectedItems();
console.log("selectedDiscards:");
console.log(selectedDiscards);
			// If cards are in prep area, double check that the really want to discard and not go down.
			// if (( this.prepAreas > 0 ) &&
				// ( this.goneDown[ this.player_id ] == 0 ) &&  //0 = Not gone down; 1 = Gone down.
				// ( selectedDiscards.length != 0 )) { // Only show dialog when there's a card
// console.log ("[bmc] CONFIRM");
				// this.confirmationDialog( _('Are you sure you want to discard? You have cards prepped.'),
							 // dojo.hitch( this, function() {
								// this.playerHand.unselectAll();
								// this.reallyDiscard( selectedDiscards );
							// }));
			// } else { // nothing prepped so discard the card
console.log ("[bmc] Just discard");
			this.playerHand.unselectAll();
			this.reallyDiscard( selectedDiscards );
			// }
console.log( "[bmc] EXIT onPlayerDiscardButton" );
		},
/////////
/////////
/////////		
		reallyDiscard : function( selectedDiscards ) {
console.log( "[bmc] ENTER reallyDiscard" );
console.log( this.player_id );
console.log("selectedDiscards:");
console.log(selectedDiscards);
			//this.discardPile.unselectAll();
			this.discardPileOne.unselectAll();
			this.playerHand.unselectAll();

			this.clearButtons();
//		    this.removeActionButtons(); // Remove the button because they discarded
//			this.showingButtons === 'No';
			
//			var card = this.playerHand.getSelectedItems()[ 0 ]; // It must be 1 card only
			var card = selectedDiscards[0];
			console.log(card);
			
			this.firstLoad = 'No'; // Since we're discarding, enable future timers
			
			if ( typeof card !== "undefined" ) {
				// console.log("[bmc] destroy button!");
				// dojo.destroy('currentPlayerPlayButton_id');

				var card_id = card.id;                    

console.log("[bmc] Discarding card!");
console.log( card_id );

				// let action = 'discardCard';
				var newAction = 'actDiscardCard';
				
				this.playerHand.unselectAll();

				this.bgaPerformAction( newAction, { // 'actDiscardCard'
					player_id : this.player_id,
					card_id : card_id,
				});

				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
					// id : card_id,
					// player_id: this.player_id,
					// lock : true
				// }, this, function(result) {
				// }, function(is_error) {
				// });
// console.log("[bmc] Did ajaxcall.");

				// this.playerHand.unselectAll();
			}
		},
/////////
/////////
/////////
		onPlayerSortByButtonSet : function() {
			this.playerSortBy = 'Run';
			this.onPlayerSortByButton();
		},
/////////
/////////
/////////
		onPlayerSortByButtonRun : function( thisPlayerHand ) {
			this.playerSortBy = 'Set';
			this.onPlayerSortByButton();
		},
/////////
/////////
/////////
		onPlayerSortByButton : function() {
console.log("[bmc] ENTER onPlayerSortByButton!");
console.log(this.player_id);
			
//			var thisPlayerHandIds = this.playerHand.getAllItems();
			// Just practicing the sortRun function
			//this.sortRun( thisPlayerHandIds, 'playerDown_A' );
			
			var thisPlayerHandIds = this.playerHand.getAllItems();
			
//console.log(thisPlayerHandIds);

			var el = {};
			var thisPlayerHand = new Array();
			
			for ( let i in thisPlayerHandIds ) {
				//console.log(i);
				
				var [ color, value ] = this.getColorValue( thisPlayerHandIds[ i ]['type'] );

				el = {
					'id' : thisPlayerHandIds[i]['id'],
					'unique_id' : this.getCardUniqueId(color, value),
					'type' : color,
					'type_arg' : value,
					'location' : 'hand',
					'location_arg' : this.player_id
				}
				thisPlayerHand[thisPlayerHandIds[i]['id']] = el;
			}
console.log( "thisPlayerHand:" );
console.log( thisPlayerHand );
			
			if ( this.playerSortBy == 'Set' ) {
				this.playerSortBy = 'Run';
				thisPlayerHand.sort( this.compareId ) ;
console.log( "thisPlayerHand after sort:");
console.log( thisPlayerHand );

				let weightChange = {};
				for (let i in thisPlayerHand) {
					if ( thisPlayerHand[i].type == 5 ) {
						weightChange[ thisPlayerHand[ i ].unique_id ] = this.drawCounter + 1; // Keep jokers on the right
					} else {
						weightChange[ thisPlayerHand[ i ].unique_id ] = parseInt( thisPlayerHand[ i ].unique_id );
					}
				}
console.log("weightChange RUN");
console.log(weightChange);
				this.playerHand.changeItemsWeight(weightChange);
				
			} else {
				this.playerSortBy = 'Set';
				thisPlayerHand.sort( this.compareTypeArg ) ;

				let weightChange = {};
				for ( let i in thisPlayerHand ) {
					if ( thisPlayerHand[i].type == 5 ) {
						weightChange[ thisPlayerHand[ i ].unique_id ] = 100; // Keep jokers on the right
					} else {
						weightChange[ thisPlayerHand[ i ].unique_id ] = parseInt( thisPlayerHand[ i ].type_arg );
					}
				}
console.log("weightChange SET");
console.log(weightChange);
				this.playerHand.changeItemsWeight(weightChange);
			}
			//this.showHideButtons();
			
console.log("[bmc] EXIT onPlayerSortByButton!");
		},
/////////
/////////
/////////
		compareId : function( a, b ) {
			if ( parseInt(a.id) < parseInt(b.id) ){
				return -1;
			}
			if ( parseInt(a.id) > parseInt(b.id) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareTypeArg : function( a, b ) {
			if ( parseInt(a.type_arg) < parseInt(b.type_arg) ){
				return -1;
			}
			if ( parseInt(a.type_arg) > parseInt(b.type_arg) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareValue : function( a, b ) {
			if ( parseInt(a.value) < parseInt(b.value) ){
				return -1;
			}
			if ( parseInt(a.value) > parseInt(b.value) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareLocationArg : function( b, a ) {
			if ( parseInt(a.location_arg) < parseInt(b.location_arg) ){
				return -1;
			}
			if ( parseInt(a.location_arg) > parseInt(b.location_arg) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareBoardLieIndex : function( a, b ) {
			if ( parseInt(a.boardLieIndex) < parseInt(b.boardLieIndex) ){
				return -1;
			}
			if ( parseInt(a.boardLieIndex) > parseInt(b.boardLieIndex) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		onPlayerSortButton : function( items ) {
			console.log("[bmc] BUTTON onPlayerSortButton!");
			console.log(this.player_id);
			
			var cards = this.playerHand.getSelectedItems(); // It can be >1 card
			this.onPlayerSortButton2( cards );
		},
/////////
/////////
/////////
		onPlayerSortButton2 : function( cards ) {
			console.log("[bmc] BUTTON onPlayerSortButton2!");
			console.log(this.player_id);
			
//			var cards = this.playerHand.getSelectedItems(); // It can be >1 card

			console.log( cards );
			
			if ( cards.length === 2 ) { // Sort only when 2 cards are selected
				var cardIds = this.getItemIds( cards );

console.log("[bmc] cardIds: " + cardIds );

				this.clearButtons();
//				this.removeActionButtons(); // Remove the button because they clicked it
//				this.showingButtons === 'No';
				this.sortHand( cards );
			}
		},
/////////
/////////
/////////
		sortHand : function( items ) {
			var thisPlayerHand = this.playerHand.getAllItems();
			console.log("[bmc] thisPlayerHand");
			console.log(thisPlayerHand);

			// Remove PLAY CARD button
			//this.removeActionButtons();
			this.clearButtons();

			// Swap the order if necessary to keep player's 1st selection 1st
			if ( this.playerHand.firstSelected != items[ 0 ].type ) {
				//console.log("[bmc] swap");
				let temp = items[0];
				items[0] = items[1];
				items[1] = temp;
			}
// console.log("[bmc] Move cards around");
		// If two cards have been selected, change the weights
		// Find the indices of the 1st and 2nd cards and move them around

			for ( const [i, card] of thisPlayerHand.entries() ) {
				if ( items[0].type === card.type ) {
					var spotFrom = i;
				}
				if ( items[1].type === card.type ) {
					var spotTo = i;
				}
			}
			
			this.arraymove(thisPlayerHand, spotFrom, spotTo);

			// Make a change array from the result
			let weightChange = {};
			for (let i in thisPlayerHand) {
                weightChange[ thisPlayerHand[ i ].type ] = parseInt(i);
			}
console.log("[bmc] WC");
console.log(weightChange);
			this.playerHand.changeItemsWeight(weightChange);
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerGoDownButton : function() {
console.log("[bmc] ENTER onPlayerGoDownButton!");
console.log(this.player_id)
			// var handItems = this.playerHand.getSelectedItems(); // Get the card for joker swap, if any
			//var handItems = this.myPrepJoker.getAllItems(); // Get the card for joker swap (should be just 1 if any)
			
		    this.removeActionButtons(); // Remove the button because they played

			// var cardGroupA = this.downArea_A_[this.player_id].getAllItems();
			// var cardGroupB = this.downArea_B_[this.player_id].getAllItems();
			// var cardGroupC = this.downArea_C_[this.player_id].getAllItems();

			var cardGroupA = this.myPrepA.getAllItems();
			var cardGroupB = this.myPrepB.getAllItems();
			var cardGroupC = this.myPrepC.getAllItems();
			var cardGroupJoker = this.myPrepJoker.getAllItems();

			console.log(cardGroupA);
			console.log(cardGroupB);
			console.log(cardGroupC);
			//console.log(handItems);
			
            var cardGroupAIds = this.getItemIds(cardGroupA);
            var cardGroupBIds = this.getItemIds(cardGroupB);
            var cardGroupCIds = this.getItemIds(cardGroupC);
//			var handItemIds = this.getItemIds(handItems);
			var handItemIds = this.getItemIds(cardGroupJoker);

console.log("[bmc] cardIdsA: " + cardGroupAIds);
console.log("[bmc] cardIdsB: " + cardGroupBIds);
console.log("[bmc] cardIdsC: " + cardGroupCIds);
console.log("[bmc] handItemIds: " + handItemIds);

			var [boardCard, boardArea, boardPlayer] = this.getSelectedDownAreaCards();

console.log( boardCard );
console.log( boardArea );
console.log( boardPlayer );
console.log( handItemIds );
			let boardCardId = ( boardCard['id'] === undefined) ? '' : boardCard['id'];
console.log( boardCardId );

			this.playerHand.unselectAll();
			this.action_playerGoDown(
				cardGroupAIds,
				cardGroupBIds,
				cardGroupCIds,
				boardCardId,
				boardArea,
				boardPlayer,
				handItemIds
			);
//            this.action_playSeveralCards(cardIds);
		},
/////////
/////////
/////////
        getItemIds: function ( items ) {
            var ids = [];
            for (var i in items) {
                var item = items[i];
                ids.push(item.id);
            }
            return ids;
        },
/////////
/////////
/////////
		action_playerGoDown: function(
			cardGroupA,
			cardGroupB,
			cardGroupC,
			boardCardId,
			boardArea,
			boardPlayer,
			handItems
			) {
			console.log("[bmc] action_playerGoDown");

            // var params = {};
            // if (args) {
                // for (var key in args) {
                    // params[key] = args[key];
                // }
            // }
            // params.lock = true;
// console.log("[bmc] params: ");
// console.log(params);

console.log( cardGroupA );

			var newAction = 'actPlayerGoDown';
						
			this.bgaPerformAction( newAction, { // 'actPlayerGoDown'
			  cardIDGroupA: cardGroupA.join(','),
			  cardIDGroupB: cardGroupB.join(','),
			  cardIDGroupC: cardGroupC.join(','),
			  boardCardId: boardCardId,
			  boardArea: boardArea,
			  boardPlayer: boardPlayer,
			  handItemIds: handItems.join(','),
			});

			// this.bgaPerformAction( newAction, {
                // cardGroupA: this.toNumberList( cardGroupA ),
                // cardGroupB: this.toNumberList( cardGroupB ),
                // cardGroupC: this.toNumberList( cardGroupC ),
				// boardCardId: boardCardId,
				// boardArea: boardArea,
				// boardPlayer: boardPlayer,
				// handItems: this.toNumberList( handItems )
            // });
            // this.sendAction('playerGoDown', {
                // cardGroupA: this.toNumberList( cardGroupA ),
                // cardGroupB: this.toNumberList( cardGroupB ),
                // cardGroupC: this.toNumberList( cardGroupC ),
				// boardCardId: boardCardId,
				// boardArea: boardArea,
				// boardPlayer: boardPlayer,
				// handItems: this.toNumberList( handItems )
            // });
		},
/////////
/////////
/////////
        toNumberList: function ( ids ) {
			numberedList = ids.join(';');
console.log("[bmc] numberedList: " + numberedList);
            return numberedList;
        },
/////////
/////////
/////////
        // sendAction: function ( action, args ) {
// console.log("[bmc] ENTER sendAction: " + action + " : " );
// console.log(args);
            // var params = {};
            // if (args) {
                // for (var key in args) {
                    // params[key] = args[key];
                // }
            // }
            // params.lock = true;
// console.log("[bmc] params: ");
// console.log(params);


            // this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" +action+'.html', params, this, function (result) { });
// console.log("[bmc] EXIT sendAction: " + action + " : " );
        // },
/////////
/////////
/////////
		drawCard : function (
			player_id,
			card_id,
			color,
			value,
			drawSource,
			drawPlayer,
			allHands,
			discardSize,
			drawDeckSize
			) {
console.log("[bmc] ENTER drawCard (from notif from PHP)");
// console.log(this.player_id);
console.log(player_id);
console.log(card_id);
console.log(color);
console.log(value);
console.log(drawSource);
console.log("[bmc] drawPlayer is next:");
console.log(drawPlayer); // drawPlayer is the player number of the board area where it comes from
console.log(allHands);
console.log(discardSize);
console.log(drawDeckSize);

			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			// Remove the borders from the deck and discard pile after the player draws
			// var deck_items = this.deckOne.getAllItems();
			var dp_items = this.discardPileOne.getAllItems();
// console.log("[bmc] ALL deckOne:");
// console.log(deck_items);
console.log(dp_items);

			// for ( let i in deck_items ) {
				// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
			// }

			var deckAllItems = this.deckAll.getAllItems();
console.log("[bmc] ALL deckAll:");
console.log(deckAllItems);

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

			for ( let i in dp_items ) {
				dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			}

			// Unlight the Liverpool button if lit up and if the discard was chosen
			
			if ( drawSource == 'discardPile' ) {
//				dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonLiverpool', "bgabutton_blue", "bgabutton_red" ); // item, add, remove
				this.gamedatas.liverpoolExists = false;
				this.showHideButtons();
			}


console.log(this.handCount);
			if ( drawSource.match(/playerDown/g) ) {
				var from = drawSource + '_' + drawPlayer;
				var drawingPlayer = player_id;
			} else {
				var from = drawSource;
				var drawingPlayer = drawPlayer;
			}

			this.discardSize.setValue( discardSize );
			this.drawDeckSize.setValue( drawDeckSize );
			this.myHandSize.setValue( allHands[ this.player_id ] );

console.log("[bmc] modified drawSource");
console.log(drawSource);
console.log(from);
console.log(this.playerHand)

			if (( color == null ) ||
				( color == ''   ) ||
				( value == null ) ||
				( value == '')) {
console.log("[bmc] Yikes!! Color or value is null! Need to fix this, this is fatal.");
				exit(0);
			}

			var cardUniqueId = this.getCardUniqueId( color, value );
			console.log(cardUniqueId);

			if ( drawingPlayer == this.player_id ) {
				console.log("[bmc] player_id is me");

				console.log("[bmc] player_id is me, so add it to my hand");
				var addTo = 'myhand';

				this.playerHand.addToStockWithId( this.getCardUniqueId(color, value), card_id );
				dojo.addClass('myhand_item_' + card_id, 'stockitem_newcard');

			} else {
				console.log("[bmc] player_id is NOT me");
//				var addTo = 'overall_player_board_' + drawPlayer;
				var addTo = 'overall_player_board_' + player_id; // make it slide to the active player
			}
				
console.log( '[bmc] addTo: ' + addTo );
				
			if ( drawSource == 'deck' ) {
				console.log(this.gamedatas.cardIDsInDeck[ 0 ]);

				this.deckAll.removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'discardPile' ) {
console.log( '[bmc] from DP' );
//					this.discardPile.removeFromStockById( card_id, addTo );
				this.discardPileOne.removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_A' ) {
console.log( '[bmc] from A' );
				this.downArea_A_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_B' ) {
console.log( '[bmc] from B' );
				this.downArea_B_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_C' ) {
console.log( '[bmc] from C' );
				this.downArea_C_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
console.log( '[bmc] this.downAreas:' );
console.log( this.downArea_A_[ drawPlayer ] );
console.log( this.downArea_B_[ drawPlayer ] );
console.log( this.downArea_C_[ drawPlayer ] );

		this.sortBoard();
		console.log("[bmc] EXIT drawCard");
		},
/////////
/////////
/////////
		drawCardSpect : function (
			player_id,
			card_id,
			color,
			value,
			drawSource,
			drawPlayer,
			allHands,
			discardSize,
			drawDeckSize
			) {
console.log("[bmc] ENTER drawCardSpect (from notif from PHP)");
console.log(this.player_id);
console.log(player_id);
console.log(card_id);
console.log(color);
console.log(value);
console.log(drawSource);
console.log(drawPlayer);
console.log(allHands);
console.log(discardSize);
console.log(drawDeckSize);

			// This is only for spectators

			var isReadOnly = this.isReadOnly();
			console.log("isReadOnly");
			console.log(isReadOnly);
			
			if ( isReadOnly ) {
				for ( var p_id in allHands ) {
					this.handCount[ p_id ].setValue( allHands[ p_id ] );
				}

console.log(this.handCount);

				if ( drawSource.match(/playerDown/g) ) {
					var from = drawSource + '_' + drawPlayer;
					var drawingPlayer = player_id;
				} else {
					var from = drawSource;
					var drawingPlayer = drawPlayer;
				}

				this.discardSize.setValue( discardSize );
				this.drawDeckSize.setValue( drawDeckSize );

console.log("[bmc] modified drawSource");
console.log(drawSource);
console.log(from);
console.log(this.playerHand)

				if (( color == null ) ||
					( value == null )) {
	console.log("[bmc] Yikes!! Color or value is null! Need to fix this, this is fatal.");
					exit(0);
				}
				console.log("[bmc] player_id is NOT me");
//				var addTo = 'overall_player_board_' + drawPlayer;
				var addTo = 'overall_player_board_' + player_id; // make it slide to the active player
//			}
				
console.log( '[bmc] addTo: ' + addTo );
				
				if ( drawSource == 'deck' ) {
console.log( '[bmc] Deck' );
					this.deckAll.removeFromStockById( card_id, addTo );
					// this.deck.removeFromStockById(card_id, addTo );
				}
				
				if ( drawSource == 'discardPile' ) {
console.log( '[bmc] DP' );
//					this.discardPile.removeFromStockById( card_id, addTo );
					this.discardPileOne.removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_A' ) {
console.log( '[bmc] A' );
					this.downArea_A_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_B' ) {
console.log( '[bmc] B' );
					this.downArea_B_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_C' ) {
console.log( '[bmc] C' );
					this.downArea_C_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
			}
console.log("[bmc] EXIT drawCardSpect");
/////////
/////////
/////////
		onDiscardPileSelectionChangedClick: function() {
console.log( '[bmc] onDiscardPileSelectionChangedClick' );
			this.onDiscardPileSelectionChanged();
		},
/////////
/////////
/////////
		onDiscardPileSelectionChanged: function() {
console.log( "[bmc] ENTER onDiscardPileSelectionChanged." );
console.log( "[bmc] GAMEDATAS and this.player_id" );
//console.log(card);
console.log( this.gamedatas );
console.log( this.player_id );
console.log( this.someoneLP );
// console.log( this.alreadyODPSC );

			// If hand has 1 card selected, and state is play, then try to discard (no need for player check).
			// If state is draw, and it's not my turn, then try to buy it.
			// If state is draw, and DP has 1 card selected, and it's my turn, then draw it.
			
			// If it's not my turn then try to buy it.
			// If it is my turn and if 

			var dpSelectedItems = this.discardPileOne.getSelectedItems();
console.log( dpSelectedItems );
console.log( dpSelectedItems.length );
			
			var dp_items = this.discardPileOne.getAllItems();
			for ( let i in dp_items ) {
				dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			}

			var handCards = this.playerHand.getSelectedItems();
console.log( handCards );
console.log( handCards.length );

			var deckAllItems = this.deckAll.getAllItems();

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

console.log( '[bmc] Trace 1' );
			if ( this.gamedatas.gamestate.active_player != this.player_id ){ // It's not my turn, so try to buy it
console.log( '[bmc] Trace 2' );
				if ( dpSelectedItems.length === 1 ){
console.log( '[bmc] Trace 3' );
					this.onPlayerBuyButton();
				}
			} else { // It is my turn
console.log( '[bmc] Trace 4' );
				if ( this.gamedatas.gamestate.name == 'playerTurnDraw' ){
console.log( '[bmc] Trace 5' );
					if ( dpSelectedItems.length === 1 ){
console.log( '[bmc] Trace 6' );
						var items = new Array();
						items[0] = {id: "0", type: 0 }; // "Fake" card just used for the API (i.e. we need to send *something* but
						// when drawing from the discard it is ignored by the PHP and the top of the pile is chosen)
							
						this.drawCard2nd( items, 'discardPile' );
					}
				} else {
console.log( '[bmc] Trace 7' );
					if ( this.gamedatas.gamestate.name == 'playerTurnPlay' ){
console.log( '[bmc] Trace 8' );
						if ( handCards.length === 1 ){
console.log( '[bmc] Trace 9' );
							this.onPlayerDiscardButton();
						}
					}
				}
			}
console.log( '[bmc] Trace 10' );
					
			// Change the discard pile and player hand only at the end
			this.discardPileOne.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerSavePrep_Button : function() {
			console.log("[bmc] BUTTON onPlayerSavePrep");
			
			if ( this.goneDown[ this.player_id ] != 1 ) { // If player has not gone down allow the prep save

				// Get all cards in prep areas
				// Send to server
				var prepArea_A_Items = this.myPrepA.getAllItems();
				var prepArea_B_Items = this.myPrepB.getAllItems();
				var prepArea_C_Items = this.myPrepC.getAllItems();
				var prepArea_J_Items = this.myPrepJoker.getAllItems();
				console.log(prepArea_A_Items);
				console.log(prepArea_B_Items);
				console.log(prepArea_C_Items);
				console.log(prepArea_J_Items);

				var pA_A_ids = new Array();
				var pA_B_ids = new Array();
				var pA_C_ids = new Array();
				var pA_J_ids = new Array();
				
				for ( let i in prepArea_A_Items ) {
					pA_A_ids[i] = prepArea_A_Items[i].id;
				}
				for ( let i in prepArea_B_Items ) {
					pA_B_ids[i] = prepArea_B_Items[i].id;
				}
				for ( let i in prepArea_C_Items ) {
					pA_C_ids[i] = prepArea_C_Items[i].id;
				}
				for ( let i in prepArea_J_Items ) {
					pA_J_ids[i] = prepArea_J_Items[i].id;
				}

				console.log(pA_A_ids);
				console.log(pA_B_ids);
				console.log(pA_C_ids);
				console.log(pA_J_ids);

				if (( pA_A_ids.length +
					  pA_B_ids.length + 
					  pA_C_ids.length + 
					  pA_J_ids.length ) != 0 ){
console.log( "[bmc] Saving prep areas." );
					
					// var action = 'savePrep';
					var newAction = 'actSavePrep';

					this.bgaPerformAction( newAction, { // 'actSavePrep'
						player_id : this.player_id,
						area_A_Items : this.toNumberList( pA_A_ids ),
						area_B_Items : this.toNumberList( pA_B_ids ),
						area_C_Items : this.toNumberList( pA_C_ids ),
						area_J_Items : this.toNumberList( pA_J_ids ),
					},{ 
						checkAction: false,
//						checkPossibleActions: true 
					});


					// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// area_A_Items : this.toNumberList( pA_A_ids ),
						// area_B_Items : this.toNumberList( pA_B_ids ),
						// area_C_Items : this.toNumberList( pA_C_ids ),
						// area_J_Items : this.toNumberList( pA_J_ids ),
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
					// });
				}
			}
		},
/////////
/////////
/////////
		onPlayerLoadPrep_Button : function() {
			console.log("[bmc] BUTTON onPlayerLoadPrep");
			// Read list of cards from server for prep areas
			// Move them from hand to prep areas

			if ( this.goneDown[ this.player_id ] != 1 ) { // If player has not gone down allow the prep save
				// var action = 'loadPrep';
				var newAction = 'actLoadPrep';

				this.bgaPerformAction( newAction, { // 'actLoadPrep'
					player_id : this.player_id,
				},{ 
					checkAction: false,
//						checkPossibleActions: true 
				});

				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
					// player_id : this.player_id,
					// lock : true
				// }, this, function(result) {
				// }, function(is_error) {
				// });
			}
		},
/////////
/////////
/////////
		onPlayerPrepArea_A_Button : function () {
			console.log("[bmc] BUTTON onPlayerPrepAreaAButton");
			console.log(this.player_id);
			
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
				
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_A_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass( downArea_A_[ this.player_id ], "buyerLit");
					this.myPrepA.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepA', "buyerLit" );
					this.playerHand.removeFromStockById ( card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.playerHand.unselectAll();
				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepJoker_Button : function() {
			console.log("[bmc] BUTTON onPlayerPrepJoker_Button");
			console.log(this.player_id);

			// if there is a card there, move it back to hand
			let jcards = this.myPrepJoker.getAllItems(); // It should just be 1 card

			if ( jcards.length != 0 ) {
				// var from = 'myhand_item_' + jcards[0].id;

				cardUniqueId = jcards[0].type;
				cardId = jcards[0].id;
				console.log("BMC 082723: Pulling Back");
				this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back
				this.myPrepJoker.removeFromStockById( cardId );

console.log( cardUniqueId ) ;
console.log( cardId ) ;
			}







			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
console.log(cards);
				
//				var cardIds = this.getItemIds( cards ); // Just pick 1 card

//				for ( card of cards ) {
					cardUniqueId = cards[0].type;
					cardId = cards[0].id;

					// if there was a card there, store it so later move it back to hand
					let card = this.myPrepJoker.getAllItems(); // It should just be 1 card

					// var from = 'myhand_item_' + cards[0].id;
					this.myPrepJoker.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepJoker', "buyerLit" );
					this.playerHand.removeFromStockById (cards[0].id );

console.log( card ) ;
					if ( card.length != 0 ) {
						cardUniqueId = card[0].type;
						cardId = card[0].id;
console.log( cardUniqueId ) ;
console.log( cardId ) ;
						this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back
						this.myPrepJoker.removeFromStockById( cardId );
//					}

				}
				this.prepAreas++;
console.log(this.prepAreas);
console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepArea_B_Button : function () {
			console.log("[bmc] BUTTON onPlayerPrepArea_B_Button");
			console.log(this.player_id);
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_B_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass('playerDown_B_' + this.player_id, "buyerLit");
					this.myPrepB.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepB', "buyerLit" );
					this.playerHand.removeFromStockById (card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepArea_C_Button : function () {
console.log("[bmc] BUTTON onPlayerPrepAreaCButton");
console.log(this.player_id);
			// If player already went down, do nothing
			if ( this.goneDown[ this.player_id ] == 1 ) {
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_C_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass('playerDown_C_' + this.player_id, "buyerLit");
					this.myPrepC.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepC', "buyerLit" );
					this.playerHand.removeFromStockById (card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		showHideButtons : function() {
console.log("[bmc] ENTER ShowHideButtons");
			let buyButtonID = 'buttonBuy';
			// let notBuyButtonID = 'buttonNotBuy';
// console.log( "[bmc] BUTTONIDs:" );
// console.log( notBuyButtonID );

			this.clearButtons();

			// Only show the buy buttons if they already don't exist
			
			var showButtons = new Array();
			
// console.log("this.playerSortBy");
// console.log(this.playerSortBy);
			
			
			if ( this.goneDown[ this.player_id ] == 0 ) {
				var items = this.playerHand.getSelectedItems();
				if ( items.length > 0 ) {
	// console.log("[bmc] prepbuttons ON");
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_blue", "bgabutton_gray" );
					
				} else {
	// console.log("[bmc] prepbuttons OFF");
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_gray", "bgabutton_blue" );
				}
			}
			
// console.log( "[bmc] Player:" );
// console.log( this.player_id );
// console.log( this.gamedatas.gamestate.active_player );
// console.log( this.gamedatas.activeTurnPlayer_id );

			if ( this.gamedatas.gamestate.active_player == this.player_id ) {
				showButtons['myturn'] = true;
				// console.log("[bmc] playerOrderTrue[0] == this.player_id (my turn)");
				
			} else {
				// console.log("[bmc] not playerOrderTrue[0] == this.player_id (not my turn)");
			}

			// console.log(this.player_id);
			// console.log(this.goneDown[this.player_id]);

			showButtons['goneDown'] = (parseInt( this.goneDown[ this.player_id ]) === 1 ) ? true : false;
			
			// Show SORT button if a player has a card selected
			var items = this.playerHand.getSelectedItems();
			
			if ( items.length >= 1 ) {
				showButtons['handSelected'] = true;
				if ( items.length > 2 ) {
					showButtons['twoOrMore'] = true;
				}
				if ( items.length == 2 ) {
					showButtons['twoOrMore'] = true;
					//this.addActionButton( 'buttonPlayerSort', _("Sort!"), 'onPlayerSortButton');
				}
			}

			if ( this.prepRunLoc + this.prepSetLoc > 3) { // Starting positions are 0 and 3
				showButtons['prepped'] = true;
			}

			// console.log("[bmc] showButtons:");
			// console.log(showButtons);
			console.log(this.prepAreas);
			//
			// Show GO DOWN button if prepped, not gone down and my turn
			//
			// var goDownDOM = document.getElementById( 'buttonPlayerGoDown' );

			if (( this.prepAreas > 0 ) &&
				 !showButtons['goneDown'] &&
				  showButtons['myturn'] && 
				( this.gamedatas.gamestate.name != "playerTurnDraw" )) {
				// ( this.gamedatas.gamestate.name != "playerTurnDraw" ) &&
				// ( goDownDOM == null )) {

				dojo.replaceClass( 'buttonGoDownStatic', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				//this.addActionButton( 'buttonPlayerGoDown', _("Go Down!"), 'onPlayerGoDownButton' );
				// this.showingButtons === 'Yes';
			} else {
				dojo.replaceClass( 'buttonGoDownStatic', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			}
			//
			// Show DISCARD if card selected, it's not state playerTurnDraw, and it's my turn
			//
			if ( showButtons['handSelected'] && 
				 showButtons['myturn'] &&
			   ( items.length == 1 ) &&
			   ( this.gamedatas.gamestate.name != "playerTurnDraw" )) {
				   
				this.addActionButton('buttonPlayerDiscard', _("Discard!"), 'onPlayerDiscardButton');
				// this.showingButtons === 'Yes';
			}
		// console.log("[bmc] EXIT ShowHideButtons");
		},
/////////
/////////
/////////
		onPlayerHandDoubleClick : function() {
console.log("[bmc] ENTER onPlayerHandDoubleClick");
            var cards = this.playerHand.getSelectedItems();
console.log( cards );
			if ( cards ) {
//				this.onPlayerDiscardButton();
				this.onPlayerSortButton2( cards );
			}
console.log("[bmc] EXIT onPlayerHandDoubleClick");
		},
/////////
/////////
/////////
		onWishListCardClick : function() {
console.log("[bmc] ENTER onWishListCardClick");
console.log(this.wishListEnabled);

			// Disable the wishlist
			this.disableWishList();
			
			// Go evaluate what they clicked. Resubmit only when they click SUBMIT again.
			
            var wlClubs    = this.wishListClubs.getSelectedItems();
            var wlSpades   = this.wishListSpades.getSelectedItems();
            var wlHearts   = this.wishListHearts.getSelectedItems();
            var wlDiamonds = this.wishListDiamonds.getSelectedItems();
console.log( wlClubs );
console.log( wlSpades );
console.log( wlHearts );
console.log( wlDiamonds );

			for ( value = 1; value <= 13; value++ ) {
				dojo.removeClass('myWishListClubs_item_'    + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListSpades_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListHearts_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListDiamonds_item_' + value, 'wishListItem_selected' );
			}
			
			for ( item in wlClubs ) {
				dojo.addClass('myWishListClubs_item_'    + wlClubs[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListClubs_item_' + wlClubs[ item ].id );
			}
			for ( item in wlSpades ) {
				dojo.addClass('myWishListSpades_item_'   + wlSpades[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListSpades_item_' + wlClubs[ item ].id );
			}
			for ( item in wlHearts ) {
				dojo.addClass('myWishListHearts_item_'   + wlHearts[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListHearts_item_' + wlClubs[ item ].id );
			}
			for ( item in wlDiamonds ) {
				dojo.addClass('myWishListDiamonds_item_' + wlDiamonds[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListDiamonds_item_' + wlClubs[ item ].id );
			}

console.log("[bmc] EXIT onWishListCardClick");
		},
/////////
/////////
/////////
        onPlayerHandSelectionChanged : function() {
			console.log("[bmc] ENTER onPlayerHandSelectionChanged");
			var items = this.playerHand.getSelectedItems();

			var handCards = this.playerHand.getAllItems();
console.log( handCards );
// console.log( handCards.length );

			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}

console.log( myhand );

console.log( items);

console.log( "[bmc] gamedatas:" );
console.log( this.gamedatas );
// console.log( "[bmc] this.player_id:" );
// console.log( this.gamedatas.playerOrderTrue[ 0 ] ) ;
// console.log( this.player_id );
console.log( items.length );

			if ( this.goneDown[ this.player_id ] == 0 ) {
				if ( items.length == 1 ) {
	console.log("[bmc] Store the first");
	console.log("[bmc] prepbuttons ON");
					this.playerHand.firstSelected = items[ 0 ].type;
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_blue", "bgabutton_gray" );
				} else if ( items.length == 0 ) {
	console.log("[bmc] prepbuttons OFF");
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_gray", "bgabutton_blue" );
				}
			}
			this.showHideButtons();			
			console.log("[bmc] EXIT onPlayerHandSelectionChanged");
        },
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

            // setupNotifications:
            
            // In this method, you associate each of your game notifications with
			// your local method to handle it.
            
            // Note: game notification names correspond to "notifyAllPlayers" and
			// "notifyPlayer" calls in your *.game.php file.
        
        setupNotifications: function()
        {
console.log( '[bmc] ENTER notifications subscriptions setup' );
            
            dojo.subscribe( 'newHand'  ,         this, "notif_newHand");
			this.notifqueue.setSynchronous( 'newHand', 1000 );
            dojo.subscribe( 'discardCard' ,        this, "notif_discardCard");
            dojo.subscribe( 'drawCard' ,           this, "notif_drawCard");
            dojo.subscribe( 'drawCardSpect' ,      this, "notif_drawCardSpect");
            dojo.subscribe( 'newScores',           this, "notif_newScores" );
			dojo.subscribe( 'playerGoDown' ,       this, "notif_playerGoDown");
            dojo.subscribe( 'cardPlayed' ,         this, "notif_cardPlayed");
            dojo.subscribe( 'deckShuffled' ,       this, "notif_deckShuffled");
            dojo.subscribe( 'playerWantsToNotBuy', this, "notif_playerNotBuying");
            dojo.subscribe( 'playerWantsToBuy' ,   this, "notif_playerWantsToBuy");
            dojo.subscribe( 'playerBought' ,	   this, "notif_playerBought");
            dojo.subscribe( 'playerDidNotBuy' ,    this, "notif_playerDidNotBuy");
			dojo.subscribe( 'wentOut' , 		   this, "notif_playerWentOut");
            dojo.subscribe( 'clearBuyers' ,        this, "notif_clearBuyers");
			dojo.subscribe( 'close_btn' , 		   this, "onPlayerReviewedHandButton");
			dojo.subscribe( 'itsYourTurn' ,        this, "notif_itsYourTurn");
			dojo.subscribe( 'updateBuyers' ,       this, "notif_updateBuyers");
			dojo.subscribe( 'wishListSubmitted',   this, "notif_wishListSubmitted");
			dojo.subscribe( 'wishListDisabled',    this, "notif_wishListDisabled");
			dojo.subscribe( 'liverpoolExists',     this, "notif_liverpoolExists");
			dojo.subscribe( 'liverpoolDeclared',   this, "notif_liverpoolDeclared");
			dojo.subscribe( 'liverpoolMissed',     this, "notif_liverpoolMissed");
			dojo.subscribe( 'loadPrepDone',        this, "notif_loadPrepDone");
			dojo.subscribe( 'savePrepDone',        this, "notif_savePrepDone");
			//dojo.subscribe( 'wishListCleared',     this, "notif_wishListCleared");

            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
console.log( "[bmc] EXIT notifications subscriptions setup" );
        },  
/////////
/////////
/////////
        notif_newScores : function(notif) {
			console.log("[bmc] notif_newScores", notif);

			this.currentHandType = notif.args.currentHandType;
			
            // Update players' scores
            for ( var player_id in notif.args.newScores ) {
                this.scoreCtrl[ player_id ].toValue( notif.args.newScores[ player_id ]);
            }
			
        },
/////////
/////////
/////////
		showReviewButton : function( player_id ) {
console.log("[bmc] ENTER showReviewButton");
console.log( $('close_btn'));
console.log( player_id );

			this.buttonMessage = _('Deal me in!');
			
			if ( $('close_btn') != null ) {
console.log( $('close_btn').innerHTML );
				if ( $('close_btn').innerHTML.includes( 'Game Over!' )) {
					this.buttonMessage = _("Final Standings") ;
					this.onPlayerReviewedHandButton(); // click the 'review' button for them so it ends faster
				}
			}
			var reviewButtonID = 'buttonReview' + this.player_id;

			var isReadOnly = this.isReadOnly();
			if ( !isReadOnly ) { // Spectators are read only, no need to show buttons
				if ( this.dealMeInClicked == false ) {
					this.addActionButton( reviewButtonID, _( this.buttonMessage ), 'onPlayerReviewedHandButton' );
				}
			}
		},
/////////
/////////
/////////
		notif_playerWentOut : function( notif ) {
			console.log("[bmc] ENTER notif_playerWentOut")
			console.log( notif );
			
			// If someone went out, remove the BUY buttons, kill the timers and let them review.
			//this.stopActionTimer2();
			// this.stopActionTimerStatic();
			//this.clearButtons();
			
			dojo.removeClass('myhand_wrap', "buyerLit");				
			
			// If someone clicked their button 'On To The Next' just ignore it
			// and replace the button. The state machine will continue after ALL have clicked.
			// if ( notif.type == 'wentOut' ) {
				// if (( notif.args.ackPlayer == this.player_id ) &&
				    // ( this.handReviewed == 'No' )) {
					
					// this.handReviewed = 'Yes';
				// }
				// return;
			// }

			this.showReviewButton( notif.args.player_id );
		},
/////////
/////////
/////////
		clearTable : function() {
			// At the start of each hand give everyone time to see the first discard
			// And clear the knowledge that they've reviewed the past hand.
			this.firstLoad = 'Yes';
			this.handReviewed = 'No';
			
            // We received a new full hand of cards. Clear the table.
            this.playerHand.removeAll();
			//this.discardPile.removeAll();
			this.discardPileOne.removeAll();
			//this.deck.removeAll();
			
			for (var player in this.gamedatas.players) {
				this.downArea_A_[ player ].removeAll();
				this.downArea_B_[ player ].removeAll();
				this.downArea_C_[ player ].removeAll();
				dojo.removeClass( 'overall_player_board_' + player, 'playerWentDown' );

				this.goneDown[ player ] = 0;
			}
			
			this.myPrepA.removeAll();
			this.myPrepB.removeAll();
			this.myPrepC.removeAll();
			
			this.myPrepJoker.removeAll();
			dojo.removeClass('myPrepA', "buyerLit");
			dojo.removeClass('myPrepB', "buyerLit");
			dojo.removeClass('myPrepC', "buyerLit");
			dojo.removeClass('myPrepJoker', "buyerLit");

			this.prepSetLoc = 0; // Nothing is prepped, so clear the counters
			this.prepRunLoc = 3;
console.log("[bmc] Clear this.prepAreas1");
			this.prepAreas = 0;
		},
/////////
/////////
/////////
		setupDiscardPile : function(notif) {
console.log("[bmc] Enter setupDiscardPile");
console.log(notif);
			// Set up the discard pile
			var discardPileWeights = new Array();

			if ( notif.args.discardPile != undefined ) {
				for ( let i in notif.args.discardPile ) {
					console.log("[bmc] NEW DISCARD PILE");
					let card = notif.args.discardPile[i];
					let color = card.type;
					let value = card.type_arg;
					
					this.discardPileOne.addToStockWithId( this.getCardUniqueId(color, value), i );
					
					//Now Have discardPileOne. So 7/10/2021 Took the teeth out of this routine.
					//this.discardPile.addToStockWithId( this.getCardUniqueId( color, value ), card.id );
					let location_arg = parseInt( notif.args.discardPile[ i ][ 'location_arg' ]);
					discardPileWeights[ this.getCardUniqueId( color, value )] = location_arg;
				}
				// Set the weights in the discard pile
				// Now have discardpileOne
//				this.discardPile.changeItemsWeight(discardPileWeights);
				
			// NEW FEATURE 4/24/2021. Make discard pile only 1 card
//			if ( this.discardPile.length > 1 ) {
//				this.discardPile = this.discardPile[this.discardPile.length - 1 ];
//			}			

	console.log("[bmc] this.discardPile");			
	console.log(this.discardPileOne);

				// Set to show the count of cards in the discard pile
				this.discardSize.setValue( notif.args.discardSize );
			}
		},
/////////
/////////
/////////
		setupDeck : function(notif) {
			// Set up the draw deck
			// if ( notif.args.deck != undefined ) {
				// for ( let i = 0 ; i < notif.args.deck.length; i++ ) {
					// this.deck.addToStockWithId( 1, notif.args.deck[i] );
				// }
			// }
			if ( notif.args.drawDeckSize != undefined ) {
				this.drawDeckSize.setValue( notif.args.drawDeckSize );
			}
//console.log("[bmc] this.deck");			
//console.log(this.deck);
		},
/////////
/////////
/////////
		clearPlayerBoards : function(notif) {
			console.log("[bmc] ENTER clearPlayerBoards");
			var isReadOnly = this.isReadOnly();
			console.log("isReadOnly");
			console.log(isReadOnly);
			console.log(this.player_id);
			
			if ( !isReadOnly ) { // if not spectator
				dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
				dojo.removeClass('playerDown_B_' + this.player_id, "buyerLit");
				dojo.removeClass('playerDown_C_' + this.player_id, "buyerLit");
			}

			if ( notif.args.buyCount != undefined ) {
				for ( var player_id in this.gamedatas.players ) {
console.log("[bmc] Updating buys and cards");
					this.buyCount[ player_id ].setValue( notif.args.buyCount[ player_id ] );
					this.handCount[ player_id ].setValue( notif.args.allHands[ player_id ] );
				}
			}
			console.log("[bmc] EXIT clearPlayerBoards");
		},
/////////
/////////
/////////
        notif_newHand : function(notif) {
console.log("[bmc] ENTER notif_newHand");
console.log(notif);
			
			this.gamedatas.liverpoolExists = false;

			this.dealMeInClicked = false;

			if ( notif.args.setsNeeded != null ){ // Set the targets, if there are values there
console.log("Save Sets and Runs");
				this.gamedatas.setsNeeded = notif.args.setsNeeded;
				this.gamedatas.runsNeeded = notif.args.runsNeeded;
			}

			if ( notif.args.hand == undefined ) {
console.log("Hand is undefined");
				this.clearTable();
				this.setupDiscardPile(notif);
				this.setupDeck(notif);
				this.clearPlayerBoards(notif);
				
// TODO: This function returns too soon, from either IF condition.
				var isReadOnly = this.isReadOnly();
				if ( !isReadOnly ) { // Spectators are read only
					return; // If not spectator then wait for a hand.
				} else {
console.log("[bmc] Spectator, so not returning; Redraw the board.");
				}
				
			} else 	if ( notif.args.hand != undefined ) {
				if (notif.args.hand.length == 0 ) { // if it's just notify for the history log, do nothing
console.log("empty arg");
					return;
				}
			}
			this.clearTable();
			this.setupDiscardPile(notif);
			this.setupDeck(notif);
			this.clearPlayerBoards(notif);

console.log("Set up players new hand");

			//var isReadOnly = this.isReadOnly();
			//if ( !isReadOnly ) { // Spectators are read only
			if ( notif.args.hand != undefined )  {
				// Set up the new hand for the player
				for ( let i in notif.args.hand) {
					let card = notif.args.hand[i];
					let color = card.type;
					let value = card.type_arg;
					this.playerHand.addToStockWithId( this.getCardUniqueId( color, value ), card.id );
				}

				if ( notif.args.allHands != null ) {
					this.myHandSize.setValue( notif.args.allHands[ this.player_id ] );
				}
	console.log("[bmc] this.playerHand");			
	console.log(this.playerHand);
			}

			// Set all players to buy, except for the player whose turn it is, and light them green
			if ( this.player_id != this.gamedatas.playerOrderTrue[ notif.args.dealer_id ] ) {
				this.buyCounterTimerShouldExist = 'Yes'; // A timer and a button should exist
				this.showBuyButton2();

				dojo.removeClass('myhand_wrap', "borderDrawer");				
			} else { // It's this player's turn
				dojo.addClass('myhand_wrap', "borderDrawer");				
				
				// Notify them it's their turn
				this.showMessage( _( "It's Your Draw!"), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'tutorialrumone_itsyourdraw' );
					this.disableNextMoveSound();
				}
			}

			// Set the hand counts for all players
			for ( var p_id in notif.args.allHands ) {
				this.handCount[ p_id ].setValue( notif.args.allHands[ p_id ] );
			}
			
			// this.buyTimeInSeconds = 40;
			
			// Draw the names on the board
			for ( var player in this.gamedatas.players) {
				$("playerDown_A_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_B_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_C_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
			}

//			var mystring_translated = _("my string");  
			
			$('myPrepA').innerHTML = _("Prep A");
			$('myPrepB').innerHTML = _("Prep B");
			$('myPrepC').innerHTML = _("Prep C");
			$('myPrepJoker').innerHTML = _("Card For Joker");

			// Update the webpage with the new target

			this.currentHandType = notif.args.updCurrentHandType;
			this.totalHandCount = notif.args.updTotalHandCount;
			this.currentHandNumber = parseInt (this.currentHandType) + 1;
			
			$(handNumber).innerHTML = _("Target Hand ") + this.currentHandNumber + _(" of ") + this.totalHandCount + ": ";

			console.log( $(handNumber) );

			$(redTarget).innerHTML = notif.args.handTarget;

			console.log( $(redTarget) );

			console.log( this.gamedatas.setsNeeded );
			console.log( this.gamedatas.runsNeeded );

			console.log("[bmc] EXIT notif_newHand");
        },
/////////
/////////
/////////
		notif_deckShuffled : function(notif) {
			// Set up the draw deck
			console.log("[bmc] Shuffle Cards:");
			console.log(notif);
			
			// for ( let i = 0 ; i < notif.args.deck.length; i++ ) {
				// this.deck.addToStockWithId( 1, notif.args.deck[i] );
			// }
			//this.discardPile.removeAll();
			this.discardPileOne.removeAll();
// console.log("[bmc] Shuffled New Deck:");			
// console.log(this.deck);
		},
		
		notif_cardPlayed : function( notif ) {
console.log("[bmc]notif_cardPlayed");
            this.cardWasPlayed(
				notif.args.card_id,
				notif.args.player_id,
				notif.args.color,
				notif.args.value,
				notif.args.boardArea,
				notif.args.boardPlayer,
				notif.args.allHands
			);
console.log("[bmc] notif_cardPlayed Done.");
		},
/////////
/////////
/////////
        notif_discardCard : function( notif ) {
console.log("[bmc] ENTER notif_discardCard");
console.log( this.player_id );
console.log( notif );
			this.discardCard(
				notif.args.player_id,
				notif.args.color,
				notif.args.value,
				notif.args.card_id,
				notif.args.nextTurnPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize,
				notif.args.buyers
			);
console.log("[bmc] EXIT notif_discardCard");
		},
/////////
/////////
/////////

// TODO: DELETE ME NOW???
        notif_itsYourTurn : function( notif ) {
			console.log("[bmc] sound: It's Your Turn");
			playSound( 'tutorialrumone_ItsYourTurn' );
		},
/////////
/////////
/////////
        notif_drawCard : function( notif ) {
console.log("[bmc] ENTER notif_drawcard");
console.log( notif );

			if ( notif.args.drawsource == 'discardPile' ) {
console.log("[bmc] drew from discardPile");
				this.clearButtons();
			}

			// Clear out the Liverpool condition (unlight the button)
//			dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
			dojo.replaceClass( 'buttonLiverpool', "bgabutton_blue", "bgabutton_red" ); // item, add, remove

			// Steadily increment every time a card is drawn to set the weight properly
			this.drawCounter++;
			
            // Draw a card from the deck, discard pile or the board (i.e. joker replace)
            this.drawCard(
				notif.args.player_id,
				notif.args.card_id,
				notif.args.color,
				notif.args.value,
				notif.args.drawSource,
				notif.args.drawPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize
			);
console.log("[bmc] EXIT notif_drawcard");
        },
/////////
/////////
/////////
		notif_drawCardSpect : function(notif) {
console.log("[bmc] ENTER notif_drawcardSpect");
console.log(notif);

			// If the discard was drawn, turn off the indication of players requesting buy.
			if ( notif.args.drawSource == 'discardPile' ) {
				for ( player_id in this.gamedatas.players ) { 
					dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
				}
			}

            this.drawCardSpect(
				notif.args.player_id,
				notif.args.card_id,
				notif.args.color,
				notif.args.value,
				notif.args.drawSource,
				notif.args.drawPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize
			);
console.log("[bmc] EXIT notif_drawcardSpect");
		},
/////////
/////////
/////////
		// notif_pickJokers : function(notif) {
			// console.log("[bmc]notif_pickJokers");
			// console.log(notif);
		// },
/////////
/////////
/////////
		notif_clearBuyers : function(notif) {
			console.log("[bmc]notif_clearBuyers");
			// No one is buying because the next-next player has discarded!
			console.log(notif);
//			this.stopActionTimer2();
			this.showHideButtons();
//			this.enableDBStatic = 'No';
			// this.enableDBTimer = 'No'; // But let the timer run out if it's there
			this.enDisStaticBuyButtons('No');
			// this.stopActionTimerStatic(); // Stop the timer, we are not buying			
		},
/////////
/////////
/////////
		notif_playerNotBuying : function(notif) {
			console.log("[bmc]notif_playerIsNotBuying");
			console.log(notif);
			console.log(this.gamedatas.gamestate.active_player);
			console.log(this.player_id);

			// If  not my turn then light up the buttons or player board; else do nothing (but quietly allow the buy to happen).
			if (this.gamedatas.gamestate.active_player != this.player_id ) {
				// If I requested then clear the request
				if ( this.player_id == notif.args.player_id ) {
	//			if ( this.gamedatas.gamestate.active_player == notif.args.player_id ) {
					this.buyRequested = false;
					// this.stopActionTimer2();
					dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
					dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove
				}
				//this.showHideButtons();
			}
			// Remove from all boards
			dojo.removeClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );
		},
/////////
/////////
/////////
		notif_wishListDisabled : function(notif) {
			console.log("[bmc] ENTER notif_wishListDisabled");
			console.log(notif);
			this.setWishListColor( false );
			this.showClearWishListButton( false );
			console.log("[bmc] EXIT notif_wishListDisabled");
		},
/////////
/////////
/////////
		notif_playerBought : function(notif) {
			console.log("[bmc]notif_playerBought");
			console.log(notif);
			console.log(this.gamedatas.players);
			this.buyRequested = false;
			
			for ( player_id in this.gamedatas.players ) { 
console.log(player_id);
//				dojo.removeClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );
				dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
console.log(notif.args.buyCount[ player_id ]);
console.log(notif.args.allHands[ player_id ]);

				this.buyCount[  player_id ].setValue( notif.args.buyCount[ player_id ] );
				this.handCount[ player_id ].setValue( notif.args.allHands[ player_id ] );
			}
			
			// If I bought then turn off the wishlist if it's on
			if ( this.player_id == notif.args.player_id ) {
				this.wishListEnabled = false;
				// document.getElementById("wishListEnabled").checked = false;
				this.setWishListColor( this.wishListEnabled );
				
				// Disable the wishlist on the server
				this.disableWishList();
				
console.log( "[bmc] You bought a card!");
			}
		},
/////////
/////////
/////////
		setWishListColor : function( wLSetting ) {
console.log("[bmc] setWishListColor: ", wLSetting );

			if ( wLSetting == true ) {
				dojo.addClass(    'myWishListClubs',    'wishListClassOn' );
				dojo.addClass(    'myWishListSpades',   'wishListClassOn' );
				dojo.addClass(    'myWishListHearts',   'wishListClassOn' );
				dojo.addClass(    'myWishListDiamonds', 'wishListClassOn' );
				dojo.removeClass( 'myWishListClubs',    'wishListClassOff' );
				dojo.removeClass( 'myWishListSpades',   'wishListClassOff' );
				dojo.removeClass( 'myWishListHearts',   'wishListClassOff' );
				dojo.removeClass( 'myWishListDiamonds', 'wishListClassOff' );
				dojo.replaceClass( 'buttonSubmitWishList', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonSubmitWishList', "textGray", "textWhite" ); // item, add, remove
				console.log("Went To True Path");
			} else {
				dojo.addClass(    'myWishListClubs',    'wishListClassOff' );
				dojo.addClass(    'myWishListSpades',   'wishListClassOff' );
				dojo.addClass(    'myWishListHearts',   'wishListClassOff' );
				dojo.addClass(    'myWishListDiamonds', 'wishListClassOff' );
				dojo.removeClass( 'myWishListClubs',    'wishListClassOn' );
				dojo.removeClass( 'myWishListSpades',   'wishListClassOn' );
				dojo.removeClass( 'myWishListHearts',   'wishListClassOn' );
				dojo.removeClass( 'myWishListDiamonds', 'wishListClassOn' );
				dojo.replaceClass( 'buttonSubmitWishList', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonSubmitWishList', "textWhite", "textGray" ); // item, add, remove
				console.log("Went To False Path");
			}
		},
/////////
/////////
/////////
		notif_playerDidNotBuy : function(notif) {
			console.log("[bmc]notif_playerDidNotBuy");
			console.log(notif);
			
			if ( notif.args.buyingPlayers != null ) {
				for ( var player_id of notif.args.buyingPlayers ) {
					console.log('overall_player_board_' + player_id);
					dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
				}
			}
		},
/////////
/////////
/////////
		notif_playerWantsToBuy : function(notif) {
			console.log("[bmc]notif_playerWantsToBuy");
			console.log(notif);
			
			// if (( this.player_id == notif.args.player_id ) && 
			if  ( notif.args.activeTurnPlayer_id == notif.args.player_id ) {
console.log("[bmc] sound: It's Your Turn");
				playSound( 'tutorialrumone_ItsYourTurn' );
			} else {

				if ( this.voices ) {
					playSound( 'tutorialrumone_IllBuyIt' );
					this.disableNextMoveSound();
				}
				dojo.addClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );

				// If I requested it then change the buttons, otherwise don't
				if ( this.player_id == notif.args.player_id ) {
					// Buy allowed, change the buttons
					dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
					dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "textWhite", "textGray" ); // item, add, remove
					
					// Also track the fact we requested it (from wish list)
					this.buyRequested = true;
				}
			}
			
			// do another ajax call to let the PHP know the buy request has been registered?
			
			
			
			
			
			

			return;
			
			// TODO: DELETE THE REST OF THIS UNRUNNABLE CODE:
			
			// If by timer then run stop timers and hide the buttons
			// If by seat order then do not
			if ( this.gamedatas.options.buyMethod == 1 ) {
				// this.stopActionTimer2();
				this.showHideButtons();
				console.log( this.gamedatas.players[ notif.args.player_id ].name  );
				
				console.log("[bmc] Adding class and showing bubble");
				
				this.enDisStaticBuyButtons('No');

			} else { // Do nothing just wait for the draw
			}
		},
/////////
/////////
/////////
		notif_playerGoDown: function( notif ) {
			console.log('ENTER notif_playerGoDown. Solidify the card positions.');
			console.log( notif );
			console.log( this.gamedatas.currentPlayerId );
			console.log( this.gamedatas.playerOrderTrue );
			console.log( this.player_id );

			console.log("LIGHTING UP GONE DOWN PLAYER");
			console.log( 'overall_player_board_' + notif.args.player_id, 'playerWentDown' );
			dojo.addClass( 'overall_player_board_' + notif.args.player_id, 'playerWentDown' );

			console.log( this.voices );
			
			//this.disableNextMoveSound();
			if ( this.voices ) {
				playSound( 'tutorialrumone_GoingDown' );
//				this.disableNextMoveSound();
			}
		
			// Update card-counts when someone goes down:

			for ( var p_id in notif.args.allHands ) {
				this.handCount[ p_id ].setValue( notif.args.allHands[ p_id ] );
			}

			if (notif.args.allHands != null ) {
				this.myHandSize.setValue( notif.args.allHands[ this.player_id ] );
			}
			
			this.goneDown[ notif.args.player_id ] = 1; //0 = Not gone down; 1 = Gone down.
			
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player who went down is me then gray the buttons
				dojo.replaceClass( 'buttonLoadPrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonSavePrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			}


			downPlayer = notif.args.player_id;
			downArea = notif.args.player_down;
			card_ids = notif.args.card_ids;
			card_type = notif.args.card_type;
			card_type_arg = notif.args.card_type_arg;
console.log( card_ids );

			joker = notif.args.joker;
console.log("[bmc] joker:");
console.log(joker);
			
			// Check if we are a spectator. If so, then don't deal with CSS class borders.
			var isReadOnly = this.isReadOnly();
console.log("[bmc] Spectator T/F:");
console.log( isReadOnly );
			
			if ( !isReadOnly ) {
				// Remove the borders around the prep area
				// dojo.removeClass('playerDown_A_' + notif.args.player_id, "buyerLit");
				// dojo.removeClass('playerDown_B_' + notif.args.player_id, "buyerLit");
				// dojo.removeClass('playerDown_C_' + notif.args.player_id, "buyerLit");
				
				// And move the cards from my prep area to the board
				for ( card_id in card_ids ) {
					color = card_type[ card_id ];
					value = card_type_arg[ card_id ];

					console.log(color);
					console.log(value);
					
					cardUniqueId = this.getCardUniqueId( color, value );
					console.log(cardUniqueId);
					
					if ( downArea === 'playerDown_A_' ) {
						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepA' );
						this.myPrepA.removeFromStockById( card_ids[ card_id ] );
					}
					if ( downArea === 'playerDown_B_' ) {
						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepB' );
						this.myPrepB.removeFromStockById( card_ids[ card_id ] );
					}
					if ( downArea === 'playerDown_C_' ) {
						this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepC' );
						this.myPrepC.removeFromStockById( card_ids[ card_id ] );
					}
				}
			}
			
			if ( this.gamedatas.gamestate.active_player == this.player_id ) {
				console.log("[bmc] I went down!");

				if ( card_ids != undefined ) {

					// And move the cards from my prep area to the board
					for ( card_id in card_ids ) {
						color = card_type[ card_id ];
						value = card_type_arg[ card_id ];

						console.log(color);
						console.log(value);
						
						cardUniqueId = this.getCardUniqueId( color, value );
						console.log(cardUniqueId);
						
						if ( downArea === 'playerDown_A_' ) {
							this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepA' );
							this.myPrepA.removeFromStockById( card_ids[ card_id ] );
						}
						if ( downArea === 'playerDown_B_' ) {
							this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepB' );
							this.myPrepB.removeFromStockById( card_ids[ card_id ] );
						}
						if ( downArea === 'playerDown_C_' ) {
							this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepC' );
							this.myPrepC.removeFromStockById( card_ids[ card_id ] );
						}
					}
				}
				
				// Unselect all board cards
				for ( var player in this.gamedatas.players ) {
					this.downArea_A_[ player ].unselectAll();
					this.downArea_B_[ player ].unselectAll();
					this.downArea_C_[ player ].unselectAll();
				}

				// Remove the highlighted border from prep areas
				dojo.removeClass('myPrepA', "buyerLit");
				dojo.removeClass('myPrepB', "buyerLit");
				dojo.removeClass('myPrepC', "buyerLit");
				
				this.goneDown[ this.player_id ] = 1;
				
				// Move the joker, if any, to the down position, everything else is already in place because of the prep
				
				if ( joker != undefined ) { // Per JS must check undefined before checking for a property of the variable
					if ( joker.id != 'None' ) { // Then there's a joker; Move it
				
						jokerUniqueID = this.getCardUniqueId( joker.type, joker.type_arg );
						
						targetArea = notif.args.targetArea;
						
						if ( targetArea === 'playerDown_A' ) {
							console.log("[bmc] Adding Joker to AREA A");
							this.downArea_A_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_A( downPlayer );
						}
						if ( targetArea === 'playerDown_B' ) {
							console.log("[bmc] Adding Joker to AREA B");
							this.downArea_B_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_B( downPlayer );
						}
						if ( targetArea === 'playerDown_C' ) {
							console.log("[bmc] Adding Joker to AREA C");
							this.downArea_C_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_C( downPlayer );
						}
						this.playerHand.removeFromStockById(joker.id);
					}
				}
				this.showHideButtons();
//				return;
				
			} else {
				console.log("[bmc] Someone else went down!");
				for ( card_id in card_ids ) {
					console.log(card_id);
//					color = card_ids[card_id]['type'];
//					value = card_ids[card_id]['type_arg'];
					color = card_type[ card_id ];
					value = card_type_arg[ card_id ];

					console.log(color);
					console.log(value);
					
					cardUniqueId = this.getCardUniqueId( color, value );
					console.log(cardUniqueId);
					
					if ( downArea === 'playerDown_A_' ) {
						console.log("[bmc] Adding to AREA A");
// EXPERIMENT 10/20/2020 7:09pm Not sure how this could be wrong but it seems wrong. Changing it
//						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + downPlayer );
						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );
						
//						dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
						// this.sortArea_A( downPlayer );

					}
					if ( downArea === 'playerDown_B_' ) {
						console.log("[bmc] Adding to AREA B");
//						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + downPlayer );
						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );
					}
					if ( downArea === 'playerDown_C_' ) {
						console.log("[bmc] Adding to AREA C");

						this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );

					}

// slideToObject
// function( mobile_obj, target_obj, duration, delay )
// Return an dojo.fx animation that is sliding a DOM object from its
// current position over another one
// Animate a slide of the DOM object referred to by domNodeToSlide from its
// current position to the xpos, ypos relative to the object referred to by domNodeToSlideTo.

					this.playerHand.removeFromStockById( card_ids[ card_id ]);
				}
			}
			if ( notif.args.targetArea != null ) {
				this.sortBoard();
			}
		},
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
});