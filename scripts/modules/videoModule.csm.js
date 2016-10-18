/**
 * csm for interacting with objects
 */
//current number of video
var i = 0;
var videos = [];
var id = "";

/**
 * show all videos
 */
addContentScriptMethod(
    new ContentScriptMethod("showVideos", function () {
        i = 0;
        var html5 = jQuery.makeArray($("video"));
        for (var j = 0; j < html5.length; j++) {
            if (html5[j].width > 0 && html5[j].height > 0) {
                videos.push(html5[j]);
            }
        }
        var iframeVideo = jQuery.makeArray($("iframe"));
        for (var k = 0; k < iframeVideo.length; k++) {
            if (iframeVideo[k].width > 0 && iframeVideo[k].height > 0) {
                videos.push(iframeVideo[k]);
            }
        }
        /**var linkWithVideo = jQuery.makeArray($("a:has(video-id)"));
        var clipboard = html5.concat(youtube);
        var container = clipboard.concat(linkWithVideo);
        for (var j = 0; j < container.length; j++) {
            alert(container[j].width);
            if (container[j].width > 0 || container[j].height > 0) {
                    videos.push(container[j]);
            }
        }**/
        if (videos.length > 0) {
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 2}, 1000);
            id = showMessage({
                content: "Show videos",
                commandRight: "next",
                cancelable: true,
                infoCenter: "video " + (i + 1) + " of " + videos.length,
                time: 0
            });
            if (videos.length > 1) {
                return({content: "I found " + videos.length + " videos on this page. You watch video one"});
            } else {
                return({content: "I found one video on this page"});
            }
        } else {
            showMessage({content: "No videos found on this page", centered: true});
            return({content: "I found no videos on this page"});
        }
    })
);

/**
 * show next video
 */
addContentScriptMethod(
    new ContentScriptMethod("nextVideo", function () {
        if (i + 1 < videos.length) {
            i++;
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 2}, 1000);
            if (i + 1 < videos.length) {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        } else {
            showMessage({content: "This is the last video", centered: true});
            return({content: "This is the last video"});
        }
    })
);

/**
 * show previous video
 */
addContentScriptMethod(
    new ContentScriptMethod("previousVideo", function () {
        if (i - 1 > -1) {
            i--;
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 2}, 1000);
            if (i - 1 > -1) {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandLeft: "previous",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            } else {
                updateMessage({
                    id: id,
                    content: "Show videos",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "video " + (i + 1) + " of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        } else {
            showMessage({content: "This is the first video", centered: true});
            return({content: "This is the first video"});
        }
    })
);

/**
 * go to certain video
 */
addContentScriptMethod(
    new ContentScriptMethod("certainVideo", function (params) {
        if (params === "one") {
            params = 1;
        }
        var newVideo = parseInt(params);
        if (videos.length < newVideo || 0 >= newVideo || isNaN(newVideo)) {
                showMessage({content: "There is no video " + params, centered: true});
                return({content: "There is no video " + params});
        } else if (i === newVideo - 1) {
            showMessage({content: "You are still on video " + params, centered: true});
            return ({content: "You are still on video " + params});
        } else {
            $('html, body')
                .animate({scrollTop: $(videos[i]).offset().top - window.innerHeight / 2}, 1000)
                .animate({scrollLeft: $(videos[i]).offset().left - window.innerWidth / 2}, 1000);
            // go to a further video
            if (i > 0) {
                if (i < videos.length - 1) {
                    updateMessage({
                        id: id,
                        content: "Show images",
                        commandLeft: "previous",
                        commandRight: "next",
                        cancelable: true,
                        infoCenter: "page " + (i + 1) + " of " + videos.length,
                        time: 0
                    });
                } else {
                    updateMessage({
                        id: id,
                        content: "Show images",
                        commandLeft: "previous",
                        cancelable: true,
                        infoCenter: "page " + (i + 1) + " of " + videos.length,
                        time: 0
                    });
                }
            } else {
                updateMessage({
                    id: id,
                    content: "Show images",
                    commandRight: "next",
                    cancelable: true,
                    infoCenter: "page 1 of " + videos.length,
                    time: 0
                });
            }
            return({content: "You watch video " + (i + 1)});
        }
    })
);

/**
 * play video
 */
addContentScriptMethod(
    new ContentScriptMethod("playVideo", function () {
        videos[i].play();
    })
);

/**
 * cancel video state
*/
addContentScriptMethod(
    new ContentScriptMethod("cancelVideoState", function () {
        hideMessage({id: id});
        id = "";
    })
);