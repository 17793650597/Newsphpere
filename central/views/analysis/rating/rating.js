$(function () {
	Utils.setBgCSS();
	var pgtrans = PageTransitions.createNew({
		container : $('#pt-main'),
		$pages : $('#pt-main').children('div.pt-page'),
		animcursor : 66,
		current : 0,
		autoChange: true,
		interval : 30000
	});
	pgtrans.init();
	
	var timeDelay =setInterval(function(){
		if($(".pt-page-current iframe").attr("id")=='tele' && !$(".pt-page-current iframe").attr("src")){
			$("#tele").attr("src","television/?bg=transparent");		
		}
	},1000)
});