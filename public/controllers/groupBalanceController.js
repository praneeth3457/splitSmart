angular.module('split').controller('groupBalanceCntrl', 
	['$scope', '$http', '$currentVariableService', function($scope, $http, $currentVariableService){

	var groupBal = this;
	var selectUser = $currentVariableService.getUser();
	
	if(selectUser.userExist == true){
			groupBal.userExist = true;
			getGroups(selectUser.user.username);
	};
	/*var selectedGroup = $currentVariableService.getViewMessages();
	if(selectedGroup != undefined){    //If we select from 'view messages' from 'Add Group' tab
		groupBal.selectedOption = selectedGroup;
		groupBal.getGroupDetails(selectedGroup);
	}else{
		if(user.userExist == true){
			groupBal.userExist = true;
			getGroups(user.user.username);
		};
	}*/

	function getGroups(user){  //If we directly come to this view messages
		var usernameReq = {
			gmemberUsername : user
		}
		$http.post('/api2/getGroups', usernameReq).success(function(response){
			groupBal.groups = response;
			if(angular.isDefined(groupBal.groups) && angular.isDefined(groupBal.groups[0].gname)){
				groupBal.selectedOption = groupBal.groups[0];
				groupBal.getGroupDetails(groupBal.selectedOption);
			}
		});
	}

	groupBal.getGroupDetails = function(group){
		var groupMemberDetails = [];
		var gmemberLength = group.gmembers.length;
		var gbillsLength = group.gbills.length;
		var owes = 0;
		for(var i=0; i<gmemberLength; i++){

			groupMemberDetails[i] = {
										MemberName :  group.gmembers[i].name,
										owes : 0,
										owed : 0,
										tbalance : 0,
										records : []
									};

			for(var j=0; j<gbillsLength; j++){
				if(group.gbills[j].user == groupMemberDetails[i].MemberName){
					owes = 0;
					for(var z=0; z<group.gbills[j].billFor.length; z++){
						if(group.gbills[j].billFor[z] == groupMemberDetails[i].MemberName){
							owes = (group.gbills[j].amount)/ (group.gbills[j].billFor.length);
						}
					}
					
					var balance = (group.gbills[j].amount - owes);

					groupMemberDetails[i].records.push({
															billBy : group.gbills[j].user,
															billFor : group.gbills[j].billFor,
															description : group.gbills[j].desciption,
															owes : owes,
															owed : group.gbills[j].amount,
															date : group.gbills[j].date,
															amount : group.gbills[j].amount,
															balance : balance
														});
				}else{
					var billsForLength= group.gbills[j].billFor.length;
					for(var k=0; k<billsForLength; k++){
						if(group.gbills[j].billFor[k] == groupMemberDetails[i].MemberName){
							var owes = (group.gbills[j].amount)/ (group.gbills[j].billFor.length);
							groupMemberDetails[i].records.push({
															billBy : group.gbills[j].user,
															billFor : group.gbills[j].billFor,
															description : group.gbills[j].desciption,
															owes : owes,
															owed : 0,
															date : group.gbills[j].date,
															amount : group.gbills[j].amount,
															balance : 0 - owes
														});
						}
					}
				}
			}

			var owes = 0;
			var owed = 0;
			for(var l=0; l<groupMemberDetails[i].records.length; l++){
				owes += groupMemberDetails[i].records[l].owes;
				owed += groupMemberDetails[i].records[l].owed;
			}
			groupMemberDetails[i].owes = owes;
			groupMemberDetails[i].owed = owed;
			groupMemberDetails[i].tbalance = owed - owes;
		}

		$scope.groupMemberDetails = groupMemberDetails;

		$scope.bills = [];
		for(var m=0; m<group.gbills.length; m++){
			if(angular.isDefined(group.gbills[m].user)){
				$scope.bills.push(group.gbills[m]);
			};
		}
		if($scope.bills.length > 0){
			$scope.hasBills = true;
		}else{
			$scope.hasBills = false;
		}
		
	}

}]);