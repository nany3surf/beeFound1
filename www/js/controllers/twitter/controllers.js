angular.module('tweetsController', [])
    .controller('tweetsController' , function($scope, $ocLazyLoad) {

        $ocLazyLoad.load("js/lib/twitter-timeline.js")
            .then(function() {
                console.log('twitter-timeline.js Cargado');
            }, function(e) {
                console.log('Error, twitter-timeline.js no cargado');
                console.error(e);
            });

        // Redimensionamos widget
        angular.element(document).ready(function() {
            var $frameTwitter = $('iframe#twitter-widget-0');

            setInterval(function() {
                $frameTwitter
                    .removeAttr('height')
                    .css({'width': '100%' , 'height' : '480'});
            }, 0);

        });

    });
