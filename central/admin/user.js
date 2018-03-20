Central.controller('UserController', function($scope, $sce, Proxy){
	$scope.Users = {
		data: [],
		loading: true,
		load: function(){
			Proxy.User.findAll({},
				function success(resp) {
					$scope.Users.loading = false;
					$scope.Users.data = resp;
				});
		}
	};
	
	$scope.Users.load();
});