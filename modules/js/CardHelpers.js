// LiverpoolRummy CardHelpers Mixin
var LRCardHelpers = {
		isEven : function (n) {
			return n % 2 == 0;
		},
/////////
/////////
/////////
        getCardUniqueId : function(color, value) {
			var cui = (color - 1) * 13 + (value - 1); // Offset depending upon the image sprite file
//			console.log("return: " + cui)
            return cui;
        },
		
		getColorValue : function( type ) {
			color = parseInt ( type / 13) + 1;
			value = type - (( color - 1 ) * 13 ) + 1;
			
			return [ color, value ];
		},

/////////
/////////
/////////
        getXPixelCoordinates: function( intersection_x ) {
       	return this.gameConstants['X_ORIGIN'] + intersection_x * (this.gameConstants['INTERSECTION_WIDTH'] + this.gameConstants['INTERSECTION_X_SPACER']); 
        },
/////////
/////////
/////////
        getYPixelCoordinates: function( intersection_y ) {
       	return this.gameConstants['Y_ORIGIN'] + intersection_y * (this.gameConstants['INTERSECTION_HEIGHT'] + this.gameConstants['INTERSECTION_Y_SPACER']); 
        },
/////////
/////////
/////////
		findHighestZIndex: function (container) {
			const elements = container.querySelectorAll('*');
			let highestZ = 0;
			let highestElement = null;

			elements.forEach(element => {
				const zIndex = parseInt(window.getComputedStyle(element).zIndex) || 0;
				if (zIndex > highestZ) {
					highestZ = zIndex;
					highestElement = element;
				}
			});
			return highestElement;
		},
/////////
/////////
/////////

//11/3 TODO:  Validate this can go through the board areas properly.
//Maybe just do it after a card is played onto a run and after someone goes down.

		ctxt : function ( toLog ) {
			console.log("[bmc] " + toLog );
		},
/////////
/////////
/////////
		craw : function ( toLog ) {
			console.log( toLog );
		},
/////////
/////////
/////////
		compareId : function( a, b ) {
			if ( parseInt(a.id) < parseInt(b.id) ){
				return -1;
			}
			if ( parseInt(a.id) > parseInt(b.id) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareTypeArg : function( a, b ) {
			if ( parseInt(a.type_arg) < parseInt(b.type_arg) ){
				return -1;
			}
			if ( parseInt(a.type_arg) > parseInt(b.type_arg) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareValue : function( a, b ) {
			if ( parseInt(a.value) < parseInt(b.value) ){
				return -1;
			}
			if ( parseInt(a.value) > parseInt(b.value) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareLocationArg : function( b, a ) {
			if ( parseInt(a.location_arg) < parseInt(b.location_arg) ){
				return -1;
			}
			if ( parseInt(a.location_arg) > parseInt(b.location_arg) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
		compareBoardLieIndex : function( a, b ) {
			if ( parseInt(a.boardLieIndex) < parseInt(b.boardLieIndex) ){
				return -1;
			}
			if ( parseInt(a.boardLieIndex) > parseInt(b.boardLieIndex) ){
				return 1;
			}
			return 0;
		},
/////////
/////////
/////////
        getItemIds: function ( items ) {
            var ids = [];
            for (var i in items) {
                var item = items[i];
                ids.push(item.id);
            }
            return ids;
        },
/////////
/////////
/////////
        toNumberList: function ( ids ) {
			numberedList = ids.join(';');
console.log("[bmc] numberedList: " + numberedList);
            return numberedList;
        },
/////////
/////////
/////////
        // sendAction: function ( action, args ) {
// console.log("[bmc] ENTER sendAction: " + action + " : " );
// console.log(args);
            // var params = {};
            // if (args) {
                // for (var key in args) {
                    // params[key] = args[key];
                // }
            // }
            // params.lock = true;
// console.log("[bmc] params: ");
// console.log(params);


            // this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" +action+'.html', params, this, function (result) { });
// console.log("[bmc] EXIT sendAction: " + action + " : " );
        // },
/////////
/////////
/////////
};
