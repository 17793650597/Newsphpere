var Users = {
	getPlatformUsersData: function(users) {
//		CentralProxy.getPlatformUsersData(function(resp) {
//			if (resp.errorMsg != null) {
//				console.log(resp.errorMsg);
//				return;
//			}
//			var data = resp.data;
//			if (users) {
//				users.platformUsersData = data;
//				Users.getPlatformUsersDataCallback(users);
//			}
//		});
//		调试使用假数据
				var data = {
						"dayTotalStorageSize": "105",
		    			"source": "aliyun-lizhiyun",
		    			"monthTotalStorageSize": "11120",
		    			"weekTotalStorageSize": "1945"
					};
		        if (users) {
		            users.platformUsersData = data;
		            Users.getPlatformUsersDataCallback(users);
		        }
	},
	getPlatformUsersDataCallback: function(users) {
		Users.createPlatformUsersPie(users);
	},
	getAppsUsersData: function(users) {
//		CentralProxy.getAppsUsersData(function(resp) {
//			if (resp.errorMsg != null) {
//				console.log(resp.errorMsg);
//				return;
//			}
//			var data = resp.data;
//			if (users) {
//				users.appsUsersData = data;
//				Users.getAppsUsersDataCallback(users);
//			}
//		});
		// 调试使用假数据
		    	var data = [{
		    		name:'现场新闻',
		    		value:'6533'
		    	},{
		    		name:'两会线索',
		    		value:'6903'
		    	},{
		    		name:'全媒体内容库',
		    		value:'1785'
		    	},{
		    		name:'长江快传',
		    		value:'6721'
		    	},{
		    		name:'长江云盘',
		    		value:'6854'
		    	},{
		    		name:'融合新闻',
		    		value:'5411'
		    	},{
		    		name:'数据分析',
		    		value:'4084'
		    	},{
		    		name:'融合生产',
		    		value:'600'
		    	},];
		    	if (users) {
		            users.appsUsersData = data;
		            Users.getAppsUsersDataCallback(users);
		        }
	},
	getAppsUsersDataCallback: function(users) {
		Users.createAppsUsersBar(users);
	},
	createPlatformUsersPie: function(users) {
		var platformPieChart;
		if (!users.platformPieChart) {
			var dom = users.options.platformPieContainer[0];
			platformPieChart = echarts.init(dom);
			users.platformPieChart = platformPieChart;
		} else {
			platformPieChart = users.platformPieChart;
		}
		
		var fontSize = Utils.getEchartsFontSize(28, 1920);
		var option = {
			animationDurationUpdate: 3000,
			animationDuration: 3000,
			tooltip: {
				trigger: 'item',
				formatter: "{b} : {c}",
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'line' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				show: false
			},
			grid: {
                left: '0',
                right: '0',
                bottom: '0',
                top: '0',
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
			series: [{
                type: 'pie',
                selectedMode: 'single',
                radius: ['70%', '100%'],
                startAngle: 170,
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
                            var skin = Utils.getSkin();
                            if(skin==='blue'){
                    			colorList = [
                 				'#cf9d24', '#b39ddb', '#ddfcff', '#E87C25', '#27727B',
                 				'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                 				'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                 			];
                        }
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            formatter: "{b} : {c}",
                            textStyle: {
                            	fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
                            	fontSize: fontSize,
                            	fontWeight: 'normal'
                            	}
                        },
                        labelLine: {
                            show: true
                        }
                    }
                },
                data: []
            }]
		};
		var data = users.platformUsersData;
		var seriesData = [{
			value: data.monthTotalStorageSize,
			name: '月访问量'
		}, {
			value: data.weekTotalStorageSize,
			name: '周访问量 '
		}, {
			value: data.dayTotalStorageSize,
			name: '日访问量 '
		}];
		option.series[0].data = seriesData;
		platformPieChart.setOption(option);
		platformPieChart.option = option;
		if (platformPieChart.intervalAnim) {
			clearInterval(platformPieChart.intervalAnim);
		}
		platformPieChart.intervalAnim = setInterval(function() {
			option.series[0].data = [];
			platformPieChart.setOption(option);
			option.series[0].data = seriesData;
			platformPieChart.setOption(option);
		}, 10000);
	},
	createAppsUsersBar: function(users) {
		var appsBarChart;
		var skin = Utils.getSkin();
		var fontSize = Utils.getEchartsFontSize(28, 1920);
		var lineColor='#dd4444',textColor='#dd4444';
		if(skin==='blue'){
			lineColor='#00d4ff';
			textColor='#00d4ff';
		}
		if (!users.appsBarChart) {
			var dom = users.options.appsBarContainer[0];
			appsBarChart = echarts.init(dom);
			users.appsBarChart = appsBarChart;
		} else {
			appsBarChart = users.appsBarChart;
		}
		var option = {
			animationDurationUpdate: 3000,
			animationDuration: 3000,
			color: ['#3398DB'],
			tooltip: {
				trigger: 'axis',
				formatter: "{b}:{c}",
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '30',
				right: '10',
				bottom: '40',
				containLabel: true
			},
			xAxis: [{
				show: true,
				type: 'category',
				textStyle: {
					color: '#1e90ff',
					fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
					fontSize: fontSize,
					fontStyle: 'normal',
					fontWeight: 'normal'
				},
				axisLine: {
					show: true,
					onZero: true,
					show: true,
					lineStyle: {
						color: lineColor,
						width: 4,
						type: 'solid',
					},
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
						color: textColor,
						fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						fontSize: fontSize,
						fontStyle: 'normal',
						fontWeight: 'normal'
					}
				},
				data: ['现场新闻','两会线索','全媒体内容库','长江快传','长江云盘','融合新闻','数据分析','融合生产']
			}],
			yAxis: [{
				show: true,
				type: 'value',
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					onZero: true,
					show: true,
					lineStyle: {
						color: lineColor,
						width: 1,
						type: 'solid',
					},
				},
				splitLine: {
					show: false,
					lineStyle: {
						color: '#5793f3',
						type: 'solid',
						width: 1
					}
				},
				splitArea: {
					show: false
				},
				axisLabel: {
					show: true,
					textStyle: {
						color: textColor,
						fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						fontSize: fontSize,
						fontStyle: 'normal',
						fontWeight: 'normal'
					}
				},
				splitNumber: 5

			}],
			series: [{
				type: 'bar',
				barCategoryGap: '50%',
				label: {
					normal: {
						show: true,
						position: 'outside',
						formatter: '{c}',
						textStyle: {
							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
							fontSize: fontSize,
							fontStyle: 'normal',
							fontWeight: 'normal'
						}
					}
				},
				itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = [
                                '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                            ];
                            if(skin==='blue'){
                    			colorList = [
                 				'#0082c8', '#0194a4', '#009380', '#019259', '#85c226',
                 				'#fcdb00', '#f1a400', '#e67817', '#F3A43B', '#60C0DD',
                 				'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                 			];
                            }
                            return colorList[params.dataIndex]
                        },
                    }
                },
				data: []
			}]
		};
		var data = users.appsUsersData;
		var seriesData = data;
		option.series[0].data = seriesData;
		appsBarChart.setOption(option);
		appsBarChart.option = option;
		if (appsBarChart.intervalAnim) {
			clearInterval(appsBarChart.intervalAnim);
		}
		appsBarChart.intervalAnim = setInterval(function() {
			option.series[0].data = [];
			appsBarChart.setOption(option);
			option.series[0].data = seriesData;
			appsBarChart.setOption(option);
		}, 8000);
	},
//	updateEchartsFontSize: function(users){
//		users.platformPieChart.setOption(Users.createPlatformUsersPie(users));
//		users.appsBarChart.setOption(Users.createAppsUsersBar(users));
//	},
	createNew: function(opts) {
		var opts_default = {
			platformPieContainer: $('.platform-pie-pane > .platform-pie-chart'),
			appsBarContainer: $('.apps-bar-pane > .apps-bar-chart'),
			interval: 60000
		};

		var users = {};
		users.options = $.extend(true, opts_default, opts);
		Users.getPlatformUsersData(users);
		Users.getAppsUsersData(users);
		setTimeout(function() {
			window.onresize = function() {
//				users.platformPieChart.resize();
//				users.appsBarChart.resize();
				/*var fontSize = Utils.getEchartsFontSize(28, 1920);
				users.appsBarChart.option.xAxis[0].textStyle.fontSize = fontSize;
				users.appsBarChart.option.xAxis[0].axisLabel.textStyle.fontSize = fontSize;
				users.appsBarChart.option.yAxis[0].axisLabel.textStyle.fontSize = fontSize;
				
				users.appsBarChart.setOption(users.platformPieChart.option);
				users.appsBarChart.setOption(users.appsBarChart.option);	*/
				users.platformPieChart.resize();
				users.appsBarChart.resize();
//				Users.updateEchartsFontSize(users);
			}
		}, 1000);
		setInterval(function() {
			Users.getPlatformUsersData(users);
			Users.getAppsUsersData(users);
		}, users.options.interval);
		return users;
	}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Users.createNew({
		platformPieContainer: $('.platform-pie-pane > .platform-pie-chart'),
		appsBarContainer: $('.apps-bar-pane > .apps-bar-chart'),
		interval: 600000
	});
});