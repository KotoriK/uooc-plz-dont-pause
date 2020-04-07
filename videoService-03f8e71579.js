! function () {
    videojs.userConfig = {
        player: {
            stype: "standard"
        }
    }, app.factory("videoService", ["uoocService", "$http", "$filter", function (e, t, n) {
        videojs.addLanguage("zh", {
            Play: "播放",
            Pause: "暂停",
            "Current Time": "当前时间",
            "Duration Time": "总时长",
            "Remaining Time": "剩余时间",
            "Stream Type": "数据类型",
            Silenciar: "静音",
            LIVE: "直播",
            Loaded: "加载完成",
            Progress: "进度条",
            Fullscreen: "全屏",
            "Non-Fullscreen": "退出全屏",
            Mute: "Silenciar",
            Unmuted: "No silenciado",
            "Playback Rate": "变速播放",
            Subtitles: "副标题",
            "subtitles off": "关闭副标题",
            Captions: "字幕",
            "captions off": "关闭字幕",
            Chapters: "章节",
            "You aborted the video playback": "终止了视频回放",
            "A network error caused the video download to fail part-way.": "网络错误导致视频加载失败",
            "The video could not be loaded, either because the server or network failed or because the format is not supported.": "视频加载失败, 服务或网络网络链接失败或浏览器不支持",
            "The video playback was aborted due to a corruption problem or because the video used features your browser did not support.": "视频回放失败, 可能由于腐败问题或浏览器不支持",
            "No compatible source was found for this video.": "这个视频没有发现兼容的版本"
        });
        var r = {};
        return r.nocontextmenu = function (e) {
            function t() {
                return event.cancelBubble = !0, event.returnValue = !1, !1
            }

            function n(e) {
                if (window.Event) {
                    if (2 == e.which || 3 == e.which) return !1
                } else if (2 == event.button || 3 == event.button) return event.cancelBubble = !0, event.returnValue = !1, !1
            }
            window.Event && document.captureEvents && document.captureEvents(Event.MOUSEUP), e.oncontextmenu = t, e.onmousedown = n
        }, r.resize = function (e, t, n) {
            var i = $(e.el_),
                r = parseInt(t) || i.width(),
                a = parseInt(n) || i.height();
            return e.width(1 * r), e.height(1 * a), e
        }, r.toggleMask = function (e, t) {
            var n = $(e.el_);
            return t ? n.find(".vjs-mask").remove() : (n.append('<div class="vjs-mask"></div>'), n.find(".vjs-mask").click(function (e) {
                e.stopPropagation()
            })), e
        }, r.timeCallback = function (e, t, n) {
            if (t < 0) return !1;
            var i = function () {
                var r = this.currentTime();
                parseInt(r) == t && (n(this, t), e.off("timeupdate", i))
            };
            return e.on("timeupdate", i), e
        }, r.timeCollectionCallback = function (e, t, n) {
            var i = angular.isArray(t);
            if (!i) throw TypeError("points: 必须为数组");
            if (t.length <= 0) return e;
            for (var a = 0; a < t.length; a++) r.timeCallback(e, t[a], n);
            return e
        }, r.addProgressPoints = function (e, t, n, i) {
            var a;
            if (n && !e.hasProgrssPoints) {
                for (seekBar = $(e.controlBar.progressControl.seekBar.el_), e.hasProgrssPoints = !0, a = 0; a < t.length; a++) {
                    var o = t[a] / n * 100;
                    seekBar.append('<span class="vjs-seekbar-point" style="left: ' + o + '%"></span>')
                }
                r.timeCollectionCallback(e, t, i)
            }
        }, r.setBlurPause = function (e) {
            $("html").on("mouseleave blur visibilitychange", function (t) {
                e.destroyed || !t.target.webkitHidden && !t.target.hidden && "mouseleave" != t.type && "blur" != t.type || console.log('pause triggered')
            })
        }, r.getCDNsource = function (e, t, n) {
            var i = (videojs.userConfig.player, null),
                r = null;
            n = n || "standard";
            for (var a = 0; a < e.length; a++)
                if (e[a].cdn == t) {
                    r = e[a];
                    break
                } r = r || e[0];
            for (var o = 0; o < r.source.length; o++) {
                var s = r.source[o];
                if (s.stype == n) {
                    i = s;
                    break
                }
            }
            return i || (i = r.source[r.source.length - 1]), i
        }, r.PARSE_SRT = function (e, t) {
            function n(e) {
                return (Math.floor(e / l) + 1) * l + ""
            }

            function a(e) {
                var t = e.split(","),
                    n = t[0].split(":");
                return 3600 * n[0] * 1e3 + 60 * n[1] * 1e3 + 1e3 * n[2] + 1 * t[1]
            }

            function o(e) {
                var t = e.match(f);
                return caption_ = (e + "").replace(p, ""), {
                    startTime: a(t[0]),
                    endTime: a(t[1]),
                    caption: caption_.replace(m, "")
                }
            }
            r.addTip(t, "字幕解析中...");
            var s, c, d = [],
                u = {},
                l = 2e4,
                v = /[\n\s]*((\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{1,3}))\s*-->\s*((\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{1,3}))[\n\s]+[\d\D]*?((?=\n+\d)|(?=\n*$))/g;
            v.compile(v);
            var p = /([\n\s]*((\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{1,3}))\s*-->\s*((\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{1,3}))[\s\n]*)|(\s*\n*$)/g;
            p.compile(p);
            var f = /((\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{1,3}))/g;
            f.compile(f);
            var m = /(\{(.+)?\})+/g;
            m.compile(m);
            this.getResult = function (e, t) {
                e = e || [];
                var n = "";
                for (i = 0; i < e.length; i++) {
                    var r = e[i];
                    if (t <= r.endTime && t >= r.startTime) return n = r.caption.replace("<br>", ""), this.lastGetCaptionObj = r, n
                }
                return n
            }, this.getCaption = function (e) {
                var t, i = n(e);
                if (this.lastGetCaptionObj && e <= this.lastGetCaptionObj.endTime && e >= this.lastGetCaptionObj.startTime) return this.lastGetCaptionObj.caption;
                if (s && c == i || (s = u[i], c = i), !s) return "";
                if (t = this.getResult(s, e)) {
                    u[n(e + l - 1)];
                    t = this.getResult(r, e)
                } else {
                    var r = u[n(e - l)];
                    t = this.getResult(r, e)
                }
                return t = ""
            }, this.formateSRT = function (e, t) {
                var i, a;
                if (captionsAr = e.match(v), !captionsAr) return void r.addTip(t, "字幕解析失败");
                for (i = 0; i < captionsAr.length; i++) {
                    var s = captionsAr[i],
                        c = o(s);
                    d.push(c)
                }
                for (a = 0; a < d.length; a++) {
                    var l = d[a],
                        p = n(d[a].startTime);
                    u[p] = u[p] || [], u[p].push(l)
                }
                return this.CAPTIONS_FiNAL_OBJ = u, u
            }, arguments.length > 0 && this.formateSRT(arguments[0], t)
        }, r.getSrt = function (e, t) {
            return $.ajax({
                method: "GET",
                url: n("escapeURL")(e),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    XSRF: $("meta[name=_xsrf]").attr("content")
                },
                dataType: "text"
            }).error(function () {
                r.addTip(t, "字幕加载失败")
            })
        }, r.animate = function (e, t, n) {
            var i = t.split(",");
            e.show(), e.addClass(i[0] + " animated"), setTimeout(function () {
                e.removeClass(i[0]), i[1] ? e.addClass(i[1]).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                    e.removeClass(i[1]), e.hide()
                }) : e.hide()
            }, n || 3e3)
        }, r.addTip = function (e, t, n) {
            var i = $(e.el_);
            i.find(".vjs-tip").remove();
            i.append('<div class="vjs-tip" style="display: none">' + t + "</div>"), r.animate(i.find(".vjs-tip"), "fadeInLeftBig,fadeOutLeftBig")
        }, r.uoocPlayerComponent = function () {
            var e = videojs.getComponent("Component"),
                t = videojs.extend(e, {
                    constructor: function (t, n) {
                        e.call(this, t, n);
                        var i, a = (videojs.userConfig.player, $(t.el_));
                        a.append('<div id="vjs-toggle-play-btn"></div>'), i = a.find("#vjs-toggle-play-btn"), r.nocontextmenu(t.el_), r.setBlurPause(t), i.click(function () {
                            i.hasClass("zoomIn") ? t.play() : t.pause()
                        }), t.isPause = !0, t.on("play", function () {}), t.on("error", function () {
                            var e = this.error_ ? this.error_.message : "视频加载失败",
                                t = a.find(".vjs-modal-dialog-content");
                            t.html('<div class="vjs-model-wrongmsg">抱歉, &ensp;视频播放失败,&ensp;您可以尝试<span class="fu" onclick="location.reload();">刷新页面</span>操作 。<br> 如问题仍然未解决, 请<a class="fu" href="/index/service" target="_blank">反馈给我们</a>。<p class="emsg">' + e + "。</p></div>")
                        }), t.on("pause", function () {}), a.bind("dblclick", function (e) {
                            "video" == e.target.nodeName.toLowerCase() && (t.isFullscreen_ ? t.exitFullscreen() : t.requestFullscreen(), t.play())
                        })
                    }
                });
            return videojs.registerComponent("UoocPlayer", t), videojs
        }, r.addPosterAdver = function (t, n) {
            var i = (videojs.userConfig.player, $(t.el_)),
                r = "position: absolute; top: 50%; left: 50%; z-index: 2; margin-left: -256px; margin-top: -160px; display: none; box-shadow: 0 0 20px 0 rgba(0,0,0,.2);";
            i.find(".vjs-control-bar").after('<div class="vjs-poster-ad" style="' + r + '"><div class="vjs-poster-inner"></div></div>');
            var a = i.find(".vjs-poster-ad"),
                o = a.find(".vjs-poster-inner");
            if (n) {
                e.advert({
                    code: n,
                    target: o,
                    area: ["512px", "320px"],
                    close: !0,
                    random: !0,
                    withBackground: !0,
                    onclose: function () {
                        t.play(), s(), a.hide()
                    }
                });
                var s = function () {
                    this.adtimer && clearTimeout(this.adtimer)
                };
                t.on("mousedown", function () {
                    s()
                }), t.on("pause", function () {
                    this.adtimer = setTimeout(function () {
                        var e = t.paused();
                        e && (a.show(), o.show())
                    }, 200)
                }), t.on("mouseup", function () {
                    s()
                }), t.on("seeking", function (e) {
                    s(), a.hide(), o.hide()
                }), t.on("seeked", function (e) {
                    s(), t.play()
                }), t.on("play", function (e) {
                    s(), a.hide(), o.hide()
                })
            }
        }, r.addSubtitle = function (e, t, n) {
            if (t = t || [], t.length && !(t.length <= 0)) {
                var i = (videojs.userConfig.player, t || []);
                t = angular.copy(t);
                var a = $(e.el_);
                a.find(".vjs-fullscreen-control").after('<div class="vjs-track"></div>'), a.append('<div class="vjs-caption"></div>');
                var o = a.find(".vjs-track");
                o.append('<div class="vjs-track-list"><div class="vjs-track-txt">选择字幕</div><div style="display: none;" class="vjs-track-panle"></div>');
                var s = o.find(".vjs-track-list"),
                    c = s.find(".vjs-track-panle"),
                    d = o.find(".vjs-track-txt"),
                    u = a.find(".vjs-caption");
                angular.forEach(t, function (e) {
                    c.append('<span class="vjs-track-item" title="' + e.title + '" uri="' + e.uri + '">' + e.title + "</span>")
                });
                var l = s.find(".vjs-track-item");
                s.hover(function () {
                    c.show()
                }, function () {
                    c.hide()
                }), l.click(function () {
                    var t = $(this),
                        n = t.attr("uri"),
                        i = t.attr("title");
                    e.trigger("trackChange", {
                        title: i,
                        uri: n
                    })
                });
                var v = {};
                curSubtitle = "", e.on("trackChange", function (n, a) {
                    for (var s = 0; s < t.length; s++)
                        if (t[s].title == a.title) {
                            v = i[s];
                            break
                        } return v ? (d.html(v.title), o.find('.vjs-track-item[title="' + v.title + '"]').addClass("active").siblings().removeClass("active"), u.show(), void(v.srt || (r.addTip(e, "字幕: " + v.title), r.getSrt(a.uri, e).then(function (t) {
                        v.SRT = new r.PARSE_SRT(t, e)
                    })))) : void u.hide()
                });
                var p = $(e.el_);
                e.on("timeupdate", function (t, i) {
                    if (v.SRT) {
                        var r = e.currentTime(),
                            a = p.width(),
                            o = 100,
                            s = 0,
                            c = 1,
                            d = 0;
                        curSubtitle = v.SRT.getCaption(parseInt(1e3 * r)), c = Math.ceil(curSubtitle.length / s), d = n && n > 0 ? n : a > 1600 ? 40 : a > 1e3 ? 24 : a > 500 ? 22 : 18;
                        var l = a - o > 0 ? a - o : a;
                        s = parseInt(l / d), c > 0 ? u.html(curSubtitle).css({
                            fontSize: d + "px"
                        }).show() : u.hide()
                    }
                }), t.length > 0 && e.trigger("trackChange", {
                    title: t[0].title,
                    uri: t[0].uri
                })
            }
        }, r.getCndSource = function (e) {
            var t, e = e || [],
                n = _.sortBy(e, "weight"),
                i = _.reduce(n, function (e, t) {
                    var n = t.weight,
                        i = e + 1 + "-" + (t.weight + e);
                    return t.wkey = i, e + n
                }, 0);
            randomNumber = _.random(1, i);
            for (var r = 0; r < n.length; r++) {
                var a = n[r],
                    o = a.wkey.split("-"),
                    s = o[0],
                    c = o[1];
                if (randomNumber >= s && randomNumber <= c) {
                    t = a;
                    break
                }
            }
            return t
        }, r.sourceComponent = function () {
            var e = videojs.getComponent("Component"),
                t = videojs.extend(e, {
                    constructor: function (t, n) {
                        if (e.call(this, t, n), n.length && !(n.length <= 0)) {
                            var i = videojs.userConfig.player;
                            n.currentTime = n.currentTime || 0;
                            var a = $(this.el_);
                            a.addClass("vjs-source-cdn"), a.append('<div class="vjs-source-cdn-head"></div><div class="vjs-source-cdn-bd"></div>');
                            var o = a.find(".vjs-source-cdn-head"),
                                s = a.find(".vjs-source-cdn-bd");
                            s.append('<div class="vjs-source-txt"></div>');
                            var c = s.find(".vjs-source-txt");
                            angular.forEach(n, function (e, t) {
                                var n = e.cdn,
                                    i = s.append('<div class="vjs-source-cdn-cont" cdn="' + n + '" style="display: none;"></div>'),
                                    r = i.find(".vjs-source-cdn-cont").eq(t);
                                o.append('<span class="vjs-source-cdn-item " index="' + t + '" cdn="' + n + '">' + e.name + "</span>"), angular.forEach(e.source, function (e, t) {
                                    r.append('<span class="vjs-menu-content" uri="' + e.uri + '" ftype="' + e.ftype + '" name="' + e.name + '" stype="' + e.stype + '" cdn="' + n + '">' + e.name + "</span>")
                                })
                            });
                            var d = a.find(".vjs-source-cdn-item");
                            a.find(".vjs-source-cdn-cont");
                            d.click(function () {
                                t.trigger("cdnChange", {
                                    cdn: n[$(this).index()].cdn
                                })
                            }), s.hover(function () {
                                var e = a.find('.vjs-source-cdn-cont[cdn="' + i.cdn + '"]');
                                e.show().siblings(".vjs-source-cdn-cont").hide()
                            }, function () {
                                s.find(".vjs-source-cdn-cont").hide()
                            }), s.find(".vjs-menu-content").click(function () {
                                var e = $(this),
                                    n = e.attr("cdn"),
                                    i = e.attr("stype");
                                t.trigger("cdnChange", {
                                    cdn: n,
                                    stype: i
                                })
                            });
                            var u = 0;
                            if (t.on("cdnChange", function (e, a) {
                                    t.cdn = a.cdn, angular.extend(i, a);
                                    var o = r.getCDNsource(n, a.cdn, a.stype);
                                    if (!o) return void t.src({
                                        type: "video/mp4",
                                        src: "nosource"
                                    });
                                    var d = s.find('.vjs-menu-content[cdn="' + o.cdn + '"][stype="' + o.stype + '"]'),
                                        l = $('.vjs-source-cdn-item[cdn="' + o.cdn + '"]');
                                    if (l.addClass("active").siblings("span").removeClass("active"), d.addClass("active").siblings("span").removeClass("active"), c.html(o.name), t.src({
                                            type: o.ftype,
                                            src: o.uri
                                        }), r.addTip(t, "资源: " + o.cdn + " " + o.name), u || n.currentTime) {
                                        var v = u > n.currentTime ? u : n.currentTime;
                                        setTimeout(function () {
                                            t.currentTime(v), t.play()
                                        }, 400)
                                    }
                                }), t.on(["timeupdate"], function () {
                                    var e = t.currentTime();
                                    u = u > e && 0 == e ? u : e
                                }), n.length > 0) {
                                var l = r.getCndSource(n);
                                l || (firtSource = {
                                    cdn: "cdn1",
                                    ftype: "video/mp4",
                                    name: "原画",
                                    stype: "source",
                                    uri: "nosource"
                                }), t.on("ready", function () {
                                    var e = t.options_.controlBar.trackSource,
                                        i = angular.isArray(e) ? e : e[l.cdn];
                                    r.addSubtitle(t, i, n.playerOptions.fontsize), t.trigger("cdnChange", {
                                        cdn: l.cdn,
                                        stype: l.stype
                                    })
                                })
                            }
                        }
                    }
                });
            return videojs.registerComponent("VideoSource", t), videojs
        }, r.uoocPlayerComponent(), r.sourceComponent(), r
    }])
}();