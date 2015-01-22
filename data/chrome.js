/* Commons references for icon names
 */
icon_pcgw_blue = chrome.extension.getURL("data/icons/icon_blue.svg");
icon_surround_sound = chrome.extension.getURL("data/icons/surround-sound-icon.svg");
icon_widescreen = chrome.extension.getURL("data/icons/widescreen-icon.svg");
icon_windowed = chrome.extension.getURL("data/icons/windowed-mode-icon.svg");
icon_wikipedia = chrome.extension.getURL("data/icons/wikipedia-icon.svg");
icon_partial_cont = chrome.extension.getURL("data/icons/partial-controller-support-icon.svg");
icon_full_cont = chrome.extension.getURL("data/icons/full-controller-support-icon.svg");
icon_remapping = chrome.extension.getURL("data/icons/remapping-icon.svg");
icon_subtitles = chrome.extension.getURL("data/icons/subtitles-icon.svg");
icon_cc = chrome.extension.getURL("data/icons/cc-icon.svg");

/* Check for future expansion
 */
switch (true) {
	case /^www\.gog\.com$/.test(window.location.host):
		console.log("Performing GOG stuff.");
		start();
	break;
}
