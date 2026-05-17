<?php

trait StateMachine {
	function argPlayerTurnDraw() {
		
		self::trace("'<span style='color:red'>[bmc] ENTER argPlayerTurnDraw</span>'");

		// Someone might click LIVERPOOL button, causing this state to fire
		// This function might fire at any time; Cannot use getCurrentPlayerId() or it will fail
		//   with Unexpected error: Propagating error from GS 1 (method: createGame): Fatal error during yourgame setup: Not logged
		
		// If the current player is the active player then do all this stuff.
		// If not, then someone clicked LIVERPOOL button. Then process LP according to mode.
		
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		
		if ( $currentHandType != null ) { // argPlayerTurnDraw is called before anything, so ensure a hand is active

			$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true

			if ( $liverpoolFoundYN == 1 ) { // We are here because someone clicked Liverpool
			
				$gtActivePlayerId = $this->getActivePlayerId();
				// self::dump("[bmc] GAME THINKS ACTIVE PLAYER:", $gtActivePlayerId );
				
				$currentPlayerId = $this->getCurrentPlayerId();
				// self::dump("[bmc] GAME THINKS CURRENT PLAYER:", $currentPlayerId );
				
				if ( $gtActivePlayerId != $currentPlayerId ) { // It's not this player's turn, someone click LP or they just reloaded into this state; How to tell someone clicked LP???
				
					self::trace("[bmc] Someone declared LP during draw");
					$LiverpoolConsequence =  self::getGameStateValue( 'LiverpoolConsequence' );
					
					if ( $LiverpoolConsequence == 1 ){ // 0=bonus; 1=penalty
						$this->gamestate->nextState( 'liverpoolPenalty' );
					} else {
						$this->gamestate->nextState( 'liverpoolBonus' );
					}
				}
			} else { // Nobody clicked LP; it is this player's turn so process it normally
				self::trace("[bmc] Normal argPlayerTurndraw");
				
				$playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.
				
				// self::dump("[bmc] playerGoneDown:", $playerGoneDown );

				$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
				
				$players = self::loadPlayersBasicInfos();
				$activePlayer = $players[ $activeTurnPlayer_id ][ 'player_name' ];

				// Check for liverpoolexist
				$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
				$liverpoolExists  = self::getGameStateValue( 'liverpoolExists'); // 0 = false; 1 = true

				// self::dump("[bmc] argPTD: liverpoolExists", $liverpoolExists );
				// self::dump("[bmc] argPTD: liverpoolFoundYN", $liverpoolFoundYN );
				// self::dump("[bmc] activeTurnPlayer_id:", $activeTurnPlayer_id );

				if (( $liverpoolExists == 1 ) && ( $liverpoolFoundYN == 1 )) { // It's present and someone found it

					$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );

					$tpn = '<span style="color:#' . $players[ $playerFindingLP ]["player_color"] . ';">' . $players[ $playerFindingLP ]["player_name"] . '</span>';

					$message = clienttranslate( " has found Liverpool! They can play that card and discard another." );
					$thingsCanDo = clienttranslate( 'play or discard.' );
					
					$this->gamestate->nextState( 'liverpool' );
					
				} else if (( $liverpoolExists == 0 ) && ( $liverpoolFoundYN == 1 )) { // No LP but someone clicked
		// bmc new Nov 2024
					$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );

					$tpn = '<span style="color:#' . $players[ $playerFindingLP ]["player_color"] . ';">' . $players[ $playerFindingLP ]["player_name"] . '</span>';

					$message = clienttranslate( " declared Liverpool but none exists! That's a penalty." );
					$thingsCanDo = clienttranslate( 'draw a penalty card.' );

					$this->gamestate->nextState( 'liverpoolPenaltyCaller' );
					
				} else if (( $liverpoolExists == 1 ) && ( $liverpoolFoundYN == 0 )) { // LP exists but no one found It

					// The notification of missed LP might not belong here. Players still have opportunity to see and catch it.
					
					self::setGameStateValue( 'LPMissed', 1 ); // 0=false; 1=true
					self::trace("[bmc] Setting LPMissed = 1");
					
					// self::notifyAllPlayers( 'liverpoolMissed',
						// 'Everyone missed a Liverpool!', // Put it in the log
						// array (
						// )
					// );

					self::trace("[bmc] LP Exists, need to wait for someone to see it, or not");

					if ( $playerGoneDown[ $activeTurnPlayer_id ] == 1 ) {
						$thingsCanDo = clienttranslate( 'play or discard.' );
					} else {
						$thingsCanDo = clienttranslate( 'play, discard or go down.' );
					}
					$tpn = '<span style="color:#' . $players[ $activeTurnPlayer_id ]["player_color"] . ';">' . $players[ $activeTurnPlayer_id ]["player_name"] . '</span>';
					
					$message = clienttranslate( " must draw from deck or discard pile. Others might buy." );
				
				} else { // No liverpool and no one clicked the button so proceed normally
					self::trace("[bmc] No LP so proceed normally");
				
					if ( $playerGoneDown[ $activeTurnPlayer_id ] == 1 ) {
						$thingsCanDo = clienttranslate( 'play or discard.' );
					} else {
						$thingsCanDo = clienttranslate( 'play, discard or go down.' );
					}
					$tpn = '<span style="color:#' . $players[ $activeTurnPlayer_id ]["player_color"] . ';">' . $players[ $activeTurnPlayer_id ]["player_name"] . '</span>';
					
					$message = clienttranslate( " must draw from deck or discard pile. Others might buy." );

				}
				$buyers = self::getPlayerBuying();

				// self::dump("[bmc] argPlayerTurnDraw buyers (PTD):", $buyers);
					
				self::setGameLength(); // This is here or else $this->handTypes is unknown
				
				// self::dump("[bmc] tpn: ", $tpn );
			
				$currentHandType = $this->getGameStateValue( 'currentHandType' );

//				self::trace("[bmc] EXIT argPlayerTurnDraw");
				self::trace("'<span style='color:green'><b>[bmc] EXIT argPlayerTurnDraw</b></span>'");

				return array(
					'handTarget' => $this->handTypes[ $currentHandType ][ "Target" ], // Pull the description
					'thingsCanDo' => $thingsCanDo,
					'turnPlayerName' => $tpn,
					'message' => $message,
					'buyers' => $buyers,
		//			'where' => 'PTD'
				);
			}
		}
    }
////////
////////
////////
	function argWentOut() {
		self::trace("[bmc] ENTER argWentOut");
		// $activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		$players = self::loadPlayersBasicInfos();
		// $currentPlayerId = $this->getCurrentPlayerId();
		// $currentPlayer = $players[ $currentPlayerId ][ 'player_name' ];
		
		$currentPlayerId = $this->getCurrentPlayerId();
		$currentPlayer = isset( $players[ $currentPlayerId ] ) ? $players[ $currentPlayerId ][ 'player_name' ] : '';
        
		return array(
			'player_name' => $currentPlayer,
			// 'player_id' => $currentPlayerId
		);
		// self::trace("[bmc] EXIT argWentOut");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argWentOut</b></span>'");
	}
////////
////////
////////
	function argPlayerTurnPlay() {
//		self::trace("[bmc] ENTER argPlayerTurnPlay");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argPlayerTurnPlay</b></span>'");

		$currentHandType = $this->getGameStateValue( 'currentHandType' );

		$playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.
		// self::dump("[bmc] playerGoneDown(argPTP):", $playerGoneDown );

		$gtActivePlayerId = $this->getActivePlayerId();
		// self::dump("[bmc] GAME THINKS ACTIVE PLAYER:", $gtActivePlayerId );
		
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		
		$players = self::loadPlayersBasicInfos();
		$activePlayer = $players[ $activeTurnPlayer_id ][ 'player_name' ];

		// self::dump("[bmc] activeTurnPlayer_id(argPTP):", $activeTurnPlayer_id );

//		$buyers = self::getPlayerBuying();
		//self::dump("[bmc] argPlayerTurnPlay buyers(PTP):", $buyers);

		if ( $playerGoneDown[ $activeTurnPlayer_id ] == 1 ) {
			if ( self::getGameStateValue( 'LPcardsPlayed' ) > 0 ) {
				$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
				self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

				if ( $liverpoolFoundYN == 1 ){ // Only allow multiple if not during liverpoolFound

				// If already played 1 card after Liverpool declare, then can only discard
					$thingsCanDo = clienttranslate( 'discard');
				} else {
				$thingsCanDo = clienttranslate( 'play or discard');
				}
			} else {
				$thingsCanDo = clienttranslate( 'play or discard');
			}
		} else {
			$thingsCanDo = clienttranslate( 'discard or go down (must go down to play on other melds)');
		}
		
		//self::dump("[bmc] currentHandType argPlayerTurnPlay:", $this->handTypes[$currentHandType]["Target"] );
		//self::dump("[bmc] thingsCanDo:", $thingsCanDo );
		//self::dump("[bmc] activePlayer(PTP):", $activePlayer );

		self::setGameLength();

		$tpn = '<span style="color:#' . $players[ $activeTurnPlayer_id ]["player_color"] . ';">' . $players[ $activeTurnPlayer_id ]["player_name"] . '</span>';
		
		// self::dump("[bmc] tpn: ", $tpn );

		self::trace("'<span style='color:green'><b>[bmc] EXIT argPlayerTurnPlay</b></span>'");

        return array(
			'handTarget' => $this->handTypes[ $currentHandType ][ "Target" ], // Pull the description
			'thingsCanDo' => $thingsCanDo,
			'turnPlayerName' => $tpn,
			'where' => 'PTP'

        );
	}
	
    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression() {
		self::trace("bmc] ENTER getGameProgression");
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		
		self::setGameLength();

		self::dump("[bmc] Progression:", $currentHandType );
		self::dump("[bmc] Progression:", count( $this->handTypes ));
		
		$ret = 100 * ( floatval( $currentHandType / count( $this->handTypes )));
		
		if( $ret < 1 ) {
            $ret = 1;
        }
        if( $ret > 99 ) {
            $ret = 99;
        }
		// self::trace("bmc] EXIT getGameProgression");
		self::trace("'<span style='color:green'><b>[bmc] EXIT getGameProgression</b></span>'");
		return $ret;
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
//////////// 
    /*
        In this space, you can put any utility methods useful for your game logic
    */

	function setGameLength() {
		$gameLengthOption = $this->getGameStateValue( 'gameLengthOption' );

		if ( $gameLengthOption == 1 ) {
			$this->handTypes = $this->handTypes2S0R;
		} else if ( $gameLengthOption == 2 ) {
			$this->handTypes = $this->handTypes1S1R;
		} else if ( $gameLengthOption == 3 ) {
			$this->handTypes = $this->handTypes0S2R;
		} else if ( $gameLengthOption == 4 ) {
			$this->handTypes = $this->handTypes3S0R;
		} else if ( $gameLengthOption == 5 ) {
			$this->handTypes = $this->handTypes2S1R;
		} else if ( $gameLengthOption == 6 ) {
			$this->handTypes = $this->handTypes1S2R;
		} else if ( $gameLengthOption == 7 ) {
			$this->handTypes = $this->handTypes0S3R;
		} else if ( $gameLengthOption == 8 ) {
			$this->handTypes = $this->handTypesTwo;
		} else if ( $gameLengthOption == 9 ) {
			$this->handTypes = $this->handTypesThree;
		} else if ( $gameLengthOption == 10 ) {
			$this->handTypes = $this->handTypesShort;
		} else if ( $gameLengthOption == 11 ) {
			$this->handTypes = $this->handTypesFull;
		} else if ( $gameLengthOption == 12 ) {
			$this->handTypes = $this->handTypesMayI;
		} else {
			$this->handTypes = $this->handTypesFull; // Anything else is full game, but should never happen
		}
	}
/////
/////
/////
    function argMyArgumentMethod() {
		self::trace("bmc] ENTER argMyArgumentMethod");

		$currentPlayer = $this->getActivePlayerName();
		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		self::dump("[bmc] currentHandType argMyArgumentMethod:", $this->handTypes[$currentHandType]["Target"]);
		
		return array(
            'currentPlayer' => $currentPlayer,
			'handTarget' => $this->handTypes[ $currentHandType ][ "Target" ] // Pull the description
        );    
    }
/////
/////
/////
	function stDrawDeck() {
		self::trace( "[bmc] ENTER stDrawDeck:" );
        $this->gamestate->nextState("");
		self::trace( "[bmc] EXIT stDrawDeck:" );
	}
////
////
////
	function stDrawDiscard() {
		self::trace( "[bmc] ENTER stDrawDiscard:" );
        $this->gamestate->nextState("");
		self::trace( "[bmc] EXIT stDrawDiscard:" );
	}
////
////
////
    function stPlayerTurnPlay() {
		self::trace("[bmc] ENTER stPlayerTurnPlay");
		self::trace("[bmc] EXIT stPlayerTurnPlay");
	}
////
////
////
    function stWaitForAll() {
//		self::trace( "[bmc] ENTER stWaitForAll" );
		self::trace("'<span style='color:red'><b>[bmc] ENTER stWaitForAll</b></span>'");

		// If a Liverpool exists and is being processed then set player back to the one interrupted
		
		$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
		self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

		if ( $liverpoolFoundYN == 1 ) {
			self::trace( "[bmc] stWaitForAll and $ liverpoolFoundYN == 1" );

			// Clear Liverpool found condition
			self::setGameStateValue( 'liverpoolFoundYN', 0 ); // 0=false; 1=true
		
			$playerInterrupted = self::getGameStateValue( 'playerInterrupted' );

			// Go back to the player who was interrupted
			// It will go back to their DRAW CARD stage which is good. liverpool
			//   cannot be declared after the player draws any card.
			
			$this->gamestate->changeActivePlayer( $playerInterrupted );

			$this->gamestate->nextState( 'LPReturn' );
			return;

		} else { //Exit by changing next player in order
			if( self::checkLiverpool() == true ){
				// Nofity all players there's a liverpool on the board

				self::setGameStateValue( 'liverpoolExists', 1 ); // 0=not exist; 1=exist
				self::trace( "[bmc] LiverpoolExists=True, waiting to see if someone finds it" );
			}

			self::processWishlist(); // Process the wishlist requests
			$this->gamestate->nextState( 'fullyResolved' );
			return;
		}

//		self::trace( "[bmc] EXIT  stWaitForAll" );
		self::trace("'<span style='color:green'><b>[bmc] EXIT  stWaitForAll</b></span>'");
		}
////
////
////
    function stNextPlayer() {
		self::trace("[bmc] ENTER stNextPlayer");
		
		// Notify clients all buyers have resolved, so allow buying again
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		$nextTurnPlayer = $this->getPlayerAfter( $activeTurnPlayer_id );
		
		// self::dump("[bmc] activeTurnPlayer_id:", $activeTurnPlayer_id );
		// self::dump("[bmc] nextTurnPlayer:", $nextTurnPlayer );

		$buyerCount = self::getPlayersBuyCount();
		// $buyerCount = self::getPlayersBuyCountGS();
		
		self::notifyAllPlayers( 'updateBuyers',
			'', // Silent in the log, just update the buyers' quantities
			array (
				'player_id' => $activeTurnPlayer_id,
				'nextTurnPlayer' => $nextTurnPlayer,
				'buyers' => $buyerCount
			)
		);
		
		// Discard cannot continue until all player NOT BUY counters have registered
				
		$waiting = false;
		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		$countCCBL = count($this->cards->countCardsByLocationArgs( 'hand' ));
		$playersNumber = self::getPlayersNumber();

		// $countCCBLDeck = count($this->cards->countCardsByLocationArgs( 'deck' ));
		//$countCCBLDiscardPile = count($this->cards->countCardsByLocationArgs( 'discardPile' ));
		
		// self::dump("[bmc] CCBL (hands):", $countCardsByLocation );
		// self::dump("[bmc] CCCBL:", $countCCBL );
		// self::dump("[bmc] PN:", $playersNumber );
		//self::dump("[bmc] CCBLDeck:", $countCCBLDeck );
		//self::dump("[bmc] CCBLDiscardPile:", $countCCBLDiscardPile );

		$allCards = $this->cards->countCardsInLocations();
		
		//self::dump("[bmc] allCards:", $allCards );
		
		$countDownCards = 0;
		
		if ( array_key_exists( 'playerDown_A', $allCards )) {
			$countDownCards += $allCards[ 'playerDown_A' ];
		}
		if ( array_key_exists( 'playerDown_B', $allCards )) {
			$countDownCards += $allCards[ 'playerDown_B' ];
		}
		if ( array_key_exists( 'playerDown_C', $allCards )) {
			$countDownCards += $allCards[ 'playerDown_C' ];
		}

		// Check if there are still playable cards
		
        $players = self::loadPlayersBasicInfos();

		$shuffleCount = self::getGameStateValue( 'shuffleCount' ); // Reset the shuffle count every hand
		
		// $outReason = 'SomeoneWentOut';   // 0
		// $outReason = 'DeckOverShuffled'; // 1
		// $outReason = 'AllCardsPlayed';   // 2

		if ( $countCCBL != $playersNumber ) {  		// Someone has gone out
			self::dump("[bmc] stNextPlayer SomeoneWentOut(countCCBL):", $countCCBL);
			//$outReason = "SomeoneWentOut" ;
			self::setGameStateValue( "outReason" , 0 );  // Someone went out
			$this->gamestate->nextState( "endHand" );
		} else if ( $shuffleCount > 5 ) {	// The deck has been shuffled too much
			self::dump("[bmc] stNextPlayer shuffleCount:", $shuffleCount);
			//$outReason = "DeckOverShuffled" ;
			self::setGameStateValue( "outReason" , 1 ); // Shuffled more than 5 times
			$this->gamestate->nextState( "endHand" );
		} else if ( $this->checkPlayable() != true ) {	// All playable cards have been played
			self::dump("[bmc] stNextPlayer checkPlayable not true:", 0);
			//$outReason = "AllCardsPlayed";
			self::setGameStateValue( "outReason", 2 );   // All playable cards have been played
			$this->gamestate->nextState( "endHand" );
		} else {

			// Clear all the buyers
			// self::trace( "[bmc] stNextPlayer clearing buyers.");
			$this->clearBuyers();

			// Next player can draw and play etc...

			// Show State
			$state = $this->gamestate->state();
			// self::dump("[bmc] stNextPlayer state:", $state);

			$activePlayerId = $this->getActivePlayerId();
			// self::dump( "[bmc] activePlayerId (before change) (stNextPlayer):", $activePlayerId );

			$discardingPlayer_id = $activePlayerId;
			$previous_player_id = $this->getPlayerBefore( $activePlayerId );
			$next_player_id = $this->getPlayerAfter( $activePlayerId );
			
			// self::dump( "[bmc] previous_player_id (stNextPlayer):", $previous_player_id );
			// self::dump( "[bmc] next_player_id (stNextPlayer):", $next_player_id );
			// self::dump( "[bmc] discardingPlayer_id (stNextPlayer):", $discardingPlayer_id );
			
			
			//$this->gamestate->changeActivePlayer( $next_player_id );
			$this->activeNextPlayer();
			
			$activePlayerId = $this->getActivePlayerId();
			// self::dump( "[bmc] activePlayerId (after change):", $activePlayerId );
			
			// Give extra time to player
			self::giveExtraTime( $activePlayerId );

			// Store the previous player so they don't get the offer to buy their own discard.
			// Cannot do this in a multiactive state, so we must do it right before it.
			
			self::setGameStateValue( "previous_player_id" , $previous_player_id );
			self::setGameStateValue( 'activeTurnPlayer_id', $activePlayerId );
		
			//Set above: $discardingPlayer_id = $this->getPlayerBefore( $activePlayerId );

			self::setPlayerBuying(   $discardingPlayer_id, 1 ) ; // 1 = not buying, they just discarded it
			// self::setPlayerBuyingGS( $discardingPlayer_id, 1 ); // 1 = not buying, they just discarded it

			self::setPlayerBuying(   $activePlayerId, 1 ) ; // 1 = not buying, they can get it for free
			// self::setPlayerBuyingGS( $activePlayerId, 1 ); // 1 = not buying, they can get it for free

			// Just make sure it stuck!
			// $activePlayerId = $this->getActivePlayerId();
			// self::dump( "[bmc] activePlayerId (exiting nextPlayer inside if):", $activePlayerId );

			// Show State
			// $state = $this->gamestate->state();
			//self::dump("[bmc] stNextPlayer state:", $state);

			$this->gamestate->nextState( 'nextPlayer' );					
		}
	self::trace("[bmc] EXIT stNextPlayer");
	}
////
////
////
	function checkPlayable() {
		self::trace( "[bmc] ENTER checkPlayable" );

		$playedCardArray = [];
		$unplayedHandArray = [];
		$unplayedDeckArray = [];
		$unplayedDPArray = [];
		
		$unplayedHandArray = $this->cards->getCardsInLocation( 'hand' );
		$unplayedDeckArray = $this->cards->getCardsInLocation( 'deck' );
		$unplayedDPArray = $this->cards->getCardsInLocation( 'discardPile' );
		
		$unplayedCardArray = array_merge( $unplayedHandArray, $unplayedDeckArray, $unplayedDPArray );
		
		//self::dump("[bmc] unplayedCardArray:", $unplayedCardArray );
	
		$playedCardArray = array_merge(
			$this->cards->getCardsInLocation( 'playerDown_A' ),
			$this->cards->getCardsInLocation( 'playerDown_B' ),
			$this->cards->getCardsInLocation( 'playerDown_C' )
			);

		//self::dump("[bmc] playedCardArray:", $playedCardArray );

		$playedValues = array();
		$jokersPlayed = 0;
		
		$playedSuitArray = [];
		// self::dump("[bmc] playedSuitArray :", $playedSuitArray );
		
		foreach( $playedCardArray as $card ) {
//			self::dump("[bmc] foreachplayedcard :", $card );
			if ( count( $card ) != 0 ) {
				if ( $card[ 'type' ] == 5 ) {
					$jokersPlayed++;
				} else {
					if( !in_array( $card[ 'type_arg' ], $playedValues )) {
						$playedValues[] = $card[ 'type_arg' ];
					}
				}
			}
			// Also track the suits on the board
			$playedSuitArray[ $card[ 'type' ]] = 1;
		}
		
		// self::dump("[bmc] playedValues :", $playedValues );
		// self::dump("[bmc] playedSuitArray :", $playedSuitArray );
			
		$unplayedValues = array();
		
		foreach( $unplayedCardArray as $card ) {
//			self::dump("[bmc] foreachunplayedcard :", $card );
			if ( $card[ 'id' ] != null ) {
				if (!in_array( $card[ 'type_arg' ], $unplayedValues )){
					$unplayedValues[] = $card[ 'type_arg' ];
				}
			}
		}
		// self::dump("[bmc] count(UPV) :", count( $unplayedValues ));
		//self::dump("[bmc] unplayedValues :", $unplayedValues );

		// Check if all jokers have been played, if not then keep playing

		$optionNumJokers =  self::getGameStateValue( 'numberOfJokers' );
		
		if( $optionNumJokers == 10 ) {
			$numberOfDecks = self::getGameStateValue( 'numberOfDecks' );
			$numberOfJokers = 2 * $numberOfDecks;
		} else {
			$numberOfJokers = $optionNumJokers;
		}
		
		// self::dump("[bmc] numberOfJokers :", $numberOfJokers );
		// self::dump("[bmc] jokersPlayed :", $jokersPlayed );

		if ( $jokersPlayed < $numberOfJokers ) {
			self::trace( "[bmc] EXIT checkPlayable - Still a playable joker." );
			return true; // Still can play at least 1 joker
		}

		// If sets are a target and values can still be played then keep playing

		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		$setsNeeded = $this->handTypes[ $currentHandType ][ "QtySets" ];
		$runsNeeded = $this->handTypes[ $currentHandType ][ "QtyRuns" ];

		if( $setsNeeded > 0 ) {
			foreach( $unplayedValues as $value ) {
				if ( in_array( $value, $playedValues )) {
					self::trace( "[bmc] EXIT Still a playable card on a Set." );
					return true; // Still can play some values onto sets
				}
			}
		} else { // else the hand target is only runs
			// For Runs, if there are still cards in anyone's hand or in the deck or in
			// discard pile which match a suit on the board, then there are still playable cards

			foreach( $unplayedCardArray as $card ) {
	//			self::dump("[bmc] foreachunplayedcard :", $card );
				if ( $card[ 'id' ] != null ) {
					if ( in_array( $card[ 'type' ] , $playedSuitArray )) {
						// self::dump("[bmc] foundaplayablecard :", $card );
						self::trace( "[bmc] EXIT Still a playable card on a Run." );
						
						return true; // A card with a suit which is on the board is still unplayed
					}
				}
			}
		}

		// If we got here, then there are no unplayable value cards on sets, and no unplayed cards with suits on the board, so the the hand should end because the players cannot play it out.
		
		self::trace( "[bmc] EXIT checkPlayable" );
		return false;
		
	}
////
////
////
	function nextTurnPlayer() {
		self::trace( "[bmc] ENTER nextTurnPlayer" );
		
		$players = self::loadPlayersBasicInfos();
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		$nextPlayer = $this->getPlayerAfter( $activeTurnPlayer_id ); 

		//self::dump( "[bmc] players: ", $players );
		// self::dump( "[bmc] activeTurnPlayer_id(nextTurnPlayer):", $activeTurnPlayer_id );
		// self::dump( "[bmc] nextPlayer3: ", $nextPlayer );

		self::setGameStateValue( setGameStateValue( 'activeTurnPlayer_id', $nextPlayer ));
		
		self::trace( "[bmc] EXIT nextTurnPlayer" );
		return $nextPlayer;
	}
////
////
////
}
