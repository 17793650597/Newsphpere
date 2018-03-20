Central.controller('ModuleController', function($scope, $sce, $window, $uibModal, Proxy){
	$scope.List ={
		data: []
	};
	$scope.session = JSON.parse($window.localStorage['nova.central.session']);
	$scope.permNames = [];
	
	$scope.loading = false;
	$scope.loadModules = function(){
		$scope.loading = true;
		if($scope.session.roles){
			for(var roleId in $scope.session.roles){  
				var permissions = $scope.session.roles[roleId].permissions;
				$(permissions).each(function(index, name){
					if($scope.permNames.indexOf(name)<0){
						$scope.permNames.push(name);
					}
				});
            }
			//权限配置中我能看到的模块，和属于我自己的模块
			var param = { "group":{
				"anyOf":[{"caption":{"IN": $scope.permNames}}, {"owner": {"EQ": [$scope.session.userId]}}]
				}};
			Proxy.Module.list(param, function(resp){
				$scope.List.data = resp.items;
				$scope.loading = false;
			});
		}
	};
	
	
	$scope.loadModules();
	
	$scope.refresh = function(){
		$scope.loadModules();
	};
	
	$scope.Module = {
		edit: false,
		saving: false,
		data: {
			name: '',
			caption: '',
			url: '',
			icon: ''
		},
		save: function(){
			this.saving = true;
			if(!this.data.name || !this.data.caption || !this.data.url || !this.data.icon){
				$window.alert('检查必填项：主键、名称、图标、路径');
				return;
			}
			
			if(this.Combine.on){
				//保存到个人
				this.data.combine = this.Combine.cells;
				this.data.owner = $scope.session.userId;
			}
			if(this.data.id){
				Proxy.Module.save(this.data, function(resp){
					$scope.Module.saving = false;
					$scope.Module.edit = false;
					$scope.loadModules();
				});
			} else {
				Proxy.Module.add(this.data, function(resp){
					$scope.Module.saving = false;
					$scope.Module.edit = false;
					$scope.loadModules();
				});
			}
			
		},
		open: function(row){
			this.edit = true;
			this.data = row;
			this.Combine.on = row.combine.length>0;
			if(this.Combine.on){
				this.Combine.cells = row.combine;
				this.Combine.rows = row.combine.length;
				this.Combine.cols = row.combine[0].length;
			}
		},
		del: function(row){
			if($window.confirm("删除后将不可恢复，请确认。")){
				Proxy.Module.del(row, function(resp){
					$scope.loadModules();
				});
			}
		},
		add: function(){
			this.edit = true;
			this.data = {
					conf : {}
			};
		},
		removeExt: function(key){
			delete this.data.conf[key];
		},
		addExt: function(){
			var modalInstance = $uibModal.open({
				animation : true,
				templateUrl : 'ext_item.html',
				controller : 'ExtAttrController',
				backdrop: 'static',
				resolve : {}
			});

			modalInstance.result.then(function(item) {
				$scope.Module.data.conf[item.key] = item.value;
				
			}, function() {
			});
		},
		Combine: {
			on: false,
			rows: 1,
			cols: 1,
			cells: [],
			toggle: function(){
				this.on = !this.on;
			},
			open: function(cell){
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
							return false;
						}
					}
				});

				modalInstance.result.then(function(module) {
					cell.name = module.name;
					cell.caption = module.caption;
					cell.url = module.url;
				}, function() {
				});
			},
			table : function () {
				var temp = [];
				for(var i=0; i<this.rows; i++){
					var r = new Array();
					for(var j=0; j < this.cols; j++){
						r.push({name:'',
							caption:'',
							url: '',
							icon:''});
					}
					temp.push(r);
				}
				this.cells = temp;
		    }
		}
	};
	
}).controller('ModuleSelectableController', function($scope, $uibModalInstance, modules, containCombine){
	$scope.modules = [];
	angular.forEach(modules, function(item, index){
		if(!containCombine && (!item.combine || item.combine.length == 0) ){
			$scope.modules.push(item);
		} else if(containCombine){
			$scope.modules.push(item);
		}
	});
	$scope.selected = null;
	$scope.select = function(row){
		$scope.selected = row;
	};
	$scope.ok = function() {
		$uibModalInstance.close($scope.selected);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
}).controller('ExtAttrController', function($scope, $uibModalInstance){
	$scope.ret = {key:'', value:''};
	$scope.ok = function() {
		$uibModalInstance.close($scope.ret);
	};

	$scope.cancel = function() {
		$uibModalInstance.dismiss('cancel');
	};
});