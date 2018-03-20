
/**
 * 今日报题页面
 */
var WechatBillboard = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.wechat-billboard-page'),
            queryInterval: 300000,
            animcursor: 66,
            queryParam: {
            	"timeUnit": "day",
            	"num": 50
            },
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
        	return obj2.wci - obj1.wci;
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
    	var title = ModuleConfigHelper.getConfigByModuleName('ns.wechat.contentw').title || '微信排行';
    	$('.area-title').html(title);
    	var loadCallback = function(resp) {
            var wechatBillboardArray = [];
            $(resp.data.result).each(function(index, row) {
//            	if(index > 9){
//            		return;
//            	}
                wechatBillboardArray.push(row);
            });
            $(".loading").hide();
            if (callback && typeof callback == 'function') {
                callback(wechatBillboardArray, wechatBillboard);
            }
        };
        
    	CentralProxy.getWeixinRankForWenling(wechatBillboard.options.queryParam, loadCallback);

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
					break;
				case '7天':
					timeStage = 'week';
					break;
				case '30天':
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
    displaySelectedColumn: function(wechatBillboard){
    	if(wechatBillboard.intervalShowOneByOne){
    		clearInterval(wechatBillboard.intervalShowOneByOne);
    	}
    	if(wechatBillboard.intervalPage){
    		clearInterval(wechatBillboard.intervalPage);
    	}
    	var copyArr = wechatBillboard.wechatBillboardArray.slice();
    	wechatBillboard.pageArray = [];
    	while(copyArr.length){
    		wechatBillboard.pageArray.push(copyArr.splice(0,10))
    	}
//    	wechatBillboard.pageArray.push(copyArr.splice(0,10));
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
        //用于显示百分比长度的总量
        var maxCount = 0;
        for(var i = 0; i < currentPageArray.length; i++){
            if(currentPageArray[i].s_good > maxCount){
                maxCount = currentPageArray[i].s_good;
            }
        }
        
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
                var html = makeWechatBillboardHtml(row, maxCount);
                wechatBillboardList.append(html);
            });
            
            wechatBillboardList.addClass('active', 1000, function() {
                startShowOneByOne();
            });
        
        });
        
        function makeWechatBillboardHtml(row, maxCount) {
            var html = '<div class="item">\
					        <div class="ranking col-xs-2">\
								<span class="ranking-card"><span class="ranking-no">1</span></span>\
							</div>\
				            <div class="data col-xs-10">\
				    			<div class="name col-xs-3">科学抗癌</div>\
				           		<div class="activity-count col-xs-5">\
					            	<span class="activity-card">\
									<span class="activity-num">1</span></span>\
            					</div>\
				           		<div class="spread-count col-xs-2">52.32</div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingClass;
            $html.find('.ranking-no').text(row.rank);
            $html.find('.name').text(row.name);
            $html.find('.activity-num').text(row.s_good);
            $html.find('.spread-count').text(row.s_read);
            //算百分比
            var tmpLen = row.s_good / maxCount * 100 + "" + "%";
            console.log(tmpLen);
            $html.find('.activity-card').css("width", tmpLen);
//            $html.find('.raising')
//            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
//            			.addClass(raisingClass);
           
//            $html.find('.ranking-no').text(row.rank);
            var contentParam = {
				"timeUnit": wechatBillboard.options.queryParam.timeUnit,
				"sortKey": "readcount",
				"num":30,
				"sourceaccount": row.account
            }
			$html.click(function(){

				DetailShow.show({
		            container: $('body'),
		            data: {
		            	name: row.name,
//		            	time: '',
//		            	content: Utils.escapeHtml((row.extraData && row.extraData.content) || row.content),
//		            	pics: [],
		            	contentParam: contentParam
		            }});
			});
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
            var html = makeWechatBillboardHtml(row, maxCount);
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

/*二级弹窗页面*/
/**
 *  二级详情页面
 */

var DetailShow = {
    show: function (opts) {
        var opts_default = {
            data: {
            	title: '',
            	time: '',
            	content: '',
            	pics: [],
            	contentParam:''
            }
        };
        var detailShow = {};
        detailShow.options = $.extend(true, opts_default, opts);
        DetailShow.showDetail(detailShow);
        return detailShow;
    },
    
    showDetail: function(detailShow) {
        var row = detailShow.options.data;
        var dialog = DetailDialog.init();
        /*dialog.find('.modal-dialog').addClass('modal-dialog-detail');*/
//        CentralProxy.getArtical(row.contentParam, function(resp){
         $.ajax({
            url: ModuleConfigHelper.getConfigByModuleName('ns.wechat.contentw').contentUrl,
        	type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(row.contentParam),
			success	: function(response) {
	        	var respData = JSON.parse(response).data;
	          	var headHtml = '<div class="title-detail-pane">\
	          						<div class="head">\
	          							<span class="name"></span>\
	          						</div>\
					          		<div class="description col-xs-12">\
						          		<span class="col-xs-6">名称</span>\
						           		<span class="col-xs-3">阅读数</span>\
						           		<span class="col-xs-3">点赞数</span>\
									</div>\
	          						<div class="item-list"></div>\
	          					</div>';
	        	var $headHtml = $(headHtml);
	        	$headHtml.find('.name').text(row.name);
	        	 dialog.find('.modal-content').append($headHtml);
	        	 
	            $(respData).each(function(index, line) {
	                var html = appendContent(line);
	                dialog.find('.modal-content .item-list').append(html);
	            });
	            function appendContent(line){
	            	var detailHtml = '<div class="col-xs-12">\
								    			<div class="title col-xs-6">科学抗癌</div>\
								           		<div class="read-num col-xs-3">45.22</div>\
								           		<div class="good col-xs-3">52.32</div>\
							    	  </div>';
					var $html = $(detailHtml);
					$html.find('.title').text(line.title);
					$html.find('.read-num').text(line.readcount);
					$html.find('.good').text(line.good);	
					return $html;
	            }
			}
        	
        })
        
        
        function appendPhotos(row, photosList) {
        	if(!row.pics || row.pics.length == 0){
        		return;
        	}
			for(var i in row.pics){
				if(row.pics[i] && row.pics[i].indexOf('http://')>=0){
					var html = '<img class="cover" src="' + row.pics[i] + '"/>';
					$(html).appendTo(photosList);
				}
			}
		}
//        appendPhotos(row, $html.find('#photos-coverflow'));
//        $html.appendTo(dialog.find('.modal-content'));
    }
};


var DetailDialog = {
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
$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	WechatBillboard.createNew();
});

