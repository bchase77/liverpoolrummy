<?php

trait Scoring {
    function stWentOut() {
		self::trace("[bmc] ENTER stWentOut");

// todo MAYBE NOT INCLUDE THIS
// Update all the clients after the final discard
		$cardsByLocationHand  = $this->cards->countCardsByLocationArgs( 'hand' );

		$currentHandType = self::getGameStateValue( 'currentHandType' );
		$handTarget = $this->handTypes[ $currentHandType ][ "Target" ];
		self::dump("[bmc] handTarget stEndHand:", $handTarget );
		
		// Notify players to go to the next target hand
		
		$newScores = self::getCollectionFromDb("SELECT player_id, player_score FROM player", true );

		self::notifyAllPlayers( "newScores",
			'',
			array(
				'newScores' => $newScores,
				'handTarget' => $handTarget,
				'allHands' => $cardsByLocationHand,
				'currentHandType' => $currentHandType
			)
		);

		// Enter into log
		// Notify players to review their hands and click to continue
		$currentPlayerId = $this->getCurrentPlayerId();

		$players = self::loadPlayersBasicInfos();
		$player_name = isset( $players[ $currentPlayerId ] ) ? $players[ $currentPlayerId ][ 'player_name' ] : '';

		self::dump( "[bmc] currentPlayerId:", $currentPlayerId );
		self::dump( "[bmc] player_name:", $player_name );

        self::notifyAllPlayers( 'wentOut',
			clienttranslate( '${player_name} went out' ),
			array(
				'player_id'   => $currentPlayerId,
				'player_name' => $player_name
			)
		);

		// Check end of game condition here. Message and route the players accordingly.

        // Next hand target
		$gameLengthOption = self::getGameStateValue( 'gameLengthOption' );
		self::dump( "[bmc] gameLengthOption:", $gameLengthOption );

		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		self::dump( "[bmc] currentHandType:", $currentHandType );


		// Don't increment if it's the end of the game
		self::incGameStateValue( 'currentHandType', 1 );
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		self::dump( "[bmc] currentHandType:", $currentHandType );
		
		$countHandTypes = count( $this->handTypes );

		self::dump( "[bmc] countHandTypes:", $countHandTypes );

		if ( $currentHandType >= $countHandTypes ) {
			self::debug("[bmc] Game Over!");
			$scoreMessage = "Game Over!";
			$this->calcDisplayScoreDialog( $scoreMessage );
			
			// TODO Nov 5 2024: Perhaps change the next line to go to endHand and not endGame:
			// But still need to correct who went out... But this might fix the bad display
			
			// Go back 1 to make the array reference correct, because it's the end of the game
			self::incGameStateValue( 'currentHandType', -1 ); 
			
			$this->gamestate->setAllPlayersNonMultiactive( 'endGame' );
			//$this->game->playerHasReviewedHand();
			// $this->gamestate->setAllPlayersNonMultiactive( 'endGame' );
		} else {
			self::debug("[bmc] On To The Next!");
			$scoreMessage = "On to the next!";
			$this->calcDisplayScoreDialog( $scoreMessage );
			$this->gamestate->setAllPlayersMultiactive();
		}
		self::debug("[bmc] EXIT stWentOut");
	}
////
////
////
	function calcDisplayScoreDialog( $scoreMessage ) {
		self::trace("[bmc] ENTER calcDisplayScoreDialog");
		
        // Count and score points, then end the game or go to the next hand.
        $players = self::loadPlayersBasicInfos();
        // Cards 2 - 9 are 5 points each
		// Cards 10, J, Q, K are 10 points each
		// Cards A are 15 points each
		// Cards Joker is 20 points each

		$player_to_points = array ();
		foreach ( $players as $player_id => $player) {
            $player_to_points[ $player_id ] = 0;
		}
		$cards = $this->cards->getCardsInLocation("hand");
		
		foreach ( $cards as $card ) {
			$player_id = $card[ 'location_arg' ];
			// self::dump("[bmc] Scoring: ", $card );
			if ( $card[ 'type' ] >= 1 and $card[ 'type' ] <= 4) { // If non-Joker
				switch ( true ) {
					case ( $card[ 'type_arg' ] >= 2 and $card[ 'type_arg' ] <= 9 ): // 5 points
						// self::trace("[bmc] 2-9");
						$player_to_points[ $player_id ] += 5;
						break;
					case ( $card[ 'type_arg' ] >= 10 and $card[ 'type_arg' ] <= 13 ): // 10 points
						// self::trace("[bmc] 10,J,Q,K");
						$player_to_points[ $player_id ] += 10;
						break;
					case ( $card[ 'type_arg' ] == 1 ): // 15 points	
						// self::trace("[bmc] Ace");
						$player_to_points[ $player_id ] += 15;
						break;
				}
			} else { // It must be a joker, 20 points
				// self::trace("[bmc] Joker");
				$player_to_points [$player_id] += 20;
			}
		}

        // Apply scores to players
        foreach ( $player_to_points as $player_id => $points ) {
            if ( $points != 0 ) {
                $sql = "UPDATE player SET player_score=player_score-$points  WHERE player_id='$player_id'";
                self::DbQuery( $sql );
                $point_number = $player_to_points[ $player_id ];

				$player_name = $players[ $player_id ][ 'player_name' ];

                self::notifyAllPlayers( "points",
    				clienttranslate( '${player_name} got ${nbr} points' ),
					array (
                        'player_id' => $player_id,
						'player_name' => $player_name,
                        'nbr' => $point_number
						)
				);
            } else {
		        // No points lost (just notify)
				$player_name = $players[ $player_id ][ 'player_name' ];
				
                self::notifyAllPlayers( "points",
					clienttranslate( '${player_name} got zero points'),
					array (
                        'player_id' => $player_id,
						'player_name' => $player_name
					)
				);
            }
        }
		
		// Get the score totals
		$pn = array();
		$sql = "SELECT player_id, player_score FROM player ";
		$pn = self::getCollectionFromDB($sql, true);

		self::dump( "[bmc] pn: ", $pn );

		// Broadcast updated scores immediately so all clients' score panels reflect
		// the penalty deductions before anyone clicks through the review dialog.
		$currentHandType = self::getGameStateValue( 'currentHandType' );
		self::notifyAllPlayers( "newScores", '',
			array(
				'newScores'       => $pn,
				'currentHandType' => $currentHandType
			)
		);

		// Show the scoring dialog box
		
		$firstRow  = array( '' );
		$secondRow = array( clienttranslate( 'This Hand' ));
		$thirdRow  = array( clienttranslate( 'Total' ));

        foreach( $players as $player_id => $player ) {
            $firstRow[] = array( 'str' => '${player_name}',
                                 'args' => array( 'player_name' => $player[ 'player_name' ] ),
                                 'type' => 'header'
                               );
			$secondRow[] = - $player_to_points[ $player_id ];
			$thirdRow[] = $pn[ $player_id ];
        }
        $table = array( 
			$firstRow,
			$secondRow,
			$thirdRow
		);
		// self::dump( "[bmc] table: ", $table );
		$player_id = $this->getCurrentPlayerId();

		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );

		// Show the right message when the hand ends
		// $outReason = 'SomeoneWentOut'; // 0
		// $outReason = 'DeckOverShuffled'; // 1
		// $outReason = 'AllCardsPlayed'; // 2
		$outReason = self::getGameStateValue( 'outReason' );
			
		if( $outReason == 1 ) {
			$outMsg1 = clienttranslate( "Deck has been shuffled 5 times. Ending the hand." );
			$outMsg2 = clienttranslate( $outMsg1 );
		} else if ($outReason == 2 ) {
			$outMsg1 = clienttranslate( "All playable cards have been played. Ending the hand." );
			$outMsg2 = clienttranslate( $outMsg1 );
		} else { // Someone went out normally
			$outMsg1 = clienttranslate( "Woot! You went out! You want the most positive score." );
			// $outMsg2_player = $players[ $activeTurnPlayer_id ][ 'player_name' ];
			$outMsg2_player = $players[ $player_id ][ 'player_name' ];
			$outMsg2_msg    = clienttranslate( " went out. You want the most positive score." );
			
			$outMsg2 = $outMsg2_player . $outMsg2_msg;
			
//082023
			// $outMsg2_raw  = self::_( "Bummer! " );
			// $outMsg2a_raw = self::_( " went out. You want the most positive score." );

			// $outMsg2 = $outMsg2_raw . $outMsg2_player . $outMsg2a_raw;

//			. $outMsg2_player . " went out! You want the most positive score:";
//			$outMsg2 = self::_( $outMsg2_raw );
		}

		$titleMessage = clienttranslate( $outMsg1 );


//		$playerOut = $players[ $activeTurnPlayer_id ][ 'player_name' ];
		$playerOut = $players[ $player_id ][ 'player_name' ];
		// $otherMessage = $outMsg2;
		
		$currentPid = $this->getCurrentPlayerId();
		
		// Show a dialog of the scores for each player for this hand
        foreach ( $player_to_points as $player_id => $points ) {
			// if ( $player_id == $activeTurnPlayer_id ) {
			if ( $player_id == $currentPid ) {
				$this->notifyPlayer(
					$player_id,
					"tableWindow", '', array(
						"id" => 'handScoring',
						"title" => $outMsg1,
						"table" => $table,
						"closing" => clienttranslate( $scoreMessage )
					)
				); 
			} else {
				$this->notifyPlayer(
					$player_id,
					"tableWindow", '', array(
						"id" => 'handScoring',
						"title" => $outMsg2,
						"table" => $table,
						"closing" => clienttranslate( $scoreMessage )
					)
				); 
			}
		}
		self::trace("[bmc] EXIT calcDisplayScoreDialog");
	}
////
////
////
//	function playerHasReviewedHand() {
	public function actPlayerHasReviewedHand() {
		self::trace("[bmc] playerHasReviewedHand");
		// May not need to pass the player_id to the function
		$this->checkAction('actPlayerHasReviewedHand');

		$player_id = $this->getCurrentPlayerId(); // CURRENT!!! not active
		 
        self::notifyAllPlayers( 'wentOut',
			'',
			array(
				'ackPlayer' => $player_id
			)
		); 
		// Deactivate player; if none left, transition to next '' state
		// IF THIS LINE IS NOT THERE THE GAME WON'T GO TO THE NEXT HAND
		$this->gamestate->setPlayerNonMultiactive( $player_id, 'playerHasReviewedHand' );
	}
////
////
////
	function stNewHand() {
		self::debug("[bmc] ENTER stNewHand");
		
        // Take back all cards (from any location => null) to deck
        $this->cards->moveAllCardsInLocation( null, "deck" );

		$cardsInDeck = $this->cards->getCardsInLocation( 'deck' );
		
        // Shuffle deck
        $this->cards->shuffle( 'deck' );
		
		self::setGameStateValue( 'shuffleCount', 0 ); // Reset the shuffle count every hand

		self::setGameStateValue( 'liverpoolFoundYN', 0 ); // Reset the liverpool status
		self::setGameStateValue( 'liverpoolExists', 0 ); // Reset the liverpool status

        // Deal some cards to each players
        $players = self::loadPlayersBasicInfos();
		
		// Deal 10 or 11 or 12 cards to each player
		// Put 1 card in the discard pile
		// Put the rest into the draw deck
		// Notify players of the situation
		self::dump( "[bmc] players:", $players );
		
		
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		self::dump( "[bmc] currentHandType:", $currentHandType );
		self::dump( "[bmc] this->handTypes[]:", $this->handTypes );
		self::dump( "[bmc] count( this->handTypes):", count( $this->handTypes ));

		if ( $currentHandType == 0 ) {
			$this->notifyGameOptions();
		}

		//Notify all players of their cards plus the deck and the discard pile
		$handTarget = $this->handTypes[$currentHandType]["Target"]; // Pull the description
		
		$alwaysDeal11 = self::getGameStateValue( 'alwaysDeal11' );
		
		$handNumber = $currentHandType + 1;
		self::dump( "[bmc] handNumber:", $handNumber );

		if ( $alwaysDeal11 == 1 ) {
			$qtyToDeal = 11;
		} else {
			$qtyToDeal = $this->handTypes[ $currentHandType ][ "deal" ];

			if (( self::getPlayersNumber() == 2 ) && ( count( $this->handTypes ) == $handNumber )){
				$qtyToDeal++; // Deal 1 more card for 3 runs if only 2 players
			}
		}
		
		self::dump( "[bmc] qtyToDeal:", $qtyToDeal );

		// If testing, use cards specifically for testing purposes
		$presetSetupHands = false;
		// $presetSetupHands = true;
		
		if ( $presetSetupHands ) { //
			self::presetHands( $players, false ); // debug true or false
		} else {
			// Pick cards from the shuffled deck

			foreach ( $players as $player_id => $player ) {
				$this->cards->pickCards( $qtyToDeal, 'deck', $player_id );
				self::setPlayerGoneDown( $player_id, 0 ); /* 0 (not gone down) or 1 (gone down) */
				
				if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) { // 0 == No. 1 == Yes.
					$this->disableWishList( $player_id );
				}
				// Clear out the prep areas in the database
				
				$sql = "DELETE FROM prepAreas WHERE player_id = '";
				$sql_command = $player_id . "'";
				self::DbQuery( $sql . $sql_command );
			}
		}
		
		// Disable everyone's wish list between hands
		foreach ( $players as $player_id => $player ) {
			if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) { // 0 == No. 1 == Yes.
				$this->disableWishList( $player_id );
			}
		}

		// Put 1 card from the deck into the discard pile and give it a starting weight of 100
		$this->cards->moveCard( $this->cards->getCardOnTop ( 'deck' )[ 'id' ], 'discardPile', 100); 
		
		// The rest of the cards are in 'deck'

		// self::dump("[bmc] currentHandType handTarget stNewHand:", $handTarget);
		
		$cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );

		$discardSize = count( $this->cards->countCardsByLocationArgs( 'discardPile' ));

		$drawDeckSize = count( $this->cards->countCardsByLocationArgs( 'deck' ));

		self::setGameStateValue( 'discardSize', $discardSize );

		self::trace( "[bmc] stNewHand clearing buyers.");
		// Clear the buyers
		$this->clearBuyers();
		
		// Clear out the BUY counters for all players
		self::clearPlayersBuyCount();

		$buyCount = self::getPlayersBuyCount();
		// self::dump("[bmc] buyCount 4313:", $buyCount);

		// Determine who is the next dealer: It's the next in the associative array
		$playerOrder = self::getNextPlayerTable();

		$dealer = $this->getGameStateValue( 'dealer' );
		self::dump('[bmc] newhand dealer:',  $dealer );

		// Change the dealer
		if ( $dealer == 0 ) { // If it ever got set to zero, choose the first real number
			self::setGameStateValue( 'dealer', $playerOrder[ $playerOrder[ $dealer ]]);
		} else {
			self::setGameStateValue( 'dealer', $playerOrder[ $dealer ]);
		}
		
		$dealer_name = '<span style="color:#' . $players[ $dealer ]["player_color"] . ';">' . $players[ $dealer ]["player_name"] . '</span>';

		$this->gamestate->changeActivePlayer( $playerOrder[ $dealer ] );
		
		self::setGameStateValue( 'activeTurnPlayer_id', $playerOrder[ $dealer ] );

		$dpCard = $this->cards->getCardsInLocation( 'discardPile' );
		// self::dump("[bmc] dpCard:", reset( $dpCard )[ 'id' ]);

		$currentCard = $this->cards->getCard( reset( $dpCard )[ 'id' ] );

		// self::dump("[bmc] currentCardInDP:", $currentCard);

		if ( $currentCard[ 'type' ] == 5 ) {
			$value_displayed = 'Joker';
			$color_displayed = '';
			$connector = '';
		} else {
			$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
			$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
			$connector = ' of ';
		}

		// Update the hand count number when there is a new hand
		
		$updCurrentHandType = self::getGameStateValue( 'currentHandType' );
		$updTotalHandCount = count( $this->handTypes );
		
		self::notifyAllPlayers( 'newHand', // Including spectators
			clienttranslate('New Hand! ${dealer} dealt the cards. New target is ${handTarget}. In Discard Pile: ${value_displayed} ${connector} ${color_displayed}'),
			array(
				'i18n' => array( 'handTarget', 'color_displayed', 'value_displayed', 'connector' ), 

				'deck' => array_keys($this->cards->getCardsInLocation( 'deck' )),
				'discardPile' => $this->cards->getCardsInLocation( 'discardPile' ),
				'discardSize' => $discardSize,
				'handTarget' => $handTarget,
				'allHands' => $cardsByLocation,
				'buyCount' => $buyCount,
				'dealer' => $dealer_name,
				'drawDeckSize' => $drawDeckSize,
				'updCurrentHandType' => $updCurrentHandType,
				'updTotalHandCount' => $updTotalHandCount,
				'setsNeeded' => $this->handTypes[ $currentHandType ][ "QtySets" ],
				'runsNeeded' => $this->handTypes[ $currentHandType ][ "QtyRuns" ],
				'value_displayed' => $value_displayed,
				'color_displayed' => $color_displayed,
				'connector' => $connector
			)
		);
		
//TODO: Here either add another notification to ALL players with a non-empty hand (so the JS triggers). Or/and change the JS function notif_newhand that all players have checked in and dealt cards.

		foreach ( $players as $player_id => $player ) {
			self::notifyPlayer(
				$player_id,
				'newHand',
				'',
				array(
					'hand' => $this->cards->getPlayerHand( $player_id ),
					'deck' => array_keys($this->cards->getCardsInLocation( 'deck' )),
					'discardPile' => $this->cards->getCardsInLocation( 'discardPile' ),
					'handTarget' => $handTarget,
					'allHands' => $cardsByLocation,
					'buyCount' => $buyCount,
					'dealer' => $dealer_name,
					'dealer_id' => $dealer,
					'updCurrentHandType' => $updCurrentHandType,
					'updTotalHandCount' => $updTotalHandCount,
					'discardSize' => $discardSize,
					'drawDeckSize' => $drawDeckSize
				)
			);
		}

		// Go to the next game state (draw) with all players active
		
		self::setGameStateValue( "previous_player_id", 0 ); // After the deal everyone else can buy.

		self::debug("[bmc] (almost) EXIT stNewHand");
		
	    $this->gamestate->nextState("");	
    }
////
////
////
// function stCheckEmptyDeck() {
    function stEndHand() {
		// self::trace("[bmc] ENTER stEndHand");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stEndHand</b></span>'");
		
		// Notify players and wait for them to confirm to move to the next hand		
		
        ///// Test if this is the end of the game
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		
		self::setGameLength(); // This sets this->handTypes, not sure why it gets removed.

		self::dump("[bmc] 6610 currentHandType stEndHand:", $currentHandType );
		self::dump("[bmc] 6611 this->handTypes stEndHand:", $this->handTypes );
		
//		if ( $currentHandType > 6 ) { // The 7 hand numbers are 0 through 6

		$countHandTypes = count( $this->handTypes );
		self::dump("[bmc] 6616 countHandTypes stEndHand:", $countHandTypes );
		
		if ( $currentHandType >= $countHandTypes ) {
			self::trace( "[bmc] 6619" );
			$this->gamestate->nextState("endGame");
		} else {
			self::trace( "[bmc] 6622" );

			$gameLengthOption = self::getGameStateValue( 'gameLengthOption' );
			self::dump( "[bmc] gameLengthOption:", $gameLengthOption );
/*			
			if ( $gameLengthOption == 11 ) {
				self::trace( "[bmc] 6628" );

				$this->handTypes = $this->handTypesFull;
			} else {
				self::trace( "[bmc] 6632" );

				$this->handTypes = $this->handTypesShort;
			}
*/
			self::dump("[bmc] handTypes stEndHand:", $this->handTypes );
			$currentHandType = self::getGameStateValue( 'currentHandType' );
			$handTarget = $this->handTypes[ $currentHandType ][ "Target" ];
			
			self::dump("[bmc] handTarget stEndHand:", $handTarget );
			
			// Notify players to go to the next target hand
			
			$newScores = self::getCollectionFromDb("SELECT player_id, player_score FROM player", true );

			self::notifyAllPlayers( "newScores",
				'',
				array(
					'newScores' => $newScores,
					'handTarget' => $handTarget,
					'currentHandType' => $currentHandType
				)
			);

			// self::trace("[bmc] EXIT (almost) stEndHand");
			self::trace("'<span style='color:green'><b>[bmc] EXIT stEndHand</b></span>'");
			$this->gamestate->nextState("newHand");
		}
    }

    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */
    
    /*
    
    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...
        
        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];

		// Don't let the buy timers stop play
		// self::setBuyTimerStatus( $active_player, 0 ); // 0 = Not running. 1 = Running.
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
			self::trace( "[bmc] zombiesetNonMultiactive" );
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            self::applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//        if( $from_version <= 2309042301 )
	        if( $from_version <= 2308272254 )
        {
            // ! important ! Use DBPREFIX_<table_name> for all tables

            $sql = "CREATE TABLE DBPREFIX_prepAreas (
				`player_id` int(10) unsigned NOT NULL,
				`areaA` varchar(100),
				`areaB` varchar(100),
				`areaC` varchar(100),
				`areaJ` varchar(100),
				PRIMARY KEY (`player_id`)
			) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;";
			
			self::applyDbUpgradeToAllDB( $sql );
        }
	}
////
////
////
	function notifyGameOptions() {
		$numberOfDecks = self::getGameStateValue( 'numberOfDecks' );

		$jokerOption = self::getGameStateValue( 'numberOfJokers' );
		$jokers = ( $jokerOption == 10 ) ? ( $numberOfDecks * 2 ) . ' (all)' : $jokerOption;

		$lp      = self::getGameStateValue( 'LiverpoolConsequence' ) == 0 ? 'Bonus to caller' : 'Penalty to discarder';
		$buys    = self::getGameStateValue( 'numberOfBuys' )         == 0 ? '3 per hand'      : 'Unlimited';
		$deal11  = self::getGameStateValue( 'alwaysDeal11' )         == 1 ? 'Yes'             : 'No';
		$wishList = self::getGameStateValue( 'enableWishList' )      == 1 ? 'Enabled'         : 'Disabled';
		$jokerSwap = self::getGameStateValue( 'allowJokerSwapping' ) == 1 ? 'Allowed'         : 'Not allowed';

		self::notifyAllPlayers( 'gameOptions',
			clienttranslate( 'Game options — Liverpool: ${liverpool} | Decks: ${decks} | Jokers: ${jokers} | Buys: ${buys} | Always deal 11: ${deal11} | Wish list: ${wishList} | Joker swapping: ${jokerSwap}' ),
			array(
				'liverpool' => $lp,
				'decks'     => $numberOfDecks,
				'jokers'    => $jokers,
				'buys'      => $buys,
				'deal11'    => $deal11,
				'wishList'  => $wishList,
				'jokerSwap' => $jokerSwap,
			)
		);
	}
}
