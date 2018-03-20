
/**
 * 今日报题页面
 */
var WechatBillboard = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.wechat-billboard-page'),
            queryInterval: 60000,
            animcursor: 66,
//            searchParam: {
//                "firstRowNum": 0,
//                "maxResults": 30,
//                "fullText": "",
//                "searchGroup": {
//                    "operator": "AND",
//                    "attributeConditionList": [
//                        {
//                            "attributeDefID": "assetcategoryid",
//                            "comparator": "EQ",
//                            "value": "title"
//                        },
//                        {
//                            "attributeDefID": "editstatus",
//                            "comparator": "GE",
//                            "value": "1"
//                        },
//                        {
//                			"attributeDefID": "target",
//                			"comparator": "EQ",
//                			"value": "微信"
//                		}, 
//                        {
//                            "attributeDefID": "deletedflag",
//                            "comparator": "EQ",
//                            "value": 0
//                        },
//                        {
//							"attributeDefID": "creationdate",
//							"comparator": "BETWEEN",
//							"value": '',
//							"anotherValue":'' 
//						}
//                    ]
//                },
//                "orderList": [
//					{
//						"attributeDefID": "submittime",
//						"desc": true
//					},
//                    {
//                        "attributeDefID": "creationdate",
//                        "desc": true
//                    }
//                ]
//            },
//            searchParam:{
//            	"firstRowNum": 0,
//            	"maxResults": 10,
//            	"searchGroup": {
//            		"operator": "AND",
//            		"attributeConditionList": [{
//            			"attributeDefID": "assetcategoryid",
//            			"comparator": "EQ",
//            			"value": "title"
//            		}, {
//            			"attributeDefID": "editstatus",
//            			"comparator": "GE",
//            			"value": 1
//            		}, {
//            			"attributeDefID": "creationdate",
//            			"comparator": "BETWEEN",
//            			"value": "",
//            			"anotherValue": ""
//            		}, {
//            			"attributeDefID": "deletedflag",
//            			"comparator": "EQ",
//            			"value": 0
//            		}],
//            		"searchGroupList": [{
//            			"operator": "OR",
//            			"attributeConditionList": [{
//            				"attributeDefID": "target",
//            				"comparator": "EQ",
//            				"value": "微信"
//            			},{
//            				"attributeDefID": "target",
//            				"comparator": "EQ",
//            				"value": "APP"
//            			}]
//            		}]
//            	},
//            	"orderList": [{
//            		"attributeDefID": "submittime",
//            		"desc": true
//            	}, {
//            		"attributeDefID": "creationdate",
//            		"desc": true
//            	}]
//            }
            queryParam: {
            	"accessToken": "05784E32D86340D976677714905E6D53B2E0",
            	"timeStamp": new Date().getTime(),
            	"startTime": Utils.parseTime(new Date().getTime()-259200000, 'y-m-d h:i:s', true),
            	"endTime": Utils.parseTime(new Date().getTime(), 'y-m-d h:i:s', true),
            	"keyWord": "",
            	"sortKey":"readCount",
            	"count":10
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
    	var loadCallback = function(resp) {
            var wechatBillboardArray = [];
            if(resp.code != 0){
            	return;
            }
            wechatBillboardArray = resp.data.result;
//            var wechatBillboardArray = [];
//            $(resp.data.result).each(function(index, row) {
//            	if(index > 9){
//            		return;
//            	}
//                wechatBillboardArray.push(row);
//            });
            if (callback && typeof callback == 'function') {
                callback(wechatBillboardArray, wechatBillboard);
            }
    		
        };
//		var lst = wechatBillboard.options.searchParam.searchGroup.attributeConditionList;
//		for(var i in lst){
//        	if(lst[i].attributeDefID == 'creationdate'){
//        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
////        		var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T00:00:00Z';
//        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
//        		lst[i].value = startTime;
//        		lst[i].anotherValue = endTime;
//        	}
//        }     
//        CentralProxy.search(wechatBillboard.options.searchParam, function (resp) {
//            if(callback && typeof callback == 'function') {
//				callback(resp, wechatBillboard);
//			}
//        }, null, true);
    	CentralProxy.getWeixinMediaData(wechatBillboard.options.queryParam, loadCallback);
    	//假数据
//        var resp = {
//        		"message": "处理成功",
//        		"data": {
//        			"result": [{
//        				"commentNum": 2335,
//        				"dataChange": 1,
//        				"rank": 1,
//        				"nickName": "超级访问",
//        				"praisedCount": 10810,
//        				"readCount": 953643
//        			}, {
//        				"commentNum": 2132,
//        				"dataChange": 1,
//        				"rank": 2,
//        				"nickName": "大声说出来",
//        				"praisedCount": 8481,
//        				"readCount": 282681
//        			}, {
//        				"commentNum": 2036,
//        				"dataChange": -1,
//        				"rank": 3,
//        				"nickName": "饮食男女",
//        				"praisedCount": 8324,
//        				"readCount": 1353449
//        			},{
//        				"commentNum": 1864,
//        				"dataChange": 1,
//        				"rank": 4,
//        				"nickName": "微电影",
//        				"praisedCount": 10810,
//        				"readCount": 953643
//        			}, {
//        				"commentNum": 1745,
//        				"dataChange": 1,
//        				"rank": 5,
//        				"nickName": "记忆",
//        				"praisedCount": 8481,
//        				"readCount": 282681
//        			}, {
//        				"commentNum": 1323,
//        				"dataChange": -1,
//        				"rank": 6,
//        				"nickName": "爱尚健康",
//        				"praisedCount": 8324,
//        				"readCount": 1353449
//        			},{
//        				"commentNum": 1243,
//        				"dataChange": 1,
//        				"rank": 7,
//        				"nickName": "生活麻辣烫",
//        				"praisedCount": 10810,
//        				"readCount": 953643
//        			}, {
//        				"commentNum": 1101,
//        				"dataChange": 1,
//        				"rank": 8,
//        				"nickName": "巴渝子弟兵",
//        				"praisedCount": 8481,
//        				"readCount": 282681
//        			}, {
//        				"commentNum": 452,
//        				"dataChange": -1,
//        				"rank": 9,
//        				"nickName": "约会渝美人",
//        				"praisedCount": 8324,
//        				"readCount": 1353449
//        			}],
//        			"totalCount": 9
//        		},
//        		"code": "0"
//        	};
//        loadCallback(resp);
    },
    processData: function(wechatBillboard){
		if(!wechatBillboard.wechatBillboardArray) {
			return;
		}
//		var assetList = wechatBillboard.wechatBillboardArray.result.assetList;
		wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardArray;
		var param = {
            	"startDate" : "",
            	"endDate" : ""
            }
        param.startDate = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true);
        param.endDate = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
        
        $.ajax({
			url		: 'http://newsphere.gzstvcloud.com/web/api/show/getV2Top10',
			type	: 'GET',
			async	: true,
			data 	: param,
			success	: function(response) {
				wechatBillboard.v2Top10Data = JSON.parse(response.result).result.content;
				$.ajax({
					url		: 'http://newsphere.gzstvcloud.com/web/api/show/getDongJingTop10',
					type	: 'GET',
					async	: true,
					data 	: param,
					success	: function(resp) {
						$('.loading').hide();
						wechatBillboard.dongJingTop10Data = JSON.parse(resp.result).result;
						wechatBillboard.top10Data = wechatBillboard.v2Top10Data.concat(wechatBillboard.dongJingTop10Data);
			        	for(var i in wechatBillboard.top10Data){
			        		if(wechatBillboard.top10Data[i].browseNum){
			        			wechatBillboard.top10Data[i].readCount = wechatBillboard.top10Data[i].browseNum;
			        			wechatBillboard.top10Data[i].target = "微兔";
			        		}else{
			        			wechatBillboard.top10Data[i].readCount = wechatBillboard.top10Data[i].access;
			        			wechatBillboard.top10Data[i].target = "动静";
			        		}
			        	}	
		            	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.concat(wechatBillboard.top10Data)
		            	wechatBillboard.wechatBillboardJson.sort(function(x,y){
		            		return y.readCount - x.readCount;
		            	})
		            	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.slice(1,11)
		    			WechatBillboard.appendAllItem(wechatBillboard);	
					}
				})
			}
		})
//        var getV2Top10 = CentralProxy.getV2Top10(param);
//        var getDongJingTop10 = CentralProxy.getDongJingTop10(param);
//        $.when(getV2Top10,getDongJingTop10).done(function(resp1, resp2){
//        	$('.loading').hide();
//        	wechatBillboard.v2Top10Data = JSON.parse(resp1[0].result).result.content;
//        	wechatBillboard.dongJingTop10Data = JSON.parse(resp2[0].result).result;
//        	wechatBillboard.top10Data = wechatBillboard.v2Top10Data.concat(wechatBillboard.dongJingTop10Data);
//        	for(var i in wechatBillboard.top10Data){
//        		if(wechatBillboard.top10Data[i].browseNum){
//        			wechatBillboard.top10Data[i].readCount = wechatBillboard.top10Data[i].browseNum;
//        			wechatBillboard.top10Data[i].target = "微兔";
//        		}else{
//        			wechatBillboard.top10Data[i].readCount = wechatBillboard.top10Data[i].access;
//        			wechatBillboard.top10Data[i].target = "动静";
//        		}
//        	}
//        	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.concat(wechatBillboard.top10Data)
//        	wechatBillboard.wechatBillboardJson.sort(function(x,y){
//        		return y.readCount - x.readCount;
//        	})
//        	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.slice(1,11)
//			WechatBillboard.appendAllItem(wechatBillboard);
//        })	
        
//		for(var i in assetList){
//			var assets = AssetHelper.toAttributeValueMap(assetList[i].attributeList);
//			wechatBillboard.wechatBillboardJson.push(assets);
//		}
//		var idList = [];
//		for(var i in wechatBillboard.wechatBillboardJson){
//			idList.push(wechatBillboard.wechatBillboardJson[i].moid);
//		}
//		CentralProxy.getTitleCounts(idList,function(resp){
//			var data = JSON.parse(resp.result).data.result;
//			for(var i in wechatBillboard.wechatBillboardJson){
//				wechatBillboard.wechatBillboardJson[i].pv = "";
//				wechatBillboard.wechatBillboardJson[i].commentCount = "";
//				wechatBillboard.wechatBillboardJson[i].praiseCount = "";
//				wechatBillboard.wechatBillboardJson[i].status = "";
//				for(var j in data){
//					if(data[j].id == wechatBillboard.wechatBillboardJson[i].moid){
//						wechatBillboard.wechatBillboardJson[i].pv = data[j].pv;
//						wechatBillboard.wechatBillboardJson[i].commentCount = data[j].commentCount;
//						wechatBillboard.wechatBillboardJson[i].praiseCount = data[j].praiseCount;
//						wechatBillboard.wechatBillboardJson[i].status = data[j].status;
//					}
//				}
//
//			}
//			var param = {
//	            	"startDate" : "",
//	            	"endDate" : ""
//	            }
//	        param.startDate = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true);
//	        param.endDate = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
//	        var getV2Top10 = CentralProxy.getV2Top10(param);
//	        var getDongJingTop10 = CentralProxy.getDongJingTop10(param);
//	
//	        $.when(getV2Top10,getDongJingTop10).done(function(resp1, resp2){
//	        	$('.loading').hide();
//	        	wechatBillboard.v2Top10Data = JSON.parse(resp1[0].result).result.content;
//	        	wechatBillboard.dongJingTop10Data = JSON.parse(resp2[0].result).result;
//	        	wechatBillboard.top10Data = wechatBillboard.v2Top10Data.concat(wechatBillboard.dongJingTop10Data);
//	        	for(var i in wechatBillboard.top10Data){
//	        		if(wechatBillboard.top10Data[i].browseNum){
//	        			wechatBillboard.top10Data[i].pv = wechatBillboard.top10Data[i].browseNum;
//	        			wechatBillboard.top10Data[i].target = "微兔";
//	        		}else{
//	        			wechatBillboard.top10Data[i].pv = wechatBillboard.top10Data[i].access;
//	        			wechatBillboard.top10Data[i].target = "动静";
//	        		}
//	        	}
//	        	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.concat(wechatBillboard.top10Data)
//	        	wechatBillboard.wechatBillboardJson.sort(function(x,y){
//	        		return y.pv - x.pv;
//	        	})
//	        	wechatBillboard.wechatBillboardJson = wechatBillboard.wechatBillboardJson.slice(1,11)
//				WechatBillboard.appendAllItem(wechatBillboard);
//	        })
//		})

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
				    			<div class="name col-xs-6">科学抗癌</div>\
				           		<div class="activity-count col-xs-2">45</div>\
				           		<div class="spread-count col-xs-2">52</div>\
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
			case "动静":
				raisingClass = "fa fa-mobile app";
				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.target);
				break;
			case "微兔":
				raisingClass = "fa fa-mobile app";
				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.target + "<span class='source-content'>gogo</span>");
				break;
			default:
				raisingClass = "fa fa-weixin";
				$html.find('.source-count').html("<span class='source-text'>&nbsp;</span>" + row.source);
				break;
			}
            $html.find('.ranking-no').text(index+1);
            $html.find('.name').text(row.assetname || row.title);
            $html.find('.activity-count').text(row.readCount);
            $html.find('.spread-count').text(row.commentNum || row.comments);
        
//            $html.find('.watcher-count').text(row.readCount);
            $html.find('.source-text')
            	.removeClass('fa fa-weibop fa-weixin')
            			.addClass(raisingClass);
            return $html;
        }
        ;
    	
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

