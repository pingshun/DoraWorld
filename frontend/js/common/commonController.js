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

