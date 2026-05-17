<?php

trait GoDown {
	public function actPlayerGoDown(
		#[IntArrayParam] array $cardIDGroupA,
		#[IntArrayParam] array $cardIDGroupB,
		#[IntArrayParam] array $cardIDGroupC,
		string $boardCardId,
		string $boardArea,
		string $boardPlayer,
		#[IntArrayParam] array $handItemIds ) {
		
		self::trace("'<span style='color:red'>[bmc] ENTER playerGoDown</span>'");
		//self::trace("[bmc] ENTER playerGoDown");

		self::setGameLength(); // Required or else $this->handTypes is null

		$active_player_id = self::getActivePlayerId();
		self::dump("[bmc] playerGoDown: ", $active_player_id);
		$this->checkAction('actPlayerGoDown');

		// Add restriction to go down with no more than 1 joker (or not)
		$cntCardGroupA = count( $cardIDGroupA );
		$cntCardGroupB = count( $cardIDGroupB );
		$cntCardGroupC = count( $cardIDGroupC );
		$cntCardGroupJ = count( $handItemIds );
		
//		$jokerCount = 0;

		self::dump("[bmc] cardIDGroupA:", $cardIDGroupA);
		self::dump("[bmc] cardIDGroupB:", $cardIDGroupB);
		self::dump("[bmc] cardIDGroupC:", $cardIDGroupC);
		self::dump("[bmc] handItemIds:", $handItemIds);
				
		self::dump("[bmc] cntCardGroupA:", $cntCardGroupA);
		self::dump("[bmc] cntCardGroupB:", $cntCardGroupB);
		self::dump("[bmc] cntCardGroupC:", $cntCardGroupC);
		self::dump("[bmc] cntCardGroupJ:", $cntCardGroupJ);

		$cardGroupA = $this->cards->getCards( $cardIDGroupA );
		$cardGroupB = $this->cards->getCards( $cardIDGroupB );
		$cardGroupC = $this->cards->getCards( $cardIDGroupC );
		
		// Make sure there is > 1 card left in hand
		$countCardsInPlayerHand = intval($this->cards->countCardsByLocationArgs( 'hand' )[$active_player_id]);
		self::dump("CCIPH:", $countCardsInPlayerHand);
		
		//$countCardsToPlay = $cntCardGroupA + $cntCardGroupB + $cntCardGroupC;
		$countCardsToPlay = $cntCardGroupA + $cntCardGroupB + $cntCardGroupC + $cntCardGroupJ;
		//count($cardGroupA) + count($cardGroupB) + count($cardGroupC);
		self::dump("CCTP:", $countCardsToPlay);
		
		$remainingCardCount = abs($countCardsInPlayerHand - $countCardsToPlay);
		self::dump("[bmc] Remaining Cards:", $remainingCardCount);

		if ($remainingCardCount < 1 ) {
			throw new BgaUserException( self::_('You cannot empty your hand.') );
			return;
		}
		
		// Swap out the joker if there is one
		// Get the cards in the selected pile
		// if a hand item and board card are both included then check for the joker/swap check.
		//   Check the selected card to see if it's joker.
		//   If it is, then get the type of area it is (either set or run)

		self::dump( "[bmc] BCI: ", $boardCardId );
		
		$handItems = $this->cards->getCards( $handItemIds );
		$handItems = reset( $handItems ); // Just use the first value in the array
		
		$boardCard = $this->cards->getCard( $boardCardId );

		$currentHandType = $this->getGameStateValue( 'currentHandType' );
		$areaTitle = "Area" . substr( $boardArea, -2 ); // Last 2 should be "_A" or "_B" or "_C"
		
		self::dump("[bmc] BC: ", $boardCard);
		self::dump("[bmc] BA: ", $boardArea);
		self::dump("[bmc] BP: ", $boardPlayer);
		self::dump("[bmc] HI: ", $handItems);
		self::dump("[bmc] CHT:", $currentHandType);
		self::dump("[bmc] AT: ", $areaTitle);
		
		$joker = array ('id' => 'None'); // Start by assuming no joker being swapped
		$targetArea = 'None'; // Start by assuming no target area for the going-down-joker

		if ( empty( $handItems )){
			self::trace( "[bmc] No Joker Swap Needed." );
			//... and then continue to try to go down...

		} else { // Player has prepped a joker swap card. This means try to use joker to go down.

			// Even though they didn't select a board card, see if they prepped for a joker swap.
			// If they did, and if there is 1 joker on the board, then select it for the player.
				
				$cardsInPDA = $this->cards->getCardsInLocation( 'playerDown_A' );
				$cardsInPDB = $this->cards->getCardsInLocation( 'playerDown_B' );
				$cardsInPDC = $this->cards->getCardsInLocation( 'playerDown_C' );
			
				self::dump("[bmc] PDA: ", $cardsInPDA );
				self::dump("[bmc] PDB: ", $cardsInPDB );
				self::dump("[bmc] PDC: ", $cardsInPDC );
				
				$jokersInA = $this->checkForJoker( $cardsInPDA );
				$jokersInB = $this->checkForJoker( $cardsInPDB );
				$jokersInC = $this->checkForJoker( $cardsInPDC );
				
				$countJokersInA = $this->countJokers( $cardsInPDA );
				$countJokersInB = $this->countJokers( $cardsInPDB );
				$countJokersInC = $this->countJokers( $cardsInPDC );
				
				self::dump("[bmc] JinA: ", $countJokersInA );
				self::dump("[bmc] JinB: ", $countJokersInB );
				self::dump("[bmc] JinC: ", $countJokersInC );

				// If there is only 1 joker, try swapping for it
//				if ( $jokersInA || $jokersInB || $jokersInC ){
				if (( $countJokersInA + $countJokersInB + $countJokersInC ) == 1) {
					if ( $jokersInA != null ) {
						$boardCard = $jokersInA;
						$boardArea = $jokersInA[ "location" ];
						$boardPlayer = $jokersInA[ "location_arg" ];
					} else if ( $jokersInB != null ) {
						$boardCard = $jokersInB;
						$boardArea = $jokersInB[ "location" ];
						$boardPlayer = $jokersInB[ "location_arg" ];
					} else {
						$boardCard = $jokersInC;
						$boardArea = $jokersInC[ "location" ];
						$boardPlayer = $jokersInC[ "location_arg" ];
					}
					self::dump("[bmc] game-selected board Joker: ", $boardCard );
				}
		
			$jokerSwapResult = $this->tryJokerSwap( $handItems['id'], $active_player_id, $boardArea, $boardPlayer );
			self::dump('[bmc] jokerSwapResult', $jokerSwapResult);
		
			// Move the new joker into the deficient area

			$targetArea = $this->findDeficientArea( $cardGroupA, $cardGroupB, $cardGroupC );
			self::dump("[bmc] targetArea: ", $targetArea );

			if (( $targetArea == false ) ||
				( $jokerSwapResult == false )) {
				throw new BgaUserException( self::_('Make a partial set (only 2 cards) or run (only 3 cards) for the swapping joker and select one joker to swap.') );
			} else {
				$playerHand = $this->cards->getCardsInLocation( 'hand', $active_player_id );

				$joker = $jokerSwapResult;
				self::dump("[bmc] Played Joker:", $joker);

				// Now we know where to put the joker so add it there and finish going down
				// TODO: Not sure why this isn't needed for a run (or is it???) or it's done in playcardfinish
				$this->cards->moveCard( $joker['id'], 'hand', $active_player_id);
				
				switch ( $targetArea ) {
					case "playerDown_A":
						$cardGroupA[ $joker[ 'id' ]] = $joker;
						$cardGroupA[ $joker[ 'id' ]][ 'location' ] = 'hand';
						$cardGroupA[ $joker[ 'id' ]][ 'location_arg' ] = $active_player_id;
						break;
					case "playerDown_B":
						$cardGroupB[ $joker[ 'id' ]] = $joker;
						$cardGroupB[ $joker[ 'id' ]][ 'location' ] = 'hand';
						$cardGroupB[ $joker[ 'id' ]][ 'location_arg' ] = $active_player_id;
						break;
					case "playerDown_C":
						$cardGroupC[ $joker[ 'id' ]] = $joker;
						$cardGroupC[ $joker[ 'id' ]][ 'location' ] = 'hand';
						$cardGroupC[ $joker[ 'id' ]][ 'location_arg' ] = $active_player_id;
						break;
				}
			}
		}
	
		self::dump("[bmc] cardGroupA:", $cardGroupA );
		self::dump("[bmc] cardGroupB:", $cardGroupB );
		self::dump("[bmc] cardGroupC:", $cardGroupC );
		self::dump("[bmc] joker:", $joker );
		self::dump("[bmc] targetArea:", $targetArea );

		$this->playerGoDownFinish( $cardGroupA, $cardGroupB, $cardGroupC, $joker, $targetArea );
		// self::trace("[bmc] EXIT playerGoDown");
		self::trace("'<span style='color:green'><b>[bmc] EXIT playerGoDown</b></span>'");

	}

////////
////////
////////
	function findDeficientArea ( $cardGroupA, $cardGroupB, $cardGroupC ) {
		self::trace("[bmc] ENTER findDeficientArea");
		self::dump( "[bmc] FDA CGA: ", count( $cardGroupA ));
		self::dump( "[bmc] FDA CGB: ", count( $cardGroupB ));
		self::dump( "[bmc] FDA CGC: ", count( $cardGroupC ));

		if        (( count( $cardGroupA ) == 2 ) ||
			( $this->isShortRun( $cardGroupA ))) {
			$targetArea = 'playerDown_A';
		} else if (( count( $cardGroupB ) == 2 ) ||
				   ( $this->isShortRun( $cardGroupB ))) {
			$targetArea = 'playerDown_B';
		} else if (( count( $cardGroupC ) == 2 ) || 
				   ( $this->isShortRun( $cardGroupC ))) {
			$targetArea = 'playerDown_C';
		} else {
		self::trace("[bmc] EXIT findDeficientArea (false)");
		return false;
		}
		self::dump("[bmc] EXIT findDeficientArea", $targetArea );
		return $targetArea;
	}
////////
////////
////////
	function isShortRun( $cardGroup ) {
//		self::dump( "[bmc] isShortRun: ", $cardGroup );
		$oneValue = 0;
		
		if ( count( $cardGroup ) > 3 ) { // if > 3 then it's not short
			return false;
		} else {
			// Go through each card; Compare 2 non-jokers. If same value then it's
			// trying to be a set. If different values, then it's trying to be a run.
			foreach( $cardGroup as $card ) {
				if( $card['type'] != 5 ) {
					if ( empty( $oneValue )) {
						$oneValue = $card[ 'type_arg' ];
						self::dump( "[bmc] oneValue: ", $oneValue );
					} else if ( $oneValue == $card[ 'type_arg' ] ) {
						self::trace("[bmc] isShortRun false");
						return false;
					} else {
						self::trace("[bmc] isShortRun true");
						return true;
					}
				}
			}
		}
	}
////////
////////
////////
	function playerGoDownFinish( $cardGroupA, $cardGroupB, $cardGroupC, $joker, $targetArea ) {
		self::trace("[bmc] ENTER playerGoDownFinish");
self::dump("[bmc] cardGroupA", $cardGroupA);
self::dump("[bmc] cardGroupB", $cardGroupB);
self::dump("[bmc] cardGroupC", $cardGroupC);
		
		// Verify the number of needed sets and runs is met

		$currentHandType = $this->getGameStateValue( 'currentHandType' );

		self::dump("[bmc] CHT", $currentHandType);

		$setsNeeded = $this->handTypes[ $currentHandType ][ "QtySets" ];
		$runsNeeded = $this->handTypes[ $currentHandType ][ "QtyRuns" ];
		
		self::dump("[bmc] SN", $setsNeeded);
		self::dump("[bmc] RN", $runsNeeded);

		$setsHave = 0;
		$runsHave = 0;
		$eitherHave = 0;
		$notSetRun = 0;

		$groups = array ($cardGroupA, $cardGroupB, $cardGroupC);
		
		self::dump("[bmc] GODOWNFINISH: groups:", $groups);

		foreach ( $groups as $group ) {
//			self::dump("[bmc] group:", $group );
			if ( $this->checkSetOrRun( $group ) == true ) {
				$eitherHave++;
			} else if ( $this->checkSet( $group ) == true ) {
				$setsHave++;
			} else if ( $this->checkRun( $group, true ) == true ) {
				$runsHave++;
			} else {
				if ( count( $group ) > 0 ) {
					$notSetRun++;
				}
			}
		}
		if  ( $notSetRun > 0 ) {
			throw new BgaUserException( self::_('Cannot go down with those cards. Check for sequential values. Did you select a joker from the board?') );
		}

		self::dump("[bmc] setsHave:", $setsHave);
		self::dump("[bmc] runsHave:", $runsHave);
		self::dump("[bmc] eitherHave:", $eitherHave);

		if (( $setsHave + $runsHave + $eitherHave) != ( $setsNeeded + $runsNeeded )) {
			throw new BgaUserException( self::_('Cannot go down. Incorrect number of melds.') );
		}

		if ( $runsHave > $runsNeeded ) {
			throw new BgaUserException( self::_('Cannot go down. Too many Runs and not enough Sets.') );
		} else if ( $setsHave > $setsNeeded ) {
			throw new BgaUserException( self::_('Cannot go down. Too many Sets and not enough Runs.') );
		}

		$active_player_id = self::getActivePlayerId();

		// If all cards besides the board joker are in the hand, then continue

		self::dump("[bmc] joker before checkifreallyinhand:", $joker);

		// $cardGroupAMJoker = $cardGroupA;
		// $cardGroupBMJoker = $cardGroupB;
		// $cardGroupCMJoker = $cardGroupC;
		// unset( $cardGroupAMJoker[ $joker[ 'id' ]]);
		// unset( $cardGroupBMJoker[ $joker[ 'id' ]]);
		// unset( $cardGroupCMJoker[ $joker[ 'id' ]]);

		// self::dump("[bmc] cardGroupAMJoker:", $cardGroupAMJoker);
		// self::dump("[bmc] cardGroupBMJoker:", $cardGroupBMJoker);
		// self::dump("[bmc] cardGroupCMJoker:", $cardGroupCMJoker);

		// list( $card_typeA, $card_type_argA ) = $this->checkIfReallyInHand( $cardGroupAMJoker, $active_player_id );
		// list( $card_typeB, $card_type_argB ) = $this->checkIfReallyInHand( $cardGroupBMJoker, $active_player_id );
		// list( $card_typeC, $card_type_argC ) = $this->checkIfReallyInHand( $cardGroupCMJoker, $active_player_id );
		list( $card_typeA, $card_type_argA ) = $this->checkIfReallyInHand( $cardGroupA, $active_player_id );
		list( $card_typeB, $card_type_argB ) = $this->checkIfReallyInHand( $cardGroupB, $active_player_id );
		list( $card_typeC, $card_type_argC ) = $this->checkIfReallyInHand( $cardGroupC, $active_player_id );

		self::trace("[bmc] Cards are in hand!");
		
		$cardIDGroupA = $this->makeCardIdsFromCards( $cardGroupA );
		$cardIDGroupB = $this->makeCardIdsFromCards( $cardGroupB );
		$cardIDGroupC = $this->makeCardIdsFromCards( $cardGroupC );
		
		// It's all good, they can go down
		
		// Make player assign any 'extra' jokers

		$this->assignExtraJokers( $cardGroupA );
		$this->assignExtraJokers( $cardGroupB );
		$this->assignExtraJokers( $cardGroupC );
		
		// Put the cards into the down area
		$this->cards->moveCards( $cardIDGroupA, 'playerDown_A', $active_player_id );
		$this->cards->moveCards( $cardIDGroupB, 'playerDown_B', $active_player_id );
		$this->cards->moveCards( $cardIDGroupC, 'playerDown_C', $active_player_id );
		//$this->cards->moveCard( $joker[ 'id' ], $targetArea, $active_player_id );
		
		// Keep track of how many jokers the player is using
		// Count number of jokers in cards about to go down
		// For each joker, increment the counter for that PLAYER
		// 08/26/2023
		// self::incStat( 1, 'jokers_number', $player_id );

		$maybeJokersInA = $this->cards->getCards( $cardIDGroupA );
		$maybeJokersInB = $this->cards->getCards( $cardIDGroupB );
		$maybeJokersInC = $this->cards->getCards( $cardIDGroupC );

		$countJokersInA = $this->countJokers( $maybeJokersInA );
		$countJokersInB = $this->countJokers( $maybeJokersInB );
		$countJokersInC = $this->countJokers( $maybeJokersInC );

		self::dump("[bmc] countJokersInA:", $countJokersInA);
		self::dump("[bmc] countJokersInB:", $countJokersInB);
		self::dump("[bmc] countJokersInC:", $countJokersInC);

		self::incStat( $countJokersInA, 'jokers_number', $active_player_id );
		self::incStat( $countJokersInB, 'jokers_number', $active_player_id );
		self::incStat( $countJokersInC, 'jokers_number', $active_player_id );

		// Notify all players about the cards played Area A
		self::notifyAllPlayers('playerGoDown',
			'',
			array(
				'player_name' => self::getActivePlayerName(),
				'player_id' => $active_player_id,
				'card_ids' => $cardIDGroupA,
				'card_type' => $card_typeA,
				'card_type_arg' => $card_type_argA,
				'player_down' => 'playerDown_A_'
			)
		);
		// Notify all players about the cards played Area B
		self::notifyAllPlayers('playerGoDown',
			'',
			array(
				'player_name' => self::getActivePlayerName(),
				'player_id' => $active_player_id,
				'card_ids' => $cardIDGroupB,
				'card_type' => $card_typeB,
				'card_type_arg' => $card_type_argB,
				'player_down' => 'playerDown_B_'
			)
		);
		// Notify all players about the cards played Area C
		self::notifyAllPlayers('playerGoDown',
			'',
			array(
				'player_name' => self::getActivePlayerName(),
				'player_id' => $active_player_id,
				'card_ids' => $cardIDGroupC,
				'card_type' => $card_typeC,
				'card_type_arg' => $card_type_argC,
				'player_down' => 'playerDown_C_'
			)
		);
		
		$cardsByLocation = $this->cards->countCardsByLocationArgs( 'hand' );
		$player_name = self::getActivePlayerName();

		// Notify all players about the cards played
		self::notifyAllPlayers('playerGoDown',
			clienttranslate('${player_name} went down'),
			array(
				'player_name' => self::getActivePlayerName(),
				'player_id' => $active_player_id,
				'joker' => $joker,
				'targetArea' => $targetArea,
				'allHands' => $cardsByLocation
			)
		);
		
		// Clear out the prep areas in the database
		
		$player_id = $active_player_id;

		$sql = "DELETE FROM prepAreas WHERE player_id = '";
		$sql_command = $player_id . "'";
		self::DbQuery( $sql . $sql_command );

		$cpn = self::getActivePlayerName();		
		self::dump( "[bmc] colored player_name", $cpn );

		self::trace("[bmc] GO DOWN DONE!");

		self::dump( "[bmc] gonedown / active_player_id: ", $active_player_id );
		self::setPlayerGoneDown( $active_player_id, 1 /* 0 (not gone down) or 1 (gone down) */ );

		if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) { // 0 == No. 1 == Yes.
			$this->disableWishList( $active_player_id );
		}

		// self::trace("[bmc] EXIT playerGoDownFinish");
		self::trace("'<span style='color:green'><b>[bmc] EXIT playerGoDownFinish</b></span>'");
		
		$this->gamestate->nextState( 'playerGoDown' );

	}
////////
////////
////////
	function assignExtraJokers ( $cardGroup ){
		self::trace("[bmc] ENTER assignExtraJokers");
		self::dump( "[bmc] cardGroup", $cardGroup );
		// If it's a run and it has jokers then ask the player which values to make the jokers
		
		// For now just exit -otherwise it causes an error on the two error lines noted below
		
		return true;
		
		if ( $this->checkRun( $cardGroup, true )) {
			self::trace("[bmc] It's a run");

			if ( $this->checkforJoker( $cardGroup, true )) {
				self::trace("[bmc] It has joker(s)");
				
				// Identify if there are extra jokers
				
				$jokerCount = 0;
				$thereIsAnAce = false;
				$cardValuesHard = array();
				$jokers = array();
				
				$lowestCard = 13;
				$highestCard = 1;
				
				foreach( $cardGroup as $card ){
					// self::dump("[bmc] card: ", $card);
					
					// If a joker then keep track of how many jokers
					// If not a joker then track it as a 'hard' card value
					// Presume ace is low until proven it must be designated as high
					if( $card[ 'type' ] == 5 ) {
						$jokerCount++;
						array_push( $jokers, $card );
						
					} else if( $card[ 'type' ] == 1 ) {
						$thereIsAnAce = true;
						$cardValuesHard[ $card[ "type_arg" ]] = $card[ "type_arg" ];
					} else {
						$cardValuesHard[ $card[ "type_arg" ]] = $card[ "type_arg" ];
						if( $card[ "type_arg" ] < $lowestCard ) {
							$lowestCard = $card[ "type_arg" ];
						}
						if( $card[ "type_arg" ] > $highestCard ) {
							$highestCard = $card[ "type_arg" ];
						}
					}
				}
				self::dump( "[bmc] jokerCount", $jokerCount );
				self::dump( "[bmc] thereIsAnAce", $thereIsAnAce );
				self::dump( "[bmc] lowestCard", $lowestCard );
				self::dump( "[bmc] highestCard", $highestCard );
				self::dump( "[bmc] cardValuesHard", $cardValuesHard );
				
				// Now we know the 'hard' values. Count the gaps. If there are more
				//   jokers than gaps then there are 'extra' jokers.
				
				$firstCard = true;
				$jokerIndex = 0;
				
				for( $position = $lowestCard; $position < 14; $position++ ){
					self::dump( "[bmc] position", $position );
					
					// ignore comparing the first card to any previous
					if( $firstCard ) {
						$firstCard = false;
					} else {
						if( $card[ $position ] ){
							// There's a hard card no need for a joker
							self::dump( "[bmc] hardcard", $card[ $position ] ); // THIS LINE CAUSES ERROR (NULL)
						} else {
							// Assign a joker
							self::dump( "[bmc] assigning a joker", $card[ $position ] ); // THIS LINE CAUSES ERROR (NULL)
							//$jokers[ $jokerIndex ][ 'type_arg' ] = $position;
						}
					}
				}
				
				// Make the player assign any extra jokers
				
			} else {
				self::trace("[bmc] It does not have a joker");
			}
		} else {
			self::trace("[bmc] It's a set");
		}
	}
////////
////////
////////
}
