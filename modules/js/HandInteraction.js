// LiverpoolRummy HandInteraction Mixin
var LRHandInteraction = {
		onMyHandAreaClick : function() {
console.log("[bmc] ENTER onMyHandAreaClick");
			this.cancelHeldCard();
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
				var el = $('myhand_item_' + this.heldCardId);
				if ( el ) {
					dojo.removeClass( el, 'card-held' );
				}
				this.heldCardId = null;
			}
		},
/////////
/////////
/////////
		// Sets up a capture-phase click listener on the hand container so we know
		// exactly which card (by DOM id → card id) was clicked, regardless of how
		// BGA's stock groups identical-type items for selection purposes.
		setupHandHoldListener : function() {
			$('myhand').addEventListener('click', dojo.hitch(this, function(evt) {
				var target = evt.target;
				while ( target && target.id !== 'myhand' ) {
					if ( target.id && target.id.indexOf('myhand_item_') === 0 ) {
						this.onHandCardHoldClick( target.id.replace('myhand_item_', ''), evt );
						return;
					}
					target = target.parentElement;
				}
				// Clicked the hand area but not a card — cancel any active hold
				this.cancelHeldCard();
			}), true); // capture phase fires before BGA's bubble listeners
		},
/////////
/////////
/////////
		onHandCardHoldClick : function( cardId, evt ) {
console.log("[bmc] onHandCardHoldClick cardId:", cardId, "heldCardId:", this.heldCardId);

			if ( !this.heldCardId ) {
				// Nothing held → pick up this card
				this.heldCardId = cardId;
				dojo.addClass( 'myhand_item_' + cardId, 'card-held' );
				// Don't stop propagation — let BGA select the card so Discard button appears

			} else if ( String(this.heldCardId) === String(cardId) ) {
				// Same card clicked again → put it down / cancel
				this.cancelHeldCard();
				// Don't stop propagation — let BGA deselect normally

			} else {
				// Different card clicked → move held card to this position
				var allItems = this.playerHand.getAllItems();
				var heldItem = null, targetItem = null;
				for ( var i = 0; i < allItems.length; i++ ) {
					if ( String(allItems[i].id) === String(this.heldCardId) ) heldItem   = allItems[i];
					if ( String(allItems[i].id) === String(cardId)          ) targetItem = allItems[i];
				}
				if ( heldItem && targetItem ) {
					this.playerHand.firstSelected = heldItem.type;
					this.sortHand( [heldItem, targetItem] );
				}
				this.cancelHeldCard();
				this.playerHand.unselectAll();
				evt.stopPropagation(); // Prevent BGA from re-selecting after the move
			}
		},
/////////
/////////
/////////
		clearButtons : function () {
console.log( "[bmc] ENTER clearButtons" );
		    this.removeActionButtons(); // Remove the button because they discarded
			dojo.replaceClass( 'buttonBuy',    "bgabutton_gray", "bgabutton_red" );
			dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" );
		},
/////////
/////////
/////////
		onPlayerDiscardButton : function() {
console.log( "[bmc] ENTER onPlayerDiscardButton" );
			var selectedDiscards = this.playerHand.getSelectedItems();
console.log("selectedDiscards:", selectedDiscards);
			this.playerHand.unselectAll();
			this.reallyDiscard( selectedDiscards );
console.log( "[bmc] EXIT onPlayerDiscardButton" );
		},
/////////
/////////
/////////
		reallyDiscard : function( selectedDiscards ) {
console.log( "[bmc] ENTER reallyDiscard" );
			this.cancelHeldCard(); // Always clear hold state when discarding
			this.discardPileOne.unselectAll();
			this.playerHand.unselectAll();
			this.clearButtons();

			var card = selectedDiscards[0];
			console.log(card);

			this.firstLoad = 'No';

			if ( typeof card !== "undefined" ) {
				var card_id = card.id;
console.log("[bmc] Discarding card:", card_id);

				var newAction = 'actDiscardCard';
				this.playerHand.unselectAll();

				this.bgaPerformAction( newAction, {
					player_id : this.player_id,
					card_id   : card_id,
				});
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
console.log( items.length );
			// Track firstSelected for sortHand's swap-order logic
			if ( items.length > 0 ) {
				this.playerHand.firstSelected = items[0].type;
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
