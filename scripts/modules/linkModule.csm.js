/**
 * csm for interacting with links
 */
var searchedAll = false;
var links;
var i = 0;
var found = [];
var foundParams;

/**
 * find all links
 */
var allLinks = function () {
    $("a")
        .removeClass("highlight")
        .removeClass("topHighlight")
        .addClass("highlight");

    if (id != "") {
        hideMessage({id: id});
    }
    //if link is hidden on page remove class highlight
    $(".highlight:hidden").removeClass("highlight");
    $(".highlight").each(function () {
        if (window.getComputedStyle(this).getPropertyValue("visibility") === "hidden") {
            $(this).removeClass("highlight");
        } else if ($(this).find('> img').length > 0) {
            var images = $(this).find('> img');
            $(images[0]).addClass("highlight");
            $(this).removeClass("highlight");
        }
    });

    links = jQuery.makeArray(document.getElementsByClassName("highlight"));
};

/**
 * show all links
 */
addContentScriptMethod(
    new ContentScriptMethod("showLinks", function () {
        allLinks();
        searchedAll = true;
        if(links.length === 0) {
            showMessage({content: translate("notifyCouldNotFindLinks"), centered: true});
            return({content: translate("sayCouldNotFindLinks"), followingState:"globalCommonState"});
        } else {
            for (i = 0; i < links.length; i++) {
                if (window.scrollY <= $(links[i]).offset().top &&
                    window.scrollX <= $(links[i]).offset().left &&
                    $(links[i]).offset().top - window.innerHeight <= window.scrollY &&
                    $(links[i]).offset().left - window.innerWidth <= window.scrollY) {
                    $(links[i])
                        .removeClass("highlight")
                        .addClass("topHighlight");
                    $('html, body')
                        .animate({scrollTop: $(links[i]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(links[i]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: translate("showAllLinks"),
                        time: 0,
                        cancelable: true,
                        commandLeft: translate("previous"),
                        commandRight: translate("next"),
                        infoCenter: translate("linkXOfY").format([(i + 1), links.length])
                    });
                    return({content: translate("FoundXLinksYouAreOnLinkY").format([links.length, (i + 1)])});
                } else if (i + 1 >= links.length) {
                    i = 0;
                    $(links[0])
                        .removeClass("highlight")
                        .addClass("topHighlight");
                    $('html, body')
                        .animate({scrollTop: $(links[0]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: translate("searchForX").format(['<span style="background-color:yellowgreen">' + parameter + '</span>']),
                        time: 0,
                        cancelable: true,
						commandLeft: translate("previous"),
						commandRight: translate("next"),
                        infoCenter: translate("linkXOfY").format([(i + 1), links.length])
                    });
                    if (links.length > 1) {
                        return({content: translate("FoundXLinksYouAreOnLinkY").format([links.length, (i + 1)])});
                    } else {
                        return({content: translate("FoundOneLink")});
                    }
                }
            }
        }
    })
);

/**
 * show next link
 */
addContentScriptMethod(
    new ContentScriptMethod("nextLink", function () {
        //highlights the next match
        if(found.length < 2) {
            if (i < links.length - 1) {
                $(links[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(links[i + 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(links[i + 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                $(links[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(links[0])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(links[0]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            updateMessage({
                id: id,
                content: translate("showAllLinks"),
                time: 0,
                cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
            });
        } else if(found.length > 1) {
            if (i < found.length - 1) {
                $(found[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(found[i + 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(found[i + 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(found[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                $(found[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(found[0])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(found[0]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(found[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            updateMessage({
                id: id,
                content: translate("showAllLinks") + ': <span style="background-color:yellowgreen">' + foundParams + '</span>',
                time: 0,
                cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
            });
        } else {
            showMessage({content: translate("notifyNoLinkFound"), centered: true});
            return({content: translate("sayNoLinkFound")});
        }
    })
);

/**
 * show previous links
 */
addContentScriptMethod(
    new ContentScriptMethod("previousLink", function () {
        if(found.length < 2) {
            if (i > 0) {
                $(links[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(links[i - 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(links[i - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                $(links[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(links[links.length - 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(links[links.length - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(links[0]).offset().left - window.innerWidth / 2}, 1000);
                i = links.length - 1;
            }
            updateMessage({
                id: id,
				content: translate("showAllLinks"),
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
            });
        } else if (found.length > 1){
            if (i > 0) {
                $(found[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(found[i - 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(found[i - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(found[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                $(found[i])
                    .removeClass("topHighlight")
                    .addClass("highlight");
                $(found[found.length - 1])
                    .removeClass("highlight")
                    .addClass("topHighlight");
                $('html, body')
                    .animate({scrollTop: $(found[found.length - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(found[0]).offset().left - window.innerWidth / 2}, 1000);
                i = found.length - 1;
            }
            updateMessage({
                id: id,
				content: translate("showAllLinks") + ': <span style="background-color:yellowgreen">' + foundParams + '</span>',
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
            });
        } else {
			showMessage({content: translate("notifyNoLinkFound"), centered: true});
			return({content: translate("sayNoLinkFound")});
        }
    })
);

/**
 * go to certain link by number
 */
addContentScriptMethod(
    new ContentScriptMethod("certainLinkByNumber", function (params) {
        foundParams = params;
        if (foundParams.toString() === "one") {
            foundParams = 1;
        }
        if (foundParams <= links.length) {
            $(links[i])
                .removeClass("topHighlight")
                .addClass("highlight");
            $(links[foundParams - 1])
                .removeClass("highlight")
                .addClass("topHighlight");
            $('html, body')
                .animate({scrollTop: $(links[foundParams - 1]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(links[foundParams - 1]).offset().left - window.innerWidth / 2}, 1000);
            i = params - 1;
            updateMessage({
                id: id,
				content: translate("showAllLinks"),
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
            });
        } else {
            showMessage({content: translate("notifyNoLinkXFound").format(['<span style="background-color:lightcoral">' + foundParams + '</span>']), centered: true});
            return({content: translate("sayNoLinkXFound").format([foundParams])});
        }
    })
);

/**
 * go to certain link by name
 */
addContentScriptMethod(
    new ContentScriptMethod("certainLinkByName", function (params) {
        if (searchedAll != true) {
            allLinks();
        }
        foundParams = params;
        var k;
        //if a search by Name was done before, reset the founded links
        var prevFound = found;
        found = [];
        for (var j = 0; j < links.length; j++) {
            if (links[j].innerHTML.toLowerCase().trim() === foundParams.toString().toLowerCase().trim()) {
                $(links[j]).addClass("searched");
                found.push(links[j]);
                k = j;
            } else {
                $(links[j]).removeClass("searched");
            }
        }
        if (prevFound.length > 0) {
            for (var l = 0; l < prevFound.length; l++) {
                $(prevFound[l])
                    .removeClass("topHighlight")
                    .removeClass("highlight");
            }
        }
        var message = {};
        if (found.length > 1){
            $(".highlight").each(function () {
                if ($(this).hasClass("searched") != true) {
                    $(this)
                        .removeClass("highlight")
                        .removeClass("topHighlight");
                }
            });
            $(links[i]).removeClass("topHighlight");
            $(".searched").addClass("highlight");
            $(found[0])
                .removeClass("highlight")
                .addClass("topHighlight");
            i = 0;
            links = found;
            $('html, body')
                .animate({scrollTop: $([found[0]]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $([found[0]]).offset().left - window.innerWidth / 2}, 1000);
            message = {
				content: translate("showAllLinks") + ': <span style="background-color:yellowgreen">' + foundParams + '</span>',
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), found.length])
			};
            if (searchedAll != true) {
                id = showMessage(message);
            } else {
				message.id = id;
                //noinspection JSCheckFunctionSignatures
				updateMessage(message);
            }
            return({content: translate("FoundXLinksYouAreOnLinkY").format([found.length, (i + 1)])});
        } else if (found.length === 1) {
            $(".searched").each(function () {
                $(this).removeClass("searched");
            });
            $(links[i])
                .removeClass("topHighlight")
                .addClass("highlight");
            $(links[k])
                .removeClass("highlight")
                .addClass("topHighlight");
            i = k;
            $('html, body')
                .animate({scrollTop: $([found[0]]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $([found[0]]).offset().left - window.innerWidth / 2}, 1000);
            message = {
				content: translate("showAllLinks") + ': <span style="background-color:yellowgreen">' + foundParams + '</span>',
				time: 0,
				cancelable: true,
				commandLeft: translate("previous"),
				commandRight: translate("next"),
				infoCenter: translate("linkXOfY").format([(i + 1), links.length])
			};
            if (searchedAll != true) {
                id = showMessage(message);
            } else {
				message.id = id;
                //noinspection JSCheckFunctionSignatures
				updateMessage(message);
            }
            return({content: translate("FoundOneLink")});
        } else {
			showMessage({content: translate("notifyNoLinkXFound").format(['<span style="background-color:lightcoral">' + foundParams + '</span>']), centered: true});
			return({content: translate("sayNoLinkXFound").format([foundParams])});
        }
    })
);

/**
 * open link
 */
addContentScriptMethod(
    new ContentScriptMethod("openLink", function () {
        hideMessage({id: id});
        window.location = links[i].getAttribute("href") ;
        id = "";
        return({content: translate("stoppedSearching")});
    })
);

/**
 * open link in new tab
 */
addContentScriptMethod(
    new ContentScriptMethod("openLinkNewTab", function () {
        hideMessage({id: id});
        window.open(links[i].getAttribute("href"));
        id = "";
    })
);


/**
 * cancel link state
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelLinkState" , function () {
        $("a")
            .removeClass("highlight")
            .removeClass("topHighlight");
        $("img").removeClass("highlight");
        hideMessage({id: id});
        id = "";
    })
);