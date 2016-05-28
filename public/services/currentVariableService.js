angular.module('split')
    .factory('$currentVariableService', [
        function() {
            var factory = {
                user:"",
                group:""
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

            return factory;

        }
    ]);