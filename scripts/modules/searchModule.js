/**
 * module for searching expressions
 */
addModule(new Module("searchModule", function() {

    /**
     * State for searching an expression
     */
    var searchState = new State("searchState");
    searchState.init = function () {
        this.cancelAction.cancelAct = function() {
            callContentScriptMethod("cancelSearchState", {});
            say("I stopped searching");
        };
    };

    /**
     * search for an expression
     * @type {Action}
     */
    var search = new Action("search expression", 1, searchState);
    search.addCommands([
        new Command("search for (.*)", 1),
        new Command("search (.*)", 1)
    ]);
    search.act = function (arguments) {
        callContentScriptMethod("search", arguments[0], function (params) {
            if (typeof params !== 'undefined') {
                if (params.hasOwnProperty("content")) {
                    say(params.content);
                }
                if (params.hasOwnProperty("followingState")) {
                    if (params.followingState == "globalCommonState") {
                        if (recognizing) activeState.stopSpeechRecognition();
                        changeActiveState(globalCommonState);
                    }
                }
            }
        });
    };
    this.addAction(search);
    searchState.addAction(search);

    /**
     * change language of expression
     * @type {Action}
     */
    var searchLanguage = new MultilingualAction("searchLanguage", search, [{notify: "What shall i search for", say: "What shall i search for?"}]);
    searchLanguage.addCommands([
        new Command("search language", 0),
        new Command("change search language", 0)
    ]);
    this.addAction(searchLanguage);
    searchState.addAction(searchLanguage);

    /**
     * next match
     * @type {Action}
     */
    var next = new Action("nextMatch", 0, searchState);
    next.addCommand(new Command("next", 0));
    next.act = function() {
      callContentScriptMethod("nextMatch", {}, function (params) {
          if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
              say(params.content);
          }
      });
    };
    searchState.addAction(next);

    /**
     * previous match
     * @type {Action}
     */
    var prev = new Action("previousMatch", 0, searchState);
    prev.addCommand(new Command("previous", 0));
    prev.act = function () {
        callContentScriptMethod("previousMatch", {}, function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    searchState.addAction(prev);

    /**
     * go to certain match
     * @type {Action}
     */
    var certainMatch = new Action("certainMatch", 1, searchState);
    certainMatch.addCommand(new Command("go to match (.*)", 1));
    certainMatch.act = function () {
        callContentScriptMethod("certainMatch", arguments[0], function (params) {
            if (typeof params !== 'undefined' && params.hasOwnProperty("content")) {
                say(params.content);
            }
        });
    };
    searchState.addAction(certainMatch);
}));