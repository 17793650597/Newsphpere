var Workers = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.workers-container'),
        };
        var workers = {};
        workers.options = $.extend(true, opts_default, opts);
        Workers.loadData(workers, Workers.loadDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        workers.intervalQuery = setInterval(function () {
            Workers.loadData(workers, Workers.loadDataCallBack);
        }, 180000);
        return workers;
    },

    loadDataCallBack: function (workersArray, workers) {
        workers.workersArray = workersArray;
        Workers.displayDatas(workers);
    },

    loadData: function (workers, callback) {
//    	var workersData = [{
//    		weekday: 1,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	}, {
//    		weekday: 2,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	},{
//    		weekday: 3,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	},{
//    		weekday: 4,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	},{
//    		weekday: 5,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	},{
//    		weekday: 6,
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	},{
//    		weekday: 0,//周日为0
//    		workers: [{
//    			name: '曲筱筱',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '任天行',
//    			work: '网络值班',
//    			phone: 15810101010
//    		}, {
//    			name: '李江峰',
//    			work: '后台值班',
//    			phone: 15810101010
//    		}, {
//    			name: '白一达',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨来恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '张磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '武胜',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '盛淘',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '王磊',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '杨曦',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}, {
//    			name: '定欧恩',
//    			work: '技术值班',
//    			phone: 15810101010
//    		}]
//    	}];
//    	if(callback && typeof callback == 'function') {
//			callback(workersData, workers);
//		}
    	var param = {
				"group": { 
					"allOf": [{
						"date": {
							"EQ": [Date.parse(new Date().format('YYYY-MM-DDT00:00:00.000Z'))]
						}
					}]
				},
				"orders": [ 
					{
						"date": "ASC"
					}
				],
				"types": {
					"date": {
						"type": "LONG"
					}
				},
				"start": 0,
				"limit": 0
			};
		CentralProxy.getMonitorWorkerDaysInf(param, function(resp){
			if(!(resp.items.length > 0 && resp.items[0].workers.length > 0)){
				Message.warn("没有今日值班人员数据，请点击右侧设置录入数据后刷新", false);
				return;
			}
			var workersData = resp.items[0].workers;
			if(callback && typeof callback == 'function') {
				callback(workersData, workers);
			}
			
		});
    },

    displayDatas: function (workers) {
        var copyArr = workers.workersArray.deepClone();
        workers.workersPageArray = [];
        var i = 0;
    	while (copyArr.length) {
    		workers.workersPageArray[i] = copyArr.splice(0, 6);
            i++;
        }

        var pageIndex = 0;
        if (pageIndex >= workers.workersPageArray.length) {
            return;
        }
        //TODO 目前只显示当天值班情况
        
        function updateDateArea(){
        	workers.options.container.find('.weekday-container > .day').text(new Date().format('YYYY/MM/DD'));
        	workers.options.container.find('.weekday-container .weekday').text(new Date().format('星期W'));
        }
        updateDateArea();
        
        if (workers.intervalPage) {
            clearInterval(workers.intervalPage);
        }
        var currentPageArray = workers.workersPageArray[pageIndex].deepClone();
        Workers.clearItems(Workers.appendItems, workers, currentPageArray);
        pageIndex++;
        workers.intervalPage = setInterval(function () {
            if (pageIndex >= workers.workersPageArray.length) {
                pageIndex = 0;//从第一页重新开始展示
            }
            currentPageArray = workers.workersPageArray[pageIndex].deepClone();
            Workers.clearItems(Workers.appendItems, workers, currentPageArray);
            pageIndex++;
        }, 19000);//每页切换的时间
    },

    clearItems: function (callback, workers, currentPageArray) {
        if (workers.intervalShowOne) {
            clearInterval(workers.intervalShowOne);
        }
        var $workersItemBodies = workers.options.container.find('.workers-item');
        if ($workersItemBodies.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(workers, currentPageArray);
            }
            return;
        }
        workers.options.container.find('div.workers-list').animate({opacity: '0'}, 'slow', function () {
            $(this).empty();
            if (callback && typeof callback == 'function') {
                callback(workers, currentPageArray);
            }
        });
    },

    /**
     * 用于显示当前页的workersItem
     */
    appendItems: function (workers, currentPageArray) {
        var workersList = workers.options.container.find('div.workers-list');
        workersList.css('opacity', '1');
        Workers.axisYAnim(workers);
        //每隔400ms append一个workersItem
        var currentPageArrayIndex = 0;
        if (currentPageArrayIndex >= currentPageArray.length) {
            clearInterval(workers.intervalAppend);
            showAll();
            return;
        }
        Workers.appendItem(currentPageArray[currentPageArrayIndex], workersList);
        currentPageArrayIndex++;
        workers.intervalAppend = setInterval(function () {
            if (currentPageArrayIndex >= currentPageArray.length) {
                clearInterval(workers.intervalAppend);
                showAll();
                return;
            }
            Workers.appendItem(currentPageArray[currentPageArrayIndex], workersList);
            currentPageArrayIndex++;
        }, 1500);

        function showAll() {
            //每隔6s钟显示一个workersItem详情突出显示
            //第一个单独从interval中提出来，防止第一个也需要经过6000ms才触发的问题
//				workersList.css('bottom', '100%');
            workersList.animate({opacity: '100%'}, 1000, function () {
                var workersListIndex = 0;
                var $workersItems = workers.options.container.find('div.workers-list > div.workers-item');
                showOne();

                workers.intervalShowOne = setInterval(function () {
                    showOne();
                }, 2000);

                function showOne() {
                    if (workersListIndex >= $workersItems.length) {
                        clearInterval(workers.intervalShowOne);
                        $workersItems.removeClass('active');
                        return;
                    }
                    $workersItems.removeClass('active');
                    $($workersItems[workersListIndex]).addClass('active');
                    workersListIndex++;
                }
            });
        }
    },

    /**
     * Y横轴动画弹出
     */
    axisYAnim: function (workers) {
        workers.options.container.find('div.axis-y').height('50%');
    },

    appendItem: function (row, parentEle) {
    	var opts_default = {
    		};

        var workersItem = {};
        workersItem.data = $.extend(true, opts_default, row);
        workersItem.html = '<div class="workers-item add-transition">\
								<div class="author-avatar add-transition"><img class="author-avatar-img" src=""/></div>\
				                <div class="axis-x add-transition">\
				            		<div class="workers-item-body">\
										<div class="worker"></div>\
							        	<div class="phone fa fa-phone"></div>\
							        	<div class="work"></div>\
				            		</div>\
								</div>\
				    		</div>';
        workersItem.workersItemElement = $(workersItem.html);
        var avatar = "http://7xr4g8.com1.z0.glb.clouddn.com/" + (parseInt(900 * Math.random()));
        workersItem.workersItemElement.find('.author-avatar-img').attr('src', avatar);
        workersItem.workersItemElement.find('.worker').text(workersItem.data.name);
        workersItem.workersItemElement.find('.phone').text(workersItem.data.phone);
        workersItem.workersItemElement.find('.work').text(workersItem.data.duty);
        workersItem.workersItemElement.css('opacity', '1');
        parentEle.append(workersItem.workersItemElement);
        return workersItem;
    }
};

$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
    Workers.createNew();
});

