var List = {
	title: '串联单',
	confs: ModuleConfigHelper.getConfigByModuleName('ns.daily.list'),
	pageSize: 8,
	titlePageSize : 10,
	data: {
		rundowns: [],
		titles: []
	},
	options: {
		pages: [],
		page: 0,
		rundownActive: 0,
		titleActive: 0
	},
	createNew: function(opts) {
		$('.return').click(function(){
//			List.notFirstFlag = false;
			$('.loading').hide();
			List.loadRundows();
		});
		
		var now = new Date();
		
		$("#dateSelector").html(now.format('yyyy年MM月dd日'))
		
		this.loadRundows();
		
		this._playRundownActive();
		
		this._playTitleActive();
		
		//TODO 自动获取
		this.options.intervalQuery = setInterval(function() {
			List.loadRundows();
		}, List.confs.loadInterval * 1000);
	},

	loadRundows: function() {
		console.log('获取串联单状态....');
		$('#title').text(List.title);
		$('#carousel>.carousel-indicators').empty();
		$('#carousel>.carousel-inner').empty();
		
		$('.return').hide();
		$('#carousel').show();
		$('.list-pane').hide();
		List.data.titles = [];
		List.options = {
			pages: [],
			page: 0,
			rundownActive: 0,
			titleActive: 0
		};
		var params = {
			  "columnName":"",
			  "beginDate":"",
			  "endDate":"",
			  "start":0,
			  "limit":20
		}
		var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
		params.beginDate = startTime;
		params.endDate = endTime;
		//TODO 实时数据
//		CentralProxy.getRundowns(params,function(response){
		$.getJSON('./js/rundown.json', function(response){
			List.data.rundowns = response.data;
			
			var total = List.data.rundowns.length;
			var temp = [], p = 0;
			$('#columnSelector').empty();
			for(var i=0; i<total; i++){
				var rundown = List.data.rundowns[i];
//				switch(rundown.columnname){
//					case "新闻联播":
//						rundown.imgId = "dailyNews";
//						break;
//					case "新闻延长线":
//						rundown.imgId = "longNews";
//						break;
//					default:
//						rundown.imgId = "default";
//						break;
//				}
					
				if(List.confs.filters){
					try{
						var title = rundown.title;
						title = title.split(" ")[3].split(']')[0];
						if(List.confs.filters.indexOf(title)>=0){
							continue;
						}
					} catch (e){
						console.log(e);
					}
				} 
				temp.push(rundown);
				if(temp.length == List.pageSize || i == total-1){
					List.options.pages[p] = temp;
					p++;
					temp = [];
				}
				
				try{
					var title = rundown.title;
					title = title.split(" ")[3].split(']')[0];
				
					$('<option>').html(title).attr('data-code', rundown.columnCode).data('rundown', rundown).appendTo('#columnSelector');
				} catch (e){
					console.log(e);
				}
			}
			$(List.options.pages).each(function(index, item){
				var li = $('<li data-target="#carousel" data-slide-to="'+ index + '"></li>').appendTo('.carousel-indicators');
				var div = $('<div class="item tiles-pane"></div>').appendTo('.carousel-inner');
				if(index == 0){
					li.addClass('active');
					div.addClass('active');
				}
				List.appendTile(item, div);
			});
		});
		
		$('#carousel').on('slide.bs.carousel', function () {
			List.options.rundownActive = 0;
		});
	},
	loadTitles: function(rundown) {
		console.log('获取条目状态....');
		$(".loading").show();
		$('#title').text("串联单");
		$('.list-body').empty();
		$('.list-pane').show();
		$('#carousel').hide();
		$('.return').show();
		
		$('#columnSelector>option[data-code="' + rundown.columnCode + '"]').prop('selected', true);
		
		List.options = {
			pages: [],
			page: 0,
			rundownActive: 0,
			titleActive: 0
		};
		var param = {
			"billguid":""
		}
		param.billguid = rundown.billguid;		
//		CentralProxy.getRundownAssets(param,function(response){
		$.getJSON('./js/title.json', function(response){
			$('.loading').hide();
			List.data.titles = response.list.docListData;
			var total = List.data.titles.length;
			var temp = [], p = 0;
			for(var i=0; i<total; i++){
				temp.push(List.data.titles[i]);
				if((i+1) % List.titlePageSize==0 || i == total-1){
					List.options.pages[p] = temp;
					p++;
					temp = [];
				}
			}
			
			function play(){
				var total = List.data.titles.length;
				if(total == 0){
					console.log('没有条目数据了，返回。');
					return;
				}
				var index = List.options.page;
				var totalPage = Math.ceil(total / List.titlePageSize);
				if(index >= totalPage){
					index = List.options.page = 0;
				}
				List.appendItems(List.options.pages[index]);
				List.options.page++;
				setTimeout(function(){
					List.options.playIndex = 0;
					play();
				}, List.confs.pageInterval * 1000 + 500);
			}
			play();
		});
		
	},
	
	appendTile: function(data, pane) {
		//var pane = $('.tiles-pane').empty;
		$(data).each(function(index, item){
			var html = '<div class="col-xs-6 tile"><div class="tile-c">' + 
				'<div class="date"></div>' + 
				'<div class="name"></div>' + 
				'<div class="logo"><img class="logoImg" src=""/></div></div></div>';
			var row = $(html);
			var title = item.title;
			title = title.split(" ")[3].split(']')[0];
			row.find('.name').text(title);
			row.find('.date').text(item.showdate.substring(10,19));
			row.click(function(e){
				List.loadTitles(item);
			});
//			row.find('.logo').css('background', 'url(/central/images/default.png)  0% 0% / 100% 100% no-repeat rgba(0,0,0,0)');
			row.find('.logoImg').attr("src","/central/images/columns/" + item.imgId + ".jpg")	
			row.appendTo(pane);
			if(index == 0){
				row.addClass('active');
			}
		});
	},
	
    appendItems: function (data) {
    	var pane = $('.list-pane');
		pane.find('.list-body').remove();
		var body = $('<div class="list-body pt-page-flipInRight">').appendTo(pane);
    	var list = $('<div class="item topic-pane">').appendTo(body);
		
		$(data).each(function(index, item){
			appendTitleRow(index, item);
		});
		
		function appendTitleRow(index, row){
			var html = '<div class="col-md-12 tile">'+
				'<div class="tile-c">'+
						'<div class="no"></div>'+
						'<div class="name"></div>'+
						'<div class="length"></div>'+
						'<div class="author"></div>'+
						'<div class="stage"></div>'+
					'</div>'+
				'</div>';
			var $html = $(html);
			$html.find('.no').text(row.serialno);
			$html.find('.name').text(row.title);
			$html.find('.author').text(row.author);
			$html.find('.length').text(row.docTime);
			var state = '无';
			/*0 编辑,-1 无,2 处编完成,3 精编完成,4 提交合成,5 合成失败,6 合成完毕,7 审片退回,8 审片通过,9 演播退回*/
			switch(row.programedit) {
				case 0:
					state = '编辑'; break;
				case 2:
					state = '初编完成'; break;
				case 3:
					state = '提交合成'; break;
				case 4:
					state = '精编完成'; break;
				case 5:
					state = '合成失败'; break;
				case 6:
					state = '合成完毕'; break;
				case 7:
					state = '审片退回'; break;
				case 8:
					state = '审片通过'; break;
				case 9:
					state = '演播退回'; break;
				default:
					break;
			}
			$html.find('.stage').text(state);
			
			$html.appendTo(list);
		}
    },
    
    _playTitleActive: function() {
		function playRow(){
			var index = List.options.titleActive;
			var list = $('.list-body');
			var items = list.find('.tile');
			if(index >= items.length) {
				index = List.options.titleActive = 0;
			}
			list.find('.tile.active').removeClass('active', 100);
			$(items[index]).addClass('active');
			List.options.titleActive++;
			setTimeout(function() {
				playRow();
			}, 3000);
		};
		playRow();
	},
	
	_playRundownActive: function(){
		function playRundownActive(){
			var index = List.options.rundownActive;
			var items = $('.carousel-inner>.active>.tile');
			if(index >= items.length) {
				index = List.options.rundownActive = 0;
			}
			items.removeClass('active', 100);
			$(items[index]).addClass('active');
			List.options.rundownActive++;
			setTimeout(function(){
				playRundownActive();
			}, 3000);
		}
		playRundownActive();
	}
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);

	List.createNew();
});
