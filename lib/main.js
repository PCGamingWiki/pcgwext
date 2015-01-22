var pageMod = require("sdk/page-mod");
var prefs = require("sdk/simple-prefs").prefs;
var self = require("sdk/self").data;

pageMod.PageMod({
	include: "*.gog.com",
	contentStyleFile: self.url("style/gog.css"),
	contentScriptFile: [self.url("js/jQuery.min.js"), self.url("firefox.js"), self.url("js/gog.js")],
	contentScriptOptions: {
		icon_pcgw_blue: self.url('icons/icon_blue.svg'),
		icon_surround_sound: self.url('icons/surround-sound-icon.svg'),
		icon_widescreen: self.url('icons/widescreen-icon.svg'),
		icon_windowed: self.url('icons/windowed-mode-icon.svg'),
		icon_wikipedia: self.url('icons/wikipedia-icon.svg'),
		icon_partial_cont: self.url('icons/partial-controller-support-icon.svg'),
		icon_full_cont: self.url('icons/full-controller-support-icon.svg'),
		icon_remapping: self.url('icons/remapping-icon.svg'),
		icon_subtitles: self.url('icons/subtitles-icon.svg'),
		icon_cc: self.url('icons/cc-icon.svg')
	},
	onAttach: function(worker) {
		worker.port.emit("addLink", []);
	}
});