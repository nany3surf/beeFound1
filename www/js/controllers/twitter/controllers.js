angular.module('tweetsController', [])
    .controller('tweetsController' , function($scope, $ocLazyLoad, $timeout) {

    $ocLazyLoad.load("js/lib/twitter-timeline.js")
        .then(function() {
            console.log('twitter-timeline.js Cargado');
        }, function(e) {
            console.log('Error, twitter-timeline.js no cargado');
            console.error(e);
        });
});