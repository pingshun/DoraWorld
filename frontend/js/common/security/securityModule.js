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