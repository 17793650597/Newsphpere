var Wechat = {
		createNew : function(opts){
			var opts_default = {
					container: $('.latestwechat-container .wechat-list'),
					appendInterval: 10000,
					queryInterval: 180000
			}
			var wechat = {};
			wechat.options = $.extend(true, opts_default, opts);
			
			Wechat.loadData(wechat, Wechat.loadDataCallBack);
			//每隔3分钟，重新查询一次最新数据并显示
			wechat.intervalQuery = setInterval(function() {
				Wechat.loadData(wechat, Wechat.loadDataCallBack);
			}, wechat.options.queryInterval);
			return wechat;
		},
		
		loadDataCallBack : function(wechatArray, wechat){
			wechat.wechatArray = wechatArray;
			Wechat.displayWechatDatas(wechat);
		},
		
		loadData : function(wechat, callback){
			var startTime = Utils.parseTime(new Date().getTime() - 604800000, 'y-m-d h:i:s', true);
	    	var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d h:i:s', true);
	    	//云视接口
//	    	var param = {
//	    			"accessToken": "05784E32D86340D976677714905E6D53B2E0",
//	    			"timeStamp": new Date().getTime(),
//	    			"startTime": startTime,
//	    			"endTime": endTime,
//	    			"currentPage": 1,
//	    			"pageSize": 60,
//	    			"sortKey": "publishTime",
//	    			"sortOrder": "desc"
//	    		};
	    	//朗视就接口（有鉴权）
	    	var param = {
    	    	"startTime": startTime,
                "endTime": endTime,
                "currentPage": 1,
                "pageSize": 30,
                "sortKey": "publishTime",
                "sortOrder": "desc"
	    	}
	    	http://www.newsbigbang.com/auton/interface/getWeixinData.do
	    	CentralProxy.getWeixinData(param, function(resp) {
	    		if(resp.code!=0){
	    			return;
	    		}
				if(callback && typeof callback == 'function') {
					callback(resp.data.result, wechat);
				}
			});
		},
		
		displayWechatDatas: function(wechat){
			var wechatList = wechat.options.container, 
				wechatArray = wechat.wechatArray;
			if(wechatArray.length == 0){
				wechatList.append('<span>暂无数据</span>');
				return;
			}
			function makeWechatHtml(row){
				var html = '<div class="item slidedown">\
								<div class="author-avatar add-transition"><span></span><img class="author-avatar-img" src="source/10.jpg"/></div>\
				                <div class="axis-x add-transition">\
				            		<div class="bubble-body">\
										<div class="author">风的影子</div>\
										<div class="media-inf">\
											<span class="time">50分钟前</span>\
										</div>\
										<div class="content"></div>\
										<div class="tag-nums">\
											<i class="glyphicon glyphicon-eye-open"></i>\
											<span class="share">52342</span>\
											<span class="divid"></span>\
											<i class="glyphicon glyphicon-comment"></i>\
											<span class="comments">72132</span>\
											<span class="divid"></span>\
											<i class="glyphicon glyphicon-thumbs-up"></i>\
											<span class="praise">322132</span>\
										</div>\
				            		</div>\
								</div>\
							</div>';
				var $html = $(html);
				$html.find('.author-avatar-img').attr('src',row.headUrl);
				$html.find('.author').text(row.source);
				$html.find('.time').text(row.publishTime.substring(0,10));
				$html.find('.content').text(row.content);
				$html.find('.share').text(row.readCount);
				$html.find('.comments').text(row.commentNum);
				$html.find('.praise').text(row.praisedCount);
				/*$html.addClass('item-0');*/
				$html.addClass('item-0').click(function(){
										DetailShow.show({
								            container: $('body'),
								            data: {
								            	title: row.source,
								            	time: row.publishTime.substring(0,10),
								            	content: $(row.content).text(),
								            	pics: [row.headUrl]
								            }});
									});
				return $html;
			};
			
			var currentArrayIndex = 0;
			if(wechat.intervalAppend){
				clearInterval(wechat.intervalAppend);
			}
			if(wechat.intervalRapidAppend){
				clearInterval(wechat.intervalRapidAppend);
			}
		    wechat.intervalRapidAppend = setInterval(function(){
			    if(wechatList.find('.item').length > 1){
			    	clearInterval(wechat.intervalRapidAppend);
			    	rapidAppendCallback();
			    	return;
			    }
			    var html = makeWechatHtml(wechatArray[currentArrayIndex]);
			    wechatList.prepend(html);
			    $(wechatList.find('.item')).each(function(index, row) {
			    	var n = Number(index);
			    	$(this).removeClass('item-0 item-1 item-2 item-3 item-active').addClass('item-'+ n +'');
			    });
			    currentArrayIndex++;
			}, 600);
		    
		    function rapidAppendCallback(){
		    	$(wechatList.find('.item')).each(function(index, row) {
			    	var n = Number(index);
			    	if(n === 1){
			    		$(this).addClass('item-active');
			    	}
			    });
				wechat.intervalAppend = setInterval(function(){
				    if(currentArrayIndex >= wechatArray.length){
				    	currentArrayIndex = 0;
//				    	clearInterval(wechat.intervalAppend);
//				    	return;
				    }
				    
				    var html = makeWechatHtml(wechatArray[currentArrayIndex]);
				    wechatList.prepend(html);
				    currentArrayIndex++;
				    
				    $(wechatList.find('.item')).each(function(index, row) {
				    	var n = Number(index);
				    	if(n > 2){
				    		$(this).remove();
				    	}else{
				    		$(this).removeClass('item-0 item-1 item-2 item-3 item-active').addClass('item-'+ n +'');
					    	if(n == 1){
					    		$(this).addClass('item-active');
					    	}
				    	}
				    });
				}, wechat.options.appendInterval);
		    }
		}
};

$(function(){
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Wechat.createNew();
}) ;
