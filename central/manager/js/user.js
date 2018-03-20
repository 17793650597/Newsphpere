+function PageUser() {
	// 常量
	var CentralProxy = top.CentralProxy;
	var PropID = {
		list : [ 'email', 'phone', 'tel','businessorg','businessorgid', 'PasswordNeedChangeNow', 'clueorgname' ],
		Email : 'email',
		Cell : 'phone',
		Tel : 'tel',
		BusinessOrg : 'businessorg',
		BusinessOrgID : 'businessorgid',
		PNCN: 'PasswordNeedChangeNow',
		ClueOrgName : 'clueorgname'
	};

	// 私有变量
	var _sTotal = null;
	var _dList = null;
	var _olUser = null;
	var _olRole = null;
	var _roles = null;

	var _chkAll = null;
	var _btns = null;

	// 私有函数
	/** @memberOf PageUser */
	var _init = function() {
		_dList = $('.list');
		_olUser = $('.list>ol');
		_olRole = $('.role-list');
		_roles = null;
		_sTotal = $('.user-count').on('user-count-changed', function(event){
			var total = _olUser.find('>li').length;
			var selected = _olUser.find('>li .title>input:checkbox:checked').length;
			_sTotal.html(selected + ' / ' + total);
		});;
		
		var dhead = $('.header');
		_chkAll = dhead.find('.toolbar>.check-all input:checkbox').change(function(){
			_olUser.find('input:checkbox').prop('checked', false);
			_olUser.find('li:visible input:checkbox').prop('checked', this.checked);
			_sTotal.trigger('user-count-changed');
		});
		
		dhead.find('[name=TextSearch]').on('input', function(){
			_olUser.find('input:checkbox').add(_chkAll).prop('checked', false);
			
			if($(this).val() != '') {
				_olUser.find('li').hide().filter('li[username*="' + $(this).val() + '"]').show();
				_olUser.find('li').filter('li[userid*="' + $(this).val() + '"]').show();
			} else {
				_olUser.find('li').show();
			}
		});
		_btns = dhead.find('.toolbar .btn');
		_btns.filter('[name=BtnCreate]').click(function() {
			_showUserDetail(null);
		});
		_btns.filter('[name=BtnDelete]').click(function() {
			_deleteSelectedUsers();
		});

		_initUserNewDetail();
		_initUserEditDetail();
		_load();
	};
	
	/** @memberOf PageUser */
	var _deleteSelectedUsers = function() {
		var arrDel = _olUser.find('input:checked').map(function(index, chk){
			var li = $(chk).parents('li');
			var user = li.data('user');
			if(user.id === 'admin') {
				Message.danger('用户admin不能删除');
				return null;
			} else {
				return li;
			}
		}).get();
		if(arrDel.length <= 0) {
			Message.info('请选择要删除的用户，admin除外');
			return;
		}
		if(!window.confirm('真的要删除已选中的用户吗')) {
			return;
		}
		
		function deleteNextUser() {
			if(arrDel.length <= 0) {
				Message.success('用户批量删除完成');
				return;
			}
			var li = arrDel.shift();
			var user = li.data('user');
			CentralProxy.deleteUser(user.id, function(resp){
				if(resp !== null) {
					Message.danger("删除用户"+ user.name +"失败");
				} else {
					li.remove();
					deleteNextUser();
				}
			});
		}
		deleteNextUser();
	};

	/** @memberOf PageUser */
	var _initUserNewDetail = function() {
		var detail = $('.detail-div.creator');
		detail.find('.close').click(function() {
			detail.removeClass('active');
		});
		detail.find('[name=BtnExit]').click(function(){
			detail.removeClass('active');
		});
		var hUserID = detail.find('[name=UserID]');
		hUserID.on('paste', function(){
			return false;
		}).on('invalid', function() {
			if (!this.validity.valueMissing && !this.validity.tooShort
					&& this.validity.patternMismatch) {
				this.validity('只能使用以下字符：数字、大小写字母、横线、下划线');
			}
		}).on('change input', function(){
			if($(this).val() == '') {
				return;
			}

			if(_olUser.find('li[userid="' + hUserID.val() + '"]').length > 0) {
				hUserID.get(0).setCustomValidity('账号已经存在了');
			} else {
				hUserID.get(0).setCustomValidity('');
			}
		});
		var hUserName = detail.find('[name=UserName]');
		var hPass = detail.find('[name=Password]');
		var hPass2 = detail.find('[name=Password2]');
		hPass.change(function() {
			_checkPass(hPass, hPass2);
		});
		hPass2.change(function() {
			_checkPass(hPass, hPass2);
		});
		var hEMail = detail.find('[name=EMail]');
		var hCell = detail.find('[name=Cellphone]');
		var hTel = detail.find('[name=Telphone]');
		var hIsAdmin = detail.find('[name=IsAdmin]');
		var hClueOrgName = detail.find('[name=ClueOrgName]');
		var hRoles = detail.find('.role-checkbox:checked');
		var btnSaveAndNext = detail.find('[name=BtnSaveAndNext]');

		// 添加表单以利用表单的特性（如在输入框中回车提交）
		detail.find('form').submit(function(event) {
			btnSaveAndNext.button('loading');

			var roleIds = [];
			detail.find('.role-checkbox:checked').each(function(){
				roleIds.push($(this).data('roleId'));
			});
			var userNew = {
					id : hUserID.val(),
					name : hUserName.val(),
					password : hPass.val(),
					status : 'Enable',
					email : hEMail.val(),
					phone : hCell.val(),
					tel : hTel.val(),
					roleIds : roleIds
				};
			CentralProxy.createUser(userNew, function(resp) {
				btnSaveAndNext.button('reset');
				if(resp.id !== hUserID.val()) {
					Message.danger('用户添加失败');
				} else {
					Message.success('用户添加成功');
					// 插入列表
					_addNewUserToList(userNew);
					// 准备添加下一个用户
					_showUserDetail(null);
				}
			});
			// 禁止表单的默认提交行为
			return false;
		});
	};

	/** @memberOf PageUser */
	var _initUserEditDetail = function() {
		var detail = $('.detail-div.editor');
		detail.find('.close').click(function() {
			detail.removeClass('active');
		});

//		var hUserID = detail.find('[name=UserID]');
		var hUserName = detail.find('[name=UserName]');
		var hPass = detail.find('[name=Password]');
		var hPass2 = detail.find('[name=Password2]');
		hPass.change(function() {
			_checkPass(hPass, hPass2);
		});
		hPass2.change(function() {
			_checkPass(hPass, hPass2);
		});
		
		var hEMail = detail.find('[name=EMail]').val('');
		var hCell = detail.find('[name=Cellphone]').val('');
		var hTel = detail.find('[name=Telphone]').val('');
		var hBusinessOrg = detail.find('[name=BusinessOrg]').val('');
		var hClueOrgName = detail.find('[name=ClueOrgName]').val('');
		var hIsAdmin = detail.find('[name=IsAdmin]');
		var hRoles = detail.find('.role-checkbox:checked');
		var hPNCN = detail.find('[name=PasswordNeedChange]');

		var btnSaveAndExit = detail.find('[name=BtnSaveAndExit]');
		detail.find('[name=BtnExit]').click(function(event){
			event.preventDefault();
			detail.removeClass('active');
		});

		// 添加表单以利用表单的特性（如在输入框中回车提交）
		detail.find('form').submit(function(event) {
			var user = detail.data('user');
			btnSaveAndExit.button('loading');
			var roleIds = [];
			detail.find('.role-checkbox:checked').each(function(){
				roleIds.push($(this).data('roleId'));
			});
			var userToModify = {
				id : user.id,
				items : {
					email : {
						type : "set",
						value : hEMail.val()
					},
					phone : {
						type : "set",
						value : hCell.val()
					},
					tel : {
						type : "set",
						value : hTel.val()
					},
					roleIds: {
						type : "set",
						value : roleIds
					}
				}
			};
			if($.trim(hUserName.val())!==''){
				userToModify.items.name = {
						type : "set",
						value : hUserName.val()
					};
			}
			if($.trim(hPass.val())!==''){
				userToModify.items.password = {
						type : "set",
						value : hPass.val()
					};
			}
			CentralProxy.modifyUser(userToModify, function(resp) {
				btnSaveAndExit.button('reset');
				if(resp !== null) {
					Message.danger('用户保存失败');
				} else {
					Message.success('用户保存成功');
					detail.removeClass('active');
					user.name = hUserName.val();
					user.password = hPass.val();
					user.userPropertyList = userToModify.userPropertyList;
					user.email = hEMail.val();
					user.phone = hCell.val();
					user.tel = hTel.val();
					user.roleIds = roleIds;
					user.redraw();
				}
			});

			// 禁止表单的默认提交行为
			return false;
		});
	};

	/** @memberOf PageUser */
	var _load = function() {
		_olUser.empty();
		_dList.find('.loading,.zero,.error').remove();
		_dList.append('<span class=loading>正在加载所有用户...</span>');
		CentralProxy.listAllUsers(function(resp) {
			_olUser.empty();
			_dList.find('.loading,.zero,.error').remove();
			
			if (resp.length === 0) {
				var derror = $('<span class=error>').html(resp.message).appendTo(_dList);
				$('<a href=javascript:;>').html('点击重试').appendTo(derror).click(function() {
					_load();
				});
			} else {
				var userList = resp;
				_dList.append('<span class=loading>正在加载所有角色...</span>');
				CentralProxy.listRoles(function(resp){
					_dList.find('.loading,.zero,.error').remove();
					_btns.prop('disabled', false);
					_roles = resp;
					_appendRoles(_roles);
					if(userList.length <=0) {
						_dList.append('<span class=zero>尚未添加用户</span>');
					} else {
						_userTotal = userList.length;
						_appendUsers(userList);
						_sTotal.trigger('user-count-changed');
					}
				});
			}
		});
	};

	/** @memberOf PageUser */
	var _appendUsers = function(users) {
		$(users).each(function(index, user) {
			_createUserView(user).appendTo(_olUser);
		});
//		_loadUserProperties(_olUser.find('li:first-child'));
	};
	
	/** @memberOf PageUser */
	var _appendRoles = function(roles) {
		_olRole.empty();
		$(roles).each(function(index, role) {
			var roleHtml = '<li class="role-list-item">\
								<label>user</label>\
								<input type="checkbox" class="role-checkbox">\
							</li>';
			var $roleHtml = $(roleHtml);
			$roleHtml.find('label').text(role.name);
			$roleHtml.find('input').data('roleId', role.id);
			$roleHtml.appendTo(_olRole);
		});
	};
	
	/** @memberOf PageUser */
	var _createUserView = function(user) {
		var li = $('<li>\
				<div class="col-md-4">\
					<div class="title">\
						<input type="checkbox" />\
						<i class="glyphicon glyphicon-user"></i>\
						<a href="javascript" name="UserName"></a>\
						&nbsp;&nbsp;&nbsp;&nbsp;(\
						<span name="UserID"></span>)\
					</div>\
				</div>\
				<div class="col-md-8"></div>\
				<div class="clearfix"></div>\
			</li>').data('user', user).attr('userid', user.id).attr('username', user.name);
		li.click(function(){
			li.find('input:checkbox').click();
		});
		li.find('input:checkbox').click(function(event){
			event.stopPropagation();
			_sTotal.trigger('user-count-changed');
		});
		var hName = li.find('[name=UserName]').click(function(event){
			event.preventDefault();
			event.stopPropagation();
			_showUserDetail(user);
		});
		user.redraw = function() {
			hName.html(user.name);
			li.find('[name=UserID]').html(user.id);
		};
		user.redraw();
		return li;
	};
	
	/** @memberOf PageUser */
	var _addNewUserToList = function(user) {
		// TODO sunwei 以后再考虑按顺序插入
		_createUserView(user).prependTo(_olUser);
	};
	
//	/** @memberOf PageUser */
//	var _loadUserProperties = function(li) {
//		if (li.length <= 0){
//			return;
//		}
//		var user = li.data('user');
//		CentralProxy.getUserProperties({
//			id : user.id,
//			keyIDList : PropID.list
//		}, function(resp) {
//			if (resp.code !== 0) {
//				Message.danger(resp.message);
//			} else {
//				user.userPropertyList = resp.result.userPropertyList;
//				user.properties = user.properties || {};
//				$(user.userPropertyList).each(function(index, prop){
//					user.properties[prop.keyID] = prop.keyValue;
//				});
//				user.redraw();
//				_loadUserProperties(li.next());
//			}
//		});
//	};

	/** @memberOf PageUser */
	var _showUserDetail = function(user) {
		$('.detail-div').removeClass('active');

		if (user == null) {
			var detail = $('.detail-div.creator').addClass('active');

			detail.find('[name=UserID]').val('').focus();
			detail.find('[name=UserName]').val('');
			detail.find('[name=Password]').val('');
			detail.find('[name=Password2]').val('');
			detail.find('[name=EMail]').val('');
			detail.find('[name=Cellphone]').val('');
			detail.find('[name=Telphone]').val('');
			detail.find('[name=ClueOrgName]').val('');
			_olRole.find('.role-checkbox').checked = false;
		} else {
			var detail = $('.detail-div.editor').addClass('active').data('user', user);
			detail.find('.detail-title h4 span').text('正在编辑用户：' + user.name + '   ('+ user.id +')');
			
			detail.find('[name=UserID]').val(user.id);
			detail.find('[name=UserName]').val(user.name).focus();
			detail.find('[name=Password]').val('').parents('tr').hide();
			detail.find('[name=Password2]').val('').parents('tr').hide();
			detail.find('[name=EMail]').val(user.email);
			detail.find('[name=Cellphone]').val(user.phone);
			detail.find('[name=Telphone]').val(user.tel);
//			detail.find('[name=ClueOrgName]').val('');
			detail.find('.role-checkbox').each(function(i, checkbox){
				var checked = false;
				$(user.roleIds).each(function(j, roleId){
					var roleIdData = $(checkbox).data('roleId');
					if(roleIdData && roleIdData === roleId){
						checked = true;
					}
				});
				checkbox.checked = checked;
			});
			
			//业务部门
			detail.find('[name=Department]').text('/JSBC');
			var $BusinessOrg = detail.find('[name=BusinessOrg]').empty();
			$BusinessOrg.append('<option value="" selected>JSBC</option>');
			
			detail.find('[name=IsAdmin]').prop('disabled', user.id === 'admin');
			detail.find('[name=PasswordNeedChange]').prop('disabled', true);
		}
	};
	
	/** @memberOf PageUser */
	var __orgRoot = {organizationID: '', organizationName:'JSBC', organizationType:'部门', path:'/JSBC', idpath:'/'};
	var __orgCache = {'' : __orgRoot};
	var __cached = false;
	
	/** @memberOf PageUser */
	var _loadOrganizationMap = function(callback) {
		if(__cached) {
			callback(__orgCache);
			return;
		}
		loadOrgs();
		function loadOrgs() {
			CentralProxy.listOrgs(function(resp){
				if (resp.code !== CentralProxy.SUCCESS) {
					Message.danger(resp.message);
					callback(false);
					return;
				}
				retreeNext(resp.result);
			});
		}
			
		function retreeNext(orgs) {
			if(orgs.length <= 0) {
				__cached = true;
				callback(__orgCache);
				return;
			}
			orgs = $(orgs).map(function(index, org){
				if(org.organizationType !== '部门') {
					return null;
				}
				var parent = __orgCache[org.parentID];
				if(parent) {
					org.path = parent.path + '/' + org.organizationName;
					org.idpath = parent.idpath + '/' + org.organizationID;
					__orgCache[org.organizationID] = org;
					return null;
				} else {
					return org;
				}
			});
			retreeNext(orgs);
		}
	};
	
	/** @memberOf PageUser */
//	var _loadUserProperties = function(user, callback) {
//		loadProp();
//		function loadProp() {
//			CentralProxy.getUser(user.id, function(resp) {
//				if (resp.id !== user.id) {
//					Message.danger(resp.message);
//					callback(false);
//					return;
//				}
////				user.userPropertyList = resp.result.userPropertyList;
////				user.properties = user.properties || {};
////				$(user.userPropertyList).each(function(index, prop){
////					user.properties[prop.keyID] = prop.keyValue;
////				});
////				user.properties[PropID.PNCN] = user.properties[PropID.PNCN] || 'false';
////				loadUserOrgID();
//			});
//		}
//		
//		function loadUserOrgID() {
//			CentralProxy.listUserOrgs(user.id, function(resp) {
//				if(resp.code !== CentralProxy.SUCCESS) {
//					Message.danger(resp.message);
//					callback(false);
//					return;
//				}
//				user.properties['department'] = __orgRoot;
//				_loadOrganizationMap(function(orgMap){
//					if(!orgMap) {
//						callback(false);
//						return;
//					}
//					$(resp.result).each(function(i, org){
//						if(org.organizationType === '部门' && orgMap[org.organizationID]) {
//							user.properties['department'] = orgMap[org.organizationID];
//							return false;
//						}
//					})
//					callback();
//				});
//			});
//		}
//	}
	
	/** @memberOf PageUser */
	var _checkPass = function(hPass, hPass2) {
		if (hPass.val() != hPass2.val()) {
			hPass2.get(0).setCustomValidity('两遍密码不一致');
		} else {
			hPass2.get(0).setCustomValidity('');
		}
	};

	$(function() {
		_init();
	});
}();
