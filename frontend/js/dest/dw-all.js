var doraWorld = angular.module('doraWorld', [ 'ui.router', 'duScroll', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar', 'toastr', 'bootstrap-switch', 'common', 'dw.controllers']);

doraWorld.config(['$urlRouterProvider', '$locationProvider', '$stateProvider', function($urlRouterProvider, $locationProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
}]);

/**
 * Config
 */
doraWorld.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/templates/home/homePage.html',
            controller: 'HomePageController'
        })
        .state('pic_wall', {
            url: '/pic_wall',
            templateUrl: '/templates/pic_wall/picWall.html',
            controller: 'PicWallController',
            resolve: {
                test_str: ['$stateParams', function($stateParams) {
                    return 'this is a test';
                }]
            }
        })
        .state('about', {
            url: '/about',
            templateUrl: '/templates/about/about.html',
            controller: 'AboutController',
        });
}]);
var dwControllers = angular.module('dw.controllers', []);
dwControllers.controller('AboutController', [function () {}]);
var common = angular.module('common', ['ngCookies']);

common.controller('MainMenuController', ['$rootScope', '$scope', '$state', 'toastr', 'commonModalFactory', 'dwSecurity', function($rootScope, $scope, $state, toastr, commonModalFactory, dwSecurity) {
    // Initialization
    $scope.menuOpened = false;
    var _defaultMenu = {
        buttons: [
            {
                name: '登录注册',
                icon: 'sign-in',
                click: function() {
                    $scope.closeMenu();
                    commonModalFactory.showSignInModal();
                }
            }
        ],
        navigations: [
            {
                name: '首页',
                icon: 'home',
                click: function() {
                    $scope.closeMenu();
                    $state.go('home');
                }
            },
            {
                name: '照片墙',
                icon: 'photo',
                click: function() {
                    $scope.closeMenu();
                    $state.go('pic_wall');
                }
            },
            { name: '讨论专区', icon: 'comments-o' },
            { name: '数据统计', icon: 'area-chart' },
            {
                name: '关于本站',
                icon: 'info',
                click: function() {
                    $scope.closeMenu();
                    $state.go('about');
                }
            }
        ]
    };

    var _availableButtons = {
        signIn: {
            name: '登录注册',
            icon: 'sign-in',
            click: function() {
                $scope.closeMenu();
                commonModalFactory.showSignInModal();
            }
        },
        signOut: {
            name: '退出登录',
            icon: 'sign-out',
            click: function() {
                dwSecurity.logout()
                    .then(function(res) {
                        toastr.success('bye~');
                    });
                $scope.closeMenu();
            }
        },
        currentUser: {
            name: '用户中心',
            icon: 'user-circle',
            click: function () {
                $scope.closeMenu();
                $state.go('current_user');
            }
        },
        addAlbum: {
            name: '创建专辑',
            icon: 'plus-square',
            click: function() {
                //tutorialsModalFactory.showAddAlbumModal();
                $scope.closeMenu();
            }
        },
        addArticle: {
            name: '撰写文章',
            icon: 'pencil-square',
            click: function() {

                $scope.closeMenu();
            }
        }
    };

    $scope.menu = angular.copy(_defaultMenu);


    // Interactions
    $scope.toggleMenu = function() {
        $scope.menuOpened = !$scope.menuOpened;
    };
    $scope.closeMenu = function() {
        $scope.menuOpened = false;
    };


    // System Events
    $scope.$on('dw::security::login', function() {
        $rootScope.user = dwSecurity.currentUser();
        console.log($rootScope.user);
        _setButtons([ 'addArticle', 'addAlbum', 'currentUser' ]);
    });
    $scope.$on('dw::security::logout', function() {
        $rootScope.user = dwSecurity.currentUser();
        _setButtons();
    });

    // Menu Events
    $scope.$on('cc::menu::close', function() {
        $scope.closeMenu();
    });
    $scope.$on('cc::menu::reset', function() {
        $scope.menu.buttons = angular.copy(_defaultMenu);
    });
    $scope.$on('cc::menu::set-buttons', _setButtons);

    function _setButtons(buttons) {
        var buttonList = [];
        angular.forEach(buttons, function(buttonName) {
            if(_availableButtons[buttonName]) {
                buttonList.push(_availableButtons[buttonName]);
            }
        });
        if($rootScope.user && $rootScope.user.id) {
            buttonList.push(_availableButtons.signOut);
        } else {
            buttonList.push(_availableButtons.signIn)
        }
        $scope.menu.buttons = angular.copy(buttonList);
    }


    // Profile Events
    $scope.viewProfile = function() {
        if($rootScope.user && $rootScope.user._id) {
            $state.go('profile', { id: $rootScope.user._id });
        }
    };
}]);


common.directive('busy', [function() {
    return {
        restrict: 'A',
        template: '<button class="btn btn-sm" ng-click="click()" ng-disabled="disabled() || isBusy"> <span ng-if="isBusy"><i ng-class="icon"></i></span> <span ng-transclude></span> </button>',
        replace: true,
        transclude: true,
        scope: {
            busy: '&',
            busyIcon: '@',
            busyDisabled: '&'
        },
        link: function(scope, element, attrs) {
            scope.isBusy = false;
            scope.icon = scope.busyIcon || 'fa fa-spinner fa-spin';
            scope.disabled = scope.busyDisabled || function () {
                    return false;
                };

            scope.click = function() {
                var promise = scope.busy();
                if (typeof promise == 'object' && typeof promise.finally == 'function') {
                    scope.isBusy = true;
                    promise.finally(function () {
                        scope.isBusy = false;
                    });
                }
            }
        }
    }
}]);
/**
 * Modal Factory Services
 */
common.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('current_user', {
            url: '/c_user',
            templateUrl: '/templates/common/account/currentUser.html',
            controller: 'CurrentUserController'
        })
}]);

common.factory('commonModalFactory', ['$modal', function($modal) {
    return {
        showSignInModal: function() {
            var modal = $modal.open({
                templateUrl: '/templates/common/account/sign_in.html',
                controller: 'SignInController'
            });
            return modal.result;
        },
        showPagedownHelpModal: function() {
            var modal = $modal.open({
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
common.factory('commonUtils', [function() {
    return {
        random_string: function (len) {
            len = len || 32;
            var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var maxPos = $chars.length;
            var str = '';
            for (var i = 0; i < len; i++) {
                str += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        }
    }
}]);
var CONSTANT = {
    HOST: 'http://localhost:3001/',
}
dwControllers.controller('HomePageController', ['$state', '$scope', function($state, $scope) {

    $scope.toAlbums = function() {
        $state.go('albums');
    };
    $scope.join = function() {
        //frameworkModalFactory.showSignInModal();
    };
}]);
dwControllers.controller('PicWallController', ['$state', '$scope', '$window', '$http', 'test_str',
    function($state, $scope, $window, $http, test_str) {

    $scope.test_str = test_str;
    $scope.pics = [];

    $scope.getAllPics = function() {
        $http.get("/api/pic_wall/gets_all").success(function(data){
            $scope.pics = data;
        })
    }

    //点击图片时放大显示图片
    $scope.changePic=function($event){
        var img=$event.srcElement || $event.target;

        var w = angular.element($window);
        console.log(w);

        angular.element("#bigimage")[0].src=img.src;
        angular.element("#js-imgview")[0].style.display="block";
        angular.element("#js-imgview-mask")[0].style.display="block";
    }
    //点击图片时放小显示图片
    $scope.closePic =function(){
        angular.element("#js-imgview")[0].style.display="none";
        angular.element("#js-imgview-mask")[0].style.display="none";

    }

    $scope.getAllPics();
}]);
common.controller('CurrentUserController', [function () {

}]);
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
/**
 * Security API
 */
common.factory('dwSecurityApi', ['$http', 'promiseService', function($http, promiseService) {
	return {
        register: function(email, password, username) {
            return promiseService.wrap(function(promise) {
                $http.post(CONSTANT.HOST + 'api/account/register', { email:email, password: password, username: username })
                    .then(function(res) {
                        promise.resolve(res.data);
                    }, promise.reject);
            });
        },
        login: function(username, password) {
            return promiseService.wrap(function(promise) {
                $http.post(CONSTANT.HOST + 'login', { username: username, password: password }).then(function(res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        },
        logout: function() {
            return promiseService.wrap(function(promise) {
                $http.post(CONSTANT.HOST + 'logout').then(function(res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        },
        getCurrentUser: function() {
            return promiseService.wrap(function(promise) {
                $http.get(CONSTANT.HOST + 'current_user').then(function (res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        },
        forgotPassword: function(username) {
            return promiseService.wrap(function(promise) {
                $http.post(CONSTANT.HOST + 'api/account/forgot_password', { user_name: username }).then(function(res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        },
		/*



		activate: function(hashCode) {
			return promiseService.wrap(function(promise) {
				$http.post(apiConfig.host + 'api/activate', { hashCode: hashCode })
					.then(function(res) {
						promise.resolve(res.data);
					}, promise.reject);
			});
		},

		resetPassword: function(hashCode, password) {
			return promiseService.wrap(function(promise) {
				$http.post(apiConfig.host + 'api/reset-password', { hashCode: hashCode, password: password }).then(function(res) {
					promise.resolve(res.data);
				}, promise.reject);
			});
		}*/
	}
}]);


/**
 * Security Services
 */
common.provider('dwSecurity', ['$httpProvider', function() {
	var _lastMessage = undefined;

    return {
    	$get: ['$rootScope', 'dwSecurityApi', 'localStore', 'promiseService', function($rootScope, dwSecurityApi, localStore, promiseService) {
            var _user = _getUser();
            function _getUser() {
                return localStore.getItem('user');
            }
            function _setUser(user) {
                localStore.setItem('user', user);
                return user;
            }
            function _removeUser() {
                localStore.removeItem('user');
                _user = undefined;
            }
            dwSecurityApi.getCurrentUser().then(function (res) {
                if (res.user !== null) {
                    _user = _setUser(res.user);
                    $rootScope.$broadcast('dw::security::login', _user);
                }
            })

			 $rootScope.$on('dw::security::logout', function () {
			 localStore.removeItem('user');
			 });


			return {
                lastMessage: function () {
                    return _lastMessage;
                },
                currentUser: function () {
                    return _user;
                },
                register: function(email, password, username) {
                    return promiseService.wrap(function(promise) {
                        dwSecurityApi.register(email, password, username)
                            .then(function(res) {
                            	if (res.error) {
                                    _lastMessage = {
                                        type: 'warning',
                                        text: res.message
                                    };
								} else {
                                    _lastMessage = {
                                        type: 'warning',
                                        text: res.message
                                    };
								}
                                promise.resolve();
                            }, function(err) {
                                if(err.status === 400) {
                                    _lastMessage = {
                                        type: 'danger',
                                        text: '您刚刚提交了一个无效的请求, 请通过源艺页面提交注册.'
                                    }
                                } else {
                                    _lastMessage = {
                                        type: 'danger',
                                        text: '用户注册遇到问题, 请您稍后重试.'
                                    }
                                }
                                promise.reject(err);
                            });
                    });
                },

                login: function(username, password) {
                    return promiseService.wrap(function(promise) {
                        dwSecurityApi.login(username, password)
                            .then(function(res) {
                                if(res.user) {
                                    _setUser(res.user);
                                    _user = _getUser();
                                    $rootScope.$broadcast('dw::security::login', _user);
                                    promise.resolve(res.user);
                                } else {
                                    _removeUser();
                                    promise.reject();
                                }
                            }, function(err) {
                                if(err.status === 404) {
                                    _lastMessage = {
                                        type: 'danger',
                                        text: '身份验证失败, 请检查您输入的电子邮箱和登录密码.'
                                    };
                                } else {
                                    _lastMessage = {
                                        type: 'danger',
                                        text: '身份验证遇到问题, 请稍后重试.'
                                    }
                                }
                                _removeUser();
                                promise.reject(err);
                            });
                    });
                },
                logout: function() {
                    return promiseService.wrap(function(promise) {
                        dwSecurityApi.logout()
                            .then(function(res) {
                                _removeUser();
                                $rootScope.$broadcast('dw::security::logout');
                                promise.resolve();
                            }, function(err) {
                                _removeUser();
                                promise.reject(err);
                            });
                    });
                },
                forgotPassword: function(user_name) {
                    return promiseService.wrap(function(promise) {
                        dwSecurityApi.forgotPassword(user_name)
                            .then(function(res) {
                                if(res.message == 'Email sent.') {
                                    _lastMessage = {
                                        type: 'info',
                                        text: '密码重置链接已发送至您的邮箱, 请登录邮箱并重置您的密码.'
                                    };
                                }
                                promise.resolve();
                            }, function(err) {
                                if(err.status === 404) {
                                    _lastMessage = {
                                        type: 'warning',
                                        text: '该邮箱尚未注册, 请您检查输入的用户名或进行注册.'
                                    }
                                } else {
                                    _lastMessage = {
                                        type: 'danger',
                                        text: '找回密码遇到问题, 请您稍后重试.'
                                    }
                                }
                                promise.reject(err);
                            });
                    });
                },

				/*

				activate: function(hashCode) {
					return promiseService.wrap(function(promise) {
						securityApi.activate(hashCode)
							.then(function(res) {
								_lastMessage = {
									type: 'info',
									text: '源艺账户已经激活, 您随时可以通过右下角的菜单进行登录.'
								};
								promise.resolve();
							}, function(err) {
								if(err.status === 400) {
									_lastMessage = {
										type: 'danger',
										text: '您刚刚提交了一个无效的请求, 请点击您的源艺邮件中的链接进行账户激活.'
									}
								}
								else if(err.status === 404){
									_lastMessage = {
										type: 'warning',
										text: '您的激活链接已经过期, 请重新注册并获得新的激活链接.'
									}
								}
								else {
									_lastMessage = {
										type: 'danger',
										text: '账户激活遇到问题, 请您稍后重试或者联系 codecraft_cn@126.com 我们会努力解决您的问题.'
									}
								}
								promise.reject(err);
							});
					});
				},

				resetPassword: function(hashCode, password) {
					return promiseService.wrap(function(promise) {
						securityApi.resetPassword(hashCode, password)
							.then(function(res) {
								if(res.message == 'Password reset.') {
									_lastMessage = {
										type: 'info',
										text: '您的源艺密码已重置, 可以随时使用新密码进行登录.'
									};
								}
								promise.resolve();
							}, function(err) {
								if(err.status === 404) {
									_lastMessage = {
										type: 'warning',
										text: '您的重置链接已过期, 请在登录页面输入电子邮箱并重新获取密码重置链接, 如有进一步的问题, 请联系 codecraft_cn@126.com ,我们会努力解决您的问题.'
									}
								} else {
									_lastMessage = {
										type: 'danger',
										text: '重置密码遇到问题, 请您稍后重试或者联系 codecraft_cn@126.com 我们会努力解决您的问题.'
									}
								}
								promise.reject(err);
							});
					});
				}*/
    		}
    	}]
    }
}]);