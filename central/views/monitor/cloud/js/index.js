var Cloud = {
	getInstanceList: function(cloud) {
		if (!cloud.getInstanceListParam) {
			cloud.getInstanceListParam = {
				platformId: 'aliyun-lizhiyun',
				page: 1,
				size: 10
			};
		}

//		function loadData() {
//			CentralProxy.getInstanceList(cloud.getInstanceListParam, function(resp) {
//				if (resp.errorMsg != null) {
//					console.log(resp.errorMsg);
//					return;
//				}
//				var data = resp.data;
//				if (cloud) {
//					cloud.instanceListData = data;
//					Cloud.getInstanceListCallback(cloud);
//				}
//			});
//		}
		//    	假数据开始
		function loadData(){
        		var data = [{
					"monitorState": "ERROR",
					"createTime": "2016-07-21T10:16Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "拆条1",
					"extranetIp": "",
					"instanceId": "i-23cv06kq6",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.26.20"
				}, {
					"monitorState": "OK",
					"createTime": "2016-07-21T10:16Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "拆条2",
					"extranetIp": "",
					"instanceId": "i-23w9a8ldl",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.26.21"
				}, {
					"monitorState": "OK",
					"createTime": "2016-07-15T10:47Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "切片",
					"extranetIp": "121.43.175.119",
					"instanceId": "i-23r2yts7w",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.4.12"
				}, {
					"monitorState": "OK",
					"createTime": "2016-05-09T06:25Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "数据中心ECS02",
					"extranetIp": "121.196.213.77",
					"instanceId": "i-233kvml67",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.74"
				}, {
					"monitorState": "OK",
					"createTime": "2016-05-04T09:33Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "数据中心ECS01",
					"extranetIp": "121.196.219.34",
					"instanceId": "i-23vafwvya",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.4.75"
				}, {
					"monitorState": "OK",
					"createTime": "2016-04-28T07:52Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "截图ECS",
					"extranetIp": "",
					"instanceId": "i-23yw7xmyv",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.72"
				}, {
					"monitorState": "OK",
					"createTime": "2016-04-27T05:17Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "运营系统-ECS02",
					"extranetIp": "",
					"instanceId": "i-230defk3k",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.71"
				}, {
					"monitorState": "OK",
					"createTime": "2016-04-27T05:17Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "运营系统-ECS01",
					"extranetIp": "",
					"instanceId": "i-234rm8hqd",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.70"
				}, {
					"monitorState": "OK",
					"createTime": "2016-04-27T05:11Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "内容管理-ECS02",
					"extranetIp": "121.196.195.198",
					"instanceId": "i-232r05qhl",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.68"
				}, {
					"monitorState": "OK",
					"createTime": "2016-04-27T05:11Z",
					"source": "aliyun-lizhiyun",
					"memorySize": "",
					"status": "Running",
					"instanceName": "内容管理-ECS01",
					"extranetIp": "121.196.195.243",
					"instanceId": "i-235inctt7",
					"diskSize": "",
					"cpuCoreCount": "",
					"intranetIp": "172.20.2.69"
				}];
            if (cloud) {
                cloud.instanceListData = data;
                Cloud.getInstanceListCallback(cloud);
            }
    	}
		//    	假数据结束
		loadData();
		if (cloud.intervalGetInstanceList) {
			clearInterval(cloud.intervalGetInstanceList);
		}
		cloud.intervalGetInstanceList = setInterval(function() {
			cloud.getInstanceListParam.page++;
			var maxPageCount = 14;//目前为137台虚机，默认最多14页
			if(cloud.instanceInfo && cloud.instanceInfo.totalCount){
				maxPageCount = cloud.instanceInfo.totalCount/10+1;
			}
			if(cloud.getInstanceListParam.page > maxPageCount){
				cloud.getInstanceListParam.page = 1;
			}
			loadData();
		}, 8000);

	},
	getInstanceListCallback: function(cloud) {
		//先生成图表，然后各依次对各虚拟机逐个更新CPU 、内存信息
		Cloud.createInstanceListBar(cloud);
		var instanceList = cloud.instanceListData;
		var instanceIds = [];
		//20分钟前----现在
		var beginTime = Utils.parseTime(new Date().getTime() - 1200000, 'y-m-d h:i', true);
		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d h:i', true);

		for (var i in instanceList) {
			(function(){
				var instance = instanceList[i];
				var param = {
					platformId: 'aliyun-lizhiyun',
					instanceId: instance.instanceId,
					beginTime: beginTime,
					endTime: endTime
				}
//				CentralProxy.getCpuInfo(param, function(resp) {
//					if (resp.errorMsg != null) {
//						console.log(resp.errorMsg);
//						return;
//					}
//					var data = resp.data;
//
//					if (data && data.length > 0) {
//						instance.cpuInfo = data[0];
//						Cloud.createInstanceListBar(cloud);
//					}
//				});
				//假数据
				    		instance.cpuInfo = {
				    				"time": "2016-07-29 06:12",
				    				"cpuUsed": Math.random(),
				    				"source": "aliyun-lizhiyun",
				    				"instanceId": "i-235inctt7"
				    			};
				    		Cloud.createInstanceListBar(cloud);

//				CentralProxy.getMemoryInfo(param, function(resp) {
//					if (resp.errorMsg != null) {
//						console.log(resp.errorMsg);
//						return;
//					}
//					var data = resp.data;
//
//					if (data && data.length > 0) {
//						instance.memoryInfo = data[0];
//						Cloud.createInstanceListBar(cloud);
//					}
//				});

				//假数据
				    		instance.memoryInfo = {
				    				"memoryAvailable": Math.random()*3829,
				    				"time": "2016-07-29 06:12",
				    				"source": "aliyun-lizhiyun",
				    				"instanceId": "i-235inctt7",
				    				"memoryTotal": 3829
				    			};
				    		Cloud.createInstanceListBar(cloud);

				//    		instanceIds[instanceIds.length] = instanceList[i].instanceId;
			})();
		}
		//以下为获取全部数据后再更新图表
		/*var cpuArgs = $.map(instanceIds, function(instanceId){
			var url = 'http://paas.cloud.jstv.com/api/monitor/getCpuInfo/?platformId=aliyun-lizhiyun&instanceId='+ instanceId +'&beginTime='+ beginTime +'&endTime=' + endTime;
			return $.get(url).done(function(resp){
				for(var i in instanceList){
		    		if(instanceList[i].instanceId == instanceId){
		    			instanceList[i].cpuInfo = resp.data;
		    		}
		    	}
			});
		});
    	
		var memoryArgs = $.map(instanceIds, function(instanceId){
			var url = 'http://paas.cloud.jstv.com/api/monitor/getMemoryInfo/?platformId=aliyun-lizhiyun&instanceId='+ instanceId +'&beginTime='+ beginTime +'&endTime=' + endTime;
			return $.get(url).done(function(resp){
				for(var i in instanceList){
		    		if(instanceList[i].instanceId == instanceId){
		    			instanceList[i].memoryInfo = resp.data;
		    		}
		    	}
			});
		}); 
    	
		when.apply($, cpuArgs).apply($, memoryArgs).done(function(){
			//所有数据获取完成后，更新图表
			Cloud.createInstanceListBar(cloud);
		});*/

		//改为依次获取数据，并更新图表数据

	},
	getInstanceInfo: function(cloud) {
		/*CentralProxy.getInstanceInfo(function(resp) {
			if (resp.errorMsg != null) {
				console.log(resp.errorMsg);
				return;
			}
			var data = resp.data;
			if (cloud) {
				cloud.instanceInfo = data;
				Cloud.getInstanceInfoCallback(cloud);
			}
		});*/
//		调试使用假数据
		var totalCount = 137+Math.floor(10*Math.random());
		var runCount = 117 + Math.floor(20*Math.random());
		var errorCount = totalCount - runCount;
				var data = {
						"runCount": runCount,
						"source": "aliyun-lizhiyun",
						"totalCount": totalCount,
						"errorCount": errorCount
					};
		        if (cloud) {
		            cloud.instanceInfo = data;
		            Cloud.getInstanceInfoCallback(cloud);
		        }
	},
	getInstanceInfoCallback: function(cloud) {
		Cloud.createStatePie(cloud);
	},
	getStorageInfo: function(cloud) {
		/*CentralProxy.getStorageInfo(function(resp) {
			if (resp.errorMsg != null) {
				console.log(resp.errorMsg);
				return;
			}
			var data = resp.data;
			if (cloud) {
				cloud.storageInfo = data;
				Cloud.getStorageInfoCallback(cloud);
			}
		});*/
		// 调试使用假数据
		    	var data = {
		    			"totalStorageSize": Math.floor(2153569491532*(1+Math.random()/5)),
		    			"source": "aliyun-lizhiyun",
		    			"monthTotalStorageSize": Math.floor(415876704704*(1+Math.random()/5)),
		    			"weekTotalStorageSize": Math.floor(219994979367*(1+Math.random()/5))
		    		};
		    	if (cloud) {
		            cloud.storageInfo = data;
		            Cloud.getStorageInfoCallback(cloud);
		        }
	},
	getStorageInfoCallback: function(cloud) {
		Cloud.createSpaceBar(cloud);
	},
	
	getStatePieChartOption: function(cloud){
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var colorList = [
							'#5793f3', '#fec42c', '#dd4d79', '#E87C25', '#27727B',
							'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
							'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
						];
		var skin = Utils.getSkin();
		if(skin==='blue'){
			colorList = [
							'#41bbd2', '#d85d89', '#8f82d1', '#E87C25', '#27727B',
							'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
							'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
						];
		}
		if(skin==='lightblue'){
			colorList = [
							'rgba(255,255,255,0.7)', '#00cdff', '#D85D89', '#E87C25', '#27727B',
							'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
							'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
						];
		}
		var option = {
				animationDurationUpdate: 3000,
				animationDuration: 3000,
				tooltip: {
					trigger: 'item',
					formatter: "{b}",
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'line' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					orient: 'vertical',
					x: 'right',
					y: 'center',
					itemGap: 15,
					textStyle: {
						color: '#DEFDFF',
						fontFamily: "Microsoft Yahei",
						fontSize: fontSize
					},
					data: []
				},
				series: [{
					type: 'pie',
					selectedMode: 'single',
					center: ['30%', '50%'],
					radius: ['40%', '80%'],
					itemStyle: {
						normal: {
							color: function(params) {
								return colorList[params.dataIndex]
							},
							label: {
								position: 'inner',
								formatter: '{c}',
								textStyle: {
									color: '#DEFDFF',
									fontFamily: "Microsoft Yahei",
									fontSize: fontSize
								},
							},
							labelLine: {
								show: false
							}
						}
					},
					data: []
				}]
			};
			var data = cloud.instanceInfo;
			var legendData = [{
				name: '全部实例 ' + data.totalCount + '个'
			}, {
				name: '正常实例 ' + data.runCount + '个'
			}, {
				name: '异常实例 ' + data.errorCount + '个'
			}];
			var seriesData = [{
				value: data.totalCount,
				name: '全部实例 ' + data.totalCount + '个'
			}, {
				value: data.runCount,
				name: '正常实例 ' + data.runCount + '个'
			}, {
				value: data.errorCount,
				name: '异常实例 ' + data.errorCount + '个'
			}];
			option.legend.data = legendData;
			option.series[0].data = seriesData;
			
			return option;
	},
	
	createStatePie: function(cloud) {
		var statePieChart;
		if (!cloud.statePieChart) {
			var dom = cloud.options.statePieContainer[0];
			statePieChart = echarts.init(dom);
			cloud.statePieChart = statePieChart;
		} else {
			statePieChart = cloud.statePieChart;
		}
		
		var option = Cloud.getStatePieChartOption(cloud);
		statePieChart.setOption(option);
		if (statePieChart.intervalAnim) {
			clearInterval(statePieChart.intervalAnim);
		}
		statePieChart.intervalAnim = setInterval(function() {
			var tempLegend = option.legend.data;
			var tempSeries = option.series[0].data;
			option.legend.data = [];
			option.series[0].data = [];
			statePieChart.setOption(option);
			//TODO 加入随机变动开始
			var totalCount = 137+Math.floor(10*Math.random());
			var runCount = 117 + Math.floor(20*Math.random());
			var errorCount = totalCount - runCount;
			var data = {
					"runCount": runCount,
					"source": "aliyun-lizhiyun",
					"totalCount": totalCount,
					"errorCount": errorCount
				};
			cloud.instanceInfo = data;
			var optionNew = Cloud.getStatePieChartOption(cloud);
//			option.legend.data = tempLegend;
//			option.series[0].data = tempSeries;
			statePieChart.setOption(optionNew);
		}, 10000);
	},
	
	getSpaceBarOption: function(cloud){
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var labelColor = '#5793f3', monthColor = '#fec42c', weekColor = '#dd4d79', allColor = '#00d4ff';
		var skin = Utils.getSkin();
		if(skin==='blue'){
			labelColor = '#00d4ff';
			monthColor = '#8f82d1'; 
			weekColor = '#C66216'; 
			allColor = '#41BBD2'
		}
		if(skin==='lightblue'){
			labelColor = '#00cdff';
			monthColor = '#3486d0'; 
			weekColor = '#ff5800'; 
			allColor = '#00cdff'
		}
		var option = {
				animationDurationUpdate: 3000,
				animationDuration: 3000,
				color: ['#3398DB'],
				tooltip: {
					trigger: 'axis',
					formatter: "{b}:{c}GB",
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '2%',
					bottom: '6%',
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
							color: '#dd4444',
							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
							fontSize: fontSize,
							fontStyle: 'normal',
							fontWeight: 'normal'
						}
					},
					data: [{
						value: '总存储量',
						textStyle: {
							color: labelColor,
							fontSize: fontSize
						}
					}, {
						value: '月存储量',
						textStyle: {
							color: labelColor,
							fontSize: fontSize
						}
					}, {
						value: '周存储量',
						textStyle: {
							color: labelColor,
							fontSize: fontSize
						}
					}]
				}],
				yAxis: [{
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
							color: labelColor,
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
							color: labelColor,
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
							formatter: '{c}GB',
							textStyle: {
								fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
								fontSize: fontSize,
								fontStyle: 'normal',
								fontWeight: 'normal'
							}
						}
					},
					data: []
				}]
			};
			var data = cloud.storageInfo;
			var seriesData = [{
				value: Math.floor(data.totalStorageSize / 1024 / 1024 / 1024),
				name: '总存储量',
				itemStyle: {
					normal: {
						color: allColor,
					}
				}
			}, {
				value: Math.floor(data.monthTotalStorageSize / 1024 / 1024 / 1024),
				name: '月存储量',
				itemStyle: {
					normal: {
						color: monthColor,
					}
				}
			}, {
				value: Math.floor(data.weekTotalStorageSize / 1024 / 1024 / 1024),
				name: '周存储量',
				itemStyle: {
					normal: {
						color: weekColor,
					}
				}
			}];
			option.series[0].data = seriesData;
			return option;
	},
	
	createSpaceBar: function(cloud) {
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var spaceBarChart;
		if (!cloud.spaceBarChart) {
			var dom = cloud.options.spaceBarContainer[0];
			spaceBarChart = echarts.init(dom);
			cloud.spaceBarChart = spaceBarChart;
		} else {
			spaceBarChart = cloud.spaceBarChart;
		}
		
		var option = Cloud.getSpaceBarOption(cloud);
		spaceBarChart.setOption(option);
		if (spaceBarChart.intervalAnim) {
			clearInterval(spaceBarChart.intervalAnim);
		}
		spaceBarChart.intervalAnim = setInterval(function() {
			var temp = option.series[0].data;
			option.series[0].data = [];
			spaceBarChart.setOption(option);
			//TODO 假数据增加随机变动
			for(var i in temp){
				temp[i].value = Math.floor(temp[i].value + (temp[i].value/10)*(1-2*Math.random()));
			}
			option.series[0].data = temp;
			spaceBarChart.setOption(option);
		}, 8000);
	},
	
	getInstanceListBarOption: function(cloud){
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var labelColor = '#dd4444', cpuColor = '#4C4358', memoryColor = '#8F6AAF';
		var skin = Utils.getSkin();
		if(skin==='blue'){
			labelColor = '#00d4ff';
			cpuColor = '#3486d0'; 
			memoryColor = '#41bbd2'; 
		}
		if(skin==='lightblue'){
			labelColor = '#00cdff';
			cpuColor = '#3486d0'; 
			memoryColor = '#3dd6ff'; 
		}
		var option = {
				animationDurationUpdate: 1500,
				animationDuration: 1500,
				tooltip: {
					show: false,
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
				},
				legend: {
					show: false,
					data: ['CPU占用率', '内存占用率']
				},
				grid: {
					show: false,
					top: '0',
					left: '130',
					right: '20',
					bottom: '20',
					containLabel: true
				},
				yAxis: [{
					type: 'category',
					data: ['', '', '', '', '', '', '', '', '', ''],
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: true,
						onZero: true,
						lineStyle: {
							color: labelColor,
							width: 1,
							type: 'dashed',
							},
						},
					axisLabel: {
						show: true,
						textStyle: {
							color: labelColor,
							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
							fontSize: fontSize,
							fontStyle: 'normal',
							fontWeight: 'bold'
						}
					},

				}],
				xAxis: [{
					type: 'value',
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						lineStyle: {
							color: labelColor,
							width: 5,
							type: 'solid',
						},
					},
					axisLabel: {
						show: true,
						formatter: function(value) {
							return Math.round(value * 100) + '%';
						},
						textStyle: {
							color: labelColor,
							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
							fontSize: fontSize,
							fontStyle: 'normal',
							fontWeight: 'normal'
						}
					},
					max: 1
				}],
				series: [{
					name: 'CPU占用率',
					type: 'bar',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					label: {
						normal: {
							show: true,
							position: 'insideLeft',
							formatter: function(param) {
								return 'CPU: ' + Math.round(param.data * 100) + '%';
							},
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
							color: cpuColor,
							barBorderRadius: 2,
						}
					}
				}, {
					name: '内存占用率',
					type: 'bar',
					data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					label: {
						normal: {
							show: true,
							position: 'insideLeft',
							formatter: function(param) {
								return 'RAM: ' + Math.round(param.data * 100) + '%';
							},
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
							color: memoryColor,
							barBorderRadius: 2,
						}
					}
				}]
			};
			var data = cloud.instanceListData;
			option.yAxis[0].data = [];
			option.series[0].data = [];
			option.series[1].data = [];
			for (var i = 0; i < data.length; i++) {
				var name = data[i].instanceName;
				if(data[i].monitorState == 'ERROR'){
					name = {
						    value: '★运行异常：' + data[i].instanceName,
						    textStyle: {
						        fontSize: fontSize,
						        color: '#FF5800'
						    }
					}
				}
				var cpuUsed = data[i].cpuInfo ? data[i].cpuInfo.cpuUsed.toFixed(2) : 0;
				var memoryUsed = data[i].memoryInfo ? (data[i].memoryInfo.memoryTotal == 0 ? 0 : (1 - data[i].memoryInfo.memoryAvailable / data[i].memoryInfo.memoryTotal).toFixed(2)) : 0;
				
				if(cpuUsed > 1){
					cpuUsed = 1;
				}else if(cpuUsed < 0){
					cpuUsed = 0;
				}
				if(memoryUsed > 1){
					memoryUsed = 1;
				}else if(memoryUsed < 0){
					memoryUsed = 0;
				}
				option.yAxis[0].data[i] = name;
				option.series[0].data[i] = cpuUsed;
				option.series[1].data[i] = memoryUsed;
			}
			return option;
	},
	
	createInstanceListBar: function(cloud) {
		var instanceListBarChart;
		if (!cloud.instanceListBarChart) {
			var dom = cloud.options.instanceBarContainer[0];
			instanceListBarChart = echarts.init(dom);
			cloud.instanceListBarChart = instanceListBarChart;
		} else {
			instanceListBarChart = cloud.instanceListBarChart;
		}
		
		var option = Cloud.getInstanceListBarOption(cloud);
		instanceListBarChart.setOption(option);
	},
	
	updateEchartsFontSize: function(cloud){
		cloud.statePieChart.setOption(Cloud.getStatePieChartOption(cloud));
		cloud.spaceBarChart.setOption(Cloud.getSpaceBarOption(cloud));
		cloud.instanceListBarChart.setOption(Cloud.getInstanceListBarOption(cloud));
	},
	createNew: function(opts) {
		var opts_default = {
			statePieContainer: $('.state-pie-pane > .state-pie-chart'),
			spaceBarContainer: $('.space-pie-pane > .space-pie-chart'),
			instanceBarContainer: $('.gallery-cloud > .bar-pane'),
			interval: 60000
		};

		var cloud = {};
		cloud.options = $.extend(true, opts_default, opts);
		Cloud.getInstanceInfo(cloud);
		Cloud.getStorageInfo(cloud);
		Cloud.getInstanceList(cloud);
		setTimeout(function() {
			window.onresize = function() {
				cloud.statePieChart.resize();
				cloud.spaceBarChart.resize();
				cloud.instanceListBarChart.resize();
				Cloud.updateEchartsFontSize(cloud);
			}
			
		}, 1000);
		setInterval(function() {
			Cloud.getInstanceInfo(cloud);
			Cloud.getStorageInfo(cloud);
			Cloud.getInstanceList(cloud);
		}, cloud.options.interval);
		return cloud;
	}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Cloud.createNew({
		statePieContainer: $('.state-pie-pane > .state-pie-chart'),
		spaceBarContainer: $('.space-pie-pane > .space-pie-chart'),
		instanceBarContainer: $('.gallery-cloud > .bar-pane'),
		interval: 600000
	});
});