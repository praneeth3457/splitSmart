angular.module('split').controller('signCntrl', ['$scope', '$http', '$currentVariableService', '$location','$rootScope', function($scope, $http, $currentVariableService, $location, $rootScope){
	var sign = this;
	var selectUser = $currentVariableService.getUser();

	$scope.$on('loggedOut', function(event, obj){
		console.log(obj);
	});

	if(selectUser.signIn == true){
		sign.signin = 'Success';
	}
	if(selectUser.signIn == false){
		sign.signin = 'unSuccess';
	}

	sign.errorfname = function(fname){
		var result;
		if(fname.length > 2 && fname.length < 16){
			var exp = /^[a-zA-Z\s]+$/;
			result = exp.test(fname);
		}else{
			result = false;
		}

		sign.checkfname = result;
	}
	sign.errorlname = function(lname){
		var result;
		if(lname.length > 2 && lname.length < 16){
			var exp = /^[a-zA-Z\s]+$/;
			result = exp.test(lname);
		}else{
			result = false;
		}

		sign.checklname = result;
	}
	sign.errorusername = function(username){
		var result = false;
		if(username.length > 2 && username.length < 16){
			var exp = /^[a-zA-Z0-9\s]+$/;
			result = exp.test(username);
		}else{
			result = false;
		}

		sign.checkusername = result;
	}
	sign.erroremail = function(email){
		var result;
		if(username.length > 2 && username.length < 16){
			var exp = /^[a-zA-Z0-9\s]+$/;
			result = exp.test(username);
		}else{
			result = false;
		}

		sign.checkusername = result;
	}

	sign.registerUser = function(){
		$http.post('/api/signup', sign.regUser).success(function(response){
			if(response.message == 'Unsuccess'){
				if(angular.isDefined(response.error.errmsg)){
					if(response.error.errmsg.indexOf("username") != -1){
						sign.signupError = true;
						sign.signupErrorMsg = 'Username already exists!';
					}
				    if(response.error.errmsg.indexOf("email") != -1){
						sign.signupError = true;
						sign.signupErrorMsg = 'Email id already exists!';
					}
				}else{
					sign.signupError = true;
					sign.signupErrorMsg = 'Please enter all the fields';
				}
			}

			if(response.message == 'Success'){
				sign.signupError = false;
				sign.signup = 'success';
			}
		});
	}

	sign.login = function(){
		$http.post('/api/users', sign.loginUser).success(function(response){
			if(response.message == 'Unsuccess'){
				sign.signinError = true;
				sign.signinErrorMsg = 'Username and/or password is incorrect!';
			}
			if(response.message == 'Success'){
				sign.signin = 'Success';
				signInObj = {
						signIn : true,
						userExist : true,
                	}
				$rootScope.$broadcast('signIn', signInObj);
				$location.path('/');
				$currentVariableService.setUser({
					userExist : true,
                    user : response.user
                });
			}
		});
	}
}]);