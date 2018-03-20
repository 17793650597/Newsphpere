
/**
 * 气象局
 */
var WechatBillboard = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.wechat-billboard-page'),
            queryInterval: 60000,
            animcursor: 66,
            queryParam: {
            	"accessToken": "05784E32D86340D976677714905E6D53B2E0",
            	"timeStamp": new Date().getTime(),
            	"currentPage": 1,
            	"dataType": "weixin",
            	"pageSize": 10
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
    
    loadData: function(wechatBillboard, callback) {
    	$('.loading').show();
    	CentralProxy.getWeixinMediaData(wechatBillboard.options.queryParam, function(resp){
    		$('.loading').hide();
    		wechatBillboardArray = resp.data;
    		if (callback && typeof callback == 'function') {
    			callback(wechatBillboardArray, wechatBillboard);
        	}
    	});
    },
    processData: function(wechatBillboard){
		if(!wechatBillboard.wechatBillboardArray) {
			return;
		}
//		var assetList = wechatBillboard.wechatBillboardArray.result.assetList;
		wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardArray;
		wechatBillboard.wechatBillboardJson.sort(function(x,y){
    		return y.readCount - x.readCount;
    	})
		WechatBillboard.appendAllItem(wechatBillboard);	
		
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
				case '今日':
					timeStage = 'day';
					break;
				case '本周':
					timeStage = 'week';
					break;
				case '本月':
					timeStage = 'month';
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
    
    appendAllItem: function(wechatBillboard) {
        /*var wechatBillboardList = wechatBillboard.options.container.find('.wechat-billboard-list')
          , 
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
        
        });*/
        
        function makeWechatBillboardHtml(index,row) {
            var html = '<div class="item">\
					        <div class="ranking col-xs-2">\
								<div class="ranking-card">&nbsp;</div>\
								<div class="ranking-no">1</div>\
							</div>\
				            <div class="data col-xs-10">\
				    			<div class="name col-xs-6"></div>\
				           		<div class="activity-count col-xs-2"></div>\
				           		<div class="spread-count col-xs-2"></div>\
            					<div class="source-count col-xs-2"></div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingClass;
            switch (row.target) {
//			case "微博":
//				raisingClass = "fa fa-weibo";
//				break;
//			case "微信":
//				raisingClass = "fa fa-weixin";
//				break;
//			case "动静":
//				raisingClass = "fa fa-mobile app";
//				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.target);
//				break;
//			case "微兔":
//				raisingClass = "fa fa-mobile app";
//				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.target + "<span class='source-content'>gogo</span>");
//				break;
			default:
				raisingClass = "fa fa-weixin";
				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.source);
				break;
			}
            $html.find('.ranking-no').text(index+1);
            $html.find('.name').text(row.title);
            $html.find('.activity-count').text(row.readCount);
            $html.find('.spread-count').text(row.commentNum);
        
//            $html.find('.watcher-count').text(row.readCount);
            $html.find('.source-text')
            	.removeClass('fa fa-weibop fa-weixin')
            			.addClass(raisingClass);
            return $html;
        };
    	
    	var listContainer = wechatBillboard.options.container.find('.gallery-wechat-billboard');
    	listContainer.find('.pt-page').removeClass('pt-page-current');
    	var wechatBillboardArray = wechatBillboard.wechatBillboardJson;
    	var wechatBillboardList = $('<div class="wechat-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
    	
    	if(wechatBillboard.intervalShowOneByOne){
    		clearInterval(wechatBillboard.intervalShowOneByOne);
    	}
    	if (wechatBillboardArray.length == 0) {
            wechatBillboardList.append('<span>暂无数据</span>');
//            return;
        }
        
        $(wechatBillboardArray).each(function(index, row) {
            var html = makeWechatBillboardHtml(index,row);
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

