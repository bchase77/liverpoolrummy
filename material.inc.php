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
 * material.inc.php
 *
 * LiverpoolRummy game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */
$this->colors = array(
    1 => array( 'name'   => clienttranslate('clubs'),
                'nametr' => clienttranslate('clubs') ),
    2 => array( 'name'   => clienttranslate('spades'),
                'nametr' => clienttranslate('spades') ),
    3 => array( 'name'   => clienttranslate('hearts'),
                'nametr' => clienttranslate('hearts') ),
    4 => array( 'name'   => clienttranslate('diamonds'),
                'nametr' => clienttranslate('diamonds') ),
	5 => array( 'name'   => clienttranslate('joker'),
                'nametr' => clienttranslate('wild') )
);

$this->values_label = array(
    1  => clienttranslate('Ace'),
    2  => '2',
    3  => '3',
    4  => '4',
    5  => '5',
    6  => '6',
    7  => '7',
    8  => '8',
    9  => '9',
    10 => '10',
    11 => clienttranslate('Jack'),
    12 => clienttranslate('Queen'),
    13 => clienttranslate('King')
);

$target_translated  = clienttranslate("Target"); 
$hand0MI_translated = clienttranslate("2 Sets; No more no less (Set is 3 any suit of same value)"); 
$hand1MI_translated = clienttranslate("1 Set and 1 Run; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)");
$hand2MI_translated = clienttranslate("2 Runs; No more no less (Run is 4 in sequence of same suit. Ace can play as high or low.)"); 
$hand3MI_translated = clienttranslate("3 Sets; No more no less (Set is 3 any suit of same value)"); 
$hand4MI_translated = clienttranslate("2 Sets and 1 Run; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)"); 
$hand5MI_translated = clienttranslate("1 Set and 2 Runs; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)"); 
$hand6MI_translated = clienttranslate("3 Runs; In a 2-player game you must buy your own discard! (Run is 4 in sequence of same suit. Ace is high or low.)"); 

$this->handTypesMayI = array( // Hand targets associate with the down areas:
  0 => array( $target_translated => $hand0MI_translated, "QtySets" => 2, "QtyRuns" => 0, "deal" => 7 ),
  1 => array( $target_translated => $hand1MI_translated, "QtySets" => 1, "QtyRuns" => 1, "deal" => 8 ),
  2 => array( $target_translated => $hand2MI_translated, "QtySets" => 0, "QtyRuns" => 2, "deal" => 9 ),
  3 => array( $target_translated => $hand3MI_translated, "QtySets" => 3, "QtyRuns" => 0, "deal" => 10 ),
  4 => array( $target_translated => $hand4MI_translated, "QtySets" => 2, "QtyRuns" => 1, "deal" => 11 ),
  5 => array( $target_translated => $hand5MI_translated, "QtySets" => 1, "QtyRuns" => 2, "deal" => 12 ),
  6 => array( $target_translated => $hand6MI_translated, "QtySets" => 0, "QtyRuns" => 3, "deal" => 13 )
);

$this->handTypesFull = array( // Hand targets associate with the down areas:
  0 => array( "Target" => clienttranslate( "2 Sets; No more no less (Set is 3 any suit of same value)"),
	"QtySets" => 2, "QtyRuns" => 0, "deal" => 10 ),
  1 => array( "Target" => clienttranslate( "1 Set and 1 Run; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)"),
    "QtySets" => 1, "QtyRuns" => 1, "deal" => 11 ),
  2 => array( "Target" => clienttranslate( "2 Runs; No more no less (Run is 4 in sequence of same suit. Ace can play as high or low.)"),
	"QtySets" => 0, "QtyRuns" => 2, "deal" => 11 ),
  3 => array( "Target" => clienttranslate( "3 Sets; No more no less (Set is 3 any suit of same value)"),
	"QtySets" => 3, "QtyRuns" => 0, "deal" => 12 ),
  4 => array( "Target" => clienttranslate( "2 Sets and 1 Run; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)"),
	"QtySets" => 2, "QtyRuns" => 1, "deal" => 12 ),
  5 => array( "Target" => clienttranslate( "1 Set and 2 Runs; No more no less (Set is 3 any suit of same value; Run is 4 in sequence of same suit. Ace can play as high or low.)"),
	"QtySets" => 1, "QtyRuns" => 2, "deal" => 12 ),
  6 => array( "Target" => clienttranslate( "3 Runs; No more no less (Run is 4 in sequence of same suit. Ace can play as high or low.)"),
	"QtySets" => 0, "QtyRuns" => 3, "deal" => 12 )
);

$this->handTypes2S0R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[0]
);

$this->handTypes1S1R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[1]
);

$this->handTypes0S2R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[2]
);

$this->handTypes3S0R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[3]
);

$this->handTypes2S1R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[4]
);

$this->handTypes1S2R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[5]
);

$this->handTypes0S3R = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[6]
);

$this->handTypesTwo = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[0],
  1 => $this->handTypesFull[2]
);
$this->handTypesThree = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[0],
  1 => $this->handTypesFull[5],
  2 => $this->handTypesFull[6]
);

$this->handTypesShort = array( // Hand targets associate with the down areas:
  0 => $this->handTypesFull[0],
  1 => $this->handTypesFull[2],
  2 => $this->handTypesFull[4],
  3 => $this->handTypesFull[6]
);

/*

Example:

$this->card_types = array(
    1 => array( "card_name" => ...,
                ...
              )
);

*/
