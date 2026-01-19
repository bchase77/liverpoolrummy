<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * LiverpoolRummy implementation : © Bryan Chase <bryanchase@yahoo.com>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * liverpoolrummy.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in liverpoolrummy_liverpoolrummy.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
  require_once( APP_BASE_PATH."view/common/game.view.php" );
  
  class view_liverpoolrummy_liverpoolrummy extends game_view
  {
    function getGameName() {
        return "liverpoolrummy";
    }    
  	function build_page( $viewArgs )
  	{		
        // Get players & players number
        $players = $this->game->loadPlayersBasicInfos();
        $players_nbr = count( $players );
		
        /*********** Place your code below:  ************/

//		This works
//        $number_to_display = 4;
//        $this->tpl['CURRENT_HAND_TYPE'] = $number_to_display;
		//$sevdebug = $this->game->gamestate_labels["currentHandType"];

// Constants for translation
//		$this->tpl['MYHANDTRANSLATED'] = self::_( 'My Hand' );
//        $this->tpl['CURRENT_HAND_TYPE'] = " " . $handTarget;


// TODO: Why doesn't this get seen when it's in material.inc.php? It must not be in 2 places.
/*
$this->handTypes = array( // Qty of Sets, Qty of Runs
  0 => array( "7 Sets", 2, 0),
  1 => array( "1 Set and 1 Run", 1, 1),
  2 => array( "2 Runs", 0, 2),
  3 => array( "3 Sets", 3, 0),
  4 => array( "2 Sets and 1 Run", 2, 1),
  5 => array( "1 Set and 2 Runs", 1, 2),
  6 => array( "3 Runs", 0, 3)
);
*/

		$target_translated = self::_("Target"); 
		$hand0_translated = self::_("2 Sets"); 
		$hand1_translated = self::_("1 Set and 1 Run"); 
		$hand2_translated = self::_("2 Runs"); 
		$hand3_translated = self::_("3 Sets"); 
		$hand4_translated = self::_("2 Sets and 1 Run"); 
		$hand5_translated = self::_("1 Set and 2 Runs"); 
		$hand6_translated = self::_("3 Runs"); 

		$this->handTypes = array( // Hand targets associate with the down areas:
		  0 => array( $target_translated => $hand0_translated, "QtySets" => 2, "QtyRuns" => 0, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Empty" ),
		  1 => array( $target_translated => $hand1_translated, "QtySets" => 1, "QtyRuns" => 1, "Area_A" => "Set", "Area_B" => "Run", "Area_C" => "Empty" ),
		  2 => array( $target_translated => $hand2_translated, "QtySets" => 0, "QtyRuns" => 2, "Area_A" => "Run", "Area_B" => "Run", "Area_C" => "Empty" ),
		  3 => array( $target_translated => $hand3_translated, "QtySets" => 3, "QtyRuns" => 0, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Set" ),
		  4 => array( $target_translated => $hand4_translated, "QtySets" => 2, "QtyRuns" => 1, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Run" ),
		  5 => array( $target_translated => $hand5_translated, "QtySets" => 1, "QtyRuns" => 2, "Area_A" => "Set", "Area_B" => "Run", "Area_C" => "Run" ),
		  6 => array( $target_translated => $hand6_translated, "QtySets" => 0, "QtyRuns" => 3, "Area_A" => "Run", "Area_B" => "Run", "Area_C" => "Run" )
		);
/*
$this->handTypes = array( // Hand targets associate with the down areas:
  0 => array( "Target" => "2 Sets",           "QtySets" => 2, "QtyRuns" => 0, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Empty" ),
  1 => array( "Target" => "1 Set and 1 Run",  "QtySets" => 1, "QtyRuns" => 1, "Area_A" => "Set", "Area_B" => "Run", "Area_C" => "Empty" ),
  2 => array( "Target" => "2 Runs",           "QtySets" => 0, "QtyRuns" => 2, "Area_A" => "Run", "Area_B" => "Run", "Area_C" => "Empty" ),
  3 => array( "Target" => "3 Sets",           "QtySets" => 3, "QtyRuns" => 0, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Set" ),
  4 => array( "Target" => "2 Sets and 1 Run", "QtySets" => 2, "QtyRuns" => 1, "Area_A" => "Set", "Area_B" => "Set", "Area_C" => "Run" ),
  5 => array( "Target" => "1 Set and 2 Runs", "QtySets" => 1, "QtyRuns" => 2, "Area_A" => "Set", "Area_B" => "Run", "Area_C" => "Run" ),
  6 => array( "Target" => "3 Runs",           "QtySets" => 0, "QtyRuns" => 3, "Area_A" => "Run", "Area_B" => "Run", "Area_C" => "Run" )
);
*/
		$gameMethods = get_class_methods($this->game);

		$debug = $gameMethods;

		self::trace("[bmc] build_page: ");
		
//var_dump($debug);
//die('okSev');
//        $to_display = $sevdebug;

		//$to_display = getGameStateValue( 'currentHandType' );
		$htNumber = $this->game->getGameStateValue( 'currentHandType' );
		
		//self::dump("[bmc] handTypes(view83):", $this->handTypes);

		if ( $htNumber != null ) {
		
//		$handTarget = $this->handTypes[$htNumber]["Target"];  // TODO Aug03: Throws undefined offset
		$handTarget = $this->handTypes[$htNumber][$target_translated];  // TODO Aug03: Throws undefined offset
		
//		self::dump("[bmc] this->handTypes[]:", $this->handTypes[$htNumber]);
//		self::dump("[bmc] this->handTypes[]:", $this->handTypes[$htNumber]["Target"]); // TODO Aug03: Throws undefined offset
		self::dump("[bmc] this->handTypes[]:", $this->handTypes[$htNumber][$target_translated]); // TODO Aug03: Throws undefined offset
		
        $this->tpl['CURRENT_HAND_TYPE'] = " " . $handTarget;

//        $this->tpl['HANDTARGET'] = $this->handTypes[ $htNumber ][ 'Target' ];// TODO Aug03: Throws undefined offset
        $this->tpl['HANDTARGET'] = $this->handTypes[ $htNumber ][ $target_translated ];// TODO Aug03: Throws undefined offset

		}

		// $discardSize = $this->game->getGameStateValue( 'discardSize' );
		// self::dump( "[bmc] (View) PLURAL:", $discardSize );
		
		// if ( $discardSize != 1 ) {
			// self::trace( "[bmc] view.php PLURAL TO S");
			// $this->tpl['DISCARDPLURAL'] = "s";
		// } else {
			// self::trace( "[bmc] view.php PLURAL TO nothing");
			// $this->tpl['DISCARDPLURAL'] = "";
		// }

		$template = self::getGameName() . "_" . self::getGameName();

		//$area_A_target = $this->game->getGameStateValue( 'area_A_target' );
		//$area_B_target = $this->game->getGameStateValue( 'area_B_target' );
		//$area_C_target = $this->game->getGameStateValue( 'area_C_target' );
		
        // this will inflate our goDownArea block with actual players data
        $this->page->begin_block($template, "goDownArea");
		
        foreach ( $players as $player_id => $info ) {
            //$dir = array_shift($directions);
            $this->page->insert_block("goDownArea", array(
				"PLAYER_ID" => $player_id,
				"PLAYER_NAME" => $players [$player_id] ['player_name'],
//                "PLAYER_COLOR" => $players [$player_id] ['player_color']
				));
        }

/*
        // this will inflate our wishListArea block with card images
        $this->page->begin_block($template, "wishListArea");
		
        for ( $color = 1; $color <= 4; $color++ ) {
			for ( $value = 1; $value <= 13; $value++ ) {
				
            $this->page->insert_block("wishListArea", array(
				"color" => $color,
				"value" => $value
				));
			}
        }
*/		


		
        /*
        
        // Examples: set the value of some element defined in your tpl file like this: {MY_VARIABLE_ELEMENT}

        // Display a specific number / string
        $this->tpl['MY_VARIABLE_ELEMENT'] = $number_to_display;

        // Display a string to be translated in all languages: 
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::_("A string to be translated");

        // Display some HTML content of your own:
        $this->tpl['MY_VARIABLE_ELEMENT'] = self::raw( $some_html_code );
        
        */
        
        /*
        
        // Example: display a specific HTML block for each player in this game.
        // (note: the block is defined in your .tpl file like this:
        //      <!-- BEGIN myblock --> 
        //          ... my HTML code ...
        //      <!-- END myblock --> 
        

        $this->page->begin_block( "tutorialrumone_tutorialrumone", "myblock" );
        foreach( $players as $player )
        {
            $this->page->insert_block( "myblock", array( 
                                                    "PLAYER_NAME" => $player['player_name'],
                                                    "SOME_VARIABLE" => $some_value
                                                    ...
                                                     ) );
        }
        
        */

        /*********** Do not change anything below this line  ************/
  	}
  }
