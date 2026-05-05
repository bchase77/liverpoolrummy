// LiverpoolRummy DownArea Mixin
var LRDownArea = {
		getSelectedDownAreaCards : function() {
			var selectedCards_A_ = new Array();
			var selectedCards_B_ = new Array();
			var selectedCards_C_ = new Array();
			
			// Find the selected card on the board, if any
			var boardCard = {}; // Empty object
			var boardArea = ''; // Empty string
			var boardPlayer = ''; // Empty string
			

//todo: Can no longer play jokers onto melds, not sure why.
			
			// var selc_A_ = new Array();
			
			for ( var player in this.gamedatas.players) {
console.log( 'Cards in areas: playerDown_A_, _B_, and _C_' + player);
				
				// selc_A_[ player ] = this.playerDown_A_[player].getSelectedItems();
// console.log(selc_A_[player]);

				selectedCards_A_[ player ] = this.downArea_A_[player].getSelectedItems();
console.log(selectedCards_A_[player]);
				
				if ( selectedCards_A_[player].length === 1 ) {
console.log("[bmc] FOUND A");
					boardCard.id = selectedCards_A_[player][0]['id'];
					boardCard.type = selectedCards_A_[player][0]['type'];
					boardArea = 'playerDown_A';
					boardPlayer = player;
				}
				
				selectedCards_B_[player] = this.downArea_B_[player].getSelectedItems();
console.log(selectedCards_B_[player]);
				
				if (selectedCards_B_[player].length === 1) {
console.log("[bmc] FOUND B");
					boardCard.id = selectedCards_B_[player][0]['id'];
					boardCard.type = selectedCards_B_[player][0]['type'];
					boardArea = 'playerDown_B';
					boardPlayer = player;
				}
				
				selectedCards_C_[player] = this.downArea_C_[player].getSelectedItems();
console.log(selectedCards_C_[player]);
				
				
				if (selectedCards_C_[player].length === 1) {
console.log("[bmc] FOUND C");
					boardCard.id = selectedCards_C_[player][0]['id'];
					boardCard.type = selectedCards_C_[player][0]['type'];
					boardArea = 'playerDown_C';
					boardPlayer = player;
				}
			}
// console.log("[bmc] Selected Board Card(s):");
// console.log(selectedCards_A_);
// console.log(selectedCards_B_);
// console.log(selectedCards_C_);
			return [boardCard, boardArea, boardPlayer];
		},
/////////
/////////
/////////
		onDownAreaAClick : function() {
			console.log("[bmc] ENTER onDownAreaAClick");

			var handItems = this.playerHand.getSelectedItems();
//			if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaA';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaA';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaBClick : function() {
			console.log("[bmc] ENTER onDownAreaBClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaB';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaB';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaCClick : function() {
			console.log("[bmc] ENTER onDownAreaCClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length >= 1 ) {
				this.prepAreaClicked = 'areaC';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaC';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaJokerClick : function() {
			console.log("[bmc] ENTER onDownAreaJokerClick");
			var handItems = this.playerHand.getSelectedItems();
			// if ( handItems.length == 1 ) {
				this.prepAreaClicked = 'areaJoker';
				this.onDownAreaSelect();
			// } else {
				// this.prepAreaClicked = 'areaJoker';
				// this.onDownAreaClick();
			// }
		},
/////////
/////////
/////////
		onDownAreaSelect : function() {
console.log("[bmc] ENTER onDownAreaSelect");
console.log(this.player_id);

			var isReadOnly = this.isReadOnly();
			if ( isReadOnly ) { // Spectators are read only
				return;
			}

			var handItems = this.playerHand.getSelectedItems();
console.log(handItems);
			var area_A_Items = this.downArea_A_[ this.player_id ].getSelectedItems();
			var area_B_Items = this.downArea_B_[ this.player_id ].getSelectedItems();
			var area_C_Items = this.downArea_C_[ this.player_id ].getSelectedItems();
console.log(area_A_Items);
console.log(area_B_Items);
console.log(area_C_Items);


			// for ( item of area_A_Items ) {
				// var DOMItem = "playerDown_A_" + this.player_id + "_item_" + item[ "id" ];
// console.log("[bmc] DOMItem");
// console.log(DOMItem);

				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// for ( item of area_B_Items ) {
				// var DOMItem = "playerDown_B_" + this.player_id + "_item_" + item[ "id" ];
// console.log("[bmc] DOMItem");
// console.log(DOMItem);
// console.log($(DOMItem));
				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// for ( item of area_C_Items ) {
				// var DOMItem = "playerDown_C_" + this.player_id + "_item_" + item[ "id" ];
				// if ( $(DOMItem).classList.contains( "borderDrawer" )) {
					// if ( $(DOMItem).contains( "blink" )) {
						// dojo.removeClass( DOMItem, "blink" );
					// } else {
						// dojo.addClass( DOMItem, "blink" );
					// }
				// }
			// }
			// TODO: These if conditions overlap, could be simplified
			
			if (( this.goneDown[ this.player_id ] == 0 ) &&  //0 = Not gone down; 1 = Gone down.
				( handItems.length >= 1 )) {
				// Then put it into a prep area
				if        ( this.prepAreaClicked == 'areaA' ) {
					this.onPlayerPrepArea_A_Button();
				} else if ( this.prepAreaClicked == 'areaB' ) {
					this.onPlayerPrepArea_B_Button();
				} else if ( this.prepAreaClicked == 'areaC' ) {
					this.onPlayerPrepArea_C_Button();
				} else if ( this.prepAreaClicked == 'areaJoker' ) {
					this.onPlayerPrepJoker_Button();
				}
			} else if ( handItems.length === 1 )  { // Then try to play the card
console.log("try to play 1 card");

				var [ boardCard, boardArea, boardPlayer ] = this.getSelectedDownAreaCards ();
				
				let playerCard = handItems[ 0 ];

				if  (( boardCard != {} ) &&
					(  boardArea != '' )) { // There is a card there on the board, so try to have player play
					let playerCard = handItems[ 0 ];
console.log("[bmc] Will try to play card here:");
console.log(playerCard);
console.log(boardCard);
console.log(boardArea);
console.log(boardPlayer);

					// var action = 'playCard';
					var newAction = 'actPlayCard';

					// do the unselects before going to the server
//					this.playerHand.unselectAll();
					for ( var player in this.gamedatas.players ) {
						this.downArea_A_[ player ].unselectAll();
						this.downArea_B_[ player ].unselectAll();
						this.downArea_C_[ player ].unselectAll();
					}

					this.bgaPerformAction( newAction, { // 'actPlayCard'
						player_id : this.player_id,
						card_id : playerCard['id'],
						boardArea : boardArea,
						boardPlayer : boardPlayer,
					});

					// if (this.checkAction( action, true)) {
// console.log("[bmc] PlayCard Action true AJAX");
// console.log("/" + this.game_name + "/" + this.game_name + "/" + action + ".html");

						
						// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
							// card_id : playerCard['id'],
							// player_id : this.player_id,
							// boardArea : boardArea,
							// boardPlayer : boardPlayer,
							// lock : true
						// }, this, function(result) {
						// }, function(is_error) {
						// });
					// } else {
						// console.log("[bmc] PlayCard Action false");
					// }
				} else {
					console.log("[bmc] No card on board selected, do nothing (one card)");
				}
			// If the player has not gone down and clicks, pull the card back to their hand
			} else if ( this.goneDown[ this.player_id ] == 0 ) { //0 = Not gone down; 1 = Gone down.
console.log("Pull 1 card back");

				var area_A_Items = this.myPrepA.getSelectedItems();
				var area_B_Items = this.myPrepB.getSelectedItems();
				var area_C_Items = this.myPrepC.getSelectedItems();
				var area_Joker_Items = this.myPrepJoker.getSelectedItems();
			
				if ( area_A_Items.length === 1 ) {
console.log("[bmc] Card from prep A to hand");
					let card = area_A_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

//					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
					// this.downArea_A_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_A_[ this.player_id ].unselectAll();
					this.myPrepA.removeFromStockById( card.id );
					this.myPrepA.unselectAll();

				} else if ( area_B_Items.length === 1 ) {
console.log("[bmc] Card from prep B to hand");
					let card = area_B_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_B_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_B_[ this.player_id ].unselectAll();
					this.myPrepB.removeFromStockById( card.id );
					this.myPrepB.unselectAll();

				} else if ( area_C_Items.length === 1 ) {
console.log("[bmc] Card from prep C to hand");
					let card = area_C_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );
					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_C_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_C_[ this.player_id ].unselectAll();
					this.myPrepC.removeFromStockById( card.id );
					this.myPrepC.unselectAll();

				} else if ( area_Joker_Items.length === 1 ) {
console.log("[bmc] Card from prep Joker to hand");
					let card = area_Joker_Items[ 0 ];
					cardUniqueId = card.type;
					cardId = card.id;

console.log( card );
console.log( cardUniqueId );
console.log( cardId );
console.log( card.id );

					this.playerHand.addToStockWithId( cardUniqueId, cardId, 'myhand'); // Pull back to hand
					// this.downArea_C_[ this.player_id ].removeFromStockById( card.id );
					// this.downArea_C_[ this.player_id ].unselectAll();
					this.myPrepJoker.removeFromStockById( card.id );
					this.myPrepJoker.unselectAll();

				} else {
					console.log("[bmc] No card in hand selected, do nothing");
				}

			} else if ( handItems.length > 1 )  { // Then try to play multiple cards
console.log("mulitple");
				var [ boardCard, boardArea, boardPlayer ] = this.getSelectedDownAreaCards ();

				if  (( boardCard != {} ) &&
					(  boardArea != '' )) { // There is a card there on the board, so try to play cards there

					// do the unselects before going to the server
					for ( var player in this.gamedatas.players ) {
						this.downArea_A_[ player ].unselectAll();
						this.downArea_B_[ player ].unselectAll();
						this.downArea_C_[ player ].unselectAll();
					}
					
					// Make a list of the selected cards
					var handItemIds = this.getItemIds(handItems);
console.log("handItemIds");
console.log(handItemIds);
					
					// var action = 'playCardMultiple';
					var newAction = 'actPlayCardMultiple';
					
						this.bgaPerformAction( newAction, { // 'actPlayCardMultiple'
							player_id : this.player_id,
							card_ids : this.toNumberList( handItemIds ),
							boardArea : boardArea,
							boardPlayer : boardPlayer,
						});

					// if (this.checkAction( action, true)) {
// console.log("[bmc] PlayCard Action true AJAX");
// console.log("/" + this.game_name + "/" + this.game_name + "/" + action + ".html");

						// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
							// card_ids : this.toNumberList( handItemIds ),
							// player_id : this.player_id,
							// boardArea : boardArea,
							// boardPlayer : boardPlayer,
							// lock : true
						// }, this, function(result) {
						// }, function(is_error) {
						// });
					// } else {
						// console.log("[bmc] PlayCard Action false");
					// }
				} else {
					console.log("[bmc] No card on board selected, do nothing (multiple cards)");
				}
			}
			
			var area_A_Items = this.myPrepA.getAllItems();
			var area_B_Items = this.myPrepB.getAllItems();
			var area_C_Items = this.myPrepC.getAllItems();
			var area_Joker_Items = this.myPrepJoker.getAllItems();

			console.log( area_A_Items );
			console.log( area_B_Items );
			console.log( area_C_Items );
			console.log( area_Joker_Items );
			
			var i = 0;
			if ( area_A_Items.length == 0 ) {
				dojo.removeClass('myPrepA', "buyerLit");
			} else {
				i++;
			}
			
			if ( area_B_Items.length == 0 ) {
				dojo.removeClass('myPrepB', "buyerLit");
			} else {
				i++;
			}

			if ( area_C_Items.length == 0 ) {
				dojo.removeClass('myPrepC', "buyerLit");
			} else {
				i++;
			}

			if ( area_Joker_Items.length == 0 ) {
				dojo.removeClass('myPrepJoker', "buyerLit");
			} else {
				i++;
			}

console.log("[bmc]AreasPrepped(i):");
console.log(i);
			// If no areas are prepped then clear the variable
			if ( i == 0 ) {
console.log("[bmc] Clear this.prepAreas3");
				this.prepAreas = 0;
			}
			
			console.log("[bmc] EXIT onDownAreaSelect");
		},
////////
////////
////////
		onDownAreaClick : function() {
			console.log("[bmc] ENTER onDownAreaClick");
			player_id = this.gamedatas.currentPlayerId;
			//player_id = this.gamedatas.playerorder[ 0 ];
			console.log( player_id );
			console.log( this.goneDown[player_id] );
			
			console.log("[bmc] EXIT onDownAreaClick");
			return;
			
			// If the player has not gone down and clicks, pull all the cards back to their hand
			if ( this.goneDown[ player_id ] == 0 ) { //0 = Not gone down; 1 = Gone down.
				console.log("[bmc] PULL BACK");
				
//				var cards = this.downArea_A_[ player_id ].getAllItems();
				var cards = this.myPrepA.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_A_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepA.removeAllTo( 'myhand' );

//				var cards = this.downArea_B_[ player_id ].getAllItems();
				var cards = this.myPrepB.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_B_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepB.removeAllTo( 'myhand' );
				//
//				var cards = this.downArea_C_[ player_id ].getAllItems();
				var cards = this.myPrepC.getAllItems();
				console.log(cards);

				for ( card of cards ) {
					console.log(card);
					cardUniqueId = card.type;
					this.playerHand.addToStockWithId( cardUniqueId, card.id, 'myhand' ); // Pull back to hand
				}
//				this.downArea_C_[ player_id ].removeAllTo( 'myhand' );
				this.myPrepC.removeAllTo( 'myhand' );
				
				// dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
				// dojo.removeClass('playerDown_B_' + this.player_id, "buyerLit");
				// dojo.removeClass('playerDown_C_' + this.player_id, "buyerLit");

				dojo.removeClass('myPrepA', "buyerLit");
				dojo.removeClass('myPrepB', "buyerLit");
				dojo.removeClass('myPrepC', "buyerLit");

				this.prepSetLoc = 0; // Nothing is prepped, so clear the counters
				this.prepRunLoc = 3; 
console.log("[bmc] Clear this.prepAreas4");
				this.prepAreas = 0;

			} // else do nothing, they've already gone down.
			console.log("[bmc] EXIT onDownAreaClick");
		},
/////////
/////////
/////////
};
