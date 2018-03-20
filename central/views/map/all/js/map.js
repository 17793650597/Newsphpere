function ResourceMap(divID) {
	this.map = null;
	this.divID = divID;
	this.markerArr = new Array();
	this.deviceidArr = new Array();//采访任务分配的设备ID数组
	this.useridArr = new Array();//采访任务记者ID数组
	this.interviewMapControl = null;
	this.topicMapControl = null;
	this.interval = null;
	var mapConf = ModuleConfigHelper.getConfigByModuleName('ns.map.newsphere');
	this.defaultLbs = !!mapConf ? mapConf.defaultLBS : '116.425627,39.915219';
	
	$('#'+this.divID).empty();
	/**
	 * 初始化地图
	 */
	this.initMap = function(){
		var obj = this;
		$.ajax({
			  url: 'http://api.map.baidu.com/getscript?v=2.0&ak=epWoVCqlhofczATzUN0gl4UT',
			  dataType: 'script',
			  success: function(response,status){
				  if(BMap){
					  obj.map = new BMap.Map(obj.divID);
					  obj.map.addEventListener("load", function(){
					

						var id = getUrlParam('id');
						var moid = getUrlParam('moid');
						if(id){
							/**
							 * 采访任务控件
							 */
							function InterviewMapControl(){
								
							};
							InterviewMapControl.prototype = new BMap.Control();
							InterviewMapControl.prototype.hide = function(){
								$('.map-interview').hide();
							};
							InterviewMapControl.prototype.show = function(){
								$('.map-interview').show();
							};
							InterviewMapControl.prototype.initialize = function(map){
								obj.initInterviewMap(map.getContainer());
							};
							obj.interviewMapControl = new InterviewMapControl();
							obj.map.addControl(obj.interviewMapControl);
						}else if(moid){
							/**
							 * 报题控件
							 */
							function TopicMapControl(){
								
							};
							TopicMapControl.prototype = new BMap.Control();
							TopicMapControl.prototype.hide = function(){
								$('.map-topic').hide();
							};
							TopicMapControl.prototype.show = function(){
								$('.map-topic').show();
							};
							TopicMapControl.prototype.initialize = function(map){
								obj.initTopicMap(map.getContainer());
							};
							obj.topicMapControl = new TopicMapControl();
							obj.map.addControl(obj.topicMapControl);
						}else{
							obj.load();
							obj.loadReporterStation();

							/**
							 * 功能开关控件
							 */
							function ResourceMapControl(){
								
							};
							ResourceMapControl.prototype = new BMap.Control();
							ResourceMapControl.prototype.initialize = function(map){
								obj._initRightNav(map.getContainer());
							};
							obj.map.addControl(new ResourceMapControl());
							
							obj.mapGeoc = new BMap.Geocoder();
						};
						
					  });
					  
					  obj._initMapCallback();
				  } else {
					  $('#'+obj.divID).text('地图初始化失败！');
				  }
			  }
		});
	};
	/**
	 * 初始化地图回掉函数
	 */
	this._initMapCallback = function(result){
		if(!result){
			var conf = ModuleConfigHelper.getConfigByModuleName('ns.map.newsphere');
			this.map.centerAndZoom(conf.defaultPosition);
		} else {
			this.map.centerAndZoom(result.name);//注意：此方法为异步
		}
		this.map.enableScrollWheelZoom(); 
		this.map.enableKeyboard();
		this.map.disableDoubleClickZoom();
		var bottom_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});// 左上角，添加比例尺
		var bottom_left_navigation = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});  //左上角，添加默认缩放平移控件
		var overView = new BMap.OverviewMapControl();
		var overViewOpen = new BMap.OverviewMapControl({isOpen:false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT});//右下角缩略图
		this.map.addControl(new BMap.MapTypeControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
		this.map.addControl(bottom_left_control);
		this.map.addControl(bottom_left_navigation);
		this.map.addControl(overView);
		this.map.addControl(overViewOpen);
	};
	this.buildInterviewStatusLi = function(text,complete){
		var $li = $('<li>').text(text);
		$li.append('<br>');
		$li.append('<i class="glyphicon glyphicon-arrow-right"></i>');
		if(complete){
			$li.addClass('complete');
			$li.append('<i class="glyphicon glyphicon-certificate"></i>');
		}else{
			$li.append('<i class="glyphicon glyphicon-time"></i>');
		}
		return $li;
	};
	/**
	 * 加载数据
	 */
	this.load = function(flag){
		var obj = this;
		this._load(flag);
		if(this.interval){
			window.clearInterval(this.interval);
		};
		this.interval = window.setInterval(function(){
			obj._load(flag);
		}, 60000);
	};
	this._load = function(flag){
		var obj = this;
		obj.removeMarkerArr();//删除已有的标注
		switch (flag) {
			case 1:{
				obj.loadDevices();
				break;
			}
			case 2:{
				obj.loadAppUsers();
				break;
			}
			default:{
				obj.loadDevices();
				obj.loadAppUsers();
				break;
			}
		}
	};
	/**
	 * 初始化功能开关
	 */
	this._initRightNav = function(container){
		var obj = this;
		var $nav = $('<div>').addClass('right-nav').appendTo(container);
		/**
		 * 功能开关
		 */
		var $ul = $('<ul>').addClass('list-unstyled right-ul').appendTo($nav);
		var $li01 = $('<li class="current"><a title="全部资源分布" href="javascript:;"><i class="fa fa-video-camera"></i>全部</a></li>').appendTo($ul);
		var $li02 = $('<li><a title="通联、记者站分布" href="javascript:;"><i class="fa fa-fax"></i>站点</a></li>').appendTo($ul);
		var $li03 = $('<li><a title="记者人员分布" href="javascript:;"><i class="fa fa-users"></i>记者</a></li>').appendTo($ul);
		var $li04 = $('<li><a title="高级检索" href="javascript:;"><i class="fa fa-search"></i>高级</a></li>').appendTo($ul);
		$li01.click(function(){
			$ul.find('li').removeClass('current');
			$(this).addClass('current');
			obj.load();
		});
		$li02.click(function(){
			$ul.find('li').removeClass('current');
			$(this).addClass('current');
			obj.load(1);
		});
		$li03.click(function(){
			$ul.find('li').removeClass('current');
			$(this).addClass('current');
			obj.load(2);
		});
		$li04.click(function(){
			$ul.find('li').removeClass('current');
			$(this).addClass('current');
			if($(".div-search").is(":hidden")){
				obj.openSearch();
			}else{
				obj.closeSearch();
			}
		});
		
		/**
		 * 检索列表
		 */
		var $right_search = $('<div>').addClass('right-search').appendTo($nav);
		var html = '<div class="input-group">				<input class="form-control" placeholder="请输入搜索关键字" id="fullText" type="text">				<span class="input-group-btn">	  				<button class="btn btn-default" type="button">	  				<span class="glyphicon glyphicon-search"></span></button>				</span>				</div><ul class="list-unstyled"></ul>';
		var $div_search = $('<div>').addClass('div-search').appendTo($right_search);
		$div_search.append(html);
		$div_search.find('input').keyup(function(){
			obj.searchMarker();
		});
		$div_search.find('button').click(function(){
			obj.searchMarker();
		});
	};
	this.initInterviewMap = function(container){
		var obj = this;
		var id = getUrlParam('id');
		$.ajax({
			url		: '/web/api/interview/getInterview?interviewID=' + id,
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				if(response.code==0){
					var interview = response.result;
					var faceUserId = '';
					var pt = new BMap.Point(obj.verifyLbs(interview.lbs).split(',')[0], obj.verifyLbs(interview.lbs).split(',')[1]);
					var myIcon = new BMap.Icon("../../../images/map-interview.gif", new BMap.Size(100,100),{ offset: new BMap.Size(0, 0), imageOffset: new BMap.Size(0, 0) });
					var marker = new BMap.Marker(pt,{icon:myIcon});
					marker.setTop(true);
					obj.map.addOverlay(marker);
					marker.addEventListener("click", function(event){
						if($('.map-interview').is(':hidden')){
							obj.interviewMapControl.show();
						}else{
							obj.interviewMapControl.hide();
						}
					}); 
					obj.map.centerAndZoom(pt,17);
					
					$(interview.assignedDevices).each(function(index,item){
						obj.deviceidArr.push(item.deviceID);
					});
					if(interview.reportersID!=null){
						obj.useridArr = interview.reportersID.split(',');
						faceUserId = obj.useridArr[0];
					}
					obj.load();
					
					var $div = $('<div>').addClass('map-interview').appendTo(container);
					var $center = $('<div>').addClass('layout-center').appendTo($div);
					$('<p>').appendTo($center).text('记者： '+interview.reporters);
//					$('<p>').appendTo($center).text('设备： '+ obj.deviceidArr.join(','));
					$('<p>').appendTo($center).text('任务地址:  '+interview.intervAddr);
					$('<p>').appendTo($center).text('任务时间:  '+interview.intervBeginTime);
					$('<p>').appendTo($center).text('任务主题:  '+interview.interviewName);
					$('<img>').appendTo($div).attr('src','../../api/user/face/' + faceUserId);
					var $close = $('<i class="fa fa-close" title="关闭" style="position: absolute; top: 5px; color: white; cursor: pointer; font-size: 20px; right: 8px;"></i>').appendTo($div);
					$close.click(function(){
						obj.interviewMapControl.hide();
					});
				}
			}
		});
		/**
		 * 加载记者站
		 */
		obj.loadReporterStation();
	};

	this.initTopicMap = function(container){
		var obj = this;
		var moid = getUrlParam('moid');
		$.ajax({
			url		: '/web/api/resource/getAsset?moid=' + moid,
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			beforeSend: function(jqXHR, settings) {
				jqXHR.setRequestHeader('userID', 'sysman');
				return true;
			},
			success	: function(response) {
				if(response.code==0){
					var assetDescription = response.result.assetDescription;
					var assetname = '', description = '',  tags='',creationdate = '',lbs = '0,0';
					
					//获得报题详情
					if(assetDescription){
						var attributeList = assetDescription.attributeList;		
						for(var i = 0; i < attributeList.length; i++){				
							if(attributeList[i].attributeDefID == 'assetname'){
								assetname = attributeList[i].dataValue;
							}else if(attributeList[i].attributeDefID == 'description'){
								description = attributeList[i].dataValue;
							} else if (attributeList[i].attributeDefID == 'tags'){
								tags = attributeList[i].dataValue;
							} else if (attributeList[i].attributeDefID == 'creationdate'){
								creationdate = attributeList[i].dataValue.split('.')[0];
							} else if (attributeList[i].attributeDefID == 'lbs'){
								lbs = attributeList[i].dataValue;
							} 
						}
					}
					var faceUserId = '';
					var pt = new BMap.Point(obj.verifyLbs(lbs).split(',')[0], obj.verifyLbs(lbs).split(',')[1]);
					var myIcon = new BMap.Icon("../../.../images/map-interview.gif", new BMap.Size(100,100),{ offset: new BMap.Size(0, 0), imageOffset: new BMap.Size(0, 0) });
					var marker = new BMap.Marker(pt,{icon:myIcon});
					marker.setTop(true);
					obj.map.addOverlay(marker);
					marker.addEventListener("click", function(event){
						if($('.map-topic').is(':hidden')){
							obj.topicMapControl.show();
						}else{
							obj.topicMapControl.hide();
						}
					}); 
					obj.map.centerAndZoom(pt,17);
					obj.load();
					
					var $div = $('<div>').addClass('map-topic').appendTo(container);
					var $center = $('<div>').addClass('layout-center').appendTo($div);
					$('<p>').appendTo($center).text('报题名称： '+assetname);
					$('<p>').appendTo($center).text('创建日期:  '+creationdate);
					$('<p>').appendTo($center).text('标签:  '+tags);
					$('<p>').appendTo($center).text('摘要:  '+description);
					var $close = $('<i class="fa fa-close" title="关闭" style="position: absolute; top: 5px; color: white; cursor: pointer; font-size: 20px; right: 8px;"></i>').appendTo($div);
					$close.click(function(){
						obj.topicMapControl.hide();
					});
				}
			}
		});
		/**
		 * 加载记者站
		 */
		obj.loadReporterStation();
		/**
		 * 加载相关采访任务
		 */
		obj.loadInterviews();
	};
	
	/**
	 * 打开搜索区域
	 */
	this.openSearch = function(){
		this.map.disableScrollWheelZoom();
		var obj = this;
		if (obj.mapNewMarker){//仅当地图上有新点时，才计算距离以及根据距离排序
			$(obj.markerArr).each(function(index,marker){
				var distance = obj.map.getDistance(obj.mapNewMarker.getPosition(),marker.getPosition());
				console.log(distance);
				marker.distance = parseInt(distance);
			});
			obj.markerArr.sort(function(a1, a2) {
				return a1.distance > a2.distance;
			});
		}
		
		$('#fullText').val('');
		this.searchMarker();
		$('.div-search').height($('.right-ul').height());
		$('.right-search').animate({width:'300px'},"slow",function(){
			$('.div-search').show();
		});
	};
	/**
	 * 关闭搜索区域
	 */
	this.closeSearch = function(){
		this.map.enableScrollWheelZoom(); 
		$('.div-search').hide();
		$('.div-search').height(0);
		$('.right-search').animate({width:'0px'},"slow",function(){
		});
	};
	/**
	 * 地图marker搜索
	 */
	this.searchMarker = function(){
		var obj = this;
		$('.div-search ul').empty();
		$(obj.markerArr).each(function(index,marker){
			marker.p_id = 'p_'+index;//用于异步更新地址
			var flag = false;
			var isUser = false;
			if(marker.data.userId){
				isUser = true;
			}
			//var code = marker.data.userId?marker.data.userId:marker.data.deviceID;
			var code = marker.data.userName?marker.data.userName:marker.data.userId;
			var text = $('#fullText').val().trim();
			if(text!=''){
				if(text.indexOf(code)>=0||code.indexOf(text)>=0){
					flag = true;
				}
			}else{
				flag = true;
			}
			if(flag){
				marker.title = marker.getTitle()+'：'+code;
				var $li = $('<li>');
				if(isUser){
					$('<i class="fa fa-user">').appendTo($li);
				}else{
					$('<i class="fa fa-car">').appendTo($li);
				}
				$('<a>').text(marker.title).appendTo($li);
//				var props = marker.data.properties;
//				var phone = '', org = '';
//				$(props).each(function(i, item){
//					if(item.keyID == "clueorgname"){
//						org = item.keyValue;
//					} else if(item.keyID == "cellphone"){
//						phone = item.keyValue;
//					}
//				});
				var phone = marker.data.phone;
				
				$('<p>').text("电话：" + phone).appendTo($li);
				$('<p>').text("坐标：" + marker.getPosition().lng).appendTo($li);
				$('<p class="lbs-lat">').text(marker.getPosition().lat).appendTo($li);
				if (obj.mapNewMarker){
					$('<p>').text("距离: " + marker.distance + "米").appendTo($li);
				}
				$('<p id='+marker.p_id+'>').text("地址: ").appendTo($li);
				$('.div-search ul').append($li);
				$li.click(function(){
					var object = $(this).data('data');
					var infoWindow = obj.mapBuildInfoWindow(object.title, 
							object.address, object.getPosition(), null, phone);
					obj.map.openInfoWindow(infoWindow,object.getPosition()); //开启信息窗口
				});
				obj.mapGeoc.getLocation(marker.getPosition(), function(rs){//异步更新列表地址
					var address = rs.address;
					$('#'+marker.p_id).text("地址: "+address);
					marker.address = address;
					$li.data('data',marker);
				});
			}
		});
	};
	this.loadInterviews = function(){
		var obj = this;
		var param = {conditions: [{logic:'=',name:'moid',relation:'AND',value:getUrlParam('moid')}],
				 relation: 'AND',
				 orderBy: [{name: 'createdate',order: 'DESC'}],
				 start: 0,
				 limit: -1};

		$.ajax({
			url		: '/web/api/interview/queryInterviews',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response){
			if(response.code==0){
				var list = response.result;
				for(var i in list){
					var point = new BMap.Point(obj.verifyLbs(list[i].lbs).split(',')[0],obj.verifyLbs(list[i].lbs).split(',')[1]);
					var myIcon = new BMap.Icon("../../../images/"+"m-camera.png", new BMap.Size(20,25),{offset:new BMap.Size(10, 25)});
					var marker = new BMap.Marker(point,{icon:myIcon,title:'采访任务'});  // 创建标注
					obj.map.addOverlay(marker);
				}
			}
		}
	});
	};
	/**
	 * 加载外出设备
	 */
	this.loadDevices = function(type){
		
		var obj = this;
		
		var param = {
				conditions : [ {
					name : 'status',
					logic : 'IN',
					values : ['外借']
				},{
					name : 'devicetype',
					logic : 'IN',
					values : [DEFAULT_DEVICE_TYPE]
				} ],
				relation : 'AND',
				orderBy : [ {
					name : 'devicetype',
					order : 'ASC'
				},{
					name : 'devicemodel',
					order : 'ASC'
				},{
					name : 'deviceid',
					order : 'ASC'
				} ],
				start : 0,
				limit : -1
			};
		
		
		//TODO 通联台、记者站 暂时用假数据
		var response = {
			"code" : 0,
			"message" : "",
			"result" : [
//			    {
//					"deviceType" : "记者站",
//					"deviceID" : "大学城",
//					"phone": "",
//					"lbs" : "116.490147,39.950525",
//					"properties": [{
//						"keyID": "cellphone",
//						"keyValue": "010-66666666",
//						"otherAttributes": {}
//					}, {
//						"keyID": "e-mail",
//						"keyValue": "",
//						"otherAttributes": {}
//					}, {
//						"keyID": "telphone",
//						"keyValue": "",
//						"otherAttributes": {}
//					}]
//			    },{
//					"deviceType" : "温岭电视台",
//					"deviceID" : "温岭电视台",
//					"phone": "",
//					"lbs" : "121.3887868721,28.3911268356",
//					"properties": [{
//						"keyID": "cellphone",
//						"keyValue": "0576-86241223",
//						"otherAttributes": {}
//					}, {
//						"keyID": "e-mail",
//						"keyValue": "",
//						"otherAttributes": {}
//					}, {
//						"keyID": "telphone",
//						"keyValue": "",
//						"otherAttributes": {}
//					}]
//			    }
			    ]
		};
		if(response.code==0){
			var list = response.result;
			for(var i in list){
				if(list[i].lbs!=null&&list[i].lbs.split(',').length==2){
					var gpsPoint = new BMap.Point(list[i].lbs.split(',')[0],list[i].lbs.split(',')[1]);
					var marker = null;
					switch (list[i].deviceType) {
						case '通联台':{
							marker = obj.buildMarker('m-vidicon.png', gpsPoint, list[i].deviceID,'通联台');
							break;
						}
						case '记者站':{
							marker = obj.buildMarker('m-station.png', gpsPoint, list[i].deviceID,'记者站');
							break;
						}
						case '温岭电视台':{
							marker = obj.buildMarker('marker.png', gpsPoint, list[i].deviceID,'记者站');
							break;
						}
						default:{
//							marker = obj.buildMarker('m-unkown.png', point, object.deviceID,'其他');
							marker = obj.buildMarker('m-car.png', gpsPoint, list[i].deviceID,'车辆');
							break;
						}
					};
					marker.data = list[i];
					obj.markerArr.push(marker);
				}
			}
		}
		
		/*$.ajax({
			url		: '/web/api/resourcedevice/queryByPage',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response){
			if(response.code==0){
				var list = response.result;
				for(var i in list){
					if(list[i].lbs!=null&&list[i].lbs.split(',').length==2){
						var gpsPoint = new BMap.Point(list[i].lbs.split(',')[0],list[i].lbs.split(',')[1]);
						BMap.Convertor.translate(gpsPoint,0,function(point,object){//坐标转换需要引用“http://developer.baidu.com/map/jsdemo/demo/convertor.js”
						var marker = null;
						switch (object.deviceType) {
//							case '通联':{
//									marker = obj.buildMarker('m-car.png', point, object.deviceID,'车辆');
//								break;
//							}
							case '通联台':{
								marker = obj.buildMarker('m-vidicon.png', point, object.deviceID,'通联台');
								break;
							}
							case '记者站':{
								marker = obj.buildMarker('m-camera.png', point, object.deviceID,'记者站');
								break;
							}
							default:{
//								marker = obj.buildMarker('m-unkown.png', point, object.deviceID,'其他');
								marker = obj.buildMarker('m-car.png', point, object.deviceID,'车辆');
								break;
							}
						};
						marker.data = object;
						obj.markerArr.push(marker);
						},list[i]); 
					}
				}
			}
		}
	});*/
	};
	/**
	 * 加载在线APP人员
	 */
	this.loadAppUsers = function(){
		var obj = this;
		//TODO 暂时用假数据
		//旧版假数据（没有电话）
//		var response = {
//		"code":0,
//		"message":"",
//		"result":[
//		    {
//				"userId": "张翰",
//				"phone": "18811309328",
//				"lbs": "106.554412,29.555183",
//			},{
//				"userId": "李勇",
//				"phone": "18812345678",
//				"lbs": "106.524804,29.522629"
//			},{
//				"userId": "吴建国",
//				"phone": "13912345678",
//				"lbs": "106.444633,29.481261"
//			},{
//				"userId": "郑小星",
//				"phone": "13912345678",
//				"lbs": "106.508448,29.591873"
//			},{
//				"userId": "郭佳",
//				"phone": "13912345678",
//				"lbs": "106.610179,29.683788"
//			}
//		]
//	};
		//现用假数据
//		var response = {
//			"code":0,
//			"message":"",
//			"result":[{
//						"userId": "bj010001",
//						"lbs": "116.314937,39.924626",
//						"phoneNum": null,
//						"userName": "何光晖",
//						"properties": [{
//							"keyID": "cellphone",
//							"keyValue": "13834132406",
//							"otherAttributes": {}
//						}, {
//							"keyID": "e-mail",
//							"keyValue": "",
//							"otherAttributes": {}
//						}, {
//							"keyID": "telphone",
//							"keyValue": "",
//							"otherAttributes": {}
//						}]
//					}, {
//						"userId": "bj010002",
//						"lbs": "116.389857,39.879020",
//						"phoneNum": null,
//						"userName": "王清文",
//						"properties": [{
//							"keyID": "cellphone",
//							"keyValue": "13623661318",
//							"otherAttributes": {}
//						}, {
//							"keyID": "e-mail",
//							"keyValue": "",
//							"otherAttributes": {}
//						}, {
//							"keyID": "telphone",
//							"keyValue": "",
//							"otherAttributes": {}
//						}]
//					}
//		]}
//		if(response.code==0){
//			var list = response.result;
//			for(var i in list){
//				var point = new BMap.Point(obj.verifyLbs(list[i].lbs).split(',')[0],obj.verifyLbs(list[i].lbs).split(',')[1]);
//				var props = list[i].properties;
//				var phone = '', org = '';
//				$(props).each(function(i, item){
//					if(item.keyID == "clueorgname"){
//						org = item.keyValue;
//					} else if(item.keyID == "cellphone"){
//						phone = item.keyValue;
//					}
//				});	
//				var marker = obj.buildMarker('m-reporter.png', point, list[i].userId,'记者',phone);
//				marker.data = list[i];
//				obj.markerArr.push(marker);
//			}
//		}
		//数据接入
//		$.ajax({
//			url		: '/ns/api/show/appUserOnline',
//			type	: 'GET',
//			async	: true,
//			contentType : 'application/json; charset=UTF-8',
//			data 	: null,
//			success	: function(response){
//				if(response.code==0){
//					var list = response.result;
//					for(var i in list){
//						var point = new BMap.Point(obj.verifyLbs(list[i].lbs).split(',')[0],obj.verifyLbs(list[i].lbs).split(',')[1]);
//						var props = list[i].properties;
//						var phone = '', org = '';
//						$(props).each(function(i, item){
//							if(item.keyID == "clueorgname"){
//								org = item.keyValue;
//							} else if(item.keyID == "cellphone"){
//								phone = item.keyValue;
//							}
//						});	
//						var marker = obj.buildMarker('m-reporter.png', point, list[i].userId,'记者',phone);
//						marker.data = list[i];
//						obj.markerArr.push(marker);
//					}
//				}
//			}
//		});
		//山西智慧云数据接入
		var secretKey = "FE220AAA9AA95C31A23005D2CB9F7854";
		var timeStamp = new Date().getTime();
		var hash = hex_md5(secretKey + timeStamp);
		var param = {
			"accessToken": hash,
			"timeStamp": timeStamp
		}
		var appUrl = ModuleConfigHelper.getConfigByModuleName('ns.map.newsphere').appUrl;
		$.ajax({
			url		: appUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response){
				if(JSON.parse(response).code==0){
					var list = JSON.parse(response).data.results;
					for(var i in list){
						var point = new BMap.Point(list[i].longitude, list[i].latitude);
						var phone = list[i].phone;
						var marker = obj.buildMarker('m-reporter2.png', point, list[i].userName, '记者', phone, list[i].smallHead);
						marker.data = list[i];
						obj.markerArr.push(marker);
					}
				}
			}
		});
	};
	/**
	 * 加载记者站
	 */
	this.loadReporterStation = function(){
		//TODO 无用暂时屏蔽
		return;
		var obj = this;
		$.ajax({
			url		: '/web/api/screenconfig/getValue',
			type	: 'POST',
			data	: JSON.stringify(null),
			contentType : 'application/json; charset=UTF-8',
			async	: true,
			success	: function(response) {
				if(response.code==0){
					$(response.result).each(function(index, config){
						if(config.key == 'reporter_station'){
							var arr = JSON.parse(config.value);
							$(arr).each(function(index, row){
								var point = new BMap.Point(obj.verifyLbs(row.lbs).split(',')[0],obj.verifyLbs(row.lbs).split(',')[1]);
								var myIcon = new BMap.Icon("../../base/images/m-station2.png", new BMap.Size(20,25),{offset:new BMap.Size(10, 25)});
								var marker = new BMap.Marker(point,{icon:myIcon,title:'记者站'});  // 创建标注
								var label = new BMap.Label(row.name,{offset:new BMap.Size(20,0)});
//									marker.setLabel(label);
								obj.map.addOverlay(marker);
							});
						}
					});
				}
			}
		});
	};
	/**
	 * 构建标注
	 */
	this.buildMarker = function(png, point, label, title, phoneNum, jpg){
		var obj = this;
		var myIcon = new BMap.Icon("../../../images/"+png, new BMap.Size(20,25),{offset:new BMap.Size(10, 25)});
		var marker = new BMap.Marker(point,{icon:myIcon,title:title});  // 创建标注
		this.map.addOverlay(marker);
		marker.addEventListener("click", function(event){
			var title = event.target.getTitle();
			//var label = event.target.data.userId?event.target.data.userId:event.target.data.deviceID;
			var label = event.target.data.userName?event.target.data.userName:event.target.data.userId;
			var avatar = null;
			if (event.target.data.userId) {  //两会暂时屏蔽图片
				
//				avatar = "../../../images/info/"+ label + ".jpg";event.target.data.userId
				avatar = jpg || "http://7xr4g8.com1.z0.glb.clouddn.com/1";
//				avatar = "http://7xr4g8.com1.z0.glb.clouddn.com/"
//						+ (parseInt(900 * Math.random()));
			}
			obj.mapGeoc.getLocation(event.target.point, function(rs) {
				var address = rs.address;
				var infoWindow = obj.mapBuildInfoWindow(title + "：" + label,
						address, event.target.point, avatar, phoneNum);
				obj.map.openInfoWindow(infoWindow, event.target.point); // 开启信息窗口
			});
		});
		return marker;
	};
	/**
	 * 批量删除标注
	 */
	this.removeMarkerArr = function(){
		var obj = this;
		for(var i in obj.markerArr){
			obj.markerArr[i].remove();
		}
		obj.markerArr = new Array();
	};
	/**
	 * 构建弹框
	 */
	this.mapBuildInfoWindow = function(title, address, point, avatar, phone){
		var html = '<div>坐标：'+point.lng+' '+point.lat+'</div>\
			<div>电话：<a href="javascript:;" onclick="IM.call('+phone+');" class="phone">'+phone+'</a><span id="calling"></span></div>\
			<div>地址：'+address+'</div>\
			<div class="avatar-container">';
		var avatarHtml = '';
		if(avatar){
			avatarHtml = '<img class="avatar" src="'+ avatar +'">';
		}
		html = html + avatarHtml +'</div>';
		var infoWindow = null;
		infoWindow = new BMap.InfoWindow(html, {
			title  : title,      // 标题
			panel  : "panel",         // 检索结果面板
			enableAutoPan : true,
			enableMessage:false
		});
		return infoWindow;
	};
	/**
	 * 验证lbs合法性，不合法返回台内坐标
	 */
	this.verifyLbs = function(lbs){
		if(lbs!=null&&lbs.split(',').length==2){
			if(lbs=='0,0'){
				return this.defaultLbs;
			}else{
				return lbs;
			}
		}else{
			return this.defaultLbs;
		}
	};
};

window.IM = window.IM || {
	_appid : '8aaf0708570871f8015717a8fb660851', 
	_loginType: 1,
	/**
	 * 初始化
	 * 
	 * @private
	 */
	init: function() {
		// 初始化SDK
		var resp = RL_YTX.init(IM._appid);
		if (!resp) {
			alert('SDK初始化错误');
			return;
		};
		
		if (200 == resp.code) { // 初始化成功
			console.log(resp);
		} else if (174001 == resp.code) { // 不支持HTML5
			var r = confirm(resp.msg);
			if (r == true || r == false) {
				window.close();
			}
		} else if (170002 == resp.code) { //缺少必须参数
			console.log("错误码：170002,错误码描述" + resp.msg);
		} else {
			console.log('未知状态码');
		};
		IM._Notification = window.Notification || window.mozNotification || window.webkitNotification || window.msNotification || window.webkitNotifications;
		if (!!IM._Notification) {
			IM._Notification.requestPermission(function(permission) {
				if (IM._Notification.permission !== "granted") {
					IM._Notification.permission = "granted";
				}
			});
		}
	},
	Do_login: function() {
		console.log("DO_login");

		var user_account = "18612568045";
		var pwd = "";
		//校验登陆格式
		IM._login(user_account, pwd);
	},
	/**
	 * 正式处理登录逻辑，此方法可供断线监听回调登录使用 获取时间戳，获取SIG，调用SDK登录方法
	 * 
	 * @param user_account
	 * @param pwd 密码
	 * @private
	 */
	_login: function(user_account, pwd) {
		var timestamp = IM._getTimeStamp();

			//仅用于本地测试，官方不推荐这种方式应用在生产环境
			//没有服务器获取sig值时，可以使用如下代码获取sig
//			var appToken = '17E24E5AFDB6D0C1EF32F3533494502B'; //使用是赋值为应用对应的appToken
			var appToken = '00f295c6c8c7b7c7c2ef0c3352d9a101';//开发token
			var sig = hex_md5(IM._appid + user_account + timestamp + appToken);
			console.log("本地计算sig：" + sig);
			IM.EV_login(user_account, pwd, sig, timestamp);
	},
	/**
	 * 获取当前时间戳 YYYYMMddHHmmss
	 * 
	 * @returns {*}
	 */
	_getTimeStamp: function() {
		var now = new Date();
		var timestamp = now.getFullYear() + '' + ((now.getMonth() + 1) >= 10 ? "" + (now.getMonth() + 1) : "0" + (now.getMonth() + 1)) + (now.getDate() >= 10 ? now.getDate() : "0" + now.getDate()) + (now.getHours() >= 10 ? now.getHours() : "0" + now.getHours()) + (now.getMinutes() >= 10 ? now.getMinutes() : "0" + now.getMinutes()) + (now.getSeconds() >= 10 ? now.getSeconds() : "0" + now.getSeconds());
		return timestamp;
	},
	/**
	 * 事件，登录 去SDK中请求登录
	 * 
	 * @param user_account
	 * @param sig
	 * @param timestamp --
	 *            时间戳要与生成SIG参数的时间戳保持一致
	 * @constructor
	 */
	EV_login: function(user_account, pwd, sig, timestamp) {
		console.log("EV_login");

		var loginBuilder = new RL_YTX.LoginBuilder();
		loginBuilder.setType(IM._loginType);
		loginBuilder.setUserName(user_account);
		if (1 == IM._loginType) { //1是自定义账号，3是voip账号
			loginBuilder.setSig(sig);
		} else {
			loginBuilder.setPwd(pwd);
		}
		loginBuilder.setTimestamp(timestamp);

		RL_YTX.login(loginBuilder, function(obj) {
			console.log("EV_login succ...");

			IM._user_account = user_account;
			IM._username = user_account;
			// 注册PUSH监听
			IM._onMsgReceiveListener = RL_YTX.onMsgReceiveListener(function(obj) {
					IM.EV_onMsgReceiveListener(obj);
			});
			// 注册客服消息监听
			/*  IM._onDeskMsgReceiveListener = RL_YTX.onMCMMsgReceiveListener(
			          function(obj) {
			              IM.EV_onMsgReceiveListener(obj);
			          });*/
			// 注册群组通知事件监听
			IM._noticeReceiveListener = RL_YTX.onNoticeReceiveListener(
				function(obj) {
					IM.EV_noticeReceiveListener(obj);
				});
			// 服务器连接状态变更时的监听
			IM._onConnectStateChangeLisenter = RL_YTX.onConnectStateChangeLisenter(function(obj) {
				// obj.code;//变更状态 1 断开连接 2 重练中 3 重练成功 4 被踢下线 5 断开连接，需重新登录
				// 断线需要人工重连
				if (1 == obj.code) {
					console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
				} else if (2 == obj.code) {
					IM.HTML_showAlert('alert-warning',
						'网络状况不佳，正在试图重连服务器', 10 * 60 * 1000);
					$("#pop_videoView").hide();
				} else if (3 == obj.code) {
					IM.HTML_showAlert('alert-success', '连接成功');
				} else if (4 == obj.code) {
					IM.DO_logout();
					alert(obj.msg);
				} else if (5 == obj.code) {
					IM.HTML_showAlert('alert-warning',
						'网络状况不佳，正在试图重连服务器');
					$("#pop_videoView").hide();
					IM._login(IM._user_account);
				} else {
					console.log('onConnectStateChangeLisenter obj.code:' + obj.msg);
				}
			});
			/*音视频呼叫监听
			 obj.callId;//唯一消息标识  必有
			 obj.caller; //主叫号码  必有
			 obj.called; //被叫无值  必有
			 obj.callType;//0 音频 1 视频 2落地电话
			 obj.state;//1 对方振铃 2 呼叫中 3 被叫接受 4 呼叫失败 5 结束通话 6 呼叫到达
			 obj.reason//拒绝或取消的原因
			 obj.code//当前浏览器是否支持音视频功能
			 */
			IM._onCallMsgListener = RL_YTX.onCallMsgListener(
				function(obj) {
					IM.EV_onCallMsgListener(obj);
				});

			IM._onMsgNotifyReceiveListener = RL_YTX.onMsgNotifyReceiveListener(function(obj) {
				if (obj.msgType == 21) { //阅后即焚：接收方已删除阅后即焚消息
					console.log("接收方已删除阅后即焚消息obj.msgId=" + obj.msgId);
					var id = obj.sender + "_" + obj.msgId;
					$(document.getElementById(id)).remove();
				}
			});

		}, function(obj) {
			alert("错误码： " + obj.code + "; 错误描述：" + obj.msg);
		});
	},
	/**
	 * 
	 */
	DO_inviteCall: function(callType, no) {
		//发起呼叫
		var receiver = no;

		if (IM._serverNo == receiver) {
			alert("系统消息禁止回复");
			return;
		};
		var view = document.getElementById("voiceCallAudio");
		RL_YTX.setCallView(view, null);

		var makeCallBuilder = new RL_YTX.MakeCallBuilder();
		makeCallBuilder.setCalled(receiver); //John的号码
		makeCallBuilder.setCallType(callType); //呼叫的类型 0 音频 1视频 2 落地电话
		makeCallBuilder.setNickName('65asdasd646d4');
		if (callType == 2) {
			makeCallBuilder.setTel("00000000"); //用户自定义号码和昵称
			makeCallBuilder.setNickName("7766664444");
		}
		console.log("called = " + receiver + "; " + "callType = " + callType);

		var callId = RL_YTX.makeCall(makeCallBuilder,
			function() {
				
			},
			function callback(obj) {
				alert("错误码：" + obj.code + "; 错误描述：" + obj.msg);
			});
	},
	EV_onCallMsgListener: function(obj) {
		console.log("-------obj.callId = " + obj.callId);
		console.log("-------obj.caller = " + obj.caller);
		console.log("-------obj.called = " + obj.called);
		console.log("-------obj.callType = " + obj.callType);
		console.log("-------obj.state = " + obj.state);
		console.log("-------obj.reason = " + obj.reason);
		console.log("-------obj.code = " + obj.code);
//		console.log("-------obj.router = " + obj.router);
		var noticeMsg = ''; //桌面提醒消息
		if (200 == obj.code) {
			console.log(obj);
			if (obj.state == 1) { //收到振铃消息
				//本地播放振铃
				document.getElementById("voipCallRing").play();
			} else if (obj.state == 2) { //呼叫中

			} else if (obj.state == 3) { //被叫接受
				document.getElementById("voipCallRing").pause();
				noticeMsg = "[接收语音通话]";
			} else if (obj.state == 4) { //呼叫失败 是对主叫设定：主动取消，对方拒绝或者忙
				document.getElementById("voipCallRing").pause();
				noticeMsg = "[语音通话结束]";
				//alert("对方正在通话中");
			} else if (obj.state == 5) { //结束通话  或者主叫取消（对被叫而言）
				document.getElementById("voipCallRing").pause();
				noticeMsg = "[语音通话结束]";
				$('#calling').hide();
			} else if (obj.state == 6) { //呼叫到达
				//本地播放振铃
				document.getElementById("voipCallRing").play();
				noticeMsg = "[语音呼叫]";
			};
		} else {
			var str = '<pre>请求语音通话，请使用其他终端处理</pre>';
			IM.HTML_pushCall_addHTML(obj.caller, obj.callId, str);
		}

		//桌面提醒通知
		if (!!noticeMsg) {
			//IM.DO_deskNotice(obj.caller, '', noticeMsg, '', false, true);
		}
	},
	/**
	 * 事件，登出
	 * 
	 * @constructor
	 */
	EV_logout: function() {
		console.log("EV_logout");
		IM.DO_logout();
		RL_YTX.logout(function() {
			console.log("EV_logout succ...");
		}, function(obj) {
			alert("错误码： " + obj.code + "; 错误描述：" + obj.msg);
		});
	},

	/**
	 * 登出
	 * 
	 * @constructor
	 */
	DO_logout: function() {
		// 销毁PUSH监听
		IM._onMsgReceiveListener = null;
		// 注册客服消息监听
		IM._onDeskMsgReceiveListener = null;
		// 销毁注册群组通知事件监听
		IM._noticeReceiveListener = null;
		// 服务器连接状态变更时的监听
		IM._onConnectStateChangeLisenter = null;
		//呼叫监听
		IM._onCallMsgListener = null;
		//阅后即焚监听
		IM._onMsgNotifyReceiveListener = null;
	},
	call: function(no){
		//暂时改为调用自己的硬件
		function makeCall(callAddress, no){
			var phoneNoElem = $('#map_resource div.BMap_bubble_content a.phone');
			phoneNoElem.text(no+'【正在拨号,请稍后...】');
			
			$.ajax({
				url		: callAddress + no,
				type	: 'GET',
				async	: true,
				success	: function(response) {
					phoneNoElem.text(no);
					Message.success('拨号成功，请摘机!');
				},
				error : function(jqXHR, textStatus, errorThrown) {
					phoneNoElem.text(no);
					Message.success('【请求电话服务失败!】!');
					switch(textStatus) {
					case null:
						// 这种情况还未遇到过
						errorThrown = (errorThrown == '') ? 'jQuery.ajax返回的错误状态值是null，我们也不知道发生了什么' : errorThrown;
						Message.show('出错啦:' + errorThrown,
								{cls : 'danger', closable: true});
						break;
					case "timeout":
						Message.show('啊哦，电话服务暂时无法接通，请查看网络状况或者电话服务是否正常', {cls : 'warning'});
						break;
					case "error":
						// 'Not Found'基本不会发生，除非请求地址写错了
						// 'Internal Server Error'基本不会发生，除非服务端Controller没catch Throwable
						if(errorThrown === 'Not Found' || errorThrown === 'Internal Server Error') {
							// NO-OP
						} else if(jqXHR.readyState === 0) {
							Message.show('拨打电话没有成功，请检查电话服务是否开启并畅通。',
									{cls : 'danger', closable: true});
						} else {
							errorThrown = (errorThrown == '') ? 'sorry, jQuery也没有给提示信息' : errorThrown;
							Message.show('出现了未知错误:' + errorThrown, {cls : 'danger', closable: true});
						}
						break;
					case "abort":
						// NO-OP
						// Message.show('客户端取消', {cls : 'danger'});
						break;
					case "parsererror":
						Message.show('啊哦，返回的数据解析不了啦，找程序员吧', {cls : 'danger'});
						break;
					}
				}
			});
			
		}
		
		if(!IM.callAddress){
			var param = {}
			var phoneUrl = ModuleConfigHelper.getConfigByModuleName('ns.map.newsphere').phoneUrl;
			$.ajax({
//				url		: '/central/api/data/route?url=http://cjy.hbtv.com.cn/web/api/screenconfig/getValue',
				url		: phoneUrl,
				type	: 'POST',
				data	: JSON.stringify(param),
				contentType : 'application/json; charset=UTF-8',
				async	: true,
				success	: function(response) {
					if(response.code != 0){
						Message.warn('未成功获取电话接口配置!');
						return;
					}
					$(response.result).each(function(index, config){
						if(config.key == 'im.call.address'){
							IM.callAddress = config.value;
							if(!IM.callAddress){
								Message.warn('请配置地图中电话服务接口网址!');
								return;
							}
							makeCall(IM.callAddress, no);
							return;
						}
					});
				}
			});
		}else{
			makeCall(IM.callAddress, no);
		}
		
//		IM.init();
//		IM.Do_login();
//		$('#calling').html("正在呼叫...").show();
//		IM.DO_inviteCall(2, no + '');
	}
};