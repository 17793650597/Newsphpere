var BlogWechatStatistics = {
		getData: function(blogWechatStatistics){
			var param = {
					"accessToken": "05784E32D86340D976677714905E6D53B2E0",
					"timeStamp": new Date().getTime()
				};
			CentralProxy.getWWStatistics(param, function(resp){
				if(resp.code!=0){
					return;
				}
				
				var data = [{
					category: "微信",
					data: [{
						name: '今日',
						value: resp.data.day.weixinCount
					}, {
						name: '本周',
						value: resp.data.week.weixinCount
					}, {
						name: '本月',
						value: resp.data.month.weixinCount
					}]
				}, {
					category: "微博",
					data: [{
						name: '今日',
						value: resp.data.day.weiboCount
					}, {
						name: '本周',
						value: resp.data.week.weiboCount
					}, {
						name: '本月',
						value: resp.data.month.weiboCount
					}]
				}];

				if(blogWechatStatistics){
					blogWechatStatistics.data = data;
					BlogWechatStatistics.getDataCallback(blogWechatStatistics);
				}
			});
		},
		getDataCallback: function(blogWechatStatistics){
			setTimeout(function(){
				BlogWechatStatistics.createThisDayChat(blogWechatStatistics);
			},1500);
			setTimeout(function(){
				BlogWechatStatistics.createThisWeekChat(blogWechatStatistics);
			},3500);
			setTimeout(function() {
				BlogWechatStatistics.createThisMonthChat(blogWechatStatistics);
			}, 5500);
			setTimeout(function(){
				BlogWechatStatistics.createAllInOneChat(blogWechatStatistics);
			},7500);
			
			setTimeout(function (){
			    window.onresize = function () {
			    	blogWechatStatistics.thisDayChart.resize();
			    	blogWechatStatistics.thisWeekChart.resize();
			    	blogWechatStatistics.thisMonthChart.resize();
			    	blogWechatStatistics.allInOneChart.resize();
			    }
			},8000)
		},
		createThisDayChat : function(blogWechatStatistics){
			var thisDayChart;
			
			if(blogWechatStatistics.thisDayChart){
				thisDayChart = blogWechatStatistics.thisDayChart;
				thisDayChart.clear();
			}else{
				var dom = blogWechatStatistics.options.thisDayContainer[0];
				thisDayChart = echarts.init(dom);
				blogWechatStatistics.thisDayChart = thisDayChart;
			}
			
			var fontSize = Utils.getEchartsFontSize(22, 1920);
			var option = {
					animationDurationUpdate: 2000,
					animationDuration : 2000,
					animationEasing:'BounceInOut',
					title : {
				        show: true,
				        text: '今日',
				        textStyle: {
		                    color: '#ffffff',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontStyle: 'normal',
		                    fontWeight: 'bold'
		                },
		                left: 'center',
		                top: 'middle'
				    },
				    legend: {
				    	show: true,
				    	left: "right",
				    	top: "bottom",
				    	orient: 'vertical',
				    	formatter: '今日{name}',
				    	textStyle: {
		                    color: '#7e6261',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontWeight: 'bold'
		                },
				    	data:[]
				    },
				    tooltip : {
				    	show: false,
				        trigger: 'item',
				        formatter:"{b}<br />{c}<br />{d}%",
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				    	left: '3%',
				        right: '2%',
				        bottom: '2%',
				        top:'2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				        	show: false,
				            type : 'value'
				        }
				    ],
				    yAxis : [
				        {
				        	show: false,
				            type : 'category',
				            data : []
				        }
				    ],
				    series : [
				        {
				            type:'pie',
				            selectedMode: 'single',
				            radius : ['35%', '50%'],
				            stack: '总量',
				            itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        var colorList = [
				                          '#f04a4a','#b3b3b3'
				                        ];
				                        return colorList[params.dataIndex]
				                    },
				                    label: {
				                        show: true,
				                        formatter:"{b}\n\n{c}\n\n{d}%",
				                        textStyle: {
						                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						                    fontSize: fontSize,
						                    fontStyle: 'italic',
						                    fontWeight: 'normal'
						                },
				                    },
				                    labelLine: {
				                        show: true,
				                        length: 30,
				                        length2: 20
				                    }
				                }
				            },
				            data:[]
				        }
				    ]
				};
			var data = blogWechatStatistics.data;
			option.yAxis[0].data = [];
			option.series[0].data = [];
			for(var i = 0; i<data.length; i++){
				for(var j = 0; j < data[i].data.length; j++){
					if(data[i].data[j].name === '今日'){
						var name = data[i].category;
						var value = data[i].data[j]['value'];
						option.legend.data.push(name);
						option.series[0].data.splice(0, 0, {value:value, name:name});
					}
				}
			}
			thisDayChart.setOption(option);
		},
		createThisWeekChat : function(blogWechatStatistics){
			var thisWeekChart;
			if(blogWechatStatistics.thisWeekChart){
				thisWeekChart = blogWechatStatistics.thisWeekChart;
				thisWeekChart.clear();
			}else{
				var dom = blogWechatStatistics.options.thisWeekContainer[0];
				thisWeekChart = echarts.init(dom);
				blogWechatStatistics.thisWeekChart = thisWeekChart;
			}
			var fontSize = Utils.getEchartsFontSize(22, 1920);
			var option = {
					animationDurationUpdate: 2000,
					animationDuration : 2000,
					animationEasing:'BounceInOut',
					title : {
				        show: true,
				        text: '本周',
				        textStyle: {
		                    color: '#ffffff',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontStyle: 'normal',
		                    fontWeight: 'bold'
		                },
		                left: 'center',
		                top: 'middle'
				    },
				    legend: {
				    	show: true,
				    	left: "right",
				    	top: "bottom",
				    	orient: 'vertical',
				    	formatter: '本周{name}',
				    	textStyle: {
		                    color: '#7e6261',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontWeight: 'bold'
		                },
				    	data:[]
				    },
				    tooltip : {
				    	show: false,
				        trigger: 'item',
				        formatter:"{b}<br />{c}<br />{d}%",
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				    	left: '3%',
				        right: '2%',
				        bottom: '2%',
				        top:'2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				        	show: false,
				            type : 'value'
				        }
				    ],
				    yAxis : [
				        {
				        	show: false,
				            type : 'category',
				            data : []
				        }
				    ],
				    series : [
				        {
				            type:'pie',
				            selectedMode: 'single',
				            radius : ['35%', '50%'],
				            stack: '总量',
				            itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        var colorList = [
				                          '#2372aa','#b3b3b3'
				                        ];
				                        return colorList[params.dataIndex]
				                    },
				                    label: {
				                        show: true,
				                        formatter:"{b}\n\n{c}\n\n{d}%",
				                        textStyle: {
						                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						                    fontSize: fontSize,
						                    fontStyle: 'italic',
						                    fontWeight: 'normal'
						                },
				                    },
				                    labelLine: {
				                        show: true,
				                        length: 30,
				                        length2: 20
				                    }
				                }
				            },
				            data:[]
				        }
				    ]
				};
			var data = blogWechatStatistics.data;
			option.yAxis[0].data = [];
			option.series[0].data = [];
			for(var i = 0; i<data.length; i++){
				for(var j = 0; j < data[i].data.length; j++){
					if(data[i].data[j].name === '本周'){
						var name = data[i].category;
						var value = data[i].data[j]['value'];
						option.legend.data.push(name);
						option.series[0].data.splice(0, 0, {value:value, name:name});
					}
				}
			}
			thisWeekChart.setOption(option);
		},
		createThisMonthChat : function(blogWechatStatistics){
			var thisMonthChart;
			if(blogWechatStatistics.thisMonthChart){
				thisMonthChart = blogWechatStatistics.thisMonthChart;
				thisMonthChart.clear();
			}else{
				var dom = blogWechatStatistics.options.thisMonthContainer[0];
				thisMonthChart = echarts.init(dom);
				blogWechatStatistics.thisMonthChart = thisMonthChart;
			}
			var fontSize = Utils.getEchartsFontSize(22, 1920);
			var option = {
					animationDurationUpdate: 2000,
					animationDuration : 2000,
					animationEasing:'BounceInOut',
					title : {
				        show: true,
				        text: '本月',
				        textStyle: {
		                    color: '#ffffff',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontStyle: 'normal',
		                    fontWeight: 'bold'
		                },
		                left: 'center',
		                top: 'middle'
				    },
				    legend: {
				    	show: true,
				    	left: "right",
				    	top: "bottom",
				    	orient: 'vertical',
				    	formatter: '本月{name}',
				    	textStyle: {
		                    color: '#7e6261',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontWeight: 'bold'
		                },
				    	data:[]
				    },
				    tooltip : {
				    	show: false,
				        trigger: 'item',
				        formatter:"{b}<br />{c}<br />{d}%",
				        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
				            type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
				        }
				    },
				    grid: {
				    	left: '3%',
				        right: '2%',
				        bottom: '2%',
				        top:'2%',
				        containLabel: false
				    },
				    xAxis : [
				        {
				        	show: false,
				            type : 'value'
				        }
				    ],
				    yAxis : [
				        {
				        	show: false,
				            type : 'category',
				            data : []
				        }
				    ],
				    series : [
				        {
				            type:'pie',
				            selectedMode: 'single',
				            radius : ['35%', '50%'],
				            stack: '总量',
				            itemStyle: {
				                normal: {
				                    color: function(params) {
				                        // build a color map as your need.
				                        var colorList = [
				                          '#e86902','#b3b3b3'
				                        ];
				                        return colorList[params.dataIndex]
				                    },
				                    label: {
				                        show: true,
				                        formatter:"{b}\n\n{c}\n\n{d}%",
				                        textStyle: {
						                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						                    fontSize: fontSize,
						                    fontStyle: 'italic',
						                    fontWeight: 'normal'
						                },
				                    },
				                    labelLine: {
				                        show: true,
				                        length: 30,
				                        length2: 20
				                    }
				                }
				            },
				            data:[]
				        }
				    ]
				};
			var data = blogWechatStatistics.data;
			option.yAxis[0].data = [];
			option.series[0].data = [];
			for(var i = 0; i<data.length; i++){
				for(var j = 0; j < data[i].data.length; j++){
					if(data[i].data[j].name === '本月'){
						var name = data[i].category;
						var value = data[i].data[j]['value'];
						option.legend.data.push(name);
						option.series[0].data.splice(0, 0, {value:value, name:name});
					}
				}
			}
			thisMonthChart.setOption(option);
		},
		createAllInOneChat : function(blogWechatStatistics){
			var allInOneChart;
			if(blogWechatStatistics.allInOneChart){
				allInOneChart = blogWechatStatistics.allInOneChart;
				allInOneChart.clear();
			}else{
				var dom = blogWechatStatistics.options.allInOneContainer[0];
				allInOneChart = echarts.init(dom);
				blogWechatStatistics.allInOneChart = allInOneChart;
			}
			var fontSize = Utils.getEchartsFontSize(22, 1920);
			var option = {
					animationDurationUpdate: 2000,
					animationDuration : 2000,
					animationEasing:'BounceInOut',
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						show: true,
						left: "right",
						top: "bottom",
						orient: 'vertical',
						formatter: '{name}',
						textStyle: {
							color: '#7e6261',
							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
							fontSize: fontSize,
							fontWeight: 'bold'
						},
						data: ['微信', '微博']
					},
					grid: {
				    	left: '10%',
				        right: '10%',
				        bottom: '8%',
				        top:'8%',
				        containLabel: true
				    },
					calculable: false,
					xAxis : [	
						        {	type: 'category',
									data: ['今日', '本周', '本月'],
						        	show: true,
						            axisTick : {
						                show: false
						            },
						            axisLine : {
						                show: true,
						                lineStyle:{
						                	color: '#807dca',
						                	width: 1
						                }
						            },
						            splitLine : {
						                show:false
						            },
						            splitArea : {
						                show: false,
						            },
						            axisLabel: {
						            	show:true,
						            	textStyle:{
						                    color: '#807dca',
						                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
						                    fontSize: fontSize,
						                    fontStyle: 'normal',
						                    fontWeight: 'normal'
						                },
						            },
						        }
						    ],
					yAxis: [{
						type: 'value',
						textStyle: {
		                    color: '#807dca',
		                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
		                    fontSize: fontSize,
		                    fontStyle: 'normal',
		                    fontWeight: 'bold'
		                },
		                axisLine : {
			                show: true,
			                lineStyle:{
			                	color: '#807dca',
			                	width: 1
			                }
			            },
		                splitLine : {
			                show:false
			            },
			            axisTick : {
			                show: false
			            },
			            axisLabel: {
			            	show:true,
			            	textStyle:{
			                    color: '#807dca',
			                    fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
			                    fontSize: fontSize,
			                    fontStyle: 'normal',
			                    fontWeight: 'normal'
			                },
			            },
					}],
					series: [{
						name: '微信',
						type: 'bar',
						data: [{name:'今日', value:13533242},
						       {name:'本周', value:43533242},
						       {name:'本月', value:26533242}],
						barGap: '50%',
						barCategoryGap:  '40%',
						itemStyle: {
							normal: {
								color: "#807dca",
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					}, {
						name: '微博',
						type: 'bar',
						data: [{name:'今日', value:52533242},
						       {name:'本周', value:23533242},
						       {name:'本月', value:34533242}],
						barGap: '50%',
						barCategoryGap: '40%',
						itemStyle: {
							normal: {
								color: "#fce28b",
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					}]
				};
			var data = blogWechatStatistics.data;
			
			option.legend.data = [];
			option.series = [];
			for(var i = 0; i<data.length; i++){
				var category = data[i].category;
				option.legend.data.push(category);
				var serie = {
						name: category,
						type: 'bar',
						data: [],
						barGap: '50%',
						barCategoryGap:  '40%',
						itemStyle: {
							normal: {
								color: category == "微信"?"#807dca":"#fce28b",
								label: {
									show: true,
									position: 'top'
								}
							}
						}
					};
				for(var j = 0; j < data[i].data.length; j++){
					var name = data[i].data[j].name;
					var value = data[i].data[j]['value'];
					serie.data.push({value:value, name:name});
				}
				option.series.push(serie);
			}
			allInOneChart.setOption(option);
		},
		createNew : function(opts){
			var opts_default = {
					thisDayContainer : $('.blog-wechat-statistics-page .this-day-pane'),
					thisWeekContainer : $('.blog-wechat-statistics-page .this-week-pane'),
					thisMonthContainer : $('.blog-wechat-statistics-page .this-month-pane'),
					allInOneContainer : $('.blog-wechat-statistics-page .all-in-one-pane'),
					queryUrl : 'http://data.cloud.jstv.com:31801/service/bd/get/action=getQueryTagValues&fieldName=CATEGORY_TWO&documentcount=true&Sort=DocumentCount%20&AnyLanguage=true&OutputEncoding=UTF8&Responseformat=json&TotalResults=true&Predict=false&Synonym=true%20&StoreState=true&databasematch=network&minScore=70&text=%E4%B8%A4%E4%BC%9A',
					interval: 20000
			}
			
			var blogWechatStatistics = {};
			blogWechatStatistics.options = $.extend(true, opts_default, opts);
			BlogWechatStatistics.getData(blogWechatStatistics);
			setInterval(function(){
				BlogWechatStatistics.getData(blogWechatStatistics);
			},blogWechatStatistics.options.interval);
			return blogWechatStatistics;
		}
};

$(function(){
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	BlogWechatStatistics.createNew({
		thisDayContainer : $('.blog-wechat-statistics-page .this-day-pane'),
		thisWeekContainer : $('.blog-wechat-statistics-page .this-week-pane'),
		thisMonthContainer : $('.blog-wechat-statistics-page .this-month-pane'),
		allInOneContainer : $('.blog-wechat-statistics-page .all-in-one-pane'),
		queryUrl : 'http://data.cloud.jstv.com:31801/service/bd/get/action=getQueryTagValues&fieldName=CATEGORY_TWO&documentcount=true&Sort=DocumentCount%20&AnyLanguage=true&OutputEncoding=UTF8&Responseformat=json&TotalResults=true&Predict=false&Synonym=true%20&StoreState=true&databasematch=network&minScore=70&text=%E4%B8%A4%E4%BC%9A',
		interval: 10000
		});
}) ;

