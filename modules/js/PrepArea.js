// LiverpoolRummy PrepArea Mixin
var LRPrepArea = {
		movePrepCardsToHand : function( prepArea ){
			console.log("Enter: moveAllPrepCardsToHand");
			
			var area_Items = prepArea.getAllItems();
			console.log( area_Items );
			// var area_B_Items = this.myPrepB.getAllItems();
			// var area_C_Items = this.myPrepC.getAllItems();
			// var area_J_Items = this.myPrepJoker.getAllItems();
			
			for ( var card of area_Items ){
				cardUniqueId = card.type;
				cardId = card.id;
				this.addCardToHandRightmost( cardUniqueId, cardId, $('myhand') );
				prepArea.removeFromStockById( card.id );
			}
			// for ( var card in area_B_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepB.removeFromStockById( card.id );
			// }
			// for ( var card in area_C_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepC.removeFromStockById( card.id );
			// }
			// for ( var card in area_J_Items ){
				// cardUniqueId = card.type;
				// cardId = card.id;
				// this.playerHand.addToStockWithId( cardUniqueId, cardId, $('myhand')); // Pull back to hand
				// this.myPrepJ.removeFromStockById( card.id );
			// }
		},
/////////
/////////
/////////
		populatePrepArea : function( ids, colors, values, prepArea ){
console.log( "[bmc] ENTER populatePrepArea");
console.log( ids );
console.log( colors );
console.log( values );
console.log( prepArea );

			
			for ( let id in ids ){
				console.log( id );
				console.log( ids[id] );
		
//				var from = 'myhand_item_' + ids[ id ];
				
//				prepArea.addToStockWithId( this.getCardUniqueId( colors[id], values[id] ), ids[id], $('myhand'));
				prepArea.addToStockWithId( this.getCardUniqueId( colors[id], values[id] ), ids[id]);
				
				this.playerHand.removeFromStockById ( ids[id] );
			}
console.log( "[bmc] EXIT populatePrepArea");
		},
/////////
/////////
/////////
		onPlayerSavePrep_Button : function() {
			console.log("[bmc] BUTTON onPlayerSavePrep");
			
			if ( this.goneDown[ this.player_id ] != 1 ) { // If player has not gone down allow the prep save

				// Get all cards in prep areas
				// Send to server
				var prepArea_A_Items = this.myPrepA.getAllItems();
				var prepArea_B_Items = this.myPrepB.getAllItems();
				var prepArea_C_Items = this.myPrepC.getAllItems();
				var prepArea_J_Items = this.myPrepJoker.getAllItems();
				console.log(prepArea_A_Items);
				console.log(prepArea_B_Items);
				console.log(prepArea_C_Items);
				console.log(prepArea_J_Items);

				var pA_A_ids = new Array();
				var pA_B_ids = new Array();
				var pA_C_ids = new Array();
				var pA_J_ids = new Array();
				
				for ( let i in prepArea_A_Items ) {
					pA_A_ids[i] = prepArea_A_Items[i].id;
				}
				for ( let i in prepArea_B_Items ) {
					pA_B_ids[i] = prepArea_B_Items[i].id;
				}
				for ( let i in prepArea_C_Items ) {
					pA_C_ids[i] = prepArea_C_Items[i].id;
				}
				for ( let i in prepArea_J_Items ) {
					pA_J_ids[i] = prepArea_J_Items[i].id;
				}

				console.log(pA_A_ids);
				console.log(pA_B_ids);
				console.log(pA_C_ids);
				console.log(pA_J_ids);

				if (( pA_A_ids.length +
					  pA_B_ids.length + 
					  pA_C_ids.length + 
					  pA_J_ids.length ) != 0 ){
console.log( "[bmc] Saving prep areas." );
					
					// var action = 'savePrep';
					var newAction = 'actSavePrep';

					this.bgaPerformAction( newAction, { // 'actSavePrep'
						player_id : this.player_id,
						area_A_Items : this.toNumberList( pA_A_ids ),
						area_B_Items : this.toNumberList( pA_B_ids ),
						area_C_Items : this.toNumberList( pA_C_ids ),
						area_J_Items : this.toNumberList( pA_J_ids ),
					},{ 
						checkAction: false,
//						checkPossibleActions: true 
					});


					// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// area_A_Items : this.toNumberList( pA_A_ids ),
						// area_B_Items : this.toNumberList( pA_B_ids ),
						// area_C_Items : this.toNumberList( pA_C_ids ),
						// area_J_Items : this.toNumberList( pA_J_ids ),
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
					// });
				}
			}
		},
/////////
/////////
/////////
		onPlayerLoadPrep_Button : function() {
			console.log("[bmc] BUTTON onPlayerLoadPrep");
			// Read list of cards from server for prep areas
			// Move them from hand to prep areas

			if ( this.goneDown[ this.player_id ] != 1 ) { // If player has not gone down allow the prep save
				// var action = 'loadPrep';
				var newAction = 'actLoadPrep';

				this.bgaPerformAction( newAction, { // 'actLoadPrep'
					player_id : this.player_id,
				},{ 
					checkAction: false,
//						checkPossibleActions: true 
				});

				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
					// player_id : this.player_id,
					// lock : true
				// }, this, function(result) {
				// }, function(is_error) {
				// });
			}
		},
/////////
/////////
/////////
		onPlayerPrepArea_A_Button : function () {
			console.log("[bmc] BUTTON onPlayerPrepAreaAButton");
			console.log(this.player_id);
			
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
				
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_A_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass( downArea_A_[ this.player_id ], "buyerLit");
					this.myPrepA.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepA', "buyerLit" );
					this.playerHand.removeFromStockById ( card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.playerHand.unselectAll();
				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepJoker_Button : function() {
			console.log("[bmc] BUTTON onPlayerPrepJoker_Button");
			console.log(this.player_id);

			// if there is a card there, move it back to hand
			let jcards = this.myPrepJoker.getAllItems(); // It should just be 1 card

			if ( jcards.length != 0 ) {
				// var from = 'myhand_item_' + jcards[0].id;

				cardUniqueId = jcards[0].type;
				cardId = jcards[0].id;
				console.log("BMC 082723: Pulling Back");
				this.addCardToHandRightmost( cardUniqueId, cardId, $('myhand') );
				this.myPrepJoker.removeFromStockById( cardId );

console.log( cardUniqueId ) ;
console.log( cardId ) ;
			}







			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
console.log(cards);
				
//				var cardIds = this.getItemIds( cards ); // Just pick 1 card

//				for ( card of cards ) {
					cardUniqueId = cards[0].type;
					cardId = cards[0].id;

					// if there was a card there, store it so later move it back to hand
					let card = this.myPrepJoker.getAllItems(); // It should just be 1 card

					// var from = 'myhand_item_' + cards[0].id;
					this.myPrepJoker.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepJoker', "buyerLit" );
					this.playerHand.removeFromStockById (cards[0].id );

console.log( card ) ;
					if ( card.length != 0 ) {
						cardUniqueId = card[0].type;
						cardId = card[0].id;
console.log( cardUniqueId ) ;
console.log( cardId ) ;
						this.addCardToHandRightmost( cardUniqueId, cardId, $('myhand') );
						this.myPrepJoker.removeFromStockById( cardId );
//					}

				}
				this.prepAreas++;
console.log(this.prepAreas);
console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepArea_B_Button : function () {
			console.log("[bmc] BUTTON onPlayerPrepArea_B_Button");
			console.log(this.player_id);
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player already went down, do nothing
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_B_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass('playerDown_B_' + this.player_id, "buyerLit");
					this.myPrepB.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepB', "buyerLit" );
					this.playerHand.removeFromStockById (card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
		onPlayerPrepArea_C_Button : function () {
console.log("[bmc] BUTTON onPlayerPrepAreaCButton");
console.log(this.player_id);
			// If player already went down, do nothing
			if ( this.goneDown[ this.player_id ] == 1 ) {
				this.showMessage( _("You already went down" ));
				return;
			} else {
				this.clearButtons();

				var cards = this.playerHand.getSelectedItems(); // It can be >1 card
				console.log(cards);
				
				var cardIds = this.getItemIds( cards );
console.log("[bmc] cardIds: " + cardIds);

				for ( card of cards ) {
					cardUniqueId = card.type;
					cardId = card.id;

					// var from = 'myhand_item_' + card.id;
//					this.downArea_C_[ this.player_id ].addToStockWithId(cardUniqueId, cardId, 'myhand');
//					dojo.addClass('playerDown_C_' + this.player_id, "buyerLit");
					this.myPrepC.addToStockWithId( cardUniqueId, cardId, 'myhand' );
					dojo.addClass( 'myPrepC', "buyerLit" );
					this.playerHand.removeFromStockById (card.id );
				}
				this.prepAreas++;
				console.log(this.prepAreas);
				console.log("[bmc] INCREMENTED prepAreas");

				this.showHideButtons();
			}
			this.myPrepA.unselectAll();
			this.myPrepB.unselectAll();
			this.myPrepC.unselectAll();
			this.myPrepJoker.unselectAll();
			this.playerHand.unselectAll();
		},
/////////
/////////
/////////
};
