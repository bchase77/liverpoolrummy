// LiverpoolRummy UIHelpers Mixin
var LRUIHelpers = {
	      discardCard : function( player_id, color, value, card_id, nextTurnPlayer, allHands, discardSize, drawDeckSize ) {
//        discardCard : function( player_id, color, value, card_id, nextTurnPlayer, allHands, discardSize, drawDeckSize, buyers ) {
		// (from PHP) Purpose is to show the played cards on the table, not really to play the card.
		// Playing of the card is done on the server side (PHP).
console.log( "[bmc] ENTER discardCard" );
console.log( player_id );
console.log( this.player_id );
console.log( nextTurnPlayer );
console.log( color );
console.log( value );
console.log( card_id );
console.log( allHands );
console.log( discardSize );
console.log( drawDeckSize );
console.log( "discardPile and playerhand:" );
console.log( this.discardPileOne );
console.log( this.playerHand );

			// Clear the buy status because a new card has been discarded
			this.buyRequested = false;
			
			// Set status to resolving buys to give the PHP database time to clear
			this.resolvingBuyers = true;

			// If it is us, play a special sound and show an alert
//			this.displayItsYourTurn( this.gamedatas.playerOrderTrue[ player_id ], 'nextturn' );
			this.displayItsYourTurn( nextTurnPlayer, 'nextturn' );

			// Change the player in JS after the discard (gamedatas is not updated automatically)
			this.gamedatas.activeTurnPlayer_id = nextTurnPlayer;

			// Adjust all hand card-counts because of the discard
			for ( var p_id in allHands ) {
				this.handCount[ p_id ].setValue( allHands[ p_id ] );
			}

			// Set the draw deck and discard pile size for players to see
			this.discardSize.setValue( discardSize );
			this.drawDeckSize.setValue( drawDeckSize );
			
			if ( allHands[ this.player_id ] != undefined ) {
				this.myHandSize.setValue( allHands[ this.player_id ] );
			} else {
				this.myHandSize.setValue( 0 );
			}

			// Remove any existing discard pile card
			//if ( this.discardPile.items.length > 0 ) {
			//	this.discardPile.removeFromStockById( this.discardPile.items[ 0 ].id );
			//}

console.log( "this.discardPileOne" );
console.log( this.discardPileOne );

			// Remove any cards already in the discard pile
			this.discardPileOne.removeAll();
			
			// Add it to the pile and set the weight
			let cardUniqueId = this.getCardUniqueId( color, value );
			console.log( cardUniqueId );
			
			if ( player_id == this.player_id ) {
//				this.discardPile.addToStockWithId( cardUniqueId, card_id, 'myhand' );
				this.discardPileOne.addToStockWithId( cardUniqueId, card_id, 'myhand' );

			} else {
//				this.discardPile.addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + player_id );
				this.discardPileOne.addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + player_id );
			}
			
console.log( this.discardPileOne );

			// NEW FEATURE 4/24/2021. Make discard pile only 1 card
//			if ( this.discardPile.length > 1 ) {
//				this.discardPile = this.discardPile[this.discardPile.length - 1 ];
//			}
			if ( this.gamedatas.playerOrderTrue[ player_id ] == this.player_id ) {
//				var dp_items = this.discardPile.getAllItems();
				var dp_items = this.discardPileOne.getAllItems();
console.log("[bmc] ALL discardPile:");
console.log( dp_items );
				for ( let i in dp_items ) {
//					dojo.addClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
					dojo.addClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
				}
			}
			
			// Discarding a card means the turn shifts to the next player
			this.turnPlayer = player_id;

console.log( player_id );
console.log( this.player_id );

			if ( this.player_id == player_id ) {
console.log("[bmc] Card played by me");
                // You played a card. If it exists in your hand, move card from there and remove
                // corresponding item
                if ($('myhand_item_' + card_id)) {
console.log("[bmc] Was in hand");

//                    this.placeOnObject('myhand_item_' + card_id, 'discardPile');
                    // this.placeOnObject('myhand_item_' + card_id, 'discardPileOne');
                    this.playerHand.removeFromStockById(card_id);
                }
            } else {
				// Then we are the next player, who gets to draw it for free; No need for BUY buttons
				console.log( "[bmc] I am the 'Next Player' who can draw the discard for free" );
			}
			
			// Clear out if anyone declared LP
			this.someoneLP = false;
			this.iDeclaredLP = false;
			console.log( "Setting someoneLP false");
			
console.log("[bmc] EXIT discardCard");
        },
/////////
/////////
/////////
		arraymove : function (arr, fromIndex, toIndex) {
			var element = arr[fromIndex];
			arr.splice(fromIndex, 1);
			console.log("::"+arr);
			arr.splice(toIndex, 0, element);
		},
/////////
/////////
/////////
		isReadOnly: function () { // Check if spectator or not
//		  return this.isSpectator || typeof g_replayFrom != "undefined" || g_archive_mode;
		  return this.isSpectator || typeof g_replayFrom != "undefined" || g_archive_mode;
		},
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Player's action
        
        
        // Here, you are defining methods to handle player's action (ex: results
		// of mouse click on game objects).
            
            // Most of the time, these methods:
            // _ check the action is possible at this game state.
            // _ make a call to the game server
        
		// The left-ist thing in the draw pile is called drawPile_item_1. The next is drawPile_item_2.
		// The left-ist thing in the player's hand is called myhand_item_1. The next is myhand_item_2.
        
        // Example:
        
        // onMyMethodToCall1: function( evt )
        // {
			// function remove because the project analyzer wouldn't pass
        // },        
        
/////////
/////////
/////////
		showHideButtons : function() {
console.log("[bmc] ENTER ShowHideButtons");
			let buyButtonID = 'buttonBuy';
			// let notBuyButtonID = 'buttonNotBuy';
// console.log( "[bmc] BUTTONIDs:" );
// console.log( notBuyButtonID );

			this.clearButtons();

			// Only show the buy buttons if they already don't exist
			
			var showButtons = new Array();
			
// console.log("this.playerSortBy");
// console.log(this.playerSortBy);
			
			
			if ( this.goneDown[ this.player_id ] == 0 ) {
				var items = this.playerHand.getSelectedItems();
				if ( items.length > 0 ) {
	// console.log("[bmc] prepbuttons ON");
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_blue", "bgabutton_gray" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_blue", "bgabutton_gray" );
					
				} else {
	// console.log("[bmc] prepbuttons OFF");
					// dojo.replaceClass( 'buttonPrepAreaA', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
					// dojo.replaceClass( 'buttonPrepAreaB', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepAreaC', "bgabutton_gray", "bgabutton_blue" );
					// dojo.replaceClass( 'buttonPrepJoker', "bgabutton_gray", "bgabutton_blue" );
				}
			}
			
// console.log( "[bmc] Player:" );
// console.log( this.player_id );
// console.log( this.gamedatas.gamestate.active_player );
// console.log( this.gamedatas.activeTurnPlayer_id );

			if ( this.gamedatas.gamestate.active_player == this.player_id ) {
				showButtons['myturn'] = true;
				// console.log("[bmc] playerOrderTrue[0] == this.player_id (my turn)");
				
			} else {
				// console.log("[bmc] not playerOrderTrue[0] == this.player_id (not my turn)");
			}

			// console.log(this.player_id);
			// console.log(this.goneDown[this.player_id]);

			showButtons['goneDown'] = (parseInt( this.goneDown[ this.player_id ]) === 1 ) ? true : false;
			
			// Show SORT button if a player has a card selected
			var items = this.playerHand.getSelectedItems();
			
			if ( items.length >= 1 ) {
				showButtons['handSelected'] = true;
				if ( items.length > 2 ) {
					showButtons['twoOrMore'] = true;
				}
				if ( items.length == 2 ) {
					showButtons['twoOrMore'] = true;
					//this.addActionButton( 'buttonPlayerSort', _("Sort!"), 'onPlayerSortButton');
				}
			}

			if ( this.prepRunLoc + this.prepSetLoc > 3) { // Starting positions are 0 and 3
				showButtons['prepped'] = true;
			}

			// console.log("[bmc] showButtons:");
			// console.log(showButtons);
			console.log(this.prepAreas);
			//
			// Show GO DOWN button if prepped, not gone down and my turn
			//
			// var goDownDOM = document.getElementById( 'buttonPlayerGoDown' );

			if (( this.prepAreas > 0 ) &&
				 !showButtons['goneDown'] &&
				  showButtons['myturn'] && 
				( this.gamedatas.gamestate.name != "playerTurnDraw" )) {
				// ( this.gamedatas.gamestate.name != "playerTurnDraw" ) &&
				// ( goDownDOM == null )) {

				dojo.replaceClass( 'buttonGoDownStatic', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				//this.addActionButton( 'buttonPlayerGoDown', _("Go Down!"), 'onPlayerGoDownButton' );
				// this.showingButtons === 'Yes';
			} else {
				dojo.replaceClass( 'buttonGoDownStatic', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			}
			//
			// Show DISCARD if card selected, it's not state playerTurnDraw, and it's my turn
			//
			if ( showButtons['handSelected'] && 
				 showButtons['myturn'] &&
			   ( items.length == 1 ) &&
			   ( this.gamedatas.gamestate.name != "playerTurnDraw" )) {
				   
				this.addActionButton('buttonPlayerDiscard', _("Discard!"), 'onPlayerDiscardButton');
				// this.showingButtons === 'Yes';
			}
		// console.log("[bmc] EXIT ShowHideButtons");
		},
/////////
/////////
/////////
		clearTable : function() {
			// At the start of each hand give everyone time to see the first discard
			// And clear the knowledge that they've reviewed the past hand.
			this.firstLoad = 'Yes';
			this.handReviewed = 'No';
			
            // We received a new full hand of cards. Clear the table.
            this.playerHand.removeAll();
			//this.discardPile.removeAll();
			this.discardPileOne.removeAll();
			//this.deck.removeAll();
			
			for (var player in this.gamedatas.players) {
				this.downArea_A_[ player ].removeAll();
				this.downArea_B_[ player ].removeAll();
				this.downArea_C_[ player ].removeAll();
				dojo.removeClass( 'overall_player_board_' + player, 'playerWentDown' );

				this.goneDown[ player ] = 0;
			}
			
			this.myPrepA.removeAll();
			this.myPrepB.removeAll();
			this.myPrepC.removeAll();
			
			this.myPrepJoker.removeAll();
			dojo.removeClass('myPrepA', "buyerLit");
			dojo.removeClass('myPrepB', "buyerLit");
			dojo.removeClass('myPrepC', "buyerLit");
			dojo.removeClass('myPrepJoker', "buyerLit");

			this.prepSetLoc = 0; // Nothing is prepped, so clear the counters
			this.prepRunLoc = 3;
console.log("[bmc] Clear this.prepAreas1");
			this.prepAreas = 0;
		},
/////////
/////////
/////////
		setupDiscardPile : function(notif) {
console.log("[bmc] Enter setupDiscardPile");
console.log(notif);
			// Set up the discard pile
			var discardPileWeights = new Array();

			if ( notif.args.discardPile != undefined ) {
				for ( let i in notif.args.discardPile ) {
					console.log("[bmc] NEW DISCARD PILE");
					let card = notif.args.discardPile[i];
					let color = card.type;
					let value = card.type_arg;
					
					this.discardPileOne.addToStockWithId( this.getCardUniqueId(color, value), i );
					
					//Now Have discardPileOne. So 7/10/2021 Took the teeth out of this routine.
					//this.discardPile.addToStockWithId( this.getCardUniqueId( color, value ), card.id );
					let location_arg = parseInt( notif.args.discardPile[ i ][ 'location_arg' ]);
					discardPileWeights[ this.getCardUniqueId( color, value )] = location_arg;
				}
				// Set the weights in the discard pile
				// Now have discardpileOne
//				this.discardPile.changeItemsWeight(discardPileWeights);
				
			// NEW FEATURE 4/24/2021. Make discard pile only 1 card
//			if ( this.discardPile.length > 1 ) {
//				this.discardPile = this.discardPile[this.discardPile.length - 1 ];
//			}			

	console.log("[bmc] this.discardPile");			
	console.log(this.discardPileOne);

				// Set to show the count of cards in the discard pile
				this.discardSize.setValue( notif.args.discardSize );
			}
		},
/////////
/////////
/////////
		setupDeck : function(notif) {
			// Set up the draw deck
			// if ( notif.args.deck != undefined ) {
				// for ( let i = 0 ; i < notif.args.deck.length; i++ ) {
					// this.deck.addToStockWithId( 1, notif.args.deck[i] );
				// }
			// }
			if ( notif.args.drawDeckSize != undefined ) {
				this.drawDeckSize.setValue( notif.args.drawDeckSize );
			}
//console.log("[bmc] this.deck");			
//console.log(this.deck);
		},
/////////
/////////
/////////
		clearPlayerBoards : function(notif) {
			console.log("[bmc] ENTER clearPlayerBoards");
			var isReadOnly = this.isReadOnly();
			console.log("isReadOnly");
			console.log(isReadOnly);
			console.log(this.player_id);
			
			if ( !isReadOnly ) { // if not spectator
				dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
				dojo.removeClass('playerDown_B_' + this.player_id, "buyerLit");
				dojo.removeClass('playerDown_C_' + this.player_id, "buyerLit");
			}

			if ( notif.args.buyCount != undefined ) {
				for ( var player_id in this.gamedatas.players ) {
console.log("[bmc] Updating buys and cards");
					this.buyCount[ player_id ].setValue( notif.args.buyCount[ player_id ] );
					this.handCount[ player_id ].setValue( notif.args.allHands[ player_id ] );
				}
			}
			console.log("[bmc] EXIT clearPlayerBoards");
		},
/////////
/////////
/////////
        notif_newHand : function(notif) {
console.log("[bmc] ENTER notif_newHand");
console.log(notif);
			
			this.gamedatas.liverpoolExists = false;

			this.dealMeInClicked = false;

			if ( notif.args.setsNeeded != null ){ // Set the targets, if there are values there
console.log("Save Sets and Runs");
				this.gamedatas.setsNeeded = notif.args.setsNeeded;
				this.gamedatas.runsNeeded = notif.args.runsNeeded;
			}

			if ( notif.args.hand == undefined ) {
console.log("Hand is undefined");
				this.clearTable();
				this.setupDiscardPile(notif);
				this.setupDeck(notif);
				this.clearPlayerBoards(notif);
				
// TODO: This function returns too soon, from either IF condition.
				var isReadOnly = this.isReadOnly();
				if ( !isReadOnly ) { // Spectators are read only
					return; // If not spectator then wait for a hand.
				} else {
console.log("[bmc] Spectator, so not returning; Redraw the board.");
				}
				
			} else 	if ( notif.args.hand != undefined ) {
				if (notif.args.hand.length == 0 ) { // if it's just notify for the history log, do nothing
console.log("empty arg");
					return;
				}
			}
			this.clearTable();
			this.setupDiscardPile(notif);
			this.setupDeck(notif);
			this.clearPlayerBoards(notif);

console.log("Set up players new hand");

			//var isReadOnly = this.isReadOnly();
			//if ( !isReadOnly ) { // Spectators are read only
			if ( notif.args.hand != undefined )  {
				// Set up the new hand for the player
				for ( let i in notif.args.hand) {
					let card = notif.args.hand[i];
					let color = card.type;
					let value = card.type_arg;
					this.playerHand.addToStockWithId( this.getCardUniqueId( color, value ), card.id );
				}

				if ( notif.args.allHands != null ) {
					this.myHandSize.setValue( notif.args.allHands[ this.player_id ] );
				}
	console.log("[bmc] this.playerHand");			
	console.log(this.playerHand);
			}

			// Set all players to buy, except for the player whose turn it is, and light them green
			if ( this.player_id != this.gamedatas.playerOrderTrue[ notif.args.dealer_id ] ) {
				this.buyCounterTimerShouldExist = 'Yes'; // A timer and a button should exist
				this.showBuyButton2();

				dojo.removeClass('myhand_wrap', "borderDrawer");				
			} else { // It's this player's turn
				dojo.addClass('myhand_wrap', "borderDrawer");				
				
				// Notify them it's their turn
				this.showMessage( _( "It's Your Draw!"), 'error' ); // 'info' or 'error'
				if ( this.voices ) {
					playSound( 'tutorialrumone_itsyourdraw' );
					this.disableNextMoveSound();
				}
			}

			// Set the hand counts for all players
			for ( var p_id in notif.args.allHands ) {
				this.handCount[ p_id ].setValue( notif.args.allHands[ p_id ] );
			}
			
			// this.buyTimeInSeconds = 40;
			
			// Draw the names on the board
			for ( var player in this.gamedatas.players) {
				$("playerDown_A_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_B_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
				$("playerDown_C_"+ player).innerHTML = this.gamedatas.players[ player ][ 'name' ];
			}

//			var mystring_translated = _("my string");  
			
			$('myPrepA').innerHTML = _("Prep A");
			$('myPrepB').innerHTML = _("Prep B");
			$('myPrepC').innerHTML = _("Prep C");
			$('myPrepJoker').innerHTML = _("Card For Joker");

			// Update the webpage with the new target

			this.currentHandType = notif.args.updCurrentHandType;
			this.totalHandCount = notif.args.updTotalHandCount;
			this.currentHandNumber = parseInt (this.currentHandType) + 1;
			
			$(handNumber).innerHTML = _("Target Hand ") + this.currentHandNumber + _(" of ") + this.totalHandCount + ": ";

			console.log( $(handNumber) );

			$(redTarget).innerHTML = notif.args.handTarget;

			console.log( $(redTarget) );

			console.log( this.gamedatas.setsNeeded );
			console.log( this.gamedatas.runsNeeded );

			console.log("[bmc] EXIT notif_newHand");
        },
/////////
/////////
/////////
};
