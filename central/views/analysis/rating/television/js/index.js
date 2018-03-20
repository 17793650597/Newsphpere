
var AnalysisRating = {
    createNew: function(opts) {
		var opts_default = {
				dayChartsContainer:  $('.rating-detail-pane > .content'),
				interval: 60000
			};
		var analysisRate={};
		analysisRate.options = $.extend(true, opts_default, opts);
		AnalysisRating.getdayChatData(analysisRate, AnalysisRating.getDayChatDataCallback);
		window.addEventListener("resize", function () {
			analysisRate.dayChart.resize();
	     });
		setInterval(function() {
			AnalysisRating.getdayChatData(analysisRate);
		}, analysisRate.options.interval);
		return analysisRate;
    },
/*    updateDate:function(){
    	var clockArea = $('.rating-detail-pane .rating-day').find('.title');
		var nowaDay;
        function dateFormat(date, formatStr) {
    		var str = formatStr;
    		var Week = [ '日', '一', '二', '三', '四', '五', '六' ];
    		str = str.replace(/yyyy|YYYY/, date.getFullYear());
    		str = str
    				.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date
    						.getYear() % 100).toString() : '0'
    						+ (date.getYear() % 100));

    		str = str.replace(/MM/, (date.getMonth()+1) > 9 ? (date.getMonth()+1)
    				.toString() : '0' + (date.getMonth()+1));
    		str = str.replace(/M/g, date.getMonth());

    		str = str.replace(/w|W/g, Week[date.getDay()]);

    		str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate()
    				.toString() : '0' + date.getDate());
    		str = str.replace(/d|D/g, date.getDate());

    		str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes()
    				.toString() : '0' + date.getMinutes());
    		str = str.replace(/m/g, date.getMinutes());

    		str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date
    				.getSeconds().toString() : '0' + date.getSeconds());
    		str = str.replace(/s|S/g, date.getSeconds());

    		if (date.getHours() > 12 && str.indexOf('ap' >= 0)) {
    			str = str.replace(/hh|HH/, date.getHours() - 12);
    			str = str.replace(/h|H/g, date.getHours() - 12);
    			str = str.replace('ap', 'pm');
    		} else if(str.indexOf('ap') >= 0){
    			str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    			str = str.replace(/h|H/g, date.getHours());
    			str = str.replace('ap', 'am');
    		} else{
    			str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours());
    			str = str.replace(/h|H/g, date.getHours());
    		}
    		
    		return str;
    	};
    	
    	function update(){
			nowaDay = new Date();
			clockArea.find('.day').text(dateFormat(nowaDay, 'yyyy年MM月dd日'));
		};
		update();
    },*/
    getdayChatData:function(analysisRate, callback){
    	CentralProxy.getExcel("audienceRating", function(resp){ 		
    		if(callback && typeof callback == 'function'){
    			callback(resp, analysisRate);
    		}
    	});
//    	var data=[
//    	          [{       
//	        	 		"name": "湖南",
//	        	 		"value": 0.804,
//					},{
//						"name": "浙江",
//						"value": 0.776
//					},{
//						"name": "东方",
//						"value": 0.674,
//					},{
//						"name": "北京",
//						"value": 0.603,
//					},{
//						"name": "江苏",
//						"value": 0.602,
//					},{
//						"name": "安徽",
//					    "value": 0.524,
//					},{
//						"name": "深圳",
//					    "value": 0.33,
//					},{
//						"name": "天津",
//					    "value": 0.306,
//					},{
//						"name": "辽宁",
//					    "value": 0.29,
//					},{
//						"name": "湖北",
//					    "value": 0.257,
//					}],
//					[{
//				    	"name": "湖南",
//			    		"value": 2.939,
//			    	},{
//			    		"name": "浙江",
//			        	"value": 2.838
//			    	},{
//			    		"name": "东方",
//			        	"value": 2.465,
//			    	},{
//			    		"name": "北京",
//			    		"value": 2.204,
//			    	},{
//			    		"name": "江苏",
//			    	    "value": 2.203,
//			    	},{
//			    		"name": "安徽",
//			    	    "value": 1.553,
//			    	},{
//			    		"name": "深圳",
//			    	    "value": 1.208,
//			    	},{
//						"name": "天津",
//					    "value": 1.121,
//					},{
//						"name": "辽宁",
//					    "value": 1.062,
//					},{
//						"name": "湖北",
//					    "value": 0.94,
//					}],
//    	          ];
//    	if(analysisRate){
//    		var analysisRateJson = []
//    		analysisRateJson = data; 
//    		AnalysisRating.getDayChatDataCallback(analysisRateJson, analysisRate);
//    	}
    },
    getDayChatDataCallback:function(analysisRateJson, analysisRate){
    	analysisRate.analysisRateJson = analysisRateJson;
    	AnalysisRating.processData(analysisRate);
    },
    processData: function(analysisRate){
    	if(!analysisRate.analysisRateJson) {
			return;
		}
    	var sheetListTmp = [];  //存放表格数据
    	analysisRate.televisionArray = [];
    	analysisRate.televisionName = []; //频道名称
    	analysisRate.televisionRate = []; //收视率
    	analysisRate.televisionMarket = [];//市场份额
    	var sheetListData = analysisRate.analysisRateJson.result.sheetList[2];
    	if(analysisRate.analysisRateJson.result && sheetListData){
    		sheetListTmp = sheetListData.rowList;
    	}
    	for(var i = 1; i < sheetListTmp.length; i++){
    		analysisRate.televisionArray.push(sheetListTmp[i]);
    	}
//        AnalysisRating.appendAllItem(analysisRate);
    	analysisRate.televisionArray = analysisRate.televisionArray.slice(0,10)
        $(analysisRate.televisionArray).each(function(index, row){
        	rowNew = row[1].length <= 6? row[1] : row[1].substring(0,6)+"...";
        	analysisRate.televisionName.push(rowNew);
        	analysisRate.televisionRate.push(row[4]);
        	analysisRate.televisionMarket.push(row[5]);        	
        })
      
    	var dayChart;
    	if(!analysisRate.dayChart){
        	var dom = analysisRate.options.dayChartsContainer[0];
        	dayChart = echarts.init(dom);
        	analysisRate.dayChart =dayChart;
    	}else{
    		dayChart = analysisRate.dayChart;
    	}
    	dayChart.option = AnalysisRating.updateDayChat(analysisRate);
//    	var sourceData = null;
//        $(window).on('message', function(event) {
//        	sourceData = event.originalEvent.data;
//            if(sourceData){
//            	dayChart.setOption(dayChart.option);       
//            }
//            if (dayChart.intervalAnim) {
//            	clearInterval(dayChart.intervalAnim);
//            }
//            dayChart.intervalAnim = setInterval(function(){
//	             var temp0 = dayChart.option.series[0].data;
//	             var temp1 = dayChart.option.series[1].data;
//	             dayChart.option.series[0].data = [];
//	             dayChart.option.series[1].data = [];
//	             dayChart.setOption(dayChart.option);
//	             dayChart.option.series[0].data = temp0;
//	             dayChart.option.series[1].data = temp1;
//	             dayChart.setOption(dayChart.option);
//            },6000)    
//        });
    	dayChart.setOption(dayChart.option);
        if (dayChart.intervalAnim) {
        	clearInterval(dayChart.intervalAnim);
        }
        dayChart.intervalAnim = setInterval(function(){
             var temp0 = dayChart.option.series[0].data;
             var temp1 = dayChart.option.series[1].data;
             dayChart.option.series[0].data = [];
             dayChart.option.series[1].data = [];
             dayChart.setOption(dayChart.option);
             dayChart.option.series[0].data = temp0;
             dayChart.option.series[1].data = temp1;
             dayChart.setOption(dayChart.option);
        },6000)    
		clearTimeout(test);
		var test = setTimeout(function(){
			dayChart.resize();
		},500);

        var $pages = $('#pt-main').children('div.pt-page');
        var pgOpts = {
            	container : $('#pt-main'),
            	$pages : $pages,
    			animcursor : 66,
    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
    			autoChange: false
    		};
        analysisRate.pageTransitions = PageTransitions.createNew(pgOpts);
        analysisRate.pageTransitions.init();
        analysisRate.pageTransitions.nextPage(pgOpts.animcursor);
	
    },
    updateDayChat: function(analysisRate){

    	var	option = {
				animationDuration: 1500,
				animationDurationUpdate: 1000,
                title: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                legend: {
	            	 left: '52%',
	                 top: '0%',
	                 data: [{
						    name: '收视率%',
						    icon : 'bar',
						    textStyle: {color:'#ffffff',fontSize:24}
					  },
					  {
						    name: '市场份额%',
						    icon : 'bar',
						    textStyle: {color:'#ffffff',fontSize:24}
					  }]
                },
                grid:{
                	bottom:120
                },
    		    toolbox: {
    		        show : true
    		    },
    		    calculable: true,
    		    xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    splitLine: {
    	                show: false,
                    },
                    axisLabel: {
                        show: true,
                        interval: 0,
//                        rotate: 25,
                        textStyle: {
                            fontSize: 20,
                           	color: '#11afd2',
                           	fontFamily: 'Microsoft YaHei',
                           	fontWeight: 'bold'
                        }
                    },
                    axisLine:{
                    	 show: true,
                    	 lineStyle: {
                    		 color: "#01ffff",
                    		 width: 3,
                    		 type: 'solid'
                    	 } 
                    },
                    data: []
                },
    		    yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            fontSize: 20,
                            color: '#11afd2',
                            fontFamily: 'Microsoft YaHei',
                            fontWeight: 'bold'
                        }
                    },
                    axisLine:{
                         show: true,
                         lineStyle: {
                             color: "#01ffff",
                             width: 3,
                             type: 'solid'
                     } 
                   },
                    splitLine: {
                        show: true,
                    }
                },
    		    series: [
    		        {
    		            name: '收视率%',
    		            type: 'bar',
                        barGap: '5%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#cf9d24',
                                borderWidth: 8,
                                borderType: 'solid',
                            }
                        },
    		            data: []
    		            
    		        },
    		        {
    		            name: '市场份额%',
    		            type: 'bar',
                        barGap: '5%',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#d75150',
                                borderWidth: 8,
                                borderType: 'solid',
                                label: {
                                	show: true,
                                }
                            }
                        },
    		            data: []
    		
    		        }
    		    ]
    		};
    		                  
//		var data0 = analysisRate.analysisRateJson[0];
//		var data1 = analysisRate.analysisRateJson[1];
//		var xAxisData = [];
//		for(var i in data0){
//			xAxisData.push(data0[i].name);
//		}
		option.series[0].data = analysisRate.televisionRate;
		option.series[1].data = analysisRate.televisionMarket;
		option.xAxis.data = analysisRate.televisionName;
//		option.xAxis.data = ["看见大市口","法治进行时","西津渡文化旅游有限责任公司新闻镇江","d","e","f","g","o","5","y"]
	    return option;
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	AnalysisRating.createNew({
		dayChartsContainer:  $('.content'),
		interval: 60000
	});
    $('.area').click(function(){
    	Utils.setPageLocation();
    });
    $('body').focus();
//	AnalysisRating.updateDayChat();
//	AnalysisRating.updateWeekChat();
});

