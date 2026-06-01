// LiverpoolRummy CardPlaying Mixin
var LRCardPlaying = {
		onPlayerReviewedHandButton : function() {
console.log("[bmc] ENTER onPlayerReviewedHandButton");
			this.dealMeInClicked = true;
			this.clearButtons();

			// var action = 'playerHasReviewedHand';
			
			var newAction = 'actPlayerHasReviewedHand';
			
			this.bgaPerformAction( newAction, { // 'actPlayerHasReviewedHand'
//				player_id : this.player_id,
			});


			// if (this.checkAction( action, true)) {
				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
				// });
			// }
		},
/////////
/////////
/////////
		onVoiceCheckbox : function() {
console.log("[bmc] ENTER onVoiceCheckbox");
			if ( $('voice').checked ) {
				console.log("CHECKED");
				this.voices = true;
			} else {
				console.log("UNCHECKED");
				this.voices = false;
			}
		},
/////////
/////////
/////////
		// onWishListCheckbox : function() {
// console.log("[bmc] ENTER onWishListCheckbox");
			// if ( $('wishListEnabled').checked ) {
				// console.log("WL CHECKED");
				// this.wishListEnabled = true;
				// this.setWishListColor( this.wishListSubmitted );
			// } else {
				// console.log("WL UNCHECKED");
				// this.wishListEnabled = false;
				// this.setWishListColor( false );
			// }
// console.log("[bmc] EXIT onWishListCheckbox");
		// },
/////////
/////////
/////////
		displayItsYourTurn : function ( player_id, soundtype ){
			console.log( "[bmc] displayItsYourTurn" );
			console.log( player_id );
			console.log( this.player_id );
			console.log( soundtype );
			
			if ( soundtype == 'liverpool' ) {
				console.log("[bmc] SOUND: liverpool");
				
				// Track it so players cannot easily abuse it
				
				this.someoneLP = true;
				console.log( "Setting someoneLP true");

				this.showMessage( _("Liverpool!"), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'Liverpool_audio' );
					this.disableNextMoveSound();
				}
			}
			if ( player_id == this.player_id ) {
				dojo.addClass('myhand_wrap', "borderDrawer");
				console.log("[bmc] SOUND: itsYourDraw");

				this.showMessage( _( "It's Your Draw!" ), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'tutorialrumone_itsyourdraw' );
					this.disableNextMoveSound();
				}
				// Make it clear to the player they need to draw a card (border around card)
				// var deck_items = this.deckOne.getAllItems();

// console.log("[bmc] ALL deckOne:");
// console.log( deck_items );
// console.log("[bmc] The deck to be turned red:");
// console.log( 'deckOne_item_' + deck_items[0]['id']);
				
				// dojo.addClass('deckOne_item_' + deck_items[0]['id'], 'stockitem_selected');





				var deckAllItems = this.deckAll.getAllItems();

console.log("[bmc] ALL deckAll:");
console.log( deckAllItems );
console.log("[bmc] The deck to be turned red:");
console.log( 'deckAll_item_' + deckAllItems[0]['id']);
				
				dojo.addClass('deckAll_item_' + deckAllItems[0]['id'], 'stockitem_selected');





			} else {
				dojo.removeClass('myhand_wrap', "borderDrawer");				
			}
		},
/////////
/////////
/////////
		cardWasPlayed : function ( card_id, player_id, color, value, boardArea, boardPlayer, allHands ) {
console.log("[bmc] (from PHP) ENTER cardWasPlayed");
console.log( card_id );
console.log( player_id );
console.log( color );
console.log( value );
//			console.log(boardCard);
console.log( boardArea );
console.log( boardPlayer );
console.log( allHands );
			
			if ( player_id == this.player_id) {
				var from = 'myhand';
			} else {
				var from = 'overall_player_board_' + player_id;
			}
			
			cardUniqueId = this.getCardUniqueId( color, value );
console.log( cardUniqueId );

			// Update card quantities in player hands
			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			if ( allHands != null ) {
				this.myHandSize.setValue( allHands[ this.player_id ] );
			}

// add joker if there
			
			if ( boardArea === 'playerDown_A' ) {
console.log(boardArea);
				this.downArea_A_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );

console.log("[bmc] Added.");
				this.playerHand.removeFromStockById( card_id );
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4017] Removed.");
				// this.sortArea_A( boardPlayer );
			}
			
			if ( boardArea === 'playerDown_B' ) {
console.log(boardArea);
				this.downArea_B_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );

console.log("[bmc] Added.");
				this.playerHand.removeFromStockById( card_id );
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4033] Removed.");
				// this.sortArea_B( boardPlayer );
			}
			if ( boardArea === 'playerDown_C' ) {
			console.log(boardArea);
				this.downArea_C_[boardPlayer].addToStockWithId(
					cardUniqueId,
					card_id,
					from );
//					'myhand' );
console.log("[bmc] Added.");
				this.playerHand.removeFromStockById(card_id);
				this.myPrepJoker.removeFromStockById( card_id );
				dojo.removeClass('myPrepJoker', "buyerLit");
console.log("[bmc 4047] Removed.");
				//this.sortArea_C( boardPlayer );
			}

console.log("[bmc] Joker moved, now sort the board cards.");
			this.sortBoard();
			//this.updateCardsDisplay();
			
			console.log("[bmc] (from PHP) EXIT cardWasPlayed");
		},
/////////
/////////
/////////
		onPlayerPlayCardButton : function() {
		},
/////////
/////////
/////////
		onPlayerGoDownButton : function() {
console.log("[bmc] ENTER onPlayerGoDownButton!");
console.log(this.player_id)
			// var handItems = this.playerHand.getSelectedItems(); // Get the card for joker swap, if any
			//var handItems = this.myPrepJoker.getAllItems(); // Get the card for joker swap (should be just 1 if any)

			// Gray the button immediately to block rapid re-clicks before the server responds
			dojo.replaceClass( 'buttonGoDownStatic', "bgabutton_gray", "bgabutton_blue" );
		    this.removeActionButtons(); // Remove the button because they played

			// var cardGroupA = this.downArea_A_[this.player_id].getAllItems();
			// var cardGroupB = this.downArea_B_[this.player_id].getAllItems();
			// var cardGroupC = this.downArea_C_[this.player_id].getAllItems();

			var cardGroupA = this.myPrepA.getAllItems();
			var cardGroupB = this.myPrepB.getAllItems();
			var cardGroupC = this.myPrepC.getAllItems();
			var cardGroupJoker = this.myPrepJoker.getAllItems();

			console.log(cardGroupA);
			console.log(cardGroupB);
			console.log(cardGroupC);
			//console.log(handItems);
			
            var cardGroupAIds = this.getItemIds(cardGroupA);
            var cardGroupBIds = this.getItemIds(cardGroupB);
            var cardGroupCIds = this.getItemIds(cardGroupC);
//			var handItemIds = this.getItemIds(handItems);
			var handItemIds = this.getItemIds(cardGroupJoker);

console.log("[bmc] cardIdsA: " + cardGroupAIds);
console.log("[bmc] cardIdsB: " + cardGroupBIds);
console.log("[bmc] cardIdsC: " + cardGroupCIds);
console.log("[bmc] handItemIds: " + handItemIds);

			var [boardCard, boardArea, boardPlayer] = this.getSelectedDownAreaCards();

console.log( boardCard );
console.log( boardArea );
console.log( boardPlayer );
console.log( handItemIds );
			let boardCardId = ( boardCard['id'] === undefined) ? '' : boardCard['id'];
console.log( boardCardId );

			this.playerHand.unselectAll();
			this.action_playerGoDown(
				cardGroupAIds,
				cardGroupBIds,
				cardGroupCIds,
				boardCardId,
				boardArea,
				boardPlayer,
				handItemIds
			);
//            this.action_playSeveralCards(cardIds);
		},
/////////
/////////
/////////
		action_playerGoDown: function(
			cardGroupA,
			cardGroupB,
			cardGroupC,
			boardCardId,
			boardArea,
			boardPlayer,
			handItems
			) {
			console.log("[bmc] action_playerGoDown");

            // var params = {};
            // if (args) {
                // for (var key in args) {
                    // params[key] = args[key];
                // }
            // }
            // params.lock = true;
// console.log("[bmc] params: ");
// console.log(params);

console.log( cardGroupA );

			var newAction = 'actPlayerGoDown';
						
			this.bgaPerformAction( newAction, { // 'actPlayerGoDown'
			  cardIDGroupA: cardGroupA.join(','),
			  cardIDGroupB: cardGroupB.join(','),
			  cardIDGroupC: cardGroupC.join(','),
			  boardCardId: boardCardId,
			  boardArea: boardArea,
			  boardPlayer: boardPlayer,
			  handItemIds: handItems.join(','),
			});

			// this.bgaPerformAction( newAction, {
                // cardGroupA: this.toNumberList( cardGroupA ),
                // cardGroupB: this.toNumberList( cardGroupB ),
                // cardGroupC: this.toNumberList( cardGroupC ),
				// boardCardId: boardCardId,
				// boardArea: boardArea,
				// boardPlayer: boardPlayer,
				// handItems: this.toNumberList( handItems )
            // });
            // this.sendAction('playerGoDown', {
                // cardGroupA: this.toNumberList( cardGroupA ),
                // cardGroupB: this.toNumberList( cardGroupB ),
                // cardGroupC: this.toNumberList( cardGroupC ),
				// boardCardId: boardCardId,
				// boardArea: boardArea,
				// boardPlayer: boardPlayer,
				// handItems: this.toNumberList( handItems )
            // });
		},
/////////
/////////
/////////
		showReviewButton : function( player_id ) {
console.log("[bmc] ENTER showReviewButton");
console.log( $('close_btn'));
console.log( player_id );

			this.buttonMessage = _('Deal me in!');
			
			if ( $('close_btn') != null ) {
console.log( $('close_btn').innerHTML );
				if ( $('close_btn').innerHTML.includes( 'Game Over!' )) {
					this.buttonMessage = _("Final Standings") ;
					this.onPlayerReviewedHandButton(); // click the 'review' button for them so it ends faster
				}
			}
			var reviewButtonID = 'buttonReview' + this.player_id;

			var isReadOnly = this.isReadOnly();
			if ( !isReadOnly ) { // Spectators are read only, no need to show buttons
				if ( this.dealMeInClicked == false && $(reviewButtonID) == null ) {
					this.addActionButton( reviewButtonID, _( this.buttonMessage ), 'onPlayerReviewedHandButton' );
				}
			}
		},
/////////
/////////
/////////
		notif_cardPlayed : function( notif ) {
console.log("[bmc]notif_cardPlayed");
            this.cardWasPlayed(
				notif.args.card_id,
				notif.args.player_id,
				notif.args.color,
				notif.args.value,
				notif.args.boardArea,
				notif.args.boardPlayer,
				notif.args.allHands
			);
console.log("[bmc] notif_cardPlayed Done.");
		},
/////////
/////////
/////////
};
