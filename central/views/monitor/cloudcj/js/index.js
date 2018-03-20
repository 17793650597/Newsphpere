var Cloud = {
	getInstanceList: function(cloud) {
		if (!cloud.getInstanceListParam) {
			cloud.getInstanceListParam = {
				platformId: 'sc-test',
				page: 1,
				size: 40
			};
		}
		var i = 0;
		var data2array = [];
		function loadData() {
			CentralProxy.getInstanceList(cloud.getInstanceListParam, function(resp) {
				if (resp.errorMsg != null) {
					console.log(resp.errorMsg);
					return;
				}
				var data = resp.data;
				while(data.length){
					data2array.push(data.splice(0,10));
				}
				if (cloud) {
					cloud.instanceListData = data2array[i];
					Cloud.getInstanceListCallback(cloud);
					i++;
				}
				
			});
		}
		//    	假数据开始
//		function loadData(i){
//        		var data = [[{
//					"monitorState": "ERROR",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "拆条1",
//					"extranetIp": "",
//					"instanceId": "i-23cv06kq6",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.20"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "拆条2",
//					"extranetIp": "",
//					"instanceId": "i-23w9a8ldl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.21"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-15T10:47Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "切片",
//					"extranetIp": "121.43.175.119",
//					"instanceId": "i-23r2yts7w",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.12"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-09T06:25Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "数据中心ECS02",
//					"extranetIp": "121.196.213.77",
//					"instanceId": "i-233kvml67",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.74"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-04T09:33Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "数据中心ECS01",
//					"extranetIp": "121.196.219.34",
//					"instanceId": "i-23vafwvya",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.75"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-28T07:52Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "截图ECS",
//					"extranetIp": "",
//					"instanceId": "i-23yw7xmyv",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.72"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "运营系统-ECS02",
//					"extranetIp": "",
//					"instanceId": "i-230defk3k",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.71"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "运营系统-ECS01",
//					"extranetIp": "",
//					"instanceId": "i-234rm8hqd",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.70"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:11Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "内容管理-ECS02",
//					"extranetIp": "121.196.195.198",
//					"instanceId": "i-232r05qhl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.68"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:11Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "转码01",
//					"extranetIp": "121.196.195.198",
//					"instanceId": "i-232r05qhl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.68"
//				}], [{
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:11Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "转码02",
//					"extranetIp": "121.196.195.198",
//					"instanceId": "i-232r05qhl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.68"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "技审01",
//					"extranetIp": "",
//					"instanceId": "i-23w9a8ldl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.21"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-15T10:47Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-cas01",
//					"extranetIp": "121.43.175.119",
//					"instanceId": "i-23r2yts7w",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.12"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-09T06:25Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "dayang-edit01",
//					"extranetIp": "121.196.213.77",
//					"instanceId": "i-233kvml67",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.74"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-04T09:33Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-edit01",
//					"extranetIp": "121.196.219.34",
//					"instanceId": "i-23vafwvya",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.75"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-28T07:52Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "jetson01",
//					"extranetIp": "",
//					"instanceId": "i-23yw7xmyv",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.72"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "打包01",
//					"extranetIp": "",
//					"instanceId": "i-230defk3k",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.71"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "mongo01",
//					"extranetIp": "",
//					"instanceId": "i-234rm8hqd",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.70"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "技审02",
//					"extranetIp": "",
//					"instanceId": "i-23w9a8ldl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.21"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-15T10:47Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-cas02",
//					"extranetIp": "121.43.175.119",
//					"instanceId": "i-23r2yts7w",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.12"
//				}], [{
//					"monitorState": "OK",
//					"createTime": "2016-05-09T06:25Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "dayang-edit02",
//					"extranetIp": "121.196.213.77",
//					"instanceId": "i-233kvml67",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.74"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-04T09:33Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-edit02",
//					"extranetIp": "121.196.219.34",
//					"instanceId": "i-23vafwvya",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.75"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-28T07:52Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "jetson02",
//					"extranetIp": "",
//					"instanceId": "i-23yw7xmyv",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.72"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "打包02",
//					"extranetIp": "",
//					"instanceId": "i-230defk3k",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.71"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "mongo03",
//					"extranetIp": "",
//					"instanceId": "i-234rm8hqd",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.70"
//				}, {
//
//					"monitorState": "OK",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "技审01",
//					"extranetIp": "",
//					"instanceId": "i-23w9a8ldl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.21"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-15T10:47Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-cas01",
//					"extranetIp": "121.43.175.119",
//					"instanceId": "i-23r2yts7w",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.12"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-09T06:25Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "dayang-edit01",
//					"extranetIp": "121.196.213.77",
//					"instanceId": "i-233kvml67",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.74"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-04T09:33Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-edit01",
//					"extranetIp": "121.196.219.34",
//					"instanceId": "i-23vafwvya",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.75"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-28T07:52Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "jetson01",
//					"extranetIp": "",
//					"instanceId": "i-23yw7xmyv",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.72"
//				}], [{
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "打包04",
//					"extranetIp": "",
//					"instanceId": "i-230defk3k",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.71"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "mongo04",
//					"extranetIp": "",
//					"instanceId": "i-234rm8hqd",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.70"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-21T10:16Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "技审05",
//					"extranetIp": "",
//					"instanceId": "i-23w9a8ldl",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.26.21"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-07-15T10:47Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-cas03",
//					"extranetIp": "121.43.175.119",
//					"instanceId": "i-23r2yts7w",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.12"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-09T06:25Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "dayang-edit05",
//					"extranetIp": "121.196.213.77",
//					"instanceId": "i-233kvml67",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.74"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-05-04T09:33Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "cdv-edit03",
//					"extranetIp": "121.196.219.34",
//					"instanceId": "i-23vafwvya",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.4.75"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-28T07:52Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "jetson03",
//					"extranetIp": "",
//					"instanceId": "i-23yw7xmyv",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.72"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "打包03",
//					"extranetIp": "",
//					"instanceId": "i-230defk3k",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.71"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:17Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "mongo04",
//					"extranetIp": "",
//					"instanceId": "i-234rm8hqd",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.70"
//				}, {
//					"monitorState": "OK",
//					"createTime": "2016-04-27T05:11Z",
//					"source": "openstackcj-cjy",
//					"memorySize": "",
//					"status": "Running",
//					"instanceName": "内容管理-ECS01",
//					"extranetIp": "121.196.195.243",
//					"instanceId": "i-235inctt7",
//					"diskSize": "",
//					"cpuCoreCount": "",
//					"intranetIp": "172.20.2.69"
//				}]];
//            if (cloud) {
//                cloud.instanceListData = data[i];
//                Cloud.getInstanceListCallback(cloud);
//            }
//    	}
//		 假数据结束
		loadData();
//		var i = 0;
//		loadData(i);
//		i++;
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
			if(i >= 4){
				i=0;
			}
			if (cloud) {
				cloud.instanceListData = data2array[i];
				Cloud.getInstanceListCallback(cloud);
			}
			i++;
//			loadData(i);
//			i++;
//			loadData();
		}, 300000);

	},
	getInstanceListCallback: function(cloud) {
		//先生成图表，然后各依次对各虚拟机逐个更新CPU 、内存信息
		Cloud.createInstanceListBar(cloud);
		var instanceList = cloud.instanceListData;
		var instanceIds = [];
		//3天----现在
		var beginTime = Utils.parseTime(new Date().getTime() - 259200000, 'y-m-d', true) + decodeURIComponent('%20') + Utils.parseTime(new Date().getTime() - 259200000, 'h:i', true);
		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + decodeURIComponent('%20') + Utils.parseTime(new Date().getTime(), 'h:i', true);

		for (var i in instanceList) {
			(function(){
				var instance = instanceList[i];
				var param = {
					platformId: 'sc-test',
					instanceId: instance.instanceId,
					beginTime: beginTime,
					endTime: endTime
				}
				CentralProxy.getCpuInfo(param, function(resp) {
					if (resp.errorMsg != null) {
						console.log(resp.errorMsg);
						return;
					}
					var data = resp.data;

					if (data && data.length > 0) {
						instance.cpuInfo = data[0];
						Cloud.createInstanceListBar(cloud);
					}
				});
//				假数据
//	    		instance.cpuInfo = {
//	    				"time": "2016-07-29 06:12",
//	    				"cpuUsed": Math.random(),
//	    				"source": "openstackcj-cjy",
//	    				"instanceId": "i-235inctt7"
//	    		};
//	    		Cloud.createInstanceListBar(cloud);

				CentralProxy.getMemoryInfo(param, function(resp) {
					if (resp.errorMsg != null) {
						console.log(resp.errorMsg);
						return;
					}
					var data = resp.data;

					if (data && data.length > 0) {
						instance.memoryInfo = data[0];
						Cloud.createInstanceListBar(cloud);
					}
				});

				//假数据
//	    		instance.memoryInfo = {
//	    				"memoryAvailable": Math.random()*3829,
//	    				"time": "2016-07-29 06:12",
//	    				"source": "openstackcj-cjy",
//	    				"instanceId": "i-235inctt7",
//	    				"memoryTotal": 3829
//	    			};
//	    		Cloud.createInstanceListBar(cloud);

				//    		instanceIds[instanceIds.length] = instanceList[i].instanceId;
			})();
		}
		//以下为获取全部数据后再更新图表
		/*var cpuArgs = $.map(instanceIds, function(instanceId){
			var url = 'http://paas.cloud.jstv.com/api/monitor/getCpuInfo/?platformId=openstackcj-cjy&instanceId='+ instanceId +'&beginTime='+ beginTime +'&endTime=' + endTime;
			return $.get(url).done(function(resp){
				for(var i in instanceList){
		    		if(instanceList[i].instanceId == instanceId){
		    			instanceList[i].cpuInfo = resp.data;
		    		}
		    	}
			});
		});
    	
		var memoryArgs = $.map(instanceIds, function(instanceId){
			var url = 'http://paas.cloud.jstv.com/api/monitor/getMemoryInfo/?platformId=openstackcj-cjy&instanceId='+ instanceId +'&beginTime='+ beginTime +'&endTime=' + endTime;
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
		CentralProxy.getInstanceInfo(function(resp) {
			if (resp.errorMsg != null) {
				console.log(resp.errorMsg);
				return;
			}
			var data = resp.data;
			if (cloud) {
				cloud.instanceInfo = data;
				Cloud.getInstanceInfoCallback(cloud);
			}
		});
//		调试使用假数据
//		var totalCount = 137+Math.floor(10*Math.random());
//		var runCount = 117 + Math.floor(20*Math.random());
//		var errorCount = totalCount - runCount;
//		var totalCount = 477;
//		var runCount = 463;
//		var errorCount = 14;
//				var data = {
//						"runCount": runCount,
//						"source": "openstackcj-cjy",
//						"totalCount": totalCount,
//						"errorCount": errorCount
//					};
//		        if (cloud) {
//		            cloud.instanceInfo = data;
//		            Cloud.getInstanceInfoCallback(cloud);
//		        }
	},
	getInstanceInfoCallback: function(cloud) {
		Cloud.createStatePie(cloud);
	},
	getStorageInfo: function(cloud) {
//		var param = {
//				"accessToken": "1232514566",
//				"timeStamp": "1235342534",
//				"storageId":"dev1"
//		}
//		CentralProxy.getStorageInfo(param, function(resp) {
//			if (resp.errorMsg != null) {
//				console.log(resp.errorMsg);
//				return;
//			}
//			var data = resp.data;
//			if (cloud) {
//				cloud.storageInfo = data;
//				Cloud.getStorageInfoCallback(cloud);
//			}
//		});
		// 调试使用假数据
//		    	var data = {
//		    			"totalStorageSize": Math.floor(2153569491532*(1+Math.random()/5)),
//		    			"source": "openstackcj-cjy",
//		    			"monthTotalStorageSize": Math.floor(415876704704*(1+Math.random()/5)),
//		    			"weekTotalStorageSize": Math.floor(219994979367*(1+Math.random()/5))
//		    		};
//		    	var data = {
//		    			"totalStorageSize": Math.floor(65970697666560/1024*(1+Math.random()/5)),
//		    			"source": "openstackcj-cjy",
//		    			"monthTotalStorageSize": Math.floor(8246337208320/1024*(1+Math.random()/5)),
//		    			"weekTotalStorageSize": Math.floor(4362237084880/1024*(1+Math.random()/5)),
//		    			"dayTotalStorageSize": Math.floor(623176726411/1024*(1+Math.random()/5))
//		    		};
//		    	if (cloud) {
//		            cloud.storageInfo = data;
//		            Cloud.getStorageInfoCallback(cloud);
//		        }
		//山西智慧云 人民网提供接口 健康指数
		CentralProxy.getStorageInfo(function(resp) {
			if (resp.errorMsg != null) {
				console.log(resp.errorMsg);
				return;
			}
			var data = resp.data;
			if (cloud) {
				cloud.storageInfo = data;
				Cloud.getStorageInfoCallback(cloud);
			}
		});
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
							'#05b8a3', '#d85d89', '#D85D89', '#E87C25', '#27727B',
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
					data:[]
				},
				series: [
//				    {
//						type: 'pie',
//						selectedMode: 'single',
//						center: ['30%', '50%'],
//						radius: ['40%', '80%'],
//						itemStyle: {
//							normal: {
//								color: function(params) {
//									return colorList[params.dataIndex]
//								},
//								label: {
//									position: 'inner',
//									formatter: '{c}',
//									textStyle: {
//										color: '#DEFDFF',
//										fontFamily: "Microsoft Yahei",
//										fontSize: fontSize
//									},
//								},
//								labelLine: {
//									show: false
//								}
//							}
//						},
//						data: []
//				    }
					{
					    type:'pie',
					    selectedMode: 'single',
					    center: ['30%', '50%'],
					    radius: [0, '50%'],
					    label: {
					        normal: {
					            position: 'center',
					        	textStyle: {
										color: '#ffffff',
										fontFamily: "Microsoft Yahei",
										fontSize: fontSize
									},
					        }
					    },
					    itemStyle: {
							normal: {
								color: '#2e2e2e',
							}
						},
					    labelLine: {
					        normal: {
					            show: false
					        }
					    },
					    data:[]
					},
					{
					    type:'pie',
					    center: ['30%', '50%'],
					    radius: ['49%', '80%'],
					    label: {
					        normal: {
					            show: false
					        }
					    },
						labelLine: {
							show: false
						},
					    itemStyle: {
							normal: {
								color: function(params) {
									return colorList[params.dataIndex]
								},
							}
						},
					    data:[]
					}
				]
			};
			var data = cloud.instanceInfo;
			var legendData = [{
				name: '全部实例 ' + data.totalCount + '个'
			}, {
				name: '正常实例 ' + data.runCount + '个'
			}, {
				name: '异常实例 ' + data.errorCount + '个'
			}];
			var seriesDataTotal = [{
				value: data.totalCount,
				name: '全部实例 ' + data.totalCount + '个'
			}]
			var seriesDataPart = [{
				value: data.runCount,
				name: '正常实例 ' + data.runCount + '个'
			}, {
				value: data.errorCount,
				name: '异常实例 ' + data.errorCount + '个'
			}];
			option.legend.data = legendData;
			option.series[0].data = seriesDataTotal;
			option.series[1].data = seriesDataPart;
			return option;
	},
	
	createStatePie: function(cloud) {
		
		var statePieChart;
		var dom = cloud.options.statePieContainer[0];
//		if (!cloud.statePieChart) {
//			if(!statePieChart){
//				statePieChart = echarts.init(dom);
//			}
//			cloud.statePieChart = statePieChart;
//		} else {
////			statePieChart = cloud.statePieChart;
//			statePieChart = echarts.init(dom);; 
//			cloud.statePieChart = statePieChart;
//		}
		if (!cloud.statePieChart){
			statePieChart = echarts.init(dom);
			cloud.statePieChart = statePieChart;
		}else{
			cloud.statePieChart.dispose();
			cloud.statePieChart = null;
			statePieChart = echarts.init(dom);
			cloud.statePieChart = statePieChart;
		}
		
		var option = Cloud.getStatePieChartOption(cloud);
		statePieChart.setOption(option);
//		if (statePieChart.intervalAnim) {
//			clearInterval(statePieChart.intervalAnim);
//		}
		cloud.statePieChart.intervalAnim = setInterval(function() {
//			cloud.statePieChart.clear();
//			var tempLegend = option.legend.data;
//			var tempSeries = option.series[0].data;
			option.legend.data = [];
			option.series[0].data = [];
			option.series[1].data = [];
			cloud.statePieChart.setOption(option);
			//TODO 加入随机变动开始
//			var totalCount = 137+Math.floor(10*Math.random());
//			var runCount = 117 + Math.floor(20*Math.random());
//			var errorCount = totalCount - runCount;
//			var data = {
//					"runCount": runCount,
//					"source": "openstackcj-cjy",
//					"totalCount": totalCount,
//					"errorCount": errorCount
//				};
//			cloud.instanceInfo = data;
			var optionNew = Cloud.getStatePieChartOption(cloud);
			cloud.statePieChart.setOption(optionNew);
		}, 10000);
	},
	
	getSpaceBarOption: function(cloud){
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var labelColor = '#5793f3', monthColor = '#ffc600', weekColor = '#8c3fcb', dayColor = '#05b8a3', allColor = '#00d4ff';
		var skin = Utils.getSkin();
		if(skin==='blue'){
			labelColor = '#00d4ff';
			monthColor = '#8f82d1'; 
			weekColor = '#C66216'; 
			dayColor = '#05b8a3';
			allColor = '#41BBD2'
		}
		if(skin==='lightblue'){
			labelColor = '#00cdff';
			monthColor = '#ffc600'; 
			weekColor = '#8c3fcb'; 
			dayColor = '#05b8a3'; 
			allColor = '#00cdff';
		}
//		var option = {
//				animationDurationUpdate: 3000,
//				animationDuration: 3000,
//				color: ['#3398DB'],
//				tooltip: {
//					trigger: 'axis',
//					formatter: "{b}:{c}GB",
//					axisPointer: { // 坐标轴指示器，坐标轴触发有效
//						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
//					}
//				},
//				grid: {
//					left: '6%',
//					right: '2%',
//					bottom: '6%',
//					containLabel: true
//				},
//				xAxis: [{
//					show: true,
//					type: 'category',
//					textStyle: {
//						color: '#1e90ff',
//						fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
//						fontSize: fontSize,
//						fontStyle: 'normal',
//						fontWeight: 'bold'
//					},
//					splitLine: {
//						show: false
//					},
//					axisTick: {
//						show: false
//					},
//					axisLabel: {
//						show: true,
//						textStyle: {
//							color: '#dd4444',
//							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
//							fontSize: fontSize,
//							fontStyle: 'normal',
//							fontWeight: 'normal'
//						}
//					},
//					data: [{
//						value: '总存储量',
//						textStyle: {
//							color: labelColor,
//							fontSize: fontSize
//						}
//					}, {
//						value: '月存储量',
//						textStyle: {
//							color: labelColor,
//							fontSize: fontSize
//						}
//					}, {
//						value: '周存储量',
//						textStyle: {
//							color: labelColor,
//							fontSize: fontSize
//						}
//					}, {
//						value: '日存储量',
//						textStyle: {
//							color: labelColor,
//							fontSize: fontSize
//						}
//					}]
//				}],
//				yAxis: [{
//					show: true,
//					type: 'value',
//					axisTick: {
//						show: false
//					},
//					axisLine: {
//						show: false
//					},
//					splitLine: {
//						show: true,
//						lineStyle: {
//							color: labelColor,
//							type: 'solid',
//							width: 1
//						}
//					},
//					splitArea: {
//						show: false
//					},
//					axisLabel: {
//						show: true,
//						textStyle: {
//							color: labelColor,
//							fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
//							fontSize: fontSize,
//							fontStyle: 'normal',
//							fontWeight: 'normal'
//						}
//					},
//					splitNumber: 5
//
//				}],
//				series: [{
//					type: 'bar',
//					stack: 'chart',
//					barCategoryGap: '50%',
//					label: {
//						normal: {
//							show: true,
//							position: 'outside',
////							formatter: '{c}GB',
//							formatter: '{c}条',
//							textStyle: {
//								color:"#ffffff",
//								fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
//								fontSize: fontSize,
//								fontStyle: 'normal',
//								fontWeight: 'normal'
//							}
//						}
//					},
//					data: []
//				},{
//			        type: 'bar',
//			        stack: 'chart',
//			        silent: true,
//			        itemStyle: {
//			            normal: {
//			                color: 'rbga(8,75,154,0.5)',
//			            	opacity: 0.5
//			            }
//			        },
//			        data: []
//			    }]
//			};
//			var data = cloud.storageInfo;
//			var seriesData = [{
//				value: Math.floor(data.total),
//				name: '总存储量',
//				itemStyle: {
//					normal: {
//	                    color: new echarts.graphic.LinearGradient(
//	                            0, 0, 0, 1,
//	                            [
//	                                {offset: 0, color: '#e30f25'},
//	                                {offset:0.2,color:'#e94e18'},
//	                                {offset:0.4,color:'#f18016'},
//	                                {offset:0.6,color:'#f18016'},
//	                                {offset:0.8,color:'#f6e535'},
//	                                {offset: 1, color: '#afd029'},
//	                            ]
//	                    )
//					}
//				}
//			}, {
//				value: Math.floor(data.month),
//				name: '月存储量',
//				itemStyle: {
//					normal: {
//						color: monthColor,
//					}
//				}
//			}, {
//				value: Math.floor(data.week),
//				name: '周存储量',
//				itemStyle: {
//					normal: {
//						color: weekColor,
//					}
//				}
//			}, {
//				value: Math.floor(data.day),
//				name: '日存储量',
//				itemStyle: {
//					normal: {
//						color: dayColor,
//					}
//				}
//			}];
//			var seriesDataBac = [{
//				value: 4,
//				name: '总存储量'
//			}, {
//				value: Math.floor(data.total) - Math.floor(data.month)+4,
//				name: '月存储量'
//			}, {
//				value: Math.floor(data.total) - Math.floor(data.week)+4,
//				name: '周存储量'
//			}, {
//				value: Math.floor(data.total) - Math.floor(data.day)+4,
//				name: '日存储量'
//			}];
//			option.series[0].data = seriesData;
//			option.series[1].data = seriesDataBac;
		//人民网接口 健康指数部分
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
					left: '6%',
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
						value: '健康指数',
						textStyle: {
							color: labelColor,
							fontSize: fontSize
						}
					}, {
						value: '非健康指数',
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
					stack: 'chart',
					barCategoryGap: '50%',
					label: {
						normal: {
							show: true,
							position: 'outside',
//							formatter: '{c}GB',
							formatter: '{c}',
							textStyle: {
								color:"#ffffff",
								fontFamily: "Microsoft Yahei, 微软雅黑, Helvetica Neue, Helvetica, Hiragino Sans GB, Segoe UI, Tahoma, Arial, STHeiti, sans-serif",
								fontSize: fontSize,
								fontStyle: 'normal',
								fontWeight: 'normal'
							}
						}
					},
					data: []
				},{
			        type: 'bar',
			        stack: 'chart',
			        silent: true,
			        itemStyle: {
			            normal: {
			                color: 'rbga(8,75,154,0.5)',
			            	opacity: 0.5
			            }
			        },
			        data: []
			    }]
			};
			var data = cloud.storageInfo;
			var seriesData = [{
				value: Math.floor(data.degree),
				name: '健康指数',
				itemStyle: {
					normal: {
	                    color: new echarts.graphic.LinearGradient(
	                            0, 0, 0, 1,
	                            [
	                                {offset: 0, color: '#e30f25'},
	                                {offset:0.2,color:'#e94e18'},
	                                {offset:0.4,color:'#f18016'},
	                                {offset:0.6,color:'#f18016'},
	                                {offset:0.8,color:'#f6e535'},
	                                {offset: 1, color: '#afd029'},
	                            ]
	                    )
					}
				}
			}, {
				value: Math.floor(100 - data.degree),
				name: '非健康指数',
				itemStyle: {
					normal: {
						color: monthColor,
					}
				}
			}];
			var seriesDataBac = [{
				value: 100 - data.degree,
				name: '健康指数'
			}, {
				value: data.degree,
				name: '非健康指数'
			}];
			option.series[0].data = seriesData;
			option.series[1].data = seriesDataBac;
			return option;
	},
	
	createSpaceBar: function(cloud) {
		var fontSize = Utils.getEchartsFontSize(22, 1920);
		var spaceBarChart;
		var dom = cloud.options.spaceBarContainer[0];		
//		if (!cloud.spaceBarChart) {
//			if(!spaceBarChart){
//				spaceBarChart = echarts.init(dom);
//			}
//			cloud.spaceBarChart = spaceBarChart;
//		} else {
////			spaceBarChart = cloud.spaceBarChart;
//			spaceBarChart = echarts.getInstanceByDom(dom);
//			cloud.spaceBarChart = spaceBarChart;
//		}
		if(!cloud.spaceBarChart){
			spaceBarChart = echarts.init(dom);
			cloud.spaceBarChart = spaceBarChart;				
		}else{
			cloud.spaceBarChart.dispose();
			cloud.spaceBarChart = null;
			spaceBarChart = echarts.init(dom);
			cloud.spaceBarChart = spaceBarChart;			
		}

		var option = Cloud.getSpaceBarOption(cloud);
		spaceBarChart.setOption(option);
//		if (spaceBarChart.intervalAnim) {
//			clearInterval(spaceBarChart.intervalAnim);
//		}
		cloud.spaceBarChart.intervalAnim = setInterval(function() {
//			cloud.spaceBarChart.clear();
//			var temp = option.series[0].data;
			option.series[0].data = [];
			option.series[1].data = [];
			cloud.spaceBarChart.setOption(option);
//			//TODO 假数据增加随机变动
//			for(var i in temp){
//				temp[i].value = Math.floor(temp[i].value + (temp[i].value/10)*(1-2*Math.random()));
//			}
//			option.series[0].data = temp;
			var optionNew = Cloud.getSpaceBarOption(cloud);
			cloud.spaceBarChart.setOption(optionNew);
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
			cpuColor = '#ffc600'; 
			memoryColor = '#05b8a3'; 
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
							width: 2,
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
								fontSize: 18,
								fontStyle: 'normal',
								fontWeight: 'normal'
							}
						}
					},
					itemStyle: {
						normal: {
							color: cpuColor,
							barBorderRadius: 8,
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
								fontSize: 18,
								fontStyle: 'normal',
								fontWeight: 'normal'
							}
						}
					},
					itemStyle: {
						normal: {
							color: memoryColor,
							barBorderRadius: 8,
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
						        color: '#fe5900'
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
		var dom = cloud.options.instanceBarContainer[0];		
//		if (!cloud.instanceListBarChart) {
//			if(!instanceListBarChart){
//				instanceListBarChart = echarts.init(dom);				
//			}
//			cloud.instanceListBarChart = instanceListBarChart;
//		} else {
////			instanceListBarChart = cloud.instanceListBarChart;
//			instanceListBarChart = echarts.getInstanceByDom(dom);	
//			cloud.instanceListBarChart = instanceListBarChart;
//		}
		if (!cloud.instanceListBarChart) {
			instanceListBarChart = echarts.init(dom);
			cloud.instanceListBarChart = instanceListBarChart;			
		}else{
			cloud.instanceListBarChart.dispose();
			cloud.instanceListBarChart = null;
			instanceListBarChart = echarts.init(dom);
			cloud.instanceListBarChart = instanceListBarChart;
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
			if (cloud.statePieChart.intervalAnim) {
				clearInterval(cloud.statePieChart.intervalAnim);
			}
			if (cloud.spaceBarChart.intervalAnim) {
				clearInterval(cloud.spaceBarChart.intervalAnim);
			}
			
//			cloud.instanceListBarChart.dispose();
//			cloud.spaceBarChart.dispose();
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
    setTimeout(function () {
    	window.location.reload();
    }, 7200000);
});