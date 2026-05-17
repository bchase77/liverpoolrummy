<?php
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
  * liverpoolrummy.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */

require_once('modules/php/CardHelpers.trait.php');
require_once('modules/php/PlayerState.trait.php');
require_once('modules/php/DrawDiscard.trait.php');
require_once('modules/php/Buying.trait.php');
require_once('modules/php/Melds.trait.php');
require_once('modules/php/GoDown.trait.php');
require_once('modules/php/Liverpool.trait.php');
require_once('modules/php/Scoring.trait.php');
require_once('modules/php/StateMachine.trait.php');

use \Bga\GameFramework\Actions\Types\IntArrayParam;
use \Bga\GameFramework\Actions\CheckAction;

class LiverpoolRummy extends Bga\GameFramework\Table
{
	use CardHelpers, PlayerState, DrawDiscard, Buying, Melds, GoDown, Liverpool, Scoring, StateMachine;

	function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        
        self::initGameStateLabels( array( 
            //    "my_first_global_variable" => 10,
            //    "my_second_global_variable" => 11,
            //      ...
            //    "my_first_game_variant" => 100,
            //    "my_second_game_variant" => 101,
            //      ...
		  // To track buyers realtime, instead of using the database which can lock, use a gamestate. Each player gets 1 variable.

//			"activePlayer" => 2, // This is built in
            "currentHandType" => 10,
//			"area_A_target" => 11,
//			"area_B_target" => 12,
//			"area_C_target" => 13,
			"forJokerCard_id" => 20,
			"forJokerBoardArea" => 21,
			"forJokerBoardPlayer" => 22,
			"forJokerTheJoker_id" => 23,
			"forJokerPlayerID" => 24,
			"activeTurnPlayer_id" => 25,
			"previous_player_id" => 26,
			"drawSourceValue" => 27,
			"dealer" => 28,
			"discardWeightHistory" => 29,
			"discardSize" => 30,
			"shuffleCount" => 31,
			"skipFirstDeal" => 32,
			"findBuyerFailsafe" => 33,
			"numberOfDecks" => 100,
			"gameLengthOption" => 102,
			"LiverpoolConsequence" => 103,
			"numberOfJokers" => 104,
			"numberOfBuys" => 105,
			"alwaysDeal11" => 106,
			"outReason" => 107,
			"enableWishList" => 108,
			"allowJokerSwapping" => 109,
			"drawStamp" => 110,
			"tabletop" => 111,

			"LPMissed" => 125,
			"liverpoolExists" => 126,
			"playerFindingLP" => 127,
			"playerInterrupted" => 128,
			"liverpoolFoundYN" => 129,
			"LPcardsPlayed" => 130,
			"discardingPlayer" => 131,
			
			"countDeck" => 146,
			"countDiscardPile" => 147,
			"theBuyer" => 148,
			"isBuyingAllowed" => 149 // 0 == false; 1 == true

        ) );
	
        $this->cards = self::getNew( "module.common.deck" );
        $this->cards->init( "card" );
		
		// This next is recommended by GTSchemer to avoid deadlocks:
		$this->bSelectGlobalsForUpdate = true;
	}
	
    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {
//		self::trace("[bmc] !!setupNewGame!!"); // Doesn't appear in log!

        // Don't do a lot here since server side hasn't been set up yet and so it's hard to debug.
		// Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the max number of players allowed for game
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
		
		$this->options = $options;

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
		
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player[ 'player_name' ] )."','".addslashes( $player['player_avatar'] )."')";
        }
//        $sql .= implode( $values, ',' ); // PHP8 requires inverted implode parameters
        $sql .= implode( ',', $values );
        self::DbQuery( $sql );

        self::reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        self::reloadPlayersBasicInfos();

        self::setGameStateInitialValue( 'currentHandType', 0 );

        self::setGameStateInitialValue( 'liverpoolFoundYN', 0 ); // 0 = false; 1 = true

        self::setGameStateInitialValue( 'LPMissed', 0 ); // 0 = false; 1 = true

		self::setGameStateInitialValue( 'LPcardsPlayed', 0 );

		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		
		//self::dump("[bmc] handTypes(line145):", $this->handTypes[$currentHandType]);

		self::setGameLength();

		// Show the wishlist to players if the gamestate was set for it
		if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) { // 0 == No. 1 == Yes.
			// Not sure what to do. I wanted to set the style to display or not but that's a JS thing, not PHP.
		}

        // Activate first player (which is in general a good idea :) )
        $player_id = $this->activeNextPlayer();

		self::setGameStateInitialValue( 'drawSourceValue', 2 ); // 0 = deck, 1 = discardPile. This should be set 
		// every time drawCard is called but including it here for completeness.
		//self::dump("[bmc] currentTurnPlayer_id:", $currentTurnPlayer_id );

		self::setGameStateInitialValue( 'isBuyingAllowed', 1 ); // 0 == false; 1 == true

		$activePlayerId = $this->getActivePlayerId();
//		self::dump("[bmc] activeTurnPlayer_id:", $activePlayerId );

		// Store which player's turn it really is for access during the multipleactiveplayer state.
		self::setGameStateInitialValue( 'activeTurnPlayer_id', $activePlayerId );
		
		$dealer = $this->getPlayerBefore( $activePlayerId );
		
		self::setGameStateInitialValue( 'dealer', $dealer );

		// Clear out the BUY counters for all players
		self::clearPlayersBuyCount();

		self::setGameStateInitialValue( 'discardWeightHistory', 300 ); // Start higher than any game will have qty of cards

        self::setGameStateInitialValue( 'skipFirstDeal', 1 ); // 0 is false. 1 is true. It seems to want integers.

		$this->waiting = false; // This keeps the state machine from getting out of sync by requiring
		
		// Set up failsafe in case the recursion doesn't work
		self::setGameStateInitialValue( 'findBuyerFailsafe', 0 );

		// Probably not necessary, but all variables should at least be defined before used.
		self::setGameStateInitialValue( 'outReason', 2 ); // 0 = Someone out, 1 = Overshuffled, 2 = AllCardsPlayed
		
		// all players to select BUY / NOT BUY before a player discards a 2nd time.

		self::setGameStateInitialValue( 'liverpoolExists', 0 ); // 0 = not exist; 1 = exist
		self::setGameStateInitialValue( 'playerFindingLP', 0 ); // 0 = no player

		// Initialization of drawStamp probably not needed since draw card will set it before discard compares it
		self::setGameStateInitialValue( 'drawStamp', 0 );

        /************ Start the game initialization *****/

        // Init global values with their initial values
        //self::setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //self::initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //self::initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)
        self::initStat( 'table',  'turns_number', 0 );
        self::initStat( 'player', 'buys_number', 0 );
        self::initStat( 'player', 'jokers_number', 0 );

        /************ End of the game initialization *****/
        return 10; // First state: deckSetup
    }


	// PHP program to search for multiple
	// key=>value pairs in array
  
	function stDeckSetup()
	{
		self::trace("[bmc] !!setupNewDeck!!");
        // The game is played with multiple standard 52-pack plus 2 jokers.
        // 2 decks for three to five players. 3 decks for more players. 

        // Variants (from Wikipedia):
        //   3 runs: Go down with no remaining cards in hand, no final discard (12 cards)
        //   First one to click BUY gets it, not the first in line
        //   Runs must include at least 3 non-wildcards in an original 4 card grouping.
        //   Sets must include at least 2 non-wildcards.
        //   Replace that other player's laid Joker from within a run (or a set)
        //   Discard must not fit into either their own or any other player's laid cards.
        //     (or else draw extra card and whoever called Liverpool can discard a card)
		
		// Create cards
        $cards = array ();

		$numberOfDecks = self::getGameStateValue( 'numberOfDecks' );
		//self::dump( "[bmc] numberOfDecks", $numberOfDecks );

// 'type' means 1=C; 2=S; 3=H;4=D

//        foreach ( $this->colors as $color_id => $color ) {
		for ($colors = 1; $colors <=4; $colors ++) {
			$color_id = $colors;
            // spade, heart, diamond, club
            foreach ( $this->values_label as $value => $type_arg ) {
                //  A, 2, 3, 4, ... K
				if ( !array_key_exists("51", $cards)) {
					$cards [] = array ('type' => $color_id, 'type_arg' => $value, 'nbr' => $numberOfDecks );
				}
            }
        }

//		self::trace("[bmc] !!makingCards!!");
		
        // Add jokers

		$optionNumJokers =  self::getGameStateValue( 'numberOfJokers' );
		if ( $optionNumJokers != 10) {
			$numJokerDecks = intdiv( $optionNumJokers, 2 );
		} else {
			$numJokerDecks = $numberOfDecks;
		}
		
        $jokers = array ();
		$color = 5;
		for ($value = 1; $value <= 2; $value ++) {
			array_push( $cards, array ('type' => $color, 'type_arg' => $value, 'nbr' => $numJokerDecks ));
		}
		
		// If number of jokers chosen is odd then add 1 more joker to the 
		if ( $optionNumJokers % 2 != 0 ) {
			array_push( $cards, array ('type' => $color, 'type_arg' => 1, 'nbr' => 1 ));
		}

        $this->cards->createCards( $cards, 'deck' );

//		$allCardsDebug = $this->cards->getCardsInLocation( 'deck' );

//		self::dump( "[bmc] AllCardsDebug: ", $allCardsDebug );

        // Shuffle deck
//        $this->cards->shuffle( 'deck' );

//		$allCardsDebug = $this->cards->getCardsInLocation( 'deck' );

//		self::dump( "[bmc] afterShuffle: ", $allCardsDebug );

        self::setGameStateInitialValue( 'countDiscardPile', 1 );
        //self::setGameStateInitialValue( 'countDeck', $allCardsDebug );

		// Set to autoreshuffle discardPile into deck, but I don't think this worked
	
		$this->cards->autoreshuffle_custom = array('deck' => 'discardPile');

		// Go to the next game state
        $this->gamestate->nextState();	
	}
	
    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
////
////
////
    protected function getAllDatas()
    {
		// This returns data to the JS code in gamedatas datastructure
		// self::trace("[bmc] ENTER getAllDatas");
		self::trace("'<span style='color:red'>[bmc] ENTER getAllDatas</span>'");

		$dpCard = $this->cards->getCardsInLocation( 'discardPile' );
		
		if ( isset( reset( $dpCard )[ 'id' ])) {

			self::dump("[bmc] dpCard:", reset( $dpCard )[ 'id' ]);

			$currentCard = $this->cards->getCard( reset( $dpCard )[ 'id' ] );

			self::dump("[bmc] currentCardInDP:", $currentCard);

			if ( $currentCard[ 'type' ] == 5 ) {
				$value_displayed = 'Joker';
				$color_displayed = '';
			} else {
				$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
				$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
			}

			self::dump("[bmc] vd:", $value_displayed);
			self::dump("[bmc] cd:", $color_displayed);
			$dealer = 'bob';
			$handTarget = 'food';
		}

        $result = array();
    
        $current_player_id = self::getCurrentPlayerId();    // !! We must only return informations visible by this player !!
    
		$APL = $this->gamestate->getActivePlayerList();
		self::dump( "[bmc] APL:", $APL);
		
		$result['currentPlayerId'] = $current_player_id;
		$result['discardingPlayer_id'] = $this->getPlayerBefore( self::getActivePlayerId() );
		
		self::dump( "[bmc] enableWishList:", $this->getGameStateValue( 'enableWishList' ) );
		
		if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) {
			$result['enableWishList'] = true;
		} else {
			$result['enableWishList'] = false;
		}
		
        // Get information about players
        // Note: you can retrieve some extra field you added for "player" table in "dbmodel.sql" if you need it.
		
        $sql = "SELECT player_id id, player_score score FROM player ";
        $result['players'] = self::getCollectionFromDb( $sql );

		$playersHand = $this->cards->getCardsInLocation( 'hand', $current_player_id );
		//self::dump( "[bmc] playersHand:", $playersHand );

        // Return cards in player hand
        $result['hand'] = $playersHand;

		$result['deckIDs'] = array_keys($this->cards->getCardsInLocation( 'deck' ));
		
		$bob = $this->cards->getCardsInLocation( 'deck' );

//		self::dump( "[bmc] deckIDsak:", array_keys($this->cards->getCardsInLocation( 'deck' )));
//		self::dump( "[bmc] deckIDs:", $this->cards->getCardsInLocation( 'deck' ));

//		self::dump( "[bmc] bob:", $bob);

		$cardIDsInDeck = array();
		$cardLAsInDeck = array();
		
		foreach ( $bob as $card ) {
			//self::dump("[bmc] deckIDcard: ", $card );
			//self::dump("[bmc] deckIDcard: ", $card[ 'location_arg' ]);
			array_push( $cardIDsInDeck, $card[ 'id' ]);
			array_push( $cardLAsInDeck, $card[ 'location_arg' ]);
		}

		// self::dump( "[bmc] cardIDsInDeck:", $cardIDsInDeck );
		// self::dump( "[bmc] cardLAsInDeck:", $cardLAsInDeck );

		// $ar = array(
			   // array("10", 11, 100, 100, "a"),
			   // array(   1,  2, "2",   3,   1)
			  // );
			  
//		array_multisort( $cardLAsInDeck, SORT_DESC, $cardIDsInDeck );
		array_multisort( $cardLAsInDeck, SORT_ASC, $cardIDsInDeck );

		// self::dump( "[bmc] cardsIDsInDeck AfterSort:", $cardIDsInDeck );
		// self::dump( "[bmc] cardsLAsInDeck AfterSort:", $cardLAsInDeck );

		$result['cardIDsInDeck'] = $cardIDsInDeck ;

        // Shuffle deck
        // $this->cards->shuffle( 'deck' );

		// $allCardsDebug = $this->cards->getCardsInLocation( 'deck' );

		// self::dump( "[bmc] afterShuffle: ", $allCardsDebug );

		// TODO the next line with $result used to be 497 (apparently the deck was empty):
		// [18-Jan-2025 22:36:41 America/New_York] PHP Warning:  Trying to access array offset on value of type null in /var/tournoi/release/games/liverpoolrummy/241230-2311/liverpoolrummy.game.php on line 497
		// [18-Jan-2025 21:36:42 America/Chicago] PHP Warning:  Trying to access array offset on value of type null in /var/tournoi/release/games/liverpoolrummy/241230-2311/liverpoolrummy.game.php on line 497
		// [18-Jan-2025 22:36:42 America/Bogota] PHP Warning:  Trying to access array offset on value of type null in /var/tournoi/release/games/liverpoolrummy/241230-2311/liverpoolrummy.game.php on line 497
		
		$deckTopCard = $this->cards->getCardOnTop( 'deck' );
		$result['deckTopCard'] = $this->cards->getCardOnTop( 'deck' )[ 'id' ];
		
		self::dump( "[bmc] deckTopCard: ", $result[ 'deckTopCard' ]);

		$result['allHands'] = $cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		
		self::dump( "[bmc] allHands:", $cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' ));

		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		$result['dbgcountA'] = $countCardsByLocation ;
		$result['dbgcountV'] = count( $countCardsByLocation );

		$playersNumber = self::getPlayersNumber();
		$result['dbgPlayersNumber'] = $playersNumber ;
		
		self::setGameLength();

		$result['handTypes']["Target"] = $this->handTypes; // Pull the description
		
		$buyers = self::getPlayerBuying();

		self::dump("[bmc] gamedatas buyers:", $buyers);

		$players = self::loadPlayersBasicInfos();
		
		// self::dump( "[bmc] players:", $players );

        $playerIDList = [];

		foreach ( $players as $playerIDOnly ) {
			$playerIDList[] = $playerIDOnly[ "player_id" ];
		}
		
		// self::dump( "[bmc] playerIDList:", $playerIDList );

        $playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.
		
		$buyCount = self::getPlayersBuyCount();
		
		self::dump("[bmc] gamedatas buyCount:",   $buyCount);

		$discardSize = count( $this->cards->countCardsByLocationArgs( 'discardPile' ));
		
		self::setGameStateValue( 'discardSize', $discardSize );
		
		$discardTopCard = $this->cards->getCardOnTop( 'discardPile' );
		$result['discardTopCard'] = $this->cards->getCardOnTop( 'discardPile' );
		
		$result['discardSize'] = $discardSize;

		foreach ( $players as $player_id => $player ) {
			$result[ 'downArea_A_' ][ $player_id ] = $this->cards->getCardsInLocation( 'playerDown_A' , $player_id );
			$result[ 'downArea_B_' ][ $player_id ] = $this->cards->getCardsInLocation( 'playerDown_B' , $player_id );
			$result[ 'downArea_C_' ][ $player_id ] = $this->cards->getCardsInLocation( 'playerDown_C' , $player_id );
			$result[ 'goneDown' ][ $player_id ] = $playerGoneDown[ $player_id ];		
			$result[ 'buyers' ][ $player_id ] = $buyers[ $player_id ];
			$result[ 'buyCount'][ $player_id ] = $buyCount[ $player_id ];
		}

		// Put the jokers on the top of the deck
		$cardsForDeck = array(
			0 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			1 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				),
			2 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			3 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				)
			);

		$jokerLoc = 100; // Higher numbers are closer to the top of the deck
		
		foreach ( $cardsForDeck as $cardToAdd ) {
			$cardsInDeck = $this->cards->getCardsInLocation( 'deck' );

			$presetHandCard = self::searchForCard( $cardsInDeck, $cardToAdd );
			//self::dump("[bmc] findJoker:", $presetHandCard );
			
			$jokerLoc = $jokerLoc - 1;
			//self::dump("[bmc] jokerLoc:", $jokerLoc );
		};
//		$allCardsDebug =  $this->cards->getCardsInLocation( 'deck' );
//		self::dump("[bmc] allCardsInDeck:", $allCardsDebug );


//		$allCardsDebug = $this->cards->getCardsInLocation( 'jokerPile' );
//		//self::dump("[bmc] allCardsInJokerPile:", $allCardsDebug );
		
		$result[ 'currentHandType' ] = self::getGameStateValue( 'currentHandType' );

		$result[ 'totalHandCount' ] = count( $this->handTypes );

		$result[ 'discardPile' ] = $this->cards->getCardsInLocation( 'discardPile' );
        
        // Cards played on the table
        $result['cardsontable'] = $this->cards->getCardsInLocation( 'cardsontable' );

		$debugCount = $this->cards->countCardsInLocations();
//		self::trace("[bmc] !!cardsinlocations!!");
		
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		$result[ 'activeTurnPlayer_id' ] = $activeTurnPlayer_id ;
  
//		self::dump("[bmc] activeTurnPlayer_id", $activeTurnPlayer_id );

		$playerOrder = self::getNextPlayerTable();
//		self::dump( "[bmc] playerOrder: ", $playerOrder );

		$result['playerOrderTrue'] = $playerOrder;

		// Just make sure it stuck!
		$activePlayerId = $this->getActivePlayerId();
//		self::dump( "[bmc] GETALLDATAS activePlayerId:", $activePlayerId );

		// Show State
		$state = $this->gamestate->state();
		self::dump("[bmc] GETALLDATAS state:", $state);
		
		$cardsInHd = $this->cards->getCardsInLocation( 'hand' );
		$cardsInDk = $this->cards->getCardsInLocation( 'deck' );
		$cardsInDp = $this->cards->getCardsInLocation( 'discardPile' );
		$cardsInBa = $this->cards->getCardsInLocation( 'playerDown_A' );
		$cardsInBb = $this->cards->getCardsInLocation( 'playerDown_B' );
		$cardsInBc = $this->cards->getCardsInLocation( 'playerDown_C' );

		// self::dump("[bmc] cardsInHd:", $cardsInHd);
		// self::dump("[bmc] cardsInDk:", $cardsInDk);
		// self::dump("[bmc] cardsInDp:", $cardsInDp);
		// self::dump("[bmc] cardsInBa:", $cardsInBa);
		// self::dump("[bmc] cardsInBb:", $cardsInBb);
		// self::dump("[bmc] cardsInBc:", $cardsInBc);

		$numberOfDecks = self::getGameStateValue( 'numberOfDecks' );
		
		// self::dump( "[bmc] numberOfDecks", $numberOfDecks );
		
		$result[ 'options' ][ 'numberOfDecks' ] = $numberOfDecks;

		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		
		self::dump( "[bmc} count of handtypes:", count( $this->handTypes ));
		
		if ( $currentHandType != null ) {
			self::dump( "[bmc] 711 currentHandType:", $currentHandType );
			
			if ( $currentHandType != null ) {
				$result[ 'handTarget' ] = $this->handTypes[ $currentHandType ]["Target"];
			}
		}
		
		$sql = "SELECT id id, card_type, card_type_arg FROM wishList WHERE player_id = '";
		$sql_command = $current_player_id . "'";
		
		// self::dump( "[bmc] sql:", $sql . $sql_command );

		$wishListAll = self::getCollectionFromDb( $sql . $sql_command );
		
		$result[ 'wishList' ] = self::getCollectionFromDb( $sql . $sql_command );
		// self::dump( "[bmc] wishListAll:", $wishListAll );

		$result[ 'liverpoolExists' ] = self::getGameStateValue( 'liverpoolExists' );

		$result[ 'setsNeeded' ] = $this->handTypes[ $currentHandType ][ "QtySets" ];
		$result[ 'runsNeeded' ] = $this->handTypes[ $currentHandType ][ "QtyRuns" ];

//		self::trace("[bmc] EXIT GETALLDATAS");
		self::trace("'<span style='color:green'><b>[bmc] EXIT GETALLDATAS</b></span>'");

		// Determine the type of tabletop
        $result['tabletop'] = $this->getGameStateValue( 'tabletop' );

        @include_once( dirname(__FILE__) . '/version.inc.php' );
        $result['gameVersion'] = isset( $gameVersion ) ? $gameVersion : '';

        return $result;
    }
////////
////////
////////
	function presetHands( $players, $debug ) {
		// self::trace("[bmc] ENTER presetHands"); // Colors 1,2,3,4 = CSHD
		self::trace("'<span style='color:red'>[bmc] ENTER presetHands</span>'");

		$testPlayerHandArray = [];

		$testPlayerHandArray[0] = array(
			0 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			1 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			2 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			3 => array(
				'type' => '3', // Suit
				'type_arg' => '8' // Value
				),
			4 => array(
				'type' => '2', // Suit
				'type_arg' => '9' // Value
				),
			5 => array(
				'type' => '3', // Suit
				'type_arg' => '11' // Value
				),
			6 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			7 => array(
				'type' => '4', // Suit
				'type_arg' => '11' // Value
				),
			8 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				),
			9 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				),
			10 => array(
				'type' => '1', // Suit
				'type_arg' => '11' // Value
				),
			11 => array(
				'type' => '1', // Suit
				'type_arg' => '11' // Value
				),
			12 => array(
				'type' => '1', // Suit
				'type_arg' => '9' // Value
				),
			);
		$testPlayerHandArray[1] = array(
			0 => array(
				'type' => '2', // Suit
				'type_arg' => '10' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '11' // Value
				),
			2 => array(
				'type' => '2', // Suit
				'type_arg' => '12' // Value
				),
			3 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			5 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			6 => array(
				'type' => '3', // Suit
				'type_arg' => '8' // Value
				),
			7 => array(
				'type' => '3', // Suit
				'type_arg' => '8' // Value
				),
			8 => array(
				'type' => '3', // Suit
				'type_arg' => '6' // Value
				),
			9 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			10 => array(
				'type' => '3', // Suit
				'type_arg' => '8' // Value
				),
			11 => array(
				'type' => '2', // Suit
				'type_arg' => '12' // Value
				),
			12 => array(
				'type' => '2', // Suit
				'type_arg' => '13' // Value
				)
			);

		$testPlayerHandArray[2] = array(
			0 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			1 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '3', // Suit
				'type_arg' => '11' // Value
				),
			3 => array(
				'type' => '3', // Suit
				'type_arg' => '12' // Value
				),
			4 => array(
				'type' => '3', // Suit
				'type_arg' => '13' // Value
				),
			5 => array(
				'type' => '3', // Suit
				'type_arg' => '1' // Value
				),
			6 => array(
				'type' => '4', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '3', // Suit
				'type_arg' => '6' // Value
				),
			8 => array(
				'type' => '2', // Suit
				'type_arg' => '1' // Value
				),
			9 => array(
				'type' => '2', // Suit
				'type_arg' => '9' // Value
				),
			10 => array(
				'type' => '2', // Suit
				'type_arg' => '8' // Value
				),
			11 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			12 => array(
				'type' => '2', // Suit
				'type_arg' => '4' // Value
				),
			13 => array(
				'type' => '2', // Suit
				'type_arg' => '5' // Value
				),
			14 => array(
				'type' => '2', // Suit
				'type_arg' => '6' // Value
				)
			);
/*
		$testPlayerHandArray[0] = array(
			0 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '2' // Value
				),
			2 => array(
				'type' => '4', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '3', // Suit
				'type_arg' => '2' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '2' // Value
				),
			5 => array(
				'type' => '3', // Suit
				'type_arg' => '12' // Value
				),
			6 => array(
				'type' => '3', // Suit
				'type_arg' => '12' // Value
				),
			7 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			8 => array(
				'type' => '2', // Suit
				'type_arg' => '4' // Value
				),
			9 => array(
				'type' => '2', // Suit
				'type_arg' => '5' // Value
				),
			10 => array(
				'type' => '2', // Suit
				'type_arg' => '6' // Value
				),
*/
/*
,
			14 => array(
				'type' => '1', // Suit
				'type_arg' => '7' // Value
				),
			15 => array(
				'type' => '2', // Suit
				'type_arg' => '8' // Value
				),
			16 => array(
				'type' => '1', // Suit
				'type_arg' => '13' // Value
				)
*/
/*,
			8 => array(
				'type' => '1', // Suit
				'type_arg' => '3' // Value
				),
			9 => array(
				'type' => '1', // Suit
				'type_arg' => '4' // Value
				),
			10 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			11 => array(
				'type' => '2', // Suit
				'type_arg' => '7' // Value
				),
			12 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			13 => array(
				'type' => '3', // Suit
				'type_arg' => '9' // Value
				),
			14 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				)
*/
/*
			0 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			1 => array(
				'type' => '1', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '1', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '1', // Suit
				'type_arg' => '3' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '4' // Value
				),
			5 => array(
				'type' => '1', // Suit
				'type_arg' => '5' // Value
				),
			6 => array(
				'type' => '1', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '3', // Suit
				'type_arg' => '13' // Value
				)
			);
		$testPlayerHandArray[1] = array(
			0 => array(
				'type' => '1', // Suit
				'type_arg' => '1' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '3', // Suit
				'type_arg' => '1' // Value
				),
			3 => array(
				'type' => '4', // Suit
				'type_arg' => '5' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			5 => array(
				'type' => '2', // Suit
				'type_arg' => '8' // Value
				),
			6 => array(
				'type' => '3', // Suit
				'type_arg' => '8' // Value
				)
			);
		$testPlayerHandArray[2] = array(
			0 => array(
				'type' => '1', // Suit
				'type_arg' => '7' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '7' // Value
				),
			2 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			3 => array(
				'type' => '4', // Suit
				'type_arg' => '8' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '6' // Value
				),
			5 => array(
				'type' => '2', // Suit
				'type_arg' => '6' // Value
				),
			6 => array(
				'type' => '3', // Suit
				'type_arg' => '6' // Value
				)
			);
		$testPlayerHandArray[3] = array(
			0 => array(
				'type' => '1', // Suit
				'type_arg' => '3' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			2 => array(
				'type' => '3', // Suit
				'type_arg' => '3' // Value
				),
			3 => array(
				'type' => '4', // Suit
				'type_arg' => '9' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '2' // Value
				),
			5 => array(
				'type' => '2', // Suit
				'type_arg' => '2' // Value
				),
			6 => array(
				'type' => '3', // Suit
				'type_arg' => '2' // Value
				)
			);
*/
/*
		$testPlayerHandArray[0] = array(
			0 => array(
				'type' => '3', // Suit
				'type_arg' => '7' // Value
				),
			1 => array(
				'type' => '1', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '1', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '1', // Suit
				'type_arg' => '3' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '4' // Value
				),
			5 => array(
				'type' => '1', // Suit
				'type_arg' => '5' // Value
				),
			6 => array(
				'type' => '1', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '1', // Suit
				'type_arg' => '7' // Value
				),
			8 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			9 => array(
				'type' => '1', // Suit
				'type_arg' => '5' // Value
				),
			10 => array(
				'type' => '1', // Suit
				'type_arg' => '10' // Value
				),
			11 => array(
				'type' => '1', // Suit
				'type_arg' => '11' // Value
				),
			12 => array(
				'type' => '1', // Suit
				'type_arg' => '12' // Value
				),
			13 => array(
				'type' => '1', // Suit
				'type_arg' => '13' // Value
				),
			14 => array(
				'type' => '3', // Suit
				'type_arg' => '13' // Value
				)
			);
		$testPlayerHandArray[1] = array(
			0 => array(
				'type' => '4', // Suit
				'type_arg' => '5' // Value
				),
			1 => array(
				'type' => '1', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '1', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '1', // Suit
				'type_arg' => '3' // Value
				),
			4 => array(
				'type' => '1', // Suit
				'type_arg' => '4' // Value
				),
			5 => array(
				'type' => '1', // Suit
				'type_arg' => '9' // Value
				),
			6 => array(
				'type' => '1', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '1', // Suit
				'type_arg' => '7' // Value
				),
			8 => array(
				'type' => '1', // Suit
				'type_arg' => '8' // Value
				),
			9 => array(
				'type' => '1', // Suit
				'type_arg' => '9' // Value
				),
			10 => array(
				'type' => '1', // Suit
				'type_arg' => '10' // Value
				),
			11 => array(
				'type' => '1', // Suit
				'type_arg' => '11' // Value
				),
			12 => array(
				'type' => '1', // Suit
				'type_arg' => '12' // Value
				),
			13 => array(
				'type' => '1', // Suit
				'type_arg' => '13' // Value
				),
			14 => array(
				'type' => '3', // Suit
				'type_arg' => '12' // Value
				)
			);
		$testPlayerHandArray[2] = array(
			0 => array(
				'type' => '3', // Suit
				'type_arg' => '4' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '2', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			4 => array(
				'type' => '2', // Suit
				'type_arg' => '4' // Value
				),
			5 => array(
				'type' => '2', // Suit
				'type_arg' => '5' // Value
				),
			6 => array(
				'type' => '2', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '2', // Suit
				'type_arg' => '7' // Value
				),
			8 => array(
				'type' => '2', // Suit
				'type_arg' => '8' // Value
				),
			9 => array(
				'type' => '2', // Suit
				'type_arg' => '5' // Value
				),
			10 => array(
				'type' => '2', // Suit
				'type_arg' => '10' // Value
				),
			11 => array(
				'type' => '2', // Suit
				'type_arg' => '11' // Value
				),
			12 => array(
				'type' => '2', // Suit
				'type_arg' => '12' // Value
				),
			13 => array(
				'type' => '2', // Suit
				'type_arg' => '13' // Value
				),
			14 => array(
				'type' => '4', // Suit
				'type_arg' => '11' // Value
				)
			);
		$testPlayerHandArray[3] = array(
			0 => array(
				'type' => '4', // Suit
				'type_arg' => '3' // Value
				),
			1 => array(
				'type' => '2', // Suit
				'type_arg' => '1' // Value
				),
			2 => array(
				'type' => '2', // Suit
				'type_arg' => '2' // Value
				),
			3 => array(
				'type' => '2', // Suit
				'type_arg' => '3' // Value
				),
			4 => array(
				'type' => '2', // Suit
				'type_arg' => '4' // Value
				),
			5 => array(
				'type' => '2', // Suit
				'type_arg' => '9' // Value
				),
			6 => array(
				'type' => '2', // Suit
				'type_arg' => '6' // Value
				),
			7 => array(
				'type' => '2', // Suit
				'type_arg' => '7' // Value
				),
			8 => array(
				'type' => '2', // Suit
				'type_arg' => '8' // Value
				),
			9 => array(
				'type' => '2', // Suit
				'type_arg' => '9' // Value
				),
			10 => array(
				'type' => '2', // Suit
				'type_arg' => '10' // Value
				),
			11 => array(
				'type' => '2', // Suit
				'type_arg' => '11' // Value
				),
			12 => array(
				'type' => '2', // Suit
				'type_arg' => '12' // Value
				),
			13 => array(
				'type' => '2', // Suit
				'type_arg' => '13' // Value
				),
			14 => array(
				'type' => '4', // Suit
				'type_arg' => '10' // Value
				)
			);
*/

		$cardsInDeck = $this->cards->getCardsInLocation( 'deck' );
//		$debug_cards = $this->cards->getCardsInLocation("hand");
		self::dump("[bmc] Cards In Deck:", $cardsInDeck );
		
		$playerListTemp = $players;
		// Find the cards and put them in each players' hand:
		foreach ( $testPlayerHandArray as $handsToAdd ) {
			foreach ( $handsToAdd as $cardToAdd ) {
				$cardsInDeck = $this->cards->getCardsInLocation( 'deck' );
				self::dump("[bmc] cardToAdd:", $cardToAdd );
				$presetHandCard = self::searchForCard( $cardsInDeck, $cardToAdd );
				self::dump("[bmc] presetHandCard:", $presetHandCard );
				if (isset( $presetHandCard[ "id" ] )) {
					self::dump("[bmc] presetHandCard[id]:", $presetHandCard[ "id" ] );
				}
				//self::dump("[bmc] current( $playerListTemp )['id']:", current( $playerListTemp ) );
			
				if (isset( $presetHandCard[ "id" ] )) {
					if ( !$debug ) {
						$this->cards->moveCard( $presetHandCard[ "id" ], 'hand',  current( $playerListTemp )['player_id']);
					}
				}
			}
			//self::dump("[bmc] playerListTemp:", current( $playerListTemp ));
			self::setPlayerGoneDown( current( $playerListTemp )[ "player_id" ], 0 ); /* 0 (not gone down) or 1 (gone down) */

			next( $playerListTemp );
		}
		// Put the jokers on the top of the deck
		$cardsForDeck[0] = array(
			0 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			1 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				),
			2 => array(
				'type' => '5', // Suit
				'type_arg' => '1' // Value
				),
			3 => array(
				'type' => '5', // Suit
				'type_arg' => '2' // Value
				)
			);

		$jokerLoc = 200; // Higher numbers are closer to the top of the deck
		
		foreach ( $cardsForDeck as $cardToAdd ) {
			$cardsInDeck = $this->cards->getCardsInLocation( 'deck' );
			$presetHandCard = self::searchForCard( $cardsInDeck, $cardToAdd );
			if (isset( $presetHandCard[ "id" ] )) {
//				$this->cards->moveCard( $presetHandCard[ 'id' ], 'deck',  $location_arg = $jokerLoc );
				//$this->cards->moveCard( $presetHandCard[ 'id' ], 'jokerPile' );
				$this->cards->insertCardOnExtremePosition( $presetHandCard[ 'id' ], 'jokerPile', true );

				};
			$jokerLoc = $jokerLoc - 1;
		};
		//$allCardsDebug = $this->cards->getCardsInLocation( 'deck' );
		//self::dump("[bmc] allCardsInDeck:", $allCardsDebug );
		//$allCardsDebug = $this->cards->getCardsInLocation( 'jokerPile' );
		//self::dump("[bmc] allCardsInJokerPile:", $allCardsDebug );
		self::trace("'<span style='color:green'><b>[bmc] EXIT presetHands</b></span>'");
		//self::trace("[bmc] EXIT presetHands");
	}
////////
////////
////////
	function checkEmptyDeck() { // Just make this a function to shuffle the deck if needed
//		self::trace("[bmc] ENTER stCheckEmptyDeck");
		self::trace("[bmc] ENTER checkEmptyDeck");
		
		$activePlayerId = $this->getActivePlayerId();
		self::dump("[bmc] activePlayerId:", $activePlayerId );
		
		$countCardsInDeck = count( $this->cards->countCardsByLocationArgs( 'deck' ));

//		$countCardsInDeck = $this->cards->countCardInLocation( 'deck' );
		self::dump("[bmc] Card in deck:", $countCardsInDeck );
		
		if ( $countCardsInDeck == 0 ) {
			$discards = $this->cards->getCardsInLocation('discardPile');
			
			self::dump("[bmc] Shuffling. Discards: ", $discards);
			//self::dump("[bmc] card on top:", $this->cards->getCardOnTop ( 'deck' )[ 'id' ]); // TODO Aug03: Throws undefined offset, so commenting it out
			
			$card_ids = array_keys($discards);

			self::dump("[bmc] card_ids: ", $card_ids);
			
			$this->cards->moveCards($card_ids, 'deck');
	
			$this->cards->shuffle('deck');

			$shuffleCount = self::incGameStateValue( 'shuffleCount', 1 ); // Keep track of shuffles

			// Trigger the auto-shuffle by trying to draw a card:
			// Put 1 card from the deck into the discard pile and give it a starting weight of 100
			
			self::notifyAllPlayers( "deckShuffled",
				clienttranslate( 'Discard pile shuffled into deck' ),
				array(
					'deck' => array_keys( $this->cards->getCardsInLocation('deck'))
				)
			);
		}
		
		$drawDeckSize = count( $this->cards->countCardsByLocationArgs( 'deck' ));
		
		self::trace("[bmc] EXIT (true) stCheckEmptyDeck");
	}
////
////
////
}
