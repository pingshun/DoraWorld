/**
 * Modal Factory Services
 */
common.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('user_profile', {
            url: '/user_profile?id=',
            templateUrl: '/templates/common/account/userProfile.html',
            controller: 'UserProfileController',
            resolve: {
                user: ['$stateParams', 'userApi', function($stateParams, userApi) {
                    return userApi.getUserById($stateParams.id, 'profile');
                }]
            }
        })
}]);

common.factory('commonModalFactory', ['$uibModal', function($uibModal) {
    return {
        showSignInModal: function() {
            var modal = $uibModal.open({
                templateUrl: '/templates/common/account/sign_in.html',
                controller: 'SignInController'
            });
            return modal.result;
        },
        showPagedownHelpModal: function() {
            var modal = $uibModal.open({
                templateUrl: '/modules/framework/pagedownHelpModal.html',
                controller: 'PagedownHelpModalController'
            });
            return modal.result;
        }
    }
}]);


/**
 * SafeApply Service
 */
common.factory('safeApply', ['$rootScope', function ($rootScope) {
    return function (fn) {
        if ($rootScope.$$phase) {
            fn();
        } else {
            $rootScope.$apply(fn);
        }
    };
}]);


/**
 * Promise Service
 */
common.factory('promiseService', ['$q', 'safeApply',
    function ($q, safeApply) {
        var _defer = function() {
            var deferred = $q.defer();

            return {
                resolve: function (response) {
                    safeApply(function () {
                        deferred.resolve(response);
                    });

                },
                reject: function (response) {
                    safeApply(function () {
                        deferred.reject(response);
                    });

                },
                promise: deferred.promise
            }
        };

        var _chainAll = function (action, list) {
            var deferred = $q.defer();
            var chain = deferred.promise;
            var results = [];

            action(list);

            var chainItem = function(item) {
                return chain.then(function (result) {
                    if (result instanceof Array) {
                        results = results.concat(result);
                    } else if (result) {
                        results.push(result);
                    }

                    return (item ? item() : results);
                }, function (err) {
                    throw err;
                });
            };

            angular.forEach(list, function (item) {
                chain = chainItem(item);
            });

            deferred.resolve();

            return chainItem();
        };

        var _wrapAll = function (action, list) {
            action(list);

            return $q.all(list);
        };

        return {
            all: function (promises) {
                return $q.all(promises);
            },
            chain: function (action) {
                return _chainAll(action, []);
            },
            wrap: function(action) {
                var deferred = _defer();

                action(deferred);

                return deferred.promise;
            },
            wrapAll: function (action) {
                return _wrapAll(action, []);
            },
            arrayWrap: function (action) {
                return _wrapAll(action, []);
            },
            objectWrap: function (action) {
                return _wrapAll(action, {});
            },
            throwError: function (err) {
                throw err;
            },
            defer: _defer
        }
    }]);


/**
 * Local Storage
 */
common.factory('localStore', ['$cookieStore', '$window',
    function($cookieStore, $window) {
        return {
            setItem: function(key, value) {
                if($window.localStorage) {
                    $window.localStorage.setItem(key, JSON.stringify(value));
                } else{
                    $cookieStore.put(key, value);
                }
            },
            getItem: function(key, defaultValue) {
                if($window.localStorage) {
                    return JSON.parse($window.localStorage.getItem(key)) || defaultValue;
                } else{
                    return $cookieStore.get(key) || defaultValue;
                }
            },
            removeItem: function(key) {
                if($window.localStorage) {
                    $window.localStorage.removeItem(key);
                } else{
                    $cookieStore.remove(key);
                }
            }
        }
    }]);