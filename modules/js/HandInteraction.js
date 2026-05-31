// LiverpoolRummy HandInteraction Mixin
var LRHandInteraction = {
		onMyHandAreaClick : function() {
console.log("[bmc] ENTER onMyHandAreaClick");
			this.cancelHeldCard();
			this.unselectAllCards();
			this.someoneLP = false;
			var handCards = this.playerHand.getAllItems();
			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}
			this.showHideButtons();
console.log("[bmc] EXIT onMyHandAreaClick");
		},
/////////
/////////
/////////
		cancelHeldCard : function() {
			if ( this.heldCardId ) {
				var el = $('myhand_item_' + this.heldCardId);
				if ( el ) dojo.removeClass( el, 'card-held' );
				this.heldCardId = null;
			}
		},
/////////
/////////
/////////
		unselectAllCards : function() {
			for ( var i = 0; i < this.selectedCardIds.length; i++ ) {
				var el = $('myhand_item_' + this.selectedCardIds[i]);
				if ( el ) dojo.removeClass( el, 'card-selected' );
			}
			this.selectedCardIds = [];
		},
/////////
/////////
/////////
		// Sets up custom hand selection, bypassing BGA's type-based selection.
		// - Mode 0 disables BGA's built-in selection visuals.
		// - getSelectedItems is patched so all existing prep/discard code keeps working.
		// - unselectAll is patched so prep buttons also clear our custom state.
		// - A capture-phase listener identifies clicked cards by DOM id (works for
		//   identical cards that share the same BGA type).
		setupHandHoldListener : function() {
			var self = this;

			// Disable BGA's type-based selection entirely
			this.playerHand.setSelectionMode(0);

			// Patch getSelectedItems so existing code (prep, discard, showHideButtons)
			// works against our selectedCardIds array instead of BGA's internal state.
			this.playerHand.getSelectedItems = function() {
				var allItems = self.playerHand.getAllItems();
				return allItems.filter(function(item) {
					return self.selectedCardIds.indexOf(String(item.id)) !== -1;
				});
			};

			// Patch unselectAll so prep/discard button handlers also clear our state.
			var origUnselectAll = this.playerHand.unselectAll.bind(this.playerHand);
			this.playerHand.unselectAll = function() {
				origUnselectAll();
				self.cancelHeldCard();
				self.unselectAllCards();
			};

			// Capture-phase listener: fires before BGA's bubble listeners, knows
			// exactly which card was clicked by DOM element id.
			$('myhand').addEventListener('click', function(evt) {
				var target = evt.target;
				while ( target && target.id !== 'myhand' ) {
					if ( target.id && target.id.indexOf('myhand_item_') === 0 ) {
						self.onHandCardHoldClick( target.id.replace('myhand_item_', ''), evt );
						return;
					}
					target = target.parentElement;
				}
				// Clicked empty hand area
				self.cancelHeldCard();
				self.unselectAllCards();
				self.showHideButtons();
			}, true); // capture phase
		},
/////////
/////////
/////////
		// State machine:
		//   unselected  → click          → selected (red outline)
		//   selected    → click same     → held (blue, elevated)
		//   held        → click same     → deselect everything
		//   held        → click other    → sort held card to that position
		//   selected    → click other    → add that card to selection (multi-select for prep)
		onHandCardHoldClick : function( cardId, evt ) {
console.log("[bmc] onHandCardHoldClick cardId:", cardId, "heldCardId:", this.heldCardId);
			var el = $('myhand_item_' + cardId);
			if ( !el ) { this.showHideButtons(); return; }

			// Clicking any card clears the "new card" green highlight
			var allHandCards = this.playerHand.getAllItems();
			for ( var k = 0; k < allHandCards.length; k++ ) {
				var hel = $('myhand_item_' + allHandCards[k].id);
				if ( hel ) dojo.removeClass( hel, 'stockitem_newcard' );
			}

			if ( this.heldCardId ) {
				if ( String(this.heldCardId) === String(cardId) ) {
					// Click held card again → cancel hold and deselect everything
					this.cancelHeldCard();
					this.unselectAllCards();
				} else {
					// Click different card → sort held card to this position
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
					this.unselectAllCards();
				}
			} else if ( this.selectedCardIds.indexOf(String(cardId)) !== -1 ) {
				// Already selected (red) → enter hold mode (blue, elevated)
				// Clear other red selections but KEEP this card in selectedCardIds
				// so getSelectedItems() still returns it for discard/board-play.
				var others = this.selectedCardIds.filter(function(id) { return id !== String(cardId); });
				for ( var j = 0; j < others.length; j++ ) {
					var oEl = $('myhand_item_' + others[j]);
					if ( oEl ) dojo.removeClass( oEl, 'card-selected' );
				}
				this.selectedCardIds = [String(cardId)]; // keep only this one
				dojo.removeClass( el, 'card-selected' );
				dojo.addClass( el, 'card-held' );
				this.heldCardId = cardId;
			} else {
				// Not selected → add to selection (red outline)
				this.selectedCardIds.push( String(cardId) );
				dojo.addClass( el, 'card-selected' );
			}

			this.showHideButtons();
		},
/////////
/////////
/////////
		clearButtons : function () {
console.log( "[bmc] ENTER clearButtons" );
		    this.removeActionButtons();
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
			this.playerHand.unselectAll(); // clears selectedCardIds + cancelHeldCard via patch
			this.reallyDiscard( selectedDiscards );
console.log( "[bmc] EXIT onPlayerDiscardButton" );
		},
/////////
/////////
/////////
		reallyDiscard : function( selectedDiscards ) {
console.log( "[bmc] ENTER reallyDiscard" );
			this.cancelHeldCard();
			this.unselectAllCards();
			this.discardPileOne.unselectAll();
			this.clearButtons();

			var card = selectedDiscards[0];
			this.firstLoad = 'No';

			if ( typeof card !== "undefined" ) {
				var card_id = card.id;
console.log("[bmc] Discarding card:", card_id);
				this.bgaPerformAction( 'actDiscardCard', {
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
			// Double-click is a fallback; primary sort UX is click-to-hold via onHandCardHoldClick.
			var cards = this.playerHand.getSelectedItems();
			if ( cards && cards.length === 2 ) {
				this.onPlayerSortButton2( cards );
			}
console.log("[bmc] EXIT onPlayerHandDoubleClick");
		},
/////////
/////////
/////////
        onPlayerHandSelectionChanged : function() {
			// With setSelectionMode(0), BGA may still fire this; use patched getSelectedItems.
			console.log("[bmc] onPlayerHandSelectionChanged");
			var items = this.playerHand.getSelectedItems();
			var handCards = this.playerHand.getAllItems();
			for ( let i in handCards ) {
				dojo.removeClass('myhand_item_' + handCards[i]['id'], 'stockitem_newcard');
			}
			if ( items.length > 0 ) {
				this.playerHand.firstSelected = items[0].type;
			}
			this.showHideButtons();
        },
/////////
/////////
/////////
};
