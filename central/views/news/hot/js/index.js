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
            HotNews.loadTMData(hotNews, HotNews.loadTMDataCallBack);
        }, 100000);
        return hotNews;
    },

    loadTMDataCallBack: function (hotNewsArray, hotNews) {
        hotNews.hotNewsArray = hotNewsArray;
        HotNews.displayHotNewsDatas(hotNews);
    },

    loadTMData: function (hotNews, callback) {
//    	var loadCallback = function (resp) {
//            var hotNewsArray = [];
//            $(resp.tngou).each(function (index, row) {
//                var title = row.title;
//                var mediaSource = row.fromname;
//                if (mediaSource.length > 24) {
//                    mediaSource = mediaSource.substring(0, 24) + '...';
//                }
//                var time = row.time.formatDate();
//                var content = row.description;
//                var pics = row.img;
//                var videos = 0; 
//                hotNewsArray.push({
//                    title: title,
//                    mediaSource: mediaSource,
//                    time: time,
//                    content: content,
//                    pics: pics,
//                    videos: videos,
//                    raw: row
//                });
//            });
//            if (callback && typeof callback == 'function') {
//                callback(hotNewsArray, hotNews);
//            }
//        };
//        
//        var param = {
//				"accessToken": "05784E32D86340D976677714905E6D53B2E0",
//				"timeStamp": new Date().getTime(),
//				"count": 20
//			};
//        CentralProxy.getHotNews(param, loadCallback);
    	$(".loading").show();
    	var loadCallback = function (resp) {
    		$(".loading").hide();
    		var hotNewsArray = [];
//    		var data = JSON.parse(resp).data;
//            $(data).each(function (index, row) {
//                var title = row.newsTitle;
//                var mediaSource = row.newsSource;
//                if (mediaSource.length > 24) {
//                    mediaSource = mediaSource.substring(0, 24) + '...';
//                }
//                var time = row.publishTime;
//                var content = row.content;
//                var pics = row.imageFiles;
//                var videos = row.videoFiles; 
//                hotNewsArray.push({
//                    title: title,
//                    mediaSource: mediaSource,
//                    time: time,
//                    content: content,
//                    pics: pics,
//                    videos: videos,
//                    raw: row
//                });
//            });
    		//知闻数据
    		var data = resp;
            $(data).each(function (index, row) {
            	var photo = "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random()))
                var title = row._source.SUMMARY;
                var mediaSource = row._source.CATEGORY_TWO;
                if (mediaSource.length > 24) {
                    mediaSource = mediaSource.substring(0, 24) + '...';
                }
                var time = row._source.PUBLISHDATE;
                var content = row._source.CONTENT;
                var pics = row._source.PATH_IMAGE && row._source.PATH_IMAGE[0] || photo;
                var videos = row.videoFiles; 
                hotNewsArray.push({
                    title: title,
                    mediaSource: mediaSource,
                    time: time,
                    content: content,
                    pics: pics,
                    videos: videos,
                    raw: row
                });
            });
            if (callback && typeof callback == 'function') {
                callback(hotNewsArray, hotNews);
            }
        };
        
//        var param = {
//				"accessToken": "05784E32D86340D976677714905E6D53B2E0",
//				"timeStamp": new Date().getTime(),
//				"count": 20
//			};
        
        var param = {
                    "currentPage": 1,
                    "pageSize": 10
        };
//        {
//            "random":"1234567890",
//            "time":1512885716,
//            "sig":"544e9f46185d50c2a471e98e8f49aa8507899e762883f13508ef5b7873d35ea4",
//            "accessKeyId":"wenling",
//            
//        }
        var param = '';
		CentralProxy.getToken(param, function(resp){
	     	console.log(resp)
	     	var token = resp.data.accessToken;
	    	CentralProxy.hotNews(token, loadCallback)			
		})
//        CentralProxy.getHotNews(param, loadCallback);
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
            var html = '<div class="item slidedown">\
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
								</div>\
							</div>';
            var $html = $(html).data('rowData', row);
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
                    dialog.remove();
                    hotNews.options.container.find('.hotnews-list').removeClass('hide');
                    hotNews.intervalAppend = setInterval(funcAppend, 3200);
                    hotNews.intervalQuery = setInterval(function () {
                        HotNews.loadTMData(hotNews, HotNews.loadTMDataCallBack);
                    }, 60000);
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
                            $(this).addClass('item-active');
                        }
                    }
                });
            }

            hotNews.intervalAppend = setInterval(funcAppend, 6200);
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
	var title = ModuleConfigHelper.getConfigByModuleName('ns.news.hot').title || "热点资讯";
	$('.area-title').text(title);
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
