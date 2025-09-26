// Configuration and state variables
export let platform_ad = "Test";
export let parent = window.parent.window;
export let get_lang = new URLSearchParams(window.location.search).get('lang') || "en"; // Default to English ("en")
export let god_mode = new URLSearchParams(window.location.search).get('gm') || "on"; // Default to "off"
export let tracking_ad_status = "none"; // Tracks ad status (e.g., started, completed, skipped)
export let is_done_ad = false; // Prevents multiple ad calls on single button click
export let is_have_ad = false; // True: use platform ads, False: use sample ads
export let is_game_analytics = false; // Enables/disables game analytics
export let is_bottom_banner = false; // Controls bottom banner display
export let is_label_showed = false; // Controls label visibility
export let is_top_margin = false; // Controls top margin for banner
export let bottom_height = 120; // Banner height when active
export let is_fullscreen = false; // Fullscreen mode status
export let init_success = false;
export var userName = "";
export var storagePlatform = "";
export var remaining_ad = 10;

let is_start_init = false; // Tracks initial game start
let initialization_ad = false; // Tracks ad initialization
let count_ad_reward = 0; // Tracks rewarded ad count
let count_ad_interstitial = 0; // Tracks interstitial ad count
let count_ad_reset = false; // Tracks ad reset state
let ad_format; // Current ad format (e.g., interstitial, rewarded)
let ad_reward_state; // State for rewarded ads
let is_grant_reward = false; // Tracks reward grant status
let once_preload = false; // Tracks ad preload status
let ad_placement = "null";
export const timeout_GA = 5000;
let is_loaded_interstitial_ad = false;
let is_loaded_rewarded_ad = false;
var interst_ad = null;
var reward_ad = null;



function init_config_ad() {
    switch (platform_ad) {
        case "Azerion":
            break;
        case "Gameloft":
            is_fullscreen = true;
            break;
        case "Glance":
            is_have_ad = true;
            is_bottom_banner = true;
            is_top_margin = true;
            break;
        case "Lagged":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "LudiGames":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "PlayDeck":
            is_have_ad = true;
            break;
        case "Poki":
            is_have_ad = true;
            is_fullscreen = true;
            break;
        case "Transsion":
            is_have_ad = true;
            is_bottom_banner = true;
            is_fullscreen = true;
            break;
        case "Xiaomi":
            is_have_ad = true;
            is_bottom_banner = true;
            is_label_showed = true;
            is_fullscreen = true;
            break;
        case "Yandex":
            is_have_ad = true;
            break;
        case "Facebook":
            is_have_ad = true;
            break;
        case "Huawei":
            is_have_ad = true;
            break;
        case "CrazyGames":
            is_have_ad = true;
            break;
    }
}

// Initialize ad system
export function init_ad() {
    switch (platform_ad) {
        case "Glance":
        case "Lagged":
        case "Test":
        case "Xiaomi":
            is_game_analytics = true;
            const analyticsKeys = {
                Glance: { game_key: "8ad2240137c6836d8352e4ced5020990", secret_key: "9543332977347ba142231b8e349fc9ec048a64c4" },
                Lagged: { game_key: "0a85c98b9a4e162221699115b6761210", secret_key: "b80cf876404c869678d4665ec7cf3f0cb07a0148" },
                Xiaomi_Deploy: { game_key: "0c5fe6ae9dcbd4c596d4b40737f4ecca", secret_key: "0fcc10df34a1fe95b6b7b5597fa4273b4d2fe390" },
                Xiaomi: { game_key: "0d76c889ecc5d264114c0560d6d1c5ee", secret_key: "b624637ee346ddda537d7def9a54bcb6e50d87a8" },
                Test: { game_key: "0d76c889ecc5d264114c0560d6d1c5ee", secret_key: "b624637ee346ddda537d7def9a54bcb6e50d87a8" }
            };
            const { game_key, secret_key } = analyticsKeys[platform_ad] || {};
            game_analytics("initialize", game_key, secret_key);
            if (platform_ad === "Lagged") {
                preventDefaultNavigation();
                // const script_tag = document.createElement('script');
                // script_tag.src = 'https://lagged.com/api/rev-share/lagged.js';
                // document.head.appendChild(script_tag);
                setTimeout(() => LaggedAPI.init('lagdev_14489', 'ca-pub-2609959643441983'), 100);
            }
            break;
        case "PlayDeck":
            parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');
            window.addEventListener('message', handlePlayDeckMessages);
            break;
        case "Poki":
            //  is_game_analytics = true;
            // game_analytics("initialize", "0d76c889ecc5d264114c0560d6d1c5ee", "b624637ee346ddda537d7def9a54bcb6e50d87a8");

            preventDefaultNavigation();
            // const script_tag = document.createElement('script');
            // script_tag.src = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';
            // document.head.appendChild(script_tag);
            setTimeout(() => {
                if (window.PokiSDK) {
                    PokiSDK.init()
                        .then(() => {
                            console.log("Poki SDK successfully initialized");
                            PokiSDK.setDebug(true);
                        })
                        .catch(() => console.log("Poki SDK failed, loading game anyway"));
                }
            }, 150);
            break;
        case "Yandex":
            YaGames
            .init()
            .then(ysdk => {
                console.log('Yandex SDK initialized');
                window.ysdk = ysdk;
            });
            YaGames.init()
            .then(ysdk => ysdk.getFlags())
            .then(flags => {
                if (flags.difficulty === 'hard'){
                
                }
            });
            break;
        case "Facebook":
            // const script_tag = document.createElement('script');
            // script_tag.src = 'https://connect.facebook.net/en_US/fbinstant.7.1.js';
            // document.head.appendChild(script_tag);
            setTimeout(() => {
                 FBInstant.initializeAsync()
                .then(function() {
                    return FBInstant.startGameAsync();
                })
                .then(function() {
                    const playerName = FBInstant.player.getName();
                    const playerId = FBInstant.player.getID();
                    
                    console.log("Player Name:", playerName);
                    console.log("Player ID:", playerId);
                    console.log("Player Locale:", FBInstant.getLocale());
                });
            }, 100);
            break;
        case "Huawei":
            // const script_tag = document.createElement('script');
            // script_tag.src = 'https://h5hosting.dbankcdn.com/cch5/pps-jssdk/mobile/ppsads.js';
            // document.head.appendChild(script_tag);
            break;
        case "CrazyGames":
            function waitForUserName(retries = 20, delay = 100) {
                if (typeof window.CrazyGames !== undefined && typeof window.CrazyGames.SDK !== undefined) {
                    if (window.userName != undefined && window.userName != "Guest") {
                        userName = window.userName;
                        storagePlatform = "crazygames_storage";
                    }
                    else{
                        if (retries > 0) {
                            setTimeout(() => waitForUserName(retries - 1, delay), delay);
                        } else {
                            storagePlatform = "local";
                        } 
                    }
                } else {
                    if (retries > 0) {
                        setTimeout(() => waitForUserName(retries - 1, delay), delay);
                    } else {
                        storagePlatform = "local";
                    }
                }
            }
            // waitForUserName();
            const script_tag = document.createElement('script');
            script_tag.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
            document.head.appendChild(script_tag);
            
            setTimeout(() => {
                if (window.CrazyGames) {
                    console.log("start init");
                    window.CrazyGames.SDK.init()
                        .then(() => {
                            // window.CrazyGames.SDK.user.getUser()
                            // .then(user => {
                            //     if (user) {
                            //     console.log("Username:", user.username); 
                            //     userName = user.username;   // simpan ke global var
                            //     } else {
                            //     console.log("User not logged in");
                            //     }
                            // })
                            // .catch(err => {
                            //     console.error("Failed to get user", err);
                            // });
                            waitForUserName();
                        })  
                        .catch(() => console.log("SDK failed, loading game anyway"));
                }
            }, 500);
            

            break;
    }
    console.log("init_success");
}

// Prevent default navigation for specific platforms
function preventDefaultNavigation() {
    // window.addEventListener('keydown', ev => {
    //     if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
    //         ev.preventDefault();
    //     }
    // });
    // window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
}

// Handle PlayDeck messages
function handlePlayDeckMessages({ data }) {
    const playdeck = data?.playdeck;
    if (!playdeck) return;

    switch (playdeck.method) {
        case 'getUserProfile':
            if (playdeck.value) get_lang = playdeck.value.locale;
            break;
        case 'getPlaydeckState':
            window.isPlayDeckOpened = playdeck.value;
            window.c3_callFunction("audio_set", playdeck.value ? "mute" : "unmute");
            break;
        case 'rewardedAd':
            tracking_ad_status = "completed";
            break;
        case 'errAd':
        case 'skipAd':
        case 'notFoundAd':
            tracking_ad_status = "skipped";
            break;
        case 'startAd':
            tracking_ad_status = "started";
            break;
    }
}

// Initialize ad system on first run
if (!initialization_ad) {
    initialization_ad = true;
    init_config_ad();
    init_ad();
}

// Ad tracking functions
export function set_tracking_ad_status(status) {
    tracking_ad_status = status;
}

export function none_tracking_ad_status() {
    tracking_ad_status = "none";
}

export function set_ad_placement(ap = "") {
    ad_placement = ap;
}

export function no_ad_show() {
    is_done_ad = false;
}

// Handle game loading completion
export function game_loading_completed(loading_pg) {
    switch (platform_ad) {
        case "Glance":
            window.progressBar(loading_pg);
            window.sendCustomAnalyticsEvent("game_load", {});
            window.init_sticky_banner();
            break;
        case "PlayDeck":
            setTimeout(() => {
                parent.postMessage({ playdeck: { method: 'loading', value: 100 } }, '*');
                parent.postMessage({ playdeck: { method: 'sendAnalyticNewSession' } }, '*');
            }, 1000);
            break;
        case "Poki":
            if (window.PokiSDK) {
                PokiSDK.gameLoadingFinished();
                show_ad("start_session");
            }
            break;
        case "Transsion":
            athena_send("loading_end");
            window.h5sdk.gameLoadingCompleted();
            break;
        case "Yandex":
            ysdk.features.LoadingAPI.ready();
            break;
        case "Facebook":
            // Informs the SDK of loading progress
            FBInstant.setLoadingProgress(100);
            // FBInstant.startGameAsync()
		    // .then(function() {
            // console.log("start_Game");
		    // });
            break;
        case "CrazyGames":
            // window.CrazyGames.SDK.game.loadingStop();
            break;
    }
}

// Handle gameplay events
var gameplay_status_global = "none";
export function gameplay(gameplay_status, days = 0) {
    gameplay_status_global = gameplay_status;
    switch (platform_ad) {
        case "Glance":
            const glanceEvents = {
                start: () => {
                    if (!is_start_init) {
                        console.log("start_gameplay");
                        is_start_init = true;
                        window.sendCustomAnalyticsEvent("game_start", {});
                    } else {
                        window.sendCustomAnalyticsEvent("game_replay", {});
                    }
                },
                replay: () => {
                    console.log("replay_gameplay");
                    window.sendCustomAnalyticsEvent("game_replay", {});
                },
                stop: () => {
                    console.log("end_gameplay");
                    window.sendCustomAnalyticsEvent("game_end", {});
                },
                game_life_end: () => {
                    console.log("game_life_end");
                    window.sendCustomAnalyticsEvent("game_life_end", {});
                },
                completed_transactions: () => {
                    console.log("completed_transactions");
                    window.sendCustomAnalyticsEvent("ingame_transactions", {});
                }
            };
            glanceEvents[gameplay_status]?.();
            break;
        case "LudiGames":
            if (window.dataLayer) {
                const label = gameplay_status === "days" ? `D${days < 10 ? '0' + days : days} - Thor's Merge` : "Thor's Merge";
                const action = {
                    days: "Return",
                    homepage: "Main Menu",
                    start: "Start",
                    stop: "Completion"
                }[gameplay_status];
                if (action) {
                    window.dataLayer.push({
                        event: "ga_event",
                        ga_category: "Gamepage",
                        ga_action: action,
                        ga_label: label,
                        ga_noninteraction: true
                    });
                }
            }
            break;
        case "Poki":
            if (window.PokiSDK) {
                if (gameplay_status === "start") PokiSDK.gameplayStart();
                else if (gameplay_status === "stop") PokiSDK.gameplayStop();
            }
            break;
        case "Yandex":
            if (gameplay_status === "start") {
                console.log("start_gameplay");
                ysdk.features.GameplayAPI.start();
            } else if (gameplay_status === "stop") {
                console.log("stop_gameplay");
                ysdk.features.GameplayAPI.stop();
            }
            break;
        case "CrazyGames":
            if (window.CrazyGames) {
                if (gameplay_status === "start") window.CrazyGames.SDK.game.gameplayStart();
                else if (gameplay_status === "stop") window.CrazyGames.SDK.game.gameplayStop();
            }
            break;
    }
}

// Track ad completion
export function tracking_is_done_ad(_is_done_ad) {
    is_done_ad = _is_done_ad;
}

//for majamojo
// function isJsonString(str) {       
// 	try {
// 		var data = JSON.parse(str);
// 		return data;
// 	} catch (e) {
// 		return false;
// 	}
// }

// Game analytics initialization and events
export function game_analytics(ga, game_key, secret_key) {
    if (!is_game_analytics) return;

    switch (ga) {
        case "initialize":
            //NEW RULE FOR INIT GA, set this event to index html after load the JS.
            gameanalytics.GameAnalytics.configureAvailableResourceCurrencies(["coins", "hammer", "shake", "brush", "rainbow"]);
            gameanalytics.GameAnalytics.configureAvailableResourceItemTypes(["shop", "star_jar", "daily_login", "weekly_login", "add_booster_pop", "buy_booster_pop", "use_booster", "tutorial", "insufficient_pop_up", "initial", "buy_moves"]);
            gameanalytics.GameAnalytics.configureAvailableCustomDimensions01(["new_user", "returning_user", "old_user"]);
            gameanalytics.GameAnalytics.initialize(game_key, secret_key);
            gameanalytics.GameAnalytics.setEnabledInfoLog(true);
            setTimeout(() => progression_event("start", "loading"), timeout_GA);
            break;
        case "start_session":
            gameanalytics.GameAnalytics.startSession();
            break;
        case "end_session":
            gameanalytics.GameAnalytics.endSession();
            break;
    }
}

// Progression event tracking
export function progression_event(pe = "null", prog_1 = "null", prog_2 = "null", prog_3 = "null", game_score = 0) {
    if (is_game_analytics) {
        const progression = gameanalytics.EGAProgressionStatus;
        if (pe === "start") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Start, prog_1, prog_2);
        } else if (pe === "completed") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Complete, prog_1, prog_2, prog_3, game_score || undefined);
        } else if (pe === "failed") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Fail, prog_1, prog_2, prog_3, game_score || undefined);
        }
    }

    if (platform_ad === "PlayDeck") {
        const eventBase = { name: ev_name, points: game_score };
        const event_achievement = { ...eventBase, description: { event_status: pe, game_duration } };
        const event_progress = { ...eventBase, description: { event_count: ev_count, event_status: pe, game_duration } };
        if (pe === "start") {
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_progress } }, '*');
        } else if (pe === "completed") {
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_achievement } }, '*');
            parent.postMessage({ playdeck: { method: 'sendAnalytics', value: event_progress } }, '*');
        }
    }
}
//Design event tracking
export function design_event(de_parent = "null", de_child = "null", de_value = 0){
    if (is_game_analytics) {
        gameanalytics.GameAnalytics.addDesignEvent(`${de_parent}:${de_child}`, de_value);
    }
}
//Resouce event tracking
export function resource_event(re = "null", item_type = "null", item_id = "null", currency_re = "null", amount_re = 0){
    if (is_game_analytics) {
        const resource = gameanalytics.EGAResourceFlowType;
        if(re === "source"){
            gameanalytics.GameAnalytics.addResourceEvent(resource.Source, currency_re, amount_re, item_type, item_id, "");
        }
        else if(re === "sink"){
            gameanalytics.GameAnalytics.addResourceEvent(resource.Sink, currency_re, amount_re, item_type, item_id, "");
        }
    }
}
//Dimension event tracking
export function dimension_event_GA(de_value = ""){
    if (is_game_analytics) {
        if(de_value === "new_user"){
            gameanalytics.GameAnalytics.setCustomDimension01("new_user");
        }
        else if(de_value === "returning_user"){
            gameanalytics.GameAnalytics.setCustomDimension01("returning_user");
        }
         else if(de_value === "old_user"){
            gameanalytics.GameAnalytics.setCustomDimension01("old_user");
        }
    }
}
//Ads event tracking
export function ad_event_GA(ad_action = "Clicked", ad_type = "RewardedVideo", ad_sdk_name = "xiaomi", ad_placement = "ad_for_coins", custom_field = "", merge_field = ""){
    if (is_game_analytics) {
        gameanalytics.GameAnalytics.addAdEvent(gameanalytics.EGAAdAction[ad_action], gameanalytics.EGAAdType[ad_type], ad_sdk_name, ad_placement);
    }
}

// Analytics beforeunload listener
if (is_game_analytics) {
    gameanalytics.GameAnalytics.addOnBeforeUnloadListener({
        onBeforeUnload: () => {
            const page_name = window.c3_callFunction("page_name");
            gameanalytics.GameAnalytics.addDesignEvent(`closed_game:${page_name}`);
        }
    });
}

// Load ad (placeholder for preload logic)
export function load_ad(_ad_format, _ad_reward_state = -1) {
     //placement-id facebook list
    //403800600388584  //petmod
    //2487129365389020
    //1196456724956425
    //1196456948289736
    //1196456841623080  //petcafe '1287995509583488_1196456841623080'
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    console.log(`load_ad: ${_ad_format}`);
    if(ad_format == "interstitial"){
        if(!is_loaded_interstitial_ad){
            switch (platform_ad){
                case "Facebook":
                    FBInstant.getInterstitialAdAsync('1036071814995688_403800600388584',)
                    .then(function(interstitial) {
                        interst_ad = interstitial;
                        return interst_ad.loadAsync();
                    }).then(function() {
                        is_loaded_interstitial_ad = true;
                    }).catch(function(err){
                        is_loaded_interstitial_ad = false;
                    });
                    break;
                case "Huawei":
                    interst_ad = ppsads.createInterstitialAd({
                        slotId: "testb4znbuh3n2"
                    });
                    interst_ad.load();
                    interst_ad.onLoad((interstitial)=>{
                        console.log(interstitial);
                         is_loaded_interstitial_ad = true;
                    });
                    interst_ad.onError((interstitial)=>{
                        console.log(interstitial);
                         is_loaded_interstitial_ad = false;
                    });
                    break;
            }
        }
    }
    else{
         if(!is_loaded_rewarded_ad){
            switch (platform_ad){
                case "Facebook":
                    FBInstant.getRewardedVideoAsync('1036071814995688_403800600388584',)
                .then(function(rewardedVideo) {
                    reward_ad = rewardedVideo;
                    return reward_ad.loadAsync();
                    }).then(function() {
                        is_loaded_rewarded_ad = true;
                    }).catch(function(err){
                        is_loaded_rewarded_ad = false;
                    });
                    break;
                case "Huawei":
                    reward_ad = ppsads.createRewardAd({
                        slotId: "testx9dtjw8hp"
                    });
                    console.log("reward_ad", reward_ad);
                    reward_ad.load(()=>{
                        console.log("load success");
                    })
                    reward_ad.onLoad((rewardedVideo)=>{
                        console.log(rewardedVideo);
                         is_loaded_rewarded_ad = true;
                    });
                    reward_ad.onError((rewardedVideo)=>{
                        console.log("error");
                         is_loaded_rewarded_ad = false;
                    });
                    break;
            }
        }
    }
}

// Show ad based on platform and format
export function show_ad(_ad_format, _ad_reward_state = -1) {
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    if(ad_format == "interstitial") ad_event_GA("Clicked", "Interstitial", platform_ad.toLowerCase(), ad_placement);
    else if (ad_format == "rewarded") ad_event_GA("Clicked", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
    
    switch (platform_ad) {
        case "Glance":
            if (_ad_format === "start_session") ad_format = "interstitial";
            if (ad_format === "interstitial") {
                tracking_ad_status = "skipped";
            } else if (ad_format === "rewarded") {
                window.rewardEvent();
            }
            break;
        case "Lagged":
            if (_ad_format === "start_session") ad_format = "interstitial";
            if (ad_format === "interstitial") {
                tracking_ad_status = "started";
                LaggedAPI.APIAds.show(() => {
                        tracking_ad_status = "skipped";
                        ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                        console.log("ad completed");
                    },
                    (error) => {
                        tracking_ad_status = "skipped";
                         ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
                        console.error("Ad error:", error);
                    }
                );
            } else if (ad_format === "rewarded") {
                LaggedAPI.GEvents.reward(
                    (success, showAdFn) => {
                        if (success) {
                            tracking_ad_status = "started";
                            ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            showAdFn();
                        } else {
                            ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
                            tracking_ad_status = "error";
                            console.log("NOTviewed");
                        }
                    },
                    success => {
                        tracking_ad_status = success ? "completed" : "skipped";
                    }
                );
            }
            break;
        case "LudiGames":
            window.playAds();
            window.addEventListener("gl_ads_state_change", ({ detail }) => {
                if (detail.newState === window.AdsState.STARTED) {
                    tracking_ad_status = "started";
                    console.log("handle ads closed: resume game, sound...");
                } else if (detail.newState === window.AdsState.COMPLETE) {
                    tracking_ad_status = "completed";
                    console.log("handle ads closed: resume game, sound...");
                }
            });
            break;
        case "PlayDeck":
            parent.postMessage({ playdeck: { method: "showAd" } }, '*');
            break;
        case "Poki":
            if (window.PokiSDK) {
                if (_ad_format === "start_session") ad_format = "interstitial";
                if (ad_format === "interstitial") {
                    //PokiSDK.gameplayStop();
                    PokiSDK.commercialBreak(() => {
                        tracking_ad_status = "started";
                        console.log("started_interstitial");
                    }).then(() => tracking_ad_status = "skipped");
                } else if (ad_format === "rewarded") {
                     if(gameplay_status_global === "start") PokiSDK.gameplayStop();
                    PokiSDK.rewardedBreak(() => {
                        tracking_ad_status = "started";
                    }).then(withReward => {
                        tracking_ad_status = withReward ? "completed" : "skipped";
                    });
                }
            }
            break;
        case "Xiaomi":
			switch(ad_format){
				case "start_session":
					ad_format = "interstitial";
					window.adBreak({
							type: "preroll",
							name: "my_interstitial",
					beforeAd: () => {
					console.log("beforeAd");
						is_done_ad = false;
						tracking_ad_status = "started";
                        ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
					},
					adBreakDone: (placementInfo) => {
					if (placementInfo.breakStatus === "dismissed") {
						console.log("dismissed");
						tracking_ad_status = "skipped";

					} else if (placementInfo.breakStatus !== "viewed") {
                        tracking_ad_status = "skipped";
                        ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
						console.log("NOTviewed");

					}
					else{
							//NOTE: grant reward here
							tracking_ad_status = "skipped";
					} 
					},
					});
				  	break;
				case "interstitial":
					window.adBreak({
							type: "start",
							name: "my_interstitial",
					beforeAd: (result_ad) => {
                        console.log("result_ad", result_ad)
					console.log("beforeAd");
						is_done_ad = false;
						tracking_ad_status = "started";
                        ad_event_GA("Show", "Interstitial", platform_ad.toLowerCase(), ad_placement);
					},
					afterAd: () => {
					console.log("afterAd");
						tracking_ad_status = "skipped";
					},
					adBreakDone: (placementInfo) => {
					if (placementInfo.breakStatus === "dismissed") {
						console.log("dismissed");
						tracking_ad_status = "skipped";

					} else if (placementInfo.breakStatus !== "viewed") {
                        tracking_ad_status = "skipped";
                        ad_event_GA("FailedShow", "Interstitial", platform_ad.toLowerCase(), ad_placement);
						console.log("NOTviewed", placementInfo.breakStatus);

					}
					else{
							//NOTE: grant reward here
							tracking_ad_status = "skipped";
					} 
					},
					});
				  	break;
				case "rewarded":
					window.adBreak({
					type: "reward",
					name: "my_reward",
					beforeAd: () => {
					console.log("beforeAd");
						is_done_ad = false;
						tracking_ad_status = "started";
					},
					afterAd: () => {
					console.log("afterAd");
						tracking_ad_status = "completed";
					},
					adDismissed: () => {
					console.log("adDismissed");
					},
					adViewed: () => {
					console.log("adViewed");
                    ad_event_GA("Show", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
					tracking_ad_status = "started";

					},
					beforeReward: (showAdFn) => {
					console.log("beforeReward");
					showAdFn();
					},
					adBreakDone: (placementInfo) => {
					if (placementInfo.breakStatus === "dismissed") {
						tracking_ad_status = "skipped";

					} else if (placementInfo.breakStatus !== "viewed") {
                        tracking_ad_status = "error";
                        ad_event_GA("FailedShow", "RewardedVideo", platform_ad.toLowerCase(), ad_placement);
						console.log("NOTviewed", placementInfo.breakStatus);
						return;
					}
					else{
						tracking_ad_status = "completed";
					} 
					},
					});
					break;	
			}
			break;
        case "Yandex":
            switch(ad_format){
                case "interstitial":
                    ysdk.adv.showFullscreenAdv({
                        callbacks: {
                            onOpen: () => {
                                tracking_ad_status = "started";
                                console.log('Video ad open.');
                            },
                            onClose: function(wasShown) {
                                // An action on ad closing.
                                tracking_ad_status = "skipped";
                            },
                            onError: function(error) {
                                // An action in case of an error.
                                tracking_ad_status = "skipped";
                            }
                        }
                    })
                    break;
                case "rewarded":
                    ysdk.adv.showRewardedVideo({
                        callbacks: {
                            onOpen: () => {
                                tracking_ad_status = "started";
                                console.log('Video ad open.');
                            },
                            onRewarded: () => {
                                is_grant_reward = true;
                                console.log('Rewarded!');
                            },
                            onClose: () => {
                                if(is_grant_reward == true){
                                    tracking_ad_status = "completed";
                                    is_grant_reward = false;
                                }
                                else{
                                    tracking_ad_status = "skipped";
                                    }
                                console.log('Video ad closed.');
                            },
                            onError: (e) => {
                                tracking_ad_status = "error";
                                console.log('Error while open video ad:', e);
                            }
                        }
                    })
                    break;
            }
            break;
        case "Facebook":
             switch(ad_format){
                case "interstitial":
                    //app-id_placement-id
                    // FBInstant.getInterstitialAdAsync('1036071814995688_403800600388584',)
                    // .then(function(interstitial) {
                    //     interst_ad = interstitial;
                    //     tracking_ad_status = "started";
                    //     return interst_ad.loadAsync();
                    // }).then(function() {
                    //     return interst_ad.showAsync()
                    //     .then(function() {
                    //         tracking_ad_status = "skipped";
                    //         // Ad completed 
                    //     })
                    //     .catch(function(error) {
                    //         console.error('Ad error:', error);
                    //         tracking_ad_status = "skipped";
                    //     });
                    // }).catch(function(err){
                    //     setTimeout(() => {
                    //     tracking_ad_status = "error";
                    //     console.error('interstitial failed to preload: ' + err.message);
                    //     }, 500);
                    // });
                    interst_ad.showAsync()
                    .then(function() {
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                        // Ad completed 
                    })
                    .catch(function(error) {
                        console.error('Ad error:', error);
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                    });
                    break;
                case "rewarded":
                     //app-id_placement-id
                    //   FBInstant.getRewardedVideoAsync('1036071814995688_403800600388584',)
                    // .then(function(rewardedVideo) {
                    //       reward_ad = rewardedVideo;
                    //       tracking_ad_status = "started";
                    //     return reward_ad.loadAsync();
                    // }).then(function() {
                    //     return reward_ad.showAsync()
                    //     .then(function() {
                    //         tracking_ad_status = "completed";
                    //         // Ad completed 
                    //     })
                    //     .catch(function(error) {
                    //         console.error('Ad error:', error);
                    //         tracking_ad_status = "error";
                    //     });
                    // }).catch(function(err){
                    //     setTimeout(() => {
                    //     tracking_ad_status = "error";
                    //     console.error('rewarded failed to preload: ' + err.message);
                    //     }, 500);
                    // });
                    reward_ad.showAsync()
                    .then(function() {
                        tracking_ad_status = "completed";
                        is_loaded_rewarded_ad = false;
                        load_ad("rewarded");
                            // Ad completed 
                        })
                    .catch(function(error) {
                        console.error('Ad error:', error);
                        tracking_ad_status = "error";
                        is_loaded_rewarded_ad = false;
                        load_ad("rewarded");
                    });
                    break;
            }
            break;
        case "Huawei":
            switch (ad_format){
                case "interstitial":
                    console.log("call_show_interstitial");
                    interst_ad.show(() => {
                        console.log("show_interstitial");
                    });
                    interst_ad.onShow((e_ads) => {
                        console.log(e_ads);
                    })
                    interst_ad.onClose(() => {
                        console.log("Interstitial ditutup.");
                        // Hancurkan instance agar tidak menumpuk
                        interst_ad.destroy();
                        tracking_ad_status = "skipped";
                        is_loaded_interstitial_ad = false;
                        load_ad("interstitial");
                    });
                    break;
                case "rewarded":
                    console.log("call_show_rewarded");
                    reward_ad.show({
                        callbacks: {
                            onShow: () => {
                                tracking_ad_status = "started";
                                console.log("Rewarded ad dibuka.");
                            },

                            onReward: (rewardData) => {
                                is_grant_reward = true;
                                console.log("Reward granted:", rewardData);
                            },

                            onComplete: () => {
                                console.log("Playback selesai ✅");
                            },

                            onClose: () => {
                                if (is_grant_reward) {
                                    tracking_ad_status = "completed";
                                    console.log("User menonton iklan full ✅");
                                    // kasih reward di sini
                                    is_grant_reward = false; // reset
                                } else {
                                    tracking_ad_status = "skipped";
                                    console.log("User skip / tutup iklan ❌");
                                }

                                reward_ad.destroy();
                            },

                            onError: (err) => {
                                tracking_ad_status = "error";
                                console.error("Error saat tampilkan iklan:", err);
                            }
                        }
                    });
                    break;
            }
        break;
        case "CrazyGames":
            switch(ad_format){
                case "interstitial":
                    const cg_interstitial_callbacks = {
                        adFinished: () => {
                            tracking_ad_status = "skipped";
                            console.log("End midgame ad")
                        },
                        adError: (error) => {
                            tracking_ad_status = "skipped";
                            console.log("Error midgame ad", error);
                        },
                        adStarted: () => {
                            tracking_ad_status = "started";
                            console.log("Start midgame ad");
                        },
                    };
                    window.CrazyGames.SDK.ad.requestAd("midgame", cg_interstitial_callbacks);
                    break;
                case "rewarded":
                    const cg_rewarded_callbacks = {
                        adFinished: () => {
                            tracking_ad_status = "completed";
                            console.log("End rewarded ad")
                        },
                        adError: (error) => {
                            tracking_ad_status = "error";
                            console.log("Error rewarded ad", error);
                        },
                        adStarted: () => {
                            tracking_ad_status = "started";
                            console.log("Start rewarded ad");
                        },
                    };
                    window.CrazyGames.SDK.ad.requestAd("rewarded", cg_rewarded_callbacks);
                    break;
            }
        break;
    }
}