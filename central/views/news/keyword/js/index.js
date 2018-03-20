/*
 * 关键词报道 （朗视提供数据）
 * */
var ReportStatistics = {
    getData: function (reportStatistics) {
//        var param = {
//                "date":"20171210",
//                "category":"",
//                "page":1,
//                "page_size":10,
//                "flag":"hourly"
//        }
//        param.category = reportStatistics.options.key;
        $('.loading').show();
    	var title = ModuleConfigHelper.getConfigByModuleName('ns.news.keyword').title || '关键词报道：';
    	$('.area-title').html(title);
        //最初的温岭接口 
//        CentralProxy.getKeywordid(param, function (resp) {
//        	if(JSON.parse(resp).RspBodyContent){
//        		topic_id = JSON.parse(resp).RspBodyContent[0].topic_id;
//        	}
//        	var pam = {
//        			"topicId":""
//        	}
//        	pam.topicId = topic_id;
//        	CentralProxy.keywordData(pam, function (resp) {
//        		var reportStatisticsList = [];
//        		var list = JSON.parse(resp).RspBodyContent.list;
//        		for(var i = 0; i < list.length; i++){
//        			var topList = list[i].top_list;
//        			for(var j = 0; j < topList.length; j++){
//        				var topSourceList = topList[j].top_source_list;
////        				var date = topList[j].date;
//        				if(topSourceList && topSourceList.length > 0){
//        					for(var k = 0; k < topSourceList.length; k++){
//            					var obj = {};
//            					obj.value = topSourceList[k].count;
//            					obj.name = topSourceList[k].from;
//            					
//            					var num = -1;
//            					if(reportStatisticsList.some(function(arrayObj, index){ //判断reportStatisticsList数组中是否存在该元素
//            						num = index;
//            						return arrayObj.name == obj.name;
//            					})){
//            						reportStatisticsList[num].value += obj.value;  //是，值相加
//            					}else{
//            						reportStatisticsList.push(obj);  //不是，放到reportStatisticsList数组中
//            					}
//            				}
//        				}
//        			}
//        		}
//        	reportStatisticsList.sort(function(a,b){
//        		return b.value - a.value;
//        	})
//      		if (reportStatistics) {
//      		   $('.loading').hide();
//               reportStatistics.data = reportStatisticsList;
//               ReportStatistics.getDataCallback(reportStatistics);
//            }
//        	})
//            
//        });
    	var param = {
    		"range":15,
    		"title":"徐仁标"
    	}
    	param.title = reportStatistics.options.key;
//    	CentralProxy.getPieData(param, function (resp) {
//    		 $('.loading').hide();
//    		var data = resp.data;
//    		var pieArray = [];
//    		
//    		for(var i = 1; i < 4; i++){
//    			var obj = {};
//    			if(i == 1){
//    				obj.name = "互联网新闻数量统计";
//    			}else if(i == 2){
//    				obj.name = "微信新闻数量统计";
//    			}else if(i == 3){
//    				obj.name = "微博新闻数量统计";
//    			}
//    			obj.value = data[i][0];
//    			pieArray.push(obj);
//    		}
//            setTimeout(function () {
//                window.onresize = function () {
//                    reportStatistics.pieChart.resize();
//                }
//            }, 200)
//    		reportStatistics.pieData = pieArray;
//    		ReportStatistics.createPie(reportStatistics);
//    	})
    	CentralProxy.getBarData(param, function (resp) {
    		 $('.loading').hide();
    		var data = resp.data;
    		var barArray = [];
    		for(var i = 0; i < data.length; i++){
    			var obj = {};
    			obj.name = data[i].kSource;
    			obj.value = data[i].sum_iCount;
    			barArray.push(obj);
    		}
    		reportStatistics.barData = barArray;
    		ReportStatistics.createBar(reportStatistics);
    		reportStatistics.pieData = barArray;
    		ReportStatistics.createPie(reportStatistics);
            setTimeout(function () {
                window.onresize = function () {
                    reportStatistics.barChart.resize();
                    reportStatistics.pieChart.resize();
                }
            }, 200)
    	})
    },
//    getDataCallback: function (reportStatistics) {
//        ReportStatistics.createPie(reportStatistics);
//        ReportStatistics.createBar(reportStatistics);
//        setTimeout(function () {
//            window.onresize = function () {
//                reportStatistics.pieChart.resize();
//                reportStatistics.barChart.resize();
//            }
//        }, 200)
//    },
    createPie: function (reportStatistics) {
        var pieChart;
        if (!reportStatistics.pieChart) {
            var dom = reportStatistics.options.pieContainer[0];
            pieChart = echarts.init(dom);
            reportStatistics.pieChart = pieChart;
        } else {
            pieChart = reportStatistics.pieChart;
        }
        var option = {
            animationDurationUpdate: 1500,
            animationDuration: 1500,
            animationEasing: 'BounceInOut',
            tooltip: {
                trigger: 'item',
                formatter: "{b} : {c}",
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '6%',
                right: '2%',
                bottom: '2%',
                top: '2%',
                containLabel: true
            },
            xAxis: [
                {
                    show: false,
                    type: 'value'
                }
            ],
            yAxis: [
                {
                    show: false,
                    type: 'category',
                    data: []
                }
            ],
            series: [
                {
//				            name:'两会',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['30%', '50%'],
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                formatter: "{b} : {c}",
                                textStyle: {
                                	fontStyle: 'normal',
                                	fontWeight: 'normal',
                                	fontSize: Utils.getEchartsFontSize(18, 1920),
                                	}
                            },
                            labelLine: {
                                show: true
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        var data = reportStatistics.pieData;
        option.yAxis[0].data = [];
        option.series[0].data = [];
        for (var i = 0; i < data.length && i < 10; i++) {
            var name = data[i].name;
            var value = data[i].value;
            option.series[0].data.splice(0, 0, {value: value, name: name});
        }
        pieChart.setOption(option);
    },
    createBar: function (reportStatistics) {
        var barChart;
        if (!reportStatistics.barChart) {
            var dom = reportStatistics.options.barContainer[0];
            barChart = echarts.init(dom);
            reportStatistics.barChart = barChart;
        } else {
            barChart = reportStatistics.barChart;
        }
        var option = {
            animationDurationUpdate: 1500,
            animationDuration: 1500,
            animationEasing: 'Linear',
            legend: {
                data: ['总量'],
                show: false
            },
            color: [
                '#fff', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
//				        formatter:"{b} : {c}"
            },
            grid: {
                left: '6%',
                right: '8%',
                bottom: '2%',
                top: '2%',
                containLabel: true
            },
            xAxis: [
                {
                    show: true,
                    type: 'value',
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#00e6ff',
                            type: 'dotted',
                            width: 1
                        }
                    },
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#00e6ff',
                            fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
                            fontSize: Utils.getEchartsFontSize(20, 1920),
                            fontStyle: 'normal',
                            fontWeight: 'normal'
                        }
                    },
                    splitNumber: 5
                }
            ],
            yAxis: [
                {
                    show: true,
                    type: 'category',
                    textStyle: {
                        color: '#00e6ff',
                        fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
                        fontSize: Utils.getEchartsFontSize(18, 1920),
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#00e6ff',
                            fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
                            fontSize: Utils.getEchartsFontSize(18, 1920),
                            fontStyle: 'normal',
                            fontWeight: 'normal'
                        }
                    },
                    data: []
                }
            ],
            series: [
                {
                    name: '总量',
                    type: 'bar',
                    stack: '总量',
//				            barGap: '50%',
                    barCategoryGap: '50%',
                    selectedMode: 'single',
                    itemStyle: {
                        normal: {
                            barBorderWidth: 0,
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                ];
                                return colorList[params.dataIndex]
                            },
                            label: {
                                show: true,
                                position: 'top'//insideRight
                            }
                        },
                        emphasis: {
                            barBorderWidth: 2,
                            barBorderColor: '#fff',
                            label: {
                                show: true,
                                position: 'outer'
                            }
                        }
                    },
                    data: []
                }
            ]
        };
        var data = reportStatistics.barData;
        option.yAxis[0].data = [];
        option.series[0].data = [];
        for (var i = 0; i < data.length && i < 10; i++) {
            var name = data[i].name;
            option.yAxis[0].data.splice(0, 0, name);
            var value = data[i].value;
            option.series[0].data.splice(0, 0, {value: value, name: name});
        }
        barChart.setOption(option);
    },
    createNew: function (opts) {
        var opts_default = {
            pieContainer: $('.gallery-report-statistics > .pie-pane'),
            barContainer: $('.gallery-report-statistics > .bar-pane'),
            key: '温岭 徐仁标',
            interval: 60000
        };

        var reportStatistics = {};
        reportStatistics.options = $.extend(true, opts_default, opts);
        ReportStatistics.getData(reportStatistics);
        setInterval(function () {
            ReportStatistics.getData(reportStatistics);
        }, reportStatistics.options.interval);
        return reportStatistics;
    }
};

$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
    ReportStatistics.createNew({
        pieContainer: $('.gallery-report-statistics > .pie-pane'),
        barContainer: $('.gallery-report-statistics > .bar-pane'),
        key: '温岭 徐仁标',
        interval: 60000
    });
    function keywords(keyword){
    	var keywordEn = ''
    	switch (keyword){
    		case "政治":
    			keywordEn = "politics";
    			break;
    		case "财经":
    			keywordEn = "finance";
    			break;
    		case "科技":
    			keywordEn = "tech";
    			break;
    		case "社会":
    			keywordEn = "social";
    			break;
    		case "娱乐":
    			keywordEn = "ent";
    			break;
    		case "体育":
    			keywordEn = "sports";
    			break;
    		case "教育":
    			keywordEn = "edu";
    			break;	
    		case "游戏":
    			keywordEn = "game";
    			break;
    		case "房产":
    			keywordEn = "house";
    			break;
    		case "军事":
    			keywordEn = "mil";
    			break;
    		case "科学":
    			keywordEn = "science";
    			break;
    		case "数码":
    			keywordEn = "digital";
    			break;
    		default:
    			keywordEn = "sports";
				break;
    	}
    	return keywordEn;
    }
    $('#keyshow').change(function(){
    	var key = $(this)[0].value;
    	ReportStatistics.createNew({
            pieContainer: $('.gallery-report-statistics > .pie-pane'),
            barContainer: $('.gallery-report-statistics > .bar-pane'),
            key: key,
            interval: 60000
        });
//    	$('#keyword').val('');
    })
//    $('#keyword').keyup(function(event){
//    	if(event.keyCode == 13) {
//    		var key = $('#keyword').val();
//        	$('#keyshow').html(key);
//        	ReportStatistics.createNew({
//                pieContainer: $('.gallery-report-statistics > .pie-pane'),
//                barContainer: $('.gallery-report-statistics > .bar-pane'),
//                key: key,
//                interval: 60000
//            });
//        	$('#keyword').val('');
//		}
//    });
});


