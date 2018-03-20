/**
 * 今日编排页面
 */
var DailyRunDown={
		createNew: function(opts) {
			var opts_default = {
				container: $('.dailyrundown-container'),
				queryInterval: 180000,
			};
			var dailyRunDown = {};
			dailyRunDown.options = $.extend(true, opts_default, opts);
			dailyRunDown.options.timePerOne = ModuleConfigHelper.getConfigByModuleName('ns.daily.rundown').timeStampIntervalShowOne||3000;
			dailyRunDown.options.timePerPage = ModuleConfigHelper.getConfigByModuleName('ns.daily.rundown').timeStampIntervalPage||30500;
			
			DailyRunDown.loadData(dailyRunDown, DailyRunDown.loadDataCallBack);
			//每隔3分钟，重新查询一次最新数据并显示
			dailyRunDown.intervalQuery = setInterval(function() {
				DailyRunDown.loadData(dailyRunDown, DailyRunDown.loadDataCallBack);
			}, dailyRunDown.options.queryInterval);
			return dailyRunDown;
		},
		//假数据专用回调
		loadDataCallBack: function(dailyRunDownData, dailyRunDown) {
			dailyRunDown.dailyRunDownNewsData = dailyRunDownData;
			DailyRunDown.displayDailyRunDownDatas(dailyRunDown);
		},
//		loadDataCallBack: function(dailyRunDown) {
//			DailyRunDown.displayDailyRunDownDatas(dailyRunDown);
//		},
		loadData: function(dailyRunDown, callback) {
			
//			if(!dailyRunDown.notFirstRunFlag){
//				$('.loading').show();
//			}
			//城市频道数据
//			var rundownType = "channelcity";
//			dailyRunDown.segNameCityArray = ["2013晚间新闻"];
//			dailyRunDown.dailyRunDownCityData = [];
//			for(var i in dailyRunDown.segNameCityArray){
//				CentralProxy.getRundownData(rundownType, dailyRunDown.segNameCityArray[i], function(resp,segname) {
//					if(!resp.playList){
//						return;
//					}
//					var assetList = resp.playList.title;
//					dailyRunDown.cityFlag = true;
//					dailyRunDown.dailyRunDownCityData[dailyRunDown.segNameCityArray.indexOf(segname)] = assetList;	
////					dailyRunDown.dailyRunDownCityData[segname] = assetList;	
//					for(var i = 0; i < dailyRunDown.segNameCityArray.length; i++){
//						if(!dailyRunDown.dailyRunDownCityData[i]){
//							dailyRunDown.cityFlag = false;
//							break;
//						}
//					}			
//					if(dailyRunDown.cityFlag && dailyRunDown.newsFlag){
//						if (callback && typeof callback == 'function') {
//							callback(dailyRunDown);
//							dailyRunDown.cityFlag = false;
//						}						
//					}
//
//				});	
//			}
				
			//假请求数据 城市频道
//			$.ajax({
//				url: './js/rundown.json',
//				dataType:"json",
//				success: function(resp){
//		            var dailyRunDownCityData = [];
//		            var assetList = resp.playList.title;
//		            var assetNm = resp.objectInfo.segNM;
//		            for(var i = 0;i < assetList.length; i++){
//		            	var assetArray = {};
//		            	assetArray.columnname = assetNm;
//		            	var playdateTmp = assetList[i].editTime;
//		            	assetArray.playdate= playdateTmp.substr(playdateTmp.indexOf(' ')+1)
//		            	
//		            	
//		            	assetArray.assetname = assetList[i].name;
//		            	assetArray.reporters = assetList[i].reporters;
//		            	dailyRunDownCityData.push(assetArray);
//		            }
//		            dailyRunDown.dailyRunDownCityData = dailyRunDownCityData;
//				}
//			})
			
			//新闻中心数据
//			var rundownType = "avid";
//			dailyRunDown.segNameNewsArray = ["江苏新时空","10新闻空间站","12新闻空间站","14新闻空间站","16新闻空间站","22新闻空间站","新财经","新闻360","新闻眼","早安江苏","晚间新闻","法治在线","网罗天下","评新而论","通天下"];
//			dailyRunDown.dailyRunDownNewsData = [];
//			function loadRundownOnebyOne(x){
//				if(dailyRunDown.segNameNewsArray[x]){
//					CentralProxy.getRundownData(rundownType, dailyRunDown.segNameNewsArray[x], function(resp, segname) {
////						if(x == dailyRunDown.segNameNewsArray.length - 1){
////							$('.loading').hide();
////						}
//						var assetList = resp.playList.title;
//						dailyRunDown.newsFlag = true;
//						dailyRunDown.dailyRunDownNewsData[dailyRunDown.segNameNewsArray.indexOf(segname)] = assetList;
//						for(var i = 0; i < dailyRunDown.segNameNewsArray.length; i++){
//							if(!dailyRunDown.dailyRunDownNewsData[i]){
//								dailyRunDown.newsFlag  = false;
//								break;
//							}
//						}
//						if(dailyRunDown.newsFlag && dailyRunDown.cityFlag){
//							if (callback && typeof callback == 'function') {
//								callback(dailyRunDown);
//								dailyRunDown.newsFlag  = false;
//							}						
//						}
//						loadRundownOnebyOne(x+1);
//					});	
//				}
//			}
//			loadRundownOnebyOne(0);
//			
//			for(var j in dailyRunDown.segNameNewsArray){
//								
//			}	

			//假请求数据  新闻中心
			$.ajax({
				url: './js/rundown.json',
				dataType:"json",
				success: function(resp){
		            var dailyRunDownData = resp.playList.title;
//		            var assetList = resp.playList.title;
//		            var assetNm = resp.objectInfo.segNM;
		            
//		            for(var i = 0;i < assetList.length; i++){
//		            	var assetArray = {};
//		            	assetArray.columnname = assetNm;
//		            	var playdateTmp = assetList[i].editTime;
//		            	assetArray.playdate= playdateTmp.substr(playdateTmp.indexOf(' ')+1)
//		            	
//		            	
//		            	assetArray.assetname = assetList[i].name;
//		            	assetArray.reporters = assetList[i].reporters;
//		            	dailyRunDownData.push(assetArray);
//		            }
					if (callback && typeof callback == 'function') {
		                callback(dailyRunDownData, dailyRunDown);
		            }
				}
			})
	    },
	    
	    processNewsData: function(dailyRunDown) {
			if(!dailyRunDown.dailyRunDownNewsData) {
				return;
			}
			//暂时屏蔽帧数据处理过程，以下为假数据
//			var sort = function(columns, fixedOrder){
//			    var result = [];
//			    var k = 0;
//			    for(var i in fixedOrder){
//			        for(var j in columns){
//			            if(columns[j] == fixedOrder[i]){
//			                result[k++] = columns.splice(j,1)[0];
//			                break;
//			            }
//			        }
//			    }
//			    for(var i in columns){
//			        result[k++] = columns[i];
//			    }
//			    return result;
//			 }
//			var fixedOrder = ["江苏新时空","10新闻空间站","12新闻空间站","14新闻空间站","16新闻空间站","22新闻空间站"];
//			var dailyRunDownNewsData = dailyRunDown.dailyRunDownNewsData;
//			var segNameNewsArray = dailyRunDown.segNameNewsArray;
//			dailyRunDown.segNameNewsClip = {};
//			for(var i = 0; i < dailyRunDownNewsData.length; i++){
//				for(var j=0; j < dailyRunDownNewsData[i].length; j++){
//					if(!dailyRunDown.segNameNewsClip[segNameNewsArray[i]]){
//						dailyRunDown.segNameNewsClip[segNameNewsArray[i]]= [];
//					} 
//					dailyRunDown.segNameNewsClip[segNameNewsArray[i]].push(dailyRunDownNewsData[i][j]);
//				}
//			}		
//			dailyRunDown.segNameNewsArray = sort(dailyRunDown.segNameNewsArray ,fixedOrder);
			dailyRunDown.segNameNewsClip = {};
			dailyRunDown.segNameNewsArray = ["每日新闻报","超级新闻场","安徽新闻联播"];
			var dailyRunDownNewsData = dailyRunDown.dailyRunDownNewsData;
			var segNameNewsArray = dailyRunDown.segNameNewsArray;
			for(var i = 0; i < dailyRunDownNewsData.length; i++){
				if(!dailyRunDown.segNameNewsClip[segNameNewsArray[0]]){
					dailyRunDown.segNameNewsClip[segNameNewsArray[0]]= [];
					dailyRunDown.segNameNewsClip[segNameNewsArray[1]] = [];
					dailyRunDown.segNameNewsClip[segNameNewsArray[2]] = [];
				} 
				dailyRunDown.segNameNewsClip[segNameNewsArray[0]].push(dailyRunDownNewsData[i]);
				dailyRunDown.segNameNewsClip[segNameNewsArray[1]].push(dailyRunDownNewsData[i]);
				dailyRunDown.segNameNewsClip[segNameNewsArray[2]].push(dailyRunDownNewsData[i]);
			}
			return dailyRunDown.segNameNewsClip;
		},
		processCityData: function(dailyRunDown) {
			if(!dailyRunDown.dailyRunDownCityData) {
				return;
			}
			var dailyRunDownCityDataOrigin = dailyRunDown.dailyRunDownCityData; //未添加type字段的数据
			var dailyRunDownCityData;
			var tmp;//存放找到对应type位置的index
			for(var a = 0; a < dailyRunDownCityDataOrigin.length; a++){
				dailyRunDownCityData = dailyRunDownCityDataOrigin[a];
				for(var i = 0 ; i < dailyRunDownCityData.length; i++){
					if(dailyRunDownCityData[i].name.indexOf("天天视频汇") >= 0){
						dailyRunDownCityData.splice(i,1); //删除该组
						for(var j = i+1; j < dailyRunDownCityData.length; j++){
							dailyRunDownCityData[j].type = "天天视频汇" ; 
							if(dailyRunDownCityData[j].name.indexOf("楼市零距离") >= 0){
								dailyRunDownCityData.splice(j,1); //删除该组
								tmp = j;	
								break;
							}
						}
					}
					for(var k = tmp+1; k < dailyRunDownCityData.length; k++){
						dailyRunDownCityData[k].type = "楼市零距离" ; 
						if(dailyRunDownCityData[k].name.indexOf("法治集结号") >= 0){
							dailyRunDownCityData.splice(k,1); //删除该组
							tmp = k;	
							break;
						}			
					}
					for(var l = tmp+1; k < dailyRunDownCityData.length; l++){
						dailyRunDownCityData[l].type = "法治集结号" ; 
						if(dailyRunDownCityData[l].name.indexOf("零距离") >= 0){
							dailyRunDownCityData.splice(l,1); //删除该组
							tmp = l;	
							break;
						}			
					}
					for(var m = tmp+1; m < dailyRunDownCityData.length; m++){
						dailyRunDownCityData[m].type = "零距离" ; 
						if(dailyRunDownCityData[m].name.indexOf("备播") >= 0){
							dailyRunDownCityData.splice(m,1); //删除该组
							tmp = m;	
							break;
						}			
					}
					for(var n = tmp+1; n < dailyRunDownCityData.length; n++){
						dailyRunDownCityData[n].type = "备播" ; 
					}
					break;
				}
				dailyRunDownCityDataOrigin[a] = dailyRunDownCityData;
			}
//			for(var i = 0; i < dailyRunDown.segNameCityArray.length; i++){
//				dailyRunDown.segNameCityArray[i]dailyRunDown.segNameCityArray[i].replace(/\d/g, "");				
//			}
			var segNameArray = dailyRunDown.segNameCityArray;
			dailyRunDown.segNameCityClip = {};
			for(var i = 0; i < dailyRunDownCityDataOrigin.length; i++){
				for(var j=0; j < dailyRunDownCityDataOrigin[i].length; j++){
					if(!dailyRunDown.segNameCityClip[segNameArray[i]]){
						dailyRunDown.segNameCityClip[segNameArray[i]]= [];
					} 
					dailyRunDown.segNameCityClip[segNameArray[i]].push(dailyRunDownCityDataOrigin[i][j]);
				}
			}
//			for(var i in segNameArray){
//				if(!dailyRunDown.segNameCityClip[segNameArray[i]]){
//					dailyRunDown.segNameCityClip[segNameArray[i]]= [];
//				} 
//				dailyRunDown.segNameCityClip[segNameArray[i]].push(dailyRunDownCityData[i]);
//			}	
//			for(var i= 0; i < segNameArray.length; i++){
//				
//				if(!dailyRunDown.segNameCityClip[segNameArray[i]]){
//					dailyRunDown.segNameCityClip[segNameArray[i]]= [];
//				} 
//				dailyRunDown.segNameCityClip[segNameArray[i]].push(dailyRunDownCityData[i]);
//				
//			}	
			return dailyRunDown.segNameCityClip;
		},
		clearItems: function (callback, dailyRunDown, currentPageArray) {
			if (dailyRunDown.intervalPage) {
	            clearTimeout(dailyRunDown.intervalPage);
	        }
			if (dailyRunDown.intervalShowOneByOne) {
				clearTimeout(dailyRunDown.intervalShowOneByOne);
	        }
	        var dailyRunDownList = dailyRunDown.options.container.find('.dailyrundown-list');
	        if (dailyRunDownList.length == 0) {
	            if (callback && typeof callback == 'function') {
	                callback(dailyRunDown, currentPageArray);
	            }
	            return;
	        }
	        dailyRunDown.options.container.find('.dailyrundown-list-pane').removeClass('active');
	        setTimeout(function(){
	        	dailyRunDown.options.container.find('.dailyrundown-list').empty();
	            if (callback && typeof callback == 'function') {
	                callback(dailyRunDown, currentPageArray);
	            }
	    	}, 1000);
	    },
	    
	    displayDailyRunDownDatas: function(dailyRunDown) {
	    	if (dailyRunDown.intervalPage) {
	            clearTimeout(dailyRunDown.intervalPage);
	        }
//	    	if (dailyRunDown.intervalPage) {
//	    		clearTimeout(dailyRunDown.intervalShowOneByOne);
//	    	}	    	
	    	DailyRunDown.processNewsData(dailyRunDown);
//	    	DailyRunDown.processCityData(dailyRunDown);   
	    	var dailyRunDownListPane = dailyRunDown.options.container.find('.dailyrundown-list-pane'),
	    	dailyRunDownListHead = dailyRunDown.options.container.find('.dailyrundown-list-head'),
	    	dailyRunDownList = dailyRunDown.options.container.find('.dailyrundown-list');
			var $orgSelect = $('#orgSel');
			var $colSelect = $('#columnname');
			var $daySelect = $('#daySel');
			$colSelect.change(function() {
//				if(dailyRunDown.columnName != $(this).val()){
					dailyRunDown.columnName = $(this).val();
					DailyRunDown.displaySelectedColumn(dailyRunDown);
//					DailyRunDown.displayAllPageData(dailyRunDown);
//				}
			});
//			$('.sub-title li').click(function(){
//				dailyRunDown.columnName = $(this).text() == "12点空间站" ? "12新闻空间站" : $(this).text();
//				$('#columnname').val(dailyRunDown.columnName);
//				DailyRunDown.displaySelectedColumn(dailyRunDown);
//			})
			if(!dailyRunDown.notFirstRunFlag){
				dailyRunDown.notFirstRunFlag = true;
				$colSelect.empty();
				var nowaDay = new Date();
				dailyRunDownListHead.find('#daySel').text(Utils.dateFormat(nowaDay, 'yyyy年MM月dd日'));
				dailyRunDown.orgs = [{orgName: '融媒体新闻中心',columns: []}]
//				                   {orgName: '城市频道',columns: []},
//				                   {orgName: '教育频道',columns: ['暂无']},
//				                   {orgName: '新闻广播',columns: ['暂无']},
//				                   {orgName: '网络台',columns: ['暂无']}];
				//获取所有栏目的集合
				
				if(!dailyRunDown.segNameNewsArray||dailyRunDown.segNameNewsArray.length == 0){
//					var html = '<option>暂无</option>';
//					$(html).appendTo($select);
					dailyRunDownList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
					return;
				}
				for(var column in dailyRunDown.segNameNewsArray){
					dailyRunDown.orgs[0].columns.push(dailyRunDown.segNameNewsArray[column]);
				}
				for(var column in dailyRunDown.segNameCityArray){
					dailyRunDown.orgs[1].columns.push(dailyRunDown.segNameCityArray[column]);
				}
//				if(dailyRunDown.orgs[0].columns.length == 0 && dailyRunDown.orgs[1].columns.length == 0) {
//					dailyRunDownList.empty().append('<span>暂无数据</span>').jAnimate('fadeInRightBig');
//					return;
//				}
				$orgSelect.empty().unbind('change');
				for(var org in dailyRunDown.orgs) {
					+function(){
						var html = '<option>' + dailyRunDown.orgs[org].orgName + '</option>';
						$(html).data('data', dailyRunDown.orgs[org].columns).appendTo($orgSelect);
					}();
				}
				$orgSelect.change(function(){
					if(dailyRunDown.orgName != $(this).val()){
						dailyRunDown.orgName = $(this).val();
						var cols = $orgSelect.find('option:selected').data('data');
						$colSelect.empty();
						for(var column in cols) {
							var thisColumn = cols[column];
							thisColumn = thisColumn == null? '': thisColumn.replace(/2013晚间新闻/, '晚间新闻');
							var html = '<option value="' + cols[column] + '">' + thisColumn + '</option>';
							$(html).appendTo($colSelect);
						}
						$colSelect.change();
					}
				});
				$orgSelect.change();
			}
//		$daySelect.datetimepicker({
//		      lang: "ch",           //语言选择中文
//		      format: "Y-m-d",      //格式化日期
//		      inline: false,
//		      timepicker: false,    //关闭时间选项
//		      startDate: new Date(),
//		      defaultDate: new Date(),
//		      mask:false,
//		      minDate: 0,
////		      maxDate:0,
//		      todayButton: true
//		}).change(function() {
//			if(dailyRunDown.day != $(this).val()){
//				dailyRunDown.day = $(this).val();
//				DailyRunDown.displayAllPageData(dailyRunDown);
//			}
//		});
	},
		
//		displayAllPageData:function(dailyRunDown){
//			if (dailyRunDown.intervalPage) {
//	            clearTimeout(dailyRunDown.intervalPage);
//	        }
//			var copyArr = dailyRunDown.allPageData.slice();
//			dailyRunDown.dailyRunDownPageArray = [];
//	        while (copyArr.length) {
//	        	dailyRunDown.dailyRunDownPageArray.push(copyArr.splice(0, 8));
//	        }
//	        dailyRunDown.pageIndex = 0;
//	        if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
//	            return;
//	        }
//	        var currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
//	        DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
//	        dailyRunDown.pageIndex++;
//	        dailyRunDown.intervalPage = setInterval(function () {
//	            if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
//	            	dailyRunDown.pageIndex = 0;
//	            }
//	            currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
//	            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
//	            dailyRunDown.pageIndex++;
//	        }, dailyRunDown.options.timePerPage);//每页切换的时间
//			
//		},
		displaySelectedColumn: function(dailyRunDown){
			if (dailyRunDown.intervalPage) {
	            clearTimeout(dailyRunDown.intervalPage);
	        }
			if (dailyRunDown.intervalShowOneByOne) {
				clearTimeout(dailyRunDown.intervalShowOneByOne);
	        }
			dailyRunDown.oldColumn = $('#columnname').val();	
			var copyArr = [];
			dailyRunDown.dailyRunDownPageArray = [];
			if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
				if(dailyRunDown.segNameNewsClip[dailyRunDown.oldColumn]){
					copyArr = dailyRunDown.segNameNewsClip[dailyRunDown.oldColumn].slice();
				}
		        while (copyArr.length) {
		        	dailyRunDown.dailyRunDownPageArray.push(copyArr.splice(0, 10));
		        }
		        
		        dailyRunDown.pageIndex = 0;
		        if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		        	if(copyArr.length == 0){
		        		DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, []);
		    		}
		            return;
		        }
		        var currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
		        DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		        dailyRunDown.pageIndex++;
		        dailyRunDown.intervalPage = setTimeout(timeOutFun,dailyRunDown.options.timePerPage);
		        function timeOutFun() {
		        	
		            if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		            	if(dailyRunDown.dailyRunDownPageArray.length==0){
		            		clearTimeout(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		dailyRunDown.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
		            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		            dailyRunDown.pageIndex++;
		            dailyRunDown.intervalPage = setTimeout(arguments.callee,dailyRunDown.options.timePerPage);//每页切换的时间
		        };
			}
			if($('#orgSel').find('option:selected').val() == "城市频道"){		
				if(dailyRunDown.segNameCityClip[dailyRunDown.oldColumn]){
					copyArr = dailyRunDown.segNameCityClip[dailyRunDown.oldColumn].slice();
				}
		        while (copyArr.length) {
		        	dailyRunDown.dailyRunDownPageArray.push(copyArr.splice(0, 8));
		        }
		        
		        dailyRunDown.pageIndex = 0;
		        if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		        	if(copyArr.length == 0){
		        		DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, []);
		    		}
		            return;
		        }
		        var currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
		        DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
		        dailyRunDown.pageIndex++;
		        dailyRunDown.intervalPage = setTimeout(citytimeOutFun,dailyRunDown.options.timePerPage);
		        function citytimeOutFun() {
		        	
		            if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		            	if(dailyRunDown.dailyRunDownPageArray.length==0){
		            		clearTimeout(Bubble.intervalPage);
					    	return;
		            	}/*else{
		            		dailyRunDown.pageIndex = 0;//从第一页重新开始展示
		            	}*/
		            }
		            currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
		            DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
		            dailyRunDown.pageIndex++;
		            dailyRunDown.intervalPage = setTimeout(arguments.callee,dailyRunDown.options.timePerPage);//每页切换的时间
		        };
			}
		},
		appendCityItems: function(dailyRunDown,currentPageArray){
			if (dailyRunDown.intervalPage) {
	            clearTimeout(dailyRunDown.intervalPage);
	        }
			if (dailyRunDown.intervalShowOneByOne) {
				clearTimeout(dailyRunDown.intervalShowOneByOne);
	        }
			var dailyRunDownListPane = dailyRunDown.options.container.find('.dailyrundown-list-pane');
			var dailyRunDownList=dailyRunDown.options.container.find('.dailyrundown-list');

			if (currentPageArray.length == 0) {
				dailyRunDownList.append('<span>暂无数据</span>');
				return;
	        }
			
			$(currentPageArray).each(function(index, row) {
		            var html = makeDailyRunDownHtml(row);
		            dailyRunDownList.append(html);
		        });
			dailyRunDownListPane.addClass('active', 1000, function() {
				startShowOneByOne();
			});
			function makeDailyRunDownHtml(row){
				var html = '<div class="item">\
					<div class="fa fa-play" aria-hidden="true"></div>\
					<div class="content">\
						<span class="type">天天视频汇</span>\
						<span class="dailyrundown-title">江苏深入开展市县巡查工作</span>\
						<span class="reporter">张元</span>\
						<span class="time">总时&nbsp;&nbsp;5:20</span>\
					</div>\
				</div>';
				var $html = $(html);
//				row.time = row.editTime.substr(row.editTime.indexOf(" ")+1);
				row.videoLength = row.videoLength.slice(0,8);
				$html.find('.time').html("总时&nbsp&nbsp"+row.videoLength);
//				$html.find('.time').text(row.videoLength);
				if(row.type){
					$html.find('.type').text(row.type);
				}else{
					$html.find('.type').text("");
				}
				
				$html.find('.dailyrundown-title').text(row.name);          	
//							$html.find('.total-time').html("总时&nbsp&nbsp"+row.totalTime);
				$html.find('.reporter').html(row.reporters);
				$html.find('.time').html(row.video);
				
				return $html;
			} 
			
		    function startShowOneByOne() {
		    	var $dailyRunDownItems = dailyRunDownList.find('.item');
		    	var currentArrayIndex = 0; 
		    	/*$dailyRunDownItems.find('.time').prepend('<div class="fa fa-play"></div>');*/
		    	$($dailyRunDownItems[currentArrayIndex]).addClass('active', 1000);
		    	currentArrayIndex++;
		    	setTimeout(citytimeOutFun,dailyRunDown.options.timePerOne);
		    	function citytimeOutFun() {
	                if (currentArrayIndex >= $dailyRunDownItems.length) {
	                    currentArrayIndex = 0;
	                    if(dailyRunDown.intervalShowOneByOne){
		                	clearTimeout(dailyRunDown.intervalShowOneByOne);	                    	
	                    }
	                    if(dailyRunDown.intervalPage){
		                	clearTimeout(dailyRunDown.intervalPage);	                    	
	                    }
						
						if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
							DailyRunDown.displaySelectedColumn(dailyRunDown);
							return;
			            }
			            var currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
			            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
			            dailyRunDown.pageIndex++;
						return;
	                }
	                if (dailyRunDownList.find('.item.active').length > 0) {
	                    var tempIndex = currentArrayIndex;
	                    dailyRunDownList.find('.item.active').removeClass('active', 100, function() {
	                        $($dailyRunDownItems[tempIndex]).addClass('active', 200);
	                    });
	                } else {
	                	$dailyRunDownItems.removeClass('active');
	                    $($dailyRunDownItems[currentArrayIndex]).addClass('active', 200);
	                }
	                currentArrayIndex++;
	                dailyRunDown.intervalShowOneByOne = setTimeout(arguments.callee,dailyRunDown.options.timePerOne);
	            };
		    }	
		    DailyRunDown.appendFoot(dailyRunDown);
		},
		appendItems:function(dailyRunDown,currentPageArray){
			if (dailyRunDown.intervalPage) {
	            clearTimeout(dailyRunDown.intervalPage);
	        }
			if (dailyRunDown.intervalShowOneByOne) {
				clearTimeout(dailyRunDown.intervalShowOneByOne);
	        }
			var dailyRunDownListPane = dailyRunDown.options.container.find('.dailyrundown-list-pane');
			var dailyRunDownList=dailyRunDown.options.container.find('.dailyrundown-list');

			if (currentPageArray.length == 0) {
				dailyRunDownList.append('<span>暂无数据</span>');
				return;
	        }
			
			$(currentPageArray).each(function(index, row) {
		            var html = makeDailyRunDownHtml(row);
		            dailyRunDownList.append(html);
		        });
			dailyRunDownListPane.addClass('active', 1000, function() {
				startShowOneByOne();
			});
			function makeDailyRunDownHtml(row){
				var html = '<div class="item">\
					<div class="fa fa-play" aria-hidden="true"></div>\
					<div class="content">\
						<span class="source">子栏目</span>\
						<span class="dailyrundown-title">美国航天局发现酷似太阳</span>\
						<span class="edit">刘明</span>\
						<span class="time">总时&nbsp;&nbsp;5:20</span>\
					</div>\
				</div>';
				var $html = $(html);
//				$html.find('.time').html("总时&nbsp&nbsp"+row.totalTime);
//				$html.find('.source').text(row.category);
//				$html.find('.dailyrundown-title').text(row.name);          	
//				$html.find('.edit').html(row.reporters);
				
				$html.find('.time').html("总时&nbsp&nbsp"+row.totalTime);
				$html.find('.source').text(row.columnname);
				$html.find('.dailyrundown-title').text(row.name);          	
				$html.find('.edit').html(row.reporters);				
				return $html;
			} 
			
		    function startShowOneByOne() {
		    	var $dailyRunDownItems = dailyRunDownList.find('.item');
		    	var currentArrayIndex = 0; 
		    	/*$dailyRunDownItems.find('.time').prepend('<div class="fa fa-play"></div>');*/
		    	$($dailyRunDownItems[currentArrayIndex]).addClass('active', 1000);
		    	currentArrayIndex++;
		    	setTimeout(itemtimeOutFun,dailyRunDown.options.timePerOne);
		    	function itemtimeOutFun() {
	                if (currentArrayIndex >= $dailyRunDownItems.length) {
	                    currentArrayIndex = 0;
	                    if(dailyRunDown.intervalShowOneByOne){
		                	clearTimeout(dailyRunDown.intervalShowOneByOne);	                    	
	                    }
	                    if(dailyRunDown.intervalPage){
		                	clearTimeout(dailyRunDown.intervalPage);	                    	
	                    }
						if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
							DailyRunDown.displaySelectedColumn(dailyRunDown);
							return;
			            }
			            var currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
			            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
			            dailyRunDown.pageIndex++;
						return;
	                }
	                if (dailyRunDownList.find('.item.active').length > 0) {
	                    var tempIndex = currentArrayIndex;
	                    dailyRunDownList.find('.item.active').removeClass('active', 100, function() {
	                        $($dailyRunDownItems[tempIndex]).addClass('active', 200);
	                    });
	                } else {
	                	$dailyRunDownItems.removeClass('active');
	                    $($dailyRunDownItems[currentArrayIndex]).addClass('active', 200);
	                }
	                currentArrayIndex++;
	                dailyRunDown.intervalShowOneByOne = setTimeout(arguments.callee,dailyRunDown.options.timePerOne);
	            };
		    }	
//		    DailyRunDown.appendFoot(dailyRunDown);
		},
   		appendFoot : function (dailyRunDown){
			var dailyRunDownListFoot = $('.dailyrundown-container').find('.dailyrundown-list-foot');
			var totalDatas;
			if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
				totalDatas = dailyRunDown.segNameNewsClip[dailyRunDown.oldColumn].length;	
			}
			if($('#orgSel').find('option:selected').val() == "城市频道"){
				totalDatas = dailyRunDown.segNameCityClip[dailyRunDown.oldColumn].length;	
			}
			var totalPages = dailyRunDown.dailyRunDownPageArray.length;
			var currentPage = dailyRunDown.pageIndex;
			var currentPageArray = [];
			dailyRunDownListFoot.empty();
	    	var html='共查询到<span class="dailyrundown-list-foot-count">'+totalDatas+'</span>条信息，共'+ totalPages +'页，当前第<span class="dailyrundown-list-foot-current">'+currentPage+'</span>页'+
	    			  '<a  class="pagePrevious" href="javascript:void(0)"> 上一页</a>'+'<a  class="pageNext" href="javascript:void(0)"> 下一页</a>'
	    	dailyRunDownListFoot.append(html);
	    	
	    	$('.pagePrevious').click(function(){
	    		clearTimeout(dailyRunDown.intervalPage);
	    		clearTimeout(dailyRunDown.intervalShowOneByOne);
	    		dailyRunDown.pageIndex= dailyRunDown.pageIndex-2;
	    		currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
	            if($('#orgSel').find('option:selected').val() == "城市频道"){
	            	DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
	            }
	            if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
	            	DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
	            }
	            dailyRunDown.pageIndex++;
	            
	            dailyRunDown.intervalPage = setTimeout(timeOutFun,dailyRunDown.options.timePerPage);
	            function timeOutFun() {
		            if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		            	dailyRunDown.pageIndex = 0;
		            }
		            currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
		            if($('#orgSel').find('option:selected').val() == "城市频道"){
		            	DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
		            }
		            if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
		            	DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		            }
//		            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		            dailyRunDown.pageIndex++;
		            dailyRunDown.intervalPage = setTimeout(arguments.callee,dailyRunDown.options.timePerPage);//每页切换的时间
		        };
	    	})
	    	$('.pageNext').click(function(){
	    		clearTimeout(dailyRunDown.intervalPage);
	    		clearTimeout(dailyRunDown.intervalShowOneByOne);
	    		if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
	            	dailyRunDown.pageIndex = 0;
	            }
	    		currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
	            if($('#orgSel').find('option:selected').val() == "城市频道"){
	            	DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
	            }
	            if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
	            	DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
	            }
	            dailyRunDown.pageIndex++;
	            
	            dailyRunDown.intervalPage = setTimeout(timeOutFun,dailyRunDown.options.timePerPage);
	            function timeOutFun() {
		            if (dailyRunDown.pageIndex >= dailyRunDown.dailyRunDownPageArray.length) {
		            	dailyRunDown.pageIndex = 0;
		            }
		            currentPageArray = dailyRunDown.dailyRunDownPageArray[dailyRunDown.pageIndex].slice();
//		            DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		            if($('#orgSel').find('option:selected').val() == "城市频道"){
		            	DailyRunDown.clearItems(DailyRunDown.appendCityItems, dailyRunDown, currentPageArray);
		            }
		            if($('#orgSel').find('option:selected').val() == "融媒体新闻中心"){
		            	DailyRunDown.clearItems(DailyRunDown.appendItems, dailyRunDown, currentPageArray);
		            }		            
		            dailyRunDown.pageIndex++;
		            dailyRunDown.intervalPage  = setTimeout(arguments.callee,dailyRunDown.options.timePerPage);//每页切换的时间
		        };
	    	})	 
	    	if(dailyRunDown.pageIndex == totalPages){
	    		$('a.pageNext').removeAttr("href");
	    		$('a.pageNext').unbind("click")
	    	}
	    	if(dailyRunDown.pageIndex == 1){
	    		$('a.pagePrevious').removeAttr("href");
	    		$('a.pagePrevious').unbind("click")
	    	}
		}
}

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	DailyRunDown.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
//    setTimeout(function(){
//    	location.reload();
//    },170000)
});