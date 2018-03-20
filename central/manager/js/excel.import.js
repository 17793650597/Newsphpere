+function PageRole() {
	// 常量
	var proxy = top.CentralProxy;

	// 私有变量
	var _btnsOl = $('.btns_ol');
	
	// 定义所有excel数据类型
	var _excelTypes = [
//	{
//		dataType: 'dutySchedule',
//		caption: '值日表'
//	},
	{
		dataType: 'audienceRating',
		caption: '收视率'
	},
//	{
//		dataType: 'fusionRating',
//		caption: '融媒体影响力'
//	},{
//		dataType: 'weiwei',
//		caption: '新闻两微榜'
//	},{
//		dataType: 'clicks',
//		caption: '荔枝新闻点击量'
//	},{
//		dataType: 'toutiao',
//		caption: '媒体客户端排行榜'
//	}
	];
	
	// 私有函数
	function _initButtons(opts){
		_btnsOl.empty();
		$(opts).each(function(index,item){
			var $li = $('<li>\
							<form id= "'+ item.dataType +'">\
							      <p>'+ item.caption +'Excel导入： </p>\
							      <div class="buttons">\
								      <input type="file" name="file"/>\
								      <input type="button" value="点击上传"/>\
							      </div>\
							</form>\
						</li>');
			$li.find('input[type=button]').data("dataType", item.dataType).data("caption", item.caption);
			_btnsOl.append($li);
		});
		$('input[type=button]').click(function(event){
			_doUpload(this);
		});
	}
	
	function _doUpload(that) {
	     var formData = new FormData($(that).closest('form')[0]);
	     proxy.uploadExcel($(that).data("dataType"), formData, function(resp){
	    	 if(resp.code==0){
	    		 Message.success($(that).data("caption")+"上传成功");
	    	 }else{
	    		 Message.danger($(that).data("caption")+"上传失败");
	    	 }
	     });
	}
	
	function _init() {
		_initButtons(_excelTypes);
	};
	
	//初始化入口
	$(function() {
		_init();
	});
}();
