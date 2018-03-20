var MonitorWorkerDayConfig = {
		_renderMonitorWorkerDayConfigRow : function(item, row){
			var div = $('<div class="form-group">\
							<div class="checkbox"> <label><input type="checkbox" name="selected" ></label> </div>\
							<div class="name"> <input type="text" class="form-control" name="name" placeholder="值班人姓名，必填"></div>\
							<div class="phone"> <input type="text" class="form-control" name="phone" placeholder="电话"></div>\
							<div class="duty"> <input type="text" name="duty" class="form-control" placeholder="岗位"></div>\
						</div>');
			div.find('[name="name"]').val(item.name);
			div.find('[name="phone"]').val(item.phone);
			div.find('[name="duty"]').val(item.duty);
			
			div.data('old-attribute', item).appendTo(row);
		},
		loadMonitorWorkerDayConfigs: function(refresh){
			var menu = $('#nv_left').find('.menu.navi');
			if(refresh){
				menu.find('li.active>a')[0].click();
			}else{
				menu.empty();
				var param = {
						"group": { 
							"allOf": [{
								"date": {
									"GE": [Date.parse(new Date().format('YYYY-MM-DDT00:00:00.000Z'))]
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
					if(!resp.totalCount>0){
						return;
					}
					var workers = resp.items;
					for (var i in workers) {
						MonitorWorkerDayConfig.renderNavButton(workers[i], menu);
					}
					menu.find('li>a')[0].click();
				});
				
			}
		},
		renderNavButton: function (worker, menu){
			var html = '<li>\
							<i class="opr-del-btn hidden fa fa-minus-circle"></i>\
							<a class="nav-btn" href="javascript:;"><span class="left_menu_title">'+ new Date(parseInt(worker.date)).format('M月D日') +'</span></a>\
						</li>';
			var $html = $(html).data('data', worker).appendTo(menu);
			$html.find('.nav-btn').click(function(){
				$(this).parent().addClass('active').siblings().removeClass('active');
				MonitorWorkerDayConfig.renderContent(worker);
			});
			$html.find('.opr-del-btn').click(function(){
				var $that = $(this);
				CentralProxy.delMonitorWorkerDaysInf(worker, function(){
					Message.success('删除成功');
					$that.parent().remove();
					if(menu.find('li>a').length>0){
						menu.find('li>a')[0].click();
					}
				});
			});
		},
		renderContent: function(worker) {
			$('.config-field').empty();
			$('#nv_content').data('data',worker);
			var index = 0;
			for(var i in worker.workers){
				+function(){
					var row = $('<div class="row">').appendTo('.config-field');
					if(index % 1 > 0){
						row.addClass('even');
					}
					index++;
					MonitorWorkerDayConfig._renderMonitorWorkerDayConfigRow(worker.workers[i], row);
				}();
			}
			$('.config-field').find('input[type="text"]').on('input blur', function(){
				var val = $(this).val();
				var group = $(this).parent().parent().parent();
				var old = group.data('old-attribute');
				if(val != old[$(this).attr('name')]){
					group.addClass('has-warning');
				} else {
					group.removeClass('has-warning');
				}
			});
		},
		deleteMonitorWorkerDayConfigs: function(){
			$('.config-field .row :checked').each(function(index, item){
				var div = $(this).parent().parent().parent().parent();
				div.remove();
			});
			MonitorWorkerDayConfig.saveMonitorWorkerDayConfigs(true);
		},
		saveMonitorWorkerDayConfigs: function(noNeedValidate){
			var okFlag = false, validate = true;
			$('.config-field .has-warning').each(function(index, item){
				if($(this).hasClass('new-row')){
					//var description = $(item).find('input[name="descr"]').val();
					var duty = $(item).find('input[name="duty"]').val();
					var name = $(item).find('input[name="name"]').val();
					var phone = $(item).find('input[name="phone"]').val();
					if(duty.length == 0 || name.length == 0 || phone.length == 0){
						validate = false;
						return;
					}
				}
			});
			if(!noNeedValidate && !validate){
				Message.show('填写内容不能为空。');
				return;
			}
			$('.config-field').each(function(index, item){
				if($(this).hasClass('new-row')){
					//var description = $(item).find('input[name="descr"]').val();
					var duty = $(item).find('input[name="duty"]').val();
					var name = $(item).find('input[name="name"]').val();
					var phone = $(item).find('input[name="phone"]').val();
					var obj = {
						name : name,
						phone: phone,
						duty: duty
					};
					MonitorWorkerDayConfig._renderMonitorWorkerDayConfigRow(obj, $(this).empty().removeClass('new-row'));
				}
				okFlag = true;
			});
			
			if(okFlag || noNeedValidate){
				var contentPane = $('#nv_content');
				var rows = contentPane.find('.config-field>.row');
				var data = contentPane.data('data');
				data.workers = [];
				$(rows).each(function(i,row){
					var name = $(row).find('input[name="name"]').val();
					var duty = $(row).find('input[name="duty"]').val();
					var phone = $(row).find('input[name="phone"]').val();
					var worker = {
							name : name,
							phone: phone,
							duty: duty
						};
					data.workers[data.workers.length] = worker;
				});
				CentralProxy.saveMonitorWorkerDaysInf(data, function(){
					Message.info('保存成功！');
					$('#nv_content').data('data',data);
				});
			} else {
				Message.show('未修改配置，无需保存', {cls: 'warning'});
			}
		},
		createMonitorWorkerDayConfigClick: function(){
			var html = '<div class="form-group">\
							<div class="checkbox"> <label><input type="checkbox" name="selected" ></label> </div>\
				<div class="name"> <input type="text" class="form-control" name="name" placeholder="值班人姓名，必填"></div>\
				<div class="phone"> <input type="text" class="form-control" name="phone" placeholder="电话"></div>\
				<div class="duty"> <input type="text" name="duty" class="form-control" placeholder="岗位"></div>\
						</div>';
			var row = $('<div class="row new-row has-warning">').prependTo('.config-field');
			$(html).appendTo(row);
			$('.config-field').scrollTop(0);
			row.find('input:first').focus();
		},
		
		addNewMonitorWorkerDay: function(){
			var dialog = $('#myModal').modal();
			dialog.find('#monitorWorkerDayDate').datetimepicker({
			      lang: "ch",           //语言选择中文
			      format: "Y-m-d",      //格式化日期
			      inline: true,
			      timepicker: false,    //关闭时间选项
			      startDate: new Date(),
			      defaultDate: new Date(),
			      mask:false,
			      minDate: 0,
			      maxDate:'+1970/02/30',
			      todayButton: true
			});
			$.datetimepicker.setLocale('ch');
			$('#btn_submit').off().click(function(){
				var monitorWorkerDayDate = $('#monitorWorkerDayDate').val();
				var date;
				if($.trim(monitorWorkerDayDate) == '' || $.trim(monitorWorkerDayDate) == null){
					date = new Date();
				}else{
					date = new Date(monitorWorkerDayDate);
				}
				date = Date.parse(date.format('YYYY-MM-DDT00:00:00.000Z'));
				function checkDate(date){
					var param = {
							"group": { 
								"allOf": [{
									"date": {
										"EQ": [date]
									}
								}]
							},
							"types": {
								"date": {
									"type": "LONG"
								}
							},
							"start": 0,
							"limit": 0
						};
					CentralProxy.getMonitorWorkerDaysInf(param, function(resp){
						if(resp.totalCount>0){
							Message.warn('选取的日期已存在，请重新选择日期');
							return;
						}
						submit(date);
					});
				}
				function submit(date){
					var worker = {
							date: date
					};
					CentralProxy.saveMonitorWorkerDaysInf(worker, function(resp){
						Message.success('新增值班日页面成功');
						var newMonitorWorkerDay = resp;
						var menu = $('#nv_left').find('.menu.navi');
						MonitorWorkerDayConfig.renderNavButton(newMonitorWorkerDay, menu);
						menu.find('li>a')[menu.find('li>a').length-1].click();
						dialog.modal('hide');
//						dialog.find('#monitorWorkerDayDate').datetimepicker('destroy');
					});
				}
				
				checkDate(date);
			});
	        
		},
		
		delMonitorWorkerDay: function(){
			var liArr = $('#nv_left').find('.menu.navi>li');
			var delBtn = $('#BtnDelMonitorWorkerDay');
			var okBtn = $('#BtnDelMonitorWorkerDayOK');
			liArr.find('.opr-del-btn').removeClass('hidden');
			delBtn.parent().addClass('hidden');
			okBtn.click(function(){
				liArr.find('.opr-del-btn').addClass('hidden');
				delBtn.parent().removeClass('hidden');
				okBtn.parent().addClass('hidden');
			}).parent().removeClass('hidden');
			
	        
		}
};
