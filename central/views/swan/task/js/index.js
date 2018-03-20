/**
 * 节目译制任务监控
 * 改页面需要进行的配置信息 baseURL--swan的跟路径
 */
var DailyTitle = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytitle-container'),
            searchParamNs:{
	    		"group": {
	    			"allOf": [{
	    				"categoryType": {
	    					"IN": ["TYPE_AVIDEO","TYPE_AUDIO"]
	    				}
	    			}, {
        				"activityInfos": {
        					"NOTNULL": []
        				}
        			}, ]
	    		},
	    		"orders": [{
	    			"createdTime": "DESC"
	    		}],
	    		"start": 0,
	    		"limit": 9     	
	        }
		};
		var dailyTitle = {};
		dailyTitle.options = $.extend(true, opts_default, opts);
		
		//调用接口的登录
		var loginParam = {"principal":"libing","password":"libing","principalType":"UserID","hostName":"bs unknown","appName":"nsite web console","rememberMe":false}
		CentralProxy.loginSwan(loginParam, function (resp) {
    		if(resp.sessionId){
    			dailyTitle.sessionId = resp.sessionId;
    			DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
    		}
    	}, null);
		//每隔10分钟，重新查询一次最新数据并显示
		dailyTitle.intervalQuery = setInterval(function() {
			//清除原有的定时展示任务 dailyTitle.intervalPage
			if(dailyTitle.intervalPage){
				window.clearTimeout(dailyTitle.intervalPage);
			}
			DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
		}, 600000);
		return dailyTitle;
	},
	//callback 就是 loadDataCallBack
	loadData: function(dailyTitle, callback) {
			var extra = {};
			if(dailyTitle.sessionId){
				extra.sid = dailyTitle.sessionId;
				CentralProxy.findSwanMobjects(dailyTitle.options.searchParamNs, function (resp) {
		    		callback(resp, dailyTitle);
		    	}, extra);
			}
		
	},
	loadDataCallBack: function(moQueryResult, dailyTitle) {//dailyTitleJson--查询的流程数据结果
		dailyTitle.moQueryResult = moQueryResult;
		DailyTitle.processData(dailyTitle);
	},
	//处理查询的数据过程
	processData: function(dailyTitle) {
		if(!dailyTitle.moQueryResult) {
			return;
		}
		/**
		 *
		 * dailyTitleArray 里面的对象有两个属性，
		 * name流程的名字 对应的就是资产的名字
			captions 里面是每个节点对象的数组，节点对象有state和activityTemplateName属性表示状态和节点名称
		 */
		var prosArr = [];
		for(var i = 0;i < dailyTitle.moQueryResult.items.length; i++){
			var item = dailyTitle.moQueryResult.items[i];
			if(item.activityInfos != undefined && item.activityInfos != null){
				var proTmp = {};
				var actTmp = {};
				proTmp.captions = [];
				proTmp.name = item.name;
				for(act in item.activityInfos){
					actTmp = item.activityInfos[act];
					proTmp.captions.push({
						state:actTmp.state,
						activityDefineName:actTmp.activityDefineName
					});
				}
				prosArr.push(proTmp);
			}
		}
		dailyTitle.moQueryResult = null;
		console.log(prosArr);
		dailyTitle.processInstanceArray = prosArr;
		DailyTitle.displaySelectedColumn(dailyTitle);
	},
	displaySelectedColumn: function(dailyTitle){
		var copyArr = dailyTitle.processInstanceArray.slice();
		//一个二维数组，里面是三个一组的流程信息数据
		dailyTitle.titlePageArray = [];
        while (copyArr.length) {
        	dailyTitle.titlePageArray.push(copyArr.splice(0, 3));
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
            }
            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
            dailyTitle.pageIndex++;
        }, 10000);//每页切换的时间
	},
	//callback就是appendItems，currentPageArray应该是当页显示的数据数组
	//清除现有页面数据
	clearItems: function (callback, dailyTitle, currentPageArray) {
        var dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
        if (dailyTitleList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(dailyTitle, currentPageArray);
            }
            return;
        }
//        dailyTitle.options.container.find('.dailytitle-list-pane').removeClass('active');
        dailyTitle.options.container.find('.dailytitle-list-pane').hide();
		dailyTitle.options.container.find('.dailytitle-list').empty();
        if (callback && typeof callback == 'function') {
            callback(dailyTitle, currentPageArray);
        }
    },
	//向页面添加数据的过程
    appendItems: function (dailyTitle, currentPageArray) {
    	var dailyTitleListPane = dailyTitle.options.container.find('.dailytitle-list-pane'),
		dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
		//显示方面的逻辑
        if(currentPageArray.length == 0) {
			dailyTitleList.append('<span>暂无数据</span>');
			return;
		}
		$(currentPageArray).each(function(index, row) {
			var html = makeDailyTitleHtml(row);
			dailyTitleList.append(html);
		});

//		dailyTitleListPane.addClass('active');
		dailyTitleListPane.fadeIn("fast");
		dailyTitleListPane.addClass('pt-page-flipInBottom').show();
		
		function makeDailyTitleHtml(row) {
			//初始化流程的相关信息，顺序也是按这个展示
			var captions = [
						{name:"开始",className:"fa fa-volume-control-phone"},
						{name:'云提词',className:"fa fa-cloud"},
						{name:"任务分配",className:"fa fa-tasks"},
						{name:"听抄",className:"fa fa-bullhorn"},
						{name:"校对",className:"fa fa-check-square-o"},
						{name:"翻译",className:"fa fa-pencil-square-o"},
						{name:"校译",className:"fa fa-check-circle"},
//						{name:"剧本打印",className:"fa fa-print"},
						{name:"导演审听",className:"fa fa-video-camera"},
						{name:"演员审听",className:"fa fa-user"},
//						{name:"配音",className:"fa fa-microphone"},
//						{name:"初审",className:"fa fa-search"},
//						{name:"合成",className:"fa fa-file-image-o"},
//						{name:"片头片尾制作",className:"fa fa-file-video-o"},
//						{name:"缩编",className:"fa fa-pencil"},
//						{name:"审核",className:"fa fa-check"},
//						{name:"成品节目发布",className:"fa fa-share-alt"},
//						{name:"媒资归档",className:"fa fa-folder-o"}
						{name:'录音',className:"fa fa-microphone"},
						{name:'入CMS',className:"fa fa-share-alt"},
						{name:'入七彩云',className:"fa fa-share"},
						{name:'结束',className:"fa fa-folder-o"}
						];
			//html拼接
			var html = '';
			var Head = '<div class="item">\
				<div class="item-left">\
					<span class="dailytitle-title">11</span>\
				</div>\
				<div class="stage">';
			var Tail = '</div>\
					</div>';
			var Body = '';
			html += Head;
			for(var i = 0; i < captions.length; i++){
				var index = i+1;
				//追加换行
				if(index % 7 == 1){
					if(parseInt(index/7) == 0){
						html = html + '<div class="line">'
					}else if(parseInt(index/7) == 1){
						html = html + '<div class="line line2">'
					}
				}
				var workItem = '<div class="outline stage-' + index + '">\
									<div class="outer">\
										<div class="middle">\
											<div class="inner">\
												<i class="' + captions[i].className + '"></i>\
											</div>\
										</div>\
									</div>\
									<span class="bottom-line"></span>\
									<span class="stage-text">' + captions[i].name + '</span>\
								</div>'
				html += workItem;
				if(index %7 == 0){
					html += '</div>';
				}
			}
			if(captions.length %7 != 0){
				html+='</div>';
			}
			html += Tail;
			var $html = $(html);
			//信息和效果
			$html.find('.dailytitle-title').text(row.name || row.assetname);
			//防止要改为显示多个running状态的，所以先不改row的数据结构了
			var runNodeName = '';
			for(var j = 0; j < row.captions.length; j++){
				if(row.captions[j].state == 'Running'){
					runNodeName = row.captions[j].activityDefineName;
					break;
				}
			}
			var sIndex = -1;
			if(runNodeName != ''){
				for(var z=0; z<captions.length; z++){
					if(captions[z].name == runNodeName){
						sIndex = z+1;
						break;
					}
				}
			}
			if(sIndex!=-1){
				for(var n=0; n<sIndex-1; n++){
					$html.find('.stage-'+(n+1)).addClass('done');
				}
				$html.find('.stage-'+sIndex).addClass('undone');
			}
			return $html;
		}
    }
};

$(function() {
//	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyTitle.createNew();
});
