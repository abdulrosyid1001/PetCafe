import{
    levelMissionDataArr
} from './levelMissionData.js'


//VIBRATION AND HAPTICS
// Check if the Vibration API is supported
function checkVibrationSupport() {
    return "vibrate" in navigator;
}

// Trigger a simple vibration (e.g., 200ms)
function simpleVibration() {
    if (checkVibrationSupport()) {
        navigator.vibrate(200); // Vibrate for 200ms
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
var starLevelCollectedArr = [{"level": 1, "star":0},{"level": 2, "star":0},{"level": 3, "star":0},{"level": 4, "star":0},{"level": 5, "star":0},{"level": 6, "star":0},{"level": 7, "star":0},{"level": 8, "star":0},{"level": 9, "star":0},{"level": 10, "star":0}];

//**--------------------------------- */

var tutorialCompletedArr = [1,1,1,1,1,1,1,1];
const unlockedBoosterArr = [{"classic_level_min":[5,7,9]},{"adventure_level_min":[7,13,20]}];

var ms_24 = 86400000;   	//86400000 = 24 hours   //180000 = 3 minutes    //600000 = 10 minutes
var weekly_arr = [0,0,0,0,0,0,0];
//0:nextdaily(claim yet) 1:today 2: dailyclaimed 3:missingday

