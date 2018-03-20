/*温岭台内容库展示*/
var NetPlayer = {
		createNew : function(opts){
			var opts_default = {
					container: $('.netPlayer-list-pane .netPlayer-list'),
					appendInterval: 10000,
					queryInterval: 180000,
					searchParamNs:{
		        		"group": {
		        			"allOf": [{
		        				"categoryType": {
		        					"EQ": ["TYPE_TITLE"]
		        				}
		        			}, {
		        				"deleteFlag": {
		        					"EQ": ["Normal"]
		        				}
		        			},{
		        				"createdTime": {
		        					"BTW": ["", ""]
		        				}
		        			}]
		        		},
		        		"orders": [{
		        			"createdTime": "DESC"
		        		}],
		        		"facets": {
		        			"fields": []
		        		},
		        		"start": 0,
		        		"limit": 30     	
		            }
			}
			var netPlayer = {};
			netPlayer.options = $.extend(true, opts_default, opts);
			
			NetPlayer.loadData(netPlayer, NetPlayer.loadDataCallBack);
			//每隔3分钟，重新查询一次最新数据并显示
//			netPlayer.intervalQuery = setInterval(function() {
//				NetPlayer.loadData(netPlayer, NetPlayer.loadDataCallBack);
//			}, netPlayer.options.queryInterval);
			return netPlayer;
		},
		
		loadDataCallBack : function(netPlayerData, netPlayer){
			netPlayer.netPlayerData = netPlayerData;
			NetPlayer.processDatas(netPlayer);
		},
		
		loadData : function(netPlayer, callback){

	    	var title = ModuleConfigHelper.getConfigByModuleName('ns.player.content').title || '新闻生产库';
	    	$('.area-title').html(title);
	    	
			var list = netPlayer.options.searchParamNs.group.allOf;
			for(var i in list){
	        	if(list[i].createdTime){
	        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
	        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
	        		list[i].createdTime.BTW[0] = startTime;
	        		list[i].createdTime.BTW[1] = endTime;
	        	}
	        }
	    	CentralProxy.searchComb(netPlayer.options.searchParamNs, function (resp) {
	    		callback(JSON.parse(resp), netPlayer);
	    	}, null);
//	    	var resp = {
//	    		"data": [
//		           {
//		             "GlobalID": 5186215,
//		             "Title": "男子为缓解儿子中考压力 买罂粟为其“提神”",
//		             "Photo": "http://7xr4g8.com1.z0.glb.clouddn.com/411",
//		             "Summary": "所幸，南京交警高速八大队民警在查车过程及时发现。",
//		             "MyType": "小图+标题+描述",
//		             "PublishDate": '1510740438',
//		             "DocFrom": "现代快报",
//		             "Footer": "",
//		             "OrderNumber": 43721300,
//		             "Href": "http://news.jstv.com/a/20170613/1497334453182.shtml"
//		           },
//		           {
//		             "GlobalID": 5186146,
//		             "Title": "男子酒后撒泼踹警察胸口还撞警车 审讯时称记不得",
//		             "Photo": "http://7xr4g8.com1.z0.glb.clouddn.com/200",
//		             "Summary": "一马自达轿车追上一辆警车后，猛烈撞击警车两三下。",
//		             "MyType": "小图+标题+描述",
//		             "PublishDate": '1510740438',
//		             "DocFrom": "云南网",
//		             "Footer": "",
//		             "OrderNumber": 43720900,
//		             "Href": "http://news.jstv.com/a/20170613/1497334796230.shtml"
//		           },
//		           {
//		             "GlobalID": 5184108,
//		             "Title": "习近平重新定义中国制造",
//		             "Photo": "http://7xr4g8.com1.z0.glb.clouddn.com/100",
//		             "Summary": "读懂当代中国，中国制造是一个极佳的窗口。",
//		             "MyType": "小图+标题+描述",
//		             "PublishDate": '1510585660',
//		             "DocFrom": "新华社",
//		             "Footer": "",
//		             "OrderNumber": 43713000,
//		             "Href": "http://news.jstv.com/a/20170613/1497315939837.shtml"
//		           },
//		           {
//		             "GlobalID": 5175404,
//		             "Title": "习近平批准军队新设立\"八一勋章\" 为军队最高荣誉",
//		             "Photo": "http://7xr4g8.com1.z0.glb.clouddn.com/501",
//		             "Summary": "近日产生初步候选人，向军内外公示接受评议。",
//		             "MyType": "小图+标题+描述",
//		             "PublishDate": '1510585660',
//		             "DocFrom": "新华网",
//		             "Footer": "",
//		             "OrderNumber": 43709900,
//		             "Href": "http://news.jstv.com/a/20170612/149725508741.shtml"
//		           },
//		           {
//		             "GlobalID": 5177357,
//		             "Title": "李强：全面深改好经验要推出去 让“盆景”变“风景”",
//		             "Photo": "http://7xr4g8.com1.z0.glb.clouddn.com/205",
//		             "Summary": "江苏省委全面深化改革领导小组第二十三次会议召开。",
//		             "MyType": "小图+标题+描述",
//		             "PublishDate": '1510585660',
//		             "DocFrom": "荔枝新闻",
//		             "Footer": "",
//		             "OrderNumber": 43709600,
//		             "Href": "http://news.jstv.com/a/20170612/1497258746897.shtml"
//		           }
//		         ]
//		       }
//	    	var loadDataCallback = function(resp){
//		    	var netplayerArray = [];
//		    	$(resp.data).each(function(index, row) {
//		    		netplayerArray.push(row);
//		        });
//		    	netplayerArray.sort(function(x, y){
//	          	  return   y.PublishDate - x.PublishDate;
//		    	});
//				if(callback && typeof callback == 'function') {
//					callback(netplayerArray, netPlayer);
//				}
//	    	}
//	    	loadDataCallback(resp);	
		},
		
		appendFoot : function (netPlayer){
			var netPlayerListFoot = $('.netPlayer-page').find('.netPlayer-list-foot');
			var totalDatas = netPlayer.netPlayerArray.length;
			var totalPages = netPlayer.netPageArray.length;
			var currentPage = netPlayer.pageIndex;
			var currentPageArray = [];
			netPlayerListFoot.empty();
	    	var html='共查询到<span class="netplayerrundown-list-foot-count">'+totalDatas+'</span>条信息，共'+ totalPages +'页，当前第<span class="netplayerrundown-list-foot-current">'+(currentPage+1)+'</span>页'+
	    			  '<a class="pagePrevious" href="javascript:void(0)"> 上一页</a>'+'<a class="pageNext" href="javascript:void(0)"> 下一页</a>'
	    	netPlayerListFoot.append(html);
	    	
	    	$('.pagePrevious').click(function(){
	    		clearInterval(netPlayer.intervalPage);
	    		netPlayer.pageIndex = netPlayer.pageIndex-2;
	    		currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	    		NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	            netPlayer.pageIndex++;
	            
	            netPlayer.intervalPage = setInterval(function () {
	                if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
	                    netPlayer.pageIndex = 0;//从第一页重新开始展示
	                }
	                currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	                NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	                netPlayer.pageIndex++;
	            }, 15000);//每页切换的时间
	    	})
	    	

	          
	    	$('.pageNext').click(function(){
	    		clearInterval(netPlayer.intervalPage);
	    		if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
	            	netPlayer.pageIndex = 0;
	            }
	    		currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	    		NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	            netPlayer.pageIndex++;
	            
	            netPlayer.intervalPage = setInterval(function () {
	                if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
	                    netPlayer.pageIndex = 0;//从第一页重新开始展示
	                }
	                currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	                NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	                netPlayer.pageIndex++;
	            }, 15000);//每页切换的时间
	    	})	 
	    	if((netPlayer.pageIndex+1) == totalPages){
	    		$('a.pageNext').removeAttr("href");
	    		$('a.pageNext').unbind("click")
	    	}
	    	if(netPlayer.pageIndex == 0){
	    		$('a.pagePrevious').removeAttr("href");
	    		$('a.pagePrevious').unbind("click")
	    	}
//	    	netPlayerListFoot.jAnimateOnce('fadeInRightBig');
		},
		
		
		processDatas:function(netPlayer){
			//暂时屏蔽ns真数据
//			var assetList = netPlayer.netPlayerData.result.assetList;
//			netPlayer.netPlayerArray = [];
//			for(var i in assetList){
//				var assets = AssetHelper.toAttributeValueMap(assetList[i].attributeList);
//				netPlayer.netPlayerArray.push(assets);
//			}
			netPlayer.netPlayerArray = netPlayer.netPlayerData.items;	
//			netPlayer.netPlayerArray = netPlayer.netPlayerData;
			NetPlayer.displayNetPlayerDatas(netPlayer);
			
		},
		displayNetPlayerDatas: function(netPlayer){
			if (netPlayer.intervalPage) {
	            clearInterval(netPlayer.intervalPage);
	        }
			
			var copyArr = netPlayer.netPlayerArray.slice();;
			var netPlayerNew = {};
			netPlayerNew["data"] = [];
			for(var i in netPlayer.netPlayerData){
				netPlayerNew["data"].push(netPlayer.netPlayerData[i])
			}
			var copyArr = netPlayerNew["data"].slice();
			netPlayer.netPageArray = [];
			while(copyArr.length){
				netPlayer.netPageArray.push(copyArr.splice(0, 5));				
			}
			netPlayer.pageIndex = 0;
	        if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
	            return;
	        }
	        var currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	        NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	        netPlayer.pageIndex++;
			//定时器的位置
	        netPlayer.intervalPage = setInterval(function () {
	            if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
	                netPlayer.pageIndex = 0;//从第一页重新开始展示
//				    	clearInterval(Bubble.intervalPage);
//				    	return;
	            }
	            currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
	            NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
	            netPlayer.pageIndex++;
	        }, 15000);//每页切换的时间

		},
		clearItems:function(callback, netPlayer, currentPageArray){
			//这里设置定时器清除
	        if(netPlayer.intervalShowOneByOne){
	        	clearInterval(netPlayer.intervalShowOneByOne);
	        }
//			netPlayer.options.container.jAnimate('fadeOutLeftBig').empty();
	        netPlayer.options.container.empty();
	        if (callback && typeof callback == 'function') {
                callback(netPlayer, currentPageArray);
            }
//			var netPlayerList = netPlayer.options.container, 
//			netPlayerArray = netPlayer.netPlayerArray;
//			if (netPlayerList.length == 0) {
//	            if (callback && typeof callback == 'function') {
//	                callback(netPlayer, currentPageArray);
//	            }
//	            return;
//	        }

		},
		appendItems:function(netPlayer, currentPageArray){
			var netPlayerList = netPlayer.options.container, 
				netPlayerArray = netPlayer.netPlayerArray;
	        if(currentPageArray.length == 0) {
	        	netPlayerList.append('<span>暂无数据</span>');
			}
			$(currentPageArray).each(function(index, row) {
				var html = makeNetPlayerHtml(row);
				netPlayerList.append(html);
			});
//			netPlayerList.jAnimate('fadeInRightBig');
			startShowOneByOne();
			function makeNetPlayerHtml(row) {
				var html = '<div class="item add-transition">\
								<div class="item-left">\
									<div class="img-layer"><img class="photo" src="./1.png"/></div>\
								</div>\
								<div class="item-right">\
									<span class="item-title">江苏省2016年普通高等高校招生工作意见</span>\
									<span class="time">30分钟前</span>\
								</div>\
								<i class="top-left fa fa-angle-up" aria-hidden="true"></i>\
								<i class="bottom-right fa fa-angle-up" aria-hidden="true"></i>\
							</div>';
				var $html = $(html);
				//通用版本
//				var timeMordify = Utils.parseTime(row.PublishDate,"y-m-d h:i:s", true, true);
//				var $html = $(html);
				row.Photo = "http://7xr4g8.com1.z0.glb.clouddn.com/"+ (parseInt(900 * Math.random()))
				$html.find('.photo').attr("src", row.Photo)
//				$html.find('.item-title').text(row.Title);
//				$html.find('.time').text(timeMordify);	
				$html.find('.item-title').text(row.name || row.assetname);
				$html.find('.time').text((row.createdTime && row.createdTime.formatDate('yyyy-MM-dd')) || row.creationdate.substring(0,19));
				
				$html.click(function(){
					DetailShow.show({
			            container: $('body'),
			            data: {
			            	title: row.assetname,
			            	time: row.publishtime,
			            	content: row.content,
			            	pics: imagesList
			            }});
				});
				return $html;
			}
			function startShowOneByOne() {
				var $netPlayerItems = netPlayerList.find('.item');
				var currentArrayIndex = 0;
				$($netPlayerItems[currentArrayIndex]).addClass('active',500);
				currentArrayIndex++;
				netPlayer.intervalShowOneByOne = setInterval(function() {
					if(currentArrayIndex >= $netPlayerItems.length) {
						currentArrayIndex = 0;
						if (netPlayer.intervalPage) {
				            clearInterval(netPlayer.intervalPage);
				        }
						if (netPlayer.intervalShowOneByOne) {
							clearInterval(netPlayer.intervalShowOneByOne);
				        }
						
						if (netPlayer.pageIndex >= netPlayer.netPageArray.length) {
							NetPlayer.displayNetPlayerDatas(netPlayer);
							return;
			            }				
			            var currentPageArray = netPlayer.netPageArray[netPlayer.pageIndex].slice();
			            NetPlayer.clearItems(NetPlayer.appendItems, netPlayer, currentPageArray);
			            netPlayer.pageIndex++;
						return;
					}
					if(netPlayerList.find('.item.active').length > 0) {
						var tempIndex = currentArrayIndex;
						netPlayerList.find('.item.active').removeClass('active');
//						$($netPlayerItems[tempIndex]).addClass('animated bounceInLeft active');
						$($netPlayerItems[tempIndex]).addClass('active',500);
					} else {
						$($netPlayerItems[currentArrayIndex]).addClass('active',500);
					}
					currentArrayIndex++;
				}, 3000);
			};
//			NetPlayer.appendFoot(netPlayer);
		},
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
    NetPlayer.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
});

