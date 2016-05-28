angular.module('split', ['ngRoute']).config(['$routeProvider',
  	function($routeProvider) {
		$routeProvider.
			when('/', {
			templateUrl: 'views/overview.html'
		}).
		when('/addGroup', {
			templateUrl: 'views/addGroup.html'
		}).
	    when('/groupBalances', {
			templateUrl: 'views/groupBalances.html'
		}).
		when('/groupMessages', {
			templateUrl: 'views/groupMessages.html',
		}).
		when('/signIn', {
			templateUrl: 'views/signin.html',
		}).
		when('/signUp', {
			templateUrl: 'views/signup.html',
		}).
		otherwise({
			redirectTo: 'views/overview.html'
	});
}]);

	