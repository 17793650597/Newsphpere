var resourceMap = null;
$(function () {
	Utils.setBgCSS('lightblue','map.jpg');
	Utils.setPageFontSize(1920);
	var title='';
	/*CentralProxy.getInfos(function(response){
		title = response.mapTitle;
		$('.title-text').html(title);		
	});*/
	var mapConf = ModuleConfigHelper.getConfigByModuleName('ns.map.newsphere');
	$('.title-text').html(mapConf.title);
	$('.logo>img').attr('src', mapConf.logo);
	var cdv = mapConf.cdv == 'true' ? true : false;
	if(!cdv){
		$('.cdv').hide();
	}
	
	var url = mapConf.queryUrl;
	if(!url){
		url = 'http://newsphere.cdv.com/web/sites/screencontrol/map.html';
	}
	$('#map_resource').empty().append($('<iframe name="map" src="'+ url +'"></iframe>'));
});

