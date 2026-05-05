// LiverpoolRummy Notifications Mixin
var LRNotifications = {
		notif_loadPrepInfo : function( notif ){
console.log("[bmc] ENTER loadPrepInfo");
console.log(notif);
		// Take no action just let the message be in the game log
console.log("[bmc] EXIT loadPrepInfo");
		},
/////////
/////////
/////////
		notif_loadPrepDone : function( notif ){
console.log("[bmc] ENTER loadPrepDone");
console.log(notif);

			// First move all cards to hand, then to prep areas
			this.movePrepCardsToHand( this.myPrepA );
			this.movePrepCardsToHand( this.myPrepB );
			this.movePrepCardsToHand( this.myPrepC );
			this.movePrepCardsToHand( this.myPrepJoker );

			var ids = notif.args.card_idsA;
			console.log(ids);

			if ( ids != null ) {
				// Clear the prep area

				dojo.addClass( 'myPrepA', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeA;
				var values = notif.args.card_type_argA;
				this.populatePrepArea( ids, colors, values, this.myPrepA );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsB;
			console.log(ids);
			
			if ( ids != null ) {
				
				dojo.addClass( 'myPrepB', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeB;
				var values = notif.args.card_type_argB;
				this.populatePrepArea( ids, colors, values, this.myPrepB );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsC;
			console.log(ids);

			if ( ids != null ) {
				dojo.addClass( 'myPrepC', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeC;
				var values = notif.args.card_type_argC;
				this.populatePrepArea( ids, colors, values, this.myPrepC );
				this.prepAreas++;
			}

			var ids = notif.args.card_idsJ;
			console.log(ids);

			if ( ids != null ) {
				dojo.addClass( 'myPrepJoker', "buyerLit" ); // Add red background
				var colors = notif.args.card_typeJ;
				var values = notif.args.card_type_argJ;
				this.populatePrepArea( ids, colors, values, this.myPrepJoker );
				this.prepAreas++;
			}
			
			console.log(this.prepAreas);
			console.log("[bmc] INCREMENTED prepAreas");
console.log("[bmc] EXIT loadPrepDone");
		},
/////////
/////////
/////////
		notif_savePrepDone : function( notif ){
console.log("[bmc] ENTER savePrepDone");
console.log(notif);
		},
/////////
/////////
/////////
		notif_updateBuyers : function( notif ){
console.log("[bmc] updateBuyers");
console.log(notif.args.player_id);
console.log(notif.args.nextTurnPlayer);
console.log(notif.args.buyers);
console.log(this.player_id);

			// Set status to back to show buyers have resolved
			this.resolvingBuyers = false;

			// Separating the update of the buyer update to try to clear the DB deadlock issue.
		
			if (( this.player_id != notif.args.nextTurnPlayer ) && ( notif.args.buyers[ this.player_id ] > 0 )) {
				// If we are not the next player and we have buys left then show the BUY button

console.log("[bmc] Card played not by me");
				this.buyCounterTimerShouldExist = 'Yes'; // A timer and a button should exit
				this.showBuyButton2();
				
				// New variables for new timers on static buttons
				// this.enableDBStatic = 'Yes';
				// this.enableDBTimer = 'Yes';
				this.enDisStaticBuyButtons('Yes');
			}
		},
//function( mobile_obj, target_obj, duration, delay )
/////////
/////////
/////////		
        setupNotifications: function()
        {
console.log( '[bmc] ENTER notifications subscriptions setup' );
            
            dojo.subscribe( 'newHand'  ,         this, "notif_newHand");
			this.notifqueue.setSynchronous( 'newHand', 1000 );
            dojo.subscribe( 'discardCard' ,        this, "notif_discardCard");
            dojo.subscribe( 'drawCard' ,           this, "notif_drawCard");
            dojo.subscribe( 'drawCardSpect' ,      this, "notif_drawCardSpect");
            dojo.subscribe( 'newScores',           this, "notif_newScores" );
			dojo.subscribe( 'playerGoDown' ,       this, "notif_playerGoDown");
            dojo.subscribe( 'cardPlayed' ,         this, "notif_cardPlayed");
            dojo.subscribe( 'deckShuffled' ,       this, "notif_deckShuffled");
            dojo.subscribe( 'playerWantsToNotBuy', this, "notif_playerNotBuying");
            dojo.subscribe( 'playerWantsToBuy' ,   this, "notif_playerWantsToBuy");
            dojo.subscribe( 'playerBought' ,	   this, "notif_playerBought");
            dojo.subscribe( 'playerDidNotBuy' ,    this, "notif_playerDidNotBuy");
			dojo.subscribe( 'wentOut' , 		   this, "notif_playerWentOut");
            dojo.subscribe( 'clearBuyers' ,        this, "notif_clearBuyers");
			dojo.subscribe( 'close_btn' , 		   this, "onPlayerReviewedHandButton");
			dojo.subscribe( 'itsYourTurn' ,        this, "notif_itsYourTurn");
			dojo.subscribe( 'updateBuyers' ,       this, "notif_updateBuyers");
			dojo.subscribe( 'wishListSubmitted',   this, "notif_wishListSubmitted");
			dojo.subscribe( 'wishListDisabled',    this, "notif_wishListDisabled");
			dojo.subscribe( 'liverpoolExists',     this, "notif_liverpoolExists");
			dojo.subscribe( 'liverpoolDeclared',   this, "notif_liverpoolDeclared");
			dojo.subscribe( 'liverpoolMissed',     this, "notif_liverpoolMissed");
			dojo.subscribe( 'loadPrepDone',        this, "notif_loadPrepDone");
			dojo.subscribe( 'savePrepDone',        this, "notif_savePrepDone");
			//dojo.subscribe( 'wishListCleared',     this, "notif_wishListCleared");

            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
console.log( "[bmc] EXIT notifications subscriptions setup" );
        },  
/////////
/////////
/////////
        notif_newScores : function(notif) {
			console.log("[bmc] notif_newScores", notif);

			this.currentHandType = notif.args.currentHandType;
			
            // Update players' scores
            for ( var player_id in notif.args.newScores ) {
                this.scoreCtrl[ player_id ].toValue( notif.args.newScores[ player_id ]);
            }
			
        },
/////////
/////////
/////////
		notif_playerWentOut : function( notif ) {
			console.log("[bmc] ENTER notif_playerWentOut")
			console.log( notif );
			
			// If someone went out, remove the BUY buttons, kill the timers and let them review.
			//this.stopActionTimer2();
			// this.stopActionTimerStatic();
			//this.clearButtons();
			
			dojo.removeClass('myhand_wrap', "buyerLit");				
			
			// If someone clicked their button 'On To The Next' just ignore it
			// and replace the button. The state machine will continue after ALL have clicked.
			// if ( notif.type == 'wentOut' ) {
				// if (( notif.args.ackPlayer == this.player_id ) &&
				    // ( this.handReviewed == 'No' )) {
					
					// this.handReviewed = 'Yes';
				// }
				// return;
			// }

			this.showReviewButton( notif.args.player_id );
		},
/////////
/////////
/////////
		notif_deckShuffled : function(notif) {
			// Set up the draw deck
			console.log("[bmc] Shuffle Cards:");
			console.log(notif);
			
			// for ( let i = 0 ; i < notif.args.deck.length; i++ ) {
				// this.deck.addToStockWithId( 1, notif.args.deck[i] );
			// }
			//this.discardPile.removeAll();
			this.discardPileOne.removeAll();
// console.log("[bmc] Shuffled New Deck:");			
// console.log(this.deck);
		},
		
        notif_discardCard : function( notif ) {
console.log("[bmc] ENTER notif_discardCard");
console.log( this.player_id );
console.log( notif );
			this.discardCard(
				notif.args.player_id,
				notif.args.color,
				notif.args.value,
				notif.args.card_id,
				notif.args.nextTurnPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize,
				notif.args.buyers
			);
console.log("[bmc] EXIT notif_discardCard");
		},
/////////
/////////
/////////

// TODO: DELETE ME NOW???
        notif_itsYourTurn : function( notif ) {
			console.log("[bmc] sound: It's Your Turn");
			playSound( 'tutorialrumone_ItsYourTurn' );
		},
/////////
/////////
/////////
        notif_drawCard : function( notif ) {
console.log("[bmc] ENTER notif_drawcard");
console.log( notif );

			if ( notif.args.drawsource == 'discardPile' ) {
console.log("[bmc] drew from discardPile");
				this.clearButtons();
			}

			// Clear out the Liverpool condition (unlight the button)
//			dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
			dojo.replaceClass( 'buttonLiverpool', "bgabutton_blue", "bgabutton_red" ); // item, add, remove

			// Steadily increment every time a card is drawn to set the weight properly
			this.drawCounter++;
			
            // Draw a card from the deck, discard pile or the board (i.e. joker replace)
            this.drawCard(
				notif.args.player_id,
				notif.args.card_id,
				notif.args.color,
				notif.args.value,
				notif.args.drawSource,
				notif.args.drawPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize
			);
console.log("[bmc] EXIT notif_drawcard");
        },
/////////
/////////
/////////
		notif_drawCardSpect : function(notif) {
console.log("[bmc] ENTER notif_drawcardSpect");
console.log(notif);

			// If the discard was drawn, turn off the indication of players requesting buy.
			if ( notif.args.drawSource == 'discardPile' ) {
				for ( player_id in this.gamedatas.players ) { 
					dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
				}
			}

            this.drawCardSpect(
				notif.args.player_id,
				notif.args.card_id,
				notif.args.color,
				notif.args.value,
				notif.args.drawSource,
				notif.args.drawPlayer,
				notif.args.allHands,
				notif.args.discardSize,
				notif.args.drawDeckSize
			);
console.log("[bmc] EXIT notif_drawcardSpect");
		},
/////////
/////////
/////////
		// notif_pickJokers : function(notif) {
			// console.log("[bmc]notif_pickJokers");
			// console.log(notif);
		// },
/////////
/////////
/////////
		notif_clearBuyers : function(notif) {
			console.log("[bmc]notif_clearBuyers");
			// No one is buying because the next-next player has discarded!
			console.log(notif);
//			this.stopActionTimer2();
			this.showHideButtons();
//			this.enableDBStatic = 'No';
			// this.enableDBTimer = 'No'; // But let the timer run out if it's there
			this.enDisStaticBuyButtons('No');
			// this.stopActionTimerStatic(); // Stop the timer, we are not buying			
		},
/////////
/////////
/////////
		notif_playerNotBuying : function(notif) {
			console.log("[bmc]notif_playerIsNotBuying");
			console.log(notif);
			console.log(this.gamedatas.gamestate.active_player);
			console.log(this.player_id);

			// If  not my turn then light up the buttons or player board; else do nothing (but quietly allow the buy to happen).
			if (this.gamedatas.gamestate.active_player != this.player_id ) {
				// If I requested then clear the request
				if ( this.player_id == notif.args.player_id ) {
	//			if ( this.gamedatas.gamestate.active_player == notif.args.player_id ) {
					this.buyRequested = false;
					// this.stopActionTimer2();
					dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
					dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove
				}
				//this.showHideButtons();
			}
			// Remove from all boards
			dojo.removeClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );
		},
/////////
/////////
/////////
		notif_playerBought : function(notif) {
			console.log("[bmc]notif_playerBought");
			console.log(notif);
			console.log(this.gamedatas.players);
			this.buyRequested = false;
			
			for ( player_id in this.gamedatas.players ) { 
console.log(player_id);
//				dojo.removeClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );
				dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
console.log(notif.args.buyCount[ player_id ]);
console.log(notif.args.allHands[ player_id ]);

				this.buyCount[  player_id ].setValue( notif.args.buyCount[ player_id ] );
				this.handCount[ player_id ].setValue( notif.args.allHands[ player_id ] );
			}
			
			// If I bought then turn off the wishlist if it's on
			if ( this.player_id == notif.args.player_id ) {
				this.wishListEnabled = false;
				// document.getElementById("wishListEnabled").checked = false;
				this.setWishListColor( this.wishListEnabled );
				
				// Disable the wishlist on the server
				this.disableWishList();
				
console.log( "[bmc] You bought a card!");
			}
		},
/////////
/////////
/////////
		notif_playerDidNotBuy : function(notif) {
			console.log("[bmc]notif_playerDidNotBuy");
			console.log(notif);
			
			if ( notif.args.buyingPlayers != null ) {
				for ( var player_id of notif.args.buyingPlayers ) {
					console.log('overall_player_board_' + player_id);
					dojo.removeClass( 'overall_player_board_' + player_id, 'playerBoardBuyer' );
				}
			}
		},
/////////
/////////
/////////
		notif_playerWantsToBuy : function(notif) {
			console.log("[bmc]notif_playerWantsToBuy");
			console.log(notif);
			
			// if (( this.player_id == notif.args.player_id ) && 
			if  ( notif.args.activeTurnPlayer_id == notif.args.player_id ) {
console.log("[bmc] sound: It's Your Turn");
				playSound( 'tutorialrumone_ItsYourTurn' );
			} else {

				if ( this.voices ) {
					playSound( 'tutorialrumone_IllBuyIt' );
					this.disableNextMoveSound();
				}
				dojo.addClass( 'overall_player_board_' + notif.args.player_id, 'playerBoardBuyer' );

				// If I requested it then change the buttons, otherwise don't
				if ( this.player_id == notif.args.player_id ) {
					// Buy allowed, change the buttons
					dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
					dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
					dojo.replaceClass( 'buttonNotBuy', "textWhite", "textGray" ); // item, add, remove
					
					// Also track the fact we requested it (from wish list)
					this.buyRequested = true;
				}
			}
			
			// do another ajax call to let the PHP know the buy request has been registered?
			
			
			
			
			
			

			return;
		},
/////////
/////////
/////////
};
