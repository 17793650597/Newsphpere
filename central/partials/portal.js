Central.controller('PortalController', function($scope, $sce, $window, $location, Proxy){
	var session = JSON.parse($window.localStorage['nova.central.session']);
	
	$scope.loadPortal = function(){
		Proxy.User.get({id: session.userId}, function(user){
			console.log(user);
			if(user.other.portal){
				$scope.Cavas.cells = user.other.portal;
			}
		});
	};
	$scope.loadPortal();
	

	$scope.Cavas = {
		cells:[]
	};
});