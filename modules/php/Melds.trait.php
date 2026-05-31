<?php

use \Bga\GameFramework\Actions\Types\IntArrayParam;

trait Melds {
	function tryJokerSwap ( $card_id, $player_id, $boardArea, $boardPlayer) {
		self::trace("[bmc] ENTER tryJokerSwap");

		if ( $this->checkSet( $this->cards->getCardsInLocation( $boardArea, $boardPlayer ))){

			self::trace("[bmc] Swapping joker in SET while going down - verify it!");

			// Try to play the card for the joker as part of going down
			$mightBeJoker = $this->playCardFinish( $card_id, $player_id, $boardArea, $boardPlayer, true );

			// PLAYCARDFINISH PUTS THE JOKER IN THE HAND. So, have playCardFinish return the pulled joker.

			self::trace("[bmc] Pulled the joker off the table(set)");

			self::trace("[bmc] Replace with the card.");

			// $cardsInArea = $this->cards->getCardsInLocation( 'hand', $player_id );
			// $mightBeJoker = $this->checkForJoker( $cardsInArea );

			//self::dump("[bmc] cardsInArea:", $cardsInArea);
			self::dump("[bmc] mightBeJoker:", $mightBeJoker);
			//$this->cards->moveCard($mightBeJoker['id'], 'hand', $player_id);

			// Now finish going down
			// self::trace("[bmc] EXIT tryJokerSwap(1)");
			self::trace("'<span style='color:green'><b>[bmc] EXIT tryJokerSwap(1)</b></span>'");

			return $mightBeJoker;
			
		} else { // Check if run
			self::trace("[bmc] Swapping joker in RUN while going down - verify it!");

			// If the cards w/o joker are still a run then take the joker, if not then don't
			
			$cardsInArea = $this->cards->getCardsInLocation( $boardArea, $boardPlayer);
			
			if ( count( $cardsInArea ) != 0 ) {
				$mightBeJoker = $this->checkForJoker( $cardsInArea );
			} else {
				return false; // Exit early because no down area was selected
			}

			self::dump("[bmc] cardsInArea  (3352):", $cardsInArea);
			self::dump("[bmc] mightBeJoker (3353):", $mightBeJoker);
			
			$maybeNewRun = $cardsInArea;
			
			// Potentially remove the joker TODO Aug03: PROTECT THIS UNSET from bool
			unset( $maybeNewRun[ $mightBeJoker['id']] );
			
	        $card = $this->cards->getCard( $card_id );

			// Potentially add the hand card

			$maybeNewRun[$card['id']] = $card; // Keep the index of the new potential card

			if ( $this->checkRun( $maybeNewRun, false )) { // If it's still a run, take the joker
				self::trace("[bmc] Take the joker, haven't used it yet.");

//				if ( $boardCard['type'] == 5 ) { // If a joker is there

				// $usedTheJoker = true;
		
				// TODO: Might need to use the returned joker value from playCardFinish instead of the 'found' one (i.e. do it like sets does it).
				//$this->cards->moveCard($card_id, $boardArea, $boardPlayer);
				$this->playCardFinish( $card_id, $player_id, $boardArea, $boardPlayer, false );
		
				self::trace("[bmc] Replace with the card.");
				$this->cards->moveCard($mightBeJoker['id'], 'hand', $player_id);
		
				// And notify of the joker being 'drawn' from the down area
				$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
				$this->drawNotify( $mightBeJoker, $player_id, $boardArea, $boardPlayer, $activeTurnPlayer_id );

				// Store the joker and card swapped in case we need to undo
				// self::setGameStateValue( "forJokerCard_id", $card_id );
				// self::setGameStateValue( "forJokerBoardArea", ord(substr( $boardArea, -1) )); // Must store int
				// self::setGameStateValue( "forJokerBoardPlayer", $boardPlayer );
				// self::setGameStateValue( "forJokerTheJoker_id", $mightBeJoker['id'] );
				// self::setGameStateValue( "forJokerPlayerID", $boardPlayer );
			} 

			self::trace("[bmc] Pulled the joker off the table (run)");

			// Now finish going down
			// self::trace("[bmc] EXIT tryJokerSwap(2)");
			self::trace("'<span style='color:green'><b>[bmc] EXIT tryJokerSwap(2)</b></span>'");
			return $mightBeJoker;
		}
	}
////////
////////
////////
	public function actPlayCard( int $card_id, int $player_id, string $boardArea, string $boardPlayer ) {
		// self::trace( "[bmc] ENTER playCard (from ACTION from JS)" );
		self::trace("'<span style='color:red'>[bmc] ENTER playCard (from ACTION from JS)</span>'");

		// Validate the player has the card in hand
		// validate the card can be played there
		//   If the target card is a joker, take the joker & replace
		// Move the card(s) around
		// Notify the players
		$this->checkAction("actPlayCard");

		// Validate the player has already gone down
		$playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.
		$currentPlayer = $this->getActivePlayerId();

		if ( $playerGoneDown[ $currentPlayer ] != 1 ) {
			throw new BgaUserException( self::_('You can play only after you go down.') );
		}
		
		$cardsInHand = $this->cards->countCardsByLocationArgs( 'hand' )[$currentPlayer];
		
		if ( $cardsInHand < 2 ) {
			throw new BgaUserException( self::_('You cannot empty your hand.') );
			return;
		}

		$this->playCardFinish( $card_id, $player_id, $boardArea, $boardPlayer, false );
		self::trace( "[bmc] EXIT playCard" );
		
		// Push the next state so that the arg gets updated (state will go back to same state)
		$this->gamestate->nextState( 'playCard' );
	}
////
////
////
//	function playCardMultiple( $card_ids, $player_id, $boardArea, $boardPlayer ) {
	public function actPlayCardMultiple( #[IntArrayParam] array $card_ids, int $player_id, string $boardArea, string $boardPlayer ) {
		self::trace( "[bmc] ENTER playCardMultiple (from ACTION from JS)" );

		$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
		self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

		if ( $liverpoolFoundYN == 0 ){ // Only allow multiple if not during liverpoolFound
//			allow only 1 card to be Played
		
			// The problem is, even if it's determined that the whole thing is a run, it
			// calls PLAYCARDFINISH which tries to play each card 1 at a time. So, it fails.
			
			// Validate the player has the card in hand
			// validate the card can be played there
			//   If the target card is a joker, take the joker & replace
			// Move the card(s) around
			// Notify the players
			$this->checkAction("actPlayCardMultiple");

			// Validate the player has already gone down
			$playerGoneDown = self::getPlayerGoneDown(); // It's an array, one for each player.
			$currentPlayer = $this->getActivePlayerId();

			if ( $playerGoneDown[$currentPlayer] != 1 ) {
				throw new BgaUserException( self::_('You can play only after you go down.') );
			}
			
			$cardsInHand = $this->cards->countCardsByLocationArgs( 'hand' )[$currentPlayer];

			self::dump("[bmc] cardInHand:", $cardsInHand );
			self::dump("[bmc] card_ids:", $card_ids );
			self::dump("[bmc] count(card_ids):", count( $card_ids ));
			
			if (( $cardsInHand - count( $card_ids )) < 1 ) {
				throw new BgaUserException( self::_('You cannot empty your hand.') );
				return;
			}
			
			$boardCards = $this->cards->getCardsInLocation( $boardArea , $boardPlayer );
			self::dump("[bmc] boardCards before:", $boardCards );
			
			$handCards = $this->cards->getCards( $card_ids );
			self::dump("[bmc] handCards:", $handCards );
			
//			$boardPlusHandCards = array_merge( $boardCards, $handCards );
			
			$boardPlusHandCards = $boardCards + $handCards ;

			self::dump("[bmc] boardPlusHandCards After:", $boardPlusHandCards );
			
			$boardIsRun = $this->checkRun( $boardCards, true ); // cards, silent
			$boardIsSet = $this->checkSet( $boardCards );
			
			$bothIsRun = $this->checkRun( $boardPlusHandCards, true ); // cards, silent
			$bothIsSet = $this->checkSet( $boardPlusHandCards );
			
			// If all the cards are a run then keep trying to play them until it works
			
			// TODO Oct 2022: Fix this so it plays 56 onto 890*
			// Method: Try to play them in all the orders possible and see if 1 goes through
			
	//		$multipleCardsAreRun = $this->checkRun( $boardPlusHandCards, false );

	// Start change for playing multiple Nov 2022.
			if ( $this->checkRun( $boardPlusHandCards, true ) == true ) {
				self::dump("[bmc] checkRun passed as true:", $boardPlusHandCards );

				if ( count( $boardPlusHandCards ) > 14 ) { // Could have A234 up to JQKA, so 14 cards is OK
					throw new BgaUserException( self::_('Cannot play there. That board area is full.') );
				}

				self::trace( "[bmc] Playing multiple on run." );
				foreach( $handCards as $card ) {
					self::dump("[bmc] PlayMultiple:", $card );
					self::dump("[bmc] PlayMultiple:", $card['id'] );
					$playWeight = $this->cards->countCardInLocation($boardArea) + 100;
					$this->playOnRunAndNotify( $card['id'], $boardArea, $boardPlayer, $playWeight, $player_id, $card, true, true );
				}
			} else if ( $this->checkSet( $boardPlusHandCards ) == true ) {
				self::trace( "[bmc] Playing multiple on set." );
				foreach( $handCards as $card ) {
					self::dump("[bmc] PlayMultiple:", $card );
					self::dump("[bmc] PlayMultiple:", $card['id'] );
					$this->playCardFinish( $card['id'], $player_id, $boardArea, $boardPlayer, false, true );
				}
			} else {
				// Throw exception that it's not a set nor a run
				throw new BgaUserException( self::_('Cannot play those cards on that meld.') );
				return;
			}
			$cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
			self::notifyAllPlayers( 'cardsPlayedMultiple',
				clienttranslate( '${player_name} Played ${count} cards' ),
				array(
					'player_id'   => $player_id,
					'player_name' => self::getActivePlayerName(),
					'count'       => count( $handCards ),
					'allHands'    => $cardsByLocation,
				)
			);
		} else {
			// Cannot play more than 1 card from a Liverpool declaration
			throw new BgaUserException( self::_('After Liverpool, only 1 card is allowed to be played.') );
		}
		self::trace( "[bmc] EXIT playCardMultiple" );
	}
////
////
////
	function findCardNotJoker( $boardArea, $boardPlayer ) {
		self::trace("[bmc] ENTER findCardNotJoker");
		$cardsInArea = $this->cards->getCardsInLocation( $boardArea, $boardPlayer);

		foreach( $cardsInArea as $card ) {
			if( $card['type'] != 5 ) {
				self::dump("[bmc] EXIT findCardNotJoker:", $card);
				return $card;
			} else {
				self::trace("[bmc] Found a joker, keep looking for a non-joker.");
			}
		}
		$card = reset( $cardsInArea ); 
		self::dump("[bmc] All Jokers! Returning one of them:", $card);
		
		self::trace("[bmc] EXIT findCardNotJoker");
		return $card;
	}
////
////
////
	function playCardFinish( $card_id, $player_id, $boardArea, $boardPlayer, $dontSwapForJoker, $silent = false ) {
		// self::trace( "[bmc] ENTER playCardFinish" );
		self::trace("'<span style='color:red'>[bmc] ENTER playCardFinish</span>'");
		// Validate the player has the card in hand
		// validate the card can be played there
		//   If the target card is a joker, take the joker & replace
		// Move the card(s) around
		// Keep track of number of jokers played
		// Notify the players

		$currentCard = $this->cards->getCard( $card_id );

		list($card_typeA, $card_type_argA) = $this->checkIfReallyInHand( [$currentCard], $player_id );

		self::dump("[bmc] Playing card:", $card_id );
		self::dump("[bmc] currentCard:", $currentCard );
		self::dump("[bmc] Cards on board BOARD AREA:", $boardArea);
		self::dump("[bmc] Cards on board BOARD PLAYER:", $boardPlayer);

		$cardsInArea = $this->cards->getCardsInLocation( $boardArea, $boardPlayer);

		self::dump("[bmc] Count of cards in area:", count( $cardsInArea ));	
		self::dump("[bmc] cardsInArea:", $cardsInArea );
		
		// If there are already 14 cards there then
			// If the card being played is a joker then decline it
			// If the area is a set and there is no joker there, then decline it
			// If the area is a run and the card value is on the board, then decline it
		// if not 14 cards there then continue

		if ( count( $cardsInArea ) > 13 ) { // Could have A23 up to QKA, so 14 total is OK
			if ( $currentCard[ 'type' ] == 5 ) {
				throw new BgaUserException( self::_('Cannot play there. That board area is full[J].') );
			} else if (( $this->checkSet( $cardsInArea ) == true ) &&
				    ( countJokers( $cardsInArea ) < 1 )){
				throw new BgaUserException( self::_('Cannot play there. That board area is full[S].') );
			} else if (( $this->checkRun( $cardsInArea, true ) == true ) &&
					  ( $this->checkContains( $currentCard, $cardsInArea ))){
				self::dump("[bmc] currentCard[TA]:", $currentCard[ 'type_arg' ]);
				
				if ( $currentCard[ 'type_arg' ] != 1 ) { // Allow 2 aces
					throw new BgaUserException( self::_('Cannot play there. That board area is full[R].') );
				} else {
					
				}
			}
		}
		// Try to play the card

		// self::dump("[bmc] Cards on board CARDS IN AREA:", $cardsInArea );
		// self::dump("[bmc] Card being played CARD TYPE:", $card_typeA );
		// self::dump("[bmc] Card being played CARD TYPE:", $card_typeA[0] );
		// self::dump("[bmc] Card being played CARD TYPE ARG:", $card_type_argA );
		self::dump("[bmc] currentCard (4081):", $currentCard );

		// Count the jokers being played for stats
		// self::incStat( 1, 'jokers_number', $player_id );
		// 08/26/2023

		// if ( $this->checkForJokerIsOneCard( $currentCard )) {
			// self::incStat( 1, 'jokers_number', $player_id );
		// }

		$mightBeJoker = $this->checkForJoker( $cardsInArea );
		self::dump("[bmc] 4024: Might Be Joker", $mightBeJoker );
		
		if ( $mightBeJoker ) {
			$boardCard = $mightBeJoker; // Find a joker on the board if possible
		} else { // Get a representative card from the group
			$boardCard = $this->findCardNotJoker( $boardArea, $boardPlayer );
		}

		self::dump("[bmc] boardCard:", $boardCard );
		self::dump("[bmc] area plus player: ", $boardArea . "_" . $boardPlayer);
		
		$usedTheJoker = false;
		
		// TODO: Reduce this section of IFs which has some duplication
		$playWeight = $this->cards->countCardInLocation($boardArea) + 100;

		// If playing same value, or if a joker is there, or if playing a joker, then play
		if ( $this->checkSet( $cardsInArea ) == true ) {
			self::trace("[bmc] Trying to play onto a set.");
			
			if (( $boardCard['type_arg'] === $card_type_argA[0] ) or // If same value
				( $boardCard['type'] == 5 ) 					  or // If board has a joker
				( $card_typeA[0] == 5))							  {  // If playing a joker

				self::trace("[bmc] Playing the card onto the set.");
				
				// If playing a joker then just play it
				if ( $card_typeA[0] == 5 ) {
					$LPcardsPlayed = self::getGameStateValue( 'LPcardsPlayed' );
					self::dump("[bmc] LPcardsPlayed:", $LPcardsPlayed );

					$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
					self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );
					
					// Only allow multiple if not during liverpoolFound

					if (( $liverpoolFoundYN == 1 ) && ( $LPcardsPlayed > 0 )){
						throw new BgaUserException( self::_('You can play only 1 card after a Liverpool [3508]') );
					} else {
						self::trace("[bmc] Play joker on set.");
						$this->cards->moveCard( $card_id, $boardArea, $boardPlayer, $playWeight);

						self::incStat( 1, 'jokers_number', $player_id ); // Track joker play for stats
						self::setGameStateValue( 'LPcardsPlayed', 1 ); // Track # of cards played; Limit to 1 for Liverpool declare
					}
				} else if ( $mightBeJoker != false ) { 
					self::trace("[bmc] 4070: mightbejoker != false.");

					$getANonJokerMaybe = $this->findCardNotJoker( $boardArea, $boardPlayer );
					
//					if ( $this->findCardNotJoker( $boardArea, $boardPlayer )['type_arg'] == $card_type_argA[ 0 ] ) {
					if ( $getANonJokerMaybe['type_arg'] == $card_type_argA[ 0 ] ) {
						self::trace("[bmc] 4073: findCardNotJoker is true");
						
						// Add new option to not take jokers (uncomment the next line)
						//if ( $this->getGameStateValue( 'allowJokerSwapping' ) == 1 ) { // 0 == No. 1 == Yes.
							
						// Need to also add this in the RUN check area	

						$LPcardsPlayed = self::getGameStateValue( 'LPcardsPlayed' );
						self::dump("[bmc] LPcardsPlayed:", $LPcardsPlayed );

						$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' );
						self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

						if (( $liverpoolFoundYN == 1 ) && ( $LPcardsPlayed > 0 )){
							throw new BgaUserException( self::_('You cannot swap jokers after a Liverpool.') );
						} else {
							$this->takeTheJoker( $mightBeJoker, $player_id, $card_id, $boardArea, $boardPlayer );
						}
					} else if ( $getANonJokerMaybe['type'] == 5 ) { // If set is all jokers then function returns one, so play the card
							self::trace("[bmc] Play card onto a set of all jokers.");
							$this->cards->moveCard( $card_id, $boardArea, $boardPlayer, $playWeight);
							
					} else { // It cannot be played there
						self::trace("[bmc] 4104: Not same values for set.");
						throw new BgaUserException( self::_('Cannot play that card on that set.') );
					}
				} else {
					// Made it this far, so play it 
					$LPcardsPlayed = self::getGameStateValue( 'LPcardsPlayed' );
					self::dump("[bmc] LPcardsPlayed:", $LPcardsPlayed );

					$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' );
					self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

					if (( $liverpoolFoundYN == 1 ) && ( $LPcardsPlayed > 0 )){
						throw new BgaUserException( self::_('You can play only 1 card after a Liverpool [3560]') );
					} else {
						self::trace("[bmc] Play card on set.");

						$this->cards->moveCard( $card_id, $boardArea, $boardPlayer, $playWeight);

						self::setGameStateValue( 'LPcardsPlayed', 1 ); // Track # of cards played; Limit to 1 for Liverpool declare
					}
				}

				// And notify of the played card
				$debug_cards = $this->cards->getCardsInLocation("hand");
				//self::dump("[bmc] Cards In Hand:", $debug_cards );

				self::trace("[bmc] Notify of played card (set)");

				if ( $currentCard[ 'type' ] == 5 ) {
					$value_displayed = 'Joker';
					$color_displayed = '';
					$connector = '';
				} else {
					$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
					$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
					$connector = ' of ';
				}

				$cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
				$player_name = self::getActivePlayerName();

				self::notifyAllPlayers( 'cardPlayed',
					$silent ? '' : clienttranslate( '${player_name} Played ${value_displayed} ${connector} ${color_displayed}' ),
					array (
						'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ),
						'card_id' => $card_id,
						'player_id' => $player_id,
						'player_name' => self::getActivePlayerName(),
						'value' => $currentCard ['type_arg'],
						'value_displayed' => $value_displayed,
						'color' => $currentCard ['type'],
						'color_displayed' => $color_displayed,
						'boardArea' => $boardArea,
						'boardPlayer' => $boardPlayer,
						'allHands' => $cardsByLocation,
						'connector' => $connector
					)
				);

			} else {
				self::trace("[bmc] 4164 not same values for set.");
				throw new BgaUserException( self::_('Cannot play that card on that set.') );
			}
		} else if ( $this->checkRun( $cardsInArea, false ) == true ) {
			self::trace("[bmc] Trying to play onto a run (4231).");
			
			// If playing a joker, then just play it
			if ( $card_typeA[0] == 5) {
				self::trace("[bmc] Play the joker.");
				$this->playOnRunAndNotify( $card_id, $boardArea, $boardPlayer, $playWeight, $player_id, $currentCard, true );
				
				self::incStat( 1, 'jokers_number', $player_id ); // Track joker play for stats

			// if there is no joker on the board, then try to play the card
			} else if ( $mightBeJoker == false) {
				self::trace("[bmc] No joker on board, try to play the card.");
				self::dump("[bmc] cardsInArea: ", $cardsInArea);
				
				$potentialNewRun = $cardsInArea;
				
				 // Add card to area cards to try it as a run
				$potentialNewRun[ $currentCard[ 'id' ]] = $currentCard;
				self::dump("[bmc] checking the potential run is still a run.", $potentialNewRun );
				
				if ( $this->checkRun( $potentialNewRun, false ) == true ) {
					self::trace("[bmc] Playing the card onto the run.");
					
					$this->playOnRunAndNotify( $card_id, $boardArea, $boardPlayer, $playWeight, $player_id, $currentCard, true );
				} else {
					self::trace("[bmc] With that card, the cards are not a run.");
					throw new BgaUserException( self::_('Cannot play that card on that run.') );
				}
			} else {
				// Plan to add option to not allow joker swapping (except when going down).
				// Check for that and don't swap if not allowed.
				//if ( $this->getGameStateValue( 'allowJokerSwapping' ) == 1 ) { // 0 == No. 1 == Yes.

				self::trace("[bmc] YES joker on board, try to play the card.");
				// If here, then there's a joker on the board.
				// Try adding card and remove the joker; check if a run, if yes, then swap.
				// Try adding card and check if it's a run, if yes then play it.
				$potentialNewRun = $cardsInArea;
				
				unset( $potentialNewRun[ $mightBeJoker[ 'id' ]]);
				$potentialNewRun[ $currentCard[ 'id' ]] = $currentCard;
				
				try {
					self::trace("[bmc] First try playing without the joker.");
					
					$this->checkRun( $potentialNewRun, false );
					
					// If we get to here then it's a run
					self::trace("[bmc] YES can do swap (try).");

					// Play the card
					$this->playOnRunAndNotify( $card_id, $boardArea, $boardPlayer, $playWeight, $player_id, $currentCard, false );
					
					// Take the joker
					$LPcardsPlayed = self::getGameStateValue( 'LPcardsPlayed' );
					self::dump("[bmc] LPcardsPlayed(try):", $LPcardsPlayed );

					$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
					self::dump("[bmc] liverpoolFoundYN(try):", $liverpoolFoundYN );

					if (( $liverpoolFoundYN == 1 ) && ( $LPcardsPlayed > 0 )){
						throw new BgaUserException( self::_('You cannot swap jokers after a Liverpool.') );
					} else {
						$this->takeTheJoker( $mightBeJoker, $player_id, $card_id, $boardArea, $boardPlayer );
					}					
				} catch ( Exception $e ) {
					self::trace("[bmc] NO, try the new card including the board joker(catch).");

					// Add the card back and try it as a run
					$potentialNewRun[ $mightBeJoker[ 'id' ]] = $mightBeJoker;

					//self::dump("[bmc] Added joker back:", $potentialNewRun );
					self::dump("[bmc] mightbejoker:", $mightBeJoker );

					if ( $this->checkRun( $potentialNewRun, false ) == true ) {
						$this->playOnRunAndNotify( $card_id, $boardArea, $boardPlayer, $playWeight, $player_id, $currentCard, true );
					}
				}
			}
		} else {
			self::trace("[bmc] Not a Set and Not a Run!");
				throw new BgaUserException( self::_("Not a Set and Not a Run (shouldn't happen!)."));
		}

//		$buyers = self::getPlayerBuying();
//		self::dump("[bmc] Buyers Status(playCardFinish):", $buyers);
		self::trace( "[bmc] EXIT playCardFinish" );
		return $mightBeJoker; // 
	}
////
////
////
	function playOnRunAndNotify( $card_id, $boardArea, $boardPlayer, $playWeight, $player_id, $currentCard, $doLPCheck, $silent = false ) {
		//self::trace("[bmc] ENTER playOnRunAndNotify.");
		self::trace("'<span style='color:red'><b>[bmc] ENTER playOnRunAndNotify</b></span>'");
		
		$LPcardsPlayed = self::getGameStateValue( 'LPcardsPlayed' );
		self::dump("[bmc] LPcardsPlayed:", $LPcardsPlayed );

		$liverpoolFoundYN = self::getGameStateValue( 'liverpoolFoundYN' ); // 0 = false; 1 = true
		self::dump("[bmc] liverpoolFoundYN:", $liverpoolFoundYN );

		if (( $liverpoolFoundYN == 1 ) && ( $LPcardsPlayed > 0 ) && $doLPCheck ){
			throw new BgaUserException( self::_('You can play only 1 card after a Liverpool [3725]') );
		} else {

			$playWeight = $this->cards->countCardInLocation( $boardArea ) + 100;
			$this->cards->moveCard( $card_id, $boardArea, $boardPlayer, $playWeight );
			
			if ( $doLPCheck ) {
				self::setGameStateValue( 'LPcardsPlayed', 1 ); // Track # of cards played; Limit to 1 for Liverpool declare
			}
			$cardsByLocationHand  = $this->cards->countCardsByLocationArgs( 'hand' );

			// And notify of the played card
		
			self::trace("[bmc] Notify of played card");

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

			self::notifyAllPlayers( 'cardPlayed',
				$silent ? '' : clienttranslate( '${player_name} Played: ${value_displayed} ${connector} ${color_displayed}'),
				array (
					'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ),
					'card_id' => $card_id,
					'player_id' => $player_id,
					'player_name' => self::getActivePlayerName(),
					'value' => $currentCard ['type_arg'],
					'value_displayed' => $value_displayed,
					'color' => $currentCard ['type'],
					'color_displayed' => $color_displayed,
					'boardArea' => $boardArea,
					'allHands' => $cardsByLocationHand,
					'boardPlayer' => $boardPlayer,
					'connector' => $connector
				)
			);
		}
		self::trace("[bmc] EXIT playOnRunAndNotify.");
	}
////
////
////
	function takeTheJoker( $mightBeJoker, $player_id, $card_id, $boardArea, $boardPlayer ) {
		// self::trace("[bmc] ENTER Take the joker.");
		self::trace("'<span style='color:red'><b>[bmc] ENTER Take the joker.</b></span>'");

		$usedTheJoker = true;
		
		$this->cards->moveCard( $card_id, $boardArea, $boardPlayer );

		self::trace("[bmc] Replace with the card.");
		$this->cards->moveCard($mightBeJoker['id'], 'hand', $player_id);

		// And notify of the joker being 'drawn' from the down area
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		
		self::dump("[bmc] activeTurnPlayer_id:", $activeTurnPlayer_id );
		self::dump("[bmc] mightBeJoker:", $mightBeJoker );
		self::dump("[bmc] player_id:", $player_id );
		self::dump("[bmc] card_id:", $card_id );
		self::dump("[bmc] boardArea:", $boardArea );
		self::dump("[bmc] boardPlayer:", $boardPlayer );
		
		// Jan 19: This boardplayer pmight need to be plyaerid
		
		
		
		$this->drawNotify( $mightBeJoker, $player_id, $boardArea, $boardPlayer, $activeTurnPlayer_id);
//		$this->drawNotify( $mightBeJoker, $player_id, $boardArea, $player_id, $activeTurnPlayer_id);

		// Store the joker and card swapped in case we need to undo
		// self::setGameStateValue( "forJokerCard_id", $card_id );
		// self::setGameStateValue( "forJokerBoardArea", ord(substr( $boardArea, -1) )); // Must store int
		// self::setGameStateValue( "forJokerBoardPlayer", $boardPlayer );
		// self::setGameStateValue( "forJokerTheJoker_id", $mightBeJoker['id'] );
		// self::setGameStateValue( "forJokerPlayerID", $boardPlayer );
//		self::trace("[bmc] EXIT Take the joker.");
		self::trace("'<span style='color:green'><b>[bmc] EXIT Take the joker.</b></span>'");
	}
    /*
    Example:

    // function playCard( $card_id )
    // {
        Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        // self::checkAction( 'playCard' ); 
        
        // $player_id = self::getActivePlayerId();

        // throw new BgaUserException(self::_("Not implemented: ") . "$player_id plays $card_id");
        
        Add your game logic to play a card there 
        // ...
        
        Notify all players about the card played
        // self::notifyAllPlayers( "cardPlayed", self::_( '${player_name} plays ${card_name}' ), array(
            // 'player_id' => $player_id,
            // 'player_name' => self::getActivePlayerName(),
            // 'card_name' => $card_name,
            // 'card_id' => $card_id
        // ) );
          
    // }
    */
    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */
}
