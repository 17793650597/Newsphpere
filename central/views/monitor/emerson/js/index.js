var Cloud = {
	createNew: function(opts) {
		var opts_default = {
			containerAir1: $(".left-pane"),
			containerAir2: $(".right-pane"),
			interval: 600000
		};
		var cloud = {};
		cloud.options = $.extend(true, opts_default, opts);
		Cloud.loadData(cloud, Cloud.loadDataCallBack);
		cloud.intervalQuery = setInterval(function() {
			Cloud.loadData(cloud, Cloud.loadDataCallBack);
		}, 180000);
	},
	loadData: function(cloud, callback){
		// var param = [{
		// 		name:"a",
		// 		oid:"1.3.6.1.2.1.1.5.0"
		// },{
		// 		name:"b",
		// 		oid:".1.3.6.1.2.1.2.1.0"			
		// }];
		// CentralProxy.getSnmp(param, function(resp) {
		// 	console.log(resp);
		// 	if(callback && typeof callback == 'function') {
		// 		callback(resp, cloud);
		// 	}
		// });
		//假数据
		cloud.param = [
		{
			name:'air1-hardware1',
			oid:'1.3.6.1.4.1.318.1.1.1.3.1.1',
		},{
			name:'air1-hardware2',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.1',
		},{
			name:'air1-hardware3',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.3',
		},{
			name:'air1-hardware4',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.1',
		},{
			name:'air1-hardware5',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.11',
		},{
			name:'air1-hardware6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.1',
		},{
			name:'air1-warntotal',
			oid:'.1.3.6.1.4.1.318.1.1.1.6.2.3',
		},{
			name:'air1-warn1',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.4',
		},{
			name:'air1-warn2',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.5',
		},{
			name:'air1-warn3',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.6',
		},{
			name:'air1-warn4',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.7',
		},{
			name:'air1-warn5',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.8',
		},{
			name:'air1-warn6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.9',
		},{
			name:'air1-warn7',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.3',
		},{
			name:'air1-warn8',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.5.3',
		},{
			name:'air1-warn9',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.7.3',
		},{
			name:'air1-warn10',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.8.3',
		}];
		var resp = [
		{
			name:'air1-hardware1',
			oid:'1.3.6.1.4.1.318.1.1.1.3.1.1',
			returnMessage:'true'
		},{
			name:'air1-hardware2',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.1',
			returnMessage:'true'
		},{
			name:'air1-hardware3',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.3',
			returnMessage:'true'
		},{
			name:'air1-hardware4',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.1',
			returnMessage:'true'
		},{
			name:'air1-hardware5',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.11',
			returnMessage:'true'
		},{
			name:'air1-hardware6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.1',
			returnMessage:'true'
		},{
			name:'air1-warntotal',
			oid:'.1.3.6.1.4.1.318.1.1.1.6.2.3',
			returnMessage:'true'
		},{
			name:'air1-warn1',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.4',
			returnMessage:'true'
		},{
			name:'air1-warn2',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.5',
			returnMessage:'true'
		},{
			name:'air1-warn3',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.6',
			returnMessage:'true'
		},{
			name:'air1-warn4',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.7',
			returnMessage:'true'
		},{
			name:'air1-warn5',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.8',
			returnMessage:'true'
		},{
			name:'air1-warn6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.9',
			returnMessage:'true'
		},{
			name:'air1-warn7',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.3',
			returnMessage:'false'
		},{
			name:'air1-warn8',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.5.3',
			returnMessage:'true'
		},{
			name:'air1-warn9',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.7.3',
			returnMessage:'true'
		},{
			name:'air1-warn10',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.8.3',
			returnMessage:'true'
		}];
		if(callback && typeof callback == 'function') {
			callback(resp, cloud);
		}
	},
	loadDataCallBack: function(data, cloud){
		cloud.air1Data = data;
		cloud.air2Data = data;
		Cloud.processData(cloud);
	},
	processData: function(cloud){
		var air1Data = cloud.air1Data;
		var air1Param = cloud.param;
		for(var i in air1Data){
			var j = ["0", "1", "2"];
			var msg = j[Math.floor(Math.random()*3)];
			air1Data[i].returnMessage = msg;
		}
		cloud.displayData = [];
		for(var i = 0; i < air1Data.length; i++){
			for(var j = 0; j < air1Param.length; j++){
				if(air1Data[i].oid == air1Param[j].oid){
					air1Data[i].className = air1Param[j].name;
					//TODO根据状态显示颜色
					if(air1Data[i].returnMessage == "0"){
						air1Data[i].color = "green";
					}else if(air1Data[i].returnMessage == "1"){
						air1Data[i].color = "yellow";
					}else if(air1Data[i].returnMessage == "2"){
						air1Data[i].color = "red";
					}else{
						
					}
				}
			}
			//暂时Air1 Air2数据相同
			cloud.displayAir1Data = air1Data;
			cloud.displayAir2Data = air1Data;
		}
		console.log(air1Data);
		Cloud.displayDatas(cloud);
	},
	displayDatas: function(cloud){
		var air1CloudOperate = cloud.options.containerAir1.find('.operate-state'),
			air1CloudHardware = cloud.options.containerAir1.find('.hardware-state'),
			air1CloudWarn = cloud.options.containerAir1.find('.warn-state');
		for(var i = 0; i < cloud.displayAir1Data.length; i++){
			$('.left-pane .' + cloud.displayAir1Data[i].className).find('i').addClass(cloud.displayAir1Data[i].color);
		
			$('.left-pane .' + cloud.displayAir1Data[i].name).css({
				"border-color": cloud.displayAir1Data[i].color,
			})
			$('.left-pane .downdown-content .' + cloud.displayAir1Data[i].name).find(".b").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".c").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".d").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".text").css({
				"color": cloud.displayAir1Data[i].color,
			}).parent().parent().find(".y").css({
				"background-color": cloud.displayAir1Data[i].color,
			})
		
//			$('.left-pane .topright-content .' + cloud.displayAir1Data[i].name).css({
//				"color": cloud.displayAir1Data[i].color,
//			})
			$('.left-pane .' + cloud.displayAir1Data[i].name).parent().find(".warn-bar1").css({
				"background-color": cloud.displayAir1Data[i].color,
			})
		}
		for(var i = 0; i < cloud.displayAir2Data.length; i++){
			$('.right-pane .' + cloud.displayAir2Data[i].className).find('i').addClass(cloud.displayAir2Data[i].color);
			
			$('.right-pane .' + cloud.displayAir1Data[i].name).css({
				"border-color": cloud.displayAir1Data[i].color,
			})
			$('.right-pane .downdown-content .' + cloud.displayAir1Data[i].name).find(".b").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".c").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".d").css({
				"border-color": cloud.displayAir1Data[i].color,
			}).find(".text").css({
				"color": cloud.displayAir1Data[i].color,
			}).parent().parent().find(".y").css({
				"background-color": cloud.displayAir1Data[i].color,
			})

			$('.right-pane .' + cloud.displayAir1Data[i].name).parent().find(".warn-bar1").css({
				"background-color": cloud.displayAir1Data[i].color,
			})
		}
		//温度湿度假数据
		var tmp = Math.floor(Math.random()*50);
		var hum = Math.floor(Math.random()*50);
		$('#air1 #tem-text').text(tmp + '℃');
		$('#air1 #hum-text').text(hum + '%');
		var tmpHeight = (tmp + 10) + '%';
		var humHeight = (hum + 10) + '%';
		$('#air1 .temperature-reality').css("height",tmpHeight);
		$('#air1 #tem-text').css("height", (tmp + 18) + '%');
		$('#air1 .humidity-reality').css("height",humHeight);
		$('#air1 #hum-text').css("height",(hum + 18) + '%');
		
		$('#air2 #tem-text').text(tmp + '℃');
		$('#air2 #hum-text').text(hum + '%');
		$('#air2 .temperature-reality').css("height",tmpHeight);
		$('#air2 #tem-text').css("height",(tmp + 18) + '%');
		$('#air2 .humidity-reality').css("height",humHeight);
		$('#air2 #hum-text').css("height",(hum + 18) + '%');
		Cloud.appendItems(cloud);
	},
	appendItems: function(cloud){
//		air1CloudBattery.empty();
//		var html = '<div class="voltage">\
//						<span class="width-modify">输入电压状态:</span>\
//						<span class="air1-Va">A相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="air1-Vb">B相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="air1-Vc">C相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//					</div>\
//					<div class="current">\
//						<span class="width-modify">输入电流状态:</span>\
//						<span class="air1-Aa">A相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="air1-Ab">B相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="air1-Ac">C相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//					</div>';
//		var $html = $(html);
//		$html.find('.air1-Va i').addClass("red");
//		air1CloudBattery.append($html);
	}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Cloud.createNew({
		interval: 600000
	});
});