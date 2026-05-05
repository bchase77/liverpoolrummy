<?php

trait DrawDiscard {
	public function actDiscardCard( int $card_id, int $player_id ) {
		// self::trace( "[bmc] ENTER discardCard (from JS via action.php)" );
		self::trace("'<span style='color:red'><b>[bmc] ENTER discardCard (from JS via action.php)</b></span>'");

		// self::checkAction("discardCard");
		// self::checkAction("actDiscardCard");
		
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		self::dump("[bmc] activeTurnPlayer_id:", $activeTurnPlayer_id );

    	// Turns played statistics, match it to number of discards
    	self::incStat( 1, 'turns_number' ); // 3rd term is null here, tracking turns for all players
		
		$currentHandType = $this->getGameStateValue( 'currentHandType' );

		self::dump("[bmc] currentHandType discardCard:", $currentHandType );

		self::dump("[bmc] Discard attempt by player id:", $player_id );
		self::dump("[bmc] Trying to discard card_id:", $card_id );
		
		// It's looking 1 deeper in the discard pile which it should not do 
		
		$LPMissed = self::getGameStateValue( 'LPMissed' );
		self::dump("[bmc] LPMissed:", $LPMissed );
		
		if( $LPMissed == 1 ){ // 0 = false; 1 = true
			self::setGameStateValue( 'liverpoolExists', 1 ); // 0=not exist; 1=exist
		} else {
			self::setGameStateValue( 'liverpoolExists', 0 ); // 0=not exist; 1=exist
		}
		
		$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
		$liverpoolExists  = self::getGameStateValue( 'liverpoolExists');   // 0 = false; 1 = true

		self::dump("[bmc] LPFound:", $liverpoolFoundYN );
		self::dump("[bmc] LPExists:", $liverpoolExists );

		if ( $activeTurnPlayer_id == $player_id ) { // Potentially process discard if it's that player's turn
		
			// If draw source is discard pile then allow fast play

			$drawSourceValue = $this->getGameStateValue( 'drawSourceValue' ); // 0 = deck, 1 = discardPile.
			self::dump("[bmc] drawSourceValue:", $drawSourceValue );

			if ( $drawSourceValue == 1 ){ // 1 = discardPile
				self::trace("'<span style='color:blue'><b>[bmc] Drew discard, allow fast!</b></span>'");

			} else if ( self::getPlayersNumber() <= 2 ) { // 2-player games don't need buy delay
				self::trace("'<span style='color:blue'><b>[bmc] 2-player game, allow fast!</b></span>'");

			} else {

				// But not if they drew a deck card within the last couple of seconds (Derusian exploit)

				$discardStamp = time(); // Unix timestamp
				self::dump("[bmc] discardStamp:", $discardStamp );

				$drawStamp = $this->getGameStateValue( 'drawStamp' );
				self::dump("[bmc] drawStamp:", $drawStamp );

				$drawDiscardsSeconds = $discardStamp - $drawStamp;
				self::dump("[bmc] drawDiscardsSeconds:", $drawDiscardsSeconds );

				// Safety check: if drawStamp was set with old format or is invalid, allow play
				// Old format produced values ~63 billion, new time() is ~1.7 billion
				// If difference is negative or > 1 hour (3600s), skip the check
				if ( $drawDiscardsSeconds < 0 || $drawDiscardsSeconds > 3600 ) {
					self::trace("'<span style='color:blue'><b>[bmc] Invalid timestamp diff, allow play</b></span>'");

				} else {

					// If everyone has gone down let them play fast (only check active players)
					$sql = "SELECT player_id, gone_down FROM player WHERE player_eliminated = 0";
					$playerGoneDown = self::getCollectionFromDB( $sql, true );
					self::dump("[bmc] playerGoneDown:", $playerGoneDown );

					$someoneNotDown = 0; // See if everyone has gone down

					foreach ( $playerGoneDown as $playerDown ){
						self::dump("[bmc] playerDown:", $playerDown );

						if ( $playerDown == 0 ){
							$someoneNotDown = 1; // Set to 1; Someone has not gone down
						}
					}

					if ( $someoneNotDown == 0){ // 0 so everyone has gone down
						// Do nothing, let's them play fast
					self::trace("'<span style='color:blue'><b>[bmc] Let them play fast!</b></span>'");
				} else {
					if ( $drawDiscardsSeconds < 3 ){ // Give players at least 2 seconds to respond
						self::trace("'<span style='color:blue'><b>[bmc] Too fast!</b></span>'");
						throw new BgaUserException( self::_("Chill D. Let others have a chance to buy.") );
					} else {
						self::trace("'<span style='color:blue'><b>[bmc] Not too fast</b></span>'");
					}
				}
				}
			}

			// Clear LPMissed if it's a real discard
			self::setGameStateValue( 'LPMissed', 0 ); // 0=false; 1=true
			self::trace( "[bmc] Clearing LPMissed" );

			if (( $liverpoolExists == 1 ) && ( $liverpoolFoundYN == 0 )) { // LP exists but no one found It

				// The notification of missed LP might not belong here. Players still have opportunity to see and catch it.

				self::trace("[bmc] LPExists and was missed" );


				self::notifyAllPlayers( 'liverpoolMissed',
					'There was a Liverpool!', // Put it in the log
					array (
					)
				);
			}

			// Clear this flag for checking later
			self::setGameStateValue( 'liverpoolExists', 0 ); // 0=not exist; 1=exist

			// Allow buying again (trying to resolve bug where someone buys after discard picked up
			self::setGameStateValue( 'isBuyingAllowed', 1 ); // 0 == false; 1 == true

			self::trace("[bmc] YESBUYINGALLOWEDYES" );

			// First resolve the buyers, then process the discard
			// If someone is going out then don't process the buy
			
			$countCCBL = count($this->cards->countCardsByLocationArgs( 'hand' ));
			$playersNumber = self::getPlayersNumber();

			if ( $countCCBL == $playersNumber ) { // If not equal then someone has gone out, don't process the buy
				$this->resolveBuyers();
			}

			$this->clearBuyers();

			// Notifying players potentially buying the previous one that they were too slow!
			self::notifyAllPlayers( 'clearBuyers',
				'',
				array (
//					'discardWeight' => $discardWeight
				)
			);
			
			self::trace( "[bmc] Discarding the card." );
			
			$discardWeight = self::incGameStateValue( 'discardWeightHistory', 1 );

			self::dump("[bmc] discardweight:", $discardWeight );

			// Put the card on top of the discard pile
			$bOnTop = true;
			
			// 9/17/2023 Idea:
			// How about to remove all cards except the discarded card from the discard pile?
			// Then add it.
			//$cardsInDp = $this->cards->getCardsInLocation( 'discardPile' );
			
			//self::dump("[bmc] cardsInDp:", $cardsInDp );

			$dp = $this->cards->getCardsInLocation( 'discardPile' );
			// self::dump("[bmc] dp:", $dp );

			// foreach( $dp as $card ) {     //$buyers as $p_id => $buyChoice ) {
				// self::dump("[bmc] card:", $card );
				
				// $this->cards->moveCards($card, 'exile');
			// }
			
			$this->cards->insertCardOnExtremePosition( $card_id, 'discardPile', $bOnTop );

			// Here check if liverpool was processed. If yes then send the correct 
			// next player to JS.
			//
			// Set also activeTurnPlayer_id??

			// $liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true

			if ( $liverpoolFoundYN == 1 ) { // If a liverpool was processed, go back to interrupted player
				$nextTurnPlayer = self::getGameStateValue( 'playerInterrupted' );
				$activeTurnPlayer_id = $nextTurnPlayer;
			} else {
				$nextTurnPlayer = $this->getPlayerAfter( $player_id );
			}

			self::dump("[bmc] nextTurnPlayer:", $nextTurnPlayer );

			$cardsByLocationHand  = $this->cards->countCardsByLocationArgs( 'hand' );
			$discardSize = count( $this->cards->countCardsByLocationArgs( 'discardPile' ));
			self::setGameStateValue( 'discardSize', $discardSize );
			
			self::dump("[bmc] discardSize(DP):", $discardSize );

			$this->checkEmptyDeck(); // Make sure the deck has cards
			$drawDeckSize = count( $this->cards->countCardsByLocationArgs( 'deck' ));

			$currentCard = $this->cards->getCard( $card_id );

			// <Player> Discard: <jack> of <clubs>
			// <Player> Discard: <joker>
			
			if ( $currentCard[ 'type' ] == 5 ) {
				$value_displayed = 'Joker';
				$color_displayed = '';
				$connector = '';
			} else {
				$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
				$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
				$connector = ' of ';
			}
			
			$player_name = self::getActivePlayerName();

			self::notifyAllPlayers(	'discardCard',
				clienttranslate( '${player_name} Discarded ${value_displayed} ${connector} ${color_displayed}' ),
				array (
					'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ),
					// 'player_id' => $activeTurnPlayer_id,
					'player_id' => $player_id,
					'player_name' => self::getActivePlayerName(),
					'color' => $currentCard [ 'type' ],
					'color_displayed' => $color_displayed,
					'value' => $currentCard [ 'type_arg' ],
					'value_displayed' => $value_displayed,
					'card_id' => $card_id,
					'nextTurnPlayer' => $nextTurnPlayer,
					'allHands' => $cardsByLocationHand,
					'discardSize' => $discardSize,
					'drawDeckSize' => $drawDeckSize,
					'connector' => $connector
				)
			);

// Example from BGA website
// https://en.doc.boardgamearena.com/Tutorial_hearts
        // self::notifyAllPlayers(
			// 'playCard',
			// clienttranslate('${player_name} plays ${value_displayed} ${color_displayed}'),
			// array (
				// 'i18n' => array ('color_displayed','value_displayed' ),
				// 'card_id' => $card_id,
				// 'player_id' => $player_id,
				// 'player_name' => self::getActivePlayerName(),
				// 'value' => $currentCard ['type_arg'],
				// 'value_displayed' => $this->values_label [$currentCard ['type_arg']],
				// 'color' => $currentCard ['type'],
				// 'color_displayed' => $this->colors [$currentCard ['type']] ['name']
			// )
		// );
        // Next player or back to player interrupted by Liverpool declare

		self::setGameStateValue( 'LPcardsPlayed', 0 ); // Clear the tracking of played cards
		self::trace( "[bmc] Set LPcardsPlayed to 0." );

		self::trace( "[bmc] About to EXIT discardCard (via nextState'discardCard')." );

		self::setGameStateValue( 'discardingPlayer', $player_id ); // Track discarder for LP reasons

		// Discarded the card, move on
		$this->gamestate->nextState( 'discardCard' );

		} else {
			throw new BgaUserException( self::_("You cannot discard, it's not your turn.") );
		}
		
		// self::trace("[bmc] EXIT discardCard (from JS)");
		self::trace("'<span style='color:green'><b>[bmc] EXIT discardCard (from JS)</b></span>'");
    }
////////
////////
////////
//    function drawCard( $card_id, $drawSource, $player_id ) { // from JS or PHP liverpool penalty
	// function drawCard( $card_id, $drawSource, $player_id ) { // from PHP liverpool penalty
		// $this->actDrawCard( $card_id[ 'id' ], $drawSource, $player_id );
	// }
////////
////////
////////
//    function drawCard( $card_id, $drawSource, $player_id ) { // from JS or PHP liverpool penalty
	function drawCardNoCheck( $card_id, $drawSource, $player_id ) { // from PHP liverpool penalty
		self::trace("'<span style='color:red'><b>[bmc] ENTER drawCardNoCheck</b></span>'");
		self::dump("card id:", $card_id ); // Probably no longer need to send in card_id from JS
		self::dump("drawSource:", $drawSource );
		self::dump("Drawing player id:", $player_id );
		
		// CheckAction would be here, but because were coming from PHP don't need it, so just draw the card

		$this->drawCardCommon( $card_id, $drawSource, $player_id ); // 
		self::trace("'<span style='color:green'><b>[bmc] EXIT drawCardNoCheck</b></span>'");
	}
////////
////////
////////
//    function drawCard( $card_id, $drawSource, $player_id ) { // from JS or PHP liverpool penalty
	function drawCardCommon( $card_id, $drawSource, $player_id ) { // from other PHP functions
		self::trace("'<span style='color:red'><b>[bmc] ENTER drawCardCommon (from JS or PHP)</b></span>'");
		
		self::dump("[bmc] player_id: ", $player_id );
		
		$liverpoolExists  = self::getGameStateValue( 'liverpoolExists'); // 0 = false; 1 = true
		// self::dump("[bmc] 2230 drawCardCommon: liverpoolExists", $liverpoolExists );
		
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		// self::dump("[bmc] activeTurnPlayer_id", $activeTurnPlayer_id );
		
		if ( $player_id != $activeTurnPlayer_id ) {
			throw new BgaUserException( self::_("You cannot draw, it's not your turn.") );
		}

		// Track time (seconds) to avoid players not allowing others to buy (Derusian exploit)

		$drawStamp = time(); // Unix timestamp
		self::dump("[bmc] drawStamp:", $drawStamp );
		self::setGameStateValue( 'drawStamp', $drawStamp ); // Store timestamp for seconds when card was drawn

		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		//self::dump("[bmc] CCBL:", $countCardsByLocation);

		// drawSource Sources (OLD):
		// 0 == 'deck' (buyer gets it + 1 down card; Increment buy counter)
		// 1 == 'discardPile' (buyer gets nothing)
		// 2 == Other sources (other conditions like playing a card for a joker)
		
		// drawSourceValue needs to be set properly before resolveBuyers
		if ( $drawSource == 'discardPile' ) {
			self::trace("[bmc] drawSource == discardPile" );
			self::setGameStateValue( 'drawSourceValue', 1 );
		} else if ( $drawSource == 'deck' ) {
			self::trace("[bmc] drawSource == deck" );
			self::setGameStateValue( 'drawSourceValue', 0 );
		} else {
			self::trace("[bmc] drawSource == other, some place on the board" );
			self::setGameStateValue( 'drawSourceValue', 2 );
		}

		// If drawing from the discard pile then the player get the top card, not necessarily the one they clicked
		if ( $drawSource == 'discardPile' ) {

			// If the player whose turn it is draws the discard then don't allow buying
			self::setGameStateValue( 'isBuyingAllowed', 0 ); // 0 == false; 1 == true
			self::trace("[bmc] BUYINGALLOWEDNOLONGER" );

			$topDiscard = $this->cards->getCardOnTop( 'discardPile' );
			// self::dump( "[bmc] topDiscard: ", $topDiscard );
			
			$card_id = $topDiscard[ 'id' ];
		} else { // else use the top card of the deck
		
			$this->checkEmptyDeck(); // Make sure the deck has cards

			// If the most senior player wants to buy then resolve it immediately without waiting for next discard
			$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
			$bossBuyer = $this->getPlayerAfter( $activeTurnPlayer_id );
			
			$buyers = self::getPlayerBuying();
			// $buyers = self::getPlayerBuyingGS();
		
			// self::dump("[bmc] buyers(drawCard):", $buyers);
			
			$players = self::loadPlayersBasicInfos();

			$buyingPlayers = [];

			// Change to p_id because the loop will change the value
			foreach( $buyers as $p_id => $buyChoice ) {
				// self::dump("bmc] player_id(p_id): ", $p_id);
				// self::dump("bmc] buyChoice: ", $buyChoice);
				
				if ( $buyChoice == 2 ) { // 0=Not decided, 1=Not buying, 2=Buying
					// self::dump("[bmc] player_id(p_id)", $p_id);
					// self::dump("[bmc] ATPI", $activeTurnPlayer_id);
					// self::dump("[bmc] bossBuyer", $bossBuyer);

					if ( $p_id == $bossBuyer ) {
						// self::trace("[bmc] Resolving Buyers early!");
						$this->resolveBuyers();
						
					}
				} else {
					// self::dump("[bmc]  This player is not buying::", $p_id);
				}
			}

			$topDeck = $this->cards->getCardOnTop( 'deck' );
			// self::dump( "[bmc] topDeck: ", $topDeck );
			
			$card_id = $topDeck[ 'id' ];
		}
		
        $this->cards->moveCard( $card_id, 'hand', $player_id );

		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		//self::dump("[bmc] CCBL aftermove:", $countCardsByLocation);

        $currentCard = $this->cards->getCard( $card_id );
		
		if (( $currentCard[ 'type' ] == 5 ) &&     // If joker is drawn
			 !( $drawSource == 'discardPile' ) &&  // not from discard
			 !( $drawSource == 'deck' )) {         // not from deck then it came from board, so subtract 1.
			self::trace("[bmc] Drew a joker.");
			self::incStat( -1, 'jokers_number', $player_id ); // Track joker play for stats
		}

		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		$this->drawNotify( $currentCard, $player_id, $drawSource, $player_id, $activeTurnPlayer_id );
		
		self::trace("'<span style='color:green'><b>[bmc] EXIT drawCardCommon (from JS or PHP)</b></span>'");
	}
////////
////////
////////	
	public function actDrawCard( int $card_id, string $drawSource, int $player_id ) { // from JS 
		self::trace("'<span style='color:red'><b>[bmc] ENTER Draw Card (from JS or liverpool penalty)</b></span>'");

//		self::trace("[bmc] ENTER Draw Card (from JS or liverpool penalty)");
		// self::dump("card id:", $card_id ); // Probably no longer need to send in card_id from JS
		// self::dump("drawSource:", $drawSource );
		// self::dump("Drawing player id:", $player_id );
		
        self::checkAction("actDrawCard"); // Check action if coming from JS, not needed when coming from PHP
		
		$this->drawCardCommon( $card_id, $drawSource, $player_id ); // 
	}
////////
////////
////////	
/*
todo: Delete this next function
	public function actDrawCard( int $card_id, string $drawSource, int $player_id ) { // from JS 
		self::trace("'<span style='color:red'><b>[bmc] ENTER Draw Card (from JS or liverpool penalty)</b></span>'");

//		self::trace("[bmc] ENTER Draw Card (from JS or liverpool penalty)");
		self::dump("card id:", $card_id ); // Probably no longer need to send in card_id from JS
		self::dump("drawSource:", $drawSource );
		self::dump("Drawing player id:", $player_id );
        self::checkAction("actDrawCard");

		$liverpoolExists  = self::getGameStateValue( 'liverpoolExists'); // 0 = false; 1 = true
		self::dump("[bmc] 2123 drawCard: liverpoolExists", $liverpoolExists );
		
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		self::dump("[bmc] activeTurnPlayer_id", $activeTurnPlayer_id );
		
		if ( $player_id != $activeTurnPlayer_id ) {
			throw new BgaUserException( self::_("You cannot draw, it's not your turn.") );
		}

		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		//self::dump("[bmc] CCBL:", $countCardsByLocation);

		// drawSource Sources (OLD):
		// 0 == 'deck' (buyer gets it + 1 down card; Increment buy counter)
		// 1 == 'discardPile' (buyer gets nothing)
		// 2 == Other sources (other conditions like playing a card for a joker)
		
		// drawSourceValue needs to be set properly before resolveBuyers
		if ( $drawSource == 'discardPile' ) {
			self::trace("[bmc] drawSource == discardPile" );
			self::setGameStateValue( 'drawSourceValue', 1 );
		} else if ( $drawSource == 'deck' ) {
			self::trace("[bmc] drawSource == deck" );
			self::setGameStateValue( 'drawSourceValue', 0 );
		} else {
			self::trace("[bmc] drawSource == other, some place on the board" );
			self::setGameStateValue( 'drawSourceValue', 2 );
		}

		// If drawing from the discard pile then the player get the top card, not necessarily the one they clicked
		if ( $drawSource == 'discardPile' ) {

			// If the player whose turn it is draws the discard then don't allow buying
			self::setGameStateValue( 'isBuyingAllowed', 0 ); // 0 == false; 1 == true
			self::trace("[bmc] BUYINGALLOWEDNOLONGER" );

			$topDiscard = $this->cards->getCardOnTop( 'discardPile' );
			self::dump( "[bmc] topDiscard: ", $topDiscard );
			
			$card_id = $topDiscard[ 'id' ];
		} else { // else use the top card of the deck
		
			$this->checkEmptyDeck(); // Make sure the deck has cards

			// If the most senior player wants to buy then resolve it immediately without waiting for next discard
			$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
			$bossBuyer = $this->getPlayerAfter( $activeTurnPlayer_id );
			
			$buyers = self::getPlayerBuying();
			// $buyers = self::getPlayerBuyingGS();
		
			self::dump("[bmc] buyers(drawCard):", $buyers);
			
			$players = self::loadPlayersBasicInfos();

			$buyingPlayers = [];

			// Change to p_id because the loop will change the value
			foreach( $buyers as $p_id => $buyChoice ) {
				self::dump("bmc] player_id(p_id): ", $p_id);
				self::dump("bmc] buyChoice: ", $buyChoice);
				
				if ( $buyChoice == 2 ) { // 0=Not decided, 1=Not buying, 2=Buying
					self::dump("[bmc] player_id(p_id)", $p_id);
					self::dump("[bmc] ATPI", $activeTurnPlayer_id);
					self::dump("[bmc] bossBuyer", $bossBuyer);

					if ( $p_id == $bossBuyer ) {
						self::trace("[bmc] Resolving Buyers early!");
						$this->resolveBuyers();
						
					}
				} else {
					self::dump("[bmc]  This player is not buying::", $p_id);
				}
			}

			$topDeck = $this->cards->getCardOnTop( 'deck' );
			self::dump( "[bmc] topDeck: ", $topDeck );
			
			$card_id = $topDeck[ 'id' ];
		}
		
        $this->cards->moveCard( $card_id, 'hand', $player_id );

		$countCardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		//self::dump("[bmc] CCBL aftermove:", $countCardsByLocation);

        $currentCard = $this->cards->getCard( $card_id );
		
		if (( $currentCard[ 'type' ] == 5 ) &&     // If joker is drawn
			 !( $drawSource == 'discardPile' ) &&  // not from discard
			 !( $drawSource == 'deck' )) {         // not from deck then it came from board, so subtract 1.
			self::trace("[bmc] Drew a joker.");
			self::incStat( -1, 'jokers_number', $player_id ); // Track joker play for stats
		}

		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		$this->drawNotify( $currentCard, $player_id, $drawSource, $player_id, $activeTurnPlayer_id );
		
//		self::trace("[bmc] EXIT drawCard");
		self::trace("'<span style='color:green'><b>[bmc] EXIT Draw Card (from JS or liverpool penalty)</b></span>'");

	}
*/
////////
////////
////////
	function drawNotify( $currentCard, $playingPlayer_id, $drawSource, $drawPlayer, $activeTurnPlayer_id ) {
		self::trace("'<span style='color:red'><b>[bmc] ENTER drawNotify</b></span>'");
//		self::trace("[bmc] ENTER drawNotify");

		// self::dump("[bmc] currentCard    :",  $currentCard);
		
		$card_id = $currentCard['id'];
		
		$players = self::loadPlayersBasicInfos();
		$activePlayer = $players[ $playingPlayer_id ][ 'player_name' ];

//		self::dump("[bmc] card_id          :",  $card_id );
//		self::dump("[bmc] drawSource       :",  $drawSource );
		// self::dump('[bmc] playingPlayer_id :',  $playingPlayer_id );
		// self::dump('[bmc] player_name      :',  $activePlayer );
//		self::dump('[bmc] card_id          :',  $card_id );
//		self::dump('[bmc] value            :',  $currentCard ['type_arg'] );
//		self::dump('[bmc] value_displayed  :',  $this->values_label [$currentCard ['type_arg']] );
//		self::dump('[bmc] color            :',  $currentCard ['type']);
//		self::dump('[bmc] color_displayed  :',  $this->colors [$currentCard ['type']] ['name'] );
		// self::dump('[bmc] drawSource       :',  $drawSource );
		// self::dump('[bmc] drawPlayer       :',  $drawPlayer );

		// Notify players of the source of the draw

		if ( $drawSource == 'discardPile' ) {
			$drawSourceText = 'discard pile';
		} else if ( $drawSource == 'deck' ) {
			$drawSourceText = 'deck';
		} else {
			$drawSourceText = 'board';
		}

		$cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );

		$drawDeckSize = count( $this->cards->countCardsByLocationArgs( 'deck' ));
		
		$discardSize = count( $this->cards->countCardsByLocationArgs( 'discardPile' ));
		self::setGameStateValue( 'discardSize', $discardSize );
		
		// Show text differently to players for a joker.
		
		if ( $currentCard[ 'type' ] == 5 ) {
			$value_displayed = 'Joker';
			$color_displayed = '';
			$connector = '';
		} else {
			$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
			$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
			$connector = ' of ';
		}

		foreach ( $players as $player_id => $player ) {
			
			if ( $player_id == $activeTurnPlayer_id ) {
				self::notifyPlayer(
					$player_id,
					'drawCard',
					clienttranslate( 'You drew from the ${drawSourceText}: ${value_displayed} ${connector} ${color_displayed}' ),
					array(
						'i18n' => array( 'value_displayed', 'color_displayed', 'drawSourceText', 'connector' ),
						'player_id' => $player_id,
						'player_name' => $activePlayer,
						'card_id' => $card_id,
						'value' => $currentCard[ 'type_arg' ],
						'value_displayed' => $value_displayed,
						'color' => $currentCard [ 'type' ],
						'color_displayed' => $color_displayed,
						'drawSource' => $drawSource,
						'drawSourceText' => $drawSourceText,
						'drawPlayer' => $drawPlayer,
						'allHands' => $cardsByLocation,
						'discardSize' => $discardSize,
						'drawDeckSize' => $drawDeckSize,
						'connector' => $connector
					)
				);
			} else {
				self::notifyPlayer(
					$player_id,
					'drawCard',
					// Commenting this out or else 2 entries will appear in the log. This is duplicated by the drawCardSpect function.
//					'${player_name} draws a card from the ${drawSourceText}.',
					'',
					array(
						'player_id' => $playingPlayer_id,
						'player_name' => $activePlayer,
						'card_id' => $card_id,
						'value' => $currentCard[ 'type_arg' ],
						'value_displayed' => '',
						'color' => $currentCard [ 'type' ],
						'color_displayed' => '',
						'drawSource' => $drawSource,
						'drawSourceText' => $drawSourceText,
						'drawPlayer' => $drawPlayer,
						'allHands' => $cardsByLocation,
						'discardSize' => $discardSize,
						'drawDeckSize' => $drawDeckSize
					)
				);
			}
		}

		$player_name = $activePlayer;

//09/02/2023

// TODO Jan 25 2025: Comment this notify out after I change the JS for drawcard.

		self::notifyAllPlayers( 'drawCardSpect',
			// WHY IS NEXT LINE COMMENTED OUT???
			// It was commented out because 2 entries appear in the log if it's not blank. Now I commented out the per-player one above.
			clienttranslate( '${player_name} Drew a card from the ${drawSourceText}' ),
			array(
				'i18n' => array( 'drawSourceText' ),
				'player_id' => $activeTurnPlayer_id,
				'player_name' => $activePlayer,
				'card_id' => $card_id,
				'color' => '',
				'value' => '',
				'drawSource' => $drawSource,
				'drawPlayer' => $drawPlayer,
				'allHands' => $cardsByLocation,
				'discardSize' => $discardSize,
				'drawSourceText' => $drawSourceText,
				'drawDeckSize' => $drawDeckSize
			)
		);

//		self::trace("[bmc] EXIT (almost) drawNotify");
		self::trace("'<span style='color:green'><b>[bmc] EXIT (almost) drawNotify</b></span>'");

		// Next State
		$state = $this->gamestate->state();
		// self::dump("[bmc] state:", $state);

		if ( $state['name'] == 'playerTurnPlay' ) { // Got the joker from a board play, so keep playing.
			$this->gamestate->nextState( 'playCard' );

		} else if (( $state['name'] == 'resolveBuyers' ) ||
				   ( $state['name'] == 'liverpoolDrawPenaltyCaller' ) ||
				   ( $state['name'] == 'liverpoolDrawPenaltyDiscarder' )){
					   
		   self::trace("[bmc] resolveBuyers or LPDrawPenalty(C or D)");
			
			// If notifying of a buy or drawing for penalty then don't change state
			//return;
			
		} else {
			// Else got card from a true draw (deck or discard), so let the player play.
			
			self::trace("[bmc] MAYBE ERROR AREA IN DRAWNOTIFY");
			$this->gamestate->nextState( 'drawCard' );
		}
		self::trace("'<span style='color:green'><b>[bmc] EXIT drawNotify</b></span>'");
	}
////////
////////
////////
//	function playerGoDown( $cardIDGroupA, $cardIDGroupB, $cardIDGroupC, $boardCardId, $boardArea, $boardPlayer, $handItemIds ) {
}
