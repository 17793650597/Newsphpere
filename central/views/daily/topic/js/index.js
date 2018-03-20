/**
 * 今日报题页面
 */
var DailyTopic = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytopic-container'),
			whichVersion: true,
			searchParamNova:  {
				"firstRowNum": 0,
				"maxResults": 60,
				"fullText": "",
				"facet": {
					"limit": 30,
					"fieldList": [{
						"attributeDefID": "columnname"
					}]
				},
				"searchGroup": {
					"operator": "AND",
					"attributeConditionList": [{
							"attributeDefID": "assetcategoryid",
							"comparator": "EQ",
							"value": "topic"
						}, {
							"attributeDefID": "editstatus",
							"comparator": "EQ",
							"value": "2"
						}, {
							"attributeDefID": "deletedflag",
							"comparator": "EQ",
							"value": 0
						}/*{
							"attributeDefID": "creationdate",
							"comparator": "BETWEEN",
							"value": "2016-07-17T16:00:00Z",
							"anotherValue": "2016-07-18T15:59:59Z"
						}*/
					],
					"searchGroupList": []
				},
				"attributeDefIDList": ["moid", "assetname", "assetcategoryid", "editstatus", "creationdate", "submittime", "description", "content", "createdby", "thumbnailfileid", "videoflag", "audioflag", "picflag", "site", "tags", "refcount", "playcount", "platform", "channelpath", "columnname"],
				"orderList": [{
					"attributeDefID": "creationdate",
					"desc": true
				}]
			},
			searchParamNs:{
				"group": {
					"allOf": [{
						"categoryType": {
							"EQ": ["TYPE_TOPIC"]
						}
					}, {
						"extraData.editStatus": {
							"EQ": ["LIBRARY"]
						}
					}, {
						"deleteFlag": {
							"EQ": ["Normal"]
						}
					}]
				},
				"orders": [{
					"createdTime": "DESC"
				}],
				"facets": {
					"fields": [{
						"name": "extraData.platform"
					}, {
						"name": "extraData.site"
					}, {
						"name": "extraData.channel"
					}, {
						"name": "extraData.newsDomain"
					}, {
						"name": "tags"
					}]
				},
				"start": 0,
				"limit": 30
			}
		}
		var dailyTopic = {};
		dailyTopic.options = $.extend(true, opts_default, opts);

		DailyTopic.notFirstRunFlag = false;
		DailyTopic.loadData(dailyTopic);
		
		//每隔3分钟，重新查询一次最新数据并显示
		dailyTopic.intervalQuery = setInterval(function() {
			DailyTopic.loadData(dailyTopic);
		}, 180000);
		return dailyTopic;
	},
	displayAllPage: function(dailyTopic){
		if (dailyTopic.intervalPage) {
            clearInterval(dailyTopic.intervalPage);
        }
		var copyArr = dailyTopic.dailyTopicArray.slice();
		dailyTopic.topicPageArray = [];
        while (copyArr.length) {
        	dailyTopic.topicPageArray.push(copyArr.splice(0, 10));
        }
        dailyTopic.pageIndex = 0;
        if (dailyTopic.pageIndex >= dailyTopic.topicPageArray.length) {
            return;
        }
        var currentPageArray = dailyTopic.topicPageArray[dailyTopic.pageIndex].slice();
        DailyTopic.clearItems(DailyTopic.displayOnePage, dailyTopic, currentPageArray);
        dailyTopic.pageIndex++;
        if(dailyTopic.intervalPage){
        	clearInterval(dailyTopic.intervalPage);
        }
        dailyTopic.intervalPage = setInterval(function () {
            if (dailyTopic.pageIndex >= dailyTopic.topicPageArray.length) {
                dailyTopic.pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = dailyTopic.topicPageArray[dailyTopic.pageIndex].slice();
            DailyTopic.clearItems(DailyTopic.displayOnePage, dailyTopic, currentPageArray);
            dailyTopic.pageIndex++;
        }, 30500);//每页切换的时间
	},
	
	clearItems: function (callback, dailyTopic, currentPageArray) {
        if(dailyTopic.intervalShowOneByOne){
        	clearInterval(dailyTopic.intervalShowOneByOne);
        }
//        if (dailyTopic.intervalPage) {
//            clearInterval(dailyTopic.intervalPage);
//        }
        if (dailyTopic.intervalShowOne) {
            clearInterval(dailyTopic.intervalShowOne);
        }
        var dailyTopicList = dailyTopic.options.container.find('.dailytopic-list');
        if (dailyTopicList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(dailyTopic, currentPageArray);
            }
            return;
        }
        dailyTopic.options.container.find('.dailytopic-list-pane').removeClass('active');
        setTimeout(function(){
    		dailyTopic.options.container.find('.dailytopic-list').empty();
            if (callback && typeof callback == 'function') {
                callback(dailyTopic, currentPageArray);
            }
    	}, 1000);
    },

	displayOnePage: function(dailyTopic, currentPageArray) {
		var dailyTopicListPane = dailyTopic.options.container.find('.dailytopic-list-pane'),
			dailyTopicListHead = dailyTopic.options.container.find('.dailytopic-list-head'),
			dailyTopicList = dailyTopic.options.container.find('.dailytopic-list');

		dailyTopicListPane.removeClass('active', 1000, function() {
			dailyTopicList.empty();
			if(currentPageArray.length == 0) {
				dailyTopicList.append('<span>暂无数据</span>');
				return;
			}
			var nowaDay = new Date();
			dailyTopicListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));

			$(currentPageArray).each(function(index, row) {
				var html = makeDailyTopicHtml(row);
				html.click(function(){
					var data = row;
					DetailShow.show({
			            container: $('body'),
			            data: {
			            	title: data.assetname,
			            	time: data.submittime.substring(0,19),
			            	content: data.content,
			            	pics: [data.thumbnailfileid]
			            }});
				});
				dailyTopicList.append(html);
			});

			dailyTopicListPane.addClass('active', 1000, function() {
				startShowOneByOne();
			});

		});

		function makeDailyTopicHtml(row) {
			var html = '<div class="item">\
								<div class="item-top">\
									<span class="dailytopic-title"></span>\
									<span class="time"></span>\
									<span class="author"></span>\
									<span class="checker"></span>\
								</div>\
								<div class="stage">\
									<span class="stage-name"></span>\
									<span class="stage-icon glyphicon glyphicon-exclamation-sign"></span>\
								</div>\
							</div>';
			var $html = $(html);
			console.log(row);
			$html.find('.dailytopic-title').text(row.name || row.assetname);
			$html.find('.author').text( row.createdBy);
//			$html.find('.time').text((row.createdTime && row.createdTime.formatDate('yyyy-MM-dd hh:mm:ss')) || row.creationdate.substring(0, 19));
			$html.find('.checker').remove();
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
			
			
			var stageIconClass = 'glyphicon-exclamation-sign';
			var stageText = '';
			if(dailyTopic.options.whichVersion){
				if(row.extraData.editStatus == "LIBRARY") {
					eIconClass = 'glyphicon-ok';
					stageText = "报题已审";
					$html.find('.stage-icon').addClass(stageIconClass);
					$html.find('.stage-name').text(stageText);
					
				}else{
					//TODO
				}		
				return $html;
			}else{
				if(row.editstatus == 2) {
					eIconClass = 'glyphicon-ok';
					stageText = "报题已审";
					$html.find('.stage-icon').addClass(stageIconClass);
					$html.find('.stage-name').text(stageText);
					return $html;
				}else{
					CentralProxy.getWorkingWorkitemNameStr(row.moid, function(resp) {
						if(resp.code == 0) {
							if(row.editstatus == 2) {
								eIconClass = 'glyphicon-ok';
								stageText = "报题已审";
							} else {
								switch(resp.result.activityDefName) {
									case "一审报题":
										stageIconClass = 'glyphicon-exclamation-sign';
										stageText = "报题待审";
										break;
									case "退回报题":
										stageIconClass = 'glyphicon-arrow-left';
										stageText = "报题退回";
										break;
									default:
										stageIconClass = 'glyphicon-ok';
										stageText = "报题已审";
										break;
								}
							}

							$html.find('.stage-icon').addClass(stageIconClass);
							$html.find('.stage-name').text(stageText);
						} else {
							$html.find('.stage-icon').remove();
							$html.find('.stage-name').text('');
						}
					});
					return $html;
				}
			}

			
		};

		function startShowOneByOne() {
			var $dailyTopicItems = dailyTopicList.find('.item');
			var currentArrayIndex = 0;
			$($dailyTopicItems[currentArrayIndex]).addClass('active', 300);
			currentArrayIndex++;
			dailyTopic.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $dailyTopicItems.length) {
					currentArrayIndex = 0;
				}
				if(dailyTopicList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					dailyTopicList.find('.item.active').removeClass('active', 100, function() {
						$($dailyTopicItems[tempIndex]).addClass('active', 200);
					});
				} else {
					$($dailyTopicItems[currentArrayIndex]).addClass('active', 200);
				}
				currentArrayIndex++;
			}, 3000);
		};
	},

	loadData: function(dailyTopic) {
		//温岭假数据开始
//		$.ajax({
//			url: './js/data.json',
//			method: 'POST',
//			success: function(resp){
//				dailyTopic.resp = JSON.parse(resp);
//				DailyTopic.processData(dailyTopic);
//				DailyTopic.displayAllPage(dailyTopic);
//			}
//		})
		//温岭假数据结束
		
		var dailyTopicListPane = dailyTopic.options.container.find('.dailytopic-list-pane'),
		dailyTopicListHead = dailyTopic.options.container.find('.dailytopic-list-head'),
		dailyTopicList = dailyTopic.options.container.find('.dailytopic-list');
		var isComb = ModuleConfigHelper.getConfigByModuleName('ns.daily.clue').queryUrl.indexOf("comb");//comb
		if(isComb == -1){
			dailyTopic.options.whichVersion = false;
		}else if(isComb != -1){
			dailyTopic.options.whichVersion = true;
		}
		if(dailyTopic.options.whichVersion){
	    	CentralProxy.searchComb(dailyTopic.options.searchParamNs, function (resp) {
	    		dailyTopic.resp = JSON.parse(resp);
				DailyTopic.processData(dailyTopic);
				DailyTopic.displayAllPage(dailyTopic);
	        }, null);
		}else{
			if(dailyTopic.columnName && dailyTopic.columnName!="所有栏目"){
				var find = false;
				for(var i in dailyTopic.options.searchParamNova.searchGroup.attributeConditionList) {
					if(dailyTopic.options.searchParamNova.searchGroup.attributeConditionList[i].attributeDefID = 'columnname'){
						find = true;
						dailyTopic.options.searchParamNova.searchGroup.attributeConditionList[i].value = dailyTopic.columnName;
					}
				}
				if(!find){
					dailyTopic.options.searchParamNova.searchGroup.attributeConditionList.push({
						"attributeDefID": "columnname",
						"comparator": "EQ",
						"value": dailyTopic.columnName
					});
				}
			}
			CentralProxy.search(dailyTopic.options.searchParamNova, function(resp) {
				dailyTopic.resp = resp;
				var dailyTopicListPane = dailyTopic.options.container.find('.dailytopic-list-pane'),
					dailyTopicListHead = dailyTopic.options.container.find('.dailytopic-list-head'),
					dailyTopicList = dailyTopic.options.container.find('.dailytopic-list');
				var $select = $('#columnname');
				if(!dailyTopic.notFirstRunFlag){
					$select.empty();
					dailyTopic.columns = ['所有栏目']; //所有栏目的集合
					//获取所有栏目的集合
					var resultFacet = dailyTopic.resp.result.facetResult.fieldList[0].facetItemList;
					for(var i = 0; i < resultFacet.length; i++) {
						dailyTopic.columns[dailyTopic.columns.length] = resultFacet[i].name;
					}
					if(!dailyTopic.columns || dailyTopic.columns.length == 0) {
						var html = '<option>未查询到栏目数据</option>';
						$(html).appendTo($select);
						var nowaDay = new Date();
						dailyTopicListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
						dailyTopicList.empty().append('<span>暂无数据</span>');
						dailyTopicListPane.addClass('active');
						return;
					}
					for(var column in dailyTopic.columns) {
						var html = '<option>' + dailyTopic.columns[column] + '</option>';
						$(html).appendTo($select);
					}
				}
				dailyTopic.notFirstRunFlag = true;
				DailyTopic.processData(dailyTopic);
				DailyTopic.displayAllPage(dailyTopic);
				$select.change(function() {
					if(dailyTopic.columnName != $(this).val()){
						dailyTopic.columnName = $(this).val();
						DailyTopic.loadData(dailyTopic);	
					}
				});
			},null,true);			
		}
	},
	
	processData: function(dailyTopic) {
		if(dailyTopic.options.whichVersion){
			dailyTopic.dailyTopicArray = dailyTopic.resp.items;			
		}else{
			var assetList = dailyTopic.resp.result.assetList;
			dailyTopic.dailyTopicArray = [];
			for(var i in assetList){
				var asset = AssetHelper.toAttributeValueMap(assetList[i].attributeList);
				dailyTopic.dailyTopicArray[dailyTopic.dailyTopicArray.length] = asset;
			}			
		}
		return dailyTopic.dailyTopicArray;
	},
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyTopic.createNew();
});