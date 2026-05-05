<?php

trait Liverpool {
	function argLiverpoolDrawPenaltyDiscarder() {
		// self::trace("[bmc] ENTER argLiverpoolDrawPenaltyDiscarder");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argLiverpoolDrawPenaltyDiscarder</b></span>'");
		$players = self::loadPlayersBasicInfos();

		$playerDiscarding = $players[ $this->getGameStateValue( 'activeTurnPlayer_id' )][ 'player_name' ];

//		self::trace("[bmc] EXIT argLiverpoolDrawPenaltyDiscarder");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argLiverpoolDrawPenaltyDiscarder</b></span>'");

        return array(
			'playerDiscarding' => $playerDiscarding
		);
	}
////////
////////
////////
	function argLiverpoolDrawPenaltyCaller() {
		// self::trace("[bmc] ENTER argLiverpoolDrawPenaltyCaller");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argLiverpoolDrawPenaltyCaller</b></span>'");
		$players = self::loadPlayersBasicInfos();

		$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );
//		$playerDiscarding = $players[ $this->getGameStateValue( 'activeTurnPlayer_id' )][ 'player_name' ];

		// self::trace("[bmc] EXIT argLiverpoolDrawPenaltyCaller");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argLiverpoolDrawPenaltyCaller</b></span>'");

        return array(
			'playerFindingLP' => $playerFindingLP
		);
	}
////////
////////
////////
	function argLiverpoolBonus() {
//		self::trace("[bmc] ENTER argLiverpoolBonus");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argLiverpoolBonus</b></span>'");
//		$players = self::loadPlayersBasicInfos();

		$playerFindingLP = $this->getGameStateValue( 'playerFindingLP' );

//		self::setGameStateValue( 'isBuyingAllowed', 0 ); // 0 == false; 1 == true

		// self::trace("[bmc] EXIT argLiverpool");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argLiverpoolBonus</b></span>'");

        return array(
			'playerFindingLP' => $playerFindingLP
		);
	}
////////
////////
////////
	function argLiverpoolPenalty() {
//		self::trace("[bmc] ENTER argLiverpoolBonus");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argLiverpoolPenalty</b></span>'");
//		$players = self::loadPlayersBasicInfos();

		$playerFindingLP = $this->getGameStateValue( 'playerFindingLP' );

//		self::setGameStateValue( 'isBuyingAllowed', 0 ); // 0 == false; 1 == true

		// self::trace("[bmc] EXIT argLiverpool");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argLiverpoolPenaltyf</b></span>'");

        return array(
			'playerFindingLP' => $playerFindingLP
		);
	}
////////
////////
////////
	function argLiverpoolDraw() {
//		self::trace("[bmc] ENTER argLiverpoolDraw");
		self::trace("'<span style='color:red'><b>[bmc] ENTER argLiverpoolDraw</b></span>'");
		$players = self::loadPlayersBasicInfos();

		$playerFindingLP = $players[ $this->getGameStateValue( 'playerFindingLP' )][ 'player_name' ];

		// self::trace("[bmc] EXIT argLiverpoolDraw");
		self::trace("'<span style='color:green'><b>[bmc] EXIT argLiverpoolDraw</b></span>'");

        return array(
			'playerFindingLP' => $playerFindingLP
		);
	}
////////
////////
////////
	public function actLiverpoolButton( int $player_id ) { // From JS
		self::trace("[bmc] ENTER liverpoolButton");
		self::dump("[bmc] player_id:", $player_id);
		self::dump("[bmc] playerFindingLP, should equal player_id; If yes, remove the passed variable:", self::getCurrentPlayerId());
		
		// Get current game state (might be one of these:
		//   playerTurnDraw
		
		$bmcGameState = $this->gamestate->state();

		self::dump("[bmc] game state is :", $bmcGameState[ 'name' ]);
		
		// Declaring LP is possible only before the draw
		
		if ( $bmcGameState [ 'name' ] == 'playerTurnDraw' ) {
			// Cannot declare LIVERPOOL on yourself
			
			$discardingPlayer = self::getGameStateValue( 'discardingPlayer');
			
			self::dump("[bmc] discardingPlayer :", $discardingPlayer );

			$currentPlayerId = self::getCurrentPlayerId();
			$activePlayerId = self::getActivePlayerId(); 
			self::dump("[bmc] discardingPlayer :", $discardingPlayer );
			self::dump("[bmc] currentPlayerId :", $currentPlayerId );
			self::dump("[bmc] activePlayerId :", $activePlayerId );


			if (( $player_id == $discardingPlayer )) {
				//( $currentPlayerId == $activePlayerId )){
					
				throw new BgaUserException( self::_("You cannot declare Liverpool on yourself.") );
			}
			
			// Maybe add these 2 lines here:
			// $this->gamestate->checkPossibleAction('actionUnpass');
			// $this->gamestate->setPlayersMultiactive(array ($this->getCurrentPlayerId() ), 'error', false);

			// Game Option: Liverpool button plays as a penalty to the caller or discarder
			
			$LiverpoolConsequence =  self::getGameStateValue( 'LiverpoolConsequence' );
			
			if ( $LiverpoolConsequence == 1 ){ // 0=bonus; 1=penalty
				self::trace("[bmc] Found liverpool ( penalty mode )");
				
				$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' );
				$liverpoolExists  = self::getGameStateValue( 'liverpoolExists' );
				$playerFindingLP = self::getCurrentPlayerId();
				$playerInterrupted = self::getActivePlayerId(); 
				
				self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN);
				self::dump("[bmc] liverpoolExists:", $liverpoolExists);
				self::dump("[bmc] playerFindingLP:", $playerFindingLP);

				self::setGameStateValue( 'playerFindingLP',   $playerFindingLP );
				self::setGameStateValue( 'playerInterrupted', $playerInterrupted );

				$players = self::loadPlayersBasicInfos();

				self::trace("[bmc] Found liverpool ( penalty mode ) just before if");
				
				if ( $liverpoolExists == 0 ) { // There is no Liverpool condition; Declarer gets penalty
					self::trace("[bmc] Declarer gets a penalty");
						
					self::notifyAllPlayers( 'liverpoolDeclared',
						clienttranslate( '${player_name} declared Liverpool on ${discarding_name} but no Liverpool exists. ${player_name} draws a card.'),
						array(
							'player_id' => $player_id,
							'discarding_name' => $players[ $discardingPlayer ][ 'player_name' ],
							'player_name'     => $players[ $player_id ][ 'player_name' ]
						)
					);
				} else { // The one who discarded it gets a card, and the discarded card
					self::trace("[bmc] Discarder gets a penalty");
					
					self::notifyAllPlayers( 'liverpoolDeclared',
						clienttranslate( '${player_name} declared Liverpool on ${discarding_name} and so ${discarding_name} pulls it back and draws a card.'),
						array(
							'player_id' => $player_id,
							'discarding_name' => $players[ $discardingPlayer ][ 'player_name' ],
							'player_name'     => $players[ $player_id ][ 'player_name' ]
						)
					);
				}
				$dpCard = $this->cards->getCardsInLocation( 'discardPile' );
				
				if ( isset( reset( $dpCard )[ 'id' ])) {
					self::dump("[bmc] (5376)dpCard:", reset( $dpCard )[ 'id' ]);

					$currentCard = $this->cards->getCard( reset( $dpCard )[ 'id' ] );
					self::dump("[bmc] (5379)currentCardInDP:", $currentCard );

					$this->gamestate->nextState( 'liverpoolPenalty' );
				} else {
					self::trace("[bmc] liverpool Error. No discard?");
				}
			} else { // Game Option: Liverpool button plays as a BONUS to the caller
				self::trace("[bmc] Found liverpool(bonus)");

				$playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.

				if ( $playerGoneDown[ $player_id ] != 1 ) { // 0=not gone down; 1=gone down
					throw new BgaUserException( self::_("You cannot declare Liverpool, you have not gone down.") );
					
				} else {

					// Check if there really is a liverpool or not
					// If there is, then register the first player
					// Block out other players
					// Store the current player
					// Draw the card to the player
					// Go to a state where that card can be played by the player finding liverpool
					// After it's played, let that player discard
					// After discard, go back to whoever's turn it was before the liverpool
					
					$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' );
					$liverpoolExists  = self::getGameStateValue( 'liverpoolExists' );
					$playerInterrupted = self::getActivePlayerId(); 
					$playerFindingLP = self::getCurrentPlayerId();
					
					self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN);
					self::dump("[bmc] liverpoolExists:", $liverpoolExists);
					self::dump("[bmc] playerInterrupted:", $playerInterrupted);
					self::dump("[bmc] playerFindingLP:", $playerFindingLP);

					self::setGameStateValue( 'playerFindingLP',   $playerFindingLP );
					self::setGameStateValue( 'playerInterrupted', $playerInterrupted );

					$players = self::loadPlayersBasicInfos();

					// Check for liverpoolexist
					if ( $liverpoolExists == 1 ) { // 0 = Not exist; 1 = Exist
						self::trace("[bmc] Liverpool Exists");

						// And it was found by this Player, so make them active player
						self::setGameStateValue( 'activeTurnPlayer_id', $playerFindingLP );

						if ( $liverpoolFoundYN == 0 ){
							// To avoid race condition check it exists and not yet found
							// Function drawCard sets liverpoolExists == 0 quickly to avoid race condition

							self::setGameStateValue( 'liverpoolFoundYN', 1 ); // 0 = false; 1 = true
						}

						self::notifyAllPlayers( 'liverpoolDeclared',
							clienttranslate( '${player_name} found Liverpool! They drew the discarded card and can play it.'),
							array(
								'player_id' => $player_id,
								'player_name' => $players[ $player_id ][ 'player_name' ]
							)
						);

						$dpCard = $this->cards->getCardsInLocation( 'discardPile' );
						
						if ( isset( reset( $dpCard )[ 'id' ])) {
							self::dump("[bmc] (5527)dpCard:", reset( $dpCard )[ 'id' ]);

							$currentCard = $this->cards->getCard( reset( $dpCard )[ 'id' ] );

							self::dump("[bmc] (5531)currentCardInDP:", $currentCard );

							// Cannot do drawcard here because it's not this players turn. Do it after active player draws.
			//				$this->drawCard( $currentCard, 'discardPile', $playerFindingLP );

							// When drawCard finishes it goes to playCard.
			//				After that, check if was liverpool and change players accordingly.

			//				self::trace("[bmc] After LP playCard:" );

							$this->gamestate->nextState( 'liverpoolBonus' );

						} else {
							self::trace("[bmc] liverpool Error. No discard?");
							// Not supposed to happen, there's nothing in the discard!
						}
					} else {
						$LiverpoolConsequence =  self::getGameStateValue( 'LiverpoolConsequence' );
						
						//if ( $LiverpoolConsequence == 1 ){ // 0=bonus; 1=penalty
						if ( 0 == 1 ){ // Disable this option for now
							$this->gamestate->nextState( 'liverpoolPenalty' );
						} else {
							throw new BgaUserException( self::_("No Liverpool exists (BONUS mode, so no penalty).") );
						self::trace("[bmc] No liverpool exists, do nothing");
						// Do nothing. They pushed the button but there is no liverpool condition
						// I could add some penalty here...
						}						
					}
				}
			}
		} else {
			throw new BgaUserException( self::_("The time to declare Liverpool has passed.") );
		}
		self::trace("[bmc] EXIT liverpoolButton");
	}
////
////
////
	function stLiverpoolBonus() {
//		self::trace("[bmc] ENTER stLiverpoolBonus");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stLiverpoolBonus</b></span>'");
		
		// Set the next player to be the one who clicked first
		// Cannot draw the card here because it's a game state
		
		$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );

		$this->gamestate->changeActivePlayer( $playerFindingLP );

		$this->gamestate->nextState( ); // Go to next state to draw the discarded card
		

//		self::trace("[bmc] EXIT stLiverpoolBonus");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolBonus</b></span>'");
	}
////
////
////
	function stLiverpoolPenalty() {
//		self::trace("[bmc] ENTER stLiverpoolPenalty");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stLiverpoolPenalty</b></span>'");
		
		// Set the next player to be the one who clicked first
		// Cannot draw the card here because it's a game state
		
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );

		// Don't change player order, just give the discarder cards (in penaltyReturn)
		// Go back 1 so nextPlayer goes to the right player

		$discarder = $this->getPlayerBefore( $activeTurnPlayer_id );
		self::dump("[bmc] discarder:", $discarder);

		if ( self::getGameStateValue( 'liverpoolExists' ) == 1 ){ // If LP exists
			$this->setGameStateValue( 'activeTurnPlayer_id', $discarder );
			self::dump("[bmc] playerGotCaught):", $discarder );
//			$this->gamestate->changeActivePlayer( $discarder );

			$this->gamestate->nextState( "penalizeDiscarder" ); // Go to next state to draw the discarded card
		} else { // else LP does not exist
			$playerFindingLP = $this->getGameStateValue( 'playerFindingLP' );
			self::dump("[bmc] playerFindingLP (wrongly):", $playerFindingLP);
			
			$this->setGameStateValue( 'activeTurnPlayer_id', $playerFindingLP  );
//			$this->gamestate->changeActivePlayer( $playerFindingLP );
			$this->gamestate->nextState( "penalizeCaller" ); // Go to next state to draw the discarded card
		}

//		self::trace("[bmc] EXIT stLiverpoolPenalty");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolPenalty</b></span>'");
	}
////
////
////
	function stLiverpoolDraw() {
//		self::trace("[bmc] ENTER stLiverpoolDraw");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stLiverpoolDraw</b></span>'");

		// Draw the discarded card to the player finding liverpool
		// In this state we can draw it (but cannot change the player; did that in the previous state)
		$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );

		$currentCard = $this->cards->getCardOnTop( 'discardPile' );
		
		$state = $this->gamestate->state();
		self::dump("[bmc] state(stLiverpoolDraw):", $state);
		self::dump("[bmc] currentCard:", $currentCard);

//		$this->drawCard( $currentCard, 'discardPile', $playerFindingLP );
		$this->drawCardNoCheck( $currentCard, 'discardPile', $playerFindingLP );
	
		self::trace("[bmc] drawCard within stLiverpoolDraw is finished.");

		$this->gamestate->nextState( 'playCard' ); // Go to playerTurnPlay because a card was drawn
		
		// The discard function must check if we are in a liverpool play, then
		// go back to the interrupted player

//		self::trace("[bmc] EXIT stLiverpoolDraw");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolDraw</b></span>'");
	}
////
////
////
	function stLiverpoolDrawPenaltyDiscarder() {
		// self::trace("[bmc] ENTER stLiverpoolDrawPenaltyDiscarder");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stLiverpoolDrawPenaltyDiscarder</b></span>'");
		
		// Draw the discarded card to the player discarding the playable card
		//   And give them a penalty card
		// In this state we can draw it (but cannot change the player; did that in the previous state)
		
		$penalizedPlayer = self::getGameStateValue( 'activeTurnPlayer_id' );
		self::dump("[bmc] penalizedPlayer:", $penalizedPlayer);
//		self::dump("[bmc] penalizedPlayer:", $this->getPlayerBefore( self::getGameStateValue( 'activeTurnPlayer_id' )));

		$currentDiscard = $this->cards->getCardOnTop( 'discardPile' );
		$currentDeck    = $this->cards->getCardOnTop( 'deck' );
				
		$state = $this->gamestate->state();
		self::dump("[bmc] state(stLiverpoolDrawPenaltyDiscarder):", $state);

		// $this->drawCard( $currentDiscard, 'discardPile', $penalizedPlayer );
		// $this->drawCard( $currentDeck, 'deck', $penalizedPlayer );

		self::trace("[bmc] Draw from discard pile.");
		$this->drawCardNoCheck( $currentDiscard, 'discardPile', $penalizedPlayer );
		
		self::trace("[bmc] Draw penalty card from deck.");
		$this->drawCardNoCheck( $currentDeck, 'deck', $penalizedPlayer );
	
		$this->gamestate->nextState();

		self::trace("[bmc] drawCard within stLiverpoolDrawPenaltyDiscarder is finished.");
		// self::trace("[bmc] EXIT stLiverpoolDrawPenaltyDiscarder");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolDrawPenaltyDiscarder</b></span>'");
	}
////
////
////

//todo: The player order got messed up when someone calls liverpool but it doesn't exist.
	function stLiverpoolDrawPenaltyCaller() {
		// self::trace("[bmc] ENTER stLiverpoolDrawPenaltyCaller");
		self::trace("'<span style='color:red'><b>[bmc] ENTER stLiverpoolDrawPenaltyCaller</b></span>'");
		
		// Draw the discarded card to the player who called Liverpool when none existed
		// In this state we can draw it (but cannot change the player; did that in the previous state)
		$penalizedPlayer = self::getGameStateValue( 'playerFindingLP' );

		$currentCard = $this->cards->getCardOnTop( 'deck' );
		
		$state = $this->gamestate->state();

		self::dump("[bmc] state(stLiverpoolDrawPenaltyCaller):", $state);

		// $this->drawCard( $currentCard, 'deck', $penalizedPlayer );
		$this->drawCardNoCheck( $currentCard, 'deck', $penalizedPlayer );
	
		$this->gamestate->nextState();

		self::trace("[bmc] drawCard within stLiverpoolDrawPenaltyCaller is finished.");
//		self::trace("[bmc] EXIT stLiverpoolDrawPenaltyCaller");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolDrawPenaltyCaller</b></span>'");
	}
////
////
////
	function stLiverpoolReturn() {
		self::trace("[bmc] ENTER stLiverpoolReturn");
		
		// Change the player back
		$playerInterrupted = self::getGameStateValue( 'playerInterrupted' );
		self::dump("[bmc] playerInterrupted:", $playerInterrupted);

		// Set to player before because stNextPlayer increments it
		
		$this->gamestate->changeActivePlayer( $this->getPlayerBefore( $playerInterrupted ));
		// This next is not right. It should be the one who just discarded, not the one before the interrupted one
		
		$playerFindingLP = self::getGameStateValue( 'playerFindingLP' );
		
		// self::setGameStateValue( 'activeTurnPlayer_id', $this->getPlayerBefore( $playerInterrupted ));
		self::setGameStateValue( 'activeTurnPlayer_id', $playerFindingLP );

		$state = $this->gamestate->state();
		self::dump("[bmc] state(stLiverpoolReturn):", $state);

		self::trace("[bmc] drawCard and play within stLiverpoolDraw is finished.");

		$this->gamestate->nextState(); // Go back to interrupted player
//		$this->gamestate->nextState('playerTurnDraw' ); // Go back to interrupted player

		self::trace("[bmc] EXIT stLiverpoolReturn");
	}
////
////
////
	function stLiverpoolReturnPenalty() {
//		self::trace("[bmc] ENTER stLiverpoolReturnPenalty");
		self::trace("'<span style='color:red'><b>[bmc] EXIT stLiverpoolReturnPenalty</b></span>'");

//	Something in here makes the active player be the discarder. It should go to the next player.

// Just print some stuff for penalty mode, since cards were draw elsewhere

//		$nextPlayer = $this->getPlayerAfter( self::getGameStateValue( 'activeTurnPlayer_id' ));
//		$nextPlayer = self::getGameStateValue( 'activeTurnPlayer_id' );
//		self::dump("[bmc] nextPlayer2:", $nextPlayer );
		
		$activePlayerId = $this->getActivePlayerId();
		self::dump("[bmc] nextPlayer2:", $activePlayerId );
		
		// Set to player before because stNextPlayer increments it
		
		$playerBefore = $this->getPlayerBefore( $activePlayerId );
		self::dump("[bmc] nextPlayer2.1:", $playerBefore );

		$this->gamestate->changeActivePlayer( $playerBefore );
		self::setGameStateValue( 'activeTurnPlayer_id', $playerBefore );

		$state = $this->gamestate->state();
		self::dump("[bmc] state(stLiverpoolReturnPenalty):", $state);

		self::trace("[bmc] drawCard and play within stLiverpoolDraw is finished.");

		$this->gamestate->nextState(); // Go to next player's turn

//		self::trace("[bmc] EXIT stLiverpoolReturnPenalty");
		self::trace("'<span style='color:green'><b>[bmc] EXIT stLiverpoolReturnPenalty</b></span>'");
	}
////
////
////
    function checkLiverpool() {
		self::trace( "[bmc] ENTER checkLiverpool" );

		$dpCard = $this->cards->getCardOnTop( 'discardPile' );

//		self::dump("[bmc] waitForAll dpCard:", $dpCard);

		$players = self::loadPlayersBasicInfos();
		
		$localLPlExists = false;
		
		foreach ( $players as $player_id => $player) {
			// Check Area A

			$areaCards = $this->cards->getCardsInLocation( 'playerDown_A' , $player_id );
//			self::dump("[bmc] waitForAll areaCards:", $areaCards);
			
			if ( count( $areaCards ) > 0 ){
				$areaCards[ $dpCard['id'] ] = $dpCard; // Keep the index of the new potential card
//				self::dump("[bmc] waitForAll areaCards:", $areaCards);

				if ( $this->checkSet( $areaCards ) == true ) {
					$localLPlExists = true;
				} else if ( $this->checkRun( $areaCards, true ) == true ) {	// Check for run silently (no BGA error)
					$localLPlExists = true;
				}
			}

			// Check Area B

			$areaCards = $this->cards->getCardsInLocation( 'playerDown_B' , $player_id );
			if ( count( $areaCards ) > 0 ){

				$areaCards[ $dpCard['id'] ] = $dpCard; // Keep the index of the new potential card
//				self::dump("[bmc] waitForAll areaCards:", $areaCards);

				if ( $this->checkSet( $areaCards ) == true ) {
					$localLPlExists = true;
				} else if ( $this->checkRun( $areaCards, true ) == true ) {	// Check for run silently (no BGA error)
					$localLPlExists = true;
				}
			}
			
			// Check Area C

			$areaCards = $this->cards->getCardsInLocation( 'playerDown_C' , $player_id );

			if ( count( $areaCards ) > 0 ){
				$areaCards[ $dpCard['id'] ] = $dpCard; // Keep the index of the new potential card
//				self::dump("[bmc] waitForAll areaCards:", $areaCards);

				if ( $this->checkSet( $areaCards ) == true ) {
					$localLPlExists = true;
				} else if ( $this->checkRun( $areaCards, true ) == true ) {	// Check for run silently (no BGA error)
					$localLPlExists = true;
				}
			}
		}
		
		// If made it this far then nothing matched, the discard cannot be playhed anywhere (no Liverpool)
		self::dump( "[bmc] EXIT checkLiverpool", $localLPlExists );
		return $localLPlExists;

	}
////
////
////
}
