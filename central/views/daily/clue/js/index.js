/**
 * 通联线索与电话爆料的基类
 */
var DailyClue = {
	geoCities: [],
    createNew: function (opts) {
    	var session = JSON.parse(localStorage.getItem('nova.central.session'));
        var opts_default = {
            container: $('.daily-clue-container'),
            whichVersion: true,
            searchParamNova: {
                "firstRowNum": 0,
                "maxResults": 20,
                "fullText": "",
                "searchGroup": {
                    "operator": "AND",
                    "attributeConditionList": [
                        {
                            "attributeDefID": "assetcategoryid",
                            "comparator": "EQ",
                            "value": "clue"
                        },
                        {
                            "attributeDefID": "editstatus",
                            "comparator": "GE",
                            "value": "2"
                        },
                        {
                            "attributeDefID": "deletedflag",
                            "comparator": "EQ",
                            "value": 0
                        },
                        {
							"attributeDefID": "creationdate",
							"comparator": "BETWEEN",
							"value": '',
							"anotherValue":'' 
						}
                    ],
                    "searchGroupList": [{
            			"operator": "OR",
            			"attributeConditionList": [{
            				"attributeDefID": "importlevel",
            				"comparator": "EQ",
            				"value": "1"
            			},{
            				"attributeDefID": "channelpath",
            				"comparator": "EQ",
            				"value": "手机报片"
            			},{
            				"attributeDefID": "channelpath",
            				"comparator": "EQ",
            				"value": "Web报片"
            			}],
            			"searchGroupList": []
            		}]
                },
                "orderList": [
                    {
                        "attributeDefID": "modifieddate",
                        "desc": true
                    }
                ]
            },
        	searchParamNs: {
        		"group": {
        			"allOf": [{
        				"categoryType": {
        					"EQ": ["TYPE_CLUE"]
        				}
        			}, {
        				"extraData.editStatus": {
        					"EQ": ["LIBRARY"]
        				}
        			}, {
        				"deleteFlag": {
        					"EQ": ["Normal"]
        				}
        			},{
        				"createdTime": {
        					"BTW": ["", ""]
        				}
        			}]
        		},
        		"orders": [{
        			"createdTime": "DESC"
        		}],
        		"facets": {
        			"fields": [{
        				"name": "extraData.platform"
        			}, {
        				"name": "extraData.site"
        			}, {
        				"name": "extraData.channel"
        			}, {
        				"name": "extraData.newsDomain"
        			}, {
        				"name": "tags"
        			}]
        		},
        		"start": 0,
        		"limit": 30
        	},
            platform: null,
            channelpath: null,
            site: null
        };
        var dailyClue = {};
        dailyClue.options = $.extend(true, opts_default, opts);
        dailyClue.loadData = function (dailyClue) {
    		//温岭假数据开始
//    		$.ajax({
//    			url: './js/data.json',
//    			method: 'POST',
//    			success: function(resp){
//    				 dailyClue.queryResp = JSON.parse(resp);
//     	            if (dailyClue.loadDataCallBack && typeof dailyClue.loadDataCallBack == 'function') {
//     	                dailyClue.loadDataCallBack(dailyClue);
//     	            }
//    			}
//    		})
    		//温岭假数据结束
    		
    		var isComb = ModuleConfigHelper.getConfigByModuleName('ns.daily.clue').queryUrl.indexOf("comb");//comb
    		if(isComb == -1){
    			dailyClue.options.whichVersion = false;
    		}else if(isComb != -1){
    			dailyClue.options.whichVersion = true;
    		}
    		if(dailyClue.options.whichVersion){
    			var list = dailyClue.options.searchParamNs.group.allOf;
    			for(var i in list){
    	        	if(list[i].createdTime){
    	        		var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T00:00:00Z';
    	        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
    	        		list[i].createdTime.BTW[0] = startTime;
    	        		list[i].createdTime.BTW[1] = endTime;
    	        	}
    	        }
            	CentralProxy.searchComb(dailyClue.options.searchParamNs, function (resp) {
    	            dailyClue.queryResp = JSON.parse(resp);
    	            if (dailyClue.loadDataCallBack && typeof dailyClue.loadDataCallBack == 'function') {
    	                dailyClue.loadDataCallBack(dailyClue);
    	            }
    	        }, null);
    		}else{
    			var perm = dailyClue.options.searchParamNova.searchGroup.searchGroupList[0].attributeConditionList;
            	$(session.joinedGroups).each(function(index, item){
            		perm.push({"attributeDefID": "column_acl",
        				"comparator": "EQ",
        				"value": item.groupId});
            	});
            	
            	var lst = dailyClue.options.searchParamNova.searchGroup.attributeConditionList;
    	        for(var i in lst){
    	        	if(lst[i].attributeDefID == 'creationdate'){
//    	        		var startTime = Utils.parseTime(new Date().getTime()-604800000, 'y-m-d', true) + 'T00:00:00Z';
    	        		var startTime = Utils.parseTime(new Date().getTime()-86400000, 'y-m-d', true) + 'T00:00:00Z';
//    	        		var startTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T00:00:00Z';
    	        		var endTime = Utils.parseTime(new Date().getTime(), 'y-m-d', true) + 'T23:59:59Z';
    	        		lst[i].value = startTime;
    	        		lst[i].anotherValue = endTime;
    	        	}else if(lst[i].attributeDefID == 'platform'){
    	        		lst.splice(i,1);
    	        	}else if(lst[i].attributeDefID == 'channelpath'){
    	        		lst.splice(i,1);
    	        	}else if(lst[i].attributeDefID == 'site'){
    	        		lst.splice(i,1);
    	        	}
    	        }
    	        if(null!==dailyClue.options.platform && $.trim(dailyClue.options.platform)!==''){
        			lst.push({
    					"attributeDefID": "platform",
    					"comparator": "EQ",
    					"value": dailyClue.options.platform,
    				});
    	        }
    	        if(null!==dailyClue.options.site && $.trim(dailyClue.options.site)!==''){
        			lst.push({
    					"attributeDefID": "site",
    					"comparator": "EQ",
    					"value": dailyClue.options.site,
    				});
    	        }
    	        if(null!==dailyClue.options.channelpath && $.trim(dailyClue.options.channelpath)!==''){
        			if('!电话爆料' == dailyClue.options.channelpath){
        				lst.push({
        					"attributeDefID": "channelpath",
        					"comparator": "NE",
        					"value": '电话爆料'
        				});
        			}else{
        				lst.push({
        					"attributeDefID": "channelpath",
        					"comparator": "EQ",
        					"value": dailyClue.options.channelpath
        				});
        			}
    	        }
    	        CentralProxy.search(dailyClue.options.searchParamNova, function (resp) {
    	            dailyClue.queryResp = resp;
    	            if (dailyClue.loadDataCallBack && typeof dailyClue.loadDataCallBack == 'function') {
    	                dailyClue.loadDataCallBack(dailyClue);
    	            }
    	        }, null, true);
    		}
        	
	        
        };
        	
        dailyClue.loadDataCallBack = function (dailyClue) {
            dailyClue.processData(dailyClue);
            dailyClue.displayDatas(dailyClue);
        };
        //TODO 数据处理逻辑待接口确定后修改
        dailyClue.processData = function (dailyClue) {
            dailyClue.processedData = [];
            if(dailyClue.options.whichVersion){
                $(dailyClue.queryResp.items).each(function (index, row) {
                	if(index == 20){   //ns展示前20条数据
                		return false;
                	}
                	dailyClue.processedData.push(row);

                });
            }else{
            	$(dailyClue.queryResp.result.assetList).each(function (index, row) {
                	if(index == 20){   //nova展示前20条数据
                		return false;
                	}
                	var asset = AssetHelper.toAttributeValueMap(row.attributeList);
                	asset.city = (asset.prostation==undefined||asset.prostation==null||$.trim(asset.prostation)=='')?'':asset.prostation;
                	dailyClue.processedData.push(asset);

                });
            }

        };
        dailyClue.displayDatas = function (dailyClue) {
        };
//        dailyClue.loadCombData = function(dailyClue){
//        	CentralProxy.searchComb(dailyClue.options.searchParamNs, function (resp) {
//	            dailyClue.queryResp = JSON.parse(resp);
//	            if (dailyClue.loadDataCallBack && typeof dailyClue.loadDataCallBack == 'function') {
//	                dailyClue.loadDataCallBack(dailyClue);
//	            }
//	        }, null);
//        };
        dailyClue.start = function (interval) {
            interval = interval || 180000;
            dailyClue.loadData(dailyClue);
            //每隔3分钟，重新查询一次最新数据并显示
            dailyClue.intervalQuery = setInterval(function () {
                dailyClue.loadData(dailyClue);
            }, interval);
        };
        return dailyClue;
    }
};

var PhoneClue = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.phone-clue-container'),
            pageInterval: 15000,
            platform: "全媒报片",
            channelpath: "电话爆料"
        };
        var options = $.extend(true, opts_default, opts);
        var phoneClue = DailyClue.createNew(options);
        phoneClue.displayDatas = function (phoneClue) {
            var copyArr = phoneClue.processedData.slice();
            phoneClue.pageArray = [];
            while (copyArr.length) {
                phoneClue.pageArray.push(copyArr.splice(0, 6));
            }

            var pageIndex = 0;
            if (pageIndex >= phoneClue.pageArray.length) {
                return;
            }
            if (phoneClue.intervalPage) {
                clearInterval(phoneClue.intervalPage);
            }
            var currentPageArray = phoneClue.pageArray[pageIndex].slice();
            PhoneClue.clearItems(PhoneClue.appendItems, phoneClue, currentPageArray);
            pageIndex++;
            phoneClue.intervalPage = setInterval(function () {
                if (pageIndex >= phoneClue.pageArray.length) {
                    pageIndex = 0;//从第一页重新开始展示
//			    	clearInterval(Bubble.intervalPage);
//			    	return;
                }
                currentPageArray = phoneClue.pageArray[pageIndex].slice();
                PhoneClue.clearItems(PhoneClue.appendItems, phoneClue, currentPageArray);
                pageIndex++;
            }, phoneClue.options.pageInterval);//每页切换的时间
        };

        return phoneClue;
    },

    clearItems: function (callback, phoneClue, currentPageArray) {
        if (phoneClue.intervalShowOne) {
            clearInterval(phoneClue.intervalShowOne);
        }
        var $phoneClueItemBodies = phoneClue.options.container.find('.phone-clue-item');
        if ($phoneClueItemBodies.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(phoneClue, currentPageArray);
            }
            return;
        }
        phoneClue.options.container.find('.phone-clue-list').animate({bottom: '-100%'}, 'slow', function () {
            $(this).empty();
            if (callback && typeof callback == 'function') {
                callback(phoneClue, currentPageArray);
            }
        });
    },

    /**
     * 用于显示当前页的phoneClueItem
     */
    appendItems: function (phoneClue, currentPageArray) {
        var phoneClueList = phoneClue.options.container.find('.phone-clue-list');

        function showAll() {
            //每隔6s钟显示一个phoneClueItem详情突出显示
            //第一个单独从interval中提出来，防止第一个也需要经过6000ms才触发的问题
//				phoneClueList.css('bottom', '100%');
            phoneClueList.animate({bottom: 0}, 1000, function () {
                var phoneClueListIndex = 0;
                var $phoneClueItems = phoneClue.options.container.find('div.phone-clue-list > div.phone-clue-item');

                function showOne() {
                    if (phoneClueListIndex >= $phoneClueItems.length) {
                        phoneClueListIndex = 0;
                        clearInterval(phoneClue.intervalShowOne);
                        $phoneClueItems.removeClass('active');
                        return;
                    }
                    $phoneClueItems.removeClass('active');
                    $($phoneClueItems[phoneClueListIndex]).addClass('active');
                    $($phoneClueItems[phoneClueListIndex]).find('.phone-clue-item-body').addClass('rotateX');
                    phoneClueListIndex++;
                }

                showOne();
                phoneClue.intervalShowOne = setInterval(function () {
                    showOne();
                }, 2000);
            });
        }

        phoneClueList.css('bottom', '100%');
        //每隔400ms append一个phoneClueItem
        for (var i = 0, max = currentPageArray.length; i < max; i++) {
            PhoneClue.appendItem(currentPageArray[i], phoneClueList);
        }
        showAll();
    },
    appendItem: function (row, parentEle) {
        var opts_default = {
            mediaSource: '',
            author: '',
            time: '',
            content: '',
            /*imgSrc: 'http://img1.gtimg.com/news/pics/hv1/157/254/2052/133496227.jpg'*/
            imgSrc: ''
        };

        var phoneClueItem = {};
        phoneClueItem.data = $.extend(true, opts_default, row);
        phoneClueItem.html = '<div class="phone-clue-item add-transition">\
								<div class="author-avatar add-transition glyphicon glyphicon-earphone"></div>\
				                <div class="axis-x add-transition">\
				            		<div class="phone-clue-item-body">\
        	                            <div class="author"></div>\
										<div class="media-inf">\
											<span class="time"></span>\
											<span class="media-source"></span>\
										</div>\
										<div class="content"></div>\
				            		</div>\
								</div>\
				    		</div>';
        var asset = phoneClueItem.data;
        phoneClueItem.phoneClueItemElement = $(phoneClueItem.html);
        phoneClueItem.phoneClueItemElement.find('.author').text(asset.rep_providers?asset.rep_providers:asset.authorName);
        phoneClueItem.phoneClueItemElement.find('.time').text(asset.submittime.substring(0,19));
        phoneClueItem.phoneClueItemElement.find('.media-source').text(asset.rep_providers?asset.rep_providers:asset.authorName);
        var content = '';
        if(asset.description && $.trim(asset.description).length>0){
        	content = asset.assetname + "：" + asset.description.substring(0, 25) + (asset.description.length>25?'...':'');
        }else{
        	content = asset.assetname;
        }
        phoneClueItem.phoneClueItemElement.find('.content').text(content);
        /*phoneClueItem.phoneClueItemElement.css('opacity', '1');*/
        phoneClueItem.phoneClueItemElement.css('opacity', '1').click(function(){
        				DetailShow.show({
        		            container: $('body'),
        		            data: {
        		            	title: asset.assetname,
        		            	time: asset.submittime.substring(0,19),
        		            	content: asset.description,
        		            	pics: [asset.thumbnailfileid]
        		            }});
        			});
        parentEle.append(phoneClueItem.phoneClueItemElement);
        return phoneClueItem;
    }
};

var TonglianClue = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.tonglian-clue-container'),
            pageInterval: 16000,
//            platform: "自建线索",
//            site:'线索'
//            channelpath: "!电话爆料"
        };
        var options = $.extend(true, opts_default, opts);
        var tonglianClue = DailyClue.createNew(options);
        tonglianClue.displayDatas = function (tonglianClue) {
            TonglianClue.createMap(tonglianClue, TonglianClue.displayClueList);
        };

        return tonglianClue;
    },

    displayClueList: function (tonglianClue) {
        var copyArr = tonglianClue.processedData.slice();
        console.log(tonglianClue);
        tonglianClue.pageArray = [];
        while (copyArr.length) {
            tonglianClue.pageArray.push(copyArr.splice(0, 3));
        }
        var submittime = Utils.parseTime(new Date().getTime(), 'y-m-d h:i:s', true)
        if(tonglianClue.pageArray == ""){
        	 tonglianClue.pageArray.push([{
        		 assetname: "暂无数据",
        		 submittime: submittime
        	 }]);
        }
        var pageIndex = 0;
        if (pageIndex >= tonglianClue.pageArray.length) {
            return;
        }
        if (tonglianClue.intervalPage) {
            clearInterval(tonglianClue.intervalPage);
        }
        var currentPageArray = tonglianClue.pageArray[pageIndex].slice();
        TonglianClue.clearItems(TonglianClue.appendItems, tonglianClue, currentPageArray);
        pageIndex++;
        tonglianClue.intervalPage = setInterval(function () {
            if (pageIndex >= tonglianClue.pageArray.length) {
                pageIndex = 0;//从第一页重新开始展示
            }
            currentPageArray = tonglianClue.pageArray[pageIndex].slice();
            TonglianClue.clearItems(TonglianClue.appendItems, tonglianClue, currentPageArray);
            pageIndex++;
        }, tonglianClue.options.pageInterval);//每页切换的时间
    },

    getCityPos: function (cityName) {
    	var cities = [{
    		name: "湖北台",
    		value: "114.3316,30.559878"
    	}, {
    		name: "黄冈台",
    		value: "114.921551,30.480784"
    	}, {
    		name: "鄂州台",
    		value: "114.881172,30.37716"
    	}, {
    		name: "黄石台",
    		value: "115.04698,30.200531"
    	}];

        var res = [];
        for (var i = 0; i < cities.length; i++) {
            if (cities[i].name == cityName) {
                res.push({
                    name: cities[i].name,
                    value: cities[i].value.split(',')
                });
            }
        }
//        if(res.length == 0){
//        	res.push({
//        		name: "南京台",
//                value: "118.778074,32.057236".split(',')
//            });
//        }
        return res;
    },

    changeActiveArea: function (tonglianClue, city) {
        var cityPos = TonglianClue.getCityPos(city);
        if (tonglianClue.mapChart && tonglianClue.mapChartOption) {
            tonglianClue.mapChartOption.series[0].data = cityPos;
            tonglianClue.mapChart.setOption(tonglianClue.mapChartOption);
        }
    },

    addTonglianClueCity: function (tonglianClue, city) {
        var cityPos = TonglianClue.getCityPos(city);
        if (tonglianClue.mapChart && tonglianClue.mapChartOption && cityPos.length != 0) {
            if (tonglianClue.mapChartOption.series[1].data.indexOf(cityPos[0]) < 0) {
                tonglianClue.mapChartOption.series[1].data.push(cityPos[0]);
                tonglianClue.mapChart.setOption(tonglianClue.mapChartOption);
            }
        }
    },

    clearAllMapCity: function (tonglianClue) {
        if (tonglianClue.mapChart && tonglianClue.mapChartOption) {
            tonglianClue.mapChartOption.series[1].data = [];
            tonglianClue.mapChartOption.series[0].data = [];
            tonglianClue.mapChart.setOption(tonglianClue.mapChartOption);
            TonglianClue.changeActiveArea(tonglianClue, null);
        }
    },

    createMap: function (tonglianClue, callback) {
        var mapChart, bgMapChart;
        var conf = ModuleConfigHelper.getConfigByModuleName('ns.daily.clue');
        var province = conf ? conf.province : 'beijing';
        var mapPane = tonglianClue.options.container.find('.tonglian-clue-map-container');
        mapPane.removeClass('active');

        if (!tonglianClue.mapChart || !tonglianClue.bgMapChart) {
            var mapChartDom = tonglianClue.options.container.find('.tonglian-clue-map')[0];
            var bgMapChartDom = tonglianClue.options.container.find('.tonglian-clue-bg-map')[0];
            mapChart = echarts.init(mapChartDom);
            bgMapChart = echarts.init(bgMapChartDom);
            tonglianClue.mapChart = mapChart;
            tonglianClue.bgMapChart = bgMapChart;
        } else {
            mapChart = tonglianClue.mapChart;
            bgMapChart = tonglianClue.bgMapChart;
        }
        if (!tonglianClue.mapChartOption) {
        	
        	var skin = Utils.getSkin();
        	var mapBorderColor = 'rgb(221,67,67)',
	        	mapShadowColor = 'rgba(0, 0, 0, 0.5)',
	        	mapAreaColor = 'rgba(221, 67, 67, 0.70)',
	        	mapColor = '#f4e925',
	        	mapShadowColor = '#333',
	        	bgMapAreaColor = 'rgba(221,67,67,0.30)';
        	
        	if(skin === 'blue'){
        		mapBorderColor = 'rgb(0,176,225)';
	        	mapShadowColor = 'rgba(0, 0, 0, 0.5)';
	        	mapAreaColor = 'rgba(0,176,225, 0.70)';
	        	mapColor = '#00fffb';
	        	mapShadowColor = '#008394';
	        	bgMapAreaColor = 'rgba(0,65,95,0.30)';
        	}
        	
        	if(skin === 'lightblue'){
        		mapBorderColor = 'rgb(0,176,225)';
	        	mapShadowColor = 'rgba(0,176,225, 0.70, 0.5)';
	        	mapAreaColor = 'rgba(0,176,225, 0.70)';
	        	mapColor = '#00fffb';
	        	mapShadowColor = '#008394';
	        	bgMapAreaColor = 'rgba(14,60,125,1)';
        	}
        	
        	
            tonglianClue.mapChartOption = {
                backgroundColor: 'transparent',
                title: {
                    show: false
                },
                tooltip: {
                    trigger: 'item'
                },
                geo: {
                    map: province,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: 'transparent',
                            borderColor: mapBorderColor,
                            borderWidth: 2,
                            shadowColor: mapShadowColor,
                            shadowBlur: 10,
                            shadowOffsetX: 1,
                            shadowOffsetY: 5

                        },
                        emphasis: {
                            areaColor: mapAreaColor
                        }
                    }
                },
                series: [
                    {
                        name: 'activeTonglianClue',
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        data: [],
                        symbolSize: 15,
                        showEffectOn: 'render',
                        rippleEffect: {
                            period: 6,
                            scale: 8,
                            brushType: 'fill'
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: mapColor,
                                shadowBlur: 10,
                                shadowColor: mapShadowColor
                            }
                        },
                        zlevel: 1
                    },
                    {
                        name: 'allTonglianClue',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: [],
                        symbolSize: 10,
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: mapColor
                            }
                        }
                    }
                ]
            };

            tonglianClue.bgMapChartOption = {
                backgroundColor: 'transparent',
                title: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                geo: {
                    map: province,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: bgMapAreaColor,
                            borderColor: 'transparent'
                        }
                    }
                },
                series: []
            };
        }

        $.get('../../../3rd/echarts/map/' + province + '.json', function (geoJson) {
            echarts.registerMap(province, geoJson);
            bgMapChart.setOption(tonglianClue.bgMapChartOption);
            mapChart.setOption(tonglianClue.mapChartOption);
            mapPane.addClass('active');
            if (callback && typeof callback === 'function') {
                callback(tonglianClue);
            }
            setTimeout(function () {
                window.onresize = function () {
                    tonglianClue.mapChart.resize();
                    tonglianClue.bgMapChart.resize();
                }
            }, 1000)
        });
        return tonglianClue;
    },

    clearItems: function (callback, tonglianClue, currentPageArray) {
        var $tonglianClueItems = tonglianClue.options.container.find('.tonglian-clue-item');
        var $tonglianClueList = tonglianClue.options.container.find('.tonglian-clue-list');

        if (tonglianClue.intervalShowOne) {
            clearInterval(tonglianClue.intervalShowOne);
        }
        TonglianClue.clearAllMapCity(tonglianClue);
        if ($tonglianClueItems.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(tonglianClue, currentPageArray);
            }
            return;
        }
        $tonglianClueList.animate({bottom: '-100%'}, 'slow', function () {
            $(this).empty();
            if (callback && typeof callback == 'function') {
                callback(tonglianClue, currentPageArray);
            }
        });
    },

    /**
     * 显示当前页的tonglianClueItem
     */
    appendItems: function (tonglianClue, currentPageArray) {
        var tonglianClueList = tonglianClue.options.container.find('.tonglian-clue-list');

        function showAll() {
            //每隔6s钟显示一个tonglianClueItem详情突出显示
            //第一个单独从interval中提出来，防止第一个也需要经过6000ms才触发的问题
//				tonglianClueList.css('bottom', '100%');
            tonglianClueList.animate({bottom: 0}, 1000, function () {
                var tonglianClueListIndex = 0;
                var $tonglianClueItems = tonglianClue.options.container.find('div.tonglian-clue-list > div.tonglian-clue-item');

                function showOne() {
                    if (tonglianClueListIndex >= $tonglianClueItems.length) {
                        tonglianClueListIndex = 0;
                        clearInterval(tonglianClue.intervalShowOne);
                        $tonglianClueItems.removeClass('active');
                        return;
                    }
                    //TODO yoson
                    $tonglianClueItems.removeClass('active');
                    var $item = $($tonglianClueItems[tonglianClueListIndex]);
                    var city = $item.data('tonglianClueData').city;
                    $item.addClass('active')/*.find('.tonglian-clue-item-body').addClass('rotateX')*/;
                    TonglianClue.changeActiveArea(tonglianClue, city);
                    tonglianClueListIndex++;
                }

                showOne();
                tonglianClue.intervalShowOne = setInterval(function () {
                    showOne();
                }, 5000);
            });
        }

        tonglianClueList.css('bottom', '100%');
        //每隔400ms append一个tonglianClueItem
        for (var i = 0, max = currentPageArray.length; i < max; i++) {
            TonglianClue.appendItem(currentPageArray[i], tonglianClue);
        }
        showAll();
    },
    appendItem: function (row, tonglianClue) {
        var opts_default = {
            mediaSource: '',
            author: '',
            title: '',
            time: '',
            content: '',
            city: '',
        };

        var tonglianClueItem = {};
        tonglianClueItem.data = $.extend(true, opts_default, row);
        tonglianClueItem.html = '<div class="tonglian-clue-item add-transition-1s">\
                                    <div class="head add-transition">\
                                        <div class="up-line add-transition-1s">\
                                            <span class="time"></span>\
        									<span class="media-source">本台记者</span>\
                                            <div class="media-flag">\
                                                <span class="glyphicon glyphicon-picture"></span>\
                                                <span class="glyphicon glyphicon-film"></span>\
                                            </div>\
                                        </div>\
        								<div class="axis-x-line"></div>\
                                        <div class="middle-line add-transition-1s">\
                                            <span class="author"></span>\
                                            <div class="title"></div>\
                                        </div>\
                                    </div>\
                                    <div class="body add-transition-1s">\
                                        <span class="media-flag">\
                                            <span class="glyphicon glyphicon-picture"></span>\
                                            <span class="glyphicon glyphicon-film"></span>\
                                        </span>\
                                        <span class="content"></span>\
                                    </div>\
                                </div>';
        console.log(tonglianClueItem);
        tonglianClueItem.tonglianClueItemElement = $(tonglianClueItem.html);
        tonglianClueItem.tonglianClueItemElement.find('.author').text(tonglianClueItem.data.authorName || tonglianClueItem.data.author);
//        tonglianClueItem.tonglianClueItemElement.find('.time').text((tonglianClueItem.data.createdTime && tonglianClueItem.data.createdTime.formatDate('yyyy-MM-dd hh:mm:ss')) || 
//        															tonglianClueItem.data.submittime.substring(0,19));
		//随机时间
		var timeNew = Utils.parseTime(new Date().getTime(), 'y-m-d', true);
		var h = new Date().getHours() - Math.ceil(10*Math.random());
		h = h <= 0 ? Math.abs(h) : h;
		h= h >= 10 ? h : ('0' + h);
		var i = new Date().getMinutes() - Math.ceil(60*Math.random());
		i = i <= 0 ? Math.abs(i) : i; 
		i = i >= 10 ? i : ('0' + i);
		var s = Utils.parseTime(new Date().getTime(), 's', true);
		timeNew = timeNew + " " + h + ":" + i + ":" + s;
		tonglianClueItem.tonglianClueItemElement.find('.time').text(timeNew);
        
        
//        function getSiteClass(site){
//        	var arr = {
//            		'cctv':'#00fffb',
//            		'新华社':'#ffb300',
//            		'中新社':'#FF2222',
//            		'地方台':'#00FF7D',
//            		'媒资':'#3DCAFF',
//            		'上载':'#D7B2FF',
//            		'其他':'#FF00EF' //DAFF00
//            	};
//        	for(var i in arr){
//        		if(i == site){
//        			return arr[i];
//        		}
//        	}
//        	return arr['其他'];
//        }
        function getImportantLevelClass(importantLevel){
        	var arr = ['#FF2222',
        	           '#00FF7D',
        	           '#DAFF00',
        	           '#FF00EF',
        	           '#ffb300'
        	           ];
        	for(var i in arr){
        		if(i == importantLevel){
        			return arr[i];
        		}
        	}
        	return arr[0];
        }
        var impLevel = 1;
        if(tonglianClue.options.whichVersion){
            tonglianClueItem.tonglianClueItemElement.find('.title').text(tonglianClueItem.data.name);
//            tonglianClueItem.tonglianClueItemElement.find('.media-source').text(tonglianClueItem.data.extraData.site).css('color', getImportantLevelClass(impLevel-1));
            tonglianClueItem.tonglianClueItemElement.find('.media-source').text(tonglianClueItem.data.createdBy).css('color', getImportantLevelClass(impLevel-1));
            tonglianClueItem.tonglianClueItemElement.find('.content').text(Utils.escapeHtml(tonglianClueItem.data.extraData.content || '').substring(0, 100) + '...');
            if(tonglianClueItem.data.extraData.hasPicture == 'Y'){
            	tonglianClueItem.tonglianClueItemElement.find('.media-flag > .glyphicon-picture').remove();
            }
        }else{
            tonglianClueItem.tonglianClueItemElement.find('.title').text(tonglianClueItem.data.assetname);
            tonglianClueItem.tonglianClueItemElement.find('.media-source').text(tonglianClueItem.data.site).css('color', getImportantLevelClass(impLevel-1));
            tonglianClueItem.tonglianClueItemElement.find('.content').text(Utils.escapeHtml(tonglianClueItem.data.content).substring(0, 100) + '...');
        	if(!tonglianClueItem.data.videoflag){
            	tonglianClueItem.tonglianClueItemElement.find('.media-flag > .glyphicon-film').remove();
            }
        }
        if(!tonglianClueItem.data.picflag){
        	tonglianClueItem.tonglianClueItemElement.find('.media-flag > .glyphicon-picture').remove();
        }
        tonglianClueItem.tonglianClueItemElement.css('opacity', '1');
        /*tonglianClueItem.tonglianClueItemElement.data('tonglianClueData', tonglianClueItem.data);*/
        tonglianClueItem.tonglianClueItemElement.data('tonglianClueData', tonglianClueItem.data).click(function(){
			DetailShow.show({
	            container: $('body'),
	            data: {
	            	title: tonglianClueItem.data.name || tonglianClueItem.data.assetname,
	            	time: (tonglianClueItem.data.extraData && tonglianClueItem.data.extraData.publishTime.substring(0,19)) || tonglianClueItem.data.submittime.substring(0,19),
	            	content: Utils.escapeHtml(tonglianClueItem.data.extraData.content),
	            	pics: [tonglianClueItem.data.thumbnailfileid]
	            }});
        });
        var tonglianClueList = tonglianClue.options.container.find('.tonglian-clue-list');
        tonglianClueList.append(tonglianClueItem.tonglianClueItemElement);
        TonglianClue.addTonglianClueCity(tonglianClue, tonglianClueItem.data.city);

        var $axisXLine = tonglianClueItem.tonglianClueItemElement.find('div.axis-x-line');
        var $head = tonglianClueItem.tonglianClueItemElement.find('div.head');
        $axisXLine.addClass("axis-x-line-long", 200, function () {
            $head.addClass("right0", 800);
        });
        return tonglianClueItem;
    }
};


$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
// var phoneClue = PhoneClue.createNew();
    var tonglianClue = TonglianClue.createNew();
//    phoneClue.start(50000);
    tonglianClue.start(60000);
});


