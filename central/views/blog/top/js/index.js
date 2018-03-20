
var BlogBillboard = {
    createNew: function(opts) {
        var opts_default = {
            container: $('.blog-billboard-page'),
            queryInterval: 60000,
            animcursor: 66,
            queryParam: {
            	"accessToken": "05784E32D86340D976677714905E6D53B2E0",
            	"timeStamp": new Date().getTime(),
            	"timeUnit":"day",
            	"sortKey":"praisedCount"
            }
        }
        var blogBillboard = {};
        blogBillboard.options = $.extend(true, opts_default, opts);
        BlogBillboard.initDateAndBtns(blogBillboard);
        BlogBillboard.loadData(blogBillboard, BlogBillboard.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        blogBillboard.intervalQuery = setInterval(function() {
            BlogBillboard.loadData(blogBillboard, BlogBillboard.loadDataCallBack);
        }, blogBillboard.options.queryInterval);
        return blogBillboard;
    },
    
    loadDataCallBack: function(blogBillboardArray, blogBillboard) {
        blogBillboard.blogBillboardArray = blogBillboardArray;
        BlogBillboard.appendAllItem(blogBillboard);
    },
    
    loadData: function(blogBillboard, callback) {
    	var loadCallback = function(resp) {
            var blogBillboardArray = [];
            if(resp.code != 0){
            	return;
            }
            var blogBillboardArray = [];
            $(resp.data.result).each(function(index, row) {
            	if(index > 9){
            		return;
            	}
                blogBillboardArray.push(row);
            });
            if (callback && typeof callback == 'function') {
                callback(blogBillboardArray, blogBillboard);
            }
        };
        
    	CentralProxy.getWeiboRank(blogBillboard.options.queryParam, loadCallback);
    	//假数据
//        var resp = {
//        		"message": "处理成功",
//        		"data": {
//        			"result": [{
//        				"commentNum": 3215,
//        				"dataChange": 1,
//        				"rank": 1,
//        				"retweetNum": 4568,
//        				"nickName": "重庆市人民政府新闻办公室",
//        				"praisedCount": 10292
//        			}, {
//        				"commentNum": 3076,
//        				"dataChange": 0,
//        				"rank": 2,
//        				"retweetNum": 1320,
//        				"nickName": "重庆卫视",
//        				"praisedCount": 7166
//        			}, {
//        				"commentNum": 1417,
//        				"dataChange": -1,
//        				"rank": 3,
//        				"retweetNum": 2012,
//        				"nickName": "重庆广播电视总台",
//        				"praisedCount": 4449
//        			}, {
//        				"commentNum": 1364,
//        				"dataChange": -1,
//        				"rank": 4,
//        				"retweetNum": 1320,
//        				"nickName": "重庆市政府新闻办",
//        				"praisedCount": 5642
//        			}, {
//        				"commentNum": 1264,
//        				"dataChange": 1,
//        				"rank": 5,
//        				"retweetNum": 942,
//        				"nickName": "重庆市政",
//        				"praisedCount": 3741
//        			}, {
//        				"commentNum": 687,
//        				"dataChange": -1,
//        				"rank": 6,
//        				"retweetNum": 1620,
//        				"nickName": "重庆交通",
//        				"praisedCount": 2628
//        			}, {
//        				"commentNum": 523,
//        				"dataChange": 0,
//        				"rank": 7,
//        				"retweetNum": 1320,
//        				"nickName": "国网红岩",
//        				"praisedCount": 6323
//        			}, {
//        				"commentNum": 485,
//        				"dataChange": 1,
//        				"rank": 8,
//        				"retweetNum": 420,
//        				"nickName": "重庆网警",
//        				"praisedCount": 1532
//        			}, {
//        				"commentNum": 353,
//        				"dataChange": -1,
//        				"rank": 9,
//        				"retweetNum": 920,
//        				"nickName": "重庆文广",
//        				"praisedCount": 6312
//        			}],
//        			"totalCount": 6
//        		},
//        		"code": "0"
//        	};
//        loadCallback(resp);
    },
    
    initDateAndBtns: function(blogBillboard){
    	var $time = blogBillboard.options.container.find('.up .time');
    	var $btns = blogBillboard.options.container.find('.btns > a');
    	var queryTime = new Date();
    	$time.text(queryTime.format('YYYY年M月D日'));
    	$($btns).each(function(index,item){
    		$(item).click(function(){
    			$btns.removeClass('active');
    			$(this).addClass('active');
    			var timeStage;
    			switch ($(this).text()) {
				case '24小时':
					timeStage = 'day';
					break;
				case '7天':
					timeStage = 'week';
					break;
				case '30天':
					timeStage = 'month';
					break;
				default:
					timeStage = 'day';
					break;
				}
    			blogBillboard.options.queryParam.timeUnit = timeStage;
    			BlogBillboard.loadData(blogBillboard, BlogBillboard.loadDataCallBack);
    		});
    	});
    },
    
    appendAllItem: function(blogBillboard) {
    	var listContainer = blogBillboard.options.container.find('.gallery-blog-billboard');
    	var blogBillboardArray = blogBillboard.blogBillboardArray;
    	var blogBillboardList = $('<div class="blog-billboard-list pt-page"></div>')/*.appendTo(listContainer)*/;
    	
    	listContainer.find('.pt-page').removeClass('pt-page-current');
    	if(blogBillboard.intervalShowOneByOne){
    		clearInterval(blogBillboard.intervalShowOneByOne);
    	}
    	if (blogBillboardArray.length == 0) {
            blogBillboardList.append('<span>暂无数据</span>');
//            return;
        }
        
        $(blogBillboardArray).each(function(index, row) {
            var html = makeBlogBillboardHtml(row);
            blogBillboardList.append(html);
        });
        blogBillboardList.appendTo(listContainer);
        if(listContainer.children('div.pt-page').length>3){
        	listContainer.children('div.pt-page')[0].remove();
        }
        if(blogBillboard.pageTransitions){
        	blogBillboard.pageTransitions.stop();
        }
        var $pages = $('#pt-main').children('div.pt-page');
        var pgOpts = {
            	container : $('#pt-main'),
    			$pages : $pages,
    			animcursor : blogBillboard.options.animcursor,
    			current : ($pages.length - 2) < 0 ? 0 : ($pages.length - 2),
    			autoChange: false
    		};
        blogBillboard.pageTransitions = PageTransitions.createNew(pgOpts);
        blogBillboard.pageTransitions.init();
        blogBillboard.pageTransitions.nextPage(pgOpts.animcursor);
        startShowOneByOne();
        
        function makeBlogBillboardHtml(row) {
            var html = '<div class="item">\
					        <div class="ranking col-xs-2">\
								<div class="ranking-card">&nbsp;</div>\
								<div class="ranking-no">1</div>\
							</div>\
				            <div class="data col-xs-10">\
				    			<div class="name col-xs-4">科学抗癌</div>\
				           		<div class="activity-count col-xs-2">45.22</div>\
				           		<div class="spread-count col-xs-2">52.32</div>\
				           		<div class="watcher-count col-xs-2">3219293</div>\
				           		<div class="raising col-xs-2 glyphicon glyphicon-arrow-up"></div>\
				    		</div>\
						</div>';
            var $html = $(html);
            var raisingClass;
            switch (row.dataChange) {
			case 0:
				raisingClass = "glyphicon-record";
				break;
			case 1:
				raisingClass = "glyphicon-arrow-up";
				break;
			case -1:
				raisingClass = "glyphicon-arrow-down";
				break;
			default:
				break;
			}
            
            $html.find('.ranking-no').text(row.rank);
            $html.find('.name').text(row.nickName);
            $html.find('.activity-count').text(row.praisedCount);
            $html.find('.spread-count').text(row.retweetNum);
            $html.find('.watcher-count').text(row.commentNum);
            $html.find('.raising')
            	.removeClass('glyphicon-arrow-up glyphicon-arrow-down')
            			.addClass(raisingClass);
            return $html;
        }
        ;
        function startShowOneByOne() {
        	if(blogBillboard.intervalShowOneByOne){
            	clearInterval(blogBillboard.intervalShowOneByOne);
            }
            var $blogBillboardItems = blogBillboardList.find('.item');
            $blogBillboardItems.removeClass('active');
            var currentArrayIndex = 0;
            $($blogBillboardItems[currentArrayIndex]).addClass('active', 300);
            currentArrayIndex++;
            blogBillboard.intervalShowOneByOne = setInterval(function() {
                if (currentArrayIndex >= $blogBillboardItems.length) {
                    currentArrayIndex = 0;
                    //				    	clearInterval(blogBillboard.intervalShowOneByOne);
                    //				    	return;
                }
                if (blogBillboardList.find('.item.active').length > 0) {
                    var tempIndex = currentArrayIndex;
                    blogBillboardList.find('.item.active').removeClass('active', 100, function() {
                        $($blogBillboardItems[tempIndex]).addClass('active', 200);
                    });
                } else {
                    $($blogBillboardItems[currentArrayIndex]).addClass('active', 200);
                }
                currentArrayIndex++;
            }, 3000);
        }
        ;
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	BlogBillboard.createNew();
});

