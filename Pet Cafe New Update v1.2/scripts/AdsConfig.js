// Configuration and state variables
export let platform_ad = "Poki";
export let parent = window.parent.window;
export let get_lang = new URLSearchParams(window.location.search).get('lang') || "en"; // Default to English
export let tracking_ad_status = "none"; // Tracks ad status (e.g., started, completed, skipped)
export let is_done_ad = false; // Prevents multiple ad calls on single button click
export let is_have_ad = false; // True: use platform ads, False: use sample ads
export let is_game_analytics = false; // Enables/disables game analytics
export let is_bottom_banner = false; // Controls bottom banner display
export let is_label_showed = false; // Controls label visibility
export let is_top_margin = false; // Controls top margin for banner
export let bottom_height = 120; // Banner height when active
export let is_fullscreen = false; // Fullscreen mode status

let is_start_init = false; // Tracks initial game start
let initialization_ad = false; // Tracks ad initialization
let count_ad_reward = 0; // Tracks rewarded ad count
let count_ad_interstitial = 0; // Tracks interstitial ad count
let count_ad_reset = false; // Tracks ad reset state
let ad_format; // Current ad format (e.g., interstitial, rewarded)
let ad_reward_state; // State for rewarded ads
let is_grant_reward = false; // Tracks reward grant status
let once_preload = false; // Tracks ad preload status

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
            break;
    }
}

// Initialize ad system
export function init_ad() {
    switch (platform_ad) {
        case "Glance":
        case "Lagged":
        case "Xiaomi":
            is_game_analytics = true;
            const analyticsKeys = {
                Glance: { game_key: "8ad2240137c6836d8352e4ced5020990", secret_key: "9543332977347ba142231b8e349fc9ec048a64c4" },
                Lagged: { game_key: "0a85c98b9a4e162221699115b6761210", secret_key: "b80cf876404c869678d4665ec7cf3f0cb07a0148" },
                Xiaomi: { game_key: "73d049a9b22b03d98be9e8e743f84ef0", secret_key: "dcf97fae44e6fc08d59fb48c009f4373a31496e6" }
            };
            const { game_key, secret_key } = analyticsKeys[platform_ad] || {};
            game_analytics("initialize", game_key, secret_key);
            if (platform_ad === "Lagged") {
                preventDefaultNavigation();
                const script_tag = document.createElement('script');
                script_tag.src = 'https://lagged.com/api/rev-share/lagged.js';
                document.head.appendChild(script_tag);
                setTimeout(() => LaggedAPI.init('lagdev_14489', 'ca-pub-2609959643441983'), 100);
            }
            break;
        case "PlayDeck":
            parent.postMessage({ playdeck: { method: 'getUserProfile' } }, '*');
            window.addEventListener('message', handlePlayDeckMessages);
            break;
        case "Poki":
            preventDefaultNavigation();
            const script_tag = document.createElement('script');
            script_tag.src = 'https://game-cdn.poki.com/scripts/v2/poki-sdk.js';
            document.head.appendChild(script_tag);
            setTimeout(() => {
                if (window.PokiSDK) {
                    PokiSDK.init()
                        .then(() => {
                            console.log("Poki SDK successfully initialized");
                            PokiSDK.setDebug(true);
                        })
                        .catch(() => console.log("Poki SDK failed, loading game anyway"));
                }
            }, 100);
            break;
        case "Test":
            is_game_analytics = true;
            game_analytics("initialize", "0d76c889ecc5d264114c0560d6d1c5ee", "b624637ee346ddda537d7def9a54bcb6e50d87a8");
            break;
    }
    console.log("init_success");
}

// Prevent default navigation for specific platforms
function preventDefaultNavigation() {
    window.addEventListener('keydown', ev => {
        if (['ArrowDown', 'ArrowUp', ' '].includes(ev.key)) {
            ev.preventDefault();
        }
    });
    window.addEventListener('wheel', ev => ev.preventDefault(), { passive: false });
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
    }
}

// Handle gameplay events
export function gameplay(gameplay_status, days = 0) {
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
            gameanalytics.GameAnalytics.initialize(game_key, secret_key);
            gameanalytics.GameAnalytics.setEnabledInfoLog(true);
            setTimeout(() => progression_event("start", "loading"), 500);
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
export function progression_event(pe = "null", ev_name = "null", ev_level = 0, game_duration = 0, game_score = 0) {
    if (is_game_analytics) {
        const progression = gameanalytics.EGAProgressionStatus;
        if (pe === "start") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Start, ev_name, ev_level);
        } else if (pe === "completed") {
            gameanalytics.GameAnalytics.addProgressionEvent(progression.Complete, ev_name, ev_level, game_duration, game_score || undefined);
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
export function design_event(ev_name = "null", value = "null" ){
    if (is_game_analytics) {
        gameanalytics.GameAnalytics.addDesignEvent(`${ev_name}:${value}`);
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
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    console.log(`load_ad: ${_ad_format}`);
}

// Show ad based on platform and format
export function show_ad(_ad_format, _ad_reward_state = -1) {
    ad_format = _ad_format;
    ad_reward_state = _ad_reward_state;
    console.log(`show_ad: ${_ad_format}`);

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
                    console.log("ad completed");
                });
            } else if (ad_format === "rewarded") {
                LaggedAPI.GEvents.reward(
                    (success, showAdFn) => {
                        if (success) {
                            tracking_ad_status = "started";
                            console.log("track_status_in_js", tracking_ad_status);
                            showAdFn();
                        } else {
                            tracking_ad_status = "skipped";
                            console.log("track_status_in_js", tracking_ad_status);
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
                    PokiSDK.gameplayStop();
                    PokiSDK.rewardedBreak(() => {
                        tracking_ad_status = "started";
                    }).then(withReward => {
                        tracking_ad_status = withReward ? "completed" : "skipped";
                    });
                }
            }
            break;
        case "Xiaomi":
            if (_ad_format === "start_session") ad_format = "interstitial";
            const adConfig = {
                interstitial: { type: "start", name: "my_interstitial" },
                rewarded: { type: "reward", name: "my_reward" }
            }[_ad_format] || {};
            window.adBreak({
                type: adConfig.type,
                name: adConfig.name,
                beforeAd: () => {
                    console.log("beforeAd");
                    is_done_ad = false;
                    tracking_ad_status = "started";
                },
                afterAd: () => {
                    console.log("afterAd");
                    tracking_ad_status = ad_format === "rewarded" ? "completed" : "canceled";
                },
                adDismissed: () => console.log("adDismissed"),
                adViewed: () => {
                    console.log("adViewed");
                    tracking_ad_status = "started";
                },
                beforeReward: showAdFn => {
                    console.log("beforeReward");
                    showAdFn();
                },
                adBreakDone: placementInfo => {
                    if (placementInfo.breakStatus === "dismissed") {
                        console.log("dismissed");
                        tracking_ad_status = "skipped";
                    } else if (placementInfo.breakStatus === "viewed") {
                        tracking_ad_status = ad_format === "rewarded" ? "completed" : "skipped";
                    } else {
                        console.log("NOTviewed");
                    }
                }
            });
            break;
    }
}