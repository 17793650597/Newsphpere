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
		
		screenVideo.vodQueryParam = {
				source:'',
				startPage:0,
				pageSize:60,
				searchTime:'',
				product:'CDV_SCREEN'
		};
		
		function loadVodSource() {
			screenVideo.videoPlayMode = 'vod';
			screenVideo.options.playerPane.find('.player-cover').hide();
			screenVideo.vodQueryParam.startPage = 0;
			$.post("http://zyjs.cdvcloud.com/api/getCollectionVideo/",screenVideo.vodQueryParam,function(resp){
				var videoList = screenVideo.options.playerPane.find('.video-list .slider');
				videoList.empty();
				$(resp.data).each(function(index, video) {
//					if(index > 4){
//						return;
//					}
					if(video.video.duration == 0){
						return;
					}
					var durationObj = new Date(video.video.duration);
					var duration = durationObj.getMinutes() + '′' + durationObj.getSeconds() + '″';
					var title = video.channelName+'-'+video.columnName+'-'+video.title;
					var html = '<div class="item">\
									<a href="#">\
										<img src="'+video.thumb.thumbUrl+'">\
										<span class="video-title" title = "'+title+'">'+video.title+'</span>\
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
				videoSlider();
				$(videoList).find('.item:first>a:first').click();
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
			var count = 5;
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
						appendVodSource(updateSetting);
					}else{
						updateSetting();
					}
				});
			}
		}

		var loadLiveSource = function() {
			screenVideo.videoPlayMode = 'live';
			var videoList = screenVideo.options.playerPane.find('.video-list .slider');
			videoList.empty();
			var address = [{thumb: '../../images/stations/jsws.png', name:'江苏卫视高清', url:'http://hls-xietong.litchicloud.jstv.com/live/jswsgq_xietong/online.m3u8', isAudio:false},
                           {thumb: '../../images/stations/jsgg.png', name:'江苏公共新闻', url:'http://hls-xietong.litchicloud.jstv.com/live/jsgg_xietong/online.m3u8', isAudio:false},
                           {thumb: '../../images/stations/jscs.png', name:'江苏城市', url:'http://hls-xietong.litchicloud.jstv.com/live/jscs_xietong/online.m3u8', isAudio:false},
                           {thumb: '../../images/stations/jsjy.png', name:'江苏教育', url:'http://hls-xietong.litchicloud.jstv.com/live/jsjy_xietong/online.m3u8', isAudio:false},
                           {thumb: '../../images/stations/cctv.png', name:'CCTV新闻', url:'http://hls-xietong.litchicloud.jstv.com/live/cctv13_xietong/online.m3u8', isAudio:false},
                           {thumb: '../../images/stations/jsgb.png', name:'ＦＭ　９３.７', url:'http://hls-xietong.litchicloud.jstv.com/live/937_xietong/online.m3u8', isAudio:true}];
			$(address).each(function(index, item){
				var div = $('<div class="item">\
					<a href="#">\
					<img src="'+item.thumb+'">\
					<span class="source-name">'+item.name+'</span>\
					</a>\
				</div>').appendTo(videoList);
				div.find('a').click(function(){
					initVideoPlayer(item.url, item.name);
					screenVideo.options.playerPane.find('.player-shadow .name').html(item.name);
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
	var screenVideo = ScreenVideo.createNew({
		playerPane : $('.player-pane'),
		playerElment : "player"
	});
});





