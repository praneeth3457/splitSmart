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

		var groupBills = {bills : group.gbills, individualTotals : groupMemberDetails}
		$currentVariableService.setGroupBills(groupBills);

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

	groupBal.settleup = function() {
		var x = $currentVariableService.getGroupBills();
		var settleupTotals = [];
		var messages = [];
		var settleupTotal = false;
		var userName1, userName2;
		for(var s=0; s<x.individualTotals.length; s++){
			settleupTotals.push(x.individualTotals[s].tbalance);
			if(x.individualTotals[s].tbalance !== 0){
				settleupTotal = true;
			}
		}

		do{
			var max = Math.max.apply( Math, settleupTotals);
			var min = Math.min.apply( Math, settleupTotals);
			if(max > -(min)){
				for(var i = 0; i<settleupTotals.length; i++){
					if(max == settleupTotals[i]){
						settleupTotals[i] = settleupTotals[i] + min;
						userName1 = x.individualTotals[i].MemberName;
						break;
					}
				}
				for(var i = 0; i<settleupTotals.length; i++){
					if(min == settleupTotals[i]){
						settleupTotals[i] = 0;
						userName2 = x.individualTotals[i].MemberName;
						break;
					}
				}
				
				var message = userName2 + ' owes ' + userName1;
				var amount = -(min);
				messages.push({message: message, amount:amount});
			} else if(-(min) > max){
				for(var i = 0; i<settleupTotals.length; i++){
					if(max == settleupTotals[i]){
						settleupTotals[i] = 0;
						userName1 = x.individualTotals[i].MemberName;
						break;
					}
				}
				for(var i = 0; i<settleupTotals.length; i++){
					if(min == settleupTotals[i]){
						settleupTotals[i] = settleupTotals[i] + max;
						userName2 = x.individualTotals[i].MemberName;
						break;
					}
				}
				var message = userName2 + ' owes ' + userName1;
				var amount = max;
				messages.push({message: message, amount:amount});
			} else if(-(min) == max){
				for(var i = 0; i<settleupTotals.length; i++){
					if(max == settleupTotals[i]){
						settleupTotals[i] = 0;
						userName1 = x.individualTotals[i].MemberName;
						break;
					}
				}
				for(var i = 0; i<settleupTotals.length; i++){
					if(min == settleupTotals[i]){
						settleupTotals[i] = 0;
						userName2 = x.individualTotals[i].MemberName;
						break;
					}
				}
				var message = userName2 + ' owes ' + userName1;
				var amount = -(min);
				messages.push({message: message, amount:amount});
			}

			var check = [];
			for(var i = 0; i<x.individualTotals.length; i++){
				if(settleupTotals[i] !== 0){
					check.push(true);
				}
			}
			if(check.length < 2){
				settleupTotal = false;
			}
		}while(settleupTotal == true)

		groupBal.messages = messages;
		console.log(messages);
	}

	groupBal.settleupConfirm = function(group){
		var settledDetails = [];
		var settledBills = $currentVariableService.getGroupBills();
		console.log(settledBills);
		for(var b=0; b<settledBills.bills.length; b++){
			if(settledBills.bills[b].amount){
				settledDetails[b] = {
					user : settledBills.bills[b].user,
					desciption: settledBills.bills[b].desciption,
					date: settledBills.bills[b].date,
					amount: settledBills.bills[b].amount,
					billFor: settledBills.bills[b].billFor
				}
			}
		}

		var settledRequest = {
			group : group.gname,
			bills : settledDetails
		}

		$http.post('/api/settled', settledRequest).success(function(response){
			console.log(response);
			groupBal.getGroupDetails(group);
		}).error(function(err){
			console.log(response);
		});
	}

}]);