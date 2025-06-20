import{
    levelMissionDataArr
} from './levelMissionData.js'

import{
	is_have_ad,
	tracking_ad_status,
	none_tracking_ad_status,
	set_tracking_ad_status,
	is_bottom_banner,
	bottom_height,
	is_top_margin,
	load_ad,
	show_ad,
	get_lang,
	is_done_ad,
	no_ad_show,
	tracking_is_done_ad,
	game_loading_completed,
	gameplay,
	is_label_showed,
	progression_event,
    design_event,
	platform_ad,
	game_analytics,
	is_game_analytics,
	parent,
	is_fullscreen
} from './AdsConfig.js'

//VIBRATION AND HAPTICS
// Check if the Vibration API is supported
function checkVibrationSupport() {
    return "vibrate" in navigator;
}

// Trigger a simple vibration (e.g., 200ms)
function simpleVibration() {
    if (checkVibrationSupport()) {
        navigator.vibrate(300); // Vibrate for 200ms
        console.log("Simple vibration triggered.");
    } else {
        console.log("Vibration API not supported on this device/browser.");
    }
}

// Experimental: Web Haptics API (limited support, requires secure context)
async function triggerHaptics() {
    if ("hapticFeedback" in navigator) {
        try {
            await navigator.hapticFeedback("light"); // Possible values: "light", "medium", "heavy"
            console.log("Haptic feedback triggered.");
        } catch (error) {
            console.error("Haptic feedback failed:", error);
            simpleVibration();
        }
    } else {
        console.log("Web Haptics API not supported.");
        simpleVibration();
    }
}
//**--------------------------------- */

//LEVEL GOALS MISSION ADVENTURE MODE
var tempLevelGoalsArr = [];
var starLevelCollectedArr = [];

//**--------------------------------- */

var tutorialCompletedArr = [1,1,1,1,1,1,1,1];
const unlockedBoosterArr = [{"classic_level_min":[2,5,9]},{"adventure_level_min":[5,12,23]}];
var boosterDataArr = {"hammer":0,"shake":0,"brush":0,"rainbow":0};

var ms_24 = 86400000;   	//86400000 = 24 hours   //180000 = 3 minutes    //600000 = 10 minutes
var default_weekly_arr = [
    {"status":0, "bonus_face":0, "count":1},
    {"status":0, "bonus_face":1, "count":1},
    {"status":0, "bonus_face":2, "count":1},
    {"status":0, "bonus_face":3, "count":1},
    {"status":0, "bonus_face":1, "count":1},
    {"status":0, "bonus_face":2, "count":1},
    {"status":0, "bonus_face":3, "count":1}
]
var weekly_arr = [];
// status index; 0:nextdaily(claim yet) 1:today 2: dailyclaimed 3:missingday

var exp_time = 0;


// Tracks window focus state and ad watching status
let hasFocus = true; // Indicates if the window is currently focused
let isWatchingAd = false; // Indicates if an ad is being watched

// Set up focus event listeners only if not watching an ad
if (!isWatchingAd) {
    // Handle window losing focus
    window.onblur = () => {
        console.log(`focus: ${hasFocus}`);
    };

    // Handle window gaining focus
    window.onfocus = () => {
        console.log(`focus: ${hasFocus}`);
    };
}
