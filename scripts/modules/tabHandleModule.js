/**
 * tab handling actions
*/
addModule(new Module("tabHandleModule", function() {

	/**
 	 * open new tab
	 */
	var newTab = new Action("new Tab", 0, globalCommonState);
	newTab.addCommand(new Command("new tab", 0));
	newTab.act = function() {
		chrome.tabs.create({active: true});
	};
	this.addAction(newTab);

	/**
	 * open new page
	 */
	var openPage = new Action("open new page", 1, globalCommonState);
	openPage.addCommand(new Command("open page (.*)", 1));
	openPage.act = function(arguments) {
		var url = "";
		var repWhitespace = "";
		//opens new page in new tab
		if(arguments[0].search(/new tab/) != -1) {
			// opens page in new tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			var split = repWhitespace.split("innewtab", 1);
			url = "http://www." + split + ".com";
			chrome.tabs.create({url: url, active: true});
		//opens new page in current tab
		} else {
			//opens page in current tab
			repWhitespace = arguments[0].replace(/\s/g, '');
			url = "http://www." + repWhitespace + ".com";
			chrome.tabs.update({url: url, active: true});
		}
	};
	this.addAction(openPage);

	/**
 	 * close tab(s)/window
	 */
	var close = new Action("close", 1, globalCommonState);
	close.addCommands([new Command("close (tab)", 1), new Command("close (window)", 1)]);
	close.act = function(arguments) {
		if(arguments[0].search(/tab/) != -1) {
			//closes current tab
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.remove(tab.id);
			})
		} else {
			//closes current window
			chrome.windows.getCurrent(function(window) {
				chrome.windows.remove(window.id);
			})
		}
	};
	this.addAction(close);

	/**
 	 * reload the current tab
	 */
	var reload = new Action("reload", 0, globalCommonState);
	reload.addCommand(new Command("reload", 0));
	reload.act = function() {
		chrome.tabs.reload();
	};
	this.addAction(reload);

	/**
 	 * go back one page
	 */
	var goBack = new Action("go back one page", 0, globalCommonState);
	goBack.addCommand(new Command("go back", 0));
	goBack.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goBack", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say("I am at the first page. I cannot go back a page");
							notify("I can not go back");
						}
					});
				}, 500);
			});
		});
	};
	this.addAction(goBack);

	/**
	 * go forward one page
     */
	var goForward = new Action("go forward one page", 0, globalCommonState);
	goForward.addCommand(new Command("go forward", 0));
	goForward.act = function() {
		var curr = "";
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			curr = tabs[0].url;
			callContentScriptMethod("goForward", {}, function() {
				//wait until new page is loaded
				setTimeout(function () {
					chrome.tabs.query({currentWindow: true, active: true}, function(tabs) {
						if (curr === tabs[0].url) {
							say("I am at the last page. I cannot go forward a page");
							notify("I can not go forward");
						}
					});
				}, 500);
			});
		});
	};
	this.addAction(goForward);

}));
