//
///**
// * 收视率页面
// */

/**
 * 今日报道页面
 */
var WeeklyRating = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.analysis-rating-page'),
			animcursor: 66,
			timePerPage:15000
		};
		var weeklyRate = {};
		weeklyRate.options = $.extend(true, opts_default, opts);
//		weeklyRate.options.timePerOne = ModuleConfigHelper.getConfigByModuleName('daily.title').timeStampIntervalShowOne||3000;
//		weeklyRate.options.timePerPage = ModuleConfigHelper.getConfigByModuleName('daily.title').timeStampIntervalPage||30500;
		WeeklyRating.loadData(weeklyRate, WeeklyRating.loadDataCallBack);
		//每隔3分钟，重新查询一次最新数据并显示
		weeklyRate.intervalQuery = setInterval(function() {
			WeeklyRating.loadData(weeklyRate, WeeklyRating.loadDataCallBack);
		}, 180000);
		return weeklyRate;
	},
	loadDataCallBack: function(weeklyRateArray, weeklyRate) {
		weeklyRate.weeklyRateArray = weeklyRateArray;
		WeeklyRating.displayWeeklyRatingDatas(weeklyRate);
	},
	loadData: function(weeklyRate, callback) {
//    	var loadCallback = function(resp) {
//            var weeklyRateArray = [];
//            if(resp.code != 0){
//            	return;
//            }
//            var weeklyRateArray = [];
//            $(resp.data.result).each(function(index, row) {
//            	if(index > 9){
//            		return;
//            	}
//                weeklyRateArray.push(row);
//            });
//            if (callback && typeof callback == 'function') {
//                callback(weeklyRateArray, weeklyRate);
//            }
//        };
        
    	CentralProxy.getExcel("audienceRating", function(resp){ 		
    		if(callback && typeof callback == 'function'){
    			callback(resp, weeklyRate);
    		}
    	});
    	//假数据
//        var resp = {
//        		"message": "处理成功",
//        		"data": {
//        			"result": [{
//        				"commentNum": 1.057,
//        				"rank": 2,
//        				"rankTime": "21.50-23.17",
//        				"nickName": "非凡搭档",
//        				"dataChangeRate": -1,
//        				"dataChangeMarket": -1,
//        				"weekday": "周五",
//        				"marketCount": 4.474
//        			}, {
//        				"commentNum": 0.923,
//        				"rank": 3,
//        				"rankTime": "20.22-21.52",
//        				"dataChangeRate": -1,
//        				"dataChangeMarket": -1,
//        				"nickName": "盖世英雄",
//        				"weekday": "周日",
//        				"marketCount": 2.708
//        			}, {
//        				"commentNum": 0.92,
//        				"rank": 3,
//        				"rankTime": "21.58-23.17",
//        				"dataChangeRate": 1,
//        				"dataChangeMarket": -1,
//        				"nickName": "说出我世界",
//        				"weekday": "周日",
//        				"marketCount": 4.192
//        			}, {
//        				"commentNum": 0.707,
//        				"rank": 3,
//        				"rankTime": "21.45-23.05",
//        				"dataChangeRate": 1,
//        				"dataChangeMarket": 1,
//        				"nickName": "星厨驾到",
//        				"weekday": "周二",
//        				"marketCount": 2.853
//        			}, {
//        				"commentNum": 0.413,
//        				"rank": 5,
//        				"rankTime": "21.52-22.48",
//        				"dataChangeRate": -1,
//        				"dataChangeMarket": -1,
//        				"nickName": "老妈驾到",
//        				"weekday": "周三、周四",
//        				"marketCount": 1.697
//        			}],
//        			"totalCount": 5
//        		},
//        		"code": "0"
//        	};
//        loadCallback(resp);
	},
	processData: function(weeklyRate) {
    	if(!weeklyRate.weeklyRateArray) {
			return;
		}
    	//卫视频道
    	var weeklyInnovationOriginal = []; 
//    	var weeklyBrandOriginal = [];
//    	//城市频道
//    	var weeklyCityInnovationOriginal = []; 
//    	var weeklyCityBrandOriginal = [];
//    	//影视频道
//    	var weeklyMovieInnovationOriginal = []; 
//    	var weeklyMovieBrandOriginal = [];
//    	
    	weeklyRate.weeklyInnovationArray = [];
//    	weeklyRate.weeklyBrandArray = [];
//    	weeklyRate.weeklyCityInnovationArray = [];
//    	weeklyRate.weeklyCityBrandArray = [];
//    	weeklyRate.weeklyMovieInnovationArray = [];
//    	weeklyRate.weeklyMovieBrandArray = [];
    	
    	var sheetListInnovationData = weeklyRate.weeklyRateArray.result.sheetList[3];
//    	var sheetListBrandData = weeklyRate.weeklyRateArray.result.sheetList[4];
//    	var sheetCityListInnovationData = weeklyRate.weeklyRateArray.result.sheetList[5];
//    	var sheetCityListBrandData = weeklyRate.weeklyRateArray.result.sheetList[6];
//    	var sheetMovieListInnovationData = weeklyRate.weeklyRateArray.result.sheetList[7];
//    	var sheetMovieListBrandData = weeklyRate.weeklyRateArray.result.sheetList[8];
    	
    	if(weeklyRate.weeklyRateArray.result && sheetListInnovationData){   		
    		weeklyInnovationOriginal = sheetListInnovationData.rowList;
//    		weeklyBrandOriginal = sheetListBrandData.rowList;
//    		weeklyCityInnovationOriginal = sheetCityListInnovationData.rowList;
//    		weeklyCityBrandOriginal = sheetCityListBrandData.rowList;
//    		weeklyMovieInnovationOriginal = sheetMovieListInnovationData.rowList;
//    		weeklyMovieBrandOriginal = sheetMovieListBrandData.rowList;
    	}
    	for(var i = 1; i < weeklyInnovationOriginal.length; i++){
    		weeklyRate.weeklyInnovationArray.push(weeklyInnovationOriginal[i])
    	}
//    	for(var i = 1; i < weeklyBrandOriginal.length; i++){
//    		weeklyRate.weeklyBrandArray.push(weeklyBrandOriginal[i])
//    	}
//    	for(var i = 1; i < weeklyCityInnovationOriginal.length; i++){
//    		weeklyRate.weeklyCityInnovationArray.push(weeklyCityInnovationOriginal[i])
//    	}
//    	for(var i = 1; i < weeklyCityBrandOriginal.length; i++){
//    		weeklyRate.weeklyCityBrandArray.push(weeklyCityBrandOriginal[i])
//    	}
//    	for(var i = 1; i < weeklyMovieInnovationOriginal.length; i++){
//    		weeklyRate.weeklyMovieInnovationArray.push(weeklyMovieInnovationOriginal[i])
//    	}
//    	for(var i = 1; i < weeklyMovieBrandOriginal.length; i++){
//    		weeklyRate.weeklyMovieBrandArray.push(weeklyMovieBrandOriginal[i])
//    	}
//    	weeklyRate.columnMap = {};    	//按照sheetName分组 sheetName:对应数据
//    	var innovationName = sheetListInnovationData.sheetName;
//    	var brandName = sheetListBrandData.sheetName;
//    	var innovationCityName = sheetCityListInnovationData.sheetName;
//    	var brandCityName = sheetCityListBrandData.sheetName;
//    	var innovationMovieName = sheetMovieListInnovationData.sheetName;
//    	var brandMovieName = sheetMovieListBrandData.sheetName;
//    	weeklyRate.columnName = [innovationName, brandName, innovationCityName, brandCityName, innovationMovieName, brandMovieName];
//		weeklyRate.columnMap[innovationName] = weeklyRate.weeklyInnovationArray;
//		weeklyRate.columnMap[brandName] = weeklyRate.weeklyBrandArray;
//		weeklyRate.columnMap[innovationCityName] = weeklyRate.weeklyCityInnovationArray;
//		weeklyRate.columnMap[brandCityName] = weeklyRate.weeklyCityBrandArray;
//		weeklyRate.columnMap[innovationMovieName] = weeklyRate.weeklyMovieInnovationArray;
//		weeklyRate.columnMap[brandMovieName] = weeklyRate.weeklyMovieBrandArray;
    	
//		return weeklyRate.columnMap;
		
	},
	clearItems: function (callback, weeklyRate, currentPageArray) {
        if(weeklyRate.intervalShowOneByOne){
        	clearInterval(weeklyRate.intervalShowOneByOne);
        }
        var weeklyRateList = weeklyRate.options.container.find('.dailytitle-list');
        if (weeklyRateList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(weeklyRate, currentPageArray);
            }
            return;
        }
        weeklyRate.options.container.find('.dailytitle-list').jAnimate('fadeOutLeftBig').empty();
        if (callback && typeof callback == 'function') {
            callback(weeklyRate, currentPageArray);
        }
    },
	displayWeeklyRatingDatas: function(weeklyRate) {
		if (weeklyRate.intervalPage) {
            clearInterval(weeklyRate.intervalPage);
        }
		if (weeklyRate.intervalShowOneByOne) {
			clearInterval(weeklyRate.intervalShowOneByOne);
        }
		WeeklyRating.processData(weeklyRate);
		WeeklyRating.displaySelectedColumn(weeklyRate);
//		var weeklyRateListPane = weeklyRate.options.container.find('.dailytitle-list-pane'),
//			weeklyRateListHead = weeklyRate.options.container.find('.dailytitle-list-head'),
//			weeklyRateList = weeklyRate.options.container.find('.dailytitle-list');
//		var $orgSelect = $('#orgSel');
//		var $colSelect = $('#columnname');
//		$colSelect.change(function() {
//			if(weeklyRate.columnName != $(this).val()){
//				weeklyRate.columnName = $(this).val();
//				WeeklyRating.displaySelectedColumn(weeklyRate);
//			}
//		});
//			
//		if(!weeklyRate.notFirstRunFlag){
//			weeklyRate.notFirstRunFlag = true;
//			$colSelect.empty();
////			var nowaDay = new Date();
////			weeklyRateListHead.find('#daySel').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
//			weeklyRate.orgs = [{orgName: '卫视频道',columns: []},
//			                   {orgName: '城市频道',columns: []},
//			                   {orgName: '影视频道',columns: []}];
////			weeklyRate.columns = ['所有栏目']; //所有栏目的集合
//			//获取所有栏目的集合
//			
//			if(!weeklyRate.columnMap||weeklyRate.columnMap.length == 0){
////				var html = '<option>暂无</option>';
////				$(html).appendTo($select);
//				weeklyRateList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
//				return;
//			}
//			
//			for(var column in weeklyRate.columnName){
//				if( 1 >= column){
//					weeklyRate.orgs[0].columns.push(weeklyRate.columnName[column]);
//				} else if( 3 >= column) {
//					weeklyRate.orgs[1].columns.push(weeklyRate.columnName[column]);
//				} else {
//					weeklyRate.orgs[2].columns.push(weeklyRate.columnName[column]);
//				}
//			}		
//			if(weeklyRate.orgs[0].columns.length == 0) {
//				weeklyRateList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
//				return;
//			}
//			if(weeklyRate.orgs[1].columns.length == 0) {
//				weeklyRateList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
//				return;
//			}
//			if(weeklyRate.orgs[2].columns.length == 0) {
//				weeklyRateList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
//				return;
//			}
//			$orgSelect.empty().unbind('change');
//			for(var org in weeklyRate.orgs) {
//				+function(){
//					var html = '<option>' + weeklyRate.orgs[org].orgName + '</option>';
//					$(html).data('data', weeklyRate.orgs[org].columns).appendTo($orgSelect);
//				}();
//			}
//			$orgSelect.change(function(){
//				if(weeklyRate.orgName != $(this).val()){
//					weeklyRate.orgName = $(this).val();
//					var cols = $orgSelect.find('option:selected').data('data');
//					$colSelect.empty();
//					for(var column in cols) {
//						var html = '<option>' + cols[column] + '</option>';
//						$(html).appendTo($colSelect);
//					}
//					$colSelect.change();
//				}
//			});
//			$orgSelect.change();
//		}
	},
	
	displaySelectedColumn: function(weeklyRate){
//		if (weeklyRate.intervalPage) {
//            clearInterval(weeklyRate.intervalPage);
//        }
//		if (weeklyRate.intervalShowOneByOne) {
//			clearInterval(weeklyRate.intervalShowOneByOne);
//        }
//		weeklyRate.oldColumn = $('#columnname').val();	
		var copyArr = [];
		weeklyRate.titlePageArray = [];
//		if(weeklyRate.columnMap[weeklyRate.oldColumn]){
//			copyArr = weeklyRate.columnMap[weeklyRate.oldColumn].slice();
//		}
		copyArr = weeklyRate.weeklyInnovationArray.slice();
        while (copyArr.length) {
        	weeklyRate.titlePageArray.push(copyArr.splice(0, 5));
        }
        weeklyRate.titlePageArray = weeklyRate.titlePageArray.slice(0,2);
        weeklyRate.pageIndex = 0;
        if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
        	if(copyArr.length == 0){
        		WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, []);
    		}
            return;
        }
        var currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
        WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
        weeklyRate.pageIndex++;
        weeklyRate.intervalPage = setInterval(function () {
        	
            if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
            	if(weeklyRate.titlePageArray.length==0){
            		clearInterval(Bubble.intervalPage);
			    	return;
            	}else{
            		weeklyRate.pageIndex = 0;//从第一页重新开始展示
            	}
            }
            currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
            WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
            weeklyRate.pageIndex++;
        }, weeklyRate.options.timePerPage);//每页切换的时间
		

	},
	
	/**
     * 用于显示当前页的blogItem
     */
    appendItems: function (weeklyRate, currentPageArray) {
//    	var weeklyRateListPane = weeklyRate.options.container.find('.dailytitle-list-pane'),
//		weeklyRateListHead = weeklyRate.options.container.find('.dailytitle-list-head'),
//		weeklyRateList = weeklyRate.options.container.find('.dailytitle-list');
//		//显示方面的逻辑
//        if(currentPageArray.length == 0) {
//			weeklyRateList.append('<span>暂无数据</span>');
////			return;
//		}
////		var nowaDay = new Date();
////		weeklyRateListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
//
//		//根据栏目获取时间倒序排列
//		$(currentPageArray).each(function(index, row) {
//			var html = makeWeeklyRatingHtml(row);
//			weeklyRateList.append(html);
//		});
//
////		weeklyRateListPane.addClass('active', 1000, function() {
////			startShowOneByOne();
////		});
//		weeklyRateList.jAnimate('fadeInRightBig');
//		startShowOneByOne();
//

//		function startShowOneByOne() {
//			var $weeklyRateItems = weeklyRateList.find('.item');
//			var currentArrayIndex = 0;
//			$($weeklyRateItems[currentArrayIndex]).addClass('animated bounceInLeft active');
//			currentArrayIndex++;
//			weeklyRate.intervalShowOneByOne = setInterval(function() {
//				if(currentArrayIndex >= $weeklyRateItems.length) {
//					currentArrayIndex = 0;
//					if (weeklyRate.intervalPage) {
//			            clearInterval(weeklyRate.intervalPage);
//			        }
//					if (weeklyRate.intervalShowOneByOne) {
//						clearInterval(weeklyRate.intervalShowOneByOne);
//			        }
//					
//					if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
//						WeeklyRating.displaySelectedColumn(weeklyRate);
//						return;
//		            }				
//		            var currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
//		            WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
//		            weeklyRate.pageIndex++;
//					return;
//				}
//				if(weeklyRateList.find('.item.active').length > 0) {
//					var tempIndex = currentArrayIndex;
//					weeklyRateList.find('.item.active').removeClass('active');
//					$($weeklyRateItems[tempIndex]).addClass('animated bounceInLeft active');
//				} else {
//					$($weeklyRateItems[currentArrayIndex]).addClass('animated bounceInLeft active');
//				}
//				currentArrayIndex++;
//			}, weeklyRate.options.timePerOne);
//		}
//        WeeklyRating.appendFoot(weeklyRate);
		
		
        
        function makeAnalysisRateHtml(row) {
            var html = '<div class="item">\
				            <div class="data col-xs-10">\
				    			<div class="col-xs-4">\
            						<p class="name">非凡搭档</p>\
            						<p class="weekday">(周三)</p>\
            					</div>\
				           		<div class="col-xs-2">\
            						<span class="spread-count">0.207</span>\
            					</div>\
				           		<div class="col-xs-2">\
            						<span class="market-count">4.74</span>\
            					</div>\
            					<div class="col-xs-2">\
					            	<p class="ranking-no ">2</p>\
            					</div>\
				            	<div class="col-xs-2">\
				            		<p class="ranking">2</p>\
								</div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingRateClass;
            var raisingMarketClass;
//            switch (parseInt(row[3])) {
//			case 0:
//				raisingRateClass = "glyphicon-record";
//				break;
//			case 1:
//				raisingRateClass = "glyphicon-arrow-up";
//				break;
//			case -1:
//				raisingRateClass = "glyphicon-arrow-down";
//				break;
//			default:
//				break;
//			}
//            switch (parseInt(row[5])) {
//			case 0:
//				raisingMarketClass = "glyphicon-record";
//				break;
//			case 1:
//				raisingMarketClass = "glyphicon-arrow-up";
//				break;
//			case -1:
//				raisingMarketClass = "glyphicon-arrow-down";
//				break;
//			default:
//				break;
//			}
/*            var $raisingRateHtml = $(raisingRateHtml);
            var $raisingMarketHtml = $(raisingMarketHtml);*/
            $html.find('.name').text(row[1]);
            $html.find('.weekday').text("(" + row[3] + ")");
            $html.find('.spread-count').text(row[2]);
            $html.find('.market-count').text(row[4]);
            $html.find('.ranking-no').text(row[5]);
            $html.find('.ranking').text(row[0]);
//            $html.find('.rankTime').text(row[7]);
            $html.find('.raisingRateClass')
            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
            		.addClass(raisingRateClass);
            $html.find('.raisingMarketClass')
        	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
        		.addClass(raisingMarketClass);
           //添加二级详情数据
//        	var rateData = [];
//        	var marketData = [];
//        	for(var i = 0; i < row.length; i++){
//        		if(i>7 && i<15){
//        			rateData.push(row[i]);
//        		}
//        	}
//        	for(var i = 0; i < row.length; i++){
//        		if(i>14 && i<22){
//        			marketData.push(row[i]);
//        		}
//        	}
//            
//            
//			$html.click(function(){
//				EchartsShow.show({
//		            container: $('body'),
//		            data: {
//		            	rateData: rateData,
//		            	marketData: marketData
//		            }});
//			});
            return $html;
        };
    	
    	var listContainer = weeklyRate.options.container.find('.gallery-wechat-billboard');
    	listContainer.find('.pt-page').removeClass('pt-page-current');
//    	var titlePageArray = weeklyRate.titlePageArray;
    	var weeklyRateList = $('<div class="wechat-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
    	
    	if(weeklyRate.intervalShowOneByOne){
    		clearInterval(weeklyRate.intervalShowOneByOne);
    	}
    	if (currentPageArray.length == 0) {
            weeklyRateList.append('<span>暂无数据</span>');
//            return;
        }
        
    	
        $(currentPageArray).each(function(index, row) {
            var html = makeAnalysisRateHtml(row);
            weeklyRateList.append(html);
        });
        listContainer.append(weeklyRateList);
//        weeklyRateList.appendTo(listContainer);
        if(listContainer.children('div.pt-page').length>3){
        	listContainer.children('div.pt-page')[0].remove();
        }
        if(weeklyRate.pageTransitions){
        	weeklyRate.pageTransitions.stop();
        }
        var $pages = $('#pt-main').children('div.pt-page');
        var pgOpts = {
            	container : $('#pt-main'),
            	$pages : $pages,
    			animcursor : weeklyRate.options.animcursor,
    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
    			autoChange: false
    		};
        weeklyRate.pageTransitions = PageTransitions.createNew(pgOpts);
        weeklyRate.pageTransitions.init();
        weeklyRate.pageTransitions.nextPage(pgOpts.animcursor);
        startShowOneByOne();
        function startShowOneByOne() {
        	if(weeklyRate.intervalShowOneByOne){
            	clearInterval(weeklyRate.intervalShowOneByOne);
            }
            var $weeklyRateItems = weeklyRateList.find('.item');
            $weeklyRateItems.removeClass('active');
            var currentArrayIndex = 0;
            $($weeklyRateItems[currentArrayIndex]).addClass('active', 300);
            currentArrayIndex++;
            weeklyRate.intervalShowOneByOne = setInterval(function() {
                if (currentArrayIndex >= $weeklyRateItems.length) {
                    currentArrayIndex = 0;
                }
                if (weeklyRateList.find('.item.active').length > 0) {
                    var tempIndex = currentArrayIndex;
                    weeklyRateList.find('.item.active').removeClass('active', 100, function() {
                        $($weeklyRateItems[tempIndex]).addClass('active', 200);
                    });
                } else {
                    $($weeklyRateItems[currentArrayIndex]).addClass('active', 200);
                }
                currentArrayIndex++;
            }, 3000);
        };
    },
		appendFoot : function (weeklyRate){
			var weeklyRateListFoot = $('.dailytitle-container').find('.dailytitle-list-foot');
			var	totalDatas = weeklyRate.columnClipMap[weeklyRate.oldColumn].length;	
			var totalPages = weeklyRate.titlePageArray.length;
			var currentPage = weeklyRate.pageIndex;
			var currentPageArray = [];
			weeklyRateListFoot.empty();
			var html = '共查询到<span class="dailyrundown-list-foot-count">'+totalDatas+'</span>条信息，共'+ totalPages +'页，当前第<span class="dailyrundown-list-foot-current">'+(currentPage+1)+'</span>页'+
  			  			'<a class="pagePrevious" href="javascript:void(0)"> 上一页</a>'+'<a class="pageNext" href="javascript:void(0)"> 下一页</a>'
	    	weeklyRateListFoot.append(html);
	    	
	    	$('.pagePrevious').click(function(){
	    		clearInterval(weeklyRate.intervalPage);
	    		weeklyRate.pageIndex= weeklyRate.pageIndex-2;
		        var currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
		        WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
		        weeklyRate.pageIndex++;
	            
		        weeklyRate.intervalPage = setInterval(function () {
		        	
		            if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
		            	if(weeklyRate.titlePageArray.length==0){
		            		clearInterval(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		weeklyRate.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
		            WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
		            weeklyRate.pageIndex++;
		        }, weeklyRate.options.timePerPage);//每页切换的时间
	    	})
	    	$('.pageNext').click(function(){
	    		clearInterval(weeklyRate.intervalPage);
	    		if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
	    			weeklyRate.pageIndex = 0;
	            }
		        var currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
		        WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
		        weeklyRate.pageIndex++;
	            
		        weeklyRate.intervalPage = setInterval(function () {
		        	
		            if (weeklyRate.pageIndex >= weeklyRate.titlePageArray.length) {
		            	if(weeklyRate.titlePageArray.length==0){
		            		clearInterval(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		weeklyRate.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = weeklyRate.titlePageArray[weeklyRate.pageIndex].slice();
		            WeeklyRating.clearItems(WeeklyRating.appendItems, weeklyRate, currentPageArray);
		            weeklyRate.pageIndex++;
		        }, weeklyRate.options.timePerPage);//每页切换的时间
	    	})	 
	    	if(weeklyRate.pageIndex == (totalPages-1)){
	    		$('a.pageNext').removeAttr("href");
	    		$('a.pageNext').unbind("click")
	    	}
	    	if(weeklyRate.pageIndex == 0){
	    		$('a.pagePrevious').removeAttr("href");
	    		$('a.pagePrevious').unbind("click")
	    	}
		}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	WeeklyRating.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
});

