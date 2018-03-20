/**
 * 今日报道页面
 */
var MainMedia = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.mainmedia-container'),
		};
		var mainMedia = {};
		mainMedia.options = $.extend(true, opts_default, opts);

		MainMedia.loadData(mainMedia, MainMedia.loadDataCallBack);
		//每隔3分钟，重新查询一次最新数据并显示
		mainMedia.intervalQuery = setInterval(function() {
			MainMedia.loadData(mainMedia, MainMedia.loadDataCallBack);
		}, 180000);
		return mainMedia;
	},

	loadDataCallBack: function(mainMediaJson, mainMedia) {
		mainMedia.mainMediaJson = mainMediaJson;
		MainMedia.displayMainMediaDatas(mainMedia);
	},

	loadData: function(mainMedia, callback) {
		CentralProxy.getMainMediaData(function(resp) {
			if(callback && typeof callback == 'function') {
				callback(resp, mainMedia);
			}
		});
	},

	processData: function(mainMedia) {
		if(!mainMedia.mainMediaJson) {
			return;
		}
		var hitList = mainMedia.mainMediaJson.autnresponse.responsedata['autn:hit'];
		mainMedia.allPageData = [];
		for(var i = 0; i < hitList.length; i++) {
			mainMedia.allPageData[mainMedia.allPageData.length] = {
					title: hitList[i]['autn:title'].$,
					author: hitList[i]['autn:content']['DOCUMENT']['CATEGORY_TWO'].$,
					time: hitList[i]['autn:content']['DOCUMENT']['DREDATE'].$,
					content: hitList[i]['autn:content']['DOCUMENT']['DRECONTENT']? hitList[i]['autn:content']['DOCUMENT']['DRECONTENT'].$: ''
			};
		}
		
		return mainMedia.allPageData;
	},
	
	clearItems: function (callback, mainMedia, currentPageArray) {
        if(mainMedia.intervalShowOneByOne){
        	clearInterval(mainMedia.intervalShowOneByOne);
        }
//        if (mainMedia.intervalPage) {
//            clearInterval(mainMedia.intervalPage);
//        }
        if (mainMedia.intervalShowOne) {
            clearInterval(mainMedia.intervalShowOne);
        }
        var mainMediaList = mainMedia.options.container.find('.mainmedia-list');
        if (mainMediaList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(mainMedia, currentPageArray);
            }
            return;
        }
        mainMedia.options.container.find('.mainmedia-list-pane').removeClass('active');
        setTimeout(function(){
    		mainMedia.options.container.find('.mainmedia-list').empty();
            if (callback && typeof callback == 'function') {
                callback(mainMedia, currentPageArray);
            }
    	}, 1000);
    },

	displayMainMediaDatas: function(mainMedia) {
		MainMedia.processData(mainMedia);
		MainMedia.displayAllPageData(mainMedia);
	},
	
	displayAllPageData: function(mainMedia){
		if (mainMedia.intervalPage) {
            clearInterval(mainMedia.intervalPage);
        }
		var copyArr = mainMedia.allPageData.slice();
		mainMedia.mainMediaPageArray = [];
        while (copyArr.length) {
        	mainMedia.mainMediaPageArray.push(copyArr.splice(0, 10));
        }
        mainMedia.pageIndex = 0;
        if (mainMedia.pageIndex >= mainMedia.mainMediaPageArray.length) {
            return;
        }
        var currentPageArray = mainMedia.mainMediaPageArray[mainMedia.pageIndex].slice();
        MainMedia.clearItems(MainMedia.appendItems, mainMedia, currentPageArray);
        mainMedia.pageIndex++;
        mainMedia.intervalPage = setInterval(function () {
            if (mainMedia.pageIndex >= mainMedia.mainMediaPageArray.length) {
                mainMedia.pageIndex = 0;
            }
            currentPageArray = mainMedia.mainMediaPageArray[mainMedia.pageIndex].slice();
            MainMedia.clearItems(MainMedia.appendItems, mainMedia, currentPageArray);
            mainMedia.pageIndex++;
        }, 30500);//每页切换的时间
	},
	
	/**
     * 用于显示当前页的blogItem
     */
    appendItems: function (mainMedia, currentPageArray) {
    	var mainMediaListPane = mainMedia.options.container.find('.mainmedia-list-pane'),
		mainMediaList = mainMedia.options.container.find('.mainmedia-list');
		//显示方面的逻辑
        if(currentPageArray.length == 0) {
			mainMediaList.append('<span>暂无数据</span>');
			return;
		}

		//根据栏目获取时间倒序排列
		$(currentPageArray).each(function(index, row) {
			var html = makeMainMediaHtml(row);
			mainMediaList.append(html);
		});

		mainMediaListPane.addClass('active', 1000, function() {
			startShowOneByOne();
		});

		function makeMainMediaHtml(row) {
			var html = '<div class="item">\
								<div class="item-left">\
									<span class="mainmedia-title"></span>\
									<span class="author"></span>\
									<span class="time"></span>\
								</div>\
							</div>';
			var $html = $(html);
			$html.find('.mainmedia-title').text(row.title);
			$html.find('.author').text(row.author);
			$html.find('.time').text(row.time);
			$html.click(function(){
								DetailShow.show({
						            container: $('body'),
						            data: {
						            	title: row.title,
						            	time: row.time,
						            	content: row.content,
						            	pics: []
						            }});
							});
			return $html;
		}

		function startShowOneByOne() {
			var $mainMediaItems = mainMediaList.find('.item');
			var currentArrayIndex = 0;
			$($mainMediaItems[currentArrayIndex]).addClass('active', 300);
			currentArrayIndex++;
			mainMedia.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $mainMediaItems.length) {
//					currentArrayIndex = 0;
					clearInterval(mainMedia.intervalShowOneByOne);
					
					if (mainMedia.pageIndex >= mainMedia.mainMediaPageArray.length) {
						MainMedia.displayAllPageData(mainMedia);
						return;
		            }
		            var currentPageArray = mainMedia.mainMediaPageArray[mainMedia.pageIndex].slice();
		            MainMedia.clearItems(MainMedia.appendItems, mainMedia, currentPageArray);
		            mainMedia.pageIndex++;
					return;
				}
				if(mainMediaList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					mainMediaList.find('.item.active').removeClass('active', 100, function() {
						$($mainMediaItems[tempIndex]).addClass('active', 200);
					});
				} else {
					$($mainMediaItems[currentArrayIndex]).addClass('active', 200);
				}
				currentArrayIndex++;
			}, 3000);
		}
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	MainMedia.createNew();
});
