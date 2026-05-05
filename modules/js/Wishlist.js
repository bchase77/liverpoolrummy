// LiverpoolRummy Wishlist Mixin
var LRWishlist = {
		notif_wishListSubmitted : function( notif ){
console.log("[bmc] ENTER notif_wishListSubmitted");
			this.wishListSubmitted = true;
			this.wishListEnabled = true;
			this.setWishListColor( true ); 
			this.showClearWishListButton( true );
console.log("[bmc] EXIT notif_wishListSubmitted");
		},
/////////
/////////
/////////
		showClearWishListButton : function( onOff ) {
console.log("[bmc] ENTER showClearWishListButton");
console.log(this.wishListEnabled);
console.log(this.wishListSubmitted);
console.log(onOff);
			if ( onOff == true ) {
				dojo.replaceClass( 'buttonClearWishList', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonClearWishList', "textWhite", "textGray" ); // item, add, remove
			} else {
				dojo.replaceClass( 'buttonClearWishList', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonClearWishList', "textGray", "textWhite" ); // item, add, remove
			}
console.log("[bmc] EXIT showClearWishListButton");
		},
/////////
/////////
/////////
		unselectWishList : function() {
			this.wishListClubs.unselectAll();
			this.wishListSpades.unselectAll();
			this.wishListHearts.unselectAll();
			this.wishListDiamonds.unselectAll();
			for ( value = 1; value <= 13; value++ ) {
				dojo.removeClass('myWishListClubs_item_'    + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListSpades_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListHearts_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListDiamonds_item_' + value, 'wishListItem_selected' );
			}
		},
/////////
/////////
/////////
		disableWishList : function() {
console.log("[bmc] ENTER disableWishList");
console.log(this.wishListEnabled);
//			this.showClearWishListButton( true );

			if ( this.wishListEnabled == true ) {
				this.wishListEnabled = false;
				this.setWishListColor( false );

				// Uncheck the box
				// document.getElementById("wishListEnabled").checked = false;

console.log( "[bmc] disabling wishlist ");

				// var action = 'disableWishList';
				var newAction = 'actDisableWishList';
				
				this.bgaPerformAction( newAction, { // 'actDisableWishList'
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
console.log("[bmc] EXIT disableWishList");
		},
/////////
/////////
/////////
		onClearWishList : function() {
console.log("[bmc] ENTER onClearWishList");
console.log(this.wishListEnabled);
console.log(this.wishListSubmitted);

			this.showClearWishListButton( false );
			this.disableWishList();
			this.unselectWishList();

console.log("[bmc] EXIT onClearWishList");
		},
/////////
/////////
/////////
		onSubmitWishList : function() {
console.log("[bmc] ENTER onSubmitWishList");

			var isReadOnly = this.isReadOnly();
			
			if ( !isReadOnly ) { // Spectators are read only, no need to show wishlist stuff
			
				var wlClubs    = this.wishListClubs.getSelectedItems();
				var wlSpades   = this.wishListSpades.getSelectedItems();
				var wlHearts   = this.wishListHearts.getSelectedItems();
				var wlDiamonds = this.wishListDiamonds.getSelectedItems();

				var wishListAll = wlClubs.concat( wlSpades ).concat( wlHearts ).concat( wlDiamonds );
	console.log( wishListAll );

				wishList_type = new Array();
				wishList_type_arg = new Array();

					// if (this.wishListEnabled == true ) {
					
				for ( wLItem of wishListAll ) {
	console.log( wLItem );
	console.log( this.getColorValue( wLItem.type + 1 ));
					
					var [ dCColor, dCValue ] = this.getColorValue( wLItem.type );
					
					wishList_type.push( dCColor );
					wishList_type_arg.push( dCValue );
				}
	console.log("[bmc] wishList");
	console.log( wishList_type );
	console.log( wishList_type_arg );

				if ( wishList_type.length != 0 ){
	console.log( "[bmc] Submitting wishList!" );
					
					// var action = 'submitWishList';
					var newAction = 'actSubmitWishList';
					
					this.bgaPerformAction( newAction, { // 'actSubmitWishList'
						player_id : this.player_id,
						wishList_type : this.toNumberList( wishList_type ),
						wishList_type_arg : this.toNumberList( wishList_type_arg ),
					},{ 
						checkAction: false,
//						checkPossibleActions: true 
					});

					// this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", {
						// player_id : this.player_id,
						// wishList_type : this.toNumberList( wishList_type ),
						// wishList_type_arg : this.toNumberList( wishList_type_arg ),
						// lock : true
					// }, this, function(result) {
					// }, function(is_error) {
					// });
				}
			}
console.log("[bmc] EXIT onSubmitWishList");
		},
/////////
/////////
/////////
		onShowHideWishList : function() {
			console.log("[bmc] ENTER onShowHideWishList");

			// Show the wishlist stuff if they set the game up this way
			if ( this.showHideWishList == true ) {
			console.log("[bmc] FALSE onShowHideWishList");
				this.showHideWishList = false;
				// var obj = { visibility: "hidden" };
				var obj = { display: "none" };
				
				// dojo.query( '.wishListMode' ).addClass( 'wishListMode' );
				// dojo.removeClass( 'TLeftBox2', 'wishListMode' );
				// dojo.removeClass( 'buttonClearWishList', 'wishListMode' );
			} else {
			console.log("[bmc] TRUE onShowHideWishList");
				this.showHideWishList = true;
				// var obj = { visibility: "visible" };
				// var obj = { display: "block" };
				var obj = { display: "inline" };
				
				// dojo.setAttr("TLeftBox2", "wishListMode", obj);
				// dojo.query( '.wishListMode' ).removeClass( 'wishListMode' );
				// dojo.addClass( 'TLeftBox2', 'wishListMode' );
				// dojo.addClass( 'buttonClearWishList', 'wishListMode' );
			}
console.log(obj);
			dojo.setAttr("TLeftBox2", "style", obj );

			console.log("[bmc] EXIT onShowHideWishList");
		},
/////////
/////////
/////////
		onWishListCardClick : function() {
console.log("[bmc] ENTER onWishListCardClick");
console.log(this.wishListEnabled);

			// Disable the wishlist
			this.disableWishList();
			
			// Go evaluate what they clicked. Resubmit only when they click SUBMIT again.
			
            var wlClubs    = this.wishListClubs.getSelectedItems();
            var wlSpades   = this.wishListSpades.getSelectedItems();
            var wlHearts   = this.wishListHearts.getSelectedItems();
            var wlDiamonds = this.wishListDiamonds.getSelectedItems();
console.log( wlClubs );
console.log( wlSpades );
console.log( wlHearts );
console.log( wlDiamonds );

			for ( value = 1; value <= 13; value++ ) {
				dojo.removeClass('myWishListClubs_item_'    + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListSpades_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListHearts_item_'   + value, 'wishListItem_selected' );
				dojo.removeClass('myWishListDiamonds_item_' + value, 'wishListItem_selected' );
			}
			
			for ( item in wlClubs ) {
				dojo.addClass('myWishListClubs_item_'    + wlClubs[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListClubs_item_' + wlClubs[ item ].id );
			}
			for ( item in wlSpades ) {
				dojo.addClass('myWishListSpades_item_'   + wlSpades[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListSpades_item_' + wlClubs[ item ].id );
			}
			for ( item in wlHearts ) {
				dojo.addClass('myWishListHearts_item_'   + wlHearts[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListHearts_item_' + wlClubs[ item ].id );
			}
			for ( item in wlDiamonds ) {
				dojo.addClass('myWishListDiamonds_item_' + wlDiamonds[ item ].id, 'wishListItem_selected');
//console.log( 'ADDED: myWishListDiamonds_item_' + wlClubs[ item ].id );
			}

console.log("[bmc] EXIT onWishListCardClick");
		},
/////////
/////////
/////////
		notif_wishListDisabled : function(notif) {
			console.log("[bmc] ENTER notif_wishListDisabled");
			console.log(notif);
			this.setWishListColor( false );
			this.showClearWishListButton( false );
			console.log("[bmc] EXIT notif_wishListDisabled");
		},
/////////
/////////
/////////
		setWishListColor : function( wLSetting ) {
console.log("[bmc] setWishListColor: ", wLSetting );

			if ( wLSetting == true ) {
				dojo.addClass(    'myWishListClubs',    'wishListClassOn' );
				dojo.addClass(    'myWishListSpades',   'wishListClassOn' );
				dojo.addClass(    'myWishListHearts',   'wishListClassOn' );
				dojo.addClass(    'myWishListDiamonds', 'wishListClassOn' );
				dojo.removeClass( 'myWishListClubs',    'wishListClassOff' );
				dojo.removeClass( 'myWishListSpades',   'wishListClassOff' );
				dojo.removeClass( 'myWishListHearts',   'wishListClassOff' );
				dojo.removeClass( 'myWishListDiamonds', 'wishListClassOff' );
				dojo.replaceClass( 'buttonSubmitWishList', "bgabutton_gray", "bgabutton_blue" ); // item, add, remove
				dojo.replaceClass( 'buttonSubmitWishList', "textGray", "textWhite" ); // item, add, remove
				console.log("Went To True Path");
			} else {
				dojo.addClass(    'myWishListClubs',    'wishListClassOff' );
				dojo.addClass(    'myWishListSpades',   'wishListClassOff' );
				dojo.addClass(    'myWishListHearts',   'wishListClassOff' );
				dojo.addClass(    'myWishListDiamonds', 'wishListClassOff' );
				dojo.removeClass( 'myWishListClubs',    'wishListClassOn' );
				dojo.removeClass( 'myWishListSpades',   'wishListClassOn' );
				dojo.removeClass( 'myWishListHearts',   'wishListClassOn' );
				dojo.removeClass( 'myWishListDiamonds', 'wishListClassOn' );
				dojo.replaceClass( 'buttonSubmitWishList', "bgabutton_blue", "bgabutton_gray" ); // item, add, remove
				dojo.replaceClass( 'buttonSubmitWishList', "textWhite", "textGray" ); // item, add, remove
				console.log("Went To False Path");
			}
		},
/////////
/////////
/////////
};
