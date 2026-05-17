<?php

use \Bga\GameFramework\Actions\Types\IntArrayParam;

trait Buying {
	function notifyPlayerWantsToNotBuy( $player_id ) {
		self::dump("[bmc] ENTER notifyPlayerWantsToNotBuy:",  $player_id);
		
		// self::setBuyTimerStatus( $player_id, 0 ); // 0 = Not running. 1 = Running.

		$players = self::loadPlayersBasicInfos();

		$player_name = $players[ $player_id ][ 'player_name' ];

		self::notifyAllPlayers( 'playerWantsToNotBuy',
			clienttranslate( '${player_name} no longer wants to buy' ),
			array(
				'player_id' => $player_id,
				'player_name' => $players[ $player_id ][ 'player_name' ]
			)
		);
		// self::trace("[bmc] EXIT notifyPlayerWantsToNotBuy");
		self::trace("'<span style='color:green'><b>[bmc] EXIT notifyPlayerWantsToNotBuy</b></span>'");
	}
////////
////////
////////
	function notifyPlayerWantsToBuy( $player_id ) {
		self::dump("[bmc] ENTER notifyPlayerWantsToBuy:",  $player_id);
		$players = self::loadPlayersBasicInfos();
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		self::dump("[bmc] ATPI", $activeTurnPlayer_id );
		$currentCard = $this->cards->getCardOnTop( 'discardPile' );
		self::dump( "[bmc] cardToBeBought[id]:",  $currentCard['id'] );
		
		if ( $currentCard != null ) {
			if ( $currentCard[ 'type' ] == 5 ) {
				$value_displayed = 'Joker';
				$color_displayed = '';
				$connector = '';
			} else {
				$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
				$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
				$connector = ' of ';
			}

			// if ( $currentCard[ 'type' ] == 5 ) {
				// $value_displayed = self::_(' joker');
				// $color_displayed = '';
			// } else {
				// $value_displayed = self::_('the ') . self::_($this->values_label[ $currentCard[ 'type_arg' ]]) . self::_(' of ');
				// $color_displayed = self::_($this->colors[ $currentCard[ 'type' ]][ 'name' ] . 's.');
			// }
			
			$player_name = $players[ $player_id ][ 'player_name' ];

			self::notifyAllPlayers(
				'playerWantsToBuy',
				clienttranslate( '${player_name} Wants to Buy: ${value_displayed} ${connector} ${color_displayed}'),
				array(
					'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ),
					'player_id' => $player_id,
					'activeTurnPlayer_id' => $activeTurnPlayer_id,
					'player_name' => $players[ $player_id ][ 'player_name' ],
					'cardToBeBought' => $currentCard,
					'value_displayed' => $value_displayed,
					'color_displayed' => $color_displayed,
					'connector' => $connector
				)
			);
		} else {
			self::trace("[bmc] Yikes! No card was found to buy!");
		}
		self::trace("[bmc] EXIT notifyPlayerWantsToBuy");
	}
////////
////////
////////
/*	function notifyPlayerWantsToBuy_orig( $player_id ) {
		self::trace("[bmc] ENTER notifyPlayerBuy-WANT");
		self::dump("[bmc] player_id:",  $player_id);

		$players = self::loadPlayersBasicInfos();
		$activeTurnPlayer_id = $this->getGameStateValue( 'activeTurnPlayer_id' );
		self::dump("[bmc] ATPI", $activeTurnPlayer_id );

//TODO: MOVE THIS TO LATER, after the notif 
		self::setPlayerBuying( $player_id, 2 );
		// self::setPlayerBuyingGS( $player_id, 2 );

		$drawSourceValue = self::getGameStateValue( 'drawSourceValue' );
		self::dump("[bmc] drawSourceValue(notifyPlayerWantsToBuy):", $drawSourceValue );

//		if ( $drawSourceValue != 1 ) { // if !=1 then it's ok to try to buy
self::trace("[bmc] Deadlock:2174");

			$currentCard = $this->cards->getCardOnTop( 'discardPile' );
self::trace("[bmc] Deadlock:2177");
			self::dump( "[bmc] cardToBeBought:",  $currentCard );
self::trace("[bmc] Deadlock:2179");
			
			if ( $currentCard != null ) {
				
				if ( $currentCard[ 'type' ] == 5 ) {
					$value_displayed = 'Joker';
					$color_displayed = '';
					$connector = '';
				} else {
					$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
					$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
					$connector = ' of ';
				}

				$player_name = $players[ $player_id ][ 'player_name' ];

				self::notifyAllPlayers( 'playerWantsToBuy',
					clienttranslate('${player_name} Wants to Buy: ${value_displayed} ${connector} ${color_displayed}'),
					array(
					'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ),
						'player_id' => $player_id,
						'activeTurnPlayer_id' => $activeTurnPlayer_id,
						'player_name' => $players[ $player_id ][ 'player_name' ],
						'cardToBeBought' => $currentCard,
						'value_displayed' => $value_displayed,
						'color_displayed' => $color_displayed,
						'connector' => $connector
					)
				);
			} else {
				self::trace("[bmc] Yikes! No card was found to buy!");
			}
//		}
		self::trace("[bmc] EXIT notifyPlayerBuy-WANT");
	}
*/
////////
////////
////////
	function resolveBuyers() {
		self::trace( "[bmc] ENTER resolveBuyers:" );
		
		// Retrieve the buying status gathered during this player's turn
		
		$this->checkEmptyDeck(); // Make sure the deck has cards

		// If source is deck or discard then resolve appropriately.
		// If not either of those then stay in this state since we're swapping a joker

		$drawSourceValue = self::getGameStateValue( 'drawSourceValue' );

		// self::dump("[bmc] drawSourceValue:", $drawSourceValue ); // 0 = deck, 1 = discard
		
		// Clear the variable for the next player, because this discard has been handled
		self::setGameStateValue( 'drawSourceValue', 2 );
		
		// $buyCount = self::getPlayersBuyCount();
		// self::dump("[bmc] buyCount:", $buyCount );

		$someoneIsBuying = false;
		
		$buyers = self::getPlayerBuying();
		// $buyers = self::getPlayerBuyingGS();

		// self::dump("[bmc] buyers(resolveBuyers):", $buyers);

		$players = self::loadPlayersBasicInfos();

		$buyingPlayers = [];
		
		foreach( $buyers as $player_id => $buyChoice ) {
			// self::dump("bmc] player_id: ", $player_id);
			// self::dump("bmc] buyChoice: ", $buyChoice);
			
			if ( $buyChoice == 2 ) { // 0=Not decided, 1=Not buying, 2=Buying
				$someoneIsBuying = $player_id ; // Id doesn't matter, just not false
				$buyingPlayers[] = $players[ $player_id ][ 'player_id' ];
				}
		}
		// self::dump("[bmc] someoneIsBuying: ", $someoneIsBuying);
		// self::dump("[bmc] buyingPlayers: ", $buyingPlayers);

		// drawSource Sources:
		// 0 == 'deck' (buyer gets it + 1 down card; Increment buy counter)
		// 1 == 'discardPile' (buyer gets nothing)
		// 2 == Other sources (other conditions like playing a card for a joker)
	
		if ( $drawSourceValue == 0 ) {
			self::trace( "[bmc] TurnPlayer drew from deck, so a buy will go through if it exists.");
			
			if ( $someoneIsBuying != false ) {
				
				$playerOrder = self::getNextPlayerTable();

				// self::dump( "[bmc] playerOrder: ", $playerOrder );

				// Find the right buyer - start with the player after the active player
				$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		
				// self::dump( "[bmc] activeTurnPlayer_id(resolveBuyers):", $activeTurnPlayer_id );
				// self::dump( "[bmc] findSTART:", $playerOrder[ $activeTurnPlayer_id ] );
		
				$buyer_id = $this->findBuyer( $buyingPlayers, $playerOrder[ $activeTurnPlayer_id ] );
				
				self::setGameStateValue( 'theBuyer', $buyer_id );
				
				// self::dump( "[bmc] buyer_id Function Return:", $buyer_id );

				// If there is a buyer then move the cards and notify everyone
				
				if ( $buyer_id != null ) {
					self::decPlayerBuyCount( $buyer_id );

					self::incStat( 1, 'buys_number', $buyer_id );

					self::setGameStateValue( 'findBuyerFailsafe', 0 );

					$this->clearBuyers();
					//self::clearPlayersBuying();

					$buyCount = self::getPlayersBuyCount();

					// self::dump("bmc] 5063: ", $buyCount);

					//Move the cards for the buyer (the turnPlayer will get their cards in drawCard)
					
					// Notify of the deck card (i.e. the price to pay for the discarded card)
					$currentCard = $this->cards->getCardOnTop( 'deck' );
					// self::dump("bmc] Card from deck: ", $currentCard);
					$this->cards->moveCard( $currentCard[ 'id' ], 'hand', $buyer_id );
				
					$this->drawNotify( $currentCard, $buyer_id, 'deck', $buyer_id, $buyer_id );

					// Notify of the discarded card (notify the buyer of the details, not the current turn player
					$currentCard = $this->cards->getCardOnTop( 'discardPile' );
					// self::dump("bmc] Card Bought: ", $currentCard);
					$this->cards->moveCard( $currentCard[ 'id' ], 'hand', $buyer_id );
					
					$this->drawNotify( $currentCard, $buyer_id, 'discardPile', $buyer_id, $buyer_id );
					
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

					$players = self::loadPlayersBasicInfos();
					
					$player_name = $players[ $buyer_id ][ 'player_name' ];
					
					self::notifyAllPlayers( 'playerBought',
						clienttranslate( '${player_name} Bought: ${value_displayed} ${connector} ${color_displayed}' ),
						array (
							'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ), 
							'color_displayed' => $color_displayed,
							'value_displayed' => $value_displayed,
							'player_id' => $buyer_id,
							'buyCount' => $buyCount,
							'player_name' => $players[ $buyer_id ][ 'player_name' ],
							'allHands' => $cardsByLocation,
							'connector' => $connector
						)
					);

					// This is usually fired from JS, but need to give the player an entry in their log that the wishlist is disabled
					
					if ( $this->getGameStateValue( 'enableWishList' ) == 1 ) { // 0 == No. 1 == Yes.
						$this->disableWishList( $buyer_id );	 
					}
				}
			} else {
				// There is no buyer
				self::trace( "[bmc] No buyer for that card.");
				self::setGameStateValue( 'theBuyer', 0 );
			}
			self::setGameStateValue( 'findBuyerFailsafe', 0 );

		} else if ( $drawSourceValue == 1 ) {
			self::trace( "[bmc] TurnPlayer drew from discard, so buy will NOT go through.");
			
			// Set players buy status to NOT BUY
			$players = self::loadPlayersBasicInfos();
			
			foreach ( $players as $player_id => $player ) {
				self::setPlayerBuying( $player_id, 1 ); // 0=unknown, 1=Not buy, 2=buy
				// self::setPlayerBuyingGS( $player_id, 1 );
			}

			$players = self::loadPlayersBasicInfos();

			foreach ( $buyingPlayers as  $pid ) {
				if ( $someoneIsBuying != false ) {
					self::notifyAllPlayers( 'playerDidNotBuy',
						clienttranslate( '${buyingPlayerName} tried but could not buy' ),
						array (
							'buyingPlayers' => $buyingPlayers,
							'buyingPlayerName' => $players[ $pid ][ 'player_name' ]
						)
					);
				}
			}
		} else {
			self::trace( "[bmc] Resolve Buyers Other path. drawSourceValue was 2" );
		}
		self::trace( "[bmc] EXIT (truly) ResolveBuyers:" );
	}
/////
/////
/////
	function stShowBUYButtons() {
		self::trace( "[bmc] ENTER stShowBUYButtons:" );
		
		// Check the real state
		$state = $this->gamestate->state();
		//self::dump("[bmc] state:", $state);
		
		$this->gamestate->setAllPlayersMultiactive();
		
		// Find the previous player (who discarded) make them not active.
		
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		
		$discardingPlayer_id = $this->getPlayerBefore( $activeTurnPlayer_id );
		
		// self::dump("[bmc] activeTurnPlayer_id(stShowBUYButtons):", $activeTurnPlayer_id );
		// self::dump("[bmc] discardingPlayer_id:", $discardingPlayer_id );

		// If the dealer cannot buy the card, then uncomment this. If they are OK to buy then comment it out.
//		$this->gamestate->setPlayerNonMultiactive( $discardingPlayer_id, 'discardCard' );

		//$this->clearBuyers();

		// TODO: Might have to allow for dealer to buy here in the first deal:
		self::setPlayerBuying(   $activeTurnPlayer_id, 1 ) ; // 1 = not buying, they can get it for free
		// self::setPlayerBuyingGS( $activeTurnPlayer_id, 1 );

		$skipFirstDeal = self::getGameStateValue( 'skipFirstDeal' );
		
		if ( $skipFirstDeal == 0 ) {  // 0 is false. 1 is true. It seems to want integers.
			self::setPlayerBuying(   $discardingPlayer_id, 1 ) ; // 1 = not buying, they just discarded it
			// self::setPlayerBuyingGS( $discardingPlayer_id, 1 );
			
			// Discarding player is no longer active
			$this->gamestate->setPlayerNonMultiactive( $discardingPlayer_id, '' );
		
		} else {
			self::setGameStateValue( 'skipFirstDeal' , 0 ); // 0 is false. 1 is true. It seems to want integers.
		}
		
		$APL = $this->gamestate->getActivePlayerList();
		// self::dump( "[bmc] APL(stShowBUYButtons):", $APL);
		//exit(0);
		
		// Set the # of cards in deck and discard pile into game states instead of having buyers hit the database, to avoid deadlock

		$countDeck = count( $this->cards->countCardsByLocationArgs( 'deck' ) );
		$countDiscardPile = count ($this->cards->countCardsByLocationArgs( 'discardPile' ) );

		self::setGameStateValue( 'countDeck', $countDeck );
		self::setGameStateValue( 'countDiscardPile', $countDiscardPile );

		self::trace( "[bmc] EXIT stShowBUYButtons:" );
	}
/////
/////
/////
//	function notBuyRequest( $player_id ) { 
	#[CheckAction(false)]
	public function actNotBuyRequest() { 
		$player_id = $this->getCurrentPlayerId(); // CURRENT!!! not active
		self::dump("[bmc] ENTER ActNotBuyRequest:", $player_id );
		self::setPlayerBuying( $player_id, 1 ); // (0==unknown, 1==Not buying 2==Buying)
		// self::setPlayerBuyingGS( $player_id, 1 ); // (0==unknown, 1==Not buying 2==Buying)
		$this->notifyPlayerWantsToNotBuy( $player_id );
		self::trace("[bmc] EXIT ActNotBuyRequest" );
	}
/////
/////
/////
//	function submitWishList( $player_id, $wishList_type, $wishList_type_arg ) {
	#[CheckAction(false)]
	public function actSubmitWishList( int $player_id, #[IntArrayParam] array $wishList_type, #[IntArrayParam] array $wishList_type_arg ) {
		self::trace("[bmc] ENTER submitWishList");
		self::dump("[bmc] wishList_type:", $wishList_type);
		self::dump("[bmc] wishList_type_arg:", $wishList_type_arg);

		// Check if really a player or a spectator
		$players = self::loadPlayersBasicInfos();
        $playerIDList = [];

		foreach ( $players as $playerIDOnly ) {
			$playerIDList[] = $playerIDOnly[ "player_id" ];
		}

		// self::dump("[bmc] player_id:", $player_id);
		// self::dump("[bmc] players from submitWishList:", $playerIDList);
		// self::dump("[bmc] in_array:", in_array( $player_id, $playerIDList));

		if ( in_array( $player_id, $playerIDList )) {
			// Delete all entries for the wishList for that player
			
			$sql = "DELETE FROM wishList WHERE player_id = '";
			$sql_command = $player_id . "'";
			self::DbQuery( $sql . $sql_command );

			$wishList = [];
			
			$index = 0;
			
			$numberOfBuys =  self::getGameStateValue( 'numberOfBuys' );

			if ( $numberOfBuys != 1 ) { // 0 == 3; 1 == Infinite buys
				$sql = "SELECT player_id, buy_count FROM player ";
				$buy_count = self::getCollectionFromDB( $sql, true );

				self::dump("[bmc] buy_count[ player_id ] (buyRequestFinish): ", $buy_count );
				
				if ( $buy_count[ $player_id ] < 1 ) {
					throw new BgaUserException( self::_("All your wishes for this hand have already come true!") );
					self::trace( "[bmc] BGA Exception: Cannot buy any more(buyRequestFinish)" );

				}
			} // If it > 0 then keep processing the buy
		
			// $testPlayerHandArray[3] = array(
				// 14 => array(
					// 'type' => '3', // Suit
					// 'type_arg' => '13' // Value
					// )
				// );

			foreach( $wishList_type as $wlt ){
				$wishList[] = array(
					'type' => $wishList_type[ $index ],
					'type_arg' => $wishList_type_arg[ $index ] );
				$index++;
			}

	//		$wishList = array_combine( $wishList_type, $wishList_type_arg );

			self::dump("[bmc] wishList_total:", $wishList);

			foreach( $wishList as $wl ) {
				self::dump("[bmc] wishList type:", $wl['type']);
				self::dump("[bmc] wishList type_arg:", $wl['type_arg']);

				$sql = "INSERT INTO wishList (player_id, card_type, card_type_arg) VALUES ";
				$sql_command = "( " . $player_id . "," . $wl['type'] . "," . $wl['type_arg'] . " )";
				
				self::DbQuery( $sql . $sql_command );
			}

			$this->notifyPlayer(
				$player_id,
				"wishListSubmitted",
				clienttranslate( 'Your wish list was received and is active.' ),
				array (
					'player_id' => $player_id
				)
			); 
		}
		self::trace("[bmc] EXIT submitWishList");
	}
////
////
////
//	function savePrep( $player_id, $area_A_Items, $area_B_Items, $area_C_Items, $area_J_Items ) {
	#[CheckAction(false)]
	public function actSavePrep( int $player_id, #[IntArrayParam] array $area_A_Items, #[IntArrayParam] array $area_B_Items, #[IntArrayParam] array $area_C_Items, #[IntArrayParam] array $area_J_Items ) {
		
		self::trace("[bmc] ENTER savePrep");
		self::dump("[bmc] player_id:", $player_id);
		self::dump("[bmc] areaA:", $area_A_Items );
		self::dump("[bmc] areaB:", $area_B_Items );
		self::dump("[bmc] areaC:", $area_C_Items );
		self::dump("[bmc] areaJ:", $area_J_Items );

		$sql = "DELETE FROM prepAreas WHERE player_id = '";
		$sql_command = $player_id . "'";
		self::DbQuery( $sql . $sql_command );

		$sql = "INSERT INTO prepAreas (player_id, areaA, areaB, areaC, areaJ) VALUES ";
		$sql_command = "( " . $player_id . ", '" . 
			implode( ",", $area_A_Items ) . "', '" . 
			implode( ",", $area_B_Items ) . "', '" . 
			implode( ",", $area_C_Items ) . "', '" . 
			implode( ",", $area_J_Items ) . "' )";

		self::dump( "[bmc] sql:", $sql . $sql_command );

		self::DbQuery( $sql . $sql_command );

		self::notifyPlayer(
			$player_id,
			'savePrepDone',
			clienttranslate("Your prep areas were saved"),
			array(
				'player_id' => $player_id,
			)
		);
		self::trace("[bmc] EXIT savePrep");

	}
////
////
////
	// function loadPrep( $player_id ) {
	#[CheckAction(false)]
	public function actLoadPrep( int $player_id ) {
		self::trace("[bmc] ENTER loadPrep");
		self::dump("[bmc] player_id:", $player_id);
	
		$sql = "SELECT areaA areaA, areaB areaB, areaC areaC, areaJ areaJ FROM prepAreas WHERE player_id = '";
		$sql_command = $player_id . "'";
		
		self::dump( "[bmc] sql:", $sql . $sql_command );

		$prepListAll = self::getCollectionFromDb( $sql . $sql_command );

		self::dump( "[bmc] prepListAll:", $prepListAll );
		self::dump( "[bmc] prepListFirst:", reset( $prepListAll ));
		
		$allLoaded = true; // Start with true. Set false if one is skipped
			
		if ( reset( $prepListAll )) { // If there is something in the prep areas process it
			
			self::dump( "[bmc] prepListA:", reset( $prepListAll )[ 'areaA' ]);
			self::dump( "[bmc] prepListB:", reset( $prepListAll )[ 'areaB' ]);
			self::dump( "[bmc] prepListC:", reset( $prepListAll )[ 'areaC' ]);
			self::dump( "[bmc] prepListJ:", reset( $prepListAll )[ 'areaJ' ]);

			$prepAreaAItems = explode( ",", reset( $prepListAll )[ 'areaA' ]);
			$prepAreaBItems = explode( ",", reset( $prepListAll )[ 'areaB' ]);
			$prepAreaCItems = explode( ",", reset( $prepListAll )[ 'areaC' ]);
			$prepAreaJItems = explode( ",", reset( $prepListAll )[ 'areaJ' ]);

			self::dump( "[bmc] A:", $prepAreaAItems );
			self::dump( "[bmc] B:", $prepAreaBItems );
			self::dump( "[bmc] C:", $prepAreaCItems );
			self::dump( "[bmc] J:", $prepAreaJItems );
			
			$cardsInHandNow = $this->cards->getCardsInLocation( 'hand', $player_id );
			
			$IDsInHandNow = array();
			
			self::dump( "[bmc] cardsInHandNow:", $cardsInHandNow );
			
			$prepAreaAItemsReal = array();
			$prepAreaBItemsReal = array();
			$prepAreaCItemsReal = array();
			$prepAreaJItemsReal = array();
			
			foreach ( $cardsInHandNow as $card ){
				$IDsInHandNow[] = $card[ 'id' ];
			}
			
			self::dump( "[bmc] IDsInHandNow:", $IDsInHandNow );
			
			foreach ( $prepAreaAItems as $id ){
				self::dump( "[bmc] Aid:", $id );
				
				if ( strlen( $id ) > 0) {
					if ( in_array( $id, $IDsInHandNow )){
						self::dump( "[bmc] FoundidinA:", $id );
						$prepAreaAItemsReal[] = $id;
						
					} else {
						$allLoaded = false;
					}
				}
			}
			
			foreach ( $prepAreaBItems as $id ){
				self::dump( "[bmc] Bid:", $id );
				
				if ( strlen( $id ) > 0) {
					if ( in_array( $id, $IDsInHandNow )){
						self::dump( "[bmc] FoundidinB:", $id );
						$prepAreaBItemsReal[] = $id;
						
					} else {
						$allLoaded = false;
					}
				}
			}
			
			foreach ( $prepAreaCItems as $id ){
				self::dump( "[bmc] Cid:", $id );
				
				if ( strlen( $id ) > 0) {
					if ( in_array( $id, $IDsInHandNow )){
						self::dump( "[bmc] FoundidinC:", $id );
						$prepAreaCItemsReal[] = $id;
						
					} else {
						$allLoaded = false;
					}
				}
			}
			
			foreach ( $prepAreaJItems as $id ){
				self::dump( "[bmc] Jid:", $id );
				
				if ( strlen( $id ) > 0) {
					if ( in_array( $id, $IDsInHandNow )){
						self::dump( "[bmc] FoundidinJ:", $id );
						$prepAreaJItemsReal[] = $id;
						
					} else {
						$allLoaded = false;
					}
				}
			}

			self::dump( "[bmc] RealA:", $prepAreaAItemsReal );
			self::dump( "[bmc] RealB:", $prepAreaBItemsReal );
			self::dump( "[bmc] RealC:", $prepAreaCItemsReal );
			self::dump( "[bmc] RealJ:", $prepAreaJItemsReal );
			
			// getColorValueFromId doesn't get the right colors and values:
			
			list( $card_idsA, $card_typeA, $card_type_argA ) = $this->getColorValueFromId( $prepAreaAItemsReal );
			list( $card_idsB, $card_typeB, $card_type_argB ) = $this->getColorValueFromId( $prepAreaBItemsReal );
			list( $card_idsC, $card_typeC, $card_type_argC ) = $this->getColorValueFromId( $prepAreaCItemsReal );
			list( $card_idsJ, $card_typeJ, $card_type_argJ ) = $this->getColorValueFromId( $prepAreaJItemsReal );

			self::dump( "[bmc] Aids:",          $card_idsA );
			self::dump( "[bmc] Atype:",        $card_typeA );
			self::dump( "[bmc] Atypearg:", $card_type_argA );

			self::dump( "[bmc] Bids:",          $card_idsB );
			self::dump( "[bmc] Btype:",        $card_typeB );
			self::dump( "[bmc] Btypearg:", $card_type_argB );

			self::dump( "[bmc] Cids:",          $card_idsC );
			self::dump( "[bmc] Ctype:",        $card_typeC );
			self::dump( "[bmc] Ctypearg:", $card_type_argC );

			self::dump( "[bmc] Jids:",          $card_idsJ );
			self::dump( "[bmc] Jtype:",        $card_typeJ );
			self::dump( "[bmc] Jtypearg:", $card_type_argJ );
		} else {
			$card_idsA	     = '';
			$card_typeA	     = '';
			$card_type_argA	 = '';
			$card_idsB	     = '';
			$card_typeB	     = '';
			$card_type_argB	 = '';
			$card_idsC	     = '';
			$card_typeC	     = '';
			$card_type_argC	 = '';
			$card_idsJ	     = '';
			$card_typeJ	     = '';
			$card_type_argJ	 = '';
		}

		self::notifyPlayer(
			$player_id,
			'loadPrepDone',
			clienttranslate("Your prep areas were loaded in"),
			array(
				'player_id'      => $player_id,
				'card_idsA'      => $card_idsA,
				'card_typeA'     => $card_typeA,
				'card_type_argA' => $card_type_argA,
				'card_idsB'      => $card_idsB,
				'card_typeB'     => $card_typeB,
				'card_type_argB' => $card_type_argB,
				'card_idsC'      => $card_idsC,
				'card_typeC'     => $card_typeC,
				'card_type_argC' => $card_type_argC,
				'card_idsJ'      => $card_idsJ,
				'card_typeJ'     => $card_typeJ,
				'card_type_argJ' => $card_type_argJ
			)
		);

		self::dump("[bmc] allLoaded:", $allLoaded );

		if ( $allLoaded != true ) {
			self::notifyPlayer(
				$player_id,
				'loadPrepInfo',
				clienttranslate("Not all cards were loaded because they are no longer in your hand."),
				array()
			);
		}
		self::trace("[bmc] EXIT loadPrep");
	}
	
	function buyRequestFinish( $player_id ) {
		self::trace("[bmc] ENTER buyRequestFinish");
		self::dump("[bmc] player_id:", $player_id);
				
		// If there aren't enough cards, don't allow it
		$countDeck = self::getGameStateValue( 'countDeck' );
		$countDiscardPile = self::getGameStateValue( 'countDiscardPile' );

		$checkIfBuyingAllowed = $this->getGameStateValue( 'isBuyingAllowed' );
		self::dump("[bmc] CHECKBUYINGALLOWED", $checkIfBuyingAllowed ); // 0 == false; 1 == true
		
		if ( $checkIfBuyingAllowed == 0 ) { // 0 == false; 1 == true
			self::trace("[bmc] CHECKBUYINGALLOWEDYIELDEDNOTTRUE" );
			throw new BgaUserException( self::_("That card cannot be bought.") );
		}

		if (( $countDeck + $countDiscardPile ) < 2 ) {
			throw new BgaUserException( self::_('There are not enough down cards for you to buy.') );
		}
	
		// Check if it's the player's turn, so no need to buy (TODO: Or buy it for free???)
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );
		self::dump("[bmc] activeTurnPlayer_id:(buyRequestFinish)", $activeTurnPlayer_id);
		
		$currentPlayerId = self::getCurrentPlayerId();
		self::dump("[bmc] currentPlayerId:", $currentPlayerId);
		
		$nextPlayer = $this->getPlayerAfter( $currentPlayerId ); 
		self::dump("[bmc] nextPlayer1:", $nextPlayer);

		// if ( $player_id == $nextPlayer ) {
		if ( $player_id == $activeTurnPlayer_id ) {
			self::dump("[bmc] It's your turn so no need to buy:",  $player_id);
			
			self::trace("[bmc] Sending notif for itsYourTurn");
			self::notifyPlayer(
				$player_id,
				'itsYourTurn',
				clienttranslate("It's your turn. You don't need to buy it."),
				array()
			);
		
		// Might be a good buy, so continue trying to process it; Ignore if it's the player who discarded
		} else if ( $player_id != $activeTurnPlayer_id ) {

			self::trace("[bmc] Registering the buy request");

			$numberOfBuys =  self::getGameStateValue( 'numberOfBuys' );

			if ( $numberOfBuys != 1 ) { // 0 == 3 buys allowed; 1 == Infinite buys
				$sql = "SELECT player_id, buy_count FROM player ";
				$buy_count = self::getCollectionFromDB( $sql, true );

				self::dump("[bmc] buy_count[ player_id ] (buyRequestFinish): ", $buy_count );
				
				if ( $buy_count[ $player_id ] < 1 ) {
					throw new BgaUserException( self::_("You cannot buy any more this hand.") );
					self::trace( "[bmc] BGA Exception: Cannot buy any more(buyRequestFinish)" );
				}
			} // If it > 0 then keep processing the buy

			// 9/17/2023 Up to here looks good
			
			self::setPlayerBuying( $player_id, 2 ); // (0==unknown, 1==Not buying 2==Buying)
			// self::setPlayerBuyingGS( $player_id, 2 ); // (0==unknown, 1==Not buying 2==Buying)

			self::dump("[bmc] ENTER notifyPlayerWantsToBuy(embedded):",  $player_id);
			$players = self::loadPlayersBasicInfos();

			$currentCard = $this->cards->getCardOnTop( 'discardPile' );
			
			if ( $currentCard != null ) {
				self::dump( "[bmc] cardToBeBought[id]:",  $currentCard['id'] );

				// if ( $currentCard[ 'type' ] == 5 ) {
					// $value_displayed = self::_(' a joker');
					// $color_displayed = '!';
				// } else {
					// $value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
					// $color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
				// }

				if ( $currentCard[ 'type' ] == 5 ) {
					$value_displayed = 'Joker';
					$color_displayed = '';
					$connector = '';
				} else {
					$value_displayed = $this->values_label[ $currentCard[ 'type_arg' ]];
					$color_displayed = $this->colors[ $currentCard[ 'type' ]][ 'name' ];
					$connector = ' of ';
				}
				
				$player_name = $players[ $player_id ][ 'player_name' ];
						
				self::notifyAllPlayers( 'playerWantsToBuy',
					clienttranslate( '${player_name} Wants to Buy: ${value_displayed} ${connector} ${color_displayed}'),
					array(
						'i18n' => array( 'color_displayed', 'value_displayed', 'connector' ), 
						'player_id' => $player_id,
						'activeTurnPlayer_id' => $activeTurnPlayer_id,
						'player_name' => $players[ $player_id ][ 'player_name' ],
						'cardToBeBought' => $currentCard,
						'value_displayed' => $value_displayed,
						'color_displayed' => $color_displayed,
						'connector' => $connector
					)
				);				
			} else {
				self::trace("[bmc] Yikes! No card was found to buy!");
			}
		} // Else the discarder tried to buy so just ignore
		self::trace("[bmc] EXIT buyRequestFinish");
	}
////
////
////
//	function actLiverpoolButton( $player_id ) { // From JS
	#[CheckAction(false)]
	function disableWishList( $player_id ) { // from PHP
		self::trace("[bmc] ENTER disableWishList");
		$this->actDisableWishList( $player_id );
		self::trace("[bmc] EXIT disableWishList");
	}
////
////
////
	#[CheckAction(false)]
	public function actDisableWishList( int $player_id ) { // from JS
		self::trace("[bmc] ENTER actDisableWishList");
		
	    $sql = "DELETE FROM wishList WHERE player_id = '";
		$sql_command = $player_id . "'";
		self::DbQuery( $sql . $sql_command );

		self::notifyPlayer(
			$player_id,
			'wishListDisabled',
			clienttranslate("Your wish list is now disabled"),
			array(
				'player_id' => $player_id,
			)
		);
		self::trace("[bmc] EXIT actDisableWishList");
	}
////
////
////
//	function buyRequest() { // This is from JS
	#[CheckAction(false)]
	public function actBuyRequest() { // This is from JS
		self::trace("[bmc] ENTER actbuyRequest_fromJS");
		$player_id = $this->getCurrentPlayerId(); // CURRENT!!! not active
		self::dump("[bmc] player_id:", $player_id);	
		$this->buyRequestFinish( $player_id );
		self::trace("[bmc] EXIT actBuyRequest_fromJS");
	}
////
////
////
	function buyRequest_fromPHP ( $player_id ) { // This is needed for the wishlist to buy
		self::trace("[bmc] ENTER buyRequest_fromPHP");
		$this->buyRequestFinish( $player_id );
		self::trace("[bmc] EXIT buyRequest_fromPHP");
	}
////
////
////
	function findBuyer( $buyingPlayers, $fromPlayer ) {
		self::trace("[bmc] ENTER findBuyer");
		
		// Failsafe for too many recursive entries
		
		self::incGameStateValue( 'findBuyerFailsafe', 1 );
		$FBFailsafe = self::getGameStateValue( 'findBuyerFailsafe' );
		self::dump("[bmc] FBFailsafe", $FBFailsafe);

		if ( $FBFailsafe > 16 ) { // TODO: Adjust this to number of players
			throw new BgaUserException( self::_("FBFailsafe. Yikes!") );
		}
		
		if ( empty( $buyingPlayers )) {
			return false; // No buyers, so return false. Otherwise return the buying player
		}
		
		$activeTurnPlayer_id = self::getGameStateValue( 'activeTurnPlayer_id' );

		// self::dump( "[bmc] activeTurnPlayer_id: ", $activeTurnPlayer_id );
		// self::dump( "[bmc] fromPlayer: ", $fromPlayer );
		// self::dump( "[bmc] buyingPlayers: ", $buyingPlayers );

		// If it has wrapped to us, end the search
		if ( $fromPlayer == $activeTurnPlayer_id ) {
			return;
		} else {
			
			$playerOrder = self::getNextPlayerTable();

			if ( in_array( $fromPlayer, $buyingPlayers )) {
				self::dump("[bmc] FOUND First Buyer!", $fromPlayer);
				return $fromPlayer;
			} else {
				self::dump("[bmc] Buyer is not ", $fromPlayer );
				return $this->findBuyer( $buyingPlayers, $playerOrder[ $fromPlayer ]);
			}
		}
		self::trace("[bmc] EXIT findBuyer");
	}
////
////
////	
	function clearBuyers() {
		self::trace("[bmc] ENTER clearBuyers.");
		$players = self::loadPlayersBasicInfos();
		foreach ( $players as $player_id => $player) {
			// Every discard clear the buyers (0==unknown, 1==Not buying 2==Buying)
			self::setPlayerBuying( $player_id, 0 );
		}
		self::trace("[bmc] EXIT clearBuyers.");
	}
////
////
////
	function processWishlist(){
		self::trace( "[bmc] ENTER processWishlist" );
		// First fully process out the wishlist requests before changing activeplayer
		
		$sql = "SELECT id id, player_id, card_type, card_type_arg FROM wishList ";

		$wishLists = self::getCollectionFromDb( $sql );

		// $discardingPlayer_id = $this->getPlayerBefore( $this->getActivePlayerId());
		// $next_player_id = $this->getPlayerBefore( $discardingPlayer_id );
		$discardingPlayer_id = $this->getActivePlayerId();
		$next_player_id = $discardingPlayer_id;
		
		
		// discardingPlayer_id is not right here (12/3/2023):
		
		// self::dump("[bmc] discardingPlayer_id (processWishlist):",  $discardingPlayer_id );
		// self::dump("[bmc] next_player_id (processWishlist):",  $next_player_id );

		//$dpCard = $this->cards->getCardsInLocation( 'discardPile' );
		$dpCard = $this->cards->getCardOnTop( 'discardPile' );
		// self::dump("[bmc] 5863 dpCard:",  $dpCard );

		if ( isset( $dpCard[ 'id' ])) {

			//self::dump("[bmc] dpCard:", $dpCard[ 'id' ]);

			//$currentCard = $this->cards->getCard( $dpCard[ 'id' ] );

			//self::dump("[bmc] currentCardInDP:", $currentCard);
			
			$discardColor = $dpCard[ 'type' ];
			$discardValue = $dpCard[ 'type_arg' ];
			
			foreach( $wishLists as $entry ) {
				// self::dump("[bmc] wishList entry:", $entry);
				// self::dump("[bmc] wishList SQL:", $entry['player_id']);
				
				if (( $entry[ 'player_id' ] != $discardingPlayer_id ) &&
					( $entry[ 'player_id' ] != $next_player_id )) {
						
					if (( $entry[ 'card_type' ] == $discardColor ) &&
						( $entry[ 'card_type_arg' ] == $discardValue )) {
						
						// self::trace("[bmc] BUY MATCH!");
						// Call buyRequest with the player id
						
						$this->buyRequest_fromPHP( $entry[ 'player_id' ]);
					}
				}
			}
		}
		self::trace( "[bmc] EXIT processWishlist" );
	}
////
////
////
}
