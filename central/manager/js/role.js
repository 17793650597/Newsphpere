+function PageRole() {
	// 常量
	var proxy = top.CentralProxy;

	// 私有变量
	var _dList = null;
	var _olPerm = null;
	var _olRole = null;
	
	var _btns = null;

	// 私有函数
	/** @memberOf PageRole */
	var _init = function() {
		_dList = $('.list');
		
		var ols = $('.list>ol');
		_olPerm = $('.perm-list');
		_olMenu = $('.me-list');
		_olRole = $('.list>ol.roles');

		var dhead = $('.header');
		_btns = dhead.find('.toolbar>.btn');
		var links = dhead.find('.tabs>li>a');
		links.click(function(event){
			if($(this).hasClass('active')) {
				return;
			}
			_btns.toggle();
			links.toggleClass('active');
			ols.toggle();
		});
		_btns.filter('[name=BtnCreateRole]').click(function() {
			_showRoleDetail(null);
		});
		_btns.filter('[name=BtnDeleteRole]').click(function() {
			_deleteSelectedRoles();
		});
		_btns.filter('[name=BtnCreatePermission]').click(function() {
			_createNewPermEditor().prependTo(_olPerm).find('input').focus();
		});
		_btns.filter('[name=BtnDeletePermission]').click(function() {
			_deleteSelectedPerms();
		});

		_initRoleDetail();
		_loadPermissions();
	};
	
	/** @memberOf PageRole */
	var _deleteSelectedRoles = function() {
		var arrDel = _olRole.find('input:checked').map(function(index, chk){
			return $(chk).parents('li');
		}).get();
		if(arrDel.length <= 0) {
			Message.info('请选择要删除的角色');
			return;
		}
		if(!window.confirm('真的要删除已选中的角色吗')) {
			return;
		}
		var detail = $('.detail-div.editor');
		detail.removeClass('active');
		deleteNext();
		
		function deleteNext() {
			if(arrDel.length <= 0) {
				Message.success('角色删除完成');
				return;
			}
			var li = arrDel.shift();
			var role = li.data('role');
			if(role.id === 'admin') {
				Message.warn('角色管理员和角色用户是系统内置的，不能删除');
				return;
			}
			proxy.deleteRole(role.id, function(resp){
				if(resp !== null) {
					Message.danger('角色删除失败:' + resp);
				} else {
					li.remove();
					deleteNext();
				}
			});
		}
	};

	/** @memberOf PageRole */
	var _deleteSelectedPerms = function() {
		var arrDel = _olPerm.find('input:checked').map(function(index, chk){
			return $(chk).parents('li');
		}).get();
		if(arrDel.length <= 0) {
			Message.info('请选择要删除的权限');
			return;
		}
		if(!window.confirm('真的要删除已选中的权限吗')) {
			return;
		}
		
		function deleteNext() {
			if(arrDel.length <= 0) {
				Message.success('权限删除完成');
				return;
			}
			var li = arrDel.shift();
			var perm = li.data('permission');
			proxy.deletePermission(perm.permissionID, function(resp){
				if(resp.code !== 0) {
					Message.danger(resp.message);
				} else {
					li.remove();
					deleteNext();
				}
			});
		}
		deleteNext();		
	};
	
	/** @memberOf PageRole */
	var _resetRoleID = function(hRoleID, useCustom) {
		if(useCustom) {
			hRoleID
				.off('invalid change input')
				.on('invalid', function() {
					if (!this.validity.valueMissing && !this.validity.tooShort
							&& this.validity.patternMismatch) {
						this.setCustomValidity('只能使用以下字符：数字、大小写字母、横线、下划线');
					}
				})
				.on('change input', function(){
					if($(this).val() == '') {
						return;
					}

					if(_olRole.find('li[roleid="' + $(this).val() + '"]').length > 0) {
						this.setCustomValidity('角色(id:' + $(this).val() + ')已经存在了');
					} else {
						this.setCustomValidity('');
					}
				})
				.attr('placeholder', '请输入角色ID')
				.prop('disabled', false)
				.prop('required', true)
				.attr('pattern', '[0-9a-zA-Z\-_]+')
				
				.prev().prepend('<span class="required">*</span>');
		} else {
			hRoleID
				.off('invalid change input')
				.attr('placeholder', '系统自动生成')
				.val('')
				.prop('disabled', true)
				.prop('required', false)
				.removeAttr('pattern')

				.prev().find('.required').remove();
		}		
	};

	/** @memberOf PageRole */
	var _initRoleDetail = function() {
		var detail = $('.detail-div.editor');
		detail.find('.close').click(function() {
			detail.removeClass('active');
		});
		detail.find('[name=BtnExit]').click(function(){
			detail.removeClass('active');
		});
		
		var hRoleID = detail.find('[name=RoleID]');
		
		detail.find('[name=UseCustomID]').change(function(){
			_resetRoleID(hRoleID, this.checked);
		});

		var hRoleName = detail.find('[name=RoleName]').change(function(){
			var exists = _olRole.find('li[rolename="' + $(this).val() + '"]');
			if(hRoleID.val() === '') {
			} else {
				exists = exists.filter(':not([roleid="' + hRoleID.val() + '"])');
			}
			if(exists.length > 0) {
				this.setCustomValidity('角色名称已经存在了');
			} else {
				this.setCustomValidity('');
			}
		});
		var olPerms = detail.find('.role-permissions');
		var hform = detail.find('form');
		var btnSaveAndNext = detail.find('[name=BtnSaveAndNext]').click(function(){
			hform.find('input[type=submit]').click();
		});

		var btnSaveAndExit = detail.find('[name=BtnSaveAndExit]').click(function(){
			hform.find('input[type=submit]').click();
		});
		
		detail.find('.role-permissions li').click(function(){
			$(this).find('.checkbox').click();
		});
		detail.find('.role-permissions .checkbox').click(function(event){
			event.stopPropagation();
			$(this).toggleClass('fa-check-square-o fa-square-o');
			if($(this).is('.fa-check-square-o')) {
				$(this).parents('ol').prev().each(function(index, li){
					li = $(li);
					if(li.attr('data-name')) {
						li.find('.checkbox').addClass('fa-check-square-o').removeClass('fa-square-o');
					}
				})
			}
			var li = $(this).closest('li');
			if(!li.attr('data-name')) {
				if($(this).is('.fa-check-square-o')) {
					li.next().find('.checkbox').addClass('fa-check-square-o').removeClass('fa-square-o');
				} else {
					li.next().find('.checkbox').addClass('fa-square-o').removeClass('fa-check-square-o');
				}
			} else {
				if($(this).is('.fa-check-square-o') || li.next().is('li')) {
					// nothing
				} else {
					li.next().find('.checkbox').addClass('fa-square-o').removeClass('fa-check-square-o');
				}
			}
		});

		// 添加表单以利用表单的特性（如在输入框中回车提交）
		hform.submit(function(event) {
			
			var role = detail.data('role');
			if(!role) {
				// create
				var permsNew = detail.find('.perm-list li[data-name] .checkbox.fa-check-square-o').map(function(){
					var li  = $(this).closest('li');
					return li.attr('data-name');
				}).get();
				
				var me = detail.find('.me-list li[data-name] .checkbox.fa-check-square-o').map(function(){
					var li  = $(this).closest('li');
					return li.attr('data-name');
				}).get();
				
				var permss = permsNew.concat(me);
				
				btnSaveAndNext.button('loading');
				proxy.createRole({
					id: hRoleID.val()==''?Math.uuid():hRoleID.val(),
					name: hRoleName.val(),
					permissions: permss
				}, function(resp){
					btnSaveAndNext.button('reset');
					if(resp.name !== hRoleName.val()) {
						Message.danger("新建角色失败");
					} else {
						Message.success('角色“' + hRoleName.val() + '”添加成功');
						_addNewRoleToList(resp);
						_showRoleDetail(null);
					}
				});
				
			} else {
				// modify
				var permsNew = detail.find('.perm-list li[data-name] .checkbox.fa-check-square-o').map(function(){
					var li  = $(this).closest('li');
					return li.attr('data-name');
				}).get();
				
				var me = detail.find('.me-list li[data-name] .checkbox.fa-check-square-o').map(function(){
					var li  = $(this).closest('li');
					return li.attr('data-name');
				}).get();
				
				var permss = permsNew.concat(me);
				
				btnSaveAndExit.button('loading');
				proxy.modifyRole({
					id: role.id,
					items: {
						name: {
							type: "set",
							value: hRoleName.val()
						},
						permissions: {
							type: "set",
							value: permss
						}
					}
				}, function(resp) {
					btnSaveAndExit.button('reset');
					if(resp === null) {
						Message.success('角色“' + hRoleName.val() + '”修改成功');
						detail.removeClass('active');
						role.name = hRoleName.val();
						role.permissions = permsNew;
						role.redraw();
					} else {
						Message.danger(resp);
					}
				});
			}
			// 禁止表单的默认提交行为
			return false;
		});
	};

	/** @memberOf PageRole */
	var _loadPermissions = function() {
		_olPerm.empty();
		_dList.find('.loading,.zero,.error').remove();
		_dList.append('<span class=loading>正在加载所有角色...</span>');
		var permList = [];
		proxy.getModulesInf({"group": { 
			"allOf": [{
				"owner": {
					"ISNULL":[] 
				}
			}]
		}}, function(resp){
			permList = resp.items;
			if(permList.length <= 0) {
				_dList.append('<span class=zero>尚未添加权限</span>');
			} else {
				_appendPermissions(permList);
			}
			if(_olRole.is(':empty')) {
				_loadRoles();
			}
		});
	};
	
	/** @memberOf PageRole */
	var _loadRoles = function() {
		_olRole.empty();
		_dList.find('.loading,.zero,.error').remove();
		_dList.append('<span class=loading>正在加载所有角色...</span>');
		_btns.prop('disabled', true);
		
		proxy.listRoles(function(resp) {
			_olRole.empty();
			_dList.find('.loading,.zero,.error').remove();
			
			if (resp === null) {
				var derror = $('<span class=error>').html(resp.message).appendTo(_dList);
				$('<a href=javascript:;>').html('点击重试').appendTo(derror).click(function() {
					_loadRoles();
				});
			} else {
				_btns.prop('disabled', false);
				var roleList = resp;
				if(roleList.length <= 0) {
					_dList.append('<span class=zero>尚未添加角色</span>');
				} else {
					_appendRoles(roleList);
				}
			}
		});
	};
	
	/** @memberOf PageRole */
	var _appendPermissions = function(perms) {
		$(perms).each(function(index, perm) {
			_createPermView(perm).appendTo(_olPerm);
		});
		var menu = [{caption: '用户管理'}, {caption: '角色管理'}, {caption: '页面配置'}];
		$(menu).each(function(index, perm) {
			_createPermView(perm).appendTo(_olMenu);
		});
	};
	
	/** @memberOf PageRole */
	var _createPermView = function(perm) {
		var li = $('<li><i class="fa checkbox fa-square-o"></i><font></font></li>')
					.data('permission', perm)
					.attr('data-name', perm.caption);
		li.find('font').text(perm.caption);
		li.click(function(){
			li.find('i.checkbox').click();
		});
		li.find('i.checkbox').click(function(event){
			if($(this).hasClass('fa-square-o')){
				$(this).removeClass('fa-square-o').addClass('fa-check-square-o');
			}else{
				$(this).removeClass('fa-check-square-o').addClass('fa-square-o');
			}
			event.stopPropagation();
		});
		return li;
	};
	
	/** @memberOf PageRole */
	var _createNewPermEditor = function() {
		var li = $('<li>');
		var ipt = null;
		ipt = $('<input type=text class=perm-editor placeholder=请输入新权限名称>').appendTo(li);
		var fnCreatePerm = function(){
			var nameNew = ipt.val();
			if(nameNew.length <= 0) {
				li.remove();
				return;
			} else if(_olPerm.find('li[permissionname="' + nameNew + '"]').length > 0) {
				Message.warn('权限"' + nameNew + '"已经存在');
				$(this).focus();
				return;
			}
			proxy.createPermission({
				permission: nameNew
			}, function(resp){
				if(resp.code !== 0) {
					Message.danger(resp.message);
					li.remove();
				} else {
					Message.success('权限创建成功');
					li.replaceWith(_createPermView(resp.result));
					_createNewPermEditor().prependTo(_olPerm).find('input').focus();
				}
			});
		};
		ipt.blur(function(){
			li.remove();
		}).keypress(function(){
			 if (event.keyCode == "13") {//keyCode=13是回车键
				 fnCreatePerm();
			 }
		});
		return li;
	};
	
	/** @memberOf PageRole */
	var _createPermEditor = function(perm) {
		var ipt = $('<input type=text class=perm-editor>').val(perm.permission);
		var fnSavePerm = function(){
			var nameNew = ipt.val();
			if(nameNew.length <= 0 || nameNew == perm.permission) {
				ipt.remove();
				perm.redraw();
				return;
			} else if(_olPerm.find('li[permissionname="' + nameNew + '"]').filter(':not([permissionid="' + perm.permissionID + '"])').length > 0) {
				Message.warn('权限"' + nameNew + '"已经存在');
				$(this).focus();
				return;
			}
			proxy.modifyPermission({
				permissionID: perm.permissionID,
				permission: nameNew
			}, function(resp){
				if(resp.code !== 0) {
					Message.danger(resp.message);
				} else {
					Message.success('权限修改成功');
					perm.permission = nameNew;
					ipt.remove();
					perm.redraw();
				}
			});
		};
		ipt.blur(function(){
			ipt.remove();
			perm.redraw();
		}).keypress(function(){
			 if (event.keyCode == "13") {//keyCode=13是回车键
				 fnSavePerm();
			 }
		});
		return ipt;
	};

	/** @memberOf PageRole */
	var _appendRoles = function(roles) {
		$(roles).each(function(index, role) {
			_createRoleView(role).appendTo(_olRole);
		});
	};
	
	/** @memberOf PageRole */
	var _createRoleView = function(role) {
		var li = $('<li>\
				<div class="col-md-4">\
					<div class="title">\
						<input type="checkbox">\
						<i class="fa fa-group"></i><a href=javascript:; name="RoleName"></a>\
					</div>\
					<div name=""></div>\
				</div>\
				<div class="col-md-8"></div>\
				<div class="clearfix"></div>\
			</li>').data('role', role).attr('roleid', role.id).attr('rolename', role.name);
		li.click(function(){
			li.find('input:checkbox').click();
		});
		li.find('input:checkbox').click(function(event){
			event.stopPropagation();
		});
		li.find('[name=RoleName]').click(function(event){
			event.preventDefault();
			event.stopPropagation();
			_showRoleDetail(role);
		});
		role.redraw = function() {
			li.attr('rolename', role.name).find('[name=RoleName]').html(role.name);
		};
		role.redraw();
		return li;
	};
	
	/** @memberOf PageRole */
	var _addNewRoleToList = function(role) {
		// TODO sunwei 以后再考虑按顺序插入
		_createRoleView(role).prependTo(_olRole);
	};

	/** @memberOf PageRole */
	var _showRoleDetail = function(role) {
		var detail = $('.detail-div').addClass('active').data('role', role);
		detail.find('[name=BtnSaveAndExit]').hide();
		detail.find('[name=BtnSaveAndNext]').hide();
		
		if(role && role.id === '_sys_rid_1') {
			detail.find('.role-permissions').parent().hide();
			detail.find('[name=RoleID]').val(role.id);
			detail.find('[name=RoleName]').val(role.name).prop('disabled', true);
			return;
		} else if(role && role.id === '_sys_rid_0') {
			detail.find('.role-permissions').parent().show();
			detail.find('[name=RoleName]').val(role.name).prop('disabled', true);
		} else {
			detail.find('.role-permissions').parent().show();
			detail.find('[name=RoleName]').prop('disabled', false);
		}
		// to create
		if (role == null) {
			detail.find('h4').empty().append('<i class="fa fa-plus"></i><span>正在添加新角色</span>');
			detail.find('[name=BtnSaveAndNext]').show();
			detail.find('[name=UseCustomID]').prop('checked', false).change().parent().parent().show();
			detail.find('[name=RoleID]').val('');//.prop('disabled', false).focus();
			detail.find('[name=RoleName]').val('').focus();
			detail.find('.role-permissions').find('.checkbox').addClass('fa-square-o').removeClass('fa-check-square-o');
		}
		// to modify
		else {
			detail.find('h4').empty().append('<i class="fa fa-edit"></i><span>正在编辑角色：</span>').find('span').append(document.createTextNode(role.name));
			detail.find('[name=BtnSaveAndExit]').show();
			detail.find('[name=UseCustomID]').prop('checked', false).change().parent().parent().hide();
			detail.find('[name=RoleID]').val(role.id);
			detail.find('[name=RoleName]').val(role.name).focus();
			
			detail.find('.role-permissions').find('.checkbox').addClass('fa-square-o').removeClass('fa-check-square-o');
			$(role.permissions).each(function(index, perm){
				detail.find('.role-permissions').find('li[data-name=' + perm + ']')
					.find('.checkbox').removeClass('fa-square-o').addClass('fa-check-square-o');
			});
//			console.log(role.permissions);
//			$(role.permissions).each(function(index, perm){
//				var exists = detail.find('.role-permissions').find('li[data-name=' + perm.permissionID + ']');
//				if(exists.length <= 0) {
//					console.log(perm);
//				}
//			});
		}
	};

	$(function() {
		_init();
	});
}();
