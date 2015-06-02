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
var googleapi = {
    setToken: function(data) {
        /* Cache the token */
        localStorage.access_token = data.access_token;

        /* Cache the refresh token, if there is one */
        localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;

        /* Figure out when the token will expire by using the current time, plus the valid time (in seconds), minus a 1 minute buffer */
        var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) * 1000 - 60000;
        localStorage.expires_at = expiresAt;
    },
    authorize: function(options) {
        var deferred = $.Deferred();

        /* Build the OAuth consent page URL */
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        /* Open the OAuth consent page in the InAppBrowser */
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        authWindow.addEventListener('loadstart', googleCallback);
        function googleCallback(e){
            var url = (typeof e.url !== 'undefined' ? e.url : e.originalEvent.url);
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                /* Always close the browser when match is found */
                authWindow.close();
            }

            if (code) {
                /* Exchange the authorization code for an access token */
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    googleapi.setToken(data);
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                /* The user denied access to the app */
                deferred.reject({
                    error: error[1]
                });
            }
        }

        return deferred.promise();
    },
    getToken: function(options) {
        var deferred = $.Deferred();

        if (new Date().getTime() < localStorage.expires_at) {
            deferred.resolve({
                access_token: localStorage.access_token
            });
        } else if (localStorage.refresh_token) {
            $.post('https://accounts.google.com/o/oauth2/token', {
                refresh_token: localStorage.refresh_token,
                client_id: options.client_id,
                client_secret: options.client_secret,
                grant_type: 'refresh_token'
            }).done(function(data) {
                googleapi.setToken(data);
                deferred.resolve(data);
            }).fail(function(response) {
                deferred.reject(response.responseJSON);
            });
        } else {
            deferred.reject();
        }

        return deferred.promise();
    },
    userInfo: function(options) {
        return $.getJSON('https://www.googleapis.com/oauth2/v1/userinfo', options);
    }
};

var app = {
    /*client_id: '943071059112-ml56hbmgg8uhjam96bjhq66kotbj491a.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/userinfo.profile', //'https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/plus.login, https://www.googleapis.com/auth/calendar',
    redirect_uri: 'http://localhost',*/
    client_id: '943071059112-ml56hbmgg8uhjam96bjhq66kotbj491a.apps.googleusercontent.com',
    client_secret: 'vVfNlfcgAsY3AwbQBbXntk8P',
    redirect_uri: 'http://localhost',
    /*scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login',*/
    scope: 'https://www.googleapis.com/auth/userinfo.profile',


    init: function() {
        $(document).on('click', '#login a', function() {
            app.onLoginButtonClick();
        });

        /* Check if we have a valid token cached or if we can get a new one using a refresh token. */
        googleapi.getToken({
            client_id: app.client_id,
            client_secret: app.client_secret
        }).done(function() {
            /* Show the greet view if we get a valid token */
            app.showGreetView();
        }).fail(function() {
            /* Show the login view if we have no valid token */
            app.showLoginView();
        });
    },
    showLoginView: function() {
        $('#disconnect').hide();
        $('#greet').hide();
        $('#login').show();
    },
    showGreetView: function() {
        $('#login').hide();
        $('#disconnect').show();
        $('#greet').show();

        /* Get the token, either from the cache or by using the refresh token. */
        googleapi.getToken({
            client_id: app.client_id,
            client_secret: app.client_secret
        }).then(function(data) {
            /* Pass the token to the API call and return a new promise object */
            return googleapi.userInfo({ access_token: data.access_token });
        }).done(function(user) {
            /* Display a greeting if the API call was successful */
            $('#greet h1').html('Hello ' + user.name + '!');
            $('#disconnect a').on('click', function() {
                app.onLogoutButtonClick();
            });
        }).fail(function() {
            /* If getting the token fails, or the token has been revoked, show the login view. */
            app.showLoginView();
        });
    },
    onLoginButtonClick: function() {
        /* Show the consent page */
        googleapi.authorize({
            client_id: app.client_id,
            client_secret: app.client_secret,
            redirect_uri: app.redirect_uri,
            scope: app.scope
        }).done(function() {
            /* Show the greet view if access is granted */
            app.showGreetView();

        }).fail(function(data) {
            /* Show an error message if access was denied */
            $('#login p').html(data.error);
        });
    },
    onLogoutButtonClick: function() {

        /*  Check if we have a valid token cached or if we can get a new one using a refresh token.
            Get the token, either from the cache or by using the refresh token.
         */
        googleapi.getToken({
            client_id: app.client_id,
            client_secret: app.client_secret
        }).then(function(data) {
            /* Pass the token to the API call and return a new promise object */
            var accessToken = data.access_token;
            var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token='+accessToken;

            /* Perform an asynchronous GET request. */
            $.ajax({
                type: 'GET',
                url: revokeUrl,
                async: false,
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(nullResponse) {
                    /* Do something now that user is disconnected. The response is always undefined. */
                    app.showLoginView();
                    accessToken = null;
                },
                error: function(e) {
                    $('#disconnect p').html(data.error);
                }
            });
        });
    },

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

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        app.init();
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

        $(window).swipe({
            swipeLeft: function() {
                $.sidr('close', 'sidrNav');
            },
            swipeRight: function() {
                $.sidr('open', 'sidrNav');
            }
        });
    }
};

/*$(document).on('deviceready', function() {
    app.init();
});*/

app.initialize();