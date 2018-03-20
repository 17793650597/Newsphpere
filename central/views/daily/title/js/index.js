/**
 * 今日报道页面
 */
var DailyTitle = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytitle-container'),
			session : JSON.parse(localStorage.getItem('nova.central.session')),
			whichVersion: true,
            searchParamNova: {
                "firstRowNum": 0,
                "maxResults": 30,
                "fullText": "",
                "searchGroup": {
                    "operator": "AND",
                    "attributeConditionList": [
                        {
                            "attributeDefID": "assetcategoryid",
                            "comparator": "EQ",
                            "value": "title"
                        },
                        {
                            "attributeDefID": "editstatus",
                            "comparator": "GE",
                            "value": "0"
                        },
                        {
                            "attributeDefID": "deletedflag",
                            "comparator": "EQ",
                            "value": 0
                        },
                        {
							"attributeDefID": "creationdate",
							"comparator": "BETWEEN",
							"value": '',
							"anotherValue":'' 
						}
                    ],
                    "searchGroupList": [{
            			"operator": "OR",
            			"attributeConditionList": [],
            			"searchGroupList": []
            		}]
                },
                "orderList": [
                    {
                        "attributeDefID": "creationdate",
                        "desc": true
                    }
                ]
            },
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
        			},{
                        'extraData.editStatus': {
//                            'IN': ['LIBRARY','DRAFT','SUBMIT']
                        		'IN': ['LIBRARY']
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
    	var title = ModuleConfigHelper.getConfigByModuleName('ns.daily.title').title || '今日报道';
    	$('.area-title').html(title);
//		//温岭假数据开始
//		$.ajax({
//			url: './js/data.json',
//			method: 'POST',
//			success: function(resp){
//				callback(JSON.parse(resp), dailyTitle);
//			}
//		})
		//温岭假数据结束
		
		var isComb = ModuleConfigHelper.getConfigByModuleName('ns.daily.clue').queryUrl.indexOf("comb");//comb
		if(isComb == -1){
			dailyTitle.options.whichVersion = false;
		}else if(isComb != -1){
			dailyTitle.options.whichVersion = true;
		}
		if(dailyTitle.options.whichVersion){
			var list = dailyTitle.options.searchParamNs.group.allOf;
			for(var i in list){
	        	if(list[i].createdTime){
	        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
	        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
	        		list[i].createdTime.BTW[0] = startTime;
	        		list[i].createdTime.BTW[1] = endTime;
	        	}
	        }
	    	CentralProxy.searchComb(dailyTitle.options.searchParamNs, function (resp) {
	    		callback(JSON.parse(resp), dailyTitle);
	    	}, null);
		}else{
//			var perm = dailyTitle.options.searchParamNova.searchGroup.searchGroupList[0].attributeConditionList;
//	    	$(dailyTitle.options.session.joinedGroups).each(function(index, item){
//	    		perm.push({"attributeDefID": "column_acl",
//					"comparator": "EQ",
//					"value": item.groupId});
//	    	});
			var lst = dailyTitle.options.searchParamNova.searchGroup.attributeConditionList;
			for(var i in lst){
	        	if(lst[i].attributeDefID == 'creationdate'){
//	        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
	        		var startTime = Utils.parseTime(new Date().getTime()-259200000, 'y-m-d', true) + 'T00:00:00Z';
	        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
	        		lst[i].value = startTime;
	        		lst[i].anotherValue = endTime;
	        	}
	        }
	        CentralProxy.search(dailyTitle.options.searchParamNova, function (resp) {
	            if(callback && typeof callback == 'function') {
					callback(resp, dailyTitle);
				}
	        }, null, true);
		}
		
        
	},

	processData: function(dailyTitle) {
		if(!dailyTitle.dailyTitleJson) {
			return;
		}
		if(dailyTitle.options.whichVersion){
			dailyTitle.dailyTitleArray = dailyTitle.dailyTitleJson.items;		
		}else{
			var assetList = dailyTitle.dailyTitleJson.result.assetList;
			dailyTitle.dailyTitleArray = [];
			for(var i in assetList){
				var assets = AssetHelper.toAttributeValueMap(assetList[i].attributeList);
				dailyTitle.dailyTitleArray.push(assets);
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
//			var html = '<div class="item">\
//				<div class="item-left">\
//					<span class="dailytitle-title">11</span>\
//					<span class="time">22</span>\
//					<span class="author">33</span>\
//				</div>\
//				<div class="stage">\
//					<div class="stage-1"><span class="stage-text">采访</span><span class="bottom-line"></span></div>\
//					<div class="stage-2"><span class="stage-text">审稿</span><span class="bottom-line"></span></div>\
//					<div class="stage-3"><span class="stage-text">剪辑</span><span class="bottom-line"></span></div>\
//					<div class="stage-4"><span class="stage-text">审片</span><span class="bottom-line"></span></div>\
//					<div class="stage-5"><span class="stage-text">送播</span><span class="bottom-line"></span></div>\
//				</div>\
//			</div>';
//			var $html = $(html);
//			$html.find('.dailytitle-title').text(row.name || row.assetname);
//			$html.find('.author').text(row.createdby);
//			$html.find('.time').text(row.creationdate.substring(10,19));			
////			//TODO 当前报道阶段暂时假数据
//			var captions = ["写稿", "退稿", "通过", "配音", "字幕", "审片退回", "审片通过"];
//			row.caption = captions[Math.floor(Math.random()*7)];
//			switch(row.caption) {
//				case "写稿":
//					$html.find('.stage-1').addClass("done");
//					break;
//				case "退稿":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("undone");
//					break;
//				case "通过":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					break;
//				case "配音":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					break;
//				case "字幕":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					$html.find('.stage-4').addClass("done");
//					break;
//				case "审片退回":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					$html.find('.stage-4').addClass("done");
//					$html.find('.stage-5').addClass("undone");
//					break;
//				case "审片通过":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					$html.find('.stage-4').addClass("done");
//					$html.find('.stage-5').addClass("done");
//					break;
//				default:
//					break;
//			}		
			//以下为 未合并重庆分支之前主版本,贵州版本
//			var html = '<div class="item">\
//				<div class="ranking">\
//					<div class="ranking-card">\
//					</div>\
//				</div>\
//				<div class="item-left" style="left: 10%;">\
//					<span class="dailytitle-title">11</span>\
//				</div>\
//				<div class="stage li-marquee">\
//						<span class="stage-text">融媒体新闻中心</span>\
//				</div>\
//			</div>';
//			var $html = $(html);
//			switch((row.extraData && row.extraData.target) || row.target){
//				case "微信":
//					$html.find('.stage-text').text("微信报道");
//					break;
//				case "微博":
//					$html.find('.stage-text').text("微博报道");
//					break;
//				case "电视":
//					$html.find('.stage-text').text((row.extraData && row.extraData.columnName) || row.columnname);
//					break;
//				case "APP":
//					$html.find('.stage-text').text("App报道");
//					break;
//				default:
//					break;
//			}
//			$html.find('.dailytitle-title').text(row.name || row.assetname);
			
			//以下是气象局节点数据，包括对接ns2.0系统
//			var html = '<div class="item">\
//				<div class="item-left" style="left: 0%;">\
//					<span class="dailytitle-title">11</span>\
//					<span class="time">22</span>\
//				</div>\
//				<div class="stage">\
//					<div class="stage-1"><span class="stage-text">写稿</span><span class="bottom-line"></span></div>\
//					<div class="stage-2"><span class="stage-text">审核</span><span class="bottom-line"></span></div>\
//					<div class="stage-3"><span class="stage-text">入库</span><span class="bottom-line"></span></div>\
//					<div class="stage-4"><span class="stage-text">剪辑</span><span class="bottom-line"></span></div>\
//					<div class="stage-5"><span class="stage-text">审片</span><span class="bottom-line"></span></div>\
//					<div class="stage-6"><span class="stage-text">送播出</span><span class="bottom-line"></span></div>\
//				</div>\
//			</div>';
//			var $html = $(html);
//			$html.find('.dailytitle-title').text(row.name || row.assetname);
//			//$html.find('.author').text(row.createdby || row.createdBy);
//			$html.find('.time').text((row.createdTime && row.createdTime.formatDate('yyyy-MM-dd')) || row.creationdate.substring(0,19));
//			for(var i in row.activityInfos){
//				row.othersystemstatus = row.activityInfos[i].activityDefineName;
//			}
////			//ns系统节点节目编辑，一审，二审，三审，入报道库，SUBMIT DRAFT LIBRARY
//			if(row.othersystemstatus && row.othersystemstatus.indexOf("节目编辑") > -1) {
//				$html.find('.stage-1').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("一审") > -1) {
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("二审") > -1) {
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("三审") > -1){
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("入报道库") > -1) {
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//				$html.find('.stage-3').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("剪辑") > -1){
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//				$html.find('.stage-3').addClass("done");
//				$html.find('.stage-4').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("审片") > -1){
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//				$html.find('.stage-3').addClass("done");
//				$html.find('.stage-4').addClass("done");
//				$html.find('.stage-5').addClass("done");
//			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("送演播室") > -1){
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//				$html.find('.stage-3').addClass("done");
//				$html.find('.stage-4').addClass("done");
//				$html.find('.stage-5').addClass("done");
//				$html.find('.stage-6').addClass("done");
//			}else if(row.extraData.editStatus && row.extraData.editStatus == "LIBRARY"){
//				$html.find('.stage-1').addClass("done");
//				$html.find('.stage-2').addClass("done");
//				$html.find('.stage-3').addClass("done");
//			}else{
//			
//			}			
			//nova流程展示
//			var html = '<div class="item">\
//							<div class="item-left">\
//								<span class="dailytitle-title">11</span>\
//								<span class="time">22</span>\
//								<span class="author">33</span>\
//							</div>\
//							<div class="stage">\
//								<div class="stage-1"><span class="stage-text">写稿</span><span class="bottom-line"></span></div>\
//								<div class="stage-2"><span class="stage-text">审稿</span><span class="bottom-line"></span></div>\
//								<div class="stage-3"><span class="stage-text">入库</span><span class="bottom-line"></span></div>\
//								<div class="stage-4"><span class="stage-text">配音</span><span class="bottom-line"></span></div>\
//							</div>\
//						</div>';
//			var $html = $(html);
//			$html.find('.dailytitle-title').text(row.name || row.assetname);
//			$html.find('.author').text(row.createdby);
//			$html.find('.time').text(row.creationdate.substring(10,19));			
//			switch(row.editstatus) {
//				case "0":
//					$html.find('.stage-1').addClass("done");
//					break;
//				case "1":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					break;
//				case "2":
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					break;
//				default:
//					break;
//			}	
//			if(row.othersystemstatus && (row.othersystemstatus.indexOf("已送配音") > -1 || row.othersystemstatus.indexOf("配音完成") > -1)) {
//					$html.find('.stage-1').addClass("done");
//					$html.find('.stage-2').addClass("done");
//					$html.find('.stage-3').addClass("done");
//					$html.find('.stage-4').addClass("done");
//			}
			
			//温岭台报道样式
			var html = '<div class="item wenling">\
							<div class="ranking">\
								<div class="ranking-card">\
									<div class="ranking-card-inner"></div>\
								</div>\
							</div>\
							<div class="item-left">\
								<span class="dailytitle-title">11</span>\
								<span class="col">新闻综合频道</span>\
							</div>\
							<div class="stage">\
								<span class="author">22</span>\
								<span class="time">22</span>\
							</div>\
						</div>';
			var $html = $(html);
			$('.dailytitle-list-head').addClass('wenling');
			$html.find('.dailytitle-title').text(row.name || row.assetname);
			$html.find('.col').text(row.extraData && row.extraData.columnName || '');
			$html.find('.author').text(row.createdby || row.createdBy);
//			$html.find('.time').text((row.createdTime && row.createdTime.formatDate('yyyy-MM-dd hh:mm:ss')) || row.creationdate.substring(0,19));
			//随机时间
			var timeNew = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
			var h = new Date().getHours() - Math.ceil(10*Math.random());
			h = h <= 0 ? Math.abs(h) : h;
			h= h >= 10 ? h : ('0' + h);
			var i = new Date().getMinutes() - Math.ceil(60*Math.random());
			i = i <= 0 ? Math.abs(i) : i; 
			i = i >= 10 ? i : ('0' + i);
			var s = Utils.parseTime(new Date().getTime(), 's', true);
			timeNew = timeNew + " " + h + ":" + i + ":" + s;
			$html.find('.time').text(timeNew);
			
			for(var i in row.activityInfos){
				row.othersystemstatus = row.activityInfos[i].activityDefineName;
			}
			//ns系统节点节目编辑，一审，二审，三审，入报道库，SUBMIT DRAFT LIBRARY
			if(row.othersystemstatus && row.othersystemstatus.indexOf("节目编辑") > -1) {
				$html.find('.stage-1').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("一审") > -1) {
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("二审") > -1) {
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("三审") > -1){
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("入报道库") > -1) {
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
				$html.find('.stage-3').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("剪辑") > -1){
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
				$html.find('.stage-3').addClass("done");
				$html.find('.stage-4').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("审片") > -1){
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
				$html.find('.stage-3').addClass("done");
				$html.find('.stage-4').addClass("done");
				$html.find('.stage-5').addClass("done");
			}else if(row.othersystemstatus && row.othersystemstatus.indexOf("送演播室") > -1){
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
				$html.find('.stage-3').addClass("done");
				$html.find('.stage-4').addClass("done");
				$html.find('.stage-5').addClass("done");
				$html.find('.stage-6').addClass("done");
			}else if(row.extraData && row.extraData.editStatus && row.extraData.editStatus == "LIBRARY"){
				$html.find('.stage-1').addClass("done");
				$html.find('.stage-2').addClass("done");
				$html.find('.stage-3').addClass("done");
			}else{
			
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
