/**
 * csm for searching for expressions
 */
var result = [];
var i = 0;
var id = "";
var parameter;

/**
 * search for an expression
 */
addContentScriptMethod(
    new ContentScriptMethod("search", function (params) {
        //unmark elements from last search
        parameter = params.toString();
        var searched = new RegExp(parameter, "gmi");
        $("body")
            .unmark()
            .markRegExp(searched, {
            "className": "highlight",
            "exclude": [
                "script",
                "style",
                "noscript",
                "#ChromeSpeechControlDIV *"
            ]
        });
        if (id != "") {
            hideMessage({id: id});
        }
        //if element is hidden on page remove class highlight
        $(".highlight:hidden").unmark();
        $(".highlight").each(function () {
            if (window.getComputedStyle(this).getPropertyValue("visibility") === "hidden") {
                $(this).unmark();
            }
        });

        result = jQuery.makeArray(document.getElementsByClassName("highlight"));

        if(result.length === 0) {
            showMessage({title: "Attention!", content: "couldn't find " + parameter});
        } else {
            for (i = 0; i < result.length; i++) {
                if (window.scrollY <= $(result[i]).offset().top &&
                    window.scrollX <= $(result[i]).offset().left &&
                    $(result[i]).offset().top - window.innerHeight <= window.scrollY &&
                    $(result[i]).offset().left - window.innerWidth <= window.scrollY) {
                    result[i].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(result[i]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(result[i]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                        time: 0,
                        cancelable: true,
                        commandLeft: "previous",
                        commandRight: "next",
                        infoCenter: "match " + (i + 1) + " of " + (result.length)
                    });
                    return;
                } else if (i + 1 >= result.length) {
                    i = 0;
                    result[0].style.backgroundColor = "rgb(255, 150, 50)";
                    $('html, body')
                        .animate({scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000)
                        .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                    id = showMessage({
                        content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                        time: 0,
                        cancelable: true,
                        commandLeft: "previous",
                        commandRight: "next",
                        infoCenter: "match " + (i + 1) + " of " + (result.length)
                    });
                    return;
                }
            }
        }
    })
);

/**
 * find next match
 */
addContentScriptMethod(
    new ContentScriptMethod("next", function () {
        //highlights the next match
        if(result.length > 1) {
            if (i < result.length - 1) {
                result[i].style.backgroundColor = "yellow";
                result[i + 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[i + 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[i + 1]).offset().left - window.innerWidth / 2}, 1000);
                i++;
                //reached last element -> continue at 0
            } else {
                result[i].style.backgroundColor = "yellow";
                result[0].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[0]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = 0;
            }
            showMessage({content: "show next match"});
            updateMessage({
                id: id,
                content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"match " + (i + 1) + " of " + (result.length)
            });
        } else {
            showMessage({title: "Attention!", content: "no match found"});
        }
    })
);

/**
 * find previous match
 */
addContentScriptMethod(
    new ContentScriptMethod("previous", function () {
        if(result.length > 1) {
            if (i > 0) {
                result[i].style.backgroundColor = "yellow";
                result[i - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[i - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[i - 1]).offset().left - window.innerWidth / 2}, 1000);
                i--;
                //reached first element -> continue with last
            } else {
                result[i].style.backgroundColor = "yellow";
                result[result.length - 1].style.backgroundColor = "rgb(255, 150, 50";
                $('html, body')
                    .animate({scrollTop: $(result[result.length - 1]).offset().top - window.innerHeight / 2}, 1000)
                    .animate({scrollLeft: $(result[0]).offset().left - window.innerWidth / 2}, 1000);
                i = result.length - 1;
            }
            updateMessage({
                id: id,
                content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"match " + (i + 1) + " of " + (result.length)
            });
            showMessage({content: "show previous match"});
        } else {
            showMessage({title: "Attention!", content: "no match found"});
        }
    })
);

/**
 * go to certain match
 */
addContentScriptMethod(
    new ContentScriptMethod("certain", function (params) {
        if (params.toString() === "one") {
            params = 1;
        }
        if (params <= result.length) {
            result[i].style.backgroundColor = "yellow";
            result[params - 1].style.backgroundColor = "rgb(255, 150, 50";
            $('html, body')
                .animate({scrollTop: $(result[params - 1]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(result[params - 1]).offset().left - window.innerWidth / 2}, 1000);
            i = params - 1;
            updateMessage({
                id: id,
                content: "search for: <span style='background-color:yellowgreen'>" + parameter + "</span>",
                time: 0,
                cancelable: true,
                commandLeft: "previous",
                commandRight: "next",
                infoCenter:"match " + (i + 1) + " of " + (result.length)
            });
            showMessage({content: "show match " + params});
        } else {
            showMessage({title: "Attention!", content: "there is no match <span style='background-color:lightcoral'>" + params + "</span>"});
        }
    })
);

/**
 * cancel searching
 */
addContentScriptMethod(
    new ContentScriptMethod("cancelSearchState", function () {
        $("body").unmark();
        hideMessage({id: id});
    })
);
