/**
 * 今日报道页面
 */
var DailyTitle = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.dailytitle-container'),
		};
		var dailyTitle = {};
		dailyTitle.options = $.extend(true, opts_default, opts);
//		dailyTitle.options.timePerOne = ModuleConfigHelper.getConfigByModuleName('ns.daily.title').timeStampIntervalShowOne||3000;
//		dailyTitle.options.timePerPage = ModuleConfigHelper.getConfigByModuleName('ns.daily.title').timeStampIntervalPage||30500;
		DailyTitle.loadCityData(dailyTitle, DailyTitle.loadCityDataCallBack);
		DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
		//每隔3分钟，重新查询一次最新数据并显示
		dailyTitle.intervalQuery = setInterval(function() {
			DailyTitle.loadCityData(dailyTitle, DailyTitle.loadCityDataCallBack);
			DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
		}, 180000);
		return dailyTitle;
	},
	loadDataCallBack: function(dailyTitleJson, dailyTitle) {
		dailyTitle.dailyTitleJson = dailyTitleJson;
		DailyTitle.displayDailyTitleDatas(dailyTitle);
	},
	loadData: function(dailyTitle, callback) {
		dailyTitle.type = "avid";
		
		if(!dailyTitle.date){
			dailyTitle.date = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
		}
		CentralProxy.getReports(function(resp) {
			if(callback && typeof callback == 'function') {
				callback(resp, dailyTitle);
			}
		});	
		
	},
	loadCityDataCallBack: function(dailyTitleCityJson, dailyTitle) {
		dailyTitle.dailyTitleCityJson = dailyTitleCityJson;
	},	
	loadCityData: function(dailyTitle, callback){
//		$.ajax({
//			url: "./js/dailytitlejson.json",
//			success: function(resp){
//				if(callback && typeof callback == 'function') {
//					callback(resp, dailyTitle);
//				}
//			} 
//		});
//		dailyTitle.type = "channelcity";
		if(!dailyTitle.date){
			dailyTitle.date = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
		}
		CentralProxy.getReports(function(resp) {
			if(callback && typeof callback == 'function') {
				callback(resp, dailyTitle);
			}
		});	
	},
	processData: function(dailyTitle) {
		if(!dailyTitle.dailyTitleJson) {
			return;
		}
		var sort = function(columns, fixedOrder){
		    var result = [];
		    var k = 0;
		    for(var i in fixedOrder){
		        for(var j in columns){
		            if(columns[j] == fixedOrder[i]){
		                result[k++] = columns.splice(j,1)[0];
		                break;
		            }
		        }
		    }
		    for(var i in columns){
		        result[k++] = columns[i];
		    }
		    return result;
		 }
		var dailyTitleJson = dailyTitle.dailyTitleJson;
		dailyTitle.columns = []; //所有栏目的集合
		var fixColumns = ["江苏新时空","新闻空间站"];
		dailyTitle.jsonMap = {}; //id:clip的map
		dailyTitle.columnClipMap = {}; //每个colum对应的按照时间倒序排序的所有clip
		var queue = dailyTitleJson.queue;
		//获取所有栏目的集合
		for(var i = 0; i < queue.length; i++) {
			for(var j = 0; j < queue[i].clip.length; j++) {
				//生成id:clip的map，并生成所有栏目的集合
				if($.trim(queue[i].clip[j].id)!=''&&$.trim(queue[i].clip[j].columnName)!='') {
					dailyTitle.jsonMap[queue[i].clip[j].id] = queue[i].clip[j];
					if(dailyTitle.columns.indexOf($.trim(queue[i].clip[j].columnName)) < 0) {
						dailyTitle.columns[dailyTitle.columns.length] = $.trim(queue[i].clip[j].columnName);
					}
				}
			}
		}
		//对columns排序
		dailyTitle.columns = sort(dailyTitle.columns, fixColumns);
		//填充每个clip的当前阶段信息
		for(var i = 0; i < queue.length; i++) {
			for(var j = 0; j < queue[i].clip.length; j++) {
				if(dailyTitle.jsonMap[queue[i].clip[j].id]&&queue[i].clip[j].id!=''){
					if(!dailyTitle.jsonMap[queue[i].clip[j].id].caption){
						dailyTitle.jsonMap[queue[i].clip[j].id].caption = [];
					}
					dailyTitle.jsonMap[queue[i].clip[j].id].caption.push(queue[i].caption);
				}
			}
		}
		dailyTitle.columnClipMap = {}; //每个colum对应的按照时间倒序排序的所有clip
		//将所有clip，按照其columnName分组
		for(var i in dailyTitle.jsonMap){
			if(!dailyTitle.columnClipMap[dailyTitle.jsonMap[i].columnName]){
				dailyTitle.columnClipMap[dailyTitle.jsonMap[i].columnName] = [];
			}
			dailyTitle.columnClipMap[dailyTitle.jsonMap[i].columnName].push(dailyTitle.jsonMap[i]);
		}
		
		function getStage(stagesArray){
			if(!stagesArray||stagesArray.length==0){
				return '未知';
			}else if(stagesArray.indexOf('审片') >=0 ){
				return '审片通过';
			}else if(stagesArray.indexOf('退片') >=0 ){
				return '审片退回';
			}else if(stagesArray.indexOf('字幕') >=0 ){
				return '字幕';
			}else if(stagesArray.indexOf('配音') >=0 ){
				return '配音';
			}else if(stagesArray.indexOf('通过') >=0 ){
				return '通过';
			}else if(stagesArray.indexOf('退稿') >=0 ){
				return '退稿';
			}else if(stagesArray.indexOf('写稿') >=0 ){
				return '写稿';
			}
		}
		//将每个columnName分组中的clip按照时间倒序排列
		for(var i in dailyTitle.columnClipMap){
			dailyTitle.columnClipMap[i] = Utils.jsonSort(dailyTitle.columnClipMap[i], 'createTime', true);
			for(var j in dailyTitle.columnClipMap[i]){
				dailyTitle.columnClipMap[i][j].caption = getStage(dailyTitle.columnClipMap[i][j].caption);
			}
		}
		return dailyTitle.columnClipMap;
	},
	processCityData: function(dailyTitle) {
//		DailyTitle.loadCityData(dailyTitle, DailyTitle.loadCityDataCallBack);
		if(!dailyTitle.dailyTitleCityJson) {
			return;
		}
		var dailyTitleCityJson = dailyTitle.dailyTitleCityJson;
		dailyTitle.cityColumns = []; //所有城市频道栏目的集合
		dailyTitle.jsonCityMap = {}; //id:clip的城市频道map
		dailyTitle.columnClipCityMap = {}; //每个colum对应的按照时间倒序排序的所有城市频道clip		
		var queueCity = dailyTitleCityJson.queue;
		//城市频道解析
		//获取所有城市频道栏目的集合
		for(var i = 0; i < queueCity.length; i++) {
			for(var j = 0; j < queueCity[i].clip.length; j++) {
				//生成id:clip的map，并生成所有栏目的集合
				if($.trim(queueCity[i].clip[j].id)!=''&&$.trim(queueCity[i].clip[j].columnName)!='') {
					dailyTitle.jsonCityMap[queueCity[i].clip[j].id] = queueCity[i].clip[j];
					if(dailyTitle.cityColumns.indexOf($.trim(queueCity[i].clip[j].columnName)) < 0) {
						dailyTitle.cityColumns[dailyTitle.cityColumns.length] = $.trim(queueCity[i].clip[j].columnName);
					}
				}
			}
		}
		//填充每个clip的当前阶段信息
		for(var i = 0; i < queueCity.length; i++) {
			for(var j = 0; j < queueCity[i].clip.length; j++) {
				if(dailyTitle.jsonCityMap[queueCity[i].clip[j].id]&&queueCity[i].clip[j].id!=''){
					if(!dailyTitle.jsonCityMap[queueCity[i].clip[j].id].caption){
						dailyTitle.jsonCityMap[queueCity[i].clip[j].id].caption = [];
					}
					dailyTitle.jsonCityMap[queueCity[i].clip[j].id].caption.push(queueCity[i].caption);
				}
			}
		}
		
		//将所有clip，按照其columnName分组
		for(var i in dailyTitle.jsonCityMap){
			if(!dailyTitle.columnClipCityMap[dailyTitle.jsonCityMap[i].columnName]){
				dailyTitle.columnClipCityMap[dailyTitle.jsonCityMap[i].columnName] = [];
			}
			dailyTitle.columnClipCityMap[dailyTitle.jsonCityMap[i].columnName].push(dailyTitle.jsonCityMap[i]);
		}
		
		function getStageCity(stagesArray){
			if(!stagesArray||stagesArray.length==0){
				return '未知';
			}else if(stagesArray.indexOf('可以播出') >=0 ){
				return '可播';
			}else if(stagesArray.indexOf('剪辑') >=0 ){
				return '剪辑';
			}else if(stagesArray.indexOf('终审') >=0 ){
				return '终审';
			}else if(stagesArray.indexOf('初审') >=0 ){
				return '初审';
			}else if(stagesArray.indexOf('退稿') >=0 ){
				return '退稿';
			}else if(stagesArray.indexOf('写稿') >=0 ){
				return '写稿';
			}
		}	
		//将每个columnName分组中的clip按照时间倒序排列
		for(var i in dailyTitle.columnClipCityMap){
			dailyTitle.columnClipCityMap[i] = Utils.jsonSort(dailyTitle.columnClipCityMap[i], 'createTime', true);
			for(var j in dailyTitle.columnClipCityMap[i]){
				dailyTitle.columnClipCityMap[i][j].caption = getStageCity(dailyTitle.columnClipCityMap[i][j].caption);
			}
		}
		
		return dailyTitle.columnClipCityMap;
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
//        dailyTitle.options.container.find('.dailytitle-list').jAnimate('fadeOutLeftBig').empty();
        dailyTitle.options.container.find('.dailytitle-list').empty();   
        if (callback && typeof callback == 'function') {
            callback(dailyTitle, currentPageArray);
        }
    },
	displayDailyTitleDatas: function(dailyTitle) {
		if (dailyTitle.intervalPage) {
            clearInterval(dailyTitle.intervalPage);
        }
		if (dailyTitle.intervalShowOneByOne) {
			clearInterval(dailyTitle.intervalShowOneByOne);
        }
		DailyTitle.processData(dailyTitle);
		DailyTitle.processCityData(dailyTitle);
		var dailyTitleListPane = dailyTitle.options.container.find('.dailytitle-list-pane'),
			dailyTitleListHead = dailyTitle.options.container.find('.dailytitle-list-head'),
			dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
		var $orgSelect = $('#orgSel');
		var $colSelect = $('#columnname');
		var $daySelect = $('#daySel');
		var nowaDay = new Date();
		if(!dailyTitle.notFirstRunFlag){
			dailyTitle.notFirstRunFlag = true;
//			dailyTitleListHead.find('#daySel').val(Utils.dateFormat(nowaDay, 'yyyy-MM-dd'));	
		}
		var orgTmp = $orgSelect.val();
		
			$colSelect.empty();
			var nowaDay = new Date();
					
			dailyTitleListHead.find('#daySel').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
			dailyTitle.orgs = [{orgName: '融媒体新闻中心',columns: []},
			                   {orgName: '城市频道',columns: []},
			                   {orgName: '教育频道',columns: ['暂无']},
			                   {orgName: '新闻广播',columns: ['暂无']},
			                   {orgName: '网络台',columns: ['暂无']}];
//			dailyTitle.columns = ['所有栏目']; //所有栏目的集合
			//获取所有栏目的集合
			
			if(!dailyTitle.columns||dailyTitle.columns.length == 0){
//				var html = '<option>暂无</option>';
//				$(html).appendTo($select);
				dailyTitleList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
				return;
			}
			for(var column in dailyTitle.columns){
				dailyTitle.orgs[0].columns.push(dailyTitle.columns[column]);
			}
			for(var column in dailyTitle.cityColumns){
				dailyTitle.orgs[1].columns.push(dailyTitle.cityColumns[column]);
			}			
			if(dailyTitle.orgs[0].columns.length == 0 && dailyTitle.orgs[1].columns.length == 0) {
				dailyTitleList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
				return;
			}
			$orgSelect.empty().unbind('change');
			for(var org in dailyTitle.orgs) {
				+function(){
					var html = '<option>' + dailyTitle.orgs[org].orgName + '</option>';
					$(html).data('data', dailyTitle.orgs[org].columns).appendTo($orgSelect);
				}();
			}
			if(orgTmp && $orgSelect.val() != orgTmp){
				$orgSelect.val(orgTmp);
			}
			var generalChange = function(){
//				if(dailyTitle.orgName != $(this).val()){
				dailyTitle.orgName = $orgSelect.val();
				var cols = $orgSelect.find('option:selected').data('data');
				
				$colSelect.empty();
				for(var column in cols) {
					var html = '<option>' + cols[column] + '</option>';
					$(html).appendTo($colSelect);
				}
				$colSelect.change();
//			}				
			};
//			$orgSelect.change(function(){
////				if(dailyTitle.orgName != $(this).val()){
//				dailyTitle.orgName = $orgSelect.val();
//				var cols = $orgSelect.find('option:selected').data('data');
//				console.log($daySelect.val())
//				$colSelect.empty();
//				for(var column in cols) {
//					var html = '<option>' + cols[column] + '</option>';
//					$(html).appendTo($colSelect);
//				}
//				$colSelect.change();
//			});
			$orgSelect.change(function(){
//				dailyTitleListHead.find('#daySel').val(Utils.dateFormat(nowaDay, 'yyyy-MM-dd'));
				dailyTitle.date = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
				DailyTitle.loadCityData(dailyTitle, DailyTitle.loadCityDataCallBack);
				DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
//				generalChange();
			});
//			$orgSelect.change();
			generalChange();
		
		DailyTitle.displaySelectedColumn(dailyTitle);
		$colSelect.change(function() {
			if(dailyTitle.columnName != $(this).val()){
				dailyTitle.columnName = $(this).val();
				DailyTitle.displaySelectedColumn(dailyTitle);
			}
		});
		$daySelect.datetimepicker({
		      lang: "ch",           //语言选择中文
		      format: "Y-m-d",      //格式化日期
		      inline: false,
		      timepicker: false,    //关闭时间选项
		      startDate: new Date(),
		      defaultDate: new Date(),
		      mask:false,
//		      minDate: 0,
		      maxDate:0,
		      todayButton: true
		}).change(function() {
			if(dailyTitle.date != $(this).val()){
				dailyTitle.date = $(this).val();
				DailyTitle.loadCityData(dailyTitle, DailyTitle.loadCityDataCallBack);
				DailyTitle.loadData(dailyTitle, DailyTitle.loadDataCallBack);
			}
		});
		
//		console.log(dailyTitle.orgName);
//		console.log(dailyTitle.columnName);
//		console.log(dailyTitle.date);
//	    setTimeout(function(){
//    	var protocol = window.location.protocol;
//    	var hostname = window.location.hostname;
//    	var port = window.loacation.port != "" ? ":" + window.location.port : "";
//    	var url = protocol + "//" + hostname + port;
//		console.log(dailyTitle.orgName);
//		console.log(dailyTitle.columnName);
//		console.log(dailyTitle.date);
////    	location.reload();
//    },18000)
	},
	
	displaySelectedColumn: function(dailyTitle){
		if (dailyTitle.intervalPage) {
            clearInterval(dailyTitle.intervalPage);
        }
		if (dailyTitle.intervalShowOneByOne) {
			clearInterval(dailyTitle.intervalShowOneByOne);
        }
		
		var copyArr = [];
		dailyTitle.titlePageArray = [];
		if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
			if($.inArray($('#columnname').val(), dailyTitle.columns) == -1){
				dailyTitle.oldColumn =  dailyTitle.columns[0];
			}else{
				dailyTitle.oldColumn = $('#columnname').val();
			}	
			
			if(dailyTitle.columnClipMap[dailyTitle.oldColumn]){
				copyArr = dailyTitle.columnClipMap[dailyTitle.oldColumn].slice();
			}
	        while (copyArr.length) {
	        	dailyTitle.titlePageArray.push(copyArr.splice(0, 8));
	        }
	        
	        dailyTitle.pageIndex = 0;
	        if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
	        	if(copyArr.length == 0){
	        		DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, []);
	    		}
	            return;
	        }
	        var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
	        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
	        dailyTitle.pageIndex++;
	        dailyTitle.intervalPage = setInterval(function () {
	        	
	            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
	            	if(dailyTitle.titlePageArray.length==0){
	            		clearInterval(Bubble.intervalPage);
				    	return;
	            	}/*else{
	            		dailyTitle.pageIndex = 0;//从第一页重新开始展示
	            	}*/
	            }
	            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
	            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
	            dailyTitle.pageIndex++;
	        }, 30500);//每页切换的时间
		}
		if($('#orgSel').find('option:selected').val() == "城市频道"){		
			if($.inArray($('#columnname').val(), dailyTitle.cityColumns) == -1){
				dailyTitle.oldColumn =  dailyTitle.cityColumns[0];
			}else{
				dailyTitle.oldColumn = $('#columnname').val();
			}
			if(dailyTitle.columnClipCityMap[dailyTitle.oldColumn]){
				copyArr = dailyTitle.columnClipCityMap[dailyTitle.oldColumn].slice();
			}
	        while (copyArr.length) {
	        	dailyTitle.titlePageArray.push(copyArr.splice(0, 8));
	        }
	        
	        dailyTitle.pageIndex = 0;
	        if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
	        	if(copyArr.length == 0){
	        		DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, []);
	    		}
	            return;
	        }
	        var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
	        DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
	        dailyTitle.pageIndex++;
	        dailyTitle.intervalPage = setInterval(function () {
	        	
	            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
	            	if(dailyTitle.titlePageArray.length==0){
	            		clearInterval(Bubble.intervalPage);
				    	return;
	            	}/*else{
	            		dailyTitle.pageIndex = 0;//从第一页重新开始展示
	            	}*/
	            }
	            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
	            DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
	            dailyTitle.pageIndex++;
	        }, 30500);//每页切换的时间
		}
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
//			return;
		}
//		var nowaDay = new Date();
//		dailyTitleListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
		//根据栏目获取时间倒序排列
		$(currentPageArray).each(function(index, row) {
			var html = makeDailyTitleHtml(row);
			dailyTitleList.append(html);
		});
//		dailyTitleListPane.addClass('active', 1000, function() {
//			startShowOneByOne();
//		});
//		dailyTitleList.jAnimate('fadeInRightBig');
		dailyTitleListPane.addClass('pt-page-flipInBottom').show();
		startShowOneByOne();
		function makeDailyTitleHtml(row) {
			var html = '<div class="item">\
								<div class="item-left">\
									<span class="dailytitle-title">江苏省2016年普通高等高校招生工作意见</span>\
									<span class="time">30分钟前</span>\
									<span class="author">记者徐淑敏</span>\
								</div>\
								<div class="stage">\
									<div class="stage-1"><span class="stage-text">写稿</span><span class="bottom-line"></span></div>\
									<div class="stage-2"><span class="stage-text">审稿</span><span class="bottom-line"></span></div>\
									<div class="stage-3"><span class="stage-text">配音</span><span class="bottom-line"></span></div>\
									<div class="stage-4"><span class="stage-text">字幕</span><span class="bottom-line"></span></div>\
									<div class="stage-5"><span class="stage-text">审片</span><span class="bottom-line"></span></div>\
								</div>\
							</div>';
			var timeMordify = row.createTime.slice(row.createTime.indexOf(" ")+1);
			var $html = $(html);
			$html.find('.dailytitle-title').text(row.name);
			$html.find('.author').text(row.reporter);
			$html.find('.time').text(timeMordify);
			
			switch(row.caption) {
				case "写稿":
					$html.find('.stage-1').addClass("done");
					break;
				case "退稿":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("undone");
					break;
				case "通过":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					break;
				case "配音":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					break;
				case "字幕":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					break;
				case "审片退回":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					$html.find('.stage-5').addClass("undone");
					break;
				case "审片通过":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					$html.find('.stage-5').addClass("done");
					break;
				default:
					break;
			}
//			$html.click(function(){
//				DetailShow.show({
//		            container: $('body'),
//		            data: {
//		            	title: row.name,
//		            	time: row.createTime,
//		            	content: '',
//		            	pics: []
//		            }});
//			});
			return $html;
		}
		function startShowOneByOne() {
			var $dailyTitleItems = dailyTitleList.find('.item');
			var currentArrayIndex = 0;
//			$($dailyTitleItems[currentArrayIndex]).addClass('animated bounceInLeft active');
			$($dailyTitleItems[currentArrayIndex]).addClass('active');			
			currentArrayIndex++;
			dailyTitle.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $dailyTitleItems.length) {
					currentArrayIndex = 0;
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
		            var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
		            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
		            dailyTitle.pageIndex++;
					return;
//					}
				}
				if(dailyTitleList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					dailyTitleList.find('.item.active').removeClass('active');
//					$($dailyTitleItems[tempIndex]).addClass('animated bounceInLeft active');
					$($dailyTitleItems[tempIndex]).addClass('active');
				} else {
//					$($dailyTitleItems[currentArrayIndex]).addClass('animated bounceInLeft active');
					$($dailyTitleItems[currentArrayIndex]).addClass('active');
				}
				currentArrayIndex++;
			}, 3000);
		}
        DailyTitle.appendFoot(dailyTitle);
    },
    appendCityItems: function (dailyTitle, currentPageArray) {
    	var dailyTitleListPane = dailyTitle.options.container.find('.dailytitle-list-pane'),
		dailyTitleListHead = dailyTitle.options.container.find('.dailytitle-list-head'),
		dailyTitleList = dailyTitle.options.container.find('.dailytitle-list');
		//显示方面的逻辑
        if(currentPageArray.length == 0) {
			dailyTitleList.append('<span>暂无数据</span>');
//			return;
		}
//		var nowaDay = new Date();
//		dailyTitleListHead.find('.day').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
		//根据栏目获取时间倒序排列
		$(currentPageArray).each(function(index, row) {
			var html = makeDailyTitleCityHtml(row);		
			dailyTitleList.append(html);
		});
//		dailyTitleListPane.addClass('active', 1000, function() {
//			startShowOneByOne();
//		});
//		dailyTitleList.jAnimate('fadeInRightBig');
		dailyTitleListPane.addClass('pt-page-flipInBottom').show();
		startShowOneByOne();
		function makeDailyTitleCityHtml(row) {
			var html = '<div class="item">\
								<div class="item-left">\
									<span class="dailytitle-title">江苏省2016年普通高等高校招生工作意见</span>\
									<span class="time">30分钟前</span>\
									<span class="author">记者徐淑敏</span>\
								</div>\
								<div class="stage">\
									<div class="stage-1">写稿<span class="bottom-line"></span></div>\
									<div class="stage-2">初审<span class="bottom-line"></span></div>\
									<div class="stage-3">终审<span class="bottom-line"></span></div>\
									<div class="stage-4">剪辑<span class="bottom-line"></span></div>\
									<div class="stage-5">审片<span class="bottom-line"></span></div>\
									<div class="stage-6">可播<span class="bottom-line"></span></div>\
								</div>\
							</div>';
			var timeMordify = row.createTime.slice(row.createTime.indexOf(" ")+1);
			var $html = $(html);
			$html.find('.dailytitle-title').text(row.name);
			$html.find('.author').text(row.reporter);
			$html.find('.time').text(timeMordify);
			
			switch(row.caption) {
				case "写稿":
					$html.find('.stage-1').addClass("done");
					break;
				case "退稿":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("undone");
					break;
				case "初审":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					break;
				case "终审":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					break;
				case "剪辑":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					break;
				case "审片":
					$html.find('.stage-1').addClass("done");
					$html.find('.stage-2').addClass("done");
					$html.find('.stage-3').addClass("done");
					$html.find('.stage-4').addClass("done");
					$html.find('.stage-5').addClass("done");
					break;
				case "可播":
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
//			$html.click(function(){
//				DetailShow.show({
//		            container: $('body'),
//		            data: {
//		            	title: row.name,
//		            	time: row.createTime,
//		            	content: '',
//		            	pics: []
//		            }});
//			});
			return $html;
		}
		function startShowOneByOne() {
			var $dailyTitleItems = dailyTitleList.find('.item');
			var currentArrayIndex = 0;
			$($dailyTitleItems[currentArrayIndex]).addClass('animated bounceInLeft active');
			currentArrayIndex++;
			dailyTitle.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $dailyTitleItems.length) {
					currentArrayIndex = 0;
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
		            var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
		            DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
		            dailyTitle.pageIndex++;
					return;
//					}
				}
				if(dailyTitleList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					dailyTitleList.find('.item.active').removeClass('active');
					$($dailyTitleItems[tempIndex]).addClass('animated bounceInLeft active');
				} else {
					$($dailyTitleItems[currentArrayIndex]).addClass('animated bounceInLeft active');
				}
				currentArrayIndex++;
			}, 3000);
		}
        DailyTitle.appendFoot(dailyTitle);
    },
		appendFoot : function (dailyTitle){
			var dailyTitleListFoot = $('.dailytitle-container').find('.dailytitle-list-foot');
			var totalDatas = null;
			if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
				totalDatas = dailyTitle.columnClipMap[dailyTitle.oldColumn].length;	
			}
			if($('#orgSel').find('option:selected').val() == "城市频道"){
				totalDatas = dailyTitle.columnClipCityMap[dailyTitle.oldColumn].length;	
			}
			var totalPages = dailyTitle.titlePageArray.length;
			var currentPage = dailyTitle.pageIndex;
			var currentPageArray = [];
			dailyTitleListFoot.empty();
			var html = '共查询到<span class="dailyrundown-list-foot-count">'+totalDatas+'</span>条信息，共'+ totalPages +'页，当前第<span class="dailyrundown-list-foot-current">'+(currentPage+1)+'</span>页'+
  			  			'<a class="pagePrevious" href="javascript:void(0)"> 上一页</a>'+'<a class="pageNext" href="javascript:void(0)"> 下一页</a>'
	    	dailyTitleListFoot.append(html);
	    	
	    	$('.pagePrevious').click(function(){
	    		clearInterval(dailyTitle.intervalPage);
	    		dailyTitle.pageIndex= dailyTitle.pageIndex-2;
		        var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
		        if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
			        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);	        	
		        }
		        if($('#orgSel').find('option:selected').val() == "城市频道"){
		        	DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
		        }
		        dailyTitle.pageIndex++;
	            
		        dailyTitle.intervalPage = setInterval(function () {
		        	
		            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
		            	if(dailyTitle.titlePageArray.length==0){
		            		clearInterval(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		dailyTitle.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
			        if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
				        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);	        	
			        }
			        if($('#orgSel').find('option:selected').val() == "城市频道"){
			        	DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
			        }
		            dailyTitle.pageIndex++;
		        }, 30500);//每页切换的时间
	    	})
	    	$('.pageNext').click(function(){
	    		clearInterval(dailyTitle.intervalPage);
	    		if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
	    			dailyTitle.pageIndex = 0;
	            }
		        var currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
//		        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);
		        if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
			        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);	        	
		        }
		        if($('#orgSel').find('option:selected').val() == "城市频道"){
		        	DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
		        }
		        dailyTitle.pageIndex++;
	            
		        dailyTitle.intervalPage = setInterval(function () {
		        	
		            if (dailyTitle.pageIndex >= dailyTitle.titlePageArray.length) {
		            	if(dailyTitle.titlePageArray.length==0){
		            		clearInterval(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		dailyTitle.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = dailyTitle.titlePageArray[dailyTitle.pageIndex].slice();
			        if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
				        DailyTitle.clearItems(DailyTitle.appendItems, dailyTitle, currentPageArray);	        	
			        }
			        if($('#orgSel').find('option:selected').val() == "城市频道"){
			        	DailyTitle.clearItems(DailyTitle.appendCityItems, dailyTitle, currentPageArray);
			        }
		            dailyTitle.pageIndex++;
		        }, 30500);//每页切换的时间
	    	})	 
	    	if(dailyTitle.pageIndex == (totalPages-1)){
	    		$('a.pageNext').removeAttr("href");
	    		$('a.pageNext').unbind("click")
	    	}
	    	if(dailyTitle.pageIndex == 0){
	    		$('a.pagePrevious').removeAttr("href");
	    		$('a.pagePrevious').unbind("click")
	    	}
		}
};
$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyTitle.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
    setTimeout(function(){
    	location.reload();
    },170000)
});