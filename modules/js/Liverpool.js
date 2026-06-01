// LiverpoolRummy Liverpool Mixin
var LRLiverpool = {
		notif_liverpoolExists : function( notif ){
console.log("[bmc] ENTER Liverpool Exists");
console.log(notif);

			// Players asked to hide LIVERPOOL condition. If you don't want it hidden, uncomment this dojo:
//			dojo.replaceClass( 'buttonLiverpool', "bgabutton_red", "bgabutton_gray" ); // item, add, remove

			this.gamedatas.liverpoolExists = true;
console.log("[bmc] EXIT Liverpool Exists");
		},
/////////
/////////
/////////
		notif_liverpoolDeclared : function( notif ){
console.log("[bmc] ENTER Liverpool Declared");
console.log(notif);
			dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red bgabutton_blue" ); // item, add, remove

			console.log( "Setting someoneLP true");
			this.someoneLP = true;
			
			if ( this.voices ) {
				playSound( 'Liverpool_audio' );
				this.disableNextMoveSound();
			}

console.log("[bmc] EXIT Liverpool Declared");
		},
/////////
/////////
/////////
		notif_liverpoolMissed : function( notif ){
console.log("[bmc] ENTER Liverpool Missed");
console.log(notif);

			if ( this.voices ) {
				// playSound( 'MissedIt' );
				// this.disableNextMoveSound();
			}

console.log("[bmc] EXIT Liverpool Declared");
		},
/////////
/////////
/////////
		onLiverpoolButton : function() {
console.log("[bmc] ENTER onLiverpoolButton");
			if ( this.someoneLP ) {
				// LP window already claimed — only show message to players who didn't claim it
				if ( !this.iDeclaredLP ) {
					this.showMessage( _("Someone beat you to Liverpool!" ));
				}
console.log("[bmc] EXIT onLiverpoolButton (already claimed)");
				return;
			}

			// First player to click — claim immediately on this client
			this.someoneLP = true;
			this.iDeclaredLP = true;
			dojo.replaceClass( 'buttonLiverpool', "bgabutton_gray", "bgabutton_red bgabutton_blue" );

			if ( this.goneDown[ this.player_id ] == 1 ) { // must have gone down
				this.bgaPerformAction( 'actLiverpoolButton', {
					player_id : this.player_id,
				}, {
					checkAction: false,
					checkPossibleActions: false
				});
			}
console.log("[bmc] EXIT onLiverpoolButton");
		},
/////////
/////////
/////////
		notif_playerGoDown: function( notif ) {
			console.log('ENTER notif_playerGoDown. Solidify the card positions.');
			console.log( notif );
			console.log( this.gamedatas.currentPlayerId );
			console.log( this.gamedatas.playerOrderTrue );
			console.log( this.player_id );

			console.log("LIGHTING UP GONE DOWN PLAYER");
			console.log( 'overall_player_board_' + notif.args.player_id, 'playerWentDown' );
			dojo.addClass( 'overall_player_board_' + notif.args.player_id, 'playerWentDown' );

			console.log( this.voices );
			
			//this.disableNextMoveSound();
			if ( this.voices ) {
				playSound( 'tutorialrumone_GoingDown' );
//				this.disableNextMoveSound();
			}
		
			// Update card-counts when someone goes down:

			for ( var p_id in notif.args.allHands ) {
				this.handCount[ p_id ].setValue( notif.args.allHands[ p_id ] );
			}

			if (notif.args.allHands != null ) {
				this.myHandSize.setValue( notif.args.allHands[ this.player_id ] );
			}
			
			this.goneDown[ notif.args.player_id ] = 1; //0 = Not gone down; 1 = Gone down.
			
			if ( this.goneDown[ this.player_id ] == 1 ) { // If player who went down is me then gray the buttons
				dojo.replaceClass( 'buttonLoadPrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonSavePrep', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
			}


			downPlayer = notif.args.player_id;
			downArea = notif.args.player_down;
			card_ids = notif.args.card_ids;
			card_type = notif.args.card_type;
			card_type_arg = notif.args.card_type_arg;
console.log( card_ids );

			joker = notif.args.joker;
console.log("[bmc] joker:");
console.log(joker);
			
			// Check if we are a spectator. If so, then don't deal with CSS class borders.
			var isReadOnly = this.isReadOnly();
console.log("[bmc] Spectator T/F:");
console.log( isReadOnly );
			
			// Only the going-down player slides from their own prep areas.
			// Other players (and spectators) use the else-block below which slides from the player board.
			if ( !isReadOnly && String(downPlayer) === String(this.player_id) ) {
				// And move the cards from my prep area to the board
				for ( card_id in card_ids ) {
					color = card_type[ card_id ];
					value = card_type_arg[ card_id ];

					console.log(color);
					console.log(value);
					
					cardUniqueId = this.getCardUniqueId( color, value );
					console.log(cardUniqueId);
					
					if ( downArea === 'playerDown_A_' ) {
						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepA' );
						this.myPrepA.removeFromStockById( card_ids[ card_id ] );
					}
					if ( downArea === 'playerDown_B_' ) {
						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepB' );
						this.myPrepB.removeFromStockById( card_ids[ card_id ] );
					}
					if ( downArea === 'playerDown_C_' ) {
						this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepC' );
						this.myPrepC.removeFromStockById( card_ids[ card_id ] );
					}
				}
			}
			
			if ( this.gamedatas.gamestate.active_player == this.player_id ) {
				console.log("[bmc] I went down!");

				if ( card_ids != undefined ) {

					// And move the cards from my prep area to the board
					for ( card_id in card_ids ) {
						color = card_type[ card_id ];
						value = card_type_arg[ card_id ];

						console.log(color);
						console.log(value);
						
						cardUniqueId = this.getCardUniqueId( color, value );
						console.log(cardUniqueId);
						
						if ( downArea === 'playerDown_A_' ) {
							this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepA' );
							this.myPrepA.removeFromStockById( card_ids[ card_id ] );
						}
						if ( downArea === 'playerDown_B_' ) {
							this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepB' );
							this.myPrepB.removeFromStockById( card_ids[ card_id ] );
						}
						if ( downArea === 'playerDown_C_' ) {
							this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'myPrepC' );
							this.myPrepC.removeFromStockById( card_ids[ card_id ] );
						}
					}
				}
				
				// Unselect all board cards
				for ( var player in this.gamedatas.players ) {
					this.downArea_A_[ player ].unselectAll();
					this.downArea_B_[ player ].unselectAll();
					this.downArea_C_[ player ].unselectAll();
				}

				// Remove the highlighted border from prep areas
				dojo.removeClass('myPrepA', "buyerLit");
				dojo.removeClass('myPrepB', "buyerLit");
				dojo.removeClass('myPrepC', "buyerLit");
				
				this.goneDown[ this.player_id ] = 1;
				
				// Move the joker, if any, to the down position, everything else is already in place because of the prep
				
				if ( joker != undefined ) { // Per JS must check undefined before checking for a property of the variable
					if ( joker.id != 'None' ) { // Then there's a joker; Move it
				
						jokerUniqueID = this.getCardUniqueId( joker.type, joker.type_arg );
						
						targetArea = notif.args.targetArea;
						
						if ( targetArea === 'playerDown_A' ) {
							console.log("[bmc] Adding Joker to AREA A");
							this.downArea_A_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_A( downPlayer );
						}
						if ( targetArea === 'playerDown_B' ) {
							console.log("[bmc] Adding Joker to AREA B");
							this.downArea_B_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_B( downPlayer );
						}
						if ( targetArea === 'playerDown_C' ) {
							console.log("[bmc] Adding Joker to AREA C");
							this.downArea_C_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, 'myhand' );
							// this.sortArea_C( downPlayer );
						}
						this.playerHand.removeFromStockById(joker.id);
					}
				}
				this.showHideButtons();
//				return;
				
			} else {
				console.log("[bmc] Someone else went down!");
				for ( card_id in card_ids ) {
					console.log(card_id);
//					color = card_ids[card_id]['type'];
//					value = card_ids[card_id]['type_arg'];
					color = card_type[ card_id ];
					value = card_type_arg[ card_id ];

					console.log(color);
					console.log(value);
					
					cardUniqueId = this.getCardUniqueId( color, value );
					console.log(cardUniqueId);
					
					if ( downArea === 'playerDown_A_' ) {
						console.log("[bmc] Adding to AREA A");
// EXPERIMENT 10/20/2020 7:09pm Not sure how this could be wrong but it seems wrong. Changing it
//						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + downPlayer );
						this.downArea_A_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );
						
//						dojo.removeClass('playerDown_A_' + this.player_id, "buyerLit");
						// this.sortArea_A( downPlayer );

					}
					if ( downArea === 'playerDown_B_' ) {
						console.log("[bmc] Adding to AREA B");
//						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_id, 'overall_player_board_' + downPlayer );
						this.downArea_B_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );
					}
					if ( downArea === 'playerDown_C_' ) {
						console.log("[bmc] Adding to AREA C");

						this.downArea_C_[ downPlayer ].addToStockWithId( cardUniqueId, card_ids[ card_id ], 'overall_player_board_' + downPlayer );

					}

// slideToObject
// function( mobile_obj, target_obj, duration, delay )
// Return an dojo.fx animation that is sliding a DOM object from its
// current position over another one
// Animate a slide of the DOM object referred to by domNodeToSlide from its
// current position to the xpos, ypos relative to the object referred to by domNodeToSlideTo.

					this.playerHand.removeFromStockById( card_ids[ card_id ]);
				}

				// Animate the joker for observers — it slides from the going-down player's board area
				if ( joker != undefined && joker.id != 'None' ) {
					var jokerUniqueID = this.getCardUniqueId( joker.type, joker.type_arg );
					var targetArea    = notif.args.targetArea;
					var jokerFrom     = 'overall_player_board_' + downPlayer;
					if ( targetArea === 'playerDown_A' ) {
						this.downArea_A_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, jokerFrom );
					} else if ( targetArea === 'playerDown_B' ) {
						this.downArea_B_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, jokerFrom );
					} else if ( targetArea === 'playerDown_C' ) {
						this.downArea_C_[ downPlayer ].addToStockWithId( jokerUniqueID, joker.id, jokerFrom );
					}
				}
			}
			if ( notif.args.targetArea != null ) {
				this.sortBoard();
			}
		},
};
