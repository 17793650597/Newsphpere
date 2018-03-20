/*热点资讯页面，温岭用，朗视接口*/
var HotNews = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.hotnews-container')
        };
        var hotNews = {};
        hotNews.options = $.extend(true, opts_default, opts);

        HotNews.loadTMData(hotNews, HotNews.loadTMDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        hotNews.intervalQuery = setInterval(function () {
            if (hotNews.intervalAppend) {
                clearInterval(hotNews.intervalAppend);
            }
            if (hotNews.intervalQuery) {
                clearInterval(hotNews.intervalQuery);
            }
            HotNews.loadTMData(hotNews, HotNews.loadTMDataCallBack);
        }, 600000);
        return hotNews;
    },

    loadTMDataCallBack: function (hotNewsArray, hotNews) {
        hotNews.hotNewsArray = hotNewsArray;
        HotNews.displayHotNewsDatas(hotNews);
    },

    loadTMData: function (hotNews, callback) {

    	$(".loading").show();
    	var loadCallback = function (resp) {
    		$(".loading").hide();
            var hotNewsArray = [];
           var data = JSON.parse(resp).RspBodyContent;
            $(data).each(function (index, row) {
                var title = row.topic_name;
                var mediaSource = row.category;
                if (mediaSource.length > 24) {
                    mediaSource = mediaSource.substring(0, 24) + '...';
                }
                var time = row.start_time;
                var content = row.topic_info;
                var pics = row.image_url;
                var videos = row.videoFiles || ""; 
                var topicName = row.topic_name;
                var topicInfo = row.topic_info;
                var topicId = row.topic_id;
                hotNewsArray.push({
                    title: title,
                    mediaSource: mediaSource,
                    time: time,
                    content: content,
                    pics: pics,
                    videos: videos,
                    raw: row,
                    topic:{
                    	topicName: topicName,
                    	topicInfo: topicInfo,
                    	topicId: topicId
                    }
                });
            });
            if (callback && typeof callback == 'function') {
                callback(hotNewsArray, hotNews);
            }
        };
        
        var param = {
                "date":"",
                "category":"",
                "page":1,
                "page_size":12,
                "flag":"hourly"
        };
        param.date = Utils.parseTime(new Date().getTime(), 'ymd', true);
        CentralProxy.getHotNews(param, loadCallback);
    },

    displayHotNewsDatas: function (hotNews) {
        var hotNewsList = hotNews.options.container.find('.hotnews-list'),
            hotNewsArray = hotNews.hotNewsArray;
        if (hotNewsArray.length == 0) {
            hotNewsList.append('<span>暂无数据</span>');
            return;
        }
        function makeHotNewsHtml(row) {
        	if(!row){
        		return;
        	}
            var html = '<div class="item slidedown" data-topicId="">\
								<div class="anchor"></div>\
								<div class="head">\
									<span class="media-source col-xs-2"></span>\
									<span class="title col-xs-5"></span>\
									<div class="media-flag col-xs-2">\
										<span class="glyphicon glyphicon-picture"></span>\
										<span class="glyphicon glyphicon-film"></span>\
									</div>\
									<span class="time col-xs-3"></span>\
								</div>\
								<div class="body">\
									<div class="body-head">\
										<span class="title"></span>\
										<span class="time"></span>\
                                        <span class="glyphicon glyphicon-picture"></span>\
                                        <span class="glyphicon glyphicon-film"></span>\
									</div>\
									<p class="content"></p>\
									<div class="media-flag">\
										<span class="glyphicon glyphicon-picture"></span>\
										<span class="glyphicon glyphicon-film"></span>\
									</div>\
									<div class="toolbar">\
										<a href="javascript:void(0);" class="collect"><span class="glyphicon glyphicon-picture"></span>收藏</a>\
										<a href="javascript:void(0);" class="open-source-page"><span class="glyphicon glyphicon-film"></span>原文</a>\
									</div>\
					            	<i class="top-left fa fa-chevron-up" aria-hidden="true"></i>\
									<i class="top-right fa fa-chevron-up" aria-hidden="true"></i>\
									<i class="bottom-left fa fa-chevron-up" aria-hidden="true"></i>\
									<i class="bottom-right fa fa-chevron-up" aria-hidden="true"></i>\
                                    <div class="bottom-left-redCircle" aria-hidden="true"></div>\
								</div>\
							</div>';
            var $html = $(html).data('rowData', row);
            $html.attr('data-topicId',row.topic.topicId);
            $html.find('.title').text(row.title).attr('title', row.title);
            $html.find('.media-source').text(row.mediaSource).attr('title', row.mediaSource);
            $html.find('.time').text(row.time).attr('title', row.time);          
            row.content = row.content.replace(/<\/?[^>]*>/g,'');
            row.content = row.content.replace(/\&nbsp;/g,'');
            $html.find('.content').text(row.content.substring(0, 100) + '...')/*.attr('title',row.content)*/;
          
            $html.addClass('item-0');
            return $html;
        }

        var currentArrayIndex = 0;
        if (hotNews.intervalAppend) {
            clearInterval(hotNews.intervalAppend);
        }
        if (hotNews.intervalRapidAppend) {
            clearInterval(hotNews.intervalRapidAppend);
        }
        hotNews.intervalRapidAppend = setInterval(function () {
            if (hotNewsList.find('.item').length > 7) {
                clearInterval(hotNews.intervalRapidAppend);
                rapidAppendCallback();
                return;
            }
            var html = makeHotNewsHtml(hotNewsArray[currentArrayIndex]);
            hotNewsList.prepend(html);
            $(hotNewsList.find('.item')).each(function (index) {
                var n = Number(index);
                $(this).removeClass('item-0 item-1 item-2 item-3 item-4 item-5 item-6 item-7 item-8 item-active').addClass('item-' + n + '');
            });
            currentArrayIndex++;
        }, 600);

        function rapidAppendCallback() {
            $(hotNewsList.find('.item')).each(function (index) {
                var n = Number(index);
                $(this).click(function () {
                    showDetail(hotNews, $(this));
                })
                if (n === 3) {
                	window.localStorage.setItem("topicId",$(this).attr('data-topicId'));
                	window.localStorage.setItem("topicName",$(this).find('.title').html());
                	window.localStorage.setItem("topicInfo",$(this).find('.content').html());
                    $(this).addClass('item-active');
                }
            });

            function showDetail(hotNews, eventTarget) {
                if (hotNews.intervalAppend) {
                    clearInterval(hotNews.intervalAppend);
                }
                if (hotNews.intervalQuery) {
                    clearInterval(hotNews.intervalQuery);
                }
                hotNews.options.container.find('.hotnews-list').addClass('hide');
                var row = $(eventTarget).data('rowData');
                var dialog = Dialog.init();

                dialog.on('hidden.bs.modal', function () {
                    if (hotNews.intervalAppend) {
                        clearInterval(hotNews.intervalAppend);
                    }
                    if (hotNews.intervalQuery) {
                        clearInterval(hotNews.intervalQuery);
                    }
                    dialog.remove();
                    hotNews.options.container.find('.hotnews-list').removeClass('hide');
                    hotNews.intervalAppend = setInterval(funcAppend, 10200);
                    hotNews.intervalQuery = setInterval(function () {
                        if (hotNews.intervalAppend) {
                            clearInterval(hotNews.intervalAppend);
                        }
                        if (hotNews.intervalQuery) {
                            clearInterval(hotNews.intervalQuery);
                        }
                        HotNews.loadTMData(hotNews, HotNews.loadTMDataCallBack);
                    }, 180000);
                });

                var detailHtml = '<div class="title-detail-pane">\
                                        <div class="head">\
                                            <span class="title"></span>\
                                            <span class="time"></span>\
                                        </div>\
                                        <div class="content"></div>\
                                </div>';
                var $html = $(detailHtml);
                $html.find('.title').text(row.title).attr('title', row.title);
                $html.find('.time').text(row.time).attr('title', row.time);
                $html.find('.content').text(row.content);
                $html.appendTo(dialog.find('.modal-content'));
            }

            function funcAppend() {
                console.log(hotNews.intervalAppend)
                if (currentArrayIndex >= hotNewsArray.length) {
                    currentArrayIndex = 0;
                }
                var html = makeHotNewsHtml(hotNewsArray[currentArrayIndex]);
                html.click(function () {
                    showDetail(hotNews, $(this));
                });
                hotNewsList.prepend(html);
                currentArrayIndex++;
                $(hotNewsList.find('.item')).each(function (index) {
                    var n = Number(index);
                    if (n > 7) {
                        $(this).remove();
                    } else {
                        $(this).removeClass('item-0 item-1 item-2 item-3 item-4 item-5 item-6 item-7 item-8 item-active').addClass('item-' + n + '');
                        if (n == 3) {
                        	window.localStorage.setItem("topicId",$(this).attr('data-topicId'));
                        	window.localStorage.setItem("topicName",$(this).find('.title').html());
                        	window.localStorage.setItem("topicInfo",$(this).find('.content').html());
                            $(this).addClass('item-active');
                        }
                    }
                });
            }

            hotNews.intervalAppend = setInterval(funcAppend, 10200);
        }
    }
};

var Dialog = {
    init: function () {
        var dlgHtml = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                            <div class="modal-dialog modal-lg detail-dialog">\
                                <div class="modal-content">\
                                </div>\
                            </div>\
                        </div>';
        var dialog = $(dlgHtml).appendTo('body');
        dialog.modal({
            backdrop: 'true'
        });
        /**
         * 避免页面出现多个模态框
         */
        dialog.on('hidden.bs.modal', function () {
            dialog.remove();
        });
        return dialog;
    }
};

$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	setBgImgs();
    HotNews.createNew();
    
    function setBgImgs(){
    	var skin = window.location.search.getParameter('skin');
		if(!skin || skin.length == 0 || skin == 'null' || skin == 'undefined') {
			skin = 'blue';
		}
		var html = '<img src="../../../css/' + skin + '/images/pages/rolling-0.png">\
            		<img src="../../../css/' + skin + '/images/pages/rolling-1.png">\
					<img src="../../../css/' + skin + '/images/pages/rolling-2.png">';
		$('.bg-imgs').append($(html));
    }
});
