function loadLeftNav(session){
	var menus = [
	             {title: '用户管理', icon: 'glyphicon glyphicon-user', url: 'user.html'},
	             {title: '角色管理', icon: 'fa fa-group', url: 'role.html'},
	             {title: '页面配置', icon: 'fa fa-list-alt', url: '../index.html#/admin/module'},
	             {title: '数据导入', icon: 'fa fa-gears', url: 'excel.import.html'},
	             ];
	var myMenus = [];
	
	$(menus).each(function(index, item){
		var session = JSON.parse(localStorage.getItem("nova.central.session"));
		if(session.userId == 'admin'){
			myMenus = menus;
		} else if(session.roles){
			for(var roleId in session.roles){  
				var permissions = session.roles[roleId].permissions;
				if(permissions.indexOf(item.title)>=0){
					myMenus.push(item);
				}
            }
		}
	});
	
	myMenus.push({title: '我的主页', icon: 'fa fa-home', url: '../index.html#/admin/portal'});
	
	$(myMenus).each(function(index, item){
		var row = '';
		if(index == 0 ){
			row += '<li class=active>';
			$('#nv_content>iframe').attr('src', item.url);
		} else {
			row += '<li>';
		}
		row += '<a href=' + item.url + ' target=content title=' + item.title + '><i class="' + item.icon + '"></i><span class="left_menu_title">' + item.title + '</span>';
		if(item.hasBadge){
			row += '<span class="badge" id="total-task">0</span>';
		}
		row += '</a></li>';
		
		$(row).appendTo('#nv_left>.menu_container>.menu');
	});
	$('#nv_left .menu a').click(function(){
		$('#nv_left').find('li').removeClass('active');
		$(this).parent().addClass('active');
	});
}
