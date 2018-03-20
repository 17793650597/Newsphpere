var Blog = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.latestblog-container'),
        };
        var blog = {};
        blog.options = $.extend(true, opts_default, opts);
        Blog.loadData(blog, Blog.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        blog.intervalQuery = setInterval(function () {
            Blog.loadData(blog, Blog.loadDataCallBack);
        }, 120000);
        return blog;
    },

    loadDataCallBack: function (blogArray, blog) {
        blog.blogArray = blogArray;
        Blog.displayDatas(blog);
    },

    loadData: function (blog, callback) {
    	var startTime = Utils.parseTime(new Date().getTime() - 604800000, 'y-m-d h:i:s', true);
    	var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d h:i:s', true);;
        var param = {
        	          "startTime": startTime,
        	          "endTime": endTime,
        	          "currentPage": 1,
        	          "pageSize": 10,
        	          "sortKey": "publishTime"
        };
    	CentralProxy.getWeiboData(param, function(resp) {
    		if(resp.code!=0){
    			return;
    		}
			if(callback && typeof callback == 'function') {
				callback(resp.data.result, blog);
			}
		});
    },

    displayDatas: function (blog) {
        var copyArr = blog.blogArray.slice();
        blog.blogPageArray = [];
        while (copyArr.length) {
            blog.blogPageArray.push(copyArr.splice(0, 4));
        }

        var pageIndex = 0;
        if (pageIndex >= blog.blogPageArray.length) {
            return;
        }
        if (blog.intervalPage) {
            clearInterval(blog.intervalPage);
        }
        var currentPageArray = blog.blogPageArray[pageIndex].slice();
        Blog.clearItems(Blog.appendItems, blog, currentPageArray);
        pageIndex++;
        blog.intervalPage = setInterval(function () {
            if (pageIndex >= blog.blogPageArray.length) {
                pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
            }
            currentPageArray = blog.blogPageArray[pageIndex].slice();
            Blog.clearItems(Blog.appendItems, blog, currentPageArray);
            pageIndex++;
        }, 10000);//每页切换的时间
    },

    clearItems: function (callback, blog, currentPageArray) {
        if (blog.intervalShowOne) {
            clearInterval(blog.intervalShowOne);
        }
        var $blogItemBodies = blog.options.container.find('.blog-item');
        if ($blogItemBodies.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(blog, currentPageArray);
            }
            return;
        }
        blog.options.container.find('div.blog-list').animate({bottom: '-100%'}, 'slow', function () {
            $(this).empty();
            if (callback && typeof callback == 'function') {
                callback(blog, currentPageArray);
            }
        });
    },

    /**
     * 用于显示当前页的blogItem
     */
    appendItems: function (blog, currentPageArray) {
        var blogList = blog.options.container.find('div.blog-list');
        blogList.css('bottom', '100%');
        Blog.axisYAnim(blog);
        //每隔400ms append一个blogItem
        var currentPageArrayIndex = 0;
        blog.intervalAppend = setInterval(function () {
            if (currentPageArrayIndex >= currentPageArray.length) {
                clearInterval(blog.intervalAppend);
                showAll();
                return;
            }
            Blog.appendItem(currentPageArray[currentPageArrayIndex], blogList);
            currentPageArrayIndex++;
        }, 50);

        function showAll() {
            //每隔6s钟显示一个blogItem详情突出显示
            //第一个单独从interval中提出来，防止第一个也需要经过6000ms才触发的问题
//				blogList.css('bottom', '100%');
            blogList.animate({bottom: '10%'}, 1000, function () {
                var blogListIndex = 0;
                var $blogItems = blog.options.container.find('div.blog-list > div.blog-item');
                showOne();

                blog.intervalShowOne = setInterval(function () {
                    showOne();
                }, 2000);

                function showOne() {
                    if (blogListIndex >= $blogItems.length) {
                        clearInterval(blog.intervalShowOne);
                        $blogItems.removeClass('active');
                        return;
                    }
                    $blogItems.removeClass('active');
                    $($blogItems[blogListIndex]).addClass('active');
                    $($blogItems[blogListIndex]).find('.blog-item-body').addClass('rotateX');
                    blogListIndex++;
                }
            });
        }
    },

    /**
     * Y横轴动画弹出
     */
    axisYAnim: function (blog) {
        blog.options.container.find('div.axis-y').height('80%');
    },

    appendItem: function (row, parentEle) {
    	var opts_default = {
    			"retweetNum": 0,
    			"publishTime": "",
    			"videos": [],
    			"from": "",
    			"praisedCount": 0,
    			"character": "",
    			"weiboLocation": "",
    			"commentNum": 0,
    			"content": "",
    			"author": {
    				"accounts": "",
    				"isVip": false,
    				"tweetNum": 0,
    				"nickName": "",
    				"authorLocation": "江苏 南京",
    				"tag": "",
    				"isEnt": false,
    				"discription": "",
    				"fansNum": 0,
    				"verifyInfo": "",
    				"idolNum": 0,
    				"registerTime": "",
    				"headPicPath": "http://mcp.smg.cdvcloud.com/storage/sinavbo/headpic/36b04bc3f7f7b67d8f0364e1696534df.jpg"
    			},
    			"weiboType": "",
    			"parentID": "",
    			"images": [],
    			"weiboKind": "",
    			"weiboID": "",
    			"comments": [],
    			"isOriginality": true
    		};

        var blogItem = {};
        blogItem.data = $.extend(true, opts_default, row);
        blogItem.html = '<div class="blog-item add-transition">\
								<div class="author-avatar add-transition"><span></span><img class="author-avatar-img" src=""/></div>\
				                <div class="axis-x add-transition">\
				            		<div class="blog-item-body">\
										<span class="arrow-left glyphicon glyphicon-play"></span>\
										<div class="author">风的影子</div>\
										<div class="content"></div>\
							        	<div class="media-inf">\
											<span class="time">50分钟前</span>\
											<span class="media-source">来自新浪微博</span>\
										</div>\
										<div class="tag-nums">\
											<i class="glyphicon glyphicon-share-alt"></i>\
											<span class="share">52342</span>\
											<span class="divid"></span>\
											<i class="glyphicon glyphicon-comment"></i>\
											<span class="comments">72132</span>\
											<span class="divid"></span>\
											<i class="glyphicon glyphicon-thumbs-up"></i>\
											<span class="praise">322132</span>\
										</div>\
				            		</div>\
								</div>\
				    		</div>';
        blogItem.blogItemElement = $(blogItem.html);
        blogItem.blogItemElement.find('.author-avatar-img').attr('src', blogItem.data.author.headPicPath);
        blogItem.blogItemElement.find('.author').text(blogItem.data.author.nickName);
        blogItem.blogItemElement.find('.time').text(blogItem.data.publishTime);
        blogItem.blogItemElement.find('.media-source').text("来自" + blogItem.data.weiboKind);
        var content = '';
        if(blogItem.data.content && $.trim(blogItem.data.content).length>60){
        	content = blogItem.data.content.substring(0, 60) + '...';
        }else{
        	content = blogItem.data.content;
        }
        blogItem.blogItemElement.find('.content').text(content);
        blogItem.blogItemElement.find('.share').text(blogItem.data.retweetNum);
        blogItem.blogItemElement.find('.comments').text(blogItem.data.commentNum);
        blogItem.blogItemElement.find('.praise').text(blogItem.data.praisedCount);
        /*blogItem.blogItemElement.css('opacity', '1');*/
        blogItem.blogItemElement.css('opacity', '1').click(function(){
        				DetailShow.show({
        		            container: $('body'),
        		            data: {
        		            	title: blogItem.data.author.nickName,
        		            	time: blogItem.data.publishTime.substring(0,10),
        		            	content: blogItem.data.content,
        		            	pics: [blogItem.data.author.headPicPath]
        		            }});
        			});
        parentEle.append(blogItem.blogItemElement);
        return blogItem;
    }
};

$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
    Blog.createNew();
});

