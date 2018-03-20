/**
 * 微信热点页面
 */
var WechatBillboard = {
    createNew: function(opts) {
    	$('.time').html(new Date().format('yyyy年MM月dd日'));
        var opts_default = {
            container: $('.wechat-billboard-page'),
            queryInterval: 60000,
            animcursor: 66,
            queryParam: {
            		"accessToken":"05784E32D86340D976677714905E6D53B2E0",
            		"timeStamp":new Date().getTime(),
            		"currentPage":1,
            		"dataType":"weixin",
            		"pageSize":10
            		}
        };
        var wechatBillboard = {};
        wechatBillboard.options = $.extend(true, opts_default, opts);
//        WechatBillboard.initDateAndBtns(wechatBillboard);
        WechatBillboard.loadData(wechatBillboard, WechatBillboard.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        WechatBillboard.intervalQuery = setInterval(function() {
            WechatBillboard.loadData(wechatBillboard, WechatBillboard.loadDataCallBack);
        }, wechatBillboard.options.queryInterval);
        return wechatBillboard;
    },
    
    loadDataCallBack: function(wechatBillboardArray, wechatBillboard) {
        wechatBillboard.wechatBillboardArray = wechatBillboardArray;
        WechatBillboard.processData(wechatBillboard);
//        WechatBillboard.appendAllItem(wechatBillboard);
    },
    
    loadData: function(wechatBillboard, callback) {
    	var loadCallback = function(resp) {
            var wechatBillboardArray = [];
            if(resp.code != 0){
            	return;
            }
            var wechatBillboardArray = [];
            $(resp.data).each(function(index, row) {
            	if(index > 9){
            		return;
            	}
                wechatBillboardArray.push(row);
            });
            if (callback && typeof callback == 'function') {
                callback(wechatBillboardArray, wechatBillboard);
            }
        };
        
//    	CentralProxy.getWechatHot(wechatBillboard.options.queryParam, function(resp){
//    	   var respObj = JSON.parse(resp);
//    	   console.log(respObj);
//           if(respObj.code != 0){
//           		return;
//           }
//           var wechatBillboardArray = [];
//           $(respObj.data).each(function(index, row) {
//           		if(index > 9){
//           			return;
//           		}
//                wechatBillboardArray.push(row);
//           });
//           if (callback && typeof callback == 'function') {
//               callback(wechatBillboardArray, wechatBillboard);
//           }
//    	});
    	//假数据
		var resp={
			"code": 0,
			"message": "处理成功",
			"data": [{
				"commentNum": 4,
				"content": "北京时间6月7日，美国国防部发表2017年度《涉华军事与安全发展报告》，对中国的国防和军队建设妄加评论，渲染所谓，妄议两岸关系和台海形势。",
				"id": "593904830cf2e93a9cbd211f",
				"title": "美发布2017年度\u201c中国军力报告\u201d！我国防部强硬回击",
				"source": "军报记者",
				"publishTime": "2017-06-08 11:58:12",
				"readCount": 24706,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/125",
				"praisedCount": 100,
				"url": "http://mp.weixin.qq.com/s?__biz=MjM5MTE2NDUwMA==&amp;amp;mid=2656986336&amp;amp;idx=1&amp;amp;sn=0bdbbc50ca75c70d97182448dbff0496&amp;amp;chksm=bd1375db8a64fccd647c95e451043424766510b1991d4fb2848a7c6c398dd922fd765791715e&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 0,
				"content": "六月初，高考季如约而至。把对高考的关注从国内延伸至国外",
				"title": "你知道法国高考的第一门科目是什么吗？",
				"source": "光明日报",
				"publishTime": "2017-06-07 20:29:58",
				"readCount": 22147,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/120",
				"praisedCount": 213,
				"url": "http://mp.weixin.qq.com/s?__biz=MjM5NzM0MzQ4MQ==&amp;amp;mid=2654524469&amp;amp;idx=1&amp;amp;sn=6420421e95eb1a273c248fd2da0cf1f0&amp;amp;chksm=bd170da38a6084b58386983bdf10f2a52643838066ce609d3ad0dff48f3c2b27542246f69659&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 12,
				"content": "走私旧衣来自太平间 听到这个标题特别地令人惶恐 可是这样的事情却真实上演了",
				"id": "5938fea60cf2e93a9cbd07dc",
				"title": "可怕！厦门海关截获500吨韩国旧衣物，竟来自太平间！含大量童装，部分内衣甚至带血！",
				"source": "福建新闻频道",
				"publishTime": "2017-06-08 12:16:01",
				"readCount": 9978,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random())),
				"praisedCount": 30,
				"url": "http://mp.weixin.qq.com/s?__biz=MzA3ODE0OTgxMA==&amp;amp;mid=2654236945&amp;amp;idx=1&amp;amp;sn=6b5bf83c4a2d56488ec331458c58ab79&amp;amp;chksm=8487f0ccb3f079da4f82bf5e864c706063a2880a9b5d480ac2ab3638e48a51d1959345c9b0e2&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 18,
				"content": "2017年4月，河南驻马店，一女子在斑马线被出租车撞飞，司机逃逸。",
				"id": "5939031a0cf2e93a9cbd1ba1",
				"title": "愤怒！看完视频想骂人，冷漠是病，无药可救！",
				"source": "江苏新闻广播",
				"publishTime": "2017-06-08 11:32:15",
				"readCount": 6661,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random())),
				"praisedCount": 44,
				"url": "http://mp.weixin.qq.com/s?__biz=MTk0NDUwMTkyMQ==&amp;amp;mid=2651844777&amp;amp;idx=1&amp;amp;sn=cf67c6ffa5545767e579ddbea14160f0&amp;amp;chksm=4022196777559071592248cefd3ab29cf1d560bcd0caad5592118785265b67a97a43a9baa9d0&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 3,
				"content": "贵州发现一处超大型磷块岩矿床，是建国以来发现的 最大富磷矿！",
				"id": "5938b5c30cf2e93a9cbbea50",
				"title": "重大突破！贵州发现建国以来最大富磷矿，资源量超过8亿吨，价值超过2700亿",
				"source": "动静贵州",
				"publishTime": "2017-06-07 18:57:02",
				"readCount": 5853,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random())),
				"praisedCount": 33,
				"url": "http://mp.weixin.qq.com/s?__biz=MzA3MTA1MDU3OA==&amp;amp;mid=2676168697&amp;amp;idx=1&amp;amp;sn=2514c67773ee22bf8574af56777dc7b0&amp;amp;chksm=8544c3c4b2334ad27fad14408658b64d648a8cc7a4a3c3641d96cbdb00748967f64348e51dec&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 0,
				"content": "有首古诗这样描述他们的日常：一担乾柴古渡头，盘缠一日颇优游。归来涧底磨刀斧，又作全家明日谋。",
				"id": "593903920cf2e93a9cbd1dac",
				"title": "农民称他\u201c兄弟\u201d，他自称\u201c樵夫\u201d，他的事迹为何感动了无数人？",
				"source": "经济日报",
				"publishTime": "2017-06-08 14:50:38",
				"readCount": 4969,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random())),
				"praisedCount": 60,
				"url": "http://mp.weixin.qq.com/s?__biz=MjM5NjEyMzYxMg==&amp;amp;mid=2657371956&amp;amp;idx=1&amp;amp;sn=e51d2c8701c37f67472a8564727c1c3e&amp;amp;chksm=bd7ee1878a09689162cc6f16a3e2aea762385bdaa56979a3a2e9e322571f6a53d362c48da0c5&amp;amp;scene=27#wechat_redirect"
			}, {
				"commentNum": 0,
				"content": "要说占据影视剧第一眼熟宝座的爷孙仨人 一定是康熙、雍正和乾隆了 其中最火的莫过于四爷雍正",
				"id": "593902a20cf2e93a9cbd19e2",
				"title": "长指甲，兰花指，你竟然是这样\u201c不正经\u201d的雍正！",
				"source": "安徽新闻",
				"publishTime": "2017-06-08 15:25:03",
				"readCount": 897,
				"headUrl": "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random())),
				"praisedCount": 2,
				"url": "http://mp.weixin.qq.com/s?__biz=MTk5NjQ0NTAwMQ==&amp;amp;mid=2649822695&amp;amp;idx=1&amp;amp;sn=ef66f26ca9fa5d2836824a5f51cfa776&amp;amp;chksm=46c517c171b29ed7d3cfa5b9c291a523289c5e8960c59831848301cf84355e1b967aa0297f52&amp;amp;scene=27#wechat_redirect"
			}]
		}
	loadCallback(resp);
    },
    processData:function(wechatBillboard){
    	WechatBillboard.displayWechatDatas(wechatBillboard);
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
    displayWechatDatas: function(wechatBillboard){
		if (wechatBillboard.intervalPage) {
            clearInterval(wechatBillboard.intervalPage);
        }
		
		var copyArr = wechatBillboard.wechatBillboardArray.slice();;
		wechatBillboard.wechatPageArray = [];
		while(copyArr.length){
			wechatBillboard.wechatPageArray.push(copyArr.splice(0, 10));				
		}
		wechatBillboard.pageIndex = 0;
        if (wechatBillboard.pageIndex >= wechatBillboard.wechatPageArray.length) {
            return;
        }
        var currentPageArray = wechatBillboard.wechatPageArray[wechatBillboard.pageIndex].slice();
        WechatBillboard.clearItems(WechatBillboard.appendItems, wechatBillboard, currentPageArray);
        wechatBillboard.pageIndex++;
		//定时器的位置
        wechatBillboard.intervalPage = setInterval(function () {
            if (wechatBillboard.pageIndex >= wechatBillboard.wechatPageArray.length) {
                wechatBillboard.pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = wechatBillboard.wechatPageArray[wechatBillboard.pageIndex].slice();
            WechatBillboard.clearItems(WechatBillboard.appendItems, wechatBillboard, currentPageArray);
            wechatBillboard.pageIndex++;
        }, 30000);//每页切换的时间
    },
    clearItems:function(callback, wechatBillboard, currentPageArray){
		//这里设置定时器清除
        if(wechatBillboard.intervalShowOneByOne){
        	clearInterval(wechatBillboard.intervalShowOneByOne);
        }
        wechatBillboard.options.container.find('.wechat-billboard-list').empty();
        if (callback && typeof callback == 'function') {
            callback(wechatBillboard, currentPageArray);
        }
    },
    appendItems:function(wechatBillboard, currentPageArray){
		var wechatBillboardList = wechatBillboard.options.container.find('.wechat-billboard-list'), 
			wechatBillboardArray = wechatBillboard.wechatBillboardArray;
	    if(currentPageArray.length == 0) {
	    	wechatBillboardList.append('<span>暂无数据</span>');
		}
		$(currentPageArray).each(function(index, row) {
			var html = makeWechatHtml(row);
			wechatBillboardList.append(html);
		});
		startShowOneByOne();
		function makeWechatHtml(row) {
			console.log(row);
			var html = '<div class="item add-transition">\
							<div class="item-left add-transition">\
								<div class="img-layer"><img class="photo"/></div>\
							</div>\
							<div class="item-right add-transition">\
								<span class="docFrom">DocFrom</span>\
								<span class="item-title">首届“大学生创业”江苏</span>\
							</div>\
						</div>';
			var $html = $(html);
			$html.find('.photo').attr("src", row.headUrl)
			$html.find('.docFrom').text(row.source);
			$html.find('.item-title').text(row.title);
			var timeMordify = row.publishTime;
			
			var imagesList;;
	        if(row.Photo){
	        	imagesList = row.Photo;
	        }else{
	        	imagesList = "";
	        }
			$html.click(function(){
				NewsShow.show({
		            container: $('body'),
		            data: {
		            	title: row.title,
		            	time: timeMordify,
		            	commentNum: row.commentNum,
		            	readCount: row.readCount,
		            	praisedCount: row.praisedCount,
		            	content: row.content,
		            	pics: imagesList
		            }});
			});
			return $html;
		}
		function startShowOneByOne() {
			var $wechatItems = wechatBillboardList.find('.item');
			var currentArrayIndex = 0;
			$($wechatItems[currentArrayIndex]).addClass('active',500);
			currentArrayIndex++;
			wechatBillboard.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $wechatItems.length) {
					currentArrayIndex = 0;
					if (wechatBillboard.intervalPage) {
			            clearInterval(wechatBillboard.intervalPage);
			        }
					if (wechatBillboard.intervalShowOneByOne) {
						clearInterval(wechatBillboard.intervalShowOneByOne);
			        }
					
					if (wechatBillboard.pageIndex >= wechatBillboard.wechatPageArray.length) {
						WechatBillboard.displayWechatDatas(wechatBillboard);
						return;
		            }				
		            var currentPageArray = wechatBillboard.wechatPageArray[wechatBillboard.pageIndex].slice();
		            WechatBillboard.clearItems(WechatBillboard.appendItems, wechatBillboard, currentPageArray);
		            wechatBillboard.pageIndex++;
					return;
				}
				if(wechatBillboardList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					wechatBillboardList.find('.item.active').removeClass('active',500);
	//				$($wechatItems[tempIndex]).addClass('animated bounceInLeft active');
					$($wechatItems[tempIndex]).addClass('active',500);
				} else {
					$wechatItems.removeClass('active');
					$($wechatItems[currentArrayIndex]).addClass('active',500);
				}
				currentArrayIndex++;
			}, 3000);
		}
    },
//    appendAllItem: function(wechatBillboard) {
//        /*var wechatBillboardList = wechatBillboard.options.container.find('.wechat-billboard-list')
//          , 
//        wechatBillboardArray = wechatBillboard.wechatBillboardArray;
//        
//        wechatBillboardList.removeClass('active', 1000, function() {
//        	if(wechatBillboard.intervalShowOneByOne){
//        		clearInterval(wechatBillboard.intervalShowOneByOne);
//        	}
//            wechatBillboardList.empty();
//            if (wechatBillboardArray.length == 0) {
//                wechatBillboardList.append('<span>暂无数据</span>');
//                return;
//            }
//            
//            $(wechatBillboardArray).each(function(index, row) {
//                var html = makeWechatBillboardHtml(row);
//                wechatBillboardList.append(html);
//            });
//            
//            wechatBillboardList.addClass('active', 1000, function() {
//                startShowOneByOne();
//            });
//        
//        });*/
//        
//        function makeWechatBillboardHtml(row) {
//            var html = '<div class="item">\
//					        <div class="ranking col-xs-2">\
//								<div class="ranking-card">&nbsp;</div>\
//								<div class="ranking-no">1</div>\
//							</div>\
//				            <div class="data col-xs-10">\
//				    			<div class="name col-xs-4">#科学抗癌#</div>\
//				           		<div class="activity-count col-xs-2">45.22</div>\
//				           		<div class="spread-count col-xs-2">52.32</div>\
//				           		<div class="watcher-count col-xs-2">3219293</div>\
//				           		<div class="raising col-xs-2 glyphicon glyphicon-arrow-up"></div>\
//				    		</div>\
//						</div>';
//            var $html = $(html);
//            var raisingClass;
//            switch (row.dataChange) {
//			case 0:
//				raisingClass = "glyphicon-record";
//				break;
//			case 1:
//				raisingClass = "glyphicon-arrow-up";
//				break;
//			case -1:
//				raisingClass = "glyphicon-arrow-down";
//				break;
//			default:
//				break;
//			}
//            $html.find('.ranking-no').text(row.rank);
//            $html.find('.name').text(row.nickName);
//            $html.find('.activity-count').text(row.praisedCount);
//            $html.find('.spread-count').text(row.commentNum);
//            $html.find('.watcher-count').text(row.readCount);
//            $html.find('.raising')
//            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
//            			.addClass(raisingClass);
//            return $html;
//        }
//        ;
//    	
//    	var listContainer = wechatBillboard.options.container.find('.gallery-wechat-billboard');
//    	listContainer.find('.pt-page').removeClass('pt-page-current');
//    	var wechatBillboardArray = wechatBillboard.wechatBillboardArray;
//    	var wechatBillboardList = $('<div class="wechat-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
//    	
//    	if(wechatBillboard.intervalShowOneByOne){
//    		clearInterval(wechatBillboard.intervalShowOneByOne);
//    	}
//    	if (wechatBillboardArray.length == 0) {
//            wechatBillboardList.append('<span>暂无数据</span>');
////            return;
//        }
//        
//        $(wechatBillboardArray).each(function(index, row) {
//            var html = makeWechatBillboardHtml(row);
//            wechatBillboardList.append(html);
//        });
//        wechatBillboardList.appendTo(listContainer);
//        if(listContainer.children('div.pt-page').length>3){
//        	listContainer.children('div.pt-page')[0].remove();
//        }
//        if(wechatBillboard.pageTransitions){
//        	wechatBillboard.pageTransitions.stop();
//        }
//        var $pages = $('#pt-main').children('div.pt-page');
//        var pgOpts = {
//            	container : $('#pt-main'),
//            	$pages : $pages,
//    			animcursor : wechatBillboard.options.animcursor,
//    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
//    			autoChange: false
//    		};
//        wechatBillboard.pageTransitions = PageTransitions.createNew(pgOpts);
//        wechatBillboard.pageTransitions.init();
//        wechatBillboard.pageTransitions.nextPage(pgOpts.animcursor);
//        startShowOneByOne();
//        function startShowOneByOne() {
//        	if(wechatBillboard.intervalShowOneByOne){
//            	clearInterval(wechatBillboard.intervalShowOneByOne);
//            }
//            var $wechatBillboardItems = wechatBillboardList.find('.item');
//            $wechatBillboardItems.removeClass('active');
//            var currentArrayIndex = 0;
//            $($wechatBillboardItems[currentArrayIndex]).addClass('active', 300);
//            currentArrayIndex++;
//            wechatBillboard.intervalShowOneByOne = setInterval(function() {
//                if (currentArrayIndex >= $wechatBillboardItems.length) {
//                    currentArrayIndex = 0;
//                    //				    	clearInterval(wechatBillboard.intervalShowOneByOne);
//                    //				    	return;
//                }
//                if (wechatBillboardList.find('.item.active').length > 0) {
//                    var tempIndex = currentArrayIndex;
//                    wechatBillboardList.find('.item.active').removeClass('active', 100, function() {
//                        $($wechatBillboardItems[tempIndex]).addClass('active', 200);
//                    });
//                } else {
//                    $($wechatBillboardItems[currentArrayIndex]).addClass('active', 200);
//                }
//                currentArrayIndex++;
//            }, 3000);
//        }
//        ;
//    }
};
$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	WechatBillboard.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
});