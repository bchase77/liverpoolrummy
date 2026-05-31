<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * LiverpoolRummy implementation : © Bryan Chase <bryanchase@yahoo.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * states.inc.php
 *
 * LiverpoolRummy game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

 
$machinestates = array(

    // Create new deck and deal
    10 => array(
        "name" => "deckSetup",
        "description" => clienttranslate("Deck Setup[ST10]"),
        "type" => "game",
        "action" => "stDeckSetup", // ACTION: Do this upon entering the state
        "transitions" => array( "" => 20 )
    ),

    /// New hand
    20 => array(
        "name" => "newHand",
        "description" => clienttranslate('New Hand <span style:"color:gray"></span>'),
        "type" => "game", // game
        "action" => "stNewHand", // ACTION: Do this upon entering the state
        "updateGameProgression" => true,   
        "transitions" => array( "" => 30 ) 
    ),    
    30 => array(
        "name" => "playerTurnDraw",
		"description" => clienttranslate('${turnPlayerName} ${message}'),
		"descriptionmyturn" => clienttranslate('${you} ${message}.'),
        "type" => "activeplayer",
        "action" => "stShowBUYButtons", // ACTION: Do this upon entering the state
		"args" => "argPlayerTurnDraw", // Set the handtarget and who can play
        "possibleactions" => array( "actDrawCard", "actBuyRequest", "actNotBuyRequest", "zombiePass", "actLiverpoolButton", "liverpoolBonus", "liverpoolPenalty" ),
//        "possibleactions" => array( "drawCard", "buyRequest", "notBuyRequest", "zombiePass", "liverpoolBonus", "liverpoolPenalty" ),
        // "possibleactions" => array( "drawCard", "buyRequest", "notBuyRequest", "zombiePass", "liverpool" ),
        "transitions" => array( "drawCard" => 35, "zombiePass" => 37, "emptyDeck" => 37, "liverpoolBonus" => 50, "liverpoolPenalty" => 60 )
        // "transitions" => array( "drawCard" => 35, "zombiePass" => 37 )
    ),
    35 => array(
        "name" => "playerTurnPlay",
		"description" => clienttranslate('${turnPlayerName} must ${thingsCanDo}'),
		"descriptionmyturn" => clienttranslate('${you} must ${thingsCanDo}'),
        "type" => "activeplayer", //multipleactiveplayer
		"action" => "stPlayerTurnPlay", // ACTION: Do this upon entering the state
		"args" => "argPlayerTurnPlay",
        "possibleactions" => array( "actPlayerGoDown", "actDiscardCard", 'actPlayCard', 'actPlayCardMultiple', "zombiePass", "actBuyRequest", "actNotBuyRequest", "actLiverpoolButton", "liverpoolBonus", "liverpoolPenalty" ),
//        "possibleactions" => array( "playerGoDown", "discardCard", 'playCard', 'playCardMultiple', "zombiePass", "buyRequest", "notBuyRequest", "liverpoolBonus", "liverpoolPenalty" ),
        "transitions" => array( "playerGoDown" => 35, "discardCard" => 36, "playCard" => 35, "playCardMultiple" => 35,
			"zombiePass" => 37, "liverpoolBonus" => 50, "liverpoolPenalty" => 60 )
        // "transitions" => array( "discardCard" => 36, "playCard" => 35, "playCardMultiple" => 35, "buyRequest" => 60, "notBuyRequest" => 61, "zombiePass" => 37 )
    ), 
	36 => array(
		"name" => "afterDiscard",
		"description" => "[ST36]",
        "type" => "game",
        "action" => "stWaitForAll", // ACTION: Do this upon entering the state
        "possibleactions" => array( "zombiePass" ),
		"transitions" => array( "fullyResolved" => 37, "LPReturn" => 53, "LPReturnPenalty" => 63  )
    ), 
    37 => array(
        "name" => "nextPlayer",
        "description" => "[ST37]",
        "type" => "game",
        "action" => "stNextPlayer", // ACTION: Do this upon entering the state
        "transitions" => array( "nextPlayer" => 30, "endHand" => 40 )
    ), 
    // End of the hand. Let players look at their hand and the board
    40 => array(
        "name" => "wentOut",
        "description" => clienttranslate('The hand is over!'),
		"descriptionmyturn" => clienttranslate('The hand is over!'),
        "type" => "multipleactiveplayer",
        "action" => "stWentOut", // ACTION: Do this upon entering the state
		"args" => "argWentOut",
		// TODO: Need to disallows clicking LIVERPOOL if the game has ended.
//		"possibleactions" => array( "playerHasReviewedHand", 'endGame' ),
		"possibleactions" => array( "actPlayerHasReviewedHand", 'endGame' ),
        "transitions" => array( "playerHasReviewedHand" => 45, 'endGame' => 99 )
    ),
    45 => array(
        "name" => "endHand",
        "description" => "(st45)",
        "type" => "game",
        "action" => "stEndHand", // ACTION: Do this upon entering the state
        "transitions" => array( "newHand" => 20, "endGame" => 99 )
    ),

	// A separate state much be used for Liverpool processing because the active player cannot be changed
	// when the 'type' is 'activeplayer'.
    50 => array(
        "name" => "liverpoolBonus",
		"description" => clienttranslate('${playerFindingLP} declared Liverpool! [ST50]'),
		"descriptionmyturn" => clienttranslate('${you} declared Liverpool! [ST50]'),
        "type" => "game",
		"action" => "stLiverpoolBonus", // ACTION: Do this upon entering the state
		"args" => "argLiverpoolBonus", // Likely same as argLiverpoolPenalty
        //"possibleactions" => array( "drawCard" ),
        "transitions"     => array( 51 ) // Draw the discard in the liverpool function; Put player in playcard state
    ),
    51 => array(
        "name" => "liverpoolDraw",
		"description" => clienttranslate('${playerFindingLP} draws the discard and can play it [ST51]'),
		"descriptionmyturn" => clienttranslate('${you} get the discard and can play it[ST51]'),
        "type" => "activeplayer",
		"action" => "stLiverpoolDraw", // ACTION: Do this upon entering the state
		"args" => "argLiverpoolDraw",
		// The transition is from state drawNotify to playCard
//        "possibleactions" => array( "drawCard" ), // Only action is to draw the discard (automatic)
        "possibleactions" => array( "actDrawCard" ), // Only action is to draw the discard (automatic)
        "transitions"     => array( "drawCard" => 35 ) // Then go to playcard
    ), 
    53 => array(
        "name" => "liverpoolReturn",
		"description" => clienttranslate('[ST53]'),
		"descriptionmyturn" => clienttranslate('[ST53]'),
        "type" => "game",
		"action" => "stLiverpoolReturn", // ACTION: Do this upon entering the state
		//"args" => "argLiverpoolReturn",
//        "possibleactions" => array( "drawCard" ),
//        "transitions"     => array( 30 ) // Interrupted player gets to draw
        "transitions"     => array( 37 ) // Check end conditions, otherwise interrupted player gets to draw
    ),
    60 => array( // Equivalent to 50
        "name" => "liverpoolPenalty",
		"description" => clienttranslate('${playerFindingLP} declared Liverpool! [ST60]'),
		"descriptionmyturn" => clienttranslate('${you} declared Liverpool! [ST60]'),
        "type" => "game",
		"action" => "stLiverpoolPenalty", // ACTION: Do this upon entering the state
		"args"  => "argLiverpoolPenalty", // Likely same as argLiverpoolBonus
        //"possibleactions" => array( "drawCard" ),
        "transitions"     => array( "penalizeDiscarder" => 61, "penalizeCaller" => 62 )
    ),
    61 => array(
        "name" => "liverpoolDrawPenaltyDiscarder",
		"description" => clienttranslate('${playerDiscarding} got their discard back and drew a penalty card [ST61]'),
		"descriptionmyturn" => clienttranslate('${you} got your discard back and drew a penalty card [ST61]'),
        "type" => "game",
		"action" => "stLiverpoolDrawPenaltyDiscarder", // ACTION: Do this upon entering the state
		"args"  => "argLiverpoolDrawPenaltyDiscarder",
        // "possibleactions" => array( "actDrawCard" ), // Only action is to draw the discard (automatic)
        "transitions"     => array( 63 ) // Then go to drawCard for regular player
    ), 
    62 => array(
        "name" => "liverpoolDrawPenaltyCaller",
		"description" => clienttranslate('${playerFindingLP} drew a penalty card [ST62]'),
		"descriptionmyturn" => clienttranslate('${you} drew a penalty card [ST62]'),
        "type" => "game",
		"action" => "stLiverpoolDrawPenaltyCaller", // ACTION: Do this upon entering the state
		"args"  => "argLiverpoolDrawPenaltyCaller",
        // "possibleactions" => array( "actDrawCard" ), // Only action is to draw the discard (automatic)
        "transitions"     => array( 63 ) // Then go to drawCard for regular player
    ), 
    63 => array(
        "name" => "liverpoolReturnPenalty",
		"description" => clienttranslate('[ST63]'),
		"descriptionmyturn" => clienttranslate('[ST63]'),
        "type" => "game",
		"action" => "stLiverpoolReturnPenalty", // ACTION: Do this upon entering the state
		//"args" => "argLiverpoolReturn",
//        "possibleactions" => array( "drawCard" ),
//        "transitions"     => array( 30 ) // Interrupted player gets to draw
        "transitions"     => array( 37 ) // Go back to the regular next player
    ),




	// Someone is trying to buy a card
    // 60 => array(
        // "name" => "buyTryFromPTP",
        // "description" => clienttranslate("Someone is trying to buy the discard during PlayerTurnPlay."),
        // "descriptionmyturn" => clienttranslate('${you} are trying to buy the discard during PlayerTurnPlay.'),
        // "type" => "activeplayer",
        // "action" => "stBuyTry", // ACTION: Do this upon entering the state
        // "transitions" => array( "" => 35 )
    // ),     
    // 61 => array(
        // "name" => "notBuyTryFromPTP",
        // "description" => clienttranslate("Someone is trying to NOT buy the discard during PlayerTurnPlay."),
        // "descriptionmyturn" => clienttranslate('${you} are trying to NOT buy the discard during PlayerTurnPlay.'),
        // "type" => "activeplayer",
        // "action" => "stNotBuyTry", // ACTION: Do this upon entering the state
        // "transitions" => array( "" => 35 )
    // ),     
    // 65 => array(
        // "name" => "buyTryFromPTD",
        // "description" => clienttranslate("Someone is trying to buy the discard during PlayerTurnDraw."),
        // "descriptionmyturn" => clienttranslate('${you} are trying to buy the discard during PlayerTurnDraw.'),
        // "type" => "activeplayer",
        // "action" => "stBuyTry", // ACTION: Do this upon entering the state
        // "transitions" => array( "" => 30 )
    // ),     
    // 66 => array(
        // "name" => "notBuyTryFromPTD",
        // "description" => clienttranslate("Someone is trying to NOT buy the discard during PlayerTurnDraw."),
        // "descriptionmyturn" => clienttranslate('${you} are trying to NOT buy the discard during PlayerTurnDraw.'),
        // "type" => "activeplayer",
        // "action" => "stNotBuyTry", // ACTION: Do this upon entering the state
        // "transitions" => array( "" => 30 )
    // ),     

/*
    Examples:
    2 => array(
        "name" => "nextPlayer",
        "description" => '',
        "type" => "game",
        "action" => "stNextPlayer",
        "updateGameProgression" => true,   
        "transitions" => array( "endGame" => 99, "nextPlayer" => 10 )
    ),
    10 => array(
        "name" => "playerTurn",
        "description" => clienttranslate('${actplayer} must play a card or pass'),
        "descriptionmyturn" => clienttranslate('${you} must play a card or pass'),
        "type" => "activeplayer",
        "possibleactions" => array( "playCard", "pass" ),
        "transitions" => array( "playCard" => 2, "pass" => 2 )
    ), 
*/    
);
