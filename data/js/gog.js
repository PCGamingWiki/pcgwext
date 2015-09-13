function getPageName(url) {
	/* Extract page title from URL
	 */
	if (url && url.match(/^\/(game|forum|support)\/([A-Za-z0-9\-\_]+)/)) {
		console.log("Page name: " + RegExp.$2);
		return RegExp.$2;
	}
	else {
		return null;
	}
}

function getPageTitle() {
	/* Get page title for our "API"
	 */
	var title = $("meta[name='og:title']").attr("content");
	console.log("Page title: " + title);
	return title.trim();
}

function getStoreData(name, title) {
	/* Get data for store pages and pass it on
	 */
	$.ajax({
		'url': 'http://pcgamingwiki.com/w/api.php',
		'data': {
			'action': 'askargs',
			'conditions': 'GOGcom page::' + name,
			'printouts': 'GOGcom forum|Wikipedia|Controller support|Full controller support|Windowed|Surround sound|Subtitles|Closed captions|Key remapping|Widescreen resolution',
			'format': 'json'
		},
		'success': function(json) {
			console.log("Received response for store page");
			var count = countData(json);
			if (count > 0) {
				console.log("Parsing data");
				var parsed = parseData(json);
			}
			else {
				console.log("No data to parse");
				var parsed = '';
			}

			modifyStorePage(name, title, count, parsed);
		},
		'dataType': 'json'
	});
}

function getForumData(name) {
	/* Get data for forums and pass it on
	 */
	$.ajax({
		'url': 'http://pcgamingwiki.com/w/api.php',
		'data': {
			'action': 'askargs',
			'conditions': 'GOGcom forum::' + name,
			'printouts': 'GOGcom page',
			'format': 'json',
		},
		'success': function(json) {
			console.log("Received response for forums");
			var count = countData(json);
			if (count > 0) {
				var parsed = parseData(json);
				modifyForumPage(name, count, parsed);
			}
			else {
				console.log("No data to parse, nothing to do");
			}
		},
		'dataType': 'json'
	});
}

function getSupportData(name) {
	/* Get data for forums and pass it on
	 */
	$.ajax({
		'url': 'http://pcgamingwiki.com/w/api.php',
		'data': {
			'action': 'askargs',
			'conditions': 'GOGcom page::' + name,
			'printouts': 'GOGcom forum',
			'format': 'json',
		},
		'success': function(json) {
			console.log("Received response for support");
			var count = countData(json);
			if (count > 0) {
				var parsed = parseData(json);
				modifySupportPage(name, count, parsed);
			}
			else {
				console.log("No data to parse, nothing to do");
			}
		},
		'dataType': 'json'
	});
}

function countData(data) {
	/* Count number of results
	 */
	console.log("Counting results");
	var i = 0;
	for (var game in data.query.results){
		i = i + 1;
	}
	console.log("Found " + i + " games");
	return i;
}

function parseData(data) {
	/* Parse received data for first result
	 */
	for (var game in data.query.results) break;

	console.log("Parsing data for " + game);

	var info = new Object({});
	info.url = data["query"]["results"][game]["fullurl"];
	info.forum = data["query"]["results"][game]["printouts"]["GOGcom forum"];
	info.store = data["query"]["results"][game]["printouts"]["GOGcom page"];
	info.wp = data["query"]["results"][game]["printouts"]["Wikipedia"];
	info.wide = data["query"]["results"][game]["printouts"]["Widescreen resolution"];
	info.wind = data["query"]["results"][game]["printouts"]["Windowed"];
	info.remap = data["query"]["results"][game]["printouts"]["Key remapping"];
	info.sound = data["query"]["results"][game]["printouts"]["Surround sound"];
	if (data["query"]["results"][game]["printouts"]["Subtitles"] == "true") {
		info.subs = "subs";
		if (data["query"]["results"][game]["printouts"]["Closed captions"] == "true") {
			info.subs = "cc";
		}
	}
	else {
		info.subs = "";
	}
	if (data["query"]["results"][game]["printouts"]["Controller support"] == "true") {
		if (data["query"]["results"][game]["printouts"]["Full controller support"] == "true") {
			info.cont = "full";
		}
		else {
			info.cont = "partial";
		}
	}
	else {
		info.cont = "";
	}

	return info;
}

function modifyStorePage(page, title, count, data) {
	/* Modify store page 
	 */
	if (count === 1) {
		console.log("Full set of links");

		var bigAppend = '';
		if (data.url.length !== 0) {
			console.log("Adding link to PCGW: " + data.url);
			bigAppend = bigAppend + '<a href="' + data.url + '"><div class="pcgw-button"><img class="ic" src="' + icon_pcgw_blue + '"/>PCGamingWiki</div></a>';
		}

		if (data.wp.length !== 0) {
			console.log("Adding link to Wikipedia page: " + data.wp);
			bigAppend = bigAppend + '<a href="http://en.wikipedia.org/wiki/' + data.wp + '"><div class="pcgw-button"><img class="ic" src="' + icon_wikipedia + '"/>Wikipedia</div></a>';
		}

		if (data.forum.length !== 0) {
			console.log("Adding link to GOG.com forum: " + data.forum);
			bigAppend = bigAppend + '<a href="http://www.gog.com/forum/' + data.forum + '"><div class="pcgw-button">Community</div></a>';
		}

		console.log("Adding link to GOG.com support page: " + page);
		bigAppend = bigAppend + '<a href="http://www.gog.com/support/' + page + '"><div class="pcgw-button">Support</div></a>';

		$('.group-2:first').append('<div class="pcgw-buttons-container">' + bigAppend + '</div>');
	}
	else if (count > 1) {
		console.log("Multiple PCGW pages. Simpler links");

		var bigAppend = '<a href="http://pcgamingwiki.com/api/gog.php?page=' + page +'"><div class="pcgw-button"><img class="ic" src="' + icon_pcgw_blue + '"/>PCGamingWiki</div></a>';
		
		if (data.forum !== "") {
			console.log("Adding link to GOG.com forums (first resutl): " + data.forum);
			bigAppend = bigAppend + '<a href="http://www.gog.com/forum/' + data.forum + '"><div class="pcgw-button">Community</div></a>';
		}
		
		console.log("Adding link to GOG.com support page: " + page);
		bigAppend = bigAppend + '<a href="http://www.gog.com/support/' + page + '"><div class="pcgw-button">Support</div></a>';

		$('.group-2:first').append('<div class="pcgw-buttons-container">' + bigAppend + '</div>');
	}
	else if (count === 0) {
		console.log("No PCGW page. Adding fake link");
		$('.group-2:first').append('<div class="pcgw-buttons-container"><a href="http://pcgamingwiki.com/api/gog.php?page=' + page + '&title=' + title +'"><div class="pcgw-button"><img class="ic" style="transform: translate(-5px, 3px);" src="' + icon_pcgw_blue + '"/>PCGamingWiki</div></a><a href="http://www.gog.com/support/' + page + '"><div class="pcgw-button">Support</div></a></div>');
	}

	if (count === 1) {
		console.log("Adding game features");
		var featAppend = '';
		if (data.wide == "true") {
			console.log("Widescreen support");
			featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_widescreen + '" /><div class="pcgw-features-tooltip">Widescreen resolution</div></div>';
		}
		if (data.wind == "true") {
			console.log("Windowed mode");
			featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_windowed + '" /><div class="pcgw-features-tooltip">Windowed mode</div></div>';
		}
		if (data.remap == "true") {
			console.log("Key remapping");
			featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_remapping + '" /><div class="pcgw-features-tooltip">Key remapping</div></div>';
		}
		if (data.cont.length !== 0) {
			console.log("Controller support " + data.cont);

			if (data.cont === "full") {
				featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_full_cont + '" /><div class="pcgw-features-tooltip">Full controller support</div></div>';
			}
			else if (data.cont === "partial") {
				featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_partial_cont + '" /><div class="pcgw-features-tooltip">Partial controller support</div></div>';
			}
		}
		if (data.sound == "true") {
			console.log("Surround sound support");
			featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_surround_sound + '" /><div class="pcgw-features-tooltip">Surround sound</div></div>';
		}
		if (data.subs.length !== 0) {
			console.log("Subtitles/cc: " + data.subs);
			if (data.subs === "subs") {
				featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_subtitles + '" /><div class="pcgw-features-tooltip">Subtitles</div></div>';
			}
			else if (data.subs === "cc") {
				featAppend = featAppend + '<div class="pcgw-features-icon"><img src="' + icon_cc + '" /><div class="pcgw-features-tooltip">Closed captions</div></div>';
			}
		}

		if (featAppend !== "") {
			$('.header__in').append('<div class="pcgw-features"><p>Features:</p>' + featAppend + '</div>');
		}
		else {
			console.log("No features to add.");
		}
	}
}

function modifyForumPage(page, count, data) {
	/* Modify forum page
	 * 
	 */
	if (count === 1) {
		console.log("Adding store and PCGW links.");
		$('.n_b_b_nr_h').after('<div style="margin-right: 180px; position: absolute; right: 0px;" class="n_b_b_nr_h"><div class="n_b_b_nrs_h n_b_b_nr_last"><a class="n_b_b_nr" href="' + data.url + '">PCGamingWiki</a></div><div class="n_b_b_nrs_h n_b_b_nr_last"><a style="float:right" class="n_b_b_nr" href="http://www.gog.com/game/' + page + '">Store page</a></div></div>');
	}
	else {
		console.log("Adding splitting PCGW link.");
		$('.n_b_b_nr_h').after('<div style="margin-right: 180px; position: absolute; right: 0px;" class="n_b_b_nr_h"><div class="n_b_b_nrs_h n_b_b_nr_last"><a class="n_b_b_nr" href="http://pcgamingwiki.com/api/gog.php?forum=' + page + '">PCGamingWiki</a></div></div>');
	}
}

function modifySupportPage(page, count, data) {
	/* Modify support page
	 */
	console.log("Adding store, forum and PCGW links.")
	if (count === 1) {
		console.log("Real PCGW link");
		var SupAppend = '<div class="l_b_l_bg"><div class="pcgw-support-icon"><img src="' + icon_pcgw_blue + '"/></div><div class="l_b_l_text"><a class="gray_un" href="' + data.url +'">PCGamingWiki</a></div></div>';
	}
	else {
		console.log("Splitting PCGW link");
		var SupAppend = '<div class="l_b_l_bg"><div class="pcgw-support-icon"><img src="' + icon_pcgw_blue + '"/></div><div class="l_b_l_text"><a class="gray_un" href="http://pcgamingwiki.com/api/gog.php?page=' + page +'">PCGamingWiki</a></div></div>';
	}

	console.log("Adding store link");
	SupAppend = SupAppend + '<div class="l_b_l_bg"><div class="l_b_l_text"><a class="gray_un" href="http://www.gog.com/game/' + page +'">Store page</a></div></div>';
	console.log("Adding forum link");
	SupAppend = SupAppend + '<div class="l_b_l_bg"><div class="l_b_l_text"><a class="gray_un" href="http://www.gog.com/forum/' + data.forum +'">Community</a></div></div>';

	$('.light_box_h:last').after('<div class="light_box_h"><div class="light_box_top_h"><div class="light_box_top"></div></div><div class="pcgw-support-container-main">' + SupAppend + '</div><div class="light_box_bottom_h"><div class="light_box_bottom"></div></div></div>')
}

function start() {
	/* Basic behaviour
	 */
	switch (true) {
		case /^\/game\/[A-Za-z0-9\-\_]+/.test(window.location.pathname):
			var page = getPageName(window.location.pathname);
			console.log("Store page for " + page);
			var title = getPageTitle();
			getStoreData(page, title);
		break;

		case /^\/forum\/[A-Za-z0-9\-\_]+/.test(window.location.pathname):
			var page = getPageName(window.location.pathname);
			console.log("Forums: " + page);
			getForumData(page);
		break;

		case /^\/support\/[A-Za-z0-9\-\_]+/.test(window.location.pathname):
			var page = getPageName(window.location.pathname);
			console.log("Support page for " + page);
			getSupportData(page);
		break;
	}
}
