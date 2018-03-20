/**
 * 报警事件页面
 */
var Notice = {
	createNew: function(opts) {
		var opts_default = {
			container: $('.notice-container'),
		};
		var notice = {};
		notice.options = $.extend(true, opts_default, opts);

		Notice.loadData(notice, Notice.loadDataCallBack);
		//每隔3分钟，重新查询一次最新数据并显示
		notice.intervalQuery = setInterval(function() {
			Notice.loadData(notice, Notice.loadDataCallBack);
		}, 180000);
		return notice;
	},

	loadDataCallBack: function(noticeJson, notice) {
		notice.noticeJson = noticeJson;
		Notice.displayNoticeDatas(notice);
	},

	loadData: function(notice, callback) {
//		var conf = ModuleConfigHelper.getConfigByModuleName('ns.monitor.notice');
//		var url = conf.queryUrl;
//		url += "?platformId=openstackqc-syy&timeZone=" + conf.interval;
//		CentralProxy.getMonitorNotice(url, function(resp) {
//			console.log(resp);
//			if(callback && typeof callback == 'function') {
//				callback(resp, notice);
//			}
//		});
		var resp = {
				"status": true,
				"errorMsg": null,
				"data": [{
					"content": "主机IP:10.1.69.100\r\n告警等级:Average\r\n告警主机:10.1.69.100\r\n告警时间:2017.11.23 10:43:30\r\n告警信息: Zabbix agent on 10.1.69.100 is unreachable for 5 minutes\r\n问题详情:Agent ping:Up (1)\r\n事件ID:2491769\r\n当前状态:OK:Up (1)",
					"createTime": 1511405396327,
					"title": "【恢复】: Zabbix agent on 10.1.69.100 is unreachable for 5 minutes",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.69.100\r\n告警等级:Average\r\n告警主机:10.1.69.100\r\n告警时间:2017.11.23 10:43:30\r\n告警信息: Zabbix agent on 10.1.69.100 is unreachable for 5 minutes\r\n问题详情:Agent ping:Up (1)\r\n事件ID:2491769\r\n当前状态:PROBLEM:Up (1)",
					"createTime": 1511405366270,
					"title": "【报警】: Zabbix agent on 10.1.69.100 is unreachable for 5 minutes",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.61.21\r\n告警等级:Information\r\n告警主机:10.1.61.21\r\n告警时间:2017.11.22 16:56:36\r\n告警信息: 10.1.61.21 has just been restarted\r\n问题详情:System uptime:00:21:34\r\n事件ID:2488693\r\n当前状态:OK:00:21:34",
					"createTime": 1511341966934,
					"title": "【恢复】: 10.1.61.21 has just been restarted",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.61.21\r\n告警等级:Information\r\n告警主机:10.1.61.21\r\n告警时间:2017.11.22 16:56:36\r\n告警信息: 10.1.61.21 has just been restarted\r\n问题详情:System uptime:00:11:33\r\n事件ID:2488693\r\n当前状态:PROBLEM:00:11:33",
					"createTime": 1511341366803,
					"title": "【报警】: 10.1.61.21 has just been restarted",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.69.207\r\n告警等级:Warning\r\n告警主机:10.1.69.207\r\n告警时间:2017.11.22 14:14:04\r\n告警信息: /etc/passwd has been changed on 10.1.69.207\r\n问题详情:Checksum of /etc/passwd:2938539635\r\n事件ID:2488202\r\n当前状态:OK:2938539635",
					"createTime": 1511335215877,
					"title": "【恢复】: /etc/passwd has been changed on 10.1.69.207",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.69.207\r\n告警等级:Warning\r\n告警主机:10.1.69.207\r\n告警时间:2017.11.22 14:14:04\r\n告警信息: /etc/passwd has been changed on 10.1.69.207\r\n问题详情:Checksum of /etc/passwd:2938539635\r\n事件ID:2488202\r\n当前状态:PROBLEM:2938539635",
					"createTime": 1511331615241,
					"title": "【报警】: /etc/passwd has been changed on 10.1.69.207",
					"source": "openstackqc-syy",
					"type": "2"
				}, {
					"content": "主机IP:10.1.69.207\r\n告警等级:Warning\r\n告警主机:10.1.69.207\r\n告警时间:2017.11.13 15:14:04\r\n告警信息: /etc/passwd has been changed on 10.1.69.207\r\n问题详情:Checksum of /etc/passwd:734751199\r\n事件ID:2451749\r\n当前状态:OK:734751199",
					"createTime": 1510561193648,
					"title": "【恢复】: /etc/passwd has been changed on 10.1.69.207",
					"source": "openstackqc-syy",
					"type": "2"
				}]
			};
			if(callback && typeof callback == 'function') {
				callback(resp, notice);
			}
	},

	processData: function(notice) {
		if(!notice.noticeJson) {
			return;
		}
		var noticeList = notice.noticeJson.data;
		notice.allPageData = [];
		for(var i = 0; i < noticeList.length; i++) {
			notice.allPageData[notice.allPageData.length] = {
					title: noticeList[i].title||'',
					author: noticeList[i].source||'',
					time: Utils.parseTime(noticeList[i].createTime, 'y-m-d h:i:s', true)||'',
//					content: noticeList[i].content||'',
					contentJson: [],
					type:noticeList[i].type||'',
			};
			var contentSplit = noticeList[i].content.split('\r\n');
			for(var j = 0; j < contentSplit.length; j++){
				var index = contentSplit[j].indexOf(":");
				var key =contentSplit[j].substr(0,index);
				var val = contentSplit[j].substr(index);
				var obj = {};
				obj[key] = val;
				notice.allPageData[i].contentJson.push(obj);
			}
		};
		return notice.allPageData;
	},
	
	clearItems: function (callback, notice, currentPageArray) {
        if(notice.intervalShowOneByOne){
        	clearInterval(notice.intervalShowOneByOne);
        }
//        if (notice.intervalPage) {
//            clearInterval(notice.intervalPage);
//        }
        if (notice.intervalShowOne) {
            clearInterval(notice.intervalShowOne);
        }
        var noticeList = notice.options.container.find('.notice-list');
        if (noticeList.length == 0) {
            if (callback && typeof callback == 'function') {
                callback(notice, currentPageArray);
            }
            return;
        }
        notice.options.container.find('.notice-list-pane').removeClass('active');
        setTimeout(function(){
    		notice.options.container.find('.notice-list').empty();
            if (callback && typeof callback == 'function') {
                callback(notice, currentPageArray);
            }
    	}, 1000);
    },

	displayNoticeDatas: function(notice) {
		Notice.processData(notice);
		Notice.displayAllPageData(notice);
	},
	
	displayAllPageData: function(notice){
		if (notice.intervalPage) {
            clearInterval(notice.intervalPage);
        }
		var copyArr = notice.allPageData.slice();
		notice.noticePageArray = [];
        while (copyArr.length) {
        	notice.noticePageArray.push(copyArr.splice(0, 10));
        }
        notice.pageIndex = 0;
        if (notice.pageIndex >= notice.noticePageArray.length) {
            return;
        }
        var currentPageArray = notice.noticePageArray[notice.pageIndex].slice();
        Notice.clearItems(Notice.appendItems, notice, currentPageArray);
        notice.pageIndex++;
        notice.intervalPage = setInterval(function () {
            if (notice.pageIndex >= notice.noticePageArray.length) {
                notice.pageIndex = 0;
            }
            currentPageArray = notice.noticePageArray[notice.pageIndex].slice();
            Notice.clearItems(Notice.appendItems, notice, currentPageArray);
            notice.pageIndex++;
        }, 30500);//每页切换的时间
	},
	
	/**
     * 用于显示当前页的blogItem
     */
    appendItems: function (notice, currentPageArray) {
    	var noticeListPane = notice.options.container.find('.notice-list-pane'),
		noticeList = notice.options.container.find('.notice-list');
		//显示方面的逻辑
        if(currentPageArray.length == 0) {
			noticeList.append('<span>暂无数据</span>');
			return;
		}

		//根据栏目获取时间倒序排列
		$(currentPageArray).each(function(index, row) {
			var html = makeNoticeHtml(row);
			noticeList.append(html);
		});

		noticeListPane.addClass('active', 1000, function() {
			startShowOneByOne();
		});

		function makeNoticeHtml(row) {
			var html = '<div class="item">\
								<div class="item-head">\
									<span class="notice-type-container"><i class="fa fa-bell" aria-hidden="true"></i><span class="notice-type">警告事件</span></span>\
									<span class="notice-platform"></span>\
									<span class="time"></span>\
									<span class="notice-title"></span>\
								</div>\
								<div class="item-body">\
									<span class="arrow-left glyphicon glyphicon-play"></span>\
									<div class="content">\
										<div class="line">\
											<div class="line11 bg1">主机IP：<span class="host-ip">10.1.69.207</span></div>\
											<div class="line11 bg2">告警等级：<span class="warn-level">Warning</span></div>\
											<div class="line11 bg3">告警主机：<span class="warn-host">10.1.69.207</span></div>\
											<div class="line14 bg4">告警时间：<span class="warn-time">2017-11-13 15:14:04</span></div>\
										</div>\
										<div class="line">\
											<div class="line21 bg5">告警信息：<span class="warn-inf">Zabbix agent on 10.1.69.100 is unreachable for 5 minutes</span></div>\
											<div class="line22 bg6">事件ID：<span class="thing-id">2141789</span></div>\
										</div>\
										<div class="line">\
											<div class="line21 bg7">问题详情：<span class="detail">Agent ping:Up </span></div>\
											<div class="line22 bg8">当前状态：<span class="state">OK:Up (1)</span></div>\
										</div>\
									</div>\
								</div>\
							</div>';
			var $html = $(html);
			$html.find('.notice-platform').text(row.author);
			$html.find('.time').text(row.time);
			$html.find('.notice-title').text(row.title);
			$html.find('.content').text(row.content);
			return $html;
		}

		function startShowOneByOne() {
			var $noticeItems = noticeList.find('.item');
			var currentArrayIndex = 0;
			$($noticeItems[currentArrayIndex]).addClass('active', 300);
			currentArrayIndex++;
			notice.intervalShowOneByOne = setInterval(function() {
				if(currentArrayIndex >= $noticeItems.length) {
//					currentArrayIndex = 0;
					clearInterval(notice.intervalShowOneByOne);
					
					if (notice.pageIndex >= notice.noticePageArray.length) {
						Notice.displayAllPageData(notice);
						return;
		            }
		            var currentPageArray = notice.noticePageArray[notice.pageIndex].slice();
		            Notice.clearItems(Notice.appendItems, notice, currentPageArray);
		            notice.pageIndex++;
					return;
				}
				if(noticeList.find('.item.active').length > 0) {
					var tempIndex = currentArrayIndex;
					noticeList.find('.item.active').removeClass('active', 100, function() {
						$($noticeItems[tempIndex]).addClass('active', 200);
					});
				} else {
					$($noticeItems[currentArrayIndex]).addClass('active', 200);
				}
				currentArrayIndex++;
			}, 5000);
		}
    }
};

$(function() {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
	Notice.createNew();
});
