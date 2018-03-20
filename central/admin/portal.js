Central.controller('PortalAdminController', function($scope, $sce, $window, $uibModal, Proxy){
	$scope.List ={
		data: []
	};
	var session = JSON.parse($window.localStorage['nova.central.session']);
	$scope.loading = false;
	
	$scope.loadModules = function(){
		$scope.loading = true;
		if(session.roles){
			var permNames = [];
			for(var roleId in session.roles){  
				var permissions = session.roles[roleId].permissions;
				$(permissions).each(function(index, name){
					if(permNames.indexOf(name)<0){
						permNames.push(name);
					}
				});
            }
			//权限配置中我能看到的模块，和属于我自己的模块
			var param = { "group":{
				"anyOf":[{"caption":{"IN": permNames}}, {"owner": {"EQ": [session.userId]}}]
				}};
			Proxy.Module.list(param, function(resp){
				$scope.List.data = resp.items;
			});
		}
	};
	$scope.loadModules();
	
	$scope.loadPortal = function(){
		Proxy.User.get({id: session.userId}, function(resp){
			if(resp.other.portal){
				$scope.Cavas.cells = resp.other.portal;
			}
			$scope.loading = false;
		});
	};
	$scope.loadPortal();
	
	$scope.$on('colorPicked', function(event, color) {
        $scope.selectedForeColor = color;
    });
	
	$scope.Cavas = {
		saving: false,
		cells:[],
		addItem: function(){
			this.cells.push({name:'',caption:'',color:'#fff',url:'', icon:'', rowspan: 1, colspan:1});
		},
		remove: function(cell){
			this.cells.remove(cell);
		},
		save: function(){
			$scope.Cavas.saving = true;
			var portal = {portal: this.cells};
			
			var change = { id: session.userId, items: {
				other: {type:'set',value: portal}
			} };
			Proxy.User.update(change, function(resp){
				$scope.Cavas.saving = false;
			});
		},
		module: function(cell){
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'module_choose.html',
				controller : 'ModuleSelectableController',
				backdrop: 'static',
				resolve : {
					modules : function() {
						return $scope.List.data;
					},
					containCombine: function(){
						return true;
					}
				}
			});

			modalInstance.result.then(function(module) {
				console.log(module);
				cell.name = module.name;
				cell.caption = module.caption;
				cell.url = module.url;
				cell.icon = module.icon;
			}, function() {
			});
		}
	};
	
	$scope.customSettings = {
	    control: 'brightness',
	    theme: 'bootstrap',
	    position: 'bottom left',
	    hue: '#00cc00'
	};

});