Central.controller('CommonCombineController', function($scope, $sce, $location, Proxy){
	$scope.skins = ['lightblue', 'blue', 'dark'];
	$scope.skin = $scope.skins[0];
	
	var key = $location.search().key;
	
	$scope.Module = null;
	
	$scope.loadModule = function(key){
		Proxy.Module.get({name: key}, function(resp){
			$scope.Module = resp;
		});
	};
	
	$scope.loadModule(key);
	
	$scope.change = function(cell, row, col){
		console.log(cell);
        return cell.url + '?skin=' + $scope.skin +'&bg=' + (row +'' + col + '.jpg');
	};
	
});