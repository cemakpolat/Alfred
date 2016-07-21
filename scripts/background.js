/**
 * global state where all modules are reachable
 * @global
 */
var globalCommonState = new State("GlobalCommonState");
globalCommonState.init = function () {
	this.ableToCancel = false;
	
	this.actions = [];
	//add actions of modules
	for (var i = 0; i < modules.length; i++) {
		for (var j = 0; j < modules[i].actions.length; j++) {
			this.addAction(modules[i].actions[j]);
		}
	}
};

/** @global */
var activeState;
/** @global */
var modules = [];
/** @global */
var permissionGrounded = true;

/**
 * add a module to this extension
 * @param {Module} module - Module Object
 * @global
 */
function addModule(module) {
	module.init();
	modules.push(module);
}

/**
 * change the active state
 * @param {State} newState - new State
 * @global
 */
function changeActiveState(newState) {
	activeState = newState;
	activeState.run();
}

//import jquery
importJsFile("scripts/jquery-3.1.0.min.js");
//import all modules
importJsFile("scripts/modules/moduleList.js");


//add listener to browser action
//noinspection JSUnusedLocalSymbols
/**
 * is called when the browser action button is clicked
 * @param {chrome.tabs.Tab} tab
 */
function browserAction(tab) {
	openSidebar();
	activeState.recognizing = !activeState.recognizing;
	if (activeState.recognizing) {
		//start recognition
		activeState.createWebkitSpeechRecognition();
		//change icon
		chrome.browserAction.setIcon({path:"../images/mic_on.png"});
	} else {
		//start recognition
		activeState.stopSpeechRecognition();
		//change icon
		chrome.browserAction.setIcon({path:"../images/mic_off.png"});
	}
}
chrome.browserAction.onClicked.addListener(browserAction);


window.addEventListener("load", function() {
	if (!('webkitSpeechRecognition' in window)) {
		alert("webkitSpeechRecognition not available.");
	} else {
		changeActiveState(globalCommonState);
	}
}, false);


