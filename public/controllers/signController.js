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
			var exp = /^([a-zA-Z0-9]+)$/;
			result = exp.test(username);
		}else{
			result = false;
		}

		sign.checkusername = result;
	}
	sign.erroremail = function(email){
		var result;
		if(email.length > 2 && email.length < 16){
			var exp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
			result = exp.test(email);
		}else{
			result = false;
		}

		sign.checkemail = result;
	}
	sign.errorcpassword = function(password, cpassword){
		var result;
		if(password == cpassword){
			result = true;
		}else{
			result = false;
		}

		sign.checkcpassword = result;
	}

	sign.registerUser = function(){
		console.log(sign.cpassword); console.log(sign.regUser.password);
		if(sign.cpassword == sign.regUser.password){
			sign.checkcpassword = true;
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
		}else{
			sign.checkcpassword = false;
		}
	}

	sign.login = function(){
		$http.post('/api/users', sign.loginUser).success(function(response){
			if(response.message == 'Unsuccess'){
				sign.signinError = true;
				sign.signinFail = false;
				sign.signinErrorMsg = 'Username and/or password is incorrect!';
			}
			if(response.message == 'Success'){
				sign.signin = 'Success';
				sign.signinError = false;
				sign.signinFail = false;
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
		}).error(function(err){
			sign.signinFail = true;
			sign.signinError = false;
			sign.signinFailMsg = 'Service unavailable. Please try again later!';
		});
	}
}]);