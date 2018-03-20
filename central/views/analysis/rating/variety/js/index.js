
/**
 * 收视率页面
 */
var AnalysisRating = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.analysis-rating-page'),
            queryInterval: 60000,
            animcursor: 66,
            queryParam: {
            	"accessToken": "05784E32D86340D976677714905E6D53B2E0",
            	"timeStamp": new Date().getTime(),
            	"timeUnit":"day",
            	"sortKey":"praisedCount"
            		}
        };
        var analysisRate = {};
        analysisRate.options = $.extend(true, opts_default, opts);
        AnalysisRating.initDateAndBtns(analysisRate);
        AnalysisRating.loadData(analysisRate, AnalysisRating.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        analysisRate.intervalQuery = setInterval(function() {
            AnalysisRating.loadData(analysisRate, AnalysisRating.loadDataCallBack);
        }, analysisRate.options.queryInterval);
        return analysisRate;
    },
    
    loadDataCallBack: function(analysisRateJson, analysisRate) {
        analysisRate.analysisRateJson = analysisRateJson;
        AnalysisRating.processData(analysisRate);
    },
    
    loadData: function(analysisRate, callback) {
//    	var loadCallback = function(resp) {
//            var analysisRateArray = [];
//            if(resp.code != 0){
//            	return;
//            }
//            var analysisRateArray = [];
//            $(resp.data.result).each(function(index, row) {
//            	if(index > 9){
//            		return;
//            	}
//                analysisRateArray.push(row);
//            });
//            if (callback && typeof callback == 'function') {
//                callback(analysisRateArray, analysisRate);
//            }
//        };
        
    	CentralProxy.getExcel("audienceRating", function(resp){ 		
    		if(callback && typeof callback == 'function'){
    			callback(resp, analysisRate);
    		}
    	});
//    	CentralProxy.getWeixinRank(wechatBillboard.options.queryParam, loadCallback);
    	//假数据
//        var resp = {
//        		"message": "处理成功",
//        		"data": {
//        			"result": [{
//        				"commentNum": 3.272,
//        				"rank": 1,
//        				"nickName": "中国新歌声",
//        				"activityCount": "浙江卫视",
//        				"marketCount": 11.763
//        			}, {
//        				"commentNum": 2.07,
//        				"rank": 2,
//        				"nickName": "笑傲江湖第3季",
//        				"activityCount": "东方卫视",
//        				"marketCount": 7.276
//        			}, {
//        				"commentNum": 1.762,
//        				"rank": 3,
//        				"nickName": "真声音",
//        				"activityCount": "浙江卫视",
//        				"marketCount": 10.643
//        			}, {
//        				"commentNum": 1.63,
//        				"rank": 4,
//        				"nickName": "快乐大本营",
//        				"activityCount": "湖南卫视",
//        				"marketCount": 4.922
//        			}, {
//        				"commentNum": 1.418,
//        				"rank": 5,
//        				"nickName": "我们来了",
//        				"activityCount": "湖南卫视",
//        				"marketCount": 4.227
//        			}, {
//        				"commentNum": 1.255,
//        				"rank": 6,
//        				"nickName": "笑傲江湖第3季前传",
//        				"activityCount": "东方卫视",
//        				"marketCount": 3.587
//        			}, {
//        				"commentNum": 1.252,
//        				"rank": 7,
//        				"nickName": "我们的法则",
//        				"activityCount": "安徽卫视",
//        				"marketCount": 4.407
//        			}, {
//        				"commentNum": 1.236,
//        				"rank": 8,
//        				"nickName": "缘来非诚勿扰",
//        				"activityCount": "江苏卫视",
//        				"marketCount": 4.516
//        			}, {
//        				"commentNum": 1.234,
//        				"rank": 9,
//        				"nickName": "花样男团",
//        				"activityCount": "东方卫视",
//        				"marketCount": 3.738
//        			}, {
//        				"commentNum": 1.064,
//        				"rank": 10,
//        				"nickName": "说出我的世界",
//        				"activityCount": "江苏卫视",
//        				"marketCount": 4.887
//        			}],
//        			"totalCount": 10
//        		},
//        		"code": "0"
//        	};
//        loadCallback(resp);
    },
    processData: function(analysisRate){
    	if(!analysisRate.analysisRateJson) {
			return;
		}
    	var sheetListTmp = [];  //存放表格数据
//    	var varietyArray = [];  //存放去除表格抬头后的数据
//    	var varietyObjTmp = {}; //临时数据，用于将读取到的数组转化成对象
//    	analysisRate.varietyObj = []; //保存对象
    	analysisRate.varietyArray = [];
    	var sheetListData = analysisRate.analysisRateJson.result.sheetList[0];
    	if(analysisRate.analysisRateJson.result && sheetListData){
    		sheetListTmp = sheetListData.rowList;
    	}
    	for(var i = 1; i < 11; i++){
//    		varietyArray.push(sheetListTmp[i]);	
    		analysisRate.varietyArray.push(sheetListTmp[i]);
    	}
//    	for(var i = 0; i < varietyArray.length; i++){
//    		var varietyObjTmp = {}; //临时数据，用于将读取到的数组转化成对象
//    		varietyObjTmp.rank = varietyArray[i][0];
//    		varietyObjTmp.nickName = varietyArray[i][1];
//    		varietyObjTmp.tvName = varietyArray[i][2];
//    		varietyObjTmp.commentNum = varietyArray[i][3];
//    		varietyObjTmp.marketCount = varietyArray[i][4];
////    		analysisRate.varietyObj.push(varietyObjTmp);
//    		analysisRate.varietyObj[analysisRate.varietyObj.length] = varietyObjTmp;
//    	}
        AnalysisRating.appendAllItem(analysisRate);
    },
    initDateAndBtns: function(analysisRate){
    	var $time = analysisRate.options.container.find('.up .title');
    	$time.text("综合排行");
    },
    
    appendAllItem: function(analysisRate) {

        
        function makeAnalysisRateHtml(row) {
            var html = '<div class="item">\
					        <div class="ranking col-xs-2">\
								<div class="ranking-card">&nbsp;</div>\
								<div class="ranking-no">1</div>\
							</div>\
				            <div class="data col-xs-10">\
				    			<div class="name col-xs-4"></div>\
            					<div class="des col-xs-4"></div>\
				           		<div class="activity-count col-xs-2"></div>\
				           		<div class="spread-count col-xs-2"></div>\
				           		<div class="watcher-count col-xs-2"></div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingClass;
//            switch (row.dataChange) {
//			case 0:
//				raisingClass = "glyphicon-record";
//				break;
//			case 1:
//				raisingClass = "glyphicon-arrow-up";
//				break;
//			case -1:
//				raisingClass = "glyphicon-arrow-down";
//				break;
//			default:
//				break;
//			}
//            $html.find('.ranking-no').text(row.rank);
//            $html.find('.name').text(row.nickName);
//            $html.find('.activity-count').text(row.tvName);
//            $html.find('.spread-count').text(row.commentNum);
//            $html.find('.watcher-count').text(row.marketCount);
				$html.find('.ranking-no').text(parseInt(row[0]));
				$html.find('.name').text(row[1]);
				$html.find('.des').text(row[2]);
				$html.find('.activity-count').text(row[3]);
				$html.find('.spread-count').text(row[5]);
				$html.find('.watcher-count').text(row[6]);
//            $html.find('.raising')
//            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
//            			.addClass(raisingClass);
            return $html;
        }
        ;
    	
    	var listContainer = analysisRate.options.container.find('.gallery-wechat-billboard');
    	listContainer.find('.pt-page').removeClass('pt-page-current');
    	var varietyArray = analysisRate.varietyArray;
    	var analysisRateList = $('<div class="wechat-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
    	
    	if(analysisRate.intervalShowOneByOne){
    		clearInterval(analysisRate.intervalShowOneByOne);
    	}
    	if (varietyArray.length == 0) {
            analysisRateList.append('<span>暂无数据</span>');
//            return;
        }
        
        $(varietyArray).each(function(index, row) {
            var html = makeAnalysisRateHtml(row);
            analysisRateList.append(html);
        });
    	
        analysisRateList.appendTo(listContainer);
        if(listContainer.children('div.pt-page').length>3){
        	listContainer.children('div.pt-page')[0].remove();
        }
        if(analysisRate.pageTransitions){
        	analysisRate.pageTransitions.stop();
        }
        var $pages = $('#pt-main').children('div.pt-page');
        var pgOpts = {
            	container : $('#pt-main'),
            	$pages : $pages,
    			animcursor : analysisRate.options.animcursor,
    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
    			autoChange: false
    		};
        analysisRate.pageTransitions = PageTransitions.createNew(pgOpts);
        analysisRate.pageTransitions.init();
        analysisRate.pageTransitions.nextPage(pgOpts.animcursor);
        startShowOneByOne();
        function startShowOneByOne() {
        	if(analysisRate.intervalShowOneByOne){
            	clearInterval(analysisRate.intervalShowOneByOne);
            }
            var $analysisRateItems = analysisRateList.find('.item');
            $analysisRateItems.removeClass('active');
            var currentArrayIndex = 0;
            $($analysisRateItems[currentArrayIndex]).addClass('active', 300);
            currentArrayIndex++;
            analysisRate.intervalShowOneByOne = setInterval(function() {
                if (currentArrayIndex >= $analysisRateItems.length) {
                    currentArrayIndex = 0;
                }
                if (analysisRateList.find('.item.active').length > 0) {
                    var tempIndex = currentArrayIndex;
                    analysisRateList.find('.item.active').removeClass('active', 100, function() {
                        $($analysisRateItems[tempIndex]).addClass('active', 200);
                    });
                } else {
                    $($analysisRateItems[currentArrayIndex]).addClass('active', 200);
                }
                currentArrayIndex++;
            }, 3000);
        }
        ;
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	AnalysisRating.createNew();
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
});


//1220之前的收视率版本
//var AnalysisRating = {
//    createNew: function(opts) {
//		var opts_default = {
//				dayChartsContainer:  $('.rating-day > .content'),
//				weekChartsContainer: $('.rating-week > .content'),
//				interval: 60000
//			};
//		var analysisRate={};
//		analysisRate.options = $.extend(true, opts_default, opts);
//		AnalysisRating.updateDate();
//		AnalysisRating.getdayChatData(analysisRate);
//		AnalysisRating.getWeekChatData(analysisRate);
//		window.addEventListener("resize", function () {
//			analysisRate.dayChart.resize();
//			analysisRate.weekChart.resize();
//	     });
//    },
//    updateDate:function(){
//    	var clockArea = $('.rating-detail-pane .rating-day').find('.title');
//		var nowaDay;
//        function dateFormat(date, formatStr) {
//    		var str = formatStr;
//    		var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
//    		str = str.replace(/yyyy|YYYY/, date.getFullYear());
//    		str = str
//    				.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date
//    						.getYear() % 100).toString() : '0'
//    						+ (date.getYear() % 100));
//
//    		str = str.replace(/MM/, (date.getMonth()+1) > 9 ? (date.getMonth()+1)
//    				.toString() : '0' + (date.getMonth()+1));
//    		str = str.replace(/M/g, date.getMonth());
//
//    		str = str.replace(/w|W/g, Week[date.getDay()]);
//
//    		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate()
//    				.toString() : '0' + date.getDate());
//    		str = str.replace(/d|D/g, date.getDate());
//
//    		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes()
//    				.toString() : '0' + date.getMinutes());
//    		str = str.replace(/m/g, date.getMinutes());
//
//    		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date
//    				.getSeconds().toString() : '0' + date.getSeconds());
//    		str = str.replace(/s|S/g, date.getSeconds());
//
//    		if (date.getHours() > 12 && str.indexOf('ap' >= 0)) {
//    			str = str.replace(/hh|HH/, date.getHours() - 12);
//    			str = str.replace(/h|H/g, date.getHours() - 12);
//    			str = str.replace('ap', 'pm');
//    		} else if(str.indexOf('ap') >= 0){
//    			str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
//    			str = str.replace(/h|H/g, date.getHours());
//    			str = str.replace('ap', 'am');
//    		} else{
//    			str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
//    			str = str.replace(/h|H/g, date.getHours());
//    		}
//    		
//    		return str;
//    	};
//    	
//    	function update(){
//			nowaDay = new Date();
//			clockArea.find('.day').text(dateFormat(nowaDay, 'yyyy年MM月dd日'));
//		};
//		update();
//    },
//    getdayChatData:function(analysisRate){
//    	var data=[
//    	          [{       
//	        	 		"name":"",
//	        	 		"value":2,
//					},{
//						"name":"",
//						"value":2.2
//					},{
//						"name":"",
//						"value":1.2,
//					},{
//						"name":"",
//						"value": 2,
//					},{
//						"name":"",
//					    "value": 6,
//					},{
//						"name":"",
//					    "value":1.5,
//					},{
//						"name":"",
//					    "value":0.8,
//					},{
//						"name":"",
//					    "value":2.4,
//					},{
//						"name":"",
//					    "value":2,
//					},{
//						"name":"",
//					    "value":1.5,
//					},{
//						"name":"",
//					    "value":0.2,
//				  }],
//					[{
//				    	"name":"",
//			    		"value":4,
//			    	},{
//			    		"name":"",
//			        	"value":3.1
//			    	},{
//			    		"name":"",
//			        	"value":3.8,
//			    	},{
//			    		"name":"",
//			    		"value": 4,
//			    	},{
//			    		"name":"",
//			    	    "value": 0.5,
//			    	},{
//			    		"name":"",
//			    	    "value":2.5,
//			    	},{
//			    		"name":"",
//			    	    "value":1.1,
//			    	},{
//						"name":"",
//					    "value":2.5,
//					},{
//						"name":"",
//					    "value":4,
//					},{
//						"name":"",
//					    "value":1.9,
//					},{
//						"name":"",
//					    "value":0.2,
//			    	}],
//    	          ];
//
//    	if(analysisRate){
//    		analysisRate.dayChartsData = data;
//    		AnalysisRating.getDayChatDataCallback(analysisRate);
//    	}
//    },
//    getDayChatDataCallback:function(analysisRate){
//    	AnalysisRating.updateDayChat(analysisRate);
//    },
//    updateDayChat: function(analysisRate){
//    	var dayChart;
//    	if(!analysisRate.dayChart){
//        	var dom = analysisRate.options.dayChartsContainer[0];
//        	dayChart = echarts.init(dom);
//        	analysisRate.dayChart =dayChart;
//    	}else{
//    		dayChart = analysisRate.dayChart;
//    	}
//
//        var option = {
//            title: {
//                show: false
//            },
//            tooltip: {
//            	show:false
//            },
//            legend: {
//                left:'52%',
//                top:'0%',
//                data:[{
//						    name:'江苏新闻综合频道',
//						    icon : 'bar',
//						    textStyle:{color:'#ddfcff',fontSize:24}
//					  },
//					  {
//						    name:'江苏社会经济频道',
//						    icon : 'bar',
//						    textStyle:{color:'#ddfcff',fontSize:24}
//					  }]
//            },
//            xAxis: {
//                type: 'category',
//                boundaryGap: true,
//                splitLine: {
//	                show: false,
//                },
//                axisLabel: {
//                    show: true,
//                    textStyle: {
//                        fontSize: 20,
//                       	color:'#11afd2',
//                       	fontFamily:'微软雅黑',
//                       	fontWeight:'bold'
//                    }
//                },
//                axisLine:{
//                	 show:true,
//                	 lineStyle:{
//                		 color:"#01ffff",
//                		 width:3,
//                		 type:'solid'
//                	 } 
//                },
//                data: ['04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00']
//            },
//            yAxis: {
//                type: 'value',
//                axisLabel: {
//                    show: true,
//                    textStyle: {
//                        fontSize: 20,
//                       	color:'#11afd2',
//                       	fontFamily:'微软雅黑',
//                       	fontWeight:'bold'
//                    }
//                },
//                axisLine:{
//               	     show:true,
//               	     lineStyle:{
//               		     color:"#01ffff",
//               		     width:3,
//               		     type:'solid'
//               	 } 
//               },
//                splitLine: {
//	                show: true,
//                }
//            },
//            series: [
//               {
//	                name: '江苏新闻综合频道',
//	                type: 'line',
//	                symbol:'circle',
//	                symbolSize:'14',
//	                lineStyle : {
//						normal: {
//							color: '#cf9d24',
//							width: 4,
//							type: 'solid',
//							opacity: 1,
//							}
//					},
//					itemStyle:{
//					    normal:{
//					       color: '#cf9d24',
//					       borderWidth: 8,
//					       borderType:'solid'
//					    }
//					},
//	                data: []
//               },
//               {
//	                name: '江苏社会经济频道',
//	                type: 'line',
//	                symbol:'circle',
//	                symbolSize:'14',
//	                lineStyle : {
//						normal: {
//							color: '#d75150',
//							width: 4,
//							type: 'solid',
//							opacity: 1,
//							}
//					},
//					itemStyle:{
//					    normal:{
//					       color: '#d75150',
//					       borderWidth: 8,
//					       borderType:'solid'
//					    }
//					},
//	                data: []
//              },
//            ]
//        };
//		var data0 = analysisRate.dayChartsData[0];
//		var data1 = analysisRate.dayChartsData[1];
//		option.series[0].data = data0;
//		option.series[1].data = data1;
//		dayChart.setOption(option);
//		dayChart.option = option;
//	    return dayChart;
//    },
//    getWeekChatData:function(analysisRate){
//	    	var data=[
//	    	          [{       
//    	        	 		"name":"",
//    	        	 		"value":2,
//						},{
//							"name":"",
//							"value":2.2
//						},{
//							"name":"",
//							"value":1.2,
//						},{
//							"name":"",
//							"value": 2,
//						},{
//							"name":"",
//						    "value": 1.5,
//						},{
//							"name":"",
//						    "value":1.8,
//						},{
//							"name":"",
//						    "value":0.8,
//					  }],
//						[{
//					    	"name":"",
//				    		"value":4,
//				    	},{
//				    		"name":"",
//				        	"value":3.1
//				    	},{
//				    		"name":"",
//				        	"value":3.8,
//				    	},{
//				    		"name":"",
//				    		"value": 4,
//				    	},{
//				    		"name":"",
//				    	    "value": 0.5,
//				    	},{
//				    		"name":"",
//				    	    "value":2.5,
//				    	},{
//				    		"name":"",
//				    	    "value":2.1,
//				    	}],
//	    	          ];
//    	if (analysisRate) {
//    		analysisRate.weekChartsData = data;
//    		AnalysisRating.getWeekChatDataCallback(analysisRate);
//        }
//    },
//    getWeekChatDataCallback:function(analysisRate){
//    	AnalysisRating.updateWeekChat(analysisRate)
//    },
//    
//    updateWeekChat: function(analysisRate){
//    	var weekChart;
//        if(!analysisRate.weekChart){
//        	var dom = analysisRate.options.weekChartsContainer[0];
//            weekChart = echarts.init(dom);
//            analysisRate.weekChart=weekChart;
//        }else{
//        	weekChart = analysisRate.weekChart;
//        }
//
//        // 指定图表的配置项和数据
//        var option = {
//            title: {
//                show: false
//            },
//            tooltip: {
//            	show:false
//            },
//            legend: {
//                left:'52%',
//                top:'0%',
//            	data:[{
//				    name:'江苏新闻综合频道',
//				    icon : 'bar',
//				    textStyle:{ color:'#ddfcff',fontSize:24}
//            		},
//            		{
//				    name:'江苏社会经济频道',
//				    icon : 'bar',
//				    textStyle:{color:'#ddfcff',fontSize:24}
//            		}]
//            },
//            xAxis: {
//                type: 'category',
//                boundaryGap: true,
//                splitLine: {
//	                show: false,
//                },
//                axisLabel: {
//                    show: true,
//                    textStyle: {
//                        fontSize: 20,
//                       	color:'#11afd2',
//                       	fontFamily:'微软雅黑',
//                       	fontWeight:'bold'
//                    }
//                },
//                axisLine:{
//              	     show:true,
//              	     lineStyle:{
//              		     color:"#01ffff",
//              		     width:3,
//              		     type:'solid'
//              	    } 
//                },
//                data: ['周一','周二','周三','周四','周五','周六','周日']
//            },
//            yAxis: {
//                type: 'value',
//                axisLabel: {
//                    show: true,
//                    textStyle: {
//                        fontSize: 20,
//                       	color:'#11afd2',
//                       	fontFamily:'微软雅黑',
//                       	fontWeight:'bold'
//                    }
//                },
//                axisLine:{
//              	     show:true,
//              	     lineStyle:{
//              		     color:"#01ffff",
//              		     width:3,
//              		     type:'solid'
//              	     } 
//                },
//                splitLine: {
//	                show: true,
//                }
//            },
//            series: [
//               {
//	                name: '江苏新闻综合频道',
//	                type: 'line',
//	                symbol:'circle',
//	                symbolSize:'14',
//	                lineStyle : {
//						normal: {
//							color: '#cf9d24',
//							width: 4,
//							type: 'solid',
//							opacity: 1,
//							}
//					},
//					itemStyle:{
//					    normal:{
//					       color: '#cf9d24',
//					       borderWidth: 8,
//					       borderType:'solid'
//					    }
//					},
//	                data: []
//               },
//               {
//	                name: '江苏社会经济频道',
//	                type: 'line',
//	                symbol:'circle',
//	                symbolSize:'14',
//	                lineStyle : {
//						normal: {
//							color: '#d75150',
//							width: 4,
//							type: 'solid',
//							opacity: 1,
//							}
//					},
//					itemStyle:{
//					    normal:{
//					       color: '#d75150',
//					       borderWidth: 8,
//					       borderType:'solid'
//					    }
//					},
//	                data: []
//              },
//            ]
//        };
//        
//		var data0 = analysisRate.weekChartsData[0];
//		var data1 = analysisRate.weekChartsData[1];
//		option.series[0].data = data0;
//		option.series[1].data = data1;
//        weekChart.setOption(option);
//        weekChart.option=option;
//    	return weekChart;
//    }
//
//};

//$(function() {
//	Utils.setBgCSS();
//	Utils.setPageFontSize(1920);
//	AnalysisRating.createNew();
//    $('.area').click(function(){
//    	Utils.setPageLocation();
//    });
//});
