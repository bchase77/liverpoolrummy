<?php

trait PlayerState {
	function getPlayerGoneDown() {
        $sql = "SELECT player_id, gone_down FROM player ";
        return self::getCollectionFromDB($sql, true);
	}
/////
/////
/////
	function setPlayerGoneDown( $player_id, $goneDown /* 0 or 1 */) {
        $sql = "UPDATE player SET gone_down = $goneDown WHERE player_id = $player_id ";
        self::DbQuery( $sql );
	}
/////
/////
/////
	function getPlayerBuying() {
       $sql = "SELECT player_id, buying FROM player ";
       return self::getCollectionFromDB($sql, true);
	}
/////
/////
/////
	function setPlayerBuying( $player_id, $buying ) { // (0==unknown, 1==Not buying 2==Buying)
       $sql = "UPDATE player SET buying = $buying WHERE player_id = $player_id ";
       self::DbQuery( $sql );
	}
/////
/////
/////
	function clearPlayersBuying() {
       $sql = "UPDATE player SET buying = 0 ";
       self::DbQuery( $sql );
	}
/////
/////
/////
    function getPlayersBuyCount() {
		// self::trace( "[bmc] ENTER getPlayersBuyCount" );

		$numberOfBuys =  self::getGameStateValue( 'numberOfBuys' );

		if ( $numberOfBuys == 1 ) { // 0 == 3; 1 == Infinite buys
			$players = self::loadPlayersBasicInfos();
			$infiniteBuys = array();
			
			foreach ( $players as $player ) {
				// self::dump("[bmc] infiniteBuys(player): ", $player[ "player_id" ] );
				
				$infiniteBuys[ $player[ "player_id" ] ] = 99 ;
			}
			// self::dump("[bmc] InfiniteBuys: ", $infiniteBuys );
			return $infiniteBuys;
				
		} else {
			$sql = "SELECT player_id, buy_count FROM player ";
			$buy_countDB = self::getCollectionFromDB($sql, true);
			// self::dump("[bmc] buy_countDB: ", $buy_countDB );
			return $buy_countDB;
		}
    }
/////
/////
/////
    function decPlayerBuyCount( $player_id ) { // Track how many times they bought per hand
		self::dump("[bmc] ENTER decPlayerBuyCount", $player_id );
		$numberOfBuys =  self::getGameStateValue( 'numberOfBuys' );

		if ( $numberOfBuys != 1 ) { // 0 == 3; 1 == Infinite buys
			$sql = "SELECT player_id, buy_count FROM player ";
			$buy_count = self::getCollectionFromDB( $sql, true );

			self::dump("[bmc] buy_count[ player_id ] (decPlayerBuyCount): ", $buy_count );
			
			if ( $buy_count[ $player_id ] > 0 ) {
				$bcUpdate = $buy_count[ $player_id ] - 1;
				$sql = "UPDATE player SET buy_count = $bcUpdate WHERE player_id = $player_id ";
				self::DbQuery( $sql );
			} else {
				throw new BgaUserException( self::_("You cannot buy any more this hand.") );
				self::trace( "[bmc] BGA Exception: Cannot buy any more(decPlayerBuyCount)" );
			}
		} // If it == 1 then don't decrement
    }
/////
/////
/////
    function clearPlayersBuyCount() {
        $sql = "UPDATE player SET buy_count = 3 ";
        self::DbQuery( $sql );
    }
/////
/////
/////

//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
        Each time a player is doing some game action (i.e. clicking something), one of the methods below is called.
        (note: each method below must match an input method in tutorialrumone.action.php)
    */


//TODO: Thinking to cut discardCard into 2.. First discard the card, resolve the buy counts and all that. Then return the web transaction. Then read the buy counts and notify the players as a second step. This should let the database resolve.


	// function discardCard( $card_id, $player_id ) {
}
