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



function selectVariable() {
    // Define the probabilities for the 6 variables (in the same order)
    const probabilities = [0.10, 0.30, 0.00, 0.20, 0.30, 0.10];
    // Corresponding variable names (e.g., var1, var2, ..., var6)
    const variables = ['var1', 'var2', 'var3', 'var4', 'var5', 'var6'];

    // Generate a random number between 0 and 1
    const random = Math.random();
    let cumulativeProbability = 0;

    // Iterate through probabilities to find the selected variable
    for (let i = 0; i < probabilities.length; i++) {
        cumulativeProbability += probabilities[i];
        if (random <= cumulativeProbability) {
            // console.log(variables[i]);
            return variables[i];
        }
    }

    // Fallback in case of rounding errors (should rarely happen)
    return variables[variables.length - 1];
}

// Test the function by running it multiple times
function testDistribution(iterations = 10000) {
    const results = { var1: 0, var2: 0, var3: 0, var4: 0, var5: 0, var6: 0 };
    
    // Run the selection multiple times
    for (let i = 0; i < iterations; i++) {
        const selected = selectVariable();
        results[selected]++;
    }

    // Calculate and display the percentage for each variable
    console.log(`Results after ${iterations} iterations:`);
    for (let variable in results) {
        const percentage = ((results[variable] / iterations) * 100).toFixed(2);
        console.log(`${variable}: ${results[variable]} times (${percentage}%)`);
    }
}
