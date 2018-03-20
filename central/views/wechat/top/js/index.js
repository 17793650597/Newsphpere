
/**
 * 今日报题页面
 */
var WechatBillboard = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.wechat-billboard-page'),
            queryInterval: 60000,
            animcursor: 66,
//            queryParam: {
//            	"accessToken": "05784E32D86340D976677714905E6D53B2E0",
//            	"timeStamp": new Date().getTime(),
//            	"timeUnit":"day",
//            	"sortKey":"praisedCount"
//            },
            //温岭（朗视提供）
            queryParam: {
            	"timeUnit":"day",
            	"sortKey":"praisedCount"
            },
            param: {
            	"startDate" : Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true),
            	"endDate" : Utils.parseTime(new Date().getTime(), 'y-m-d', true)
            }
        };
        var wechatBillboard = {};
        wechatBillboard.options = $.extend(true, opts_default, opts);
        WechatBillboard.initDateAndBtns(wechatBillboard);
        WechatBillboard.loadData(wechatBillboard, WechatBillboard.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        wechatBillboard.intervalQuery = setInterval(function() {
            WechatBillboard.loadData(wechatBillboard, WechatBillboard.loadDataCallBack);
        }, wechatBillboard.options.queryInterval);
        return wechatBillboard;
    },
    
    loadDataCallBack: function(wechatBillboardArray, wechatBillboard) {
        wechatBillboard.wechatBillboardArray = wechatBillboardArray;
        WechatBillboard.processData(wechatBillboard);
    },
    processData:function(wechatBillboard){
//    	wechatBillboard.wechatBillboardArray = wechatBillboard.wechatBillboardArray.concat(wechatBillboard.totalData);
        wechatBillboard.wechatBillboardArray.sort(function(obj1,obj2){
        	return obj2.readCount - obj1.readCount;
        });
        for(var i = 0; i < wechatBillboard.wechatBillboardArray.length; i++){
        	if(wechatBillboard.wechatBillboardArray[i]){
	        	wechatBillboard.wechatBillboardArray[i].rank = i + 1;
        	}
    	}
    	WechatBillboard.displaySelectedColumn(wechatBillboard);
    },
    loadData: function(wechatBillboard, callback) {
    	$(".loading").show();
    	var loadCallback = function(resp) {
            var wechatBillboardArray = [];
            if(resp.code != 0){
            	return;
            }
            var wechatBillboardArray = [];
            $(resp.data.result).each(function(index, row) {
            	if(index > 9){
            		return;
            	}
                wechatBillboardArray.push(row);
            });
            $(".loading").hide();
            if (callback && typeof callback == 'function') {
                callback(wechatBillboardArray, wechatBillboard);
            }
        };
        
    	CentralProxy.getWeixinRank(wechatBillboard.options.queryParam, loadCallback);

    	//假数据
//        var resp = {
//        		"message": "处理成功",
//        		"data": {
//        			"result": [{
//        				"commentNum": 132,
//        				"dataChange": 1,
//        				"rank": 1,
//        				"nickName": "重庆卫视",
//        				"praisedCount": 10810,
//        				"readCount": 953643
//        			}, {
//        				"commentNum": 0,
//        				"dataChange": 1,
//        				"rank": 2,
//        				"nickName": "重庆交通",
//        				"praisedCount": 8481,
//        				"readCount": 282681
//        			}, {
//        				"commentNum": 2335,
//        				"dataChange": -1,
//        				"rank": 3,
//        				"nickName": "重庆人民新闻",
//        				"praisedCount": 8324,
//        				"readCount": 1353449
//        			}, {
//        				"commentNum": 0,
//        				"dataChange": 1,
//        				"rank": 4,
//        				"nickName": "重庆美食",
//        				"praisedCount": 8481,
//        				"readCount": 12081
//        			}],
//        			"totalCount": 3
//        		},
//        		"code": "0"
//        	};
//        loadCallback(resp);
    },
    
    initDateAndBtns: function(wechatBillboard){
    	var $time = wechatBillboard.options.container.find('.up .time');
    	var $btns = wechatBillboard.options.container.find('.btns > a');
    	var queryTime = new Date();
    	$time.text(queryTime.format('YYYY年M月D日'));
    	$($btns).each(function(index,item){
    		$(item).click(function(){
    			$btns.removeClass('active');
    			$(this).addClass('active');
    			var timeStage;
    			switch ($(this).text()) {
				case '24小时':
					timeStage = 'day';
		            wechatBillboard.options.param.startDate = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true);
		            wechatBillboard.options.param.endDate = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
					break;
				case '7天':
					timeStage = 'week';
		            wechatBillboard.options.param.startDate = Utils.parseTime(new Date().getTime()-604800000, 'y-m-d', true);
		            wechatBillboard.options.param.endDate = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
					break;
				case '30天':
					timeStage = 'month';
		            wechatBillboard.options.param.startDate = Utils.parseTime(new Date().getTime()-2592000000, 'y-m-d', true);
		            wechatBillboard.options.param.endDate = Utils.parseTime(new Date().getTime(), 'y-m-d', true);					
					break;
				default:
					timeStage = 'day';
					break;
				}
    			wechatBillboard.options.queryParam.timeUnit = timeStage;
    			WechatBillboard.loadData(wechatBillboard, WechatBillboard.loadDataCallBack);
    		});
    	});
    },
    displaySelectedColumn: function(wechatBillboard){
    	if(wechatBillboard.intervalShowOneByOne){
    		clearInterval(wechatBillboard.intervalShowOneByOne);
    	}
    	if(wechatBillboard.intervalPage){
    		clearInterval(wechatBillboard.intervalPage);
    	}
    	var copyArr = wechatBillboard.wechatBillboardArray.slice();
    	wechatBillboard.pageArray = [];
//    	while(copyArr.length){
//    		wechatBillboard.pageArray.push(copyArr.splice(0,10))
//    	}
    	wechatBillboard.pageArray.push(copyArr.splice(0,10));
    	wechatBillboard.pageIndex = 0;
        if (wechatBillboard.pageIndex >= wechatBillboard.pageArray.length) {
            return;
        }
        var currentPageArray = wechatBillboard.pageArray[wechatBillboard.pageIndex].slice();
    	WechatBillboard.appendAllItem(wechatBillboard, currentPageArray);
    	wechatBillboard.pageIndex++;
    	wechatBillboard.intervalPage = setInterval(function () {
            if (wechatBillboard.pageIndex >= wechatBillboard.pageArray.length) {
            	wechatBillboard.pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = wechatBillboard.pageArray[wechatBillboard.pageIndex].slice();
            WechatBillboard.appendAllItem(wechatBillboard, currentPageArray);
            wechatBillboard.pageIndex++;
        }, 30500);//每页切换的时间
    },
    appendAllItem: function(wechatBillboard, currentPageArray) {
        if(currentPageArray.length == 0) {
			dailyTitleList.append('<span>暂无数据</span>');
		}
        var wechatBillboardList = wechatBillboard.options.container.find('.wechat-billboard-list'), 
        	wechatBillboardArray = wechatBillboard.wechatBillboardArray;
        
        wechatBillboardList.removeClass('active', 1000, function() {
        	if(wechatBillboard.intervalShowOneByOne){
        		clearInterval(wechatBillboard.intervalShowOneByOne);
        	}
            wechatBillboardList.empty();
            if (wechatBillboardArray.length == 0) {
                wechatBillboardList.append('<span>暂无数据</span>');
                return;
            }
            
            $(wechatBillboardArray).each(function(index, row) {
                var html = makeWechatBillboardHtml(row);
                wechatBillboardList.append(html);
            });
            
            wechatBillboardList.addClass('active', 1000, function() {
                startShowOneByOne();
            });
        
        });
        
        function makeWechatBillboardHtml(row) {
            var html = '<div class="item">\
					        <div class="ranking col-xs-2">\
								<div class="ranking-card">&nbsp;</div>\
								<div class="ranking-no">1</div>\
							</div>\
				            <div class="data col-xs-10">\
				    			<div class="name col-xs-4">#科学抗癌#</div>\
				           		<div class="activity-count col-xs-2">45.22</div>\
				           		<div class="spread-count col-xs-2">52.32</div>\
				           		<div class="watcher-count col-xs-2">3219293</div>\
				           		<div class="raising col-xs-2 glyphicon glyphicon-arrow-up"></div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingClass;
            switch (row.dataChange) {
			case 0:
				raisingClass = "glyphicon-record";
				break;
			case 1:
				raisingClass = "glyphicon-arrow-up";
				break;
			case -1:
				raisingClass = "glyphicon-arrow-down";
				break;
			default:
				break;
			}
            $html.find('.ranking-no').text(row.rank);
            $html.find('.name').text(row.nickName);
            $html.find('.activity-count').text(row.praisedCount);
            $html.find('.spread-count').text(row.commentNum);
            $html.find('.watcher-count').text(row.readCount);
            $html.find('.raising')
            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
            			.addClass(raisingClass);
           
//            $html.find('.ranking-no').text(row.rank);
//            if(row.nickName == "微兔"){
//    			$html.find('.name').html(row.nickName + "<span class='gogo'>gogo</span>");          	
//            }else{
//                $html.find('.name').text(row.nickName);
//            }
//            $html.find('.spread-count').text(row.commentNum);
//            $html.find('.watcher-count').text(row.readCount);
//            $html.find('.source-text')
//            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down');
            return $html;
        };
    	
    	var listContainer = wechatBillboard.options.container.find('.gallery-wechat-billboard');
    	listContainer.find('.pt-page').removeClass('pt-page-current');
    	var wechatBillboardList = $('<div class="wechat-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
    	
//    	if(wechatBillboard.intervalShowOneByOne){
//    		clearInterval(wechatBillboard.intervalShowOneByOne);
//    	}
        
        $(currentPageArray).each(function(index, row) {
        	console.log(row);
            var html = makeWechatBillboardHtml(row);
            wechatBillboardList.append(html);
        });
        wechatBillboardList.appendTo(listContainer);
        if(listContainer.children('div.pt-page').length>3){
        	listContainer.children('div.pt-page')[0].remove();
        }
        if(wechatBillboard.pageTransitions){
        	wechatBillboard.pageTransitions.stop();
        }
        var $pages = $('#pt-main').children('div.pt-page');
        var pgOpts = {
            	container : $('#pt-main'),
            	$pages : $pages,
    			animcursor : wechatBillboard.options.animcursor,
    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
    			autoChange: false
    		};
        wechatBillboard.pageTransitions = PageTransitions.createNew(pgOpts);
        wechatBillboard.pageTransitions.init();
        wechatBillboard.pageTransitions.nextPage(pgOpts.animcursor);
        startShowOneByOne();
        function startShowOneByOne() {
        	if(wechatBillboard.intervalShowOneByOne){
            	clearInterval(wechatBillboard.intervalShowOneByOne);
            }
            var $wechatBillboardItems = wechatBillboardList.find('.item');
            $wechatBillboardItems.removeClass('active');
            var currentArrayIndex = 0;
            $($wechatBillboardItems[currentArrayIndex]).addClass('active', 300);
            currentArrayIndex++;
            wechatBillboard.intervalShowOneByOne = setInterval(function() {
                if (currentArrayIndex >= $wechatBillboardItems.length) {
                    currentArrayIndex = 0;
					if (wechatBillboard.pageIndex >= wechatBillboard.pageArray.length) {
						WechatBillboard.displaySelectedColumn(wechatBillboard);
						return;
		            }
                    //				    	clearInterval(wechatBillboard.intervalShowOneByOne);
                    //				    	return;
                }
                if (wechatBillboardList.find('.item.active').length > 0) {
                    var tempIndex = currentArrayIndex;
                    wechatBillboardList.find('.item.active').removeClass('active', 100, function() {
                        $($wechatBillboardItems[tempIndex]).addClass('active', 200);
                    });
                } else {
                    $($wechatBillboardItems[currentArrayIndex]).addClass('active', 200);
                }
                currentArrayIndex++;
            }, 3000);
        }
        ;
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	WechatBillboard.createNew();
});

