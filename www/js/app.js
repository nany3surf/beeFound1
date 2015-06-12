var beef = angular.module('beefound', [
    'ngRoute',
    'BEEFound.services.Users',
    'tweetsController',
    'finderController',
    'loginController',
    'blogController',
    'navbarController',
    'ngSanitize',
    'slugifier',
    'truncate'
]);


beef.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl:'templates/finder/users.html',
            controller: 'FinderController',
            reloadOnSearch: false
        })
        .when('/finder', {
            templateUrl:'templates/finder/users.html',
            controller: 'FinderController',
            reloadOnSearch: false
        })
        .when('/finder/user/:id', {
            templateUrl:'templates/finder/user.html',
            controller: 'FinderUserController',
            reloadOnSearch: false
        })
        .when('/twitter', {
            templateUrl:'templates/twitter/tweets.html',
            controller : 'tweetsController'
        })
        .when('/login', {
            /*templateUrl:'templates/login/login.html',*/
            controller: 'loginController'
        })
        .when('/blog', {
            templateUrl:'templates/blog/blog.html',
            controller : 'blogController'
        })
        .when('/blog/:slug', {
            templateUrl:'templates/blog/blog_content.html',
            controller : 'blogContentController'
        })
        .otherwise({
            redirectTo: '/finder'
        });

});

