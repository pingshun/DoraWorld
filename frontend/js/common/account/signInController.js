common.controller('SignInController', ['$scope', '$modalInstance', 'toastr', 'dwSecurity',
    function($scope, $modalInstance, toastr, dwSecurity) {
        // Initialization
        $scope.mode = 'login';
        $scope.userData = {};

        // Interactions
        $scope.close = function() {
            $scope.cancel();
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.toggle = function() {
            if($scope.mode === 'login') {
                $scope.mode = 'register';
            } else {
                $scope.mode = 'login';
            }
            $scope.message = undefined;
        };
        $scope.formValid = function(form) {
            var valid = true;
            if(!form.username.$valid) {
                valid = false;
            }
            if($scope.mode === 'login') {
                if(!form.password.$valid) {
                    valid = false;
                }
            } else {
                if(!form.password.$valid || $scope.userData.password !== $scope.userData.password2 || !form.username.$valid) {
                    valid = false;
                }
            }
            return valid;
        };
        $scope.register = function() {
            return dwSecurity.register($scope.userData.email, $scope.userData.password, $scope.userData.username)
                .then(function(res) {
                    $scope.message = dwSecurity.lastMessage();
                }, function(err) {
                    $scope.message = dwSecurity.lastMessage();
                });
        };
        $scope.login = function() {
            return dwSecurity.login($scope.userData.username, $scope.userData.password)
                .then(function(user) {
                    toastr.success('欢迎来到哆啦e漫, ' + user.user_name, '欢迎');
                    $scope.close();
                }, function(err) {
                    $scope.message = dwSecurity.lastMessage();
                });
        };
        $scope.forgotPassword = function() {
            return dwSecurity.forgotPassword($scope.userData.username)
                .then(function(res) {
                    $scope.message = dwSecurity.lastMessage();
                }, function(err) {
                    $scope.message = dwSecurity.lastMessage();
                });
        }
    }]);