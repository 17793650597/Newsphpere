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
            if (blog.intervalPage) {
                clearInterval(blog.intervalPage);
            }
            if (blog.intervalAppend) {
                clearInterval(blog.intervalAppend);
            }
            Blog.loadData(blog, Blog.loadDataCallBack);
        }, 120000);
        return blog;
    },

    loadDataCallBack: function (blogArray, blog) {
        blog.blogArray = blogArray;
        Blog.displayDatas(blog);
    },

    loadData: function (blog, callback) {
    	var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true).replace(/-/g,"");
	    var param = {
    		"token":"mRkYnWH%5C%2FX0zyeK9mHaHU1PgfvHoPKVEHqzD%2Bn5YHuKtsOpA31FVRE9WU%5C%2FerGNrKqM6%2B801fC4l5dKswCDGJw6saKltgSVcvajY76OM8iIA",
    		"start":startTime,
    	    "end": startTime,
	    }
		$.ajax({
			url		: ModuleConfigHelper.getConfigByModuleName('ns.blog.latestsx').queryUrlToken,
			type	: 'GET',
			async	: true,
//			contentType : 'application/json;charset=UTF-8',
			success	: function(response) {
				param.token = encodeURIComponent(response.token);
			    $.ajax({
					url		: ModuleConfigHelper.getConfigByModuleName('ns.blog.latestsx').queryUrl,
					type	: 'POST',
					async	: true,
					contentType : 'application/json;charset=UTF-8',
					data 	: JSON.stringify(param),
					success	: function(response) {
						callback(JSON.parse(response).data, blog);
					}
				});
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
//        blogItem.blogItemElement.find('.author-avatar-img').attr('src', blogItem.data.author.headPicPath);
        blogItem.blogItemElement.find('.author-avatar-img').attr('src', "../../../images/weibo.jpg");
        blogItem.blogItemElement.find('.author').text(blogItem.data.weibo_pubsource);
        blogItem.blogItemElement.find('.time').text(blogItem.data.weibo_pubtime);
        blogItem.blogItemElement.find('.media-source').text("来自" + blogItem.data.weiboKind);
        var content = '';
        if(blogItem.data.weibo_content && $.trim(blogItem.data.weibo_content).length > 60){
        	content = blogItem.data.weibo_content.substring(0, 60) + '...';
        }else{
        	content = blogItem.data.weibo_content;
        }
        blogItem.blogItemElement.find('.content').text(content);
        blogItem.blogItemElement.find('.share').text(blogItem.data.retweetnum);
        blogItem.blogItemElement.find('.comments').text(blogItem.data.commentnum);
        blogItem.blogItemElement.find('.praise').text(blogItem.data.favoritenum);
        /*blogItem.blogItemElement.css('opacity', '1');*/
        blogItem.blogItemElement.css('opacity', '1').click(function(){
        				DetailShow.show({
        		            container: $('body'),
        		            data: {
        		            	title: blogItem.data.weibo_pubsource,
        		            	time: blogItem.data.weibo_pubtime,
        		            	content: blogItem.data.weibo_content,
        		            	pics: []
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

