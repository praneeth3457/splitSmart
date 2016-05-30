angular.module('split')
    .factory('$currentVariableService', [
        function() {
            var factory = {
                user:"",
                group:"",
                groupBills:""
                }

            factory.getUser = function () {
                return factory.user;
            };

            factory.setUser = function (user) {
                factory.user = user;
            };

            factory.setViewMessages = function (group) {
                factory.viewMessages = group;
            }
            factory.getViewMessages = function () {
                return factory.viewMessages;
            };

            factory.setGroupBills = function(groupBills) {
                factory.groupBills = groupBills;
            }
            factory.getGroupBills = function () {
                return factory.groupBills;
            };

            return factory;

        }
    ]);