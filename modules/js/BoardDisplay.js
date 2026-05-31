// LiverpoolRummy BoardDisplay Mixin
var LRBoardDisplay = {
		sortBoard : function( ) {
console.log( "[bmc] ENTER sortBoard" );
			for ( var player in this.gamedatas.players ) {
// console.log("SORTBOARD player");
// console.log(player);
				cards = this.downArea_A_[ player ].getAllItems();
// console.log(cards);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_A', player );
// console.log("[bmc] NEWRUN_board_a" );
// console.log( weightChange );
					this.downArea_A_[ player ].items = weightChange;
					this.downArea_A_[ player ].updateDisplay();
					// this.downArea_A_[ player ].changeItemsWeight( weightChange );
				}

				cards = this.downArea_B_[ player ].getAllItems();
// console.log("[bmc] BOSS CARDS");
// console.log(cards);
// console.log(this.downArea_B_[ player ]);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_B', player );
// console.log( weightChange );
// console.log("[bmc] NEWRUN_board_b" );
// console.log( weightChange );
					this.downArea_B_[ player ].items = weightChange;
					this.downArea_B_[ player ].updateDisplay();
//					this.downArea_B_[ player ].changeItemsWeight( weightChange );
				}
				
				cards = this.downArea_C_[ player ].getAllItems();
// console.log(cards);
//				if ( cards != null ) {
				if ( cards.length != 0 ) {
					weightChange = this.sortRun( cards, 'playerDown_C', player );
// console.log("[bmc] NEWRUN_board_c" );
// console.log( weightChange );
					this.downArea_C_[ player ].items = weightChange;
					this.downArea_C_[ player ].updateDisplay();
//					this.downArea_C_[ player ].changeItemsWeight( weightChange );
				}
			}
			//this.updateCardsDisplay();

console.log( "[bmc] EXIT sortBoard" );
		},
/////////
/////////
/////////
		addJokerBorder : function( jokers ){
console.log("[bmc] Enter addJokerBorder");
// console.log( jokers );

			// for ( joker of jokers ) {

// console.log("[bmc] REALLY Add GREEN BORDER1");
// console.log(joker);
// console.log($(joker));

			// return;

				// if ( $(joker) != null ) {
					// dojo.addClass( joker, 'stockitem_extraJoker' );
					// if ( $(joker).classList.contains( "stockitem_selected" )) {
						// if ( $(joker).classList.contains( "blink" )) {
							// dojo.removeClass( joker, "blink" );
						// } else {
							// dojo.addClass( joker, "blink" );
						// }
					// }
				// }
			// }

console.log("[bmc] Exit addJokerBorder");
		},
/////////
/////////
/////////
		removeJokerBorder : function( jokers ){
console.log("[bmc] Enter removeJokerBorder");
// console.log( jokers );

			for ( joker of jokers ) {

// console.log("[bmc] REALLY Removing GREEN BORDER1");
// console.log(joker);
// console.log($(joker));

				if ( $(joker) != null ) {
					dojo.removeClass( joker, 'stockitem_extraJoker' );
				}
			}

console.log("[bmc] Exit removeJokerBorder");
		},
/////////
/////////
/////////
		sortRun : function( boardCards ) {
console.log( "[bmc] ENTER sortRunNew" );

/*
Dec 27 2024
todo: CAn return early but if 2089 is returned then nothing is drawn on the board. Then not sure how to go down (cannot play joker onto a meld.

It worked when the board sort was there. Maybe becuase then the variabl is not empty?!?!
*/
console.log( this.gamedatas.runsNeeded );
			if ( this.gamedatas.runsNeeded == 0 ) {
console.log( "[bmc] No runs needed, return." );
				return boardCards;
			}
// console.log( boardCards );

			if ( boardCards.length != 0 ) {
				var cards = new Array();

				var foundAnAce = false;
				
				// Reconstruct the card values from the type
				for ( cidx in boardCards ) {
// console.log("[bmc] In The Loop");
// console.log(cidx);
// console.log(boardCards[ cidx ]);
					cards[ cidx ] = {};
					
// console.log(boardCards[ cidx ][ 'type' ] );
					if (( boardCards[ cidx ][ 'type' ] == 52 ) || 
					    ( boardCards[ cidx ][ 'type' ] == 53 )) {
// console.log("[bmc] Yes card is a Joker");
						cards[ cidx ][ 'value' ] = 0; // Arbitrarily choosing value 0 for joker
						cards[ cidx ][ 'type' ]  = 0;
					} else if ((boardCards[ cidx ][ 'type' ] % 13 ) == 0 ) {
						if ( foundAnAce == false ){
							foundAnAce = true;
// console.log("Found first ace");
							cards[ cidx ][ 'value' ] = 1; // Set ace to low for first one found, it still might be high
							cards[ cidx ][ 'type' ]  = 1;
						} else {
// console.log("Found second ace");
							cards[ cidx ][ 'value' ] = 14; // Set ace to high for second one found
							cards[ cidx ][ 'type' ]  = 14;
						}
					} else {
// console.log("[bmc] Card is not a Joker");
						cards[ cidx ][ 'value' ] = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
						cards[ cidx ][ 'type' ]  = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
					}
					cards[ cidx ][ 'id' ] = boardCards[ cidx ][ 'id' ];
				}
	
				cards.sort( this.compareValue );

// console.log("[bmc] Sorted boardcards:");
// console.log(cards);
				// Count number of jokers and aces and track their IDs to set weights later
				
				var jokerCount = 0;
				var jokers = new Array();
				var thereIsAnAce = false;
				var aceCount = 0;
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] == 0 ) {
							jokers[ jokerCount ] = {
								"id" : cards[ i ][ 'id' ],
								"type" : 0 };	 // Start jokers at value 0
							jokerCount++;
					}
					if (( cards[ i ][ 'type' ] == 1 ) ||
					    ( cards[ i ][ 'type' ] == 14 )) {
						thereIsAnAce = true;
						aceCount++;
					}
				}
console.log("[bmc] jokers:");
console.log(jokers);
console.log(jokerCount);
console.log(thereIsAnAce);
console.log(aceCount);
				var cardValuesHard = new Array();
				
				for ( let i in cards ) {
					if (( cards[ i ][ 'type' ] != 0 ) &&  // Jokers here are type 0
					    ( cards[ i ][ 'type' ] != 1 )){   // Ignore aces for now
						cardValuesHard[ cards[ i ][ 'type' ]] = cards[ i ][ 'type' ];
					}
				}
console.log("[bmc] cardValuesHard");
console.log(cardValuesHard);
				var usedPositions = new Array(); // Temporary variable to track positions in the run while assigning jokers
				
				var jokerIndex = 0;
				var foundFirst = false;
				
				// Reindex cards with the IDs as the indices
				
				// Go through positions 1 through King and track 'real' cards if they exist
				for ( let i = 2; i < 14 ; i++) {
console.log( i );
console.log(cardValuesHard[ i ]);
console.log(foundFirst);
					if ( cardValuesHard[ i ] != null ) {
console.log("Location notNull:  (cards)");
console.log( i );
console.log( cards );
						foundFirst = true;
						index = cards.map( function(e) { return e.type; }).indexOf( i );
console.log("FOUND THE FIRST HARD CARD (index, value)");
console.log(index);
console.log(i);
						cards[ index ][ 'boardLieIndex' ] = i;
						usedPositions.push(i);
					} else {
console.log("card location is Null");
console.log( i );
						if ( foundFirst ) {
console.log("foundFirst");
console.log(cardValuesHard.length);
console.log("Nov2023cards");
console.log(cards);



							// if this is the last of the hard cards then ignore
							// Deal with the aces later
							// This presumes the cards which are down are indeed a valid run
							
console.log("[bmc] Assigning Joker!");
console.log(i);
							// if ( i < cardValuesHard.length + 1 ) {
							if ( i < cardValuesHard.length ) {
console.log(jokerIndex);
console.log(jokerCount);
								if ( jokerIndex < jokerCount ) {

									index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
console.log("[bmc] Assigning joker index");
console.log(index);
									jokerIndex++;

									cards[ index ][ 'boardLieIndex' ] = i;

									usedPositions.push(i);
console.log(usedPositions);
								} else {
console.log("[bmc] ERROR Not enough Jokers!");
//  Presume the other function did it's job and allowed only true runs.
								}
							} else {
console.log("[bmc] FINISHED HARD CARDS do not put high ace, yet");
							}
console.log("[bmc] FINISHED HARD CARDS");
						}
					}
console.log("[bmc] Spot near end of first loop");
				}

// All holes have been filled with jokers. Now figure out where to put the jokers (depends on ace and distance).

				leftOverJokers = jokerCount - jokerIndex;
				
console.log("[bmc] Assess remaining jokers");
console.log( jokerCount);
console.log( jokerIndex );
console.log( leftOverJokers );
console.log( jokers );
console.log( cards );
console.log( usedPositions );
console.log( aceCount );
				
// Put an ace as index 1 if any of these is true:
  // There are 2 aces
  // There are 14 cards
  // There are 13 cards and no joker
  // 12 cards and index 13 is empty
  // N cards and N+1 is empty
// else ace is index high
    
// If only 1 ace, determine if it's high or low, then assign remaining jokers

				var minUsed = Math.min.apply( Math, usedPositions );
				var maxUsed = Math.max.apply( Math, usedPositions );
console.log( minUsed );
console.log( maxUsed );

				if ( !isFinite( minUsed )){
					minUsed = 0;
				}
				if ( !isFinite( maxUsed )){
					maxUsed = 0;
				}

console.log( minUsed );
console.log( maxUsed );

				switch( aceCount ) {
					case 0 : // No need to assign aces, just place the jokers properly
console.log("[bmc] No aces.");

// 2024/12/27: This next if and for loop is causing the hung browser, because minUsed and/or maxUsed was Infinity:

						if ( leftOverJokers > 0 ) { // Start by assigning some below the lowest hard number
							for ( let i = minUsed - 1; i > 0; i-- ){
console.log( i );
								
								if ( jokerIndex < jokerCount ) {
									index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
console.log( index );
									cards[ index ][ 'boardLieIndex' ] = i;
									usedPositions.push(i);
									jokerIndex++;
								}
							}
							leftOverJokers = jokerCount - jokerIndex;
							
							if ( leftOverJokers > 0 ) { // If there are still some jokers then put them high
								// Put extra jokers on the right unless there is a High Ace
								for ( let i = jokerIndex; i < jokerCount; i++ ) {
									cards[ i ][ 'boardLieIndex' ] = 15;
									usedPositions.push(i);
								}
							}
						}
						break;
					case 1 : // There is 1 ace. Put the ace low if min is closer to 1 and high if max is closer to 14
console.log("[bmc] One ace.");
						if (( minUsed - 1) < ( 14 - maxUsed )){
							// Put ace low
							index = cards.map( function(e) {return e.type; }).indexOf(1);
console.log( index );
							if ( index > -1 ) {
								cards[ index ][ 'boardLieIndex' ] = 1;
								usedPositions.push( 1 );
							} else {
								console.log("[bmc] ASSERT DID NOT FIND LOW ACE");
							}
						 
							// Now assign jokers below the lowest hard number
						 
							if ( leftOverJokers > 0 ) {
	// console.log( minUsed );
// 2024/12/27: This next if and for loop should be checked to not go infinite:

								for ( let i = minUsed - 1; i > 1; i-- ){ // Don't assign to ace
									if ( jokerIndex < jokerCount ) {
										index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
	// console.log( index );
										cards[ index ][ 'boardLieIndex' ] = i;
										usedPositions.push(i);
										jokerIndex++;
									}
								}
								
								leftOverJokers = jokerCount - jokerIndex;
								// If there are still some jokers then put them high
								 
								if ( leftOverJokers > 0 ) {
									// Put extra jokers on the right but less than the ace
									for ( let i = jokerIndex; i < jokerCount; i++ ) {
										cards[ i ][ 'boardLieIndex' ] = 13.5;
										usedPositions.push(i);
									}
								}
							}
						} else {
							// Put ace high
							index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log( index );
							if ( index > -1 ) {
								cards[ index ][ 'boardLieIndex' ] = 14;
								usedPositions.push( 14 );
							} else {
								console.log("[bmc] ASSERT DID NOT FIND HIGH ACE");
							}
							// Now assign jokers above the highest hard number
						 
							if ( leftOverJokers > 0 ) {
	// console.log( minUsed );
								for ( let i = maxUsed + 1; i < 14; i++ ){ // Don't assign to ace
									if ( jokerIndex < jokerCount ) {
										index = cards.map( function(e) { return e.id; }).indexOf( jokers[ jokerIndex ][ 'id' ]);
	// console.log( index );
										cards[ index ][ 'boardLieIndex' ] = i;
										usedPositions.push(i);
										jokerIndex++;
									}
								}
								
								leftOverJokers = jokerCount - jokerIndex;
								// If there are still some jokers then put them low
								 
								if ( leftOverJokers > 0 ) {
									// Put extra jokers on the left but above the ace
// Dec 2024: This for loop will certainly end:
									for ( let i = jokerIndex; i < jokerCount; i++ ) {
										cards[ i ][ 'boardLieIndex' ] = 1.5;
										usedPositions.push(i);
									}
								}
							}
						}

						break;
					case 2 : // There are 2 aces. Assign 1 low and 1 high
// console.log("[bmc] Two aces.");

						// Find the index of the ace (type == 1); Set to 1 if present
						index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log( index );
						if ( index > -1 ) {
							cards[ index ][ 'boardLieIndex' ] = 1;
							usedPositions.push( 1 );
						} else {
							console.log("[bmc] ASSERT DID NOT FIND LOW ACE");
						}

						// Set the 'other' ace to be lieIndex 14
						// Find the index of the ace (type == 14). It was set to 14 previously:
						index = cards.map( function(e) {return e.type; }).indexOf(14);
// console.log( index );
						if ( index > -1 ) {
							cards[ index ][ 'boardLieIndex' ] = 14;
							usedPositions.push( 14 );
						} else {
							console.log("[bmc] ASSERT DID NOT FIND HIGH ACE");
						}
						break;
				}

// console.log( cards );
console.log( usedPositions );
				
				// Sort the boardcards by boardLieIndex
				cards.sort( this.compareBoardLieIndex );
// console.log("[bmc] ALL SORTED cards:" );
// console.log( cards );

				var newRunItems = new Array();
				
				for ( let i in cards ) {
					index = boardCards.map( function(e) {return e.id; }).indexOf(cards[ i ][ 'id' ]);
// console.log("[bmc] i, cards[], index, boardCards[]:");
// console.log(i);
// console.log(cards[ i ][ 'id' ]);
// console.log(index);
// console.log(boardCards[ index ][ 'type' ]);
					newRunItems[ i ] = {
						id: cards[ i ][ 'id' ],
						type: boardCards[ index ][ 'type' ]
					};
// console.log(newRunItems);
				}
// console.log("[bmc] FINAL newRunItems");
console.log(newRunItems);

console.log( "[bmc] EXIT sortRun2" );
				return newRunItems;
			}
		},
/////////
/////////
/////////
		sortRunOld : function( boardCards, downArea, boardPlayer ) {
console.log( "[bmc] ENTER sortRun2" );
// console.log( boardPlayer );
// console.log( boardCards );

			// let weightChange = {};
					
			if ( boardCards.length != 0 ) {
				var cards = new Array();

				// Reconstruct the card values from the type
				for ( cidx in boardCards ) {
// console.log("[bmc] In The Loop");
// console.log(cidx);
// console.log(boardCards[ cidx ]);
					cards[ cidx ] = {};
					
// console.log(boardCards[ cidx ][ 'type' ] );
					if (( boardCards[ cidx ][ 'type' ] == 52 ) || 
					    ( boardCards[ cidx ][ 'type' ] == 53 )) {
// console.log("[bmc] Yes card is a Joker");
						cards[ cidx ][ 'value' ] = 0; // Arbitrarily choosing value 0 for joker
						cards[ cidx ][ 'type' ] = 0;
					} else {
// console.log("[bmc] Card is not a Joker");
						cards[ cidx ][ 'value' ] = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
						cards[ cidx ][ 'type' ]  = (boardCards[ cidx ][ 'type' ] % 13 ) + 1;
					}
					cards[ cidx ][ 'id' ] = boardCards[ cidx ][ 'id' ];
				}
	
				cards.sort( this.compareValue );

// console.log("[bmc] Sorted cards:");
// console.log(cards);
// console.log(downArea);
				
//console.log("[bmc] UPDATING DISPLAY FOR THAT BOARDPLAYER1");
//console.log( boardPlayer );
				// this.updatingBoardPlayer = boardPlayer;
				
//SHOULDNT SORT IF ITS A JOKER
				// Count number of jokers and aces and track their IDs to set weights later
				
				var jokerCount = 0;
				var jokers = new Array();
				var thereIsAnAce = false;
				var aceCount = 0;
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] == 0 ) {
							jokers[ jokerCount ] = {
								"id" : cards[ i ][ 'id' ],
								"type" : 0 };	 // Start jokers at value 0
							jokerCount++;
					}
					if ( cards[ i ][ 'type' ] == 1 ) {
						thereIsAnAce = true;
						aceCount++;
					}
				}
// console.log("[bmc] jokers:");
// console.log(jokers);
// console.log(jokerCount);
// console.log(thereIsAnAce);
// console.log(aceCount);
				var cardValuesHard = new Array();
				
				for ( let i in cards ) {
					if ( cards[ i ][ 'type' ] != 0 ) { // Jokers here are type 0
						cardValuesHard[ cards[ i ][ 'type' ]] = cards[ i ][ 'type' ];
					}
				}
					
// console.log("[bmc] cardValuesHard");
// console.log(cardValuesHard);
				
				var usedPositions = new Array(); // Temporary variable to track positions in the run while assigning jokers
				
				var jokerIndex = 0;
// console.log("Looping over hard cards");				
				var foundFirst = false;
				
				// Reindex cards with the IDs as the indices
				
				// Go through positions 1 through King and track 'real' cards if they exist
				for ( let i = 1; i < 14 ; i++) {
// console.log( i );
// console.log(cardValuesHard[ i ]);
// console.log(foundFirst);

					if ( cardValuesHard[ i ] != null ) {
// console.log("card location is notNull");
// console.log( i );
// console.log( cards );
						if ((( cardValuesHard[ i ] == 1 )    &&
						   (( cardValuesHard.includes( 8 ))  ||
							( cardValuesHard.includes( 9 ))  ||
							( cardValuesHard.includes( 10 )) ||
							( cardValuesHard.includes( 11 )) ||
							( cardValuesHard.includes( 12 )) ||
							( cardValuesHard.includes( 13 ))))) {
								
								// There is an ace and some high cards, so the ace must be high (14)
// console.log("[bmc] Moving the ace to high");
								cards[ i ][ 'boardLieIndex' ] = 14;
								usedPositions.push(14);
								usedPositions.pop(1);
// console.log( "cards" );
// console.log( i );
// console.log( cards );
//exit(0);								
							} else {

							foundFirst = true;
						
							index = cards.map( function(e) { return e.type; }).indexOf( i );
// console.log("index");
// console.log(index);
							cards[ index ][ 'boardLieIndex' ] = i;
							usedPositions.push(i);
						}
					} else {
// console.log("card location is Null");
						if ( foundFirst ) {
// console.log("foundFirst");
// console.log(foundFirst);
// console.log(cardValuesHard.length);
// console.log("July2021cards");
// console.log(cards);
// console.log( i );

							// if this is the last of the hard cards then ignore
							// Deal with the aces later
							// This presumes the cards which are down are indeed a valid run
							if ( i < cardValuesHard.length + 1 ) {
								if ( jokerIndex < jokerCount ) {
//console.log("index");
//console.log(index);
// console.log("[bmc] Assigning Joker!");
// console.log(i);
// console.log(jokerIndex);
// console.log(jokerCount);
									cards[ jokerIndex ][ 'boardLieIndex' ] = i;
									usedPositions.push(i);
// console.log(usedPositions);
									jokerIndex++;
								} else {
//	I used to have this assert-style check here but it sorts the cards right, and
//  so let's presume the other function did it's job and allowed only true runs.
//	this.showMessage( "YIKES! That's not a sortable run!", 'error' ); // 'info' or 'error'
//	console.log("[bmc] Yikes!! This never should have been a run.");
								}
							} else {
// console.log("[bmc] FINISHED HARD CARDS do not put high ace, yet");
							}
// console.log("[bmc] FINISHED HARD CARDS");
						}
					}
// console.log("[bmc] Spot near end of loop");
				}

// console.log("[bmc] DEBUG]");
// console.log(cards);
// console.log(cards[0]);
// console.log(cards[1]);
// console.log(cards[2]);
// console.log(cards[3]);
// console.log(cards[4]);
// console.log(cards[5]);
// console.log(cards[6]);
// console.log(cards[7]);
// console.log(cards[8]);
// console.log(cards[9]);
// console.log(cards[10]);
// console.log(cards[11]);
// console.log(cards[12]);
// console.log(cards[13]);
// To debug, enter a specific card and id here, then you can see the variable before it gets chenged
// if (cards[0]['id'] == 23 ) {
	// exit(0);
// }

// It sorts 3 jokers and 1 ace with HIGH cards correctly to here (7/11/2021)

				leftOverJokers = jokerCount - jokerIndex;
				
// console.log("[bmc] Assess remaining jokers");
// console.log( jokerCount);
// console.log( jokerIndex );
// console.log( leftOverJokers );
// console.log( jokers );
// console.log( cards );
// console.log( usedPositions );

				// Move jokers to low if there is an ace and enough jokers to get to the next card
				if ( thereIsAnAce ) {
// console.log("[bmc] 1");
					if ( usedPositions.includes( jokerCount + 2 )) {
// console.log("[bmc] 2");
						// Ace should be low. Assign leftover jokers as missing cards are found
						for ( let i = 2; i < 13 ; i++) {
							if ( !usedPositions.includes( i ) ) {
								if ( jokerIndex < jokerCount ) {
// console.log("[bmc] 3");
// console.log( jokers[ jokerIndex ][ 'id' ] );
									index = cards.map( function(e) {return e.id; }).indexOf(jokers[ jokerIndex ][ 'id' ]);
									jokerIndex++;

									cards[ index ][ 'boardLieIndex' ] = i;
// console.log("[bmc] Assigning an ACE joker:");
// console.log( index );
// console.log( jokerIndex );
// console.log( cards );
								}
							}
						}
					} else {
// console.log("[bmc] 4");
						// Set the ace (in 1st position) to index 14;
						
						// Find the index of the ace (type == 1):
						index = cards.map( function(e) {return e.type; }).indexOf(1);
// console.log("[bmc] index finding ace:");
// console.log( index );
//exit(0);
						
						cards[ index ][ 'boardLieIndex' ] = 14;
						usedPositions.push( 14 );
						var aceIndex = usedPositions.indexOf(1);
						if ( aceIndex > -1 ) {
							usedPositions.splice( aceIndex, 1 );
						}
					}
				}
				
// console.log("[bmc] Final usedPositions" );
// console.log( usedPositions );


// 7/11 ace high 3 jokers correct to here.

// THERE USED TO BE AN ISSUE WITH THE PLACEMENT OF EXTRA JOKERS. THEY SHOULD GO ON LEFT BUT DON'T
// 7/10/2021
//
// 6790QKA ***
// Fixed it 7/17/2021

				// Move an ace to be high if there is a king (position 13)
				for (let i in cards ) {
					if ( cards[ i ][ 'type' ] == 1 ) {
// console.log("[bmc] MA1");
// console.log(i);

						if ( usedPositions.includes( 13 )) {
// console.log("[bmc] MA2");
// console.log(i);
							// If there is already a high ace then assign the 2nd one low
							if ( usedPositions.includes( 14 ) &&
							   ( cards.length > 13)) {
// console.log("[bmc] MA3");
// console.log(i);
								cards[ i ][ 'boardLieIndex' ] = 1;
								usedPositions.push(1);
							} else {
								cards[ i ][ 'boardLieIndex' ] = 14;
								usedPositions.push(14);
							}
						} else {
							cards[ i ][ 'boardLieIndex' ] = 1;
							usedPositions.push(1);
						}
					}
				}
// console.log("[bmc] cards and usedPositions");
// console.log( cards );
// console.log( usedPositions );
//exit(0);
if (cards[0]['id'] == 31 ) {
	//exit(0);
}
	 
				// Put extra jokers on the right unless there is a High Ace
				if ( !usedPositions.includes( 14 )) {
					for ( let i = jokerIndex; i < jokerCount; i++ ) {
						cards[ i ][ 'boardLieIndex' ] = 15;

// console.log("[bmc] EXTRA ON RIGHT");

					}
				} else {
					for ( let i = jokerIndex; i < jokerCount; i++ ) {
						cards[ i ][ 'boardLieIndex' ] = 0;
// console.log("[bmc] EXTRA ON LEFT");
					}
					
				}
				
				
// console.log("[bmc] ABOUT TO ADD JOKER TOOLTIPS");
				// var extraJokerArray = new Array();
				
				// for ( let i = jokerIndex; i < jokerCount; i++ ) {
// console.log(i);
					// var jokerExtraAddGreen = downArea + '_' + boardPlayer + '_item_' + cards[i]['id'];
// console.log("[bmc] ADDING GREEN BORDER1");
// console.log(jokerExtraAddGreen);
// console.log($(jokerExtraAddGreen));

					// Only make it green if there is not an ace
					// if ( !thereIsAnAce ) {
						// extraJokerArray.push( jokerExtraAddGreen );
					// }
				// }
// console.log("[bmc] extraJokerArray");				
// console.log(extraJokerArray);				

				// setTimeout(
					// this.addJokerBorder( extraJokerArray ), 5000
				// );
				
				
// console.log("[bmc] usedPositions:");
// console.log(usedPositions);

// console.log("[bmc] usedPositions:");
// console.log(usedPositions);
			
// console.log("[bmc] cards:");
// console.log( cards );

				// for ( let i = 0; i < 15 ; i++ ) {
					// if ( cards[ i ] != null ) {
						// weightChange[ i ] = cards[ i ][ 'boardLieIndex' ];
					// }
				// }
// console.log("[bmc] weightChange" );
// console.log( weightChange );

				// Sort the boardcards by boardLieIndex
				cards.sort( this.compareBoardLieIndex );
// console.log("[bmc] SORTED cards:" );
// console.log( cards );
				
				var newRunItems = new Array();
				
				for ( let i in cards ) {
					index = boardCards.map( function(e) {return e.id; }).indexOf(cards[ i ][ 'id' ]);
// console.log("[bmc] i, cards[], index, boardCards[]:");
// console.log(i);
// console.log(cards[ i ][ 'id' ]);
// console.log(index);
// console.log(boardCards[ index ][ 'type' ]);
					newRunItems[ i ] = {
						id: cards[ i ][ 'id' ],
						type: boardCards[ index ][ 'type' ]
					};
// console.log(newRunItems);
				}
// console.log("[bmc] FINAL newRunItems");
// console.log(newRunItems);

console.log( "[bmc] EXIT sortRun2" );
				return newRunItems;
			}

	// Create array downRunCards of all cards sorted by value.				
	// For each card, dojo.removeclass(greenborder);				
	// Make a group of the joker IDs.				
	// Set the jokerCount = number of jokers.				
	// Set the jokerIndex = 0.				
	// Loop over loopValues 2 to 13.				
	//	If there is a card in downRunCards with the value==loopValue then:			
	//		Give that card the boardLieIndex[loopValue].		
		// If not then:			
			// If the jokerIndex < jokerCount then:		
				// Give the joker[jokerIndex] the boardLieIndex[loopValue].	
				// Increment the jokerIndex.	
			// If not then throw a fatal error.		
	// Loop;				
	//LeftoverJokers = jokerCount - jokerIndex.				
	// Loop from 0 to LeftoverJokers				
		// dojo.addclass(greenborder);			
	// Loop;
	// If the 1st downRunCard is an ace then:				
		// If there is a card in boardLieIndex[13] then give the ace boardLieIndex=14.			
		// If the 2nd downRunCard is an ace then:			
			// Give it boardLieIndex=1		
	// Sort all by the boardLieIndex.				
		},
/////////
/////////
/////////
		onPlayerSortByButtonSet : function() {
			this.playerSortBy = 'Run';
			this.onPlayerSortByButton();
		},
/////////
/////////
/////////
		onPlayerSortByButtonRun : function( thisPlayerHand ) {
			this.playerSortBy = 'Set';
			this.onPlayerSortByButton();
		},
/////////
/////////
/////////
		onPlayerSortByButton : function() {
console.log("[bmc] ENTER onPlayerSortByButton!");
console.log(this.player_id);
			
//			var thisPlayerHandIds = this.playerHand.getAllItems();
			// Just practicing the sortRun function
			//this.sortRun( thisPlayerHandIds, 'playerDown_A' );
			
			var thisPlayerHandIds = this.playerHand.getAllItems();
			
//console.log(thisPlayerHandIds);

			var el = {};
			var thisPlayerHand = new Array();
			
			for ( let i in thisPlayerHandIds ) {
				//console.log(i);
				
				var [ color, value ] = this.getColorValue( thisPlayerHandIds[ i ]['type'] );

				el = {
					'id' : thisPlayerHandIds[i]['id'],
					'unique_id' : this.getCardUniqueId(color, value),
					'type' : color,
					'type_arg' : value,
					'location' : 'hand',
					'location_arg' : this.player_id
				}
				thisPlayerHand[thisPlayerHandIds[i]['id']] = el;
			}
console.log( "thisPlayerHand:" );
console.log( thisPlayerHand );
			
			if ( this.playerSortBy == 'Set' ) {
				this.playerSortBy = 'Run';
				thisPlayerHand.sort( this.compareId ) ;
console.log( "thisPlayerHand after sort:");
console.log( thisPlayerHand );

				let weightChange = {};
				for (let i in thisPlayerHand) {
					if ( thisPlayerHand[i].type == 5 ) {
						weightChange[ thisPlayerHand[ i ].unique_id ] = this.drawCounter + 1; // Keep jokers on the right
					} else {
						weightChange[ thisPlayerHand[ i ].unique_id ] = parseInt( thisPlayerHand[ i ].unique_id );
					}
				}
console.log("weightChange RUN");
console.log(weightChange);
				this.playerHand.changeItemsWeight(weightChange);
				
			} else {
				this.playerSortBy = 'Set';
				thisPlayerHand.sort( this.compareTypeArg ) ;

				let weightChange = {};
				for ( let i in thisPlayerHand ) {
					if ( thisPlayerHand[i].type == 5 ) {
						weightChange[ thisPlayerHand[ i ].unique_id ] = 100; // Keep jokers on the right
					} else {
						weightChange[ thisPlayerHand[ i ].unique_id ] = parseInt( thisPlayerHand[ i ].type_arg );
					}
				}
console.log("weightChange SET");
console.log(weightChange);
				this.playerHand.changeItemsWeight(weightChange);
			}
			//this.showHideButtons();
			
console.log("[bmc] EXIT onPlayerSortByButton!");
		},
/////////
/////////
/////////
		onPlayerSortButton : function( items ) {
			console.log("[bmc] BUTTON onPlayerSortButton!");
			console.log(this.player_id);
			
			var cards = this.playerHand.getSelectedItems(); // It can be >1 card
			this.onPlayerSortButton2( cards );
		},
/////////
/////////
/////////
		onPlayerSortButton2 : function( cards ) {
			console.log("[bmc] BUTTON onPlayerSortButton2!");
			console.log(this.player_id);
			
//			var cards = this.playerHand.getSelectedItems(); // It can be >1 card

			console.log( cards );
			
			if ( cards.length === 2 ) { // Sort only when 2 cards are selected
				var cardIds = this.getItemIds( cards );

console.log("[bmc] cardIds: " + cardIds );

				this.clearButtons();
//				this.removeActionButtons(); // Remove the button because they clicked it
//				this.showingButtons === 'No';
				this.sortHand( cards );
			}
		},
/////////
/////////
/////////
		sortHand : function( items ) {
			var thisPlayerHand = this.playerHand.getAllItems();
console.log("[bmc] sortHand from:", items[0].id, "to:", items[1].id);

			this.clearButtons();

			// Keep player's first selection first
			if ( this.playerHand.firstSelected != items[0].type ) {
				let temp = items[0];
				items[0] = items[1];
				items[1] = temp;
			}

			// Find positions by id (handles identical-type cards)
			var spotFrom = -1, spotTo = -1;
			for ( const [i, card] of thisPlayerHand.entries() ) {
				if ( spotFrom === -1 && String(items[0].id) === String(card.id) ) spotFrom = i;
				if ( spotTo   === -1 && String(items[1].id) === String(card.id) ) spotTo   = i;
			}

			if ( spotFrom === -1 || spotTo === -1 || spotFrom === spotTo ) {
				console.log("[bmc] sortHand: card not found or same position, aborting");
				return;
			}

			this.arraymove( thisPlayerHand, spotFrom, spotTo );

			// changeItemsWeight keys by type, so two same-type cards always share the
			// same weight and cannot be placed on opposite sides of a different card.
			// Reload the stock in the desired order to handle all cases reliably.
			this.playerHand.removeAll();
			for ( var i = 0; i < thisPlayerHand.length; i++ ) {
				this.playerHand.addToStockWithId( thisPlayerHand[i].type, thisPlayerHand[i].id );
			}
		},
/////////
/////////
/////////
};
