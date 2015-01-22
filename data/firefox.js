self.port.on("addLink", function(prefs) {
	/* Commons references for icon names
 	*/
	icon_pcgw_blue = self.options.icon_pcgw_blue;
	icon_surround_sound = self.options.icon_surround_sound;
	icon_widescreen = self.options.icon_widescreen;
	icon_windowed = self.options.icon_windowed;
	icon_wikipedia = self.options.icon_wikipedia;
	icon_partial_cont = self.options.icon_partial_cont;
	icon_full_cont = self.options.icon_full_cont;
	icon_remapping = self.options.icon_remapping;
	icon_subtitles = self.options.icon_subtitles;
	icon_cc = self.options.icon_cc;

	/* Check for future expansions
	 */
	switch (true) {
		case /^www\.gog\.com$/.test(window.location.host):
			console.log("Performing GOG stuff.");
			start();
		break;
	}
});
