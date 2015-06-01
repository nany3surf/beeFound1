/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $(document).ready(function() {
            app.onDeviceReady();
        });

        /*
        var beef = angular.module('beefound', [
            'ngRoute',
            'ngCookies',
            'ngTweets',
            'ngSanitize',
        ]);
        */

        var beef = angular.module('beefound', [
            'ngRoute',
            'ngCookies' ,
            'oc.lazyLoad'
        ]);


        beef.config(function($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl:'templates/pepe.html',
                    reloadOnSearch: false,
                    controller : 'homeController'
                })
                .when('/tweets', {
                    templateUrl:'templates/tweets.html',
                    controller : 'tweetsController'

                })
                .otherwise({
                    redirectTo: '/'
                });

        });

        // Controlador
        beef.controller('tweetsController' , function($scope, $ocLazyLoad) {

            $ocLazyLoad.load("js/lib/twitter-timeline.js")
                .then(function() {
                        console.log('twitter-timeline.js Cargado');
                }, function(e) {
                        console.log('Error, twitter-timeline.js no cargado');
                        console.error(e);
                });

            // Redimensionamos widget
            angular.element(document).ready(function() {
                setInterval(function() {
                    $('iframe#twitter-widget-0').removeAttr('height');
                    $('iframe#twitter-widget-0').css({'width': '100%' , 'height' : '480'});
                } , 0);

            });

        });


        beef.controller('homeController' , function($scope) {

        });

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        $('.btn-navbar').sidr({
            name: 'sidrNav',
            source: '.menu-sdr'
        });

        $(document).bind('click', function () {
            $.sidr('close', 'sidrNav');
        });

        $(window).resize(function() {
            if ($(document).width() > 580) {
                $.sidr('close', 'sidrNav');
            }
        });


    }
};

app.initialize();