/**
 * 今日报道页面
 */
var DailyTitle = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytitle-container'),
			session : JSON.parse(localStorage.getItem('nova.central.session')),
            searchParamNs:{
                "accessToken": "AVz4L4mXFQuaPjuKECKM",
                "timeStamp": 1509420936,
                "keyTime": "utime",
                "startTime":"",
                "endTime":"",
                "pageNum": 30,
                "currentPage": 1
            }
		};
		var dailyTitle = {};
		dailyTitle.options = $.extend(true, opts_default, opts);

		DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
		//每隔3分钟，重新查询一次最新数据并显示
		dailyTitle.intervalQuery = setInterval(function() {
			DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
		}, 180000);
		return dailyTitle;
	},

	loadDataCallBack: function(dailyTitleJson, dailyTitle) {
		dailyTitle.dailyTitleJson = dailyTitleJson;
		DailyTitle.displayDailyTitleDatas(dailyTitle);
	},

	loadData: function(dailyTitle, callback) {
    	var title = ModuleConfigHelper.getConfigByModuleName('ns.daily.create').title || '报道流';
    	$('.area-title').html(title);
//		var list = dailyTitle.options.searchParamNs.startTime;
		var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + ' 00:00:00';
		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + ' 23:59:59';
		dailyTitle.options.searchParamNs.startTime = startTime;
		dailyTitle.options.searchParamNs.endTime = endTime;
//		for(var i in list){
//        	if(list[i].createdTime){
//        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
//        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
//        		list[i].createdTime.BTW[0] = startTime;
//        		list[i].createdTime.BTW[1] = endTime;
//        	}
//        }
    	CentralProxy.getCreateFlow(dailyTitle.options.searchParamNs, function (resp) {
    		callback(JSON.parse(resp), dailyTitle);
    	}, null);
        
	},

	processData: function(dailyTitle) {
		if(!dailyTitle.dailyTitleJson) {
			return;
		}
		dailyTitle.dailyTitleArray = dailyTitle.dailyTitleJson.data.results;
		for(var i = 0; i < dailyTitle.dailyTitleArray.length; i++){
			var steps = dailyTitle.dailyTitleArray[i].steps;
			for(var j = steps.length-1; j >= 0; j--){
				if(steps[j].status == "finish"){
					dailyTitle.dailyTitleArray[i].status = steps[j].name;
					break;
				}
			}
		}
		DailyTitle.displaySelectedColumn(dailyTitle);
	},
	
	clearItems: function (callback, dailyTitle, currentPageArray) {
        if(dailyTitle.intervalShowOneByOne){
        	clearInterval(dailyTitle.intervalShowOneByOne);
        }
        var dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
        if (dailyTitleList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(dailyTitle, currentPageArray);
            }
            return;
        }
        dailyTitle.options.container.find('.dailytitle-list-pane').removeClass('active');
        setTimeout(function(){
    		dailyTitle.options.container.find('.dailytitle-list').empty();
            if (callback && typeof callback == 'function') {
                callback(dailyTitle, currentPageArray);
            }
    	}, 900);
    },

	displayDailyTitleDatas: function(dailyTitle) {
		var dailyTitleListPane = dailyTitle.options.container.find('.dailytitle-list-pane'),
			dailyTitleListHead = dailyTitle.options.container.find('.dailytitle-list-head'),
			dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
		
		DailyTitle.processData(dailyTitle);
//		
//		DailyTitle.displaySelectedColumn(dailyTitle);
	},
	
	displaySelectedColumn: function(dailyTitle){
		if (dailyTitle.intervalPage) {
            clearInterval(dailyTitle.intervalPage);
        }
		if (dailyTitle.intervalShowOneByOne) {
			clearInterval(dailyTitle.intervalShowOneByOne);
        }
//		dailyTitle.oldColumn = $('#columnname').val();
		var dailyTitleArrayNew = {};
		dailyTitleArrayNew["data"] = [];
		for(var i in dailyTitle.dailyTitleArray){
			dailyTitleArrayNew["data"].push(dailyTitle.dailyTitleArray[i])
		}
		var copyArr = dailyTitleArrayNew["data"].slice();
		dailyTitle.titlePageArray = [];
        while (copyArr.length) {
        	dailyTitle.titlePageArray.push(copyArr.splice(0, 10));
        }
        dailyTitle.pageIndex = 0;
        if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
            return;
        }
        var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
        dailyTitle.pageIndex++;
        dailyTitle.intervalPage = setInterval(function () {
            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
                dailyTitle.pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
            dailyTitle.pageIndex++;
        }, 30500);//每页切换的时间
	},
	
	/**
     * 用于显示当前页的blogItem
     */
    appendItems: function (dailyTitle, currentPageArray) {
    	var dailyTitleListPane = dailyTitle.options.container.find('.dailytitle-list-pane'),
		dailyTitleListHead = dailyTitle.options.container.find('.dailytitle-list-head'),
		dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
		//显示方面的逻辑
        if(currentPageArray.length == 0) {
			dailyTitleList.append('<span>暂无数据</span>');
			return;
		}
		var nowaDay = new Date();
		dailyTitleListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));

		//根据栏目获取时间倒序排列
		$(currentPageArray).each(function(index, row) {
			var html = makeDailyTitleHtml(row);
			dailyTitleList.append(html);
		});

		dailyTitleListPane.addClass('pt-page-flipInBottom').show();
		startShowOneByOne();
		function makeDailyTitleHtml(row) {
			//以下是随机状态数据
			var html = '<div class="item">\
				<div class="item-left">\
					<span class="dailytitle-title">11</span>\
					<span class="time">22</span>\
				</div>\
				<div class="stage">\
					<div class="stage-1"><span class="stage-text">创建</span><span class="bottom-line"></span></div>\
					<div class="stage-2"><span class="stage-text">编辑</span><span class="bottom-line"></span></div>\
					<div class="stage-3"><span class="stage-text">一审</span><span class="bottom-line"></span></div>\
					<div class="stage-4"><span class="stage-text">二审</span><span class="bottom-line"></span></div>\
					<div class="stage-5"><span class="stage-text">终审</span><span class="bottom-line"></span></div>\
					<div class="stage-6"><span class="stage-text">发布</span><span class="bottom-line"></span></div>\
				</div>\
			</div>';
			var $html = $(html);
			$html.find('.dailytitle-title').text(row.title);
//			$html.find('.author').text(row.userName);
			$html.find('.time').text(row.utime);			
//			//TODO 当前报道阶段暂时假数据
//			var captions = ["写稿", "退稿", "通过", "配音", "字幕", "审片退回", "审片通过"];
//			row.caption = captions[Math.floor(Math.random()*7)];
			switch(row.status) {
				case "创建":
					$html.find('.stage-1').addClass("done");
					break;
				case "编辑":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("undone");
					break;
				case "一审":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					break;
				case "二审":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					break;
				case "终审":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					$html.find('.stage-5').addClass("done");
					break;
				case "推送":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					$html.find('.stage-5').addClass("done");
					$html.find('.stage-6').addClass("done");
					break;
				default:
					break;
			}		

			$html.click(function(){
				DetailShow.show({
		            container: $('body'),
		            data: {
		            	title: row.name || row.assetname,
		            	time: (row.createdTime && row.createdTime.formatDate('yyyy-MM-dd hh:mm:ss')) || row.creationdate.substring(11,19),
		            	content: Utils.escapeHtml((row.extraData && row.extraData.content) || row.content),
		            	pics: []
		            }});
				});
				return $html;
			}

		function startShowOneByOne() {
			var $dailyTitleItems = dailyTitleList.find('.item');
			var currentArrayIndex = 0;
			$($dailyTitleItems[currentArrayIndex]).addClass('active', 300)
//			$($dailyTitleItems[currentArrayIndex]).addClass('active', 300,function(){
//				dailyTitleList.find('.item.active .li-marquee').liMarquee({
//					hoverstop: false,
//					scrollamount:90
//				});
//			});
			currentArrayIndex++;
//			dailyTitleList.find('.item.active .li-marquee').liMarquee({
//				hoverstop: false
//			});
			dailyTitle.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $dailyTitleItems.length) {
					currentArrayIndex = 0;
//					clearInterval(dailyTitle.intervalShowOneByOne);
//					
					if (dailyTitle.intervalPage) {
			            clearInterval(dailyTitle.intervalPage);
			        }
					if (dailyTitle.intervalShowOneByOne) {
						clearInterval(dailyTitle.intervalShowOneByOne);
			        }
					if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
						DailyTitle.displaySelectedColumn(dailyTitle);
						return;
		            }
//		            var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
//		            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
//		            dailyTitle.pageIndex++;
//					return;
				}
				if(dailyTitleList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					dailyTitleList.find('.item.active').removeClass('active', 100, function() {
//						dailyTitleList.find('.li-marquee').removeClass(' str_wrap noStop')
						$(this).find('.li-marquee').liMarquee('destroy');
						$($dailyTitleItems[tempIndex]).addClass('active',200);
//						$($dailyTitleItems[tempIndex]).addClass('active', 200,function(){
//							dailyTitleList.find('.item.active .li-marquee').liMarquee({
//								hoverstop: false,
//								scrollamount:90
//							});							
//						});
					});
				} else {
					$($dailyTitleItems[currentArrayIndex]).addClass('active', 200);
				}
				currentArrayIndex++;
//				dailyTitleList.find('.item.active .li-marquee').liMarquee({
//					hoverstop: false
//				});
			}, 3000);
		}
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyTitle.createNew();
});
