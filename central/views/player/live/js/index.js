/**
 * 生成视频播放器，参照HTML模板：
 * <div class="player-pane player-container">
		<div class="video-container">
		    <div class="player" id="player">
		    </div>
		    <div class="player-cover">
		    	<span></span>
	            <span></span>
	            <span></span>
	            <span></span>
	            <span></span>
	            <span></span>
	            <span></span>
		    </div>
		    <div class="player-shadow">
		    	<table>
		    		<tr><td class="name">江苏卫视高清</td>
		    		<td class="btns"><a class="btn btn-link vod">点播</a>
		    			<a class="btn btn-danger">直播LIVE</a>
		    	</td></tr>
		    	</table>
		    </div>
		</div>
		<div class="video-list">
			<button class="btns btn-left"><i class="glyphicon glyphicon-chevron-left"></i></button>
				<div class="slider-outside">
					<div class="slider">
					</div>
				</div>
			<button class="btns btn-right"><i class="glyphicon glyphicon-chevron-right"></i></button>
		</div>
	</div>
 */
var ScreenVideo = {
	createNew: function(opts){
		var opts_default = {
				playerPane : $('.player-pane'),
				playerElment : "player",
		};
		var screenVideo = {};
		screenVideo.options = $.extend(true, opts_default, opts);
		//播放器相关变量
		screenVideo.videoConfig={
		    	elid:screenVideo.options.playerElment,
		    	autostart:true,
		        //url:'http://live2016hls-yf.jstv.com/live/JSWSGQ/online.m3u8',
		    	url: 'http://hls-xietong.litchicloud.jstv.com/live/jstv/online.m3u8',
		    	controlbardisplay: 'disable',
		        skin:"vodTransparent"
		        	};
		screenVideo.videoPlayer = null,
		screenVideo.videoPlayMode = 'live';
		//云视接口参数
//		screenVideo.vodQueryParam = {
//				source:'',
//				startPage:0,
//				pageSize:60,
//				searchTime:'',
//				product:'CDV_SCREEN'
//		};
		//网台接口参数
		screenVideo.vodQueryParam = {
				pageindex: 1,
				pagesize: 20
		};		
		
		function loadVodSource() {
			screenVideo.videoPlayMode = 'vod';
			screenVideo.options.playerPane.find('.player-cover').hide();
			screenVideo.vodQueryParam.startPage = 0;
			var videoList = screenVideo.options.playerPane.find('.video-list .slider');
			videoList.empty().removeClass('live');
			$.post("http://api.lizhiyunh5.jstv.com/VideoList/ShenPian",screenVideo.vodQueryParam,function(resp){
				//网络台数据处理
				$(resp.Data).each(function(index, video) {				
					var timeMs = video.VideoDuration*1000;
					var durationObj = new Date(timeMs);
					var duration = durationObj.getMinutes() + '′' + durationObj.getSeconds() + '″';
					var title = video.Title;
					var html = '<div class="item">\
									<a href="#">\
										<img src="'+video.ThumbUrl+'">\
										<span class="video-title" title = "'+title+'">'+video.Title+'</span>\
										<span class="duration">'+duration+'</span>\
									</a>\
								</div>';
					var item = $(html).appendTo(videoList).data('video', video);
					item.find('a').click(function(){
						$(this).parent().siblings().removeClass('active');
						$(this).parent().addClass('active');
						var v = $(this).parent().data('video');
						initVideoPlayer(v.VideoUrl, title);
						screenVideo.options.playerPane.find('.player-shadow .name').html(title).attr('title',title);
					});
				});
				videoSlider();
				$(videoList).find('.item:first>a:first').click();
				//云视接口地址：http://zyjs.cdvcloud.com/api/getCollectionVideo/
//				$(resp.data).each(function(index, video) {
					//云视数据处理
//					if(index > 4){
//						return;
//					}
//					if(video.video.duration == 0){
//						return;
//					}
//					var durationObj = new Date(video.video.duration);
//					var duration = durationObj.getMinutes() + '′' + durationObj.getSeconds() + '″';
//					var title = video.channelName+'-'+video.columnName+'-'+video.title;
//					var html = '<div class="item">\
//									<a href="#">\
//										<img src="'+video.thumb.thumbUrl+'">\
//										<span class="video-title" title = "'+title+'">'+video.title+'</span>\
//										<span class="duration">'+duration+'</span>\
//									</a>\
//								</div>';
//					var item = $(html).appendTo(videoList).data('video', video);
//					item.find('a').click(function(){
//						$(this).parent().siblings().removeClass('active');
//						$(this).parent().addClass('active');
//						var v = $(this).parent().data('video');
//						initVideoPlayer(v.video.videoUrl, title);
//						screenVideo.options.playerPane.find('.player-shadow .name').html(title).attr('title',title);
//					});
//				});
//				videoSlider();
//				$(videoList).find('.item:first>a:first').click();

			 });
		};

		function appendVodSource(callback) {
			screenVideo.vodQueryParam.startPage++;
			$.post("http://zyjs.cdvcloud.com/api/getCollectionVideo/",screenVideo.vodQueryParam,function(resp){
				var videoList = screenVideo.options.playerPane.find('.video-list .slider');
				var item = videoList.find('.item');
				$(resp.data).each(function(index, video) {
					var durationObj = new Date(video.video.duration);
					var duration = durationObj.getMinutes() + '′' + durationObj.getSeconds() + '″';
					var title = video.channelName+'-'+video.columnName+'-'+video.title;
					var html = '<div class="item">\
									<a href="#">\
										<img src="'+video.thumb.thumbUrl+'">\
										<span class="title" title = "'+title+'">'+video.title+'</span>\
										<span class="duration">'+duration+'</span>\
									</a>\
								</div>';
					var item = $(html).appendTo(videoList).data('video', video);
					item.find('a').click(function(){
						$(this).parent().siblings().removeClass('active');
						$(this).parent().addClass('active');
						var v = $(this).parent().data('video');
						initVideoPlayer(v.video.videoUrl, title);
						screenVideo.options.playerPane.find('.player-shadow .name').html(title).attr('title',title);
					});
				});
				if(callback && typeof callback == 'function'){
					callback();
				}
			 });
		};

		/**
		 * 控制视频导航栏滑动
		 */
		var videoSlider = function(){
			var videoList = screenVideo.options.playerPane.find('.video-list .slider');
			var count = 6;
			var l = videoList.find('.item').length;
			var viewItemIndex = l<count?l:count;//目前滑动窗口中可见的最后一个item的编号
			var sliderOutside = screenVideo.options.playerPane.find('.video-list>.slider-outside');
			videoList.width(sliderOutside.width());
			var width = videoList.width()/count;
			width = Number(width).toFixed(0);
			videoList.find('.item').width(Number(width) - 2);
			videoList.width(width*l);
			videoList.css('left','0px').attr('data-left',0);
			screenVideo.options.playerPane.find('.btn-slide.btn-left').prop('disabled',true);
			screenVideo.options.playerPane.find('.btn-slide.btn-right').prop('disabled',false);
			if(l<=count){
				screenVideo.options.playerPane.find('button.btn-slide').prop('disabled',true);
			}else{
				screenVideo.options.playerPane.find('button.btn-slide').unbind("click").click(function(){
					var that = this;
					function updateSetting(){
						l = videoList.find('.item').length;
						videoList.width(width*l);
						videoList.find('.item').width(Number(width) - 2);
						var max = width*(l-count);
						var temp = videoList.attr('data-left');
						if($(that).hasClass('btn-left')){
							temp = Number(temp) + Number(width);
							viewItemIndex--;
						}else{
							temp = Number(temp) - Number(width);
							viewItemIndex++;
						}
						videoList.css('left',temp+'px').attr('data-left',temp);
						if(temp==0){
							screenVideo.options.playerPane.find('.btn-slide.btn-left').prop('disabled',true);
							screenVideo.options.playerPane.find('.btn-slide.btn-right').prop('disabled',false);
						}else if(temp<=-max){
							screenVideo.options.playerPane.find('.btn-slide.btn-left').prop('disabled',false);
							screenVideo.options.playerPane.find('.btn-slide.btn-right').prop('disabled',true);
						}else{
							screenVideo.options.playerPane.find('.btn-slide.btn-left').prop('disabled',false);
							screenVideo.options.playerPane.find('.btn-slide.btn-right').prop('disabled',false);
						}
					}
					if(screenVideo.videoPlayMode == 'vod' && (l-viewItemIndex == 5)){
//						appendVodSource(updateSetting);
						updateSetting();
					}else{
						updateSetting();
					}
				});
			}
		}

		var loadLiveSource = function() {
			screenVideo.videoPlayMode = 'live';
			var videoList = screenVideo.options.playerPane.find('.video-list .slider');
			videoList.empty().addClass('live');
			var url1 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url1 || '';
			var url2 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url2 || '';
			var url3 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url3 || '';
			var url4 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url4 || '';
			var url5 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url5 || '';
			var url6 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url6 || '';
			var url7 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url7 || '';
			var url8 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url8 || '';
			var url9 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url9 || '';
			var url10 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url10 || '';
			var url11 = ModuleConfigHelper.getConfigByModuleName('ns.player.live').url11 || '';
			var address = [{thumb: '../../../images/stations/jsws.png', name:'山西卫视', url:'http://124.165.218.198:8280/sxws/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jsgg.png', name:'山西公共', url:'http://124.165.218.198:8280/sxgg/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'黄河', url:'http://124.165.218.198:8280/sxhh/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'山西经济资讯', url:'http://124.165.218.198:8280/sxjj/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'山西科教', url:'http://124.165.218.198:8280/sxkj/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'山西少儿', url:'http://124.165.218.198:8280/sxsr/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'山西影视', url:'http://124.165.218.198:8280/sxys/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'中国黄河', url:'http://124.165.218.198:8280/sxzghh/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'CCTV1', url:'http://124.165.218.198:8280/cctv1/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'CCTV4', url:'http://124.165.218.198:8280/cctv4/playlist.m3u8', isAudio:false},
                           {thumb: '../../../images/stations/jscs.png', name:'CCTV13', url:'http://124.165.218.198:8280/cctv13/playlist.m3u8', isAudio:false}
                           ];
			for(var i = 0; i < address.length; i++){
				address[i].url = eval("url" + (i + 1));
			}
			//ＦＭ９３.７
			$(address).each(function(index, item){
				var div = $('<div class="item">\
					<a href="#">\
					<img src="'+item.thumb+'">\
					<span class="source-name">'+item.name+'</span>\
					</a>\
				</div>').appendTo(videoList);
				div.find('a').click(function(){
					initVideoPlayer(item.url, item.name);
//					screenVideo.options.playerPane.find('.player-shadow .name').html(item.name);
					if(item.isAudio){
						screenVideo.options.playerPane.find('.player-cover').show();
					} else {
						screenVideo.options.playerPane.find('.player-cover').hide();
					}
				});
			});
			videoSlider();
			$(videoList).find('.item:first>a:first').click();
		};

		function initVideoPlayer(url,title){
			screenVideo.videoConfig.url = url||screenVideo.videoConfig.url;
			screenVideo.videoConfig.screenVideo = title||screenVideo.videoConfig.title;
			if(screenVideo.videoPlayMode=='live'){
				screenVideo.videoConfig.controlbardisplay = 'disable';
			}else{
				screenVideo.videoConfig.controlbardisplay = 'disable';
			}
			
			var player = $('#'+screenVideo.options.playerElment);
			//缩小
			player.animate({width:'9%',top:'92%'}, 'slow', function(){
				player.empty();

				//放大
				player.animate({width:'70%',top:'0'}, 'slow', function(){
					screenVideo.videoPlayer=new Sewise.SewisePlayer(screenVideo.videoConfig);
					screenVideo.videoPlayer.startup();
				});
			});
		}; 

		function switchLiveAndVod(){
			var $div = $(this);
			screenVideo.options.playerPane.find('.player-shadow a').removeClass('btn-danger').addClass('btn-link');
			if($div.hasClass('vod')){
				screenVideo.videoPlayMode = 'vod';
				loadVodSource();
			}else{
				screenVideo.videoPlayMode = 'live';
				loadLiveSource();
			}
			$div.removeClass('btn-link').addClass('btn-danger');
		};
		
		screenVideo.options.playerPane.find('.player-shadow a').click(switchLiveAndVod);
		loadLiveSource();
	},
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	 $('.area').click(function(){
	    	Utils.setPageLocation();
	    });
	var screenVideo = ScreenVideo.createNew({
		playerPane : $('.player-pane'),
		playerElment : "player"
	});
});





