// LiverpoolRummy Buying Mixin
var LRBuying = {
		onPlayerBuyButton : function() {
console.log("[bmc] ENTER onPlayerBuyButton");
console.log(this.discardPileOne);
console.log(this.isSpectator);

			if ( !this.isSpectator ){
				var dpCard = this.discardPileOne.getAllItems();
	console.log(dpCard);
				if (dpCard.length > 0) {
					console.log("discardpile has a card");
					this.reallyBuy();
				}
			}
			return; // nothing should be called or done after calling this, all action must be done in the handler  
		},
/////////
/////////
/////////
		reallyBuy : function() {
			//this.clearButtons();
			// Do not acknowledge the buy if it's not our turn
			// if ( this.player_id == this.turnPlayer ) {
// console.log("[bmc] sound: It's Your Turn");
				// playSound( 'tutorialrumone_ItsYourTurn' );
			// } else {
				
				// Make sure there is a card to buy
				// Make sure we have buys remaining

console.log(this.buyRequested);
console.log(this.firstLoad);
console.log("[bmc] this.buyCount:", this.buyCount[ this.player_id ][ 'current_value' ]);

			if ( this.discardPileOne.length != 0 ) {
				if ( this.buyCount[ this.player_id ][ 'current_value' ] > 0 ) {

					// var action = 'buyRequest';
					var newAction = 'actBuyRequest';
//console.log(this.checkPossibleActions( action, true ));

					// If PHP is not resolving buyers then let the client try to buy
					if ( this.resolvingBuyers != true ) {

	//					if (( this.checkPossibleActions( action, true )  ||
	//						( this.firstLoad == 'Yes' )) && 
						if ( this.buyRequested != true ) {
							
							// Keep track so the button can only be hit once
							this.buyRequested = true;

							// console.log("[bmc] ajax " + action );

							this.bgaPerformAction( newAction, { // 'actBuyRequest'
								// player_id : this.player_id,
							},{ 
								checkAction: false,
								checkPossibleActions: false
							});
							
							// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
									// player_id : this.player_id,
									// lock : true
								// }, this, function(result) {
								// }, function(is_error) {
							// });
						} else {
							console.log("[bmc] Buy already requested or not allowed now");
						}
					}
				} else { // Turn off the BUY button
					this.clearButtons();
				}
			}
		},
/////////
/////////
/////////
		onPlayerNotBuyButton : function() {
console.log("[bmc] ENTER onPlayerNotBuyButton");
			// this.clearButtons();
			////this.stopActionTimer2();
			// console.log(this.gamedatas);
			
			// var action = 'notBuyRequest';
			var newAction = 'actNotBuyRequest';
			
//console.log( "[bmc] checkaction: " + this.checkPossibleActions( action, true));
console.log( "[bmc] buyrequested: " + this.buyRequested);

//			if ( this.checkPossibleActions( action, true) && ( this.buyRequested == true)) {
			if ( this.buyRequested == true ) {
				// console.log("[bmc] ajax " + action );
				
				this.bgaPerformAction( newAction, { // 'actNotBuyRequest'
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
				
				// Clear out the buy request
				this.buyRequested = false;
				
			} else {
				console.log( "[bmc] checkAction false");
			}
		},
/////////
/////////
/////////
        ///////////////////////////////////////////////////
        //// Utility methods
        //
        // Here, you can defines some utility methods that you can use everywhere in your javascript script.
        //
        // Get card unique identifier based on its color and value (e.g. Ace of clubs is 0)
		startActionTimerStatic: function () {
console.log("[bmc] ENTER startActionTimerStatic");
console.log("[bmc] EXIT(nothing) startActionTimerStatic");
			return;
		},
/////////
/////////
/////////
		showBuyButton2 : function() {
console.log("[bmc] ENTER showBuyButton2");
console.log( this.buyCounterTimerShouldExist );
console.log( this.buyCounterTimerExists );

//			if (( this.buyCounterTimerShouldExist == 'Yes' ) || 
//				( this.buyCounterTimerExists == 'Yes' )) {

console.log("[bmc] BUY BUTTON RED!");
				dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove

//console.log("[bmc] Action buttons were just created.");

//			}
console.log("[bmc] EXIT showBuyButton2");
		},
/////////
/////////
/////////
		showNotBuyButton : function() {
console.log("[bmc] ENTER showNotBuyButton RED!");
				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textWhite", "textGray" ); // item, add, remove
console.log("[bmc] EXIT showNotBuyButton");
		},
/////////
/////////
/////////
		enDisStaticBuyButtons : function( setting ) {
console.log(this.enableDBStatic);
console.log(setting);

				if (( this.enableDBStatic == 'Yes' ) ||
			    ( setting == 'Yes' )) {
console.log("[bmc] YES enDisStaticBuyButtons");
//				dojo.replaceClass( 'buttonBuy', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				// dojo.replaceClass( 'buttonNotBuy', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "bgabutton_red", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textWhite", "textGray" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove

				// Only start the timer if active during hand, not during game start nor hand start.
				// if ( this.enableDBTimer == 'Yes' ) {
// console.log("[bmc] YES enableDBTimer");
					// this.startActionTimerStatic();
				// }
			} else {
console.log("[bmc] NO enDisStaticBuyButtons");
//				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				// dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonBuy', "textGray", "textWhite" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "bgabutton_gray", "bgabutton_red" ); // item, add, remove
				dojo.replaceClass( 'buttonNotBuy', "textGray", "textWhite" ); // item, add, remove
			}
		},
		
		
		
		
//			var notBuyButtonID = 'buttonPlayerNotBuy' + this.player_id;
//			this.startActionTimer( notBuyButtonID );



/////////
/////////
/////////
		showBuyButton : function() {
//			console.log("[bmc] this.buyCounted: ", this.buyCounted );
console.log("[bmc] ENTER showBuyButton");

			var buyButtonID = 'buttonPlayerBuy' + this.player_id;
			var notBuyButtonID = 'buttonPlayerNotBuy' + this.player_id;
console.log( "[bmc] BUTTONIDs:" );
console.log( buyButtonID );
console.log( notBuyButtonID );

			// Only show the buy buttons if they already don't exist
			
//			var notBuyButtonDOM = document.getElementById('buttonPlayerNotBuy');
			var notBuyButtonDOM = document.getElementById( notBuyButtonID );
console.log("[bmc] notBuyButtonDOM: ", notBuyButtonDOM);
console.log("[bmc] buyCounterTimerExists: ", this.buyCounterTimerExists );
console.log("[bmc] buyCounterTimerShouldExist: ", this.buyCounterTimerShouldExist );

			if (( this.buyCounterTimerShouldExist == 'Yes' ) && 
			    ( notBuyButtonDOM == null )) { // == null or undefined
//console.log("[bmc] notBuyButtonDOM is null");
//				if ( this.buyCounted == 'No' ) {
console.log("[bmc] Timer and buttons must exist, so create them.");
//					this.buyCounted = 'Yes';
					
//					this.addActionButton('buttonPlayerBuy', _("Buy2"), 'onPlayerBuyButton');
//					this.addActionButton('buttonPlayerNotBuy', _("Not Buy2"), 'onPlayerNotBuyButton');
//					this.startActionTimer( 'buttonPlayerNotBuy' );

//EXP 10/26					this.addActionButton( buyButtonID, _("Buy!"), 'onPlayerBuyButton' );
//					this.addActionButton( notBuyButtonID , _("Not Buy!"), 'onPlayerNotBuyButton' );
console.log("[bmc] Action buttons were just created.");
console.log( document.getElementById( notBuyButtonID ));

					if ( this.buyCounterTimerExists != 'Yes' ) {
						// this.startActionTimer( notBuyButtonID );
					}
//exit(0);
				} else {
console.log( "[bmc] Not Showing Buy Buttons. Might consider removing the button here if it's not cleared in other ways." );
				}
//			} else { // Wait for the buy to count out
//console.log("[bmc] notBuyButtonDOM is not null");
//				return;
//			}
console.log("[bmc] EXIT showBuyButton");
		},
////////
////////
////////
};
