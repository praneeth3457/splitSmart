angular.module('split').controller('headerCntrl', ['$scope', '$http','$location', '$log', '$currentVariableService', '$location', function($scope, $http, $location, $log, $currentVariableService, $location){
	var header = this;

	header.isActive = function(menu){
		var currentRoute = $location.path();
        return menu === currentRoute ? 'active' : '';
	}

	header.signIn = false;

	persistenceUser();
	function persistenceUser(){
		$http.get('/api/dashboard').success(function(response){
			if(angular.isDefined(response) && angular.isDefined(response.message)){
				if(response.message == 'Success'){
					header.signIn = true;
					$currentVariableService.setUser({
						signIn : true,
						userExist : true,
                    	user : response.user
                	});
				}
			}
		});
	}

	header.logout = function(){
		$http.get('/api/logout').success(function(response){
			if(angular.isDefined(response) && angular.isDefined(response.message)){
				if(response.message == 'Successfully logged out'){
					header.signIn = false;
					$scope.$broadcast('loggedOut', {
						signIn : false,
						userExist : false,
                	});
					$currentVariableService.setUser({
						signIn : false,
						userExist : false,
                	});
                	$location.path('/signIn');
				}
			}
		});
	}

	$scope.$on('signIn', function(event, args){
		if(args.signIn == true){
			header.signIn = true;
		}
	});
	/*$scope.addBillModal = function () {

	    var modalInstance = $uibModal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      /*controller: 'ModalInstanceCtrl',*/
	     /* size: size,*/
	     /* resolve: {
	        items: function () {
	          return $scope.items;
	        }
	      }
	    });*/

	    /*modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
  	};*/

}]);