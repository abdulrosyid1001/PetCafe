import{
    levelMissionDataArr
} from './levelMissionData.js'

import{
    translations
} from './languanges.js'

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
    resource_event,
    dimension_event_GA,
    ad_event_GA,
    set_ad_placement,
	platform_ad,
	game_analytics,
	is_game_analytics,
    timeout_GA,
	parent,
	is_fullscreen,
    god_mode,
    init_success,
    storagePlatform,
    remaining_ad
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

var build_version = "v3.0.0";


//STORAGE TYPE
//1 local_storage
//2 telcos_storage
//3 facebook_storage
var storageType = "local_storage"; 

//**--------------------------------- */

//LEVEL GOALS MISSION ADVENTURE MODE
var tempLevelGoalsArr = [];
var starLevelCollectedArr = [];
var atemptEachLevel = [];

//**--------------------------------- */

var tutorialCompletedArr = [1,1,1,1,1,1,1,1,1,1,1,1,1]; //last realesed is 11 index, start from 0
const unlockedBoosterArr = [{"classic_level_min":[2,5,9]},{"adventure_level_min":[5,12,23,32,43]}];
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


//BANNER ADS

if(platform_ad == "Xiaomi"){
    const html = document.getElementsByTagName("html")[0];
    const head = document.getElementsByTagName("head")[0];
    const body = document.getElementsByTagName("body")[0];

    body.style.display = "flex";
    body.style.position = "relative";

    createAdBanner();
}

function createAdBanner() {
   
    const body = document.body;
    if (!body) {
        console.error("Body element not found");
        return;
    }

    // banner anchor
    const banner_anchor = document.createElement("div");
    banner_anchor.className = "ad-banner";
    banner_anchor.style.position = "fixed";
    banner_anchor.style.bottom = "0";
    banner_anchor.style.display = "flex";
    banner_anchor.style.justifyContent = "center";
    banner_anchor.style.alignItems = "center";
    banner_anchor.style.width = "100%";
    banner_anchor.style.height = "60px";

    ///XIAOMI BANNER
    // ins element ads
    // const ins = document.createElement("ins");
    // ins.className = "adsbygoogle start-50 translate-middle-x";
    // ins.style.position = "fixed";
    // ins.style.display = "block";
    // ins.style.zIndex = "22";
    // ins.style.width = "320px";
    // ins.style.height = "50px";
    // ins.style.backgroundColor = "none";
    // ins.style.bottom = "0";
    // ins.setAttribute("data-ad-client", "ca-pub-3423367744172781");
    // ins.setAttribute("data-ad-slot", "7237889123");

    // // add ins to banner anchor
    // banner_anchor.appendChild(ins);

    // // add banner anchor to body
    // body.appendChild(banner_anchor);

    // // create adsense
    // const script = document.createElement("script");
    // script.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";
    // body.appendChild(script);

    ///CRAZY GAMES BANNER

    const banner_container = document.createElement("div");
    banner_container.id = "banner-container";
    banner_anchor.appendChild(banner_container);

    // masukkan ke halaman
    document.body.appendChild(banner_anchor);

    // === Call Banner Ads ===
    async function loadBannerAd() {
		if(window.CrazyGames != undefined && window.CrazyGames.SDK != undefined){
        	try {
			await window.CrazyGames.SDK.banner.requestBanner({
				id: "banner-container", // harus sama dengan div child tadi
				width: 320,
				height: 50,
			});
			} catch (e) {
			console.log("Banner request error", e);
			}
		}
    }

     // panggil setelah SDK siap
    loadBannerAd();
}

function showAdBanner() {
    if(platform_ad == "Xiaomi"){
        const banner_anchor = document.querySelector(".ad-banner");
        if (banner_anchor) {
            banner_anchor.style.display = "flex";
        } else {
            console.warn("Banner ad element not found. Creating a new one.");
            createAdBanner(); 
        }
    }
    else if (platform_ad == "CrazyGames"){
		if(window.CrazyGames != undefined && window.CrazyGames.SDK != undefined){
        	createAdBanner();
		}
    }
}

function hideAdBanner() {
   if(platform_ad == "Xiaomi"){
        const banner_anchor = document.querySelector(".ad-banner");
        if (banner_anchor) {
            banner_anchor.style.display = "none";
        } else {
            console.warn("Banner ad element not found");
        }
   }
   else if(platform_ad == "CrazyGames"){
		try {
            if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.banner) {
                window.CrazyGames.SDK.banner.clearAllBanners();
            }
        } catch (err) {
        }
   }
}

function removeAdAnchor(){
     if(platform_ad == "Xiaomi"){
         const anchors = document.querySelectorAll('ins[data-anchor-shown="true"]');
             anchors.forEach(anchor => {
            // Menghapus elemen dari DOM
            anchor.remove();
        });
     }
}


