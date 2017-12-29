var doraWorld = angular.module('doraWorld',
    [
        'ui.router', 'duScroll', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar', 'toastr',
        'common', 'dw.controllers'
    ]
);

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