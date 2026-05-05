// LiverpoolRummy DrawDeck Mixin
var LRDrawDeck = {
		onDeckSelectionChanged : function() {
			console.log("[bmc] ENTER OnDeckSelectionChanged.");
//			var items = this.deck.getSelectedItems();
			// var items = this.deckOne.getSelectedItems();
			// this.deckOne.unselectAll();

			// Remove the borders from the deck and discard pile after the player draws
			// var deck_items = this.deckOne.getAllItems();
			
console.log( this.alreadyODeckSC );

			// if ( this.alreadyODeckSC == false ){
				// this.alreadyODeckSC = true;
				// return; // 
			// }

//			var dp_items = this.discardPile.getAllItems();
			var dp_items = this.discardPileOne.getAllItems();
// console.log("[bmc] ALL deckOne:");
// console.log(deck_items);
console.log(dp_items);

			// for ( let i in deck_items ) {
				// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
			// }

			// for ( let i in dp_items ) {
				// dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			// }
			
			// console.log( items );
			console.log("[bmc] GAMEDATAS and this.player_id.");
			console.log(this.gamedatas);
			console.log(this.player_id);
//			this.drawCard2nd(items, 0 ); // 0 == 'deck', 1 == 'discardPile'
//			this.drawCard2nd(items, 'deck' ); // THIS WAS UNCOMMENTED ORIGINALLY

			var itemsAll = this.deckAll.getSelectedItems();
			
			this.deckAll.unselectAll();

			// Remove the borders from the deck and discard pile after the player draws
			var deckAllItems = this.deckAll.getAllItems();
			
console.log("[bmc] ALL deckAll:");
console.log( deckAllItems );

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

			console.log( itemsAll );
			console.log("[bmc] GAMEDATAS and this.player_id.");
			this.drawCard2nd(itemsAll, 'deck' ); // Should this be just 1 card selected???

			console.log("[bmc] EXIT OnDeckSelectionChanged.");
		},
/////////
/////////
/////////
		drawCard2nd : function ( items, drawSource ) {
console.log("[bmc] ENTER drawCard2nd.");
console.log( items );
console.log( drawSource );
			if (( items.length > 0 ) || ( drawSource == 'discardPile' )) {
console.log("[bmc] >0; Sending the card.");
				
				var card_id = items[0].id;
console.log(card_id);

				if ( isNaN( card_id ) ||   // Check for NAN
					 ( card_id == null )){ // Also check for null
console.log( '[bmc] Trace dc2:1' );
					card_id = 0; // Not really 0, trying to avoid PHP error for missing ID
					//  "Unexpected exception: Failed to get mandatory argument: id"
				}

				// var action = 'drawCard';
				var newAction = 'actDrawCard';
console.log( '[bmc] Trace dc2:2' );
				
				this.bgaPerformAction( newAction, { // 'actDrawCard' in drawCard2nd
					player_id : this.player_id,
					card_id : card_id,
					drawSource : drawSource,
				});
				// },{ 
					// checkAction: false,
//					checkPossibleActions: false
				// });
console.log( '[bmc] Trace dc2:3' );
					
				// if (this.checkAction( action, true )) {
					// console.log( "[bmc] Action true. AJAX next" );
					// console.log( "/" + this.game_name + "/" + this.game_name + "/" + action + ".html");
					
					// var card_id = items[0].id;
// console.log(card_id);

					// if ( isNaN( card_id ) ||   // Check for NAN
						 // ( card_id == null )){ // Also check for null
						// card_id = 0; // Not really 0, trying to avoid PHP error for missing ID
						//  "Unexpected exception: Failed to get mandatory argument: id"
					// }
// console.log(card_id);

					// this.ajaxcall( "/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// id : card_id,
						// drawSource : drawSource,
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
						// console.log( "Error status reported by DRAWCARD Ajax (false=no error:", is_error );
					// });
				// } else {
					// console.log("[bmc] Cannot Draw. Action false");
				// }
				this.discardPileOne.unselectAll();
console.log( '[bmc] Trace dc2:4' );

				// Clear the checks after the unselects are done
				this.alreadyODPSC = false;
				
				// this.deckOne.unselectAll();
				
				// Remove the borders from the deck and discard pile after the player draws
				// var deck_items = this.deckOne.getAllItems();
				var dp_items = this.discardPileOne.getAllItems();
	// console.log("[bmc] ALL deckOne:");
	// console.log(deck_items);
	// console.log(dp_items);

				// for ( let i in deck_items ) {
	// console.log(i);
					// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
				// }

				this.deckAll.unselectAll();
console.log( '[bmc] Trace dc2:5' );
				this.alreadyODeckSC = false;
				
				// Remove the borders from the deck and discard pile after the player draws
				var deckAllItems = this.deckAll.getAllItems();
console.log( '[bmc] Trace dc2:6' );
	// console.log("[bmc] ALL deckAll:");
	// console.log(deckAllItems);

				for ( let i in deckAllItems ) {
	// console.log(i);
console.log( '[bmc] Trace dc2:7' );
					dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
				}

				for ( let i in dp_items ) {
					dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
console.log( '[bmc] Trace dc2:8' );
				}
								
			} else {
console.log( '[bmc] Trace dc2:9' );
console.log("[bmc] No items; ignoring click on deck.");
			}
			console.log( "[bmc] EXIT drawCard2nd." );
		},
/////////
/////////
/////////
		drawCard : function (
			player_id,
			card_id,
			color,
			value,
			drawSource,
			drawPlayer,
			allHands,
			discardSize,
			drawDeckSize
			) {
console.log("[bmc] ENTER drawCard (from notif from PHP)");
// console.log(this.player_id);
console.log(player_id);
console.log(card_id);
console.log(color);
console.log(value);
console.log(drawSource);
console.log("[bmc] drawPlayer is next:");
console.log(drawPlayer); // drawPlayer is the player number of the board area where it comes from
console.log(allHands);
console.log(discardSize);
console.log(drawDeckSize);

			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			// Remove the borders from the deck and discard pile after the player draws
			// var deck_items = this.deckOne.getAllItems();
			var dp_items = this.discardPileOne.getAllItems();
// console.log("[bmc] ALL deckOne:");
// console.log(deck_items);
console.log(dp_items);

			// for ( let i in deck_items ) {
				// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
			// }

			var deckAllItems = this.deckAll.getAllItems();
console.log("[bmc] ALL deckAll:");
console.log(deckAllItems);

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

			for ( let i in dp_items ) {
				dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			}

			// Unlight the Liverpool button if lit up and if the discard was chosen
			
			if ( drawSource == 'discardPile' ) {
//				dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonLiverpool', "bgabutton_blue", "bgabutton_red" ); // item, add, remove
				this.gamedatas.liverpoolExists = false;
				this.showHideButtons();
			}


console.log(this.handCount);
			if ( drawSource.match(/playerDown/g) ) {
				var from = drawSource + '_' + drawPlayer;
				var drawingPlayer = player_id;
			} else {
				var from = drawSource;
				var drawingPlayer = drawPlayer;
			}

			this.discardSize.setValue( discardSize );
			this.drawDeckSize.setValue( drawDeckSize );
			this.myHandSize.setValue( allHands[ this.player_id ] );

console.log("[bmc] modified drawSource");
console.log(drawSource);
console.log(from);
console.log(this.playerHand)

			if (( color == null ) ||
				( color == ''   ) ||
				( value == null ) ||
				( value == '')) {
console.log("[bmc] Yikes!! Color or value is null! Need to fix this, this is fatal.");
				exit(0);
			}

			var cardUniqueId = this.getCardUniqueId( color, value );
			console.log(cardUniqueId);

			if ( drawingPlayer == this.player_id ) {
				console.log("[bmc] player_id is me");

				console.log("[bmc] player_id is me, so add it to my hand");
				var addTo = 'myhand';

				this.playerHand.addToStockWithId( this.getCardUniqueId(color, value), card_id );
				dojo.addClass('myhand_item_' + card_id, 'stockitem_newcard');

			} else {
				console.log("[bmc] player_id is NOT me");
//				var addTo = 'overall_player_board_' + drawPlayer;
				var addTo = 'overall_player_board_' + player_id; // make it slide to the active player
			}
				
console.log( '[bmc] addTo: ' + addTo );
				
			if ( drawSource == 'deck' ) {
				console.log(this.gamedatas.cardIDsInDeck[ 0 ]);

				// const myDiv = document.getElementById('deckAll');
				// const topElement = this.findHighestZIndex(myDiv);

				// if (topElement) {
					// console.log('Element with highest z-index:', topElement);
					// console.log('z-index value:', window.getComputedStyle(topElement).zIndex);
				// } else {
					// console.log('No elements with z-index found in the container.');
				// }

				// console.log( topElement.id );
				// topCardId = topElement.id.split('_');
				// console.log( topCardId[ 2 ] );
				
				// this.deckAll.removeFromStockById( topCardId[ 2 ], addTo );
				this.deckAll.removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'discardPile' ) {
console.log( '[bmc] from DP' );
//					this.discardPile.removeFromStockById( card_id, addTo );
				this.discardPileOne.removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_A' ) {
console.log( '[bmc] from A' );
				this.downArea_A_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_B' ) {
console.log( '[bmc] from B' );
				this.downArea_B_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
			if ( drawSource == 'playerDown_C' ) {
console.log( '[bmc] from C' );
				this.downArea_C_[ drawPlayer ].removeFromStockById( card_id, addTo );
			}
			
console.log( '[bmc] this.downAreas:' );
console.log( this.downArea_A_[ drawPlayer ] );
console.log( this.downArea_B_[ drawPlayer ] );
console.log( this.downArea_C_[ drawPlayer ] );

		this.sortBoard();
		console.log("[bmc] EXIT drawCard");
		},
/////////
/////////
/////////
		drawCardSpect : function (
			player_id,
			card_id,
			color,
			value,
			drawSource,
			drawPlayer,
			allHands,
			discardSize,
			drawDeckSize
			) {
console.log("[bmc] ENTER drawCardSpect (from notif from PHP)");
console.log(this.player_id);
console.log(player_id);
console.log(card_id);
console.log(color);
console.log(value);
console.log(drawSource);
console.log(drawPlayer);
console.log(allHands);
console.log(discardSize);
console.log(drawDeckSize);

			// This is only for spectators

			var isReadOnly = this.isReadOnly();
			console.log("isReadOnly");
			console.log(isReadOnly);
			
			// If I am a player then do nothing and return else, do the regular function
			// (do nothing because players were notified individually)
		
			// jan 25 2025
			// Why is color and value == null???
			
			// Me wathcing live game 1/27: Down card did not slide after a buy.			
			
			if ( isReadOnly ) {
				for ( var p_id in allHands ) {
					this.handCount[ p_id ].setValue( allHands[ p_id ] );
				}

console.log(this.handCount);

				if ( drawSource.match(/playerDown/g) ) {
					var from = drawSource + '_' + drawPlayer;
					var drawingPlayer = player_id;
				} else {
					var from = drawSource;
					var drawingPlayer = drawPlayer;
				}

				this.discardSize.setValue( discardSize );
				this.drawDeckSize.setValue( drawDeckSize );

console.log("[bmc] modified drawSource");
console.log(drawSource);
console.log(from);
console.log(this.playerHand)

				if (( color == null ) ||
					( value == null )) {
	console.log("[bmc] Yikes!! Color or value is null! Need to fix this, this is fatal.");
					exit(0);
				}
				console.log("[bmc] player_id is NOT me");
//				var addTo = 'overall_player_board_' + drawPlayer;
				var addTo = 'overall_player_board_' + player_id; // make it slide to the active player
//			}
				
console.log( '[bmc] addTo: ' + addTo );
				
				if ( drawSource == 'deck' ) {
console.log( '[bmc] Deck' );


					// const myDiv = document.getElementById('deckAll');
					// const topElement = this.findHighestZIndex(myDiv);

					// if (topElement) {
						// console.log('Element with highest z-index:', topElement);
						// console.log('z-index value:', window.getComputedStyle(topElement).zIndex);
					// } else {
						// console.log('No elements with z-index found in the container.');
					// }

					// console.log( topElement.id );
					// topCardId = topElement.id.split('_');
					// console.log( topCardId[ 2 ] );
					// this.deckAll.removeFromStockById( topCardId[ 2 ], addTo );

					this.deckAll.removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'discardPile' ) {
console.log( '[bmc] DP' );
//					this.discardPile.removeFromStockById( card_id, addTo );
					this.discardPileOne.removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_A' ) {
console.log( '[bmc] A' );
					this.downArea_A_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_B' ) {
console.log( '[bmc] B' );
					this.downArea_B_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
				
				if ( drawSource == 'playerDown_C' ) {
console.log( '[bmc] C' );
					this.downArea_C_[ drawPlayer ].removeFromStockById( card_id, addTo );
				}
			}
console.log("[bmc] EXIT drawCardSpect");
		},
/////////
/////////
/////////
		onDiscardPileSelectionChangedClick: function() {
console.log( '[bmc] onDiscardPileSelectionChangedClick' );
			this.onDiscardPileSelectionChanged();
		},
/////////
/////////
/////////
		onDiscardPileSelectionChanged: function() {
console.log( "[bmc] ENTER onDiscardPileSelectionChanged." );
console.log( "[bmc] GAMEDATAS and this.player_id" );
//console.log(card);
console.log( this.gamedatas );
console.log( this.player_id );
console.log( this.someoneLP );
// console.log( this.alreadyODPSC );

			// If hand has 1 card selected, and state is play, then try to discard (no need for player check).
			// If state is draw, and it's not my turn, then try to buy it.
			// If state is draw, and DP has 1 card selected, and it's my turn, then draw it.
			
			// If it's not my turn then try to buy it.
			// If it is my turn and if 

			var dpSelectedItems = this.discardPileOne.getSelectedItems();
console.log( dpSelectedItems );
console.log( dpSelectedItems.length );
			
			var dp_items = this.discardPileOne.getAllItems();
			for ( let i in dp_items ) {
				dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
			}

			var handCards = this.playerHand.getSelectedItems();
console.log( handCards );
console.log( handCards.length );

			var deckAllItems = this.deckAll.getAllItems();

			for ( let i in deckAllItems ) {
				dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
			}

console.log( '[bmc] Trace 1' );
			if ( this.gamedatas.gamestate.active_player != this.player_id ){ // It's not my turn, so try to buy it
console.log( '[bmc] Trace 2' );
				if ( dpSelectedItems.length === 1 ){
console.log( '[bmc] Trace 3' );
					this.onPlayerBuyButton();
				}
			} else { // It is my turn
console.log( '[bmc] Trace 4' );
				if ( this.gamedatas.gamestate.name == 'playerTurnDraw' ){
console.log( '[bmc] Trace 5' );
					if ( dpSelectedItems.length === 1 ){
console.log( '[bmc] Trace 6' );
						var items = new Array();
						items[0] = {id: "0", type: 0 }; // "Fake" card just used for the API (i.e. we need to send *something* but
						// when drawing from the discard it is ignored by the PHP and the top of the pile is chosen)
							
						this.drawCard2nd( items, 'discardPile' );
					}
				} else {
console.log( '[bmc] Trace 7' );
					if ( this.gamedatas.gamestate.name == 'playerTurnPlay' ){
console.log( '[bmc] Trace 8' );
						if ( handCards.length === 1 ){
console.log( '[bmc] Trace 9' );
							this.onPlayerDiscardButton();
						}
					}
				}
			}
console.log( '[bmc] Trace 10' );
					
			// Change the discard pile and player hand only at the end
			this.discardPileOne.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
};
