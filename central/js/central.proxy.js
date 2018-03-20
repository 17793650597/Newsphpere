/**
 * 调用示例
 * 
 * 	var configParam = {
 *		moid: moid,
 *		forcategoryid: categoryid
 *	};
 * 	top.CentralProxy.createClue(configParam, function(response){
 * 		
 *  })
 *  或者
 *  CentralProxy.createClue(configParam, function(response){
 * 		
 *  })
 * 
 */

var CentralProxy = {
	SUCCESS : 0,
	CLIENT_ERROR : -20000,
	SERVER_ERROR : -10000,
	UNKNOWN : -1,
	showIndex : function() {
		top.location.href = '/central/';
	},
	__safeCallback : function(callback, data, extra) {
		if('undefined' === typeof data) {
			return;
		}
		if('function' === typeof callback) {
			callback(data, extra);
		}
	},
	project : '/central',
	newsphereProjectLocation: 'http://localhost:8080',
//	newsphereProjectLocation: 'http://newsphere.cloud.jstv.com',
//	publishAgentLocation: 'http://newsphere.cloud.jstv.com:8380/publishagent/services/getflowdata',
	//微博微信云视 TODO 
	blogWechatLocation: 'http://interface.cdvcloud.com/jstv/V1/cdvcloud/jstv001/zyds/data/',
	
	/**
	 * 长江云公共主页获取最新报片（不需要session）
	 */ 
	search: function(param, callback, extra, realNameFlag){
		$.ajax({
//			url		: this.newsphereProjectLocation + '/web/api/show/search' + (realNameFlag===true?'?realNameFlag=true':''),
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.clue').queryUrl  + (realNameFlag===true?'?realNameFlag=true':''),
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	
	searchComb: function(param, callback, extra){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.clue').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	
	getReportStatistics: function(keyword, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.data').queryUrl + keyword,
			type	: 'GET',
			async	: true,
			cache   : false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	getPhotosData: function(callback){
		$.ajax({
//			url		: 'http://data.cloud.jstv.com:31801/service/bd/get/action=query&PrintFields=title,DRECONTENT,dredate,PATH_IMAGE,CATEGORY_TWO&anylanguage=true&OutputEncoding=UTF8&TotalResults=true&Predict=false&sort=date&anylanguage=true&responseformat=json&Start=1&MaxResults=35&fieldtext=MATCH%7B%E6%97%B6%E6%94%BF%E8%A6%81%E9%97%BB%7D:CATEGORY_THREE&databasematch=network',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.special.photos').queryUrl,
			type	: 'GET',
			async	: true,
			cache   : false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/*温岭最新图片*/
	getPicData: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.special.picture').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	getPhotoFromLang: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.special.photos').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getWorkingWorkitemNameStr: function(moID, callback){
		$.ajax({
//			url		: this.newsphereProjectLocation + '/web/api/show/getWorkItemAndPrevWorkerName',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.topic').getWorkItemAndPrevWorkerNameUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			data 	: {moID: moID},
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getToken: function(param, callback){
		var defaulturl = 'http://api.zvn360.net:32880/rest/token/create?appKey=bigScreenyunnan@z-vn.com&secretKey=94e3723d3ede81543ac33cfa33a2023d'
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.hot').queryUrlToken || defaulturl ,
			type	: 'POST',
			async	: true,
			contentType : 'application/x-www-form-urlencoded',
			data 	: param,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	//人民网token
	getTokenForRenmin: function(consensusToken, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.consensus')[consensusToken],
			type	: 'GET',
			async	: true,
//			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	//人民网token饼图柱状图
	getTokenPieBar: function(consensusToken, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.analysis')[consensusToken],
			type	: 'GET',
			async	: true,
//			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getAnalysisData: function(param, callback){
	    $.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.analysis').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getBreakingData: function(param, callback){
	    $.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.consensus').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	hotNews: function(token, callback){
		var conf = ModuleConfigHelper.getConfigByModuleName('ns.news.hot');
		$.ajax({
			url		: conf.queryUrl + '?ACCESSTOKEN=' + token,
			type	: 'GET',
			async	: true,
//			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getCreateFlow: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.create').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getTitles: function(callback){
		$.ajax({
//			url		: this.newsphereProjectLocation + '/web/api/show/title?count=30',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.title').queryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: null,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	//getReports为荔枝版本今日报道
	getReports: function(callback){
		$.ajax({
//			url		: this.newsphereProjectLocation + '/web/api/show/title?count=30',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.reports').queryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			data 	: null,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getTitleCounts: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.title').queryUrlAssets,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		})
	},
	/**
	 * 微博微信发布统计
	 */ 
	getWWStatistics: function(param, callback){
		$.ajax({
			url		: this.blogWechatLocation + 'getWWStatistics',
//			url		: ModuleConfigHelper.getConfigByModuleName('ns.blog.data').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	/*
	 * 关键词搜索（温岭）
	 * */
//	http://www.newsbigbang.com/auton/lsg/interface/getTopicList.do
	getKeywordid: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.keyword').queryUrlId,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		})
	},
	keywordData: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.keyword').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		})
	},
	getPieData: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.keyword').queryUrlPie,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		})
	},
	getBarData: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.news.keyword').queryUrlBar,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		})
	},
	/**
	 * 获取微博排行
	 */
	getWeiboRank: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeiboRank',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.blog.top').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	/*温岭*/
	getWeixinRankForWenling: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeiboRank',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.contentw').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},	
	getArtical: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeiboRank',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.contentw').contentUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},	
	/**
	 * 获取微信排行
	 */
	getWeixinRank: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeixinRank',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.top').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	getWechatHot: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.hot').queryUrl,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取新媒体渠道 微信内容排行数据
	 */
	getWeixinMediaData: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeixinRank',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.content').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},	
	/**
	 * 获取订阅微信数据
	 */
	getWeixinData: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeixinData',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.wechat.latest').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	/*温岭视频数据*/
	getVideoList: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.player.video').queryUrlList,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});		
	},
	getVideoHot: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.player.video').queryUrlHot,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});		
	},
	/**
	 * 获取微博数据
	 */
	getWeiboData: function(param, callback){
		$.ajax({
//			url		: this.blogWechatLocation + 'getWeiboData',
			url		: ModuleConfigHelper.getConfigByModuleName('ns.blog.latest').queryUrl,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	
	/**
	 * 获取热点资讯
	 */
//	getHotNews: function(param, callback){
//		var conf = ModuleConfigHelper.getConfigByModuleName('ns.news.hot');
//		$.ajax({
//			url		: conf.queryUrl,
//			type	: 'GET',
//			dataType: "jsonp",
//			jsonp: "callback",
//			jsonpCallback:"flightHandler",
//			async	: true,
//		//	contentType : 'application/json;charset=UTF-8',
//		//	data 	: JSON.stringify(param),
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
//		});
//	},
	//TOFO kai
	// getHotNews: function(param, callback){
	// 	var conf = ModuleConfigHelper.getConfigByModuleName('ns.news.hot');
	// 	$.ajax({
	// 		url		: conf.queryUrl,
	// 		type	: 'POST',
	// 		async	: true,
	// 		contentType : 'application/json;charset=UTF-8',
	// 		data 	: JSON.stringify(param),
	// 		success	: function(response) {
	// 			CentralProxy.__safeCallback(callback, response);
	// 		}
	// 	});
	// },


	getHotNews: function(param, callback){
//		var conf = ModuleConfigHelper.getConfigByModuleName('ns.news.hot');
//		$.ajax({
//			url		: conf.queryUrl,
//			type	: 'POST',
//			async	: true,
//			contentType : 'application/json;charset=UTF-8',
//			data 	: JSON.stringify(param),
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
//		});
		var response = "{\"ActionStatus\":\"OK\",\"ErrorCode\":0,\"ErrorInfo\":\"\",\"ErrorDisplay\":\"\",\"RspBodyContent\":[{\"category\":\"政治\",\"category2\":\"国内时政,国际时政\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/1898307640/640\",\"keyword_list\":\"委员,人民,代表,大会\",\"location_list\":\"湖南省\",\"media_num\":\"50113\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"83\",\"person_list\":\"\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"23124\",\"start_time\":\"2018-01-09 20:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"8082345488764284921\",\"topic_info\":\"央视网消息：作为国家反腐败机构，监察委员会履行监督、调查、处置职责，那么，谁来监督监察委员会呢？\",\"topic_name\":\"监察委员会受人民代表大会监督\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"政治\",\"category2\":\"国内时政,国际时政\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"\",\"keyword_list\":\"主席,习近平,当选,国家主席\",\"location_list\":\"\",\"media_num\":\"25114\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"70\",\"person_list\":\"习近平,王岐山\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"36838\",\"start_time\":\"2018-03-17 12:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"10705567042287979650\",\"topic_info\":\"17日当天俄罗斯多家主流媒体密集报道了中国新一届国家机构领导人选举产生的消息。俄罗斯国家电视台报道称，在中国全国人大17号举行的国家主席、中央军委主席选举中\",\"topic_name\":\"俄主流媒体积极评价习近平当选国家主席\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3053117490/640\",\"keyword_list\":\"姚笛,网友,求婚,成功\",\"location_list\":\"\",\"media_num\":\"1172\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"107\",\"person_list\":\"姚笛,马伊琍\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"922\",\"start_time\":\"2018-03-17 15:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"2295602084042405706\",\"topic_info\":\"昨天姚笛36岁生日被求婚，微博配文道：“此心安处，便是乐也！”\",\"topic_name\":\"姚笛被求婚成功\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星,电影,韩国娱乐\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3056402762/640\",\"keyword_list\":\"电影,大奖,古天乐,亚洲\",\"location_list\":\"\",\"media_num\":\"969\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"92\",\"person_list\":\"古天乐\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"1871\",\"start_time\":\"2018-03-18 00:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"17778852450400897685\",\"topic_info\":\"第12届亚洲电影大奖红毯，《杀破狼·贪狼》剧组亮相，该片提名最佳动作电影，古天乐提名最佳男主角。\",\"topic_name\":\"古天乐成影帝\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星,电影,韩国娱乐\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3056406732/640\",\"keyword_list\":\"电影,大奖,古天乐,亚洲\",\"location_list\":\"\",\"media_num\":\"967\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"140\",\"person_list\":\"张雨绮,刘嘉玲\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"1870\",\"start_time\":\"2018-03-18 00:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"3449581322341186223\",\"topic_info\":\"视觉中国讯 3月17日，第12届亚洲电影大奖颁奖典礼于澳门举行。群星陆续现身走红毯，刘嘉玲、张雨绮惊艳亮相，惠英红印花花裙风情万种。\",\"topic_name\":\"第12届亚洲电影大奖开幕\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"体育\",\"category2\":\"NBA,足球其它,CBA\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3057601221/640\",\"keyword_list\":\"火箭,鹈鹕,连胜,哈登\",\"location_list\":\"\",\"media_num\":\"851\",\"new_flag\":\"0\",\"organization_list\":\"火箭\",\"origin_heat\":\"52\",\"person_list\":\"哈登\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"309\",\"start_time\":\"2018-03-18 11:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"14974182540794393225\",\"topic_info\":\" 火箭客场107-101击败鹈鹕，取得4连胜，与勇士之间的胜场差拉大到3个胜场。哈登贡献32分11篮板8助攻，保罗19分8篮板5助攻，生涯抢断突破2000大关\",\"topic_name\":\"火箭擒鹈鹕迎四连胜\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3058811732/640\",\"keyword_list\":\"李敖,小s,去世,悼念\",\"location_list\":\"\",\"media_num\":\"848\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"64\",\"person_list\":\"李敖,小s\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"160\",\"start_time\":\"2018-03-18 14:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"8348429034547281100\",\"topic_info\":\"网易娱乐3月18日报道3月18日午时，台北荣民总医院证实，罹患脑干肿瘤的作家李敖，近日因病况转危，今天上午10点59分离世，享年83岁。\",\"topic_name\":\"李敖去世 小s：他的思想会永存人间\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3059182312/640\",\"keyword_list\":\"李敖,小s,去世,悼念\",\"location_list\":\"\",\"media_num\":\"842\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"74\",\"person_list\":\"李敖,刘晓庆\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"160\",\"start_time\":\"2018-03-18 16:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"9151136158482693518\",\"topic_info\":\"台湾著名作家李敖罹患脑癌于2018年3月18日在台北不幸过世，享年83岁。消息一出令亲友悲痛不已。\",\"topic_name\":\"蔡康永悼念李敖\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星,电影,欧美娱乐\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3057156889/640\",\"keyword_list\":\"古天乐,影帝,亚洲,电影\",\"location_list\":\"\",\"media_num\":\"733\",\"new_flag\":\"0\",\"organization_list\":\"芳华\",\"origin_heat\":\"82\",\"person_list\":\"古天乐,张雨绮\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"359\",\"start_time\":\"2018-03-18 21:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"17850927921308667409\",\"topic_info\":\"第12届亚洲电影大奖颁发，《芳华》获最佳影片，古天乐、张艾嘉分封影帝影后，这是古天乐首次获电影奖项，张艾嘉也获颁终身成就奖；石井裕也获最佳导演；《妖猫传》斩获奖项数量最多\",\"topic_name\":\"古天乐张艾嘉获影帝后\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3055664648/640\",\"keyword_list\":\"李小冉,网友,梅婷,婚姻\",\"location_list\":\"\",\"media_num\":\"423\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"144\",\"person_list\":\"李小冉,梅婷\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"245\",\"start_time\":\"2018-03-18 09:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"14247885076468578029\",\"topic_info\":\"近日，有网友在李小冉微博下留言称，新剧《美好生活》梁晓慧角色天天哭丧脸，，李小冉随后回复道，咱两不在一个层面上，看不懂别看。网友受到评论后回应您不就是一演员吗，能有什么层次\",\"topic_name\":\"被指新剧哭丧脸拆散梅婷婚姻\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"体育\",\"category2\":\"中超,足球其它,网球\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/2262898218/640\",\"keyword_list\":\"恒大,建业,阿兰,高拉特\",\"location_list\":\"\",\"media_num\":\"386\",\"new_flag\":\"0\",\"organization_list\":\"恒大\",\"origin_heat\":\"60\",\"person_list\":\"阿兰,张文钊\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"157\",\"start_time\":\"2018-03-18 19:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"16001217691163939727\",\"topic_info\":\"北京时间3月18日，中超第3轮的较量，恒大主场面对建业。拥有最强火力的恒大，不仅要延续此前主场逢建业不败的纪录，同时更希望拿到连胜，不至于被身前球队拉下太多的距离。\",\"topic_name\":\"恒大开启连胜模式\",\"update_file\":\"2018031908.hourly.topic\"},{\"category\":\"娱乐\",\"category2\":\"明星\",\"detail_flag\":\"1\",\"flag\":\"hourly\",\"image_url\":\"http://inews.gtimg.com/newsapp_bt/0/3058467643/640\",\"keyword_list\":\"张杰,发高烧,网友,谢娜\",\"location_list\":\"\",\"media_num\":\"208\",\"new_flag\":\"0\",\"organization_list\":\"\",\"origin_heat\":\"56\",\"person_list\":\"张杰,谢娜\",\"project_id\":\"0\",\"search_num\":0,\"social_num\":\"212\",\"start_time\":\"2018-03-18 13:00:00\",\"topic_date\":\"20180319\",\"topic_hour\":\"08\",\"topic_id\":\"18190880501440375679\",\"topic_info\":\"谢娜生宝宝后，网友一直很关心娜姐的动态，想知道她身体恢复的怎么样了，什么时候复出等，刚刚，谢娜更新微博，说出自己产后状态，原来娜姐最近发烧了，还一直没有胃口吃东西。\",\"topic_name\":\"谢娜产后发高烧\",\"update_file\":\"2018031908.hourly.topic\"}],\"Sid\":\"c51314627dd92b28a13741746f93634638c9aebbaf6e0f3a3fc5a8a7379e3c0f\"}"
		CentralProxy.__safeCallback(callback, response)
	},


	
	/*
	 *串编单
	 * */
	getRundowns: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.rundown').queryUrlList,
			type	: 'GET',
			async	: true,
			data 	: param,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getRundownAssets: function(param, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.daily.rundown').queryUrlAssets,
			type	: 'GET',
			async	: true,
			data 	: param,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/*荔枝新闻，安徽新闻等等*/
	getNetPlayer: function(callback){
		var dataUrl = ModuleConfigHelper.getConfigByModuleName('ns.player.netPlayer').queryUrl;
		$.ajax({
			url		: dataUrl,
			type	: 'GET',
			async	: true,
			cache   : false,
			success	: function(response) {
				console.log(response);
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/*东西湖新闻*/
	getNewsDongxi: function(param, callback){
		var dataUrl = ModuleConfigHelper.getConfigByModuleName('ns.player.netPlayer').queryUrl;
		$.ajax({
			url		: dataUrl,
			type	: 'POST',
			async	: true,
			data 	: JSON.stringify(param),
			cache   : false,
			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				console.log(response);
				CentralProxy.__safeCallback(callback, JSON.parse(response));
			}
		});
	},
	/*
	 *渠道排行和内容排行 app接口
	 * */
	
	getV2TotalData: function(param){
		return $.ajax({
			url		: 'http://newsphere.gzstvcloud.com/web/api/show/getV2TotalData',
			type	: 'GET',
			async	: true,
			data 	: param,
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
		})
	},
	getV2Top10: function(param){
		return $.ajax({
//			url		: this.project + '/api/show/getV2Top10',
			url		: 'http://newsphere.gzstvcloud.com/web/api/show/getV2Top10',
			type	: 'GET',
			async	: true,
			data 	: param,
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
		})
	},	
	getDongJingTotalData:function(param){
		return $.ajax({
//			url		: this.project + '/api/show/getDongJingTotalData',
			url		: 'http://newsphere.gzstvcloud.com/web/api/show/getDongJingTotalData',
			type	: 'GET',
			async	: true,
			data 	: param,
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
		})
	},
	getDongJingTop10:function(param){
		return $.ajax({
//			url		: this.project + '/api/show/getDongJingTop10',
			url		: 'http://newsphere.gzstvcloud.com/web/api/show/getDongJingTop10',
			type	: 'GET',
			async	: true,
			data 	: param,
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
		})
	},
	//TODO 待天马提供专题接口
	/**
	 * 主流媒体
	 */
	getMainMediaData: function(callback){
		$.ajax({
//			url		: "http://data.cloud.jstv.com:31801/service/bd/get/action=query&text=*&fieldtext=EQUAL%7B1%7D:IS_EMERGENCY&printfields=DREDATE,CATEGORY_THREE,CATEGORY_TWO,DRECONTENT&sort=date&anylanguage=true&responseformat=json&DatabaseMatch=network&maxresults=35",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.special.media').queryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 报警事件
	 */
//	getMonitorNotice: function(callback){
//		$.ajax({
////			url		: "http://paas.cloud.jstv.com/api/monitor/getNoices/?platformId=aliyun-lizhiyun&timeZone=1440",
//			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.notice').queryUrl,
//			type	: 'GET',
//			async	: true,
//			cache	: false,
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
//		});
//	},
	getMonitorNotice: function(url, callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getNoices/?platformId=aliyun-lizhiyun&timeZone=1440",
			url		: url,
			type	: 'POST',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 查询实例列表
	 * 
	 */
	getInstanceList: function(param,callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getInstances/",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.cloud').getInstanceListQueryUrl,
			type	: 'GET',
			async	: true,
			data 	: param,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取虚机总数状态等相关信息
	 */
	getInstanceInfo: function(callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getInstanceInfo/?platformId=aliyun-lizhiyun",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.cloud').getInstanceInfoQueryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取存储相关信息
	 */
	getStorageInfo: function(callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getStorageInfo/?platformId=aliyun-lizhiyun",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.cloud').getStorageInfoQueryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取指定虚机CPU相关信息
	 * platformId=aliyun-lizhiyun&instanceId=i-235inctt7&beginTime=2016-07-29 06-00&endTime=2016-07-29 10-30
	 */
	getCpuInfo: function(param, callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getCpuInfo/",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.cloud').getCpuInfoQueryUrl,
			type	: 'GET',
			async	: true,
			data	: param,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取指定虚机内存相关信息
	 * platformId=aliyun-lizhiyun&instanceId=i-235inctt7&beginTime=2016-07-29 06-00&endTime=2016-07-29 10-30
	 */
	getMemoryInfo: function(param, callback){
		$.ajax({
//			url		: "http://paas.cloud.jstv.com/api/monitor/getMemoryInfo/",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.cloud').getMemoryInfoQueryUrl,
			type	: 'GET',
			async	: true,
			data	: param,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取虚机总数状态等相关信息
	 */
	getPlatformUsersData: function(callback){
		$.ajax({
			//TODO
//			url		: "http://paas.cloud.jstv.com/api/monitor/getInstanceInfo/?platformId=aliyun-lizhiyun",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.users').getPlatformUsersDataQueryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取虚机总数状态等相关信息
	 */
	getAppsUsersData: function(callback){
		$.ajax({
			//TODO
//			url		: "http://paas.cloud.jstv.com/api/monitor/getInstanceInfo/?platformId=aliyun-lizhiyun",
			url		: ModuleConfigHelper.getConfigByModuleName('ns.monitor.users').getAppsUsersDataQueryUrl,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取所有页面的配置信息
	 */
	getModulesInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/module/list',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 获取页面的配置信息
	 */
	getModule: function(param, callback){
		$.ajax({
			url		: this.project + '/api/module/get',
			type	: 'GET',
			async	: true,
			cache	: false,
			data	: param,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 保存某个页面的配置信息
	 */
	saveModulesInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/module/save',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 保存某个页面的配置信息
	 */
	delModulesInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/module/delete',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 获取最近几天的值班信息
	 */
	getMonitorWorkerDaysInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/monitorWorkerDay/list',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 保存某一天的值班人员信息
	 */
	saveMonitorWorkerDaysInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/monitorWorkerDay/save',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	
	/**
	 * 删除某一天的值班信息
	 */
	delMonitorWorkerDaysInf: function(param, callback){
		$.ajax({
			url		: this.project + '/api/monitorWorkerDay/delete',
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : 'application/json; charset=UTF-8',
			dataType: 'json',
			data	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 系统维护 - 用户管理相关的方法
	 */
	// 列举系统中所有用户 @author sunwei
	listAllUsers: function(callback) {
		$.ajax({
			url		: this.project + '/api/lo/users/find/all',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getUser: function(userId, callback) {
		$.ajax({
			url		: this.project + '/api/lo/users/find/get',
			type	: 'GET',
			async	: true,
			data 	: {id: userId},
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getCurrentSession: function(callback){
		$.ajaxSetup({ cache: false });
		$.ajax({
			url		: this.project + '/api/lo/sessions/current_session',
			type	: 'GET',
			async	: true,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	createUser: function(user, callback) {
		$.ajax({
			url		: this.project + '/api/lo/users/create',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(user),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	modifyUser: function(user, callback) {
		$.ajax({
			url		: this.project + '/api/lo/users/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(user),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	deleteUser: function(userID, callback) {
		$.ajax({
			url		: this.project + '/api/lo/users/delete?id=' + userID,
			type	: 'DELETE',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getUserList: function(userids, callback) {
		$.ajax({
			url		: this.project + '/api/user/getUserList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(userids),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getUserDetailList: function(userids, callback) {
		$.ajax({
			url		: this.project + '/api/user/getUserDetailList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(userids),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	freshCloudUserList:function(callback){
		$.ajax({
			url		: this.project + '/api/user/freshCloudUserList',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getCloudUserList:function(callback){
		$.ajax({
			url    : this.project + '/api/user/clouduser',
			type   : 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	addUserFromCloud:function(param, orgID, roleID, callback){
		$.ajax({
			url		: this.project + '/api/user/addUserFromCloud?orgID='+orgID+'&roleID='+roleID,
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
//	getUserProperties: function(param, callback) {
//		$.ajax({
//			url		: this.project + '/api/user/property/get',
//			type	: 'POST',
//			async	: true,
//			contentType : 'application/json; charset=UTF-8',
//			data 	: JSON.stringify(param),
//			success	: function(response) {
//				CentralProxy.__safeCallback(callback, response);
//			}
//		});
//	},
	orgsByUser: function(param, callback) {
		$.ajax({
			url		: this.project + '/api/org/orgsByUser',
			type	: 'GET',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: param,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 我的消息相关的方法
	 */
	// 列举某组织节点下所有用户 @author yoson
	listUsers: function(orgid, callback){
		$.ajax({
			url		: this.project + '/api/user/list/' + orgid,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	/**
	 * 角色权限相关
	 */
	listPermissions: function(callback) {
		$.ajax({
			url		: this.project + '/api/role/permission/list',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	createPermission: function(perm, callback) {
		$.ajax({
			url		: this.project + '/api/role/permission',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(perm),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	modifyPermission: function(perm, callback) {
		$.ajax({
			url		: this.project + '/api/role/permission',
			type	: 'PUT',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(perm),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	deletePermission: function(id, callback) {
		$.ajax({
			url		: this.project + '/api/role/permission?permissionID=' + id,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	listRoles: function(callback) {
		$.ajax({
			url		: this.project + '/api/lo/roles/find/all',
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	createRole: function(role, callback) {
		$.ajax({
			url		: this.project + '/api/lo/roles/create',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(role),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	modifyRole: function(role, callback) {
		$.ajax({
			url		: this.project + '/api/lo/roles/update',
			type	: 'POST',
			async	: true,
			contentType : 'application/json; charset=UTF-8',
			data 	: JSON.stringify(role),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	deleteRole: function(id, callback) {
		$.ajax({
			url		: this.project + '/api/lo/roles/delete?id=' + id,
			type	: 'DELETE',
			async	: true,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	uploadExcel: function(dataType, formData, callback){
		$.ajax({
			url		: this.project + '/api/excel/upload?dataType='+dataType,
			type	: 'POST',
			async	: true,
			cache	: false,
			contentType : false,
			processData: false,
			data: formData,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	loginSwan:function(param, callback, extra){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.swan.task').baseURL+'/api/nsite/authc/logon',
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	findSwanMobjects: function(param, callback, extra){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.swan.task').baseURL+'/api/nsite/mobjects/search/assets?'+'sid='+extra.sid,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			},
			error: function(response){
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	findSwanProcessInstance: function(param, callback, extra){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.swan.task').baseURL+'/api/nsite/workflow/process/get?'+'sid='+param.sid+'&procId='+param.procId,
			type	: 'GET',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	/**
	 * [{
		dataType: 'dutySchedule',
		caption: '值日表'
	},{
		dataType: 'audienceRating',
		caption: '收视率'
	},{
		dataType: 'fusionRating',
		caption: '融合力'
	},{
		dataType: 'weiwei',
		caption: '两微'
	}]
	 * @param dataType
	 * @param callback
	 */
	getExcel: function(dataType, callback){
		$.ajax({
			url		: this.project + '/api/excel/'+dataType,
			type	: 'GET',
			async	: true,
			cache	: false,
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getSnmp:function(ip, param, callback){
		$.ajax({
			url		: this.project + '/api/snmp/mid?ip='+ip,
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	},
	getDataByPost: function(moduleName, queryKey, param, callback, extra, realNameFlag){
		console.log(ModuleConfigHelper.getConfigByModuleName(moduleName)[queryKey]);
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName(moduleName)[queryKey],
			type	: 'POST',
			async	: true,
			contentType : 'application/json;charset=UTF-8',
			data 	: JSON.stringify(param),
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response, extra);
			}
		});
	},
	getDataByGet: function(moduleName, queryKey, callback){
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName(moduleName)[queryKey],
			type	: 'GET',
			async	: true,
			cache   : false,
			dataType: "json",
			success	: function(response) {
				CentralProxy.__safeCallback(callback, response);
			}
		});
	}
};