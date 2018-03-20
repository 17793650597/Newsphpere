var Bubble = {
		reportArray : [],
		currentPageArray : [],
		intervalPage : null,
		intervalAppend : null,
		intervalShowOne : null,
		createNewBubble : function(opts){
			var opts_default = {
					mediaSource : '',
					titleH1 : '',
					titleH2 : '',
					author: '',
					hasPic: false,
					hasVideo: false,
					imgSrc: 'http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg',
					content: '',
					container: $('.bubbles')
			}
			
			var bubble = {};
			bubble.options = $.extend(true, opts_default, opts);
			bubble.html = '<div class="bubble">\
								<div class="anchors add-transition"></div>\
				                <div class="axis-y">\
									<div class="axis-y-line"></div>\
				            		<div class="bubble-body add-transition">\
										<div class="title">\
											<span class="title-h1">title-h1</span>\
											<span class="title-h2">title-h2</span>\
										</div>\
										<span class="media-source">media</span>\
										<span class="author">author</span>\
										<div class="media-flag">\
											<span class="glyphicon glyphicon-picture"></span>\
											<span class="glyphicon glyphicon-film"></span>\
										</div>\
										<div class="bubble-thumbnail-container"><span></span><img class="bubble-thumbnail" src="http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg"/></div>\
							    		<!--<img class="bubble-thumbnail" src="http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg"/>-->\
				            		</div>\
									<div class="bubble-detail">\
										<span class="title">titletitletitletitle</span>\
										<span class="content">content content content content content content</span>\
									</div>\
								</div>\
				    		</div>';
			bubble.bubbleElement = $(bubble.html);
			bubble.bubbleElement.find('.bubble-thumbnail').attr('src',bubble.options.imgSrc);
			bubble.bubbleElement.find('.media-source').text(bubble.options.mediaSource);
			bubble.bubbleElement.find('.author').text(bubble.options.author);
			bubble.bubbleElement.find('.title-h1').text(bubble.options.titleH1);
			bubble.bubbleElement.find('.title-h2').text(bubble.options.titleH2);
			bubble.bubbleElement.find('.title').text(bubble.options.title);
			bubble.bubbleElement.find('.content').html(bubble.options.content);
			bubble.options.container.append(bubble.bubbleElement);
			var $anchor = bubble.bubbleElement.find('div.anchors');
			var $axisYLine = bubble.bubbleElement.find('div.axis-y-line');
			var $bubbleBody = bubble.bubbleElement.find('div.bubble-body');
			var $content = bubble.bubbleElement.find('.bubble-detail');
			var $thumbnail = bubble.bubbleElement.find('div.bubble-thumbnail');
			$anchor.animate({opacity:'1'},"slow");
			$axisYLine.delay('200').animate({height:'100%'},"300");
			$bubbleBody.delay('300').animate({opacity:'0.7'},"slow",function(){
				$bubbleBody.addClass('rotateX');
			});
			return bubble;
		},
		
		/**
		 * X横轴动画弹出
		 */
		axisXAnim : function(){
			var $axisXElem = $('div.axis-x');
			$axisXElem.animate({width:'80%'});
		},
		
		/**
		 * Y轴动画弹出(多个页面)
		 */
		axisYAnim : function(){
			var copyArr = Bubble.reportArray.slice();
			var ar=[];
		    while(copyArr.length){
		    	ar.push(copyArr.splice(0,5));
		    }
		    
		    var pageIndex = 0;
		    if(pageIndex >= ar.length){
		    	return;
		    }
		    if(Bubble.intervalPage){
				clearInterval(Bubble.intervalPage);
			}
		    Bubble.clearBubbles(Bubble.appendBubbles, ar[pageIndex]);
		    pageIndex++;
		    Bubble.intervalPage = setInterval(function(){
			    if(pageIndex >= ar.length){
			    	pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
			    }
			    Bubble.clearBubbles(Bubble.appendBubbles, ar[pageIndex]);
			    pageIndex++;
			}, 27000);//每页切换的时间
		    
		},
		
		/**
		 * 用于显示当前页的bubble
		 */
		appendBubbles : function (currentPageArray){
			//每隔400ms append一个bubble
			Bubble.currentPageArray = currentPageArray;
			var reportArrayIndex = 0;
			Bubble.intervalAppend = setInterval(function(){
			    if(reportArrayIndex >= Bubble.currentPageArray.length){
			    	clearInterval(Bubble.intervalAppend);
			    	showAll();
			    	return;
			    }
			    var bubble = Bubble.createNewBubble(Bubble.currentPageArray[reportArrayIndex]);
			    reportArrayIndex++;
			}, 400);
			
			function showAll(){
				//每隔6s钟显示一个bubble详情突出显示
				//第一个单独从interval中提出来，防止第一个也需要经过6000ms才触发的问题
				var bubblesIndex = 0;
				var $bubbleBodies = $('div.bubbles > div.bubble div.bubble-body');
				showOne();
				
				Bubble.intervalShowOne = setInterval(function(){
					showOne();
				}, 5000);
				
				function showOne(){
					if(bubblesIndex >= $bubbleBodies.length){
				    	clearInterval(Bubble.intervalShowOne);
				    	$bubbleBodies.parent().find('.bubble-detail').animate({opacity:'0'});
						$bubbleBodies.removeClass('add-scale-transform').removeClass('active-body');
						$bubbleBodies.parent().removeClass('active-axis-y');
					    $bubbleBodies.parent().parent().find('.anchors').removeClass('twinkling').removeClass('add-anchor-scale-transform');
				    	return;
				    }
					$bubbleBodies.parent().find('.bubble-detail').animate({opacity:'0'});
					$bubbleBodies.removeClass('add-scale-transform').removeClass('active-body');
					$bubbleBodies.parent().removeClass('active-axis-y');
					$bubbleBodies.parent().parent().find('.anchors').removeClass('twinkling').removeClass('add-anchor-scale-transform');
				    var $content =$($bubbleBodies[bubblesIndex]).parent().find('.bubble-detail');
				    var $anchor =$($bubbleBodies[bubblesIndex]).parent().parent().find('.anchors');
				    $($bubbleBodies[bubblesIndex]).addClass('active-body').addClass('add-scale-transform');
				    $($bubbleBodies[bubblesIndex]).parent().addClass('active-axis-y');
					$content.animate({opacity:'1'});
					$anchor.addClass('add-anchor-scale-transform').addClass('twinkling');
				    bubblesIndex++;
				}
			}
		},
		
		initData : function (reportArray,callback){
			Bubble.reportArray = [ /*{
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/151/163/2052/133473016.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/27/3/2052/133432092_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/177/253/2051/133430967_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/186/229/2051/133424856_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/151/163/2052/133473016.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/27/3/2052/133432092_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/177/253/2051/133430967_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/186/229/2051/133424856_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/151/163/2052/133473016.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/27/3/2052/133432092_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/177/253/2051/133430967_small.jpg'
			}, {
				imgSrc : 'http://img1.gtimg.com/news/pics/hv1/186/229/2051/133424856_small.jpg'
			}*/];
			
			var param = {
					firstRowNum:0,
					maxResults:20,
					fullText:'',
					searchGroup:{
						operator:'AND',
						attributeConditionList:[{attributeDefID: 'assetcategoryid', comparator : 'EQ', value: 'clue'}, 
						                        {attributeDefID: 'editstatus', comparator : 'EQ', value: '2'},
						                        {attributeDefID: 'deletedflag', comparator: 'EQ', value: 0}/*, 
						                        {attributeDefID: 'platform', comparator : 'EQ', value: '全媒报片'}, 
						                        {attributeDefID: 'site', comparator : 'EQ', value: '报片'}*/]
					},
					orderList: [{attributeDefID: 'modifieddate', desc: true}]	
				};
			CentralProxy.search(param,function(response){
				var code = response.code;
				if(code != CentralProxy.SUCCESS){
					return
				}else{
					var list = response.result.assetList;
					$(list).each(function(index, asset){
						var attributes = asset.attributeList;
						var mediaSource = '',
							titleH1 = '',
							titleH2 = '',
							author = '',
							imgSrc = '',
							content = '';
						$(attributes).each(function(i, attribute){
							var id = attribute.attributeDefID;
							var val = attribute.dataValue;
							if(id=='assetname'){
								titleH1 = val;
							}else if(id=='platform'){
								mediaSource = val;
							}else if(id=='author'){
								author = val;
							}else if(id=='assetname'){
								titleH1 = val;
							}else if(id=='assetname'){
								titleH2 = val;
							}else if(id=='thumbnailfileid'){
								imgSrc = val;
							}else if(id=='content'){
								content = val;
							}
						});

						var report = {
								mediaSource : mediaSource,
								titleH1 : titleH1,
								titleH2 : titleH2,
								author: author,
								hasPic: false,
								hasVideo: false,
								imgSrc: imgSrc,
								content: content,
								container: $('.bubbles')
						};
						Bubble.reportArray.push(report);
					});
					if(reportArray!=null && reportArray.length > 0){
						Bubble.reportArray = reportArray;
					}
					
					if(callback && typeof callback == 'function'){
						callback();
					}
				}
			});
		},
		
		clearBubbles : function (callback, callbackData){
			if(Bubble.intervalShowOne){
				clearInterval(Bubble.intervalShowOne);
			}
			var $bubbleBodies = $('div.bubbles > div.bubble');
			$bubbleBodies.animate({opacity:'0'},'slow',function(){
				this.remove();
			});
			if(callback && typeof callback == 'function'){
				callback(callbackData);
			}
		},
		/**
		 * 每次更新数据时，调用此接口
		 * @param reportArray
		 * @param forUpdating 更新时，取值为true
		 */
		init : function (reportArray, forUpdating){
			Bubble.initData(reportArray,function(){
				if(!forUpdating){
					Bubble.axisXAnim();
				}
				Bubble.axisYAnim();
			});
		},
};

$(function(){
	Utils.setBgCSS();
	Utils.setPageFontSize();
	Bubble.init();
}) ;


