var Subjects = {
    createNew: function (opts) {
        var opts_default = {
            container: $('.subjects-container'),
            //TODO 接口待调整
            querySite: 'http://data.cloud.jstv.com:31801/service/bd/get/action=query&PrintFields=title,DRECONTENT,dredate,PATH_IMAGE,CATEGORY_TWO&anylanguage=true&OutputEncoding=UTF8&TotalResults=true&Predict=false&sort=date&anylanguage=true&responseformat=json&Start=1&MaxResults=12&fieldtext=MATCH{时政要闻}:CATEGORY_THREE&databasematch=network'
        };
        var subjects = {};
        subjects.options = $.extend(true, opts_default, opts);

        Subjects.updateDate(subjects);
        Subjects.loadTMData(subjects, Subjects.loadTMDataCallBack);
        //每隔3分钟，重新查询一次最新数据并显示
        subjects.intervalQuery = setInterval(function () {
        	Subjects.updateDate(subjects);
            Subjects.loadTMData(subjects, Subjects.loadTMDataCallBack);
        }, 60000);
        return subjects;
    },
    
    updateDate: function (subjects) {
    	var $dateElem = subjects.options.container.find('.cur-month');
    	if($dateElem.length>0){
    		$dateElem.text((new Date()).format('YYYY年M月'));
    	}
    },

    loadTMDataCallBack: function (subjectsArray, subjects) {
        subjects.subjectsArray = subjectsArray.reverse();
        Subjects.displaySubjectsDatas(subjects);
    },

    loadTMData: function (subjects, callback) {
        $.getJSON(subjects.options.querySite, function (resp) {
            var subjectsArray = [];
            if (resp.autnresponse.response.$ != 'SUCCESS' || resp.autnresponse.responsedata['autn:numhits'].$ == 0) {
                return subjectsArray;
            }
            $(resp.autnresponse.responsedata['autn:hit']).each(function (index, row) {
                var title = row['autn:title'].$;
                var mediaSource = row['autn:content'].DOCUMENT.CATEGORY_TWO.$;
                if (mediaSource.length > 24) {
                    mediaSource = mediaSource.substring(0, 24) + '...';
                }
                var time = row['autn:content'].DOCUMENT.DREDATE.$;
                var content = row['autn:content'].DOCUMENT.DRECONTENT.$;
                subjectsArray.push({
                    title: title,
                    mediaSource: mediaSource,
                    time: time,
                    content: content,
                    raw: row
                });
            });
            //接口目前一次只返回6条，暂时先double一下
            subjectsArray = subjectsArray.concat(subjectsArray);
            if (callback && typeof callback == 'function') {
                callback(subjectsArray, subjects);
            }
        });
    },

    displaySubjectsDatas: function (subjects) {
        var subjectsList = subjects.options.container.find('.subjects-list'),
            subjectsArray = subjects.subjectsArray;
        if (subjectsArray.length == 0) {
            subjectsList.append('<span>暂无数据</span>');
            return;
        }
        function makeSubjectsHtml(row) {
            var html = '<div class="item slidedown">\
            	<!-- <div class="anchor"></div> -->\
								<div class="head">\
            						<span class="time"></span>\
            						<i class="fa fa-dot-circle-o" aria-hidden="true"></i>\
            						<i class="fa fa-play" aria-hidden="true"></i>\
									<span class="title"></span>\
								</div>\
							</div>';
            var $html = $(html).data('rowData', row);
            $html.find('.title').text(row.title).attr('title', row.title);
            if(row.time && row.time.trim()!=''){
            	$html.find('.time').text(Utils.StringToDate(row.time).format('M月D日'));
            	$html.find('.fa-dot-circle-o').addClass('blue');
            }
            
            $html.addClass('item-0');
            return $html;
        }

        var currentArrayIndex = 0;
        if (subjects.intervalAppend) {
            clearInterval(subjects.intervalAppend);
        }
        if (subjects.intervalRapidAppend) {
            clearInterval(subjects.intervalRapidAppend);
        }
        subjects.intervalRapidAppend = setInterval(function () {
            if (subjectsList.find('.item').length > 9) {
                clearInterval(subjects.intervalRapidAppend);
                rapidAppendCallback();
                return;
            }
            var html = makeSubjectsHtml(subjectsArray[currentArrayIndex]);
            subjectsList.prepend(html);
            $(subjectsList.find('.item')).each(function (index) {
                var n = Number(index);
                $(this).find('.fa-dot-circle-o').removeClass('yellow');
                $(this).removeClass('item-0 item-1 item-2 item-3 item-4 item-5 item-6 item-7 item-8 item-9 item-10 item-11 item-active').addClass('item-' + n + '');
            });
            currentArrayIndex++;
        }, 600);

        function rapidAppendCallback() {
            $(subjectsList.find('.item')).each(function (index) {
                var n = Number(index);
                $(this).unbind("click").click(function () {
                    showDetail(subjects, $(this));
                });
                if (n === 5) {
                	if($(this).data('rowData').time!=null){
                		$(this).find('.fa-dot-circle-o').addClass('yellow');
                	}
                	$(this).addClass('item-active');
                }
            });

            function showDetail(subjects, eventTarget) {
                if (subjects.intervalAppend) {
                    clearInterval(subjects.intervalAppend);
                }
                if (subjects.intervalQuery) {
                    clearInterval(subjects.intervalQuery);
                }
                subjects.options.container.find('.subjects-list-pane').addClass('hide');
                var row = $(eventTarget).data('rowData');
                var dialog = Dialog.init();

                dialog.on('hidden.bs.modal', function () {
                    dialog.remove();
                    subjects.options.container.find('.subjects-list-pane').removeClass('hide');
                    subjects.intervalAppend = setInterval(funcAppend, 3200);
                    subjects.intervalQuery = setInterval(function () {
                        Subjects.loadTMData(subjects, Subjects.loadTMDataCallBack);
                    }, 60000);
                });

                var detailHtml = '<div class="title-detail-pane">\
                                        <div class="head">\
                                            <span class="title"></span>\
                                            <span class="time"></span>\
                                        </div>\
                                        <div class="content"></div>\
                                </div>';
                var $html = $(detailHtml);
                $html.find('.title').text(row.title).attr('title', row.title);
                $html.find('.time').text(row.time);
                $html.find('.content').text(row.content);
                $html.appendTo(dialog.find('.modal-content'));
            }

            function funcAppend() {
                if (currentArrayIndex >= subjectsArray.length) {
                    currentArrayIndex = 0;
                }
                var html = makeSubjectsHtml(subjectsArray[currentArrayIndex]);
                html.click(function () {
                    showDetail(subjects, $(this));
                });
                subjectsList.prepend(html);
                currentArrayIndex++;
                $(subjectsList.find('.item')).each(function (index) {
                    var n = Number(index);
                    if (n > 10) {
                        $(this).remove();
                    } else {
                    	$(this).find('.fa-dot-circle-o').removeClass('yellow');
                        $(this).removeClass('item-0 item-1 item-2 item-3 item-4 item-5 item-6 item-7 item-8 item-9 item-10 item-11 item-active').addClass('item-' + n + '');
                        if (n == 5) {
                        	if($(this).data('rowData').time!=null){
                        		$(this).find('.fa-dot-circle-o').addClass('yellow');
                        	}
                            $(this).addClass('item-active');
                        }
                    }
                });
            }

            subjects.intervalAppend = setInterval(funcAppend, 3200);
        }
    }
};

var Dialog = {
    init: function () {
        var dlgHtml = '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                            <div class="modal-dialog modal-lg detail-dialog">\
                                <div class="modal-content">\
                                </div>\
                            </div>\
                        </div>';
        var dialog = $(dlgHtml).appendTo('body');
        dialog.modal({
            backdrop: 'true'
        });
        /**
         * 避免页面出现多个模态框
         */
        dialog.on('hidden.bs.modal', function () {
            dialog.remove();
        });
        return dialog;
    }
};

$(function () {
	Utils.setBgCSS();
	Utils.setPageFontSize(1920);
    Subjects.createNew();
});
