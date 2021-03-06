angular.module('split').controller('groupCntrl', ['$scope', '$http', '$currentVariableService', function($scope, $http, $currentVariableService){
	var group = this;
	group.userExist = false; 
	group.newGroup = false;
	group.viewGroups = true;
	group.addaMember = false;
	group.groupUsers = [];
	var user = $currentVariableService.getUser();
	if(user.userExist == true){
		group.userExist = true;
		viewGroups(user.user.username);
	};


	function viewGroups(username){
		var usernameReq = {
			gmemberUsername : username
		}
		$http.post('/api2/getGroups', usernameReq).success(function(response){
			group.viewGrpsLength = response.length;
			group.viewGrps = response;
		});
	}

	
	group.addaGroup = function(){
		var getGroupRequest = {
			gname : group.addGroup.gname,
			gtype : group.addGroup.gtype,
			gmemberName : user.user.fname,
			gmemberUsername : user.user.username
		}
		$http.post('/api2/addGroup', getGroupRequest).success(function(response){
			if(response){
				viewGroups(user.user.username);
				group.viewGrp();
			}
		});
	};

	group.addNewGroup = function(){
		group.newGroup = true;
		group.viewGroups = false;
	}

	group.viewGrp = function(){
		group.newGroup = false;
		group.viewGroups = true;
	}

	group.addMember = function(gname, gtype){
		group.viewGroups = false;
		group.addaMember = true;
		group.addaMemberGname = gname;
		group.addaMemberGtype = gtype;
	}

	group.addaMemberFun = function(gname, name, uname){
		var addMemberReq = {
			gname : gname,
			gmemberName : name,
			gmemberUsername : uname
		}
		$http.post('/api2/addGroupMember', addMemberReq).success(function(response){
			if(angular.isDefined(response) && response.message == 'Success'){
				group.addaMember = false;
				group.viewGroups = true;
				group.isExist = false;
				group.exist = false;
				viewGroups(user.user.username);
				group.viewGrp();
			}else{
				group.isExist = response.notExist;
				group.exist = response.exist;
			}
		});
	}

	group.getGroupUsers = function(gname){
		group.billStatus = 'unsuccess';
		$http.post('/api2/getGroupUsers', {gname : gname}).success(function(response){
			var grpusers = [];
			if(response){
				grpusers = response.groupUsers; 
				group.groupUsers = grpusers;
				group.gname = gname;
			}
		});
	}

	group.billSubmit = function(gname){
		var billFor = [];
		for(var i=0; i<group.bill.forSelected.length; i++){
			billFor.push(group.bill.forSelected[i].name); 
		}
		var addBillRes = {
			"gname" : gname,
		    "user" : group.bill.userSelected.name,
		    "billFor" : billFor,
		    "desciption" : group.bill.description,
		    "date" : group.bill.date,
		    "amount": group.bill.amount
		}
		$http.post('/api2/addBill', addBillRes).success(function(response){
			if(response){
				group.billStatus = 'success';
			}
		});
	}

	group.addOnemore = function(){
		group.billStatus = 'unsuccess';
	}

	group.viewMessages = function(groupName){
		$currentVariableService.setViewMessages(groupName);
	}

	group.delete = function(groupName){
		group.grpDelete = groupName;
	}

	group.deleteGroup = function(groupName){
		var groupDel = {
			groupName : groupName
		}
		$http.post('/api2/delGroup', groupDel).success(function(response){
			if(response){
				viewGroups(user.user.username);
			}
		});
	}

	group.content = "fg";
	group.billforTooltip = function(billFor){
		var content = "";
		for(var i=0; i<billFor.length-1; i++){
			content += billFor[i].name + ", ";
		}
		content += billFor[billFor.length - 1].name;
		group.content = content;
	}
}]);