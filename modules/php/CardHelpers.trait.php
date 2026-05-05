<?php

trait CardHelpers {
	protected function searchForCard($array, $search_list) {
  
		// Create the result array
		//$result = array();
		$result = "";
		//self::dump( "[bmc] search_list : ", $search_list );
	  
		// Iterate over each array element
		foreach ($array as $key => $value) {
			// echo 'key: ' . $key . '<br>';
			// echo 'value/rollNo: ' . $value['rollNo'] . '<br>';
			// echo 'value/name: ' . $value['name'] . '<br>';
			// echo 'value/section: ' . $value['section'] . '<br>';
			// echo 'value/id: ' . $value['id'] . '<br>';
			// echo 'value/type: ' . $value['type'] . '<br>';
			// echo 'value/type_arg: ' . $value['type_arg'] . '<br>';
		   // self::dump( "[bmc] Looking at id      : ", $value['id'] );
//		    self::dump( "[bmc] Looking at type    : ", $value['type'] );
		    // self::dump( "[bmc] Looking at type_arg: ", $value['type_arg'] );
			
			// Iterate over each search condition
			foreach ($search_list as $k => $v) {
				// echo 'kkkkkkkkkkkkkkkkkkkkkkkk : ' . $k . '<br>';
				// echo 'vvvvvvvvvvvvvvvvvvvvvvvv : ' . $v . '<br>';
				//echo 'vvvvvvvvvvvvvvvvv/name   : ' . $v['name'] . '<br>';
				//echo 'vvvvvvvvvvvvvvvvv/section: ' . $v['section'] . '<br>';
				// self::dump( "[bmc] Looking FOR type    : ", $v['type'] );
				// self::dump( "[bmc] Looking FOR type_arg: ", $v['type_arg'] );
				// self::dump( "[bmc] Looking FOR k : ", $k );
				// self::dump( "[bmc] Looking FOR v: ", $v );
				// self::dump( "[bmc] Looking FOR value: ", $value );
				if( isset( $value[$k] )) {
					//self::dump( "[bmc] Looking FOR value[k]: ", $value[$k] );
				}
				// If the array element does not meet
				// the search condition then continue
				// to the next element
				if (!isset($value[$k]) || $value[$k] != $v)
				{
					// self::trace("[bmc] !!NOT!!");
					// echo '.................................not the one above! ' . '<br>';
					// Skip two loops
					continue 2;
				} else {
					// self::trace("[bmc] !!FOUND PART KEEP LOOKING!!");
					// echo 'FOUND PART, KEEP LOOKING! ' . '<br>';
				}
			}
		  
			// Append array element's key to the result array
			//$result[] = $value;
			// echo '!!FOUND ONE-name!! ' . $value['name'] . '<br>';
			// echo '!!FOUND ONE-card!! ' . $value['id'] . '<br>';
		    //self::dump( "[bmc] FOUND ONE-card!! id: ", $value['id'] );
			return $value;
			//break; // Break out of the outer foreach since a card was found
		}
	  
		return $result; // Empty if nothing found
	}

	function checkSetOrRun ( $cardGroup ) {
		self::trace("[bmc] ENTER checkSetOrRun");
		
		// If true, it means the cardGroup will evaluate true as a set or a run. So the
		//   cards are both a set and a run.

// start new code
		if ( $this->checkSet( $cardGroup )) {
			if ( $this->checkRun( $cardGroup, true )) {
				return true;
			} else {
				return false;
			}
// end new code

		} else {
			return false;
		}
	}
////////
////////
////////
	function checkIfReallyInHand( $cards, $player_id ) {
		$card_type = array();
		$card_type_arg = array();
		foreach( $cards as $card ) {
			self::dump("[bmc] CheckInHand: ", $card);
			
			if( $card['location'] != 'hand' || $card['location_arg'] != $player_id ) {
				throw new BgaUserException( self::_('You cannot play a card that is not in your hand.') );
			} else {
				//self::trace("[bmc] Card is really in hand!");
				array_push($card_type, $card['type']);
				array_push($card_type_arg, $card['type_arg']);
			}
		}
		return array($card_type, $card_type_arg);
	}
////////
////////
////////
	function getColorValueFromId( $ids ) {
		self::dump("[bmc] ENTER getColorValue IDs: ", $ids);
		// self::dump("[bmc] ENTER count: ", count( $ids ));
		// self::dump("[bmc] ENTER [0]: ",   $ids[0]);
		// self::dump("[bmc] ENTER count(reset): ", count( reset($ids)));
		
		
		foreach ( $ids as $id ){
			self::dump("[bmc] ENTER GET A CARDw/ID: ", $id);
			self::dump("[bmc] ENTER GET A CARD: ", $this->cards->getCard( $id ));
		}
		
		if ( count( $ids ) > 0 ){
			self::trace(" ids not empty " );

			$cards = $this->cards->getCards( $ids );
			self::dump("[bmc] cards: ", $cards);
			
			$card_type = array();
			$card_type_arg = array();
			$card_id = array();
			
			foreach( $cards as $key => $card ) {
				self::dump("[bmc] getColorValue: ", $card );
				self::dump("[bmc] key: ", $key );
				
				$card = $this->cards->getCard( $card['id'] );
				self::dump("[bmc] card: ", $card['id']);
				self::dump("[bmc] type: ", $card['type']);
				self::dump("[bmc] type_arg: ", $card['type_arg']);
				
				array_push( $card_type,     $card[ 'type' ]);
				array_push( $card_type_arg, $card[ 'type_arg' ]);
				array_push( $card_id, 	   $key ); // Track the IDs also since these seem to get out of order

			}
			return array( $card_id, $card_type, $card_type_arg );
		} else {
			// self::trace(" ids empty ");
		}
	}
////////
////////
////////
	function checkContains( $needle, $cards ) {
		$areaCardValues = array();

		foreach( $cards as $card ) {
//			self::dump("[bmc] cardInCards :", $card );
			if ( count( $card ) != 0 ) {
				if ( $card[ 'type' ] == 5 ) { // If joker then ignore it
				} else { // If not joker then add the value to the array
					$areaCardValues[] = $card[ 'type_arg' ];
				}
			}
		}
		self::dump("[bmc] areaCardValues: ", $areaCardValues );
		
		$cardPresent = in_array( $needle[ 'type_arg' ], $areaCardValues );
		self::dump("[bmc] cardPresent: ", $cardPresent );
		
		return $cardPresent;
	}
////////
////////
////////
	function checkRun( $cards, $silent ) {
		self::dump("[bmc] ENTER checkRun: ", $silent);
		// A run is 4 or more cards of the same suit with sequential values or
		//   3 cards plus 1 joker. A234 and JQKA are both valid.
		
		// It's not a run if:
		//   It has <3 cards
		//   The non-jokers have non-unique values
		//   The non-jokers have >1 suit
		//   Values are not consecutive when considering jokers
		
		// Set return value to true so if it makes it out, it returns true. But if 
		//   is silently finds it's not a run, return false.
		$crReturnValue = true;
		
		// self::trace("[bmc] ENTER checkRun");
		
		// self::dump("[bmc] checkRun cards: ", $cards);
		
		$cardCount = count( $cards );
		// self::dump("[bmc] cardCount: ", $cardCount);

		if ( $cardCount < 4) {
			// self::trace("[bmc] checkRun FALSE (not enough cards)");
			return false;
		}

		$jokerCount = $this->countJokers( $cards );

		$nonJokers = array();
		
		// Check if all non jokers are different values
		foreach ( $cards as $card ) {
			if ( $card[ 'type' ] != 5 ) {
				$nonJokers[] = $card[ 'type_arg' ];
			}
		}
		// self::dump("[bmc] nonJokers: ", $nonJokers );
		// self::dump("[bmc] Jokers: ", $jokerCount );
		
		$countValues = array_count_values( $nonJokers );

		// self::dump("[bmc] countValues: ", $countValues );
		// self::dump("[bmc] array_sum(countValues): ", array_sum( $countValues ));

		foreach ( $countValues as $type => $qty ) {
			// self::dump("[bmc] type:", $type );
			// self::dump("[bmc] qty:", $qty );
			
			if ( $qty > 1 ) {
				// If there are 14 cards and 2 aces then allow it
				if (( $cardCount == 14 ) &&
				    ( $type == 1 ) && 
					( $countValues[ 1 ] == 2 )) {
				} else {
					$crReturnValue = false;
					if ( !$silent ) {
						throw new BgaUserException( self::_("Not a run. Run cards must be sequential and unique.") );
					}
				}
			}
		}
//		$valueCount = $this->countNonJokerValues( $cards ) + $jokerCount;
		$valueCount = array_sum( $countValues ) + $jokerCount;

		// self::dump("[bmc] valueCount: ", $valueCount );
		
		if ( $cardCount != $valueCount ) {
			// self::dump("[bmc] ThrowingException for NOT A RUN!: ", $cardCount );
			$crReturnValue = false;

			if ( !$silent ) {
				throw new BgaUserException( self::_("Not a run. Run cards must be unique.") );
			}
		} else {
			// self::trace("[bmc] Number of cards is correct for a run.");
		}

		// 05/09 07:17:17 [notice] [T502009]
		
		// If there is an ace, also create a '14' because ace can be high or low
		
		$aceLowCards  = $this->array_clone( $cards );
		$aceHighCards = $this->array_clone( $cards );
		
		
		// $aceLowCards = $cards; // PHP makes a completely new copy of an array, but it changes the indices
		// $aceHighCards = $cards; // PHP makes a completely new copy of an array, but it changes the indices
		
		
		
		
		
		// $keys = array('foo', 5, 10, 'bar');
		// $a = array_fill_keys($keys, 'banana');
		// print_r($a);
		
		
		
// This getArrayCopy() throws an error:

// My goal is to copy the original card array and include the indices. As it is,
// PHP copies the array but the indices all change to be in order, 0,1,2,3,4...
		
		// $cardsArrayObject = new ArrayObject($aceHighCards);
		// $aceHighCardsGAC = $cardsArrayObject->getArracyCopy();

		//self::dump("[bmc] New cards (aceHighCards):", $aceHighCards);
		//self::dump("[bmc] New cards before (aceHighCards):", $aceHighCards);
		
		$index = 0;
		
		foreach ( $cards as $card ) {
			// self::dump("[bmc] card: ", $card );
			
//			if ( $card[ 'type_arg' ] == 1 ) {
			if (( $card[ 'type_arg' ] == 1 ) &&
			    ( $card[ 'type' ] != 5 )) { // If there is an one (aka Ace) and it's not a joker
				
				// Get the index of the ace
				
				$aceKey = $card[ 'id' ];
				// self::dump("[bmc] aceKey: ", $aceKey);
				// self::dump("[bmc] index: ", $index);
				// self::dump("[bmc] aceHighCards[index]: ", $aceHighCards[$index]);
				//self::dump("[bmc] aceHighCards[index]: ", $aceHighCards[$aceKey]);

//				Here need to set index [3] to change the ace to high, not low. Now it adds a card.

//				Server syntax error:
//Parse error: syntax error, unexpected '{' in /var/tournoi/release/games/liverpoolrummy/999999-9999/liverpoolrummy.game.php on line 3147
				
				
				// $aceHighCards[ $index ] = {

				// $aceHighCards[ $index ] = [
				$aceHighCards[ $aceKey ] = [
					'id'           => $card['id'],
					'type'         => $card['type'],
					'type_arg'     => "14", // Ace is considered 14
					'location'     => $card['location'],
					'location_arg' => $card['location_arg']
				];
			}
			$index++;
		}
		
		// self::dump("[bmc] New cards (cards):", $cards);
		//self::dump("[bmc] New cards (aceLowCards):", $aceLowCards);
		//self::dump("[bmc] New cards (aceHighCards):", $aceHighCards);

		$tryAceLow  = $this->checkRunWithAce( $aceLowCards );
		$tryAceHigh = $this->checkRunWithAce( $aceHighCards );
		
		// self::dump("[bmc] Check Run 0/1 aceLowCards",  $tryAceLow );
		// self::dump("[bmc] Check Run 0/1 aceHighCards", $tryAceHigh );
		
		if (( $tryAceLow == 0 ) or ( $tryAceHigh == 0 )){ // 0 == true
			// This is good, one of them is a run, so just fall through with default==yes
			// self::trace("[bmc] One of the combinations with the ace is a run, allow it.");
		} else {
			// Maybe not, so check other conditions
			$aceCheckResult = $tryAceLow + $tryAceHigh ;

			// self::dump("[bmc] Check Run aceHighCards", $aceCheckResult );
			
			switch ( $aceCheckResult ) {
				case 0:
				case 1:
					break; // With ace high or low, one is a run and all the same suit; Use default 'true'
				case 2:
					$crReturnValue = false;
					if ( !$silent ) {
						throw new BgaUserException( self::_("Not a run. It doesn't reach!") );
					}
					break;
				case 10:
				case 11:
				case 20:
					$crReturnValue = false;
					if ( !$silent ) {
						throw new BgaUserException( self::_('Not a run. Run cards must all be the same suit.') );
					}
					break;
				default :
					$crReturnValue = false;
					if ( !$silent ) {
						throw new BgaUserException( self::_("Ace Check error (should never happen).") );
					}
					break;
			}
		}

		// self::dump("[bmc] checkRun cards: ", $cards );
		
		self::trace("[bmc] EXIT checkRun. Might be true or false.");
		return $crReturnValue; // Made it through, so the cards are a run
	}
////
////
////
	function checkRunWithAce ( $cards ) {
		// Check all the same suit and that the jokers bridge the gaps
		$cardType = 0;
		$cardValueMax = 0;  // Track the larget and smallest in the group
		$cardValueMin = 20; // Track the larget and smallest in the group
		// $jokerCount = 0; // Count the jokers to know if the cards all reach
		//
		// Don't need to count jokers since we're looking at min, max and card count

		//self::dump("[bmc] checkRunWithAce: cards", $cards );

		foreach ( $cards as $card ) {
			if ( $card['type'] == "5") {
				// Ignore Joker (type == 5)
				// $jokerCount += 1;
			} else {
				if ($card['type_arg'] > $cardValueMax) { // Find the largest card value
					$cardValueMax = $card['type_arg'];
				}
				
				if ($card['type_arg'] < $cardValueMin) { // Find the smallest card value
					$cardValueMin = $card['type_arg'];
				}

		// self::dump("[bmc] Max", $cardValueMax);
		// self::dump("[bmc] Min", $cardValueMin);
				if ( $cardType == 0 ) {
					// Get the suit of the first card which is not a joker
					$cardType = $card['type'];
					// self::dump("[bmc] cardType:", $cardType);
				} else {
					// self::dump("[bmc] card: ", $card);
					if ( $card['type'] != $cardType ) {
						// self::trace("[bmc] checkRun FALSE (different suits)");
						//throw new BgaUserException( self::_('Run cards must all be the same suit.') );

						return 10;
					}
				}
			}
		}
		// Made it through, so the cards are all the same suit
		// Check if they are close enough together
		$cardCount = count( $cards );
		// self::dump("[bmc] cardCount:", $cardCount );
		// self::dump("[bmc] Max:", $cardValueMax );
		// self::dump("[bmc] Min:", $cardValueMin );
		// self::dump("[bmc] jokerCount:", $jokerCount );

		if ( $cardValueMax - $cardValueMin + 1  <= $cardCount ) {
			// self::trace("[bmc] checkRun TRUE");
			return 0; // 0 == true, because later we add them together

		} else {
			// self::trace("[bmc] checkRun FALSE (Doesn't reach)");

			return 1; // 1 = false, because later we add them together
		}
	}
////
////
////
	function array_clone($array) {
		return array_map(function($element) {
			return ((is_array($element))
				? $this->array_clone($element)
				: ((is_object($element))
					? clone $element
					: $element
				)
			);
		}, $array);
	}
////
////
////
	function countJokers( $cards ) {
		//self::dump("[bmc] ENTER countJokers: ", $cards);
		$jokerCount = 0; // Count the jokers
		foreach ( $cards as $card ) {
			if ( $card['type'] == "5") {
				$jokerCount += 1;
			}
		}
		return $jokerCount;
	}
////
////
////
	function countNonJokerValues( $cards ) {
		//self::dump("[bmc] ENTER countNonJokerValues: ", $cards );
		$nonJokerCount = 0; // Count the unique values of the nonJokers
		$cardValues = [];
		
		foreach ( $cards as $card ) {
			if ( $card[ 'type' ] != "5") {
				if ( !in_array( $card[ 'type_arg' ], $cardValues )) {
				$cardValues[] = $card[ 'type_arg' ];
				}
			}
		}
		$numberOfValues = count( $cardValues );
		
		self::dump("[bmc] ENTER cardValues: ", $cardValues);
		self::dump("[bmc] ENTER numberOfValues: ", $numberOfValues);
		
		return $numberOfValues;
	}
////
////
////
	// function checkForJokerIsOneCard( $card ) {
		// self::dump("[bmc] ENTER check for joker in card: ", $card);
		// if ( $card['type'] == "5") {
			// self::dump("[bmc] EXIT checkforJoker with 1 card", $card);
			// return $card;
		// }
		// self::trace("[bmc] EXIT check for joker is one card (none found)");
		// return false;
	// }
////
////
////
	function checkForJoker( $cards ) {
		self::dump("[bmc] ENTER check for joker in cards: ", $cards);

		foreach ( $cards as $card ) {
			if ( $card['type'] == "5") {
				self::trace("[bmc] Joker found");
				self::dump("[bmc] EXIT checkforJoker", $card);
				return $card;
			}
		}
		self::trace("[bmc] EXIT check for joker in cards (none found)");
		return false;
	}
////
////
////
	function checkSet( $cards ) {
		self::trace("[bmc] ENTER checkSet");
		// A set is 3 or more cards of the same number or
		//   2 cards of the same value plus 1 joker.
		//self::dump("[bmc] checkSet Cards: ", $cards);
		
		if ( count( $cards ) < 3) {
			self::trace("[bmc] EXIT checkSet: FALSE. Not enough cards.");
			return false;
		}
		
		$cardValue = 0;
		
		foreach( $cards as $card ) {
			if ($cardValue == 0 ) {
				// Get the value of the first card which is not a joker
				if ( $card['type'] == "5") {
					// Ignore Joker (type == 5)
					//self::trace("[bmc] checkSet: Found Joker before others.");
				} else {
					$cardValue = $card['type_arg'];
					//self::dump("[bmc] cardValue:", $cardValue);
				}
			} else {
//				self::dump("[bmc] card: ", $card);
				if ( $card['type'] == "5") {
					// Ignore Joker (type == 5)
					//self::trace("[bmc] checkSet: Found Joker after another.");
				} else if ($card['type_arg'] != $cardValue) {
					self::trace("[bmc] EXIT checkSet: FALSE. Values not the same.");
					return false;
				}
			}
		}
		self::trace("[bmc] EXIT checkSet: TRUE");
		return true; // Made it through, so they are the same
	}
////
////
////
//	function playCard( $card_id, $player_id, $boardArea, $boardPlayer ) {
    function makeCardIdsFromCards( $cards ) {
		
		$cardIds = [];
		foreach ( $cards as $card ) {
			$cardIds[] = $card['id'];
		}
		// self::dump("[bmc] cardId:", $cardIds );
		return $cardIds;
	}
////
////
////
}
