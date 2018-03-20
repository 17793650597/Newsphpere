/**
 * 最新图片页面
 */
var Photos = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.photos-container'),
		};
		var photos = {};
		photos.options = $.extend(true, opts_default, opts);

		Photos.loadData(photos, Photos.loadDataCallBack);
//		每隔3分钟，重新查询一次最新数据并显示
		photos.intervalQuery = setInterval(function() {
			Photos.loadData(photos, Photos.loadDataCallBack);
		}, 180000);
		return photos;
	},
	
	updateCoverflow: function(photos){
		if(!photos.coverContainer){
			var $headerH1 = photos.options.container.find('.photos-header-h1');
			var $photosFooter = photos.options.container.find('.photos-footer');
			var $photosHeader = photos.options.container.find('.photos-header');
			photos.coverContainer = photos.options.container.find('#photos-coverflow').coverflow({
				duration:		'fast',
				index:			0,
				density:		4,
				innerOffset:	100/30,
				innerScale:		.9,
				innerAngle: 	0,
				outerAngle: 	0,
				visible:		'density',
				selectedCss:	{	opacity: 1	},
				outerCss:		{	opacity: .1	},
				change:			function(event, cover, index) {
					photos.currentShowIndex = index;
					var img = $(cover).children().andSelf().filter('img').last();
					var data = img.data('data');
					var $titleHtml = $('<span class="fa fa-play"></span><span class="header-text">'+(data.title || '')+'</span>');
					var $footerContent = $('<p class="photos-content"></p>').text(data.content || '');
					var $time = $('<h2 class="time"></h2>').text(data.time || '');
					$titleHtml.appendTo($headerH1.empty());
					$photosHeader.find('.time').remove();
					$time.appendTo($photosHeader);
					$footerContent.appendTo($photosFooter.empty());
				}
			});
		}else{
			photos.coverContainer.coverflow('refresh');
		}
	},

	loadDataCallBack: function(photosJson, photos) {
		photos.photosJson = photosJson;
		Photos.displayPhotosDatas(photos);
	},

	loadData: function(photos, callback) {
		//TODO 更改接口
		CentralProxy.getPhotosData(function(resp) {
			if(callback && typeof callback == 'function') {
				callback(resp, photos);
			}
		});
	},

	processData: function(photos) {
		if(!photos.photosJson) {
			return;
		}
		var hitList = photos.photosJson.autnresponse.responsedata['autn:hit'];
		photos.allPageData = [];
		for(var i = 0; i < hitList.length; i++) {
			photos.allPageData[photos.allPageData.length] = {
					title: hitList[i]['autn:title'].$,
					author: hitList[i]['autn:content']['DOCUMENT']['CATEGORY_TWO'].$,
					pics: hitList[i]['autn:content']['DOCUMENT']['PATH_IMAGE'],
					time: hitList[i]['autn:content']['DOCUMENT']['DREDATE'].$,
					content: hitList[i]['autn:content']['DOCUMENT']['DRECONTENT']? hitList[i]['autn:content']['DOCUMENT']['DRECONTENT'].$: ''
			};
		}
		
		return photos.allPageData;
	},
	
	clearItems: function (callback, photos, currentPageArray) {
        if(photos.intervalShowOneByOne){
        	clearInterval(photos.intervalShowOneByOne);
        }
        if (photos.intervalShowOne) {
            clearInterval(photos.intervalShowOne);
        }
        var photosList = photos.options.container.find('#photos-coverflow');
        if (photosList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(photos, currentPageArray);
            }
            return;
        }
        photosList.removeClass('active');
        setTimeout(function(){
        	photosList.empty();
        	if (callback && typeof callback == 'function') {
                callback(photos, currentPageArray);
            }
    	}, 200);
    },

	displayPhotosDatas: function(photos) {
		Photos.processData(photos);
		Photos.displayAllPageData(photos);
	},
	
	displayAllPageData: function(photos){
        var currentPageArray = photos.allPageData;
        Photos.clearItems(Photos.appendItems, photos, currentPageArray);
	},
	
	/**
     * 用于显示当前页的blogItem
     */
    appendItems: function (photos, currentPageArray) {
    	var photosListPane = photos.options.container.find('.photos-list-pane'),
		photosList = photos.options.container.find('#photos-coverflow');
        if(currentPageArray.length == 0) {
			photosList.append('<span>暂无数据</span>');
			return;
		}

        function appendPhotos(row, photosList) {
			for(var i in row.pics){
				if(row.pics[i].$ && row.pics[i].$.indexOf('http://')>=0){
					var html = '<img class="cover" src="' + row.pics[i].$ + '"/>';
					var $html = $(html).data('data', row).appendTo(photosList);
				}
			}
		}
		$(currentPageArray).each(function(index, row) {
			appendPhotos(row, photosList);
		});

		Photos.updateCoverflow(photos);
        setTimeout(function(){
        	photosList.addClass('active');
    	}, 200);
		photos.coverContainer.fadeIn('fast', function(){
			startShowOneByOne();
		});

		function startShowOneByOne() {
			var $photosItems = photosList.find('.cover');
			photos.currentShowIndex = 0;
			photos.coverContainer.coverflow('index', photos.currentShowIndex);
			photos.currentShowIndex++;
			photos.intervalShowOneByOne = setInterval(function() {
				if(photos.currentShowIndex >= $photosItems.length) {
					photos.currentShowIndex = 0;
				}
				photos.coverContainer.coverflow('index', photos.currentShowIndex);
				photos.currentShowIndex++;
			}, 3000);
		}
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Photos.createNew();
});
