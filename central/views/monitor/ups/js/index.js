var Cloud = {
	createNew: function(opts) {
		var opts_default = {
			containerUps1: $(".left-pane"),
			containerUps2: $(".right-pane"),
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
//		 var param = [{
//		 		name:"a",
//		 		oid:"1.3.6.1.2.1.1.5.0"
//		 },{
//		 		name:"b",
//		 		oid:".1.3.6.1.2.1.2.1.0"			
//		 }];
//		 var ip = "10.7.6.8";
//		 CentralProxy.getSnmp(ip, param, function(resp) {
//		 	console.log(resp);
//		 	if(callback && typeof callback == 'function') {
//		 		callback(resp, cloud);
//		 	}
//		 });
		//假数据
		cloud.param = [
		{
			name:'ups1-Va',
			oid:'1.3.6.1.4.1.318.1.1.1.3.1.1',
		},{
			name:'ups1-Vb',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.1',
		},{
			name:'ups1-Vc',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.3',
		},{
			name:'ups1-Aa',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.1',
		},{
			name:'ups1-Ab',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.11',
		},{
			name:'ups1-Ac',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.1',
		},{
			name:'ups1-worka',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.1',
		},{
			name:'ups1-workb',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.2',
		},{
			name:'ups1-workc',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.3',
		},{
			name:'ups1-warntotal',
			oid:'.1.3.6.1.4.1.318.1.1.1.6.2.3',
		},{
			name:'ups1-warn1',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.4',
		},{
			name:'ups1-warn2',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.5',
		},{
			name:'ups1-warn3',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.6',
		},{
			name:'ups1-warn4',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.7',
		},{
			name:'ups1-warn5',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.8',
		},{
			name:'ups1-warn6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.9',
		},{
			name:'ups1-warn7',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.3',
		},{
			name:'ups1-warn8',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.5.3',
		},{
			name:'ups1-warn9',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.7.3',
		},{
			name:'ups1-warn10',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.8.3',
		}];
		var resp = [
		{
			name:'ups1-Va',
			oid:'1.3.6.1.4.1.318.1.1.1.3.1.1',
			returnMessage:'true'
		},{
			name:'ups1-Vb',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.1',
			returnMessage:'true'
		},{
			name:'ups1-Vc',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.1.3',
			returnMessage:'true'
		},{
			name:'ups1-Aa',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.1',
			returnMessage:'true'
		},{
			name:'ups1-Ab',
			oid:'.1.3.6.1.4.1.318.1.1.1.2.3.11',
			returnMessage:'true'
		},{
			name:'ups1-Ac',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.1',
			returnMessage:'true'
		},{
			name:'ups1-worka',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.1',
			returnMessage:'true'
		},{
			name:'ups1-workb',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.2',
			returnMessage:'true'
		},{
			name:'ups1-workc',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.3',
			returnMessage:'true'
		},{
			name:'ups1-warntotal',
			oid:'.1.3.6.1.4.1.318.1.1.1.6.2.3',
			returnMessage:'true'
		},{
			name:'ups1-warn1',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.4',
			returnMessage:'true'
		},{
			name:'ups1-warn2',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.5',
			returnMessage:'true'
		},{
			name:'ups1-warn3',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.6',
			returnMessage:'true'
		},{
			name:'ups1-warn4',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.7',
			returnMessage:'true'
		},{
			name:'ups1-warn5',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.8',
			returnMessage:'true'
		},{
			name:'ups1-warn6',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.2.9',
			returnMessage:'true'
		},{
			name:'ups1-warn7',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.1.3',
			returnMessage:'false'
		},{
			name:'ups1-warn8',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.5.3',
			returnMessage:'true'
		},{
			name:'ups1-warn9',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.7.3',
			returnMessage:'true'
		},{
			name:'ups1-warn10',
			oid:'.1.3.6.1.4.1.318.1.1.1.9.8.3',
			returnMessage:'true'
		}];
		if(callback && typeof callback == 'function') {
			callback(resp, cloud);
		}
	},
	loadDataCallBack: function(data, cloud){
		cloud.ups1Data = data;
		cloud.ups2Data = data;
		Cloud.processData(cloud);
	},
	processData: function(cloud){
		var usp1Data = cloud.ups1Data;
		var usp1Param = cloud.param;
		for(var i in usp1Data){
			//状态判断
			var j = ["0", "1", "2"];
			var msg = j[Math.floor(Math.random()*3)];
			usp1Data[i].returnMessage = msg;
		}
		cloud.displayData = [];
		for(var i = 0; i < usp1Data.length; i++){
			for(var j = 0; j < usp1Param.length; j++){
				if(usp1Data[i].oid == usp1Param[j].oid){
					usp1Data[i].className = usp1Param[j].name;
					//TODO根据状态显示颜色
					if(usp1Data[i].returnMessage == "0"){
						usp1Data[i].color = "green";
					}else if(usp1Data[i].returnMessage == "1"){
						usp1Data[i].color = "yellow";
					}else if(usp1Data[i].returnMessage == "2"){
						usp1Data[i].color = "red";
					}else{
						
					}
				}
			}
			//暂时UPS1 UPS2数据相同
			cloud.displayUps1Data = usp1Data;
			cloud.displayUps2Data = usp1Data;
		}
		console.log(usp1Data);
		Cloud.displayDatas(cloud);
	},
	displayDatas: function(cloud){
		var ups1CloudBattery = cloud.options.containerUps1.find('.battery-state'),
			ups1CloudWork = cloud.options.containerUps1.find('.work-state'),
			ups1CloudWarn = cloud.options.containerUps1.find('.warn-state');
		for(var i = 0; i < cloud.displayUps1Data.length; i++){
			$('.left-pane .' + cloud.displayUps1Data[i].className).find('i').removeClass('yellow red green').addClass(cloud.displayUps1Data[i].color);
			$('.left-pane .' + cloud.displayUps1Data[i].name).css({
				"border-color": cloud.displayUps1Data[i].color,
			})
			
			$('.left-pane .downdown-content .' + cloud.displayUps1Data[i].name).find(".b").css({
				"border-color": cloud.displayUps1Data[i].color,
			}).find(".c").css({
				"border-color": cloud.displayUps1Data[i].color,
			}).find(".d").css({
				"border-color": cloud.displayUps1Data[i].color,
			}).find(".text").css({
				"color": cloud.displayUps1Data[i].color,
			}).parent().parent().find(".y").css({
				"background-color": cloud.displayUps1Data[i].color,
			})
			
			$('.left-pane .topright-content .' + cloud.displayUps1Data[i].name).css({
				"color": cloud.displayUps1Data[i].color,
			})
			$('.left-pane .' + cloud.displayUps1Data[i].name).parent().find(".warn-bar1").css({
				"background-color": cloud.displayUps1Data[i].color,
			})
		}
		for(var i = 0; i < cloud.displayUps2Data.length; i++){
			$('.right-pane .' + cloud.displayUps2Data[i].className).find('i').removeClass('yellow red green').addClass(cloud.displayUps2Data[i].color);
			$('.right-pane .' + cloud.displayUps2Data[i].name).css({
				"border-color": cloud.displayUps2Data[i].color,
			})
			$('.right-pane .downdown-content .' + cloud.displayUps2Data[i].name).find(".b").css({
				"border-color": cloud.displayUps2Data[i].color,
			}).find(".c").css({
				"border-color": cloud.displayUps2Data[i].color,
			}).find(".d").css({
				"border-color": cloud.displayUps2Data[i].color,
			}).find(".text").css({
				"color": cloud.displayUps2Data[i].color,
			}).parent().parent().find(".y").css({
				"background-color": cloud.displayUps2Data[i].color,
			})
			
			$('.right-pane .topright-content .' + cloud.displayUps2Data[i].name).css({
				"color": cloud.displayUps1Data[i].color,
			})
			$('.right-pane .' + cloud.displayUps2Data[i].name).parent().find(".warn-bar1").css({
				"background-color": cloud.displayUps2Data[i].color,
			})
		}
		//2电池随机假数据
		var bt1 = Math.floor(Math.random()*100);
		var bt2 = Math.floor(Math.random()*100);
		$('#ups1 .battery-num').text(bt1);
		$('#ups2 .battery-num').text(bt2);
		var bt1Width = bt1 + '%';
		var bt2Width = bt2 + '%';
		$('#ups1 .battery-inner').css("width",bt1Width);
		$('#ups2 .battery-inner').css("width",bt2Width);
		Cloud.appendItems(cloud);
	},
	appendItems: function(cloud){
//		ups1CloudBattery.empty();
//		var html = '<div class="voltage">\
//						<span class="width-modify">输入电压状态:</span>\
//						<span class="ups1-Va">A相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="ups1-Vb">B相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="ups1-Vc">C相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//					</div>\
//					<div class="current">\
//						<span class="width-modify">输入电流状态:</span>\
//						<span class="ups1-Aa">A相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="ups1-Ab">B相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//						<span class="ups1-Ac">C相<i class="fa fa-circle margin-modify" aria-hidden="true"></i></span>\
//					</div>';
//		var $html = $(html);
//		$html.find('.ups1-Va i').addClass("red");
//		ups1CloudBattery.append($html);
	}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Cloud.createNew({
		interval: 600000
	});
});