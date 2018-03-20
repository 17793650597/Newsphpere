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
				elid				: screenVideo.options.playerElment, 
		    	autostart 			: true,
		    	url       			: 'http://vod.v.jstv.com/2017/12/23/JSTV_JSGG_1514004019917_jie2BSB_2265.mp4',
		    	controlbardisplay	: 'disable',
		        skin	  			: "vodTransparent"
		        	};
		screenVideo.videoPlayer = null;
		function initVideoPlayer(url,title){
			screenVideo.videoConfig.url = url||screenVideo.videoConfig.url;
			screenVideo.videoConfig.screenVideo = title||screenVideo.videoConfig.title;
			screenVideo.videoPlayer=new Sewise.SewisePlayer(screenVideo.videoConfig);
			screenVideo.videoPlayer.on("ended",function(){
	         	$('.sewiseplayer-container').remove()
	         	screenVideo.videoPlayer.startup();  
		    });
			screenVideo.videoPlayer.startup();
		}; 
		var url = ModuleConfigHelper.getConfigByModuleName("ns.player.video").queryUrlShow;
		initVideoPlayer(url, 'Show');
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





