/**
 * 今日报道页面
 */
var DailyTitle = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytitle-container'),
			session : JSON.parse(localStorage.getItem('nova.central.session')),
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
//		时政·新闻    新闻镇江 晚安镇江 镇江故事 新闻相对论 地产风云
//		社会·民生    看见大市口 法治进行时 一起镇江 健康保和堂 小梁帮你忙
//		财经·生活    资讯播报 老戴维权 城市财经 走进新区 今日丹徒
//		FM104新闻  政风行风热线 锐关注 锐观点
//		FM88.8交通  阳光方向盘 人车路 嗨歌总动员
//		FM96.3音乐  城市分贝 八点最来势 一路向远飞
//		FM94健康   空中门诊 梨园漫步 月光物语
//		FM90.5城市  早安镇江 905爱家计划 潮人音乐馆
//		FM102.7私家车 car们一起来 私家车乐怀旧 私家车乐动听
		var data = {
			"时政·新闻":["新闻镇江","晚安镇江","镇江故事","新闻相对论","地产风云"],
			"社会·民生":["看见大市口","法治进行时","一起镇江","健康保和堂","小梁帮你忙"],
			"财经·生活":["资讯播报","老戴维权","城市财经","走进新区","今日丹徒"],
			"FM104新闻":["政风行风热线","锐关注","锐观点"],
			"FM88.8交通":["阳光方向盘","人车路","嗨歌总动员"],
			"FM96.3音乐":["城市分贝","八点最来势","一路向远飞"],
			"FM94健康":["空中门诊","梨园漫步","月光物语"],
			"FM90.5城市":["早安镇江","905爱家计划","潮人音乐馆"],
			"FM102.7私家车":["car们一起来","私家车乐怀旧","私家车乐动"],
		}
        if(callback && typeof callback == 'function') {
			callback(data, dailyTitle);
		}
		
        
	},

	processData: function(dailyTitle) {
		if(!dailyTitle.dailyTitleJson) {
			return;
		}
		dailyTitle.dailyTitleArray = dailyTitle.dailyTitleJson;		
		dailyTitle.column = [];
		for(var i in dailyTitle.dailyTitleJson){
			dailyTitle.column.push(i)
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
		dailyTitle.titlePageArray = dailyTitle.dailyTitleArray;;
        dailyTitle.pageIndex = 0;
        if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
            return;
        }
        var currentPageArray = dailyTitle.titlePageArray;
        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
        dailyTitle.pageIndex++;
        dailyTitle.intervalPage = setInterval(function () {
            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
                dailyTitle.pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = dailyTitle.titlePageArray;
            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
            dailyTitle.pageIndex++;
        }, 27500);//每页切换的时间
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
		//根据栏目获取时间倒序排列
//		for(var i =0)
		for(var i in currentPageArray){
			var html = makeDailyTitleHtml(i, currentPageArray[i]);
			dailyTitleList.append(html);
		}
//		$(currentPageArray).each(function(index, row) {
//			var html = makeDailyTitleHtml(row);
//			dailyTitleList.append(html);
//		});

		dailyTitleListPane.addClass('pt-page-flipInBottom').show();
		startShowOneByOne();
		function makeDailyTitleHtml(i,row) {
	
			//以下为 未合并重庆分支之前主版本,贵州
			var html = '<div class="item">\
				<div class="ranking">\
					<div class="ranking-card">\
					</div>\
				</div>\
				<div class="item-left" style="left: 10%;">\
					<span class="dailytitle-title"></span>\
				</div>\
				<div class="stage li-marquee">\
						<span class="stage-text1 width-control"></span>\
						<span class="stage-text2 width-control"></span>\
						<span class="stage-text3 width-control"></span>\
						<span class="stage-text4 width-control"></span>\
						<span class="stage-text5 width-control"></span>\
				</div>\
			</div>';
			var $html = $(html);
			$html.find('.dailytitle-title').text(i);
			$html.find('.stage-text1').text(row[0]);
			$html.find('.stage-text2').text(row[1]);
			$html.find('.stage-text3').text(row[2]);
			$html.find('.stage-text4').text(row[3]);
			$html.find('.stage-text5').text(row[4]);
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
				}
				if(dailyTitleList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					dailyTitleList.find('.item.active').removeClass('active', 100, function() {
						$($dailyTitleItems[tempIndex]).addClass('active',200);
					});
				} else {
					$($dailyTitleItems[currentArrayIndex]).addClass('active', 200);
				}
				currentArrayIndex++;
				console.log(currentArrayIndex)
			}, 3000);
		}
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyTitle.createNew();
});
