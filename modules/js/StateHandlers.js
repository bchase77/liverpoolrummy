// LiverpoolRummy StateHandlers Mixin
var LRStateHandlers = {
        onEnteringState: function( stateName, args ) {
            console.log( 'ENTER onEnteringState: ' + stateName );
			console.log( args );
			console.log( this.player_id);
			console.log( this.gamedatas.gamestate.active_player );
			console.log( this.gamedatas.activeTurnPlayer_id );

			console.log("[bmc] STATENAME:");
			console.log(stateName);

//			this.showHideButtons();
            
			switch( stateName ) {
								
				case 'newHand':
					console.log("[bmc] FOUND newHand");
					break;
				case 'playerTurnDraw':
					console.log("[bmc] FOUND PlayerTurnDraw");

					// Make it clear to the player they need to draw a card (border around card)
					if ( args.active_player == this.player_id ) {
						dojo.addClass('myhand_wrap', "borderDrawer");
						// var deck_items = this.deckOne.getAllItems();
	// console.log("[bmc] ALL deckOne:");
	// console.log(deck_items);
						// for ( let i in deck_items ) {
//	console.log( 'deckOne_item_' + deck_items[i]['id'] );
//	console.log( $('deckOne_item_' + deck_items[i]['id'] ));
							// dojo.addClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
						// }




						var deckAllItems = this.deckAll.getAllItems();
	console.log(deckAllItems);
						for ( let i in deckAllItems ) {
							dojo.addClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
						}

// TODO: MAKE discardpile only 1 card. Doing this in PHP, to try it there

//						var dp_items = this.discardPile.getAllItems();
						var dp_items = this.discardPileOne.getAllItems();
	console.log("[bmc] ALL discardPile:");
	console.log(dp_items);
						for ( let i in dp_items ) {
//							dojo.addClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
							dojo.addClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
						}
					} else {
						dojo.removeClass('myhand_wrap', "borderDrawer");
						// for ( let i in deck_items ) {
							// dojo.removeClass('deckOne_item_' + deck_items[i]['id'], 'stockitem_selected');
						// }



						for ( let i in deckAllItems ) {
							dojo.removeClass('deckAll_item_' + deckAllItems[i]['id'], 'stockitem_selected');
						}



						for ( let i in dp_items ) {
//							dojo.removeClass('discardPile_item_' + dp_items[i]['id'], 'stockitem_selected');
							dojo.removeClass('discardPileOne_item_' + dp_items[i]['id'], 'stockitem_selected');
						}
					}
					break;
				case 'checkEmptyDeck':
					console.log("[bmc] FOUND checkEmptyDeck");
					break;
				case 'drawDiscard':
					console.log("[bmc] FOUND drawDiscard");
					// Clear the buy requests since they cannot go through
					for ( player_id in this.gamedatas.players ) { 
						dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
					}
					break;
				case 'playerTurnPlay':
					console.log("[bmc] FOUND PlayerTurnPlay");
					this.showHideButtons();
					break;
				case 'nextPlayer':
					console.log("[bmc] FOUND nextPlayer");
					break;
				case 'endHand':
					console.log("[bmc] FOUND endHand");
					this.playedSoundWentOut = false; // Reset to play the sound only once
					break;
				case 'resolveBuyers':
					console.log("[bmc] FOUND resolveBuyers");
					for ( player_id in this.gamedatas.players ) { 
						dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
					}
					break;
				case 'playerWantsToBuy':
					console.log("[bmc] FOUND playerWantsToBuy");
					break;
				case 'playerDoesNotWantToBuy':
					console.log("[bmc] FOUND playerDoesNotWantToBuy");
					break;
				case 'turnPlayerDrawingResolveBuyers':
					console.log("[bmc] FOUND turnPlayerDrawingResolveBuyers");
					break;
				case 'turnPlayerDrawFromDeck':
					console.log("[bmc] FOUND turnPlayerDrawFromDeck");
					break;
				case 'playCard':
					console.log("[bmc] FOUND playCard");
					break;
				case 'playerGoDown':
					console.log("[bmc] FOUND playerGoDown");
					break;
				case 'liverpoolDraw':
					console.log("[bmc] FOUND Liverpool and being processed");
					this.displayItsYourTurn( args.active_player, 'liverpool' );
					break;
				default:
					console.log("[bmc] OES DEFAULT");
//					this.showHideButtons();
					break;
            }
            // Example:
           
            // case 'myGameState':
            
                // Show some HTML block at this game state
                // dojo.style( 'my_html_block_id', 'display', 'block' );
                
                // break;
            // Example end
			
			console.log( 'EXITING ENTERING state: ' + stateName );
        },
/////////
/////////
/////////
        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName ) {
            console.log( 'Leaving state: ' + stateName );
            
            switch( stateName )
            {
            
             // Example:
            
            // case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                // dojo.style( 'my_html_block_id', 'display', 'none' );
                
                // break;
           
            case 'dummmy':
                break;
            }            
		}, 
/////////
/////////
/////////
        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
		onUpdateActionButtons : function( stateName, args ) {
console.log( '[bmc] ENTER onUpdateActionButtons: ' + stateName );
console.log( args );
console.log( this.player_id );

			// If someone clicked their button 'On To The Next' just ignore it
			// and replace the button. The state machine will continue after ALL have clicked.
			if ( stateName == 'wentOut' ) {
				if ( this.playedSoundWentOut == false ) {
					this.playedSoundWentOut = true;
					if ( this.voices ) {
						playSound('tutorialrumone_wentOutYeah');
					}
				}
				this.showReviewButton( args.player_id );
				return;
			}

console.log( '[bmc] EXIT onUpdateActionButtons: ' + stateName );
		},
/////////
/////////
/////////
};
