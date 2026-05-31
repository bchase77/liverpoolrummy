// LiverpoolRummy HandInteraction Mixin
var LRHandInteraction = {
		onMyHandAreaClick : function() {
console.log("[bmc] ENTER onMyHandAreaClick");
			this.handAreaClicked = true; // tell onPlayerHandSelectionChanged this was an empty-area click
			this.playerHand.unselectAll();
			this.someoneLP = false;

			var handCards = this.playerHand.getAllItems();
			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}
console.log("[bmc] EXIT onMyHandAreaClick");
		},
/////////
/////////
/////////
		cancelHeldCard : function() {
			if ( this.heldCardId ) {
				dojo.removeClass( 'myhand_item_' + this.heldCardId, 'card-held' );
				this.heldCardId = null;
			}
			this.prevSelectedCardId = null;
		},
/////////
/////////
/////////
		clearButtons : function () {
console.log( "[bmc] ENTER clearButtons" );
		    this.removeActionButtons(); // Remove the button because they discarded
			// dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			// dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove

			dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
			dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove

			// this.showingButtons === 'No';
		},
/////////
/////////
/////////		
		onPlayerDiscardButton : function() {
console.log( "[bmc] ENTER onPlayerDiscardButton" );
			let action = "reallyDiscard";
console.log( this.prepAreas );

			var selectedDiscards = this.playerHand.getSelectedItems();
console.log("selectedDiscards:");
console.log(selectedDiscards);
			// If cards are in prep area, double check that the really want to discard and not go down.
			// if (( this.prepAreas > 0 ) &&
				// ( this.goneDown[ this.player_id ] == 0 ) &&  //0 = Not gone down; 1 = Gone down.
				// ( selectedDiscards.length != 0 )) { // Only show dialog when there's a card
// console.log ("[bmc] CONFIRM");
				// this.confirmationDialog( _('Are you sure you want to discard? You have cards prepped.'),
							 // dojo.hitch( this, function() {
								// this.playerHand.unselectAll();
								// this.reallyDiscard( selectedDiscards );
							// }));
			// } else { // nothing prepped so discard the card
console.log ("[bmc] Just discard");
			this.playerHand.unselectAll();
			this.reallyDiscard( selectedDiscards );
			// }
console.log( "[bmc] EXIT onPlayerDiscardButton" );
		},
/////////
/////////
/////////		
		reallyDiscard : function( selectedDiscards ) {
console.log( "[bmc] ENTER reallyDiscard" );
console.log( this.player_id );
console.log("selectedDiscards:");
console.log(selectedDiscards);
			//this.discardPile.unselectAll();
			this.discardPileOne.unselectAll();
			this.playerHand.unselectAll();

			this.clearButtons();
//		    this.removeActionButtons(); // Remove the button because they discarded
//			this.showingButtons === 'No';
			
//			var card = this.playerHand.getSelectedItems()[ 0 ]; // It must be 1 card only
			var card = selectedDiscards[0];
			console.log(card);
			
			this.firstLoad = 'No'; // Since we're discarding, enable future timers
			
			if ( typeof card !== "undefined" ) {
				// console.log("[bmc] destroy button!");
				// dojo.destroy('currentPlayerPlayButton_id');

				var card_id = card.id;                    

console.log("[bmc] Discarding card!");
console.log( card_id );

				// let action = 'discardCard';
				var newAction = 'actDiscardCard';
				
				this.playerHand.unselectAll();

				this.bgaPerformAction( newAction, { // 'actDiscardCard'
					player_id : this.player_id,
					card_id : card_id,
				});

				// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
					// id : card_id,
					// player_id: this.player_id,
					// lock : true
				// }, this, function(result) {
				// }, function(is_error) {
				// });
// console.log("[bmc] Did ajaxcall.");

				// this.playerHand.unselectAll();
			}
		},
/////////
/////////
/////////
		onPlayerHandDoubleClick : function() {
console.log("[bmc] ENTER onPlayerHandDoubleClick");
            var cards = this.playerHand.getSelectedItems();
console.log( cards );
			if ( cards ) {
//				this.onPlayerDiscardButton();
				this.onPlayerSortButton2( cards );
			}
console.log("[bmc] EXIT onPlayerHandDoubleClick");
		},
/////////
/////////
/////////
        onPlayerHandSelectionChanged : function() {
			console.log("[bmc] ENTER onPlayerHandSelectionChanged");
			var items = this.playerHand.getSelectedItems();

			var handCards = this.playerHand.getAllItems();
			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}
console.log( items );
console.log( items.length );

			if ( items.length === 0 ) {

				if ( this.handAreaClicked ) {
					// Empty area was clicked — cancel everything
					this.handAreaClicked = false;
					this.cancelHeldCard();

				} else if ( this.heldCardId ) {
					// Already in hold mode and card was re-deselected — cancel hold
					this.cancelHeldCard();

				} else if ( this.prevSelectedCardId ) {
					// Player re-clicked (toggled off) their selected card → enter hold mode
					this.heldCardId = this.prevSelectedCardId;
					this.prevSelectedCardId = null;
					dojo.addClass( 'myhand_item_' + this.heldCardId, 'card-held' );
					this.showHideButtons();
					console.log("[bmc] EXIT onPlayerHandSelectionChanged (hold mode entered)");
					return;

				} else {
					this.cancelHeldCard();
				}

			} else if ( items.length === 1 ) {

				var clickedId = items[0].id;

				if ( this.heldCardId && clickedId !== this.heldCardId ) {
					// A card is held and a different card was clicked → sort
					var allItems = this.playerHand.getAllItems();
					var heldItem = null;
					for ( var i = 0; i < allItems.length; i++ ) {
						if ( allItems[i].id === this.heldCardId ) { heldItem = allItems[i]; break; }
					}
					if ( heldItem ) {
						this.playerHand.firstSelected = heldItem.type;
						this.sortHand( [heldItem, items[0]] );
					}
					this.cancelHeldCard();
					this.playerHand.unselectAll();
					this.showHideButtons();
					console.log("[bmc] EXIT onPlayerHandSelectionChanged (sorted)");
					return;

				} else if ( this.heldCardId && clickedId === this.heldCardId ) {
					// Player clicked the held (deselected) card → cancel hold
					this.cancelHeldCard();

				} else {
					// Normal single selection — track for possible hold on re-click
					this.prevSelectedCardId = clickedId;
					this.playerHand.firstSelected = items[0].type;
				}

			} else {
				// 2+ cards selected — cancel hold, normal multi-select (prep / meld play)
				this.cancelHeldCard();
				this.prevSelectedCardId = null;
			}

			this.showHideButtons();
			console.log("[bmc] EXIT onPlayerHandSelectionChanged");
        },
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

            // setupNotifications:
            
            // In this method, you associate each of your game notifications with
			// your local method to handle it.
            
            // Note: game notification names correspond to "notifyAllPlayers" and
			// "notifyPlayer" calls in your *.game.php file.
        
};
