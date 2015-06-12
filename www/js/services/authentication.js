angular.module('BEEFound.services.Authentication', [])

    .service("googleApiBuilder", function($q) {
        this.loadClientCallbacks = [];

        this.build = function(requestBuilder, responseTransformer) {
            return function(args) {
                var deferred = $q.defer();
                var response;
                request = requestBuilder(args);
                request.execute(function(resp, raw) {
                    if(resp.error) {
                        deferred.reject(resp.error);
                    } else {
                        response = responseTransformer ? responseTransformer(resp) : resp;
                        deferred.resolve(response);
                    }

                });
                return deferred.promise;

            }
        };

        this.afterClientLoaded = function(callback) {
            this.loadClientCallbacks.push(callback);
        };

        this.runClientLoadedCallbacks = function() {
            for(var i=0; i < this.loadClientCallbacks.length; i++) {
                this.loadClientCallbacks[i]();
            }
        };
    })

    .provider('googleLogin', function() {

        this.configure = function(conf) {
            this.config = conf;
        };

        this.$get = function ($q, googleApiBuilder, $rootScope) {
            var config = this.config;
            var deferred = $q.defer();
            var googleapi = {
                authorize: function(options) {
                    var deferred = $.Deferred();

                    //Build the OAuth consent page URL
                    var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                        client_id: options.client_id,
                        scope: options.scope,
                        redirect_uri: options.redirect_uri,
                        response_type: 'code'
                    });

                    //Open the OAuth consent page in the InAppBrowser
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
                    $(authWindow).on('loadstart', function(e) {
                        var url = e.originalEvent.url;
                        var code = /\?code=(.+)$/.exec(url);
                        var error = /\?error=(.+)$/.exec(url);
                        console.log('E: '+e);

                        if (code || error) {
                            //Always close the browser when match is found
                            authWindow.close();
                        }

                        if (code) {
                            //Exchange the authorization code for an access token
                            $.post('https://accounts.google.com/o/oauth2/token', {
                                code: code[1],
                                client_id: options.client_id,
                                redirect_uri: options.redirect_uri,
                                scope: options.scope,
                                grant_type: 'authorization_code'
                            }).done(function(data) {
                                deferred.resolve(data);
                            }).fail(function(response) {
                                deferred.reject(response.responseJSON);
                            });
                        } else if (error) {
                            //The user denied access to the app
                            deferred.reject({
                                error: error[1]
                            });
                        }
                    });

                    return deferred.promise();
                }
            };
            return {
                login: function () {
                    gapi.auth.authorize({
                        client_id: config.clientId,
                        scope: config.scopes,
                        immediate: false
                    }, this.handleAuthResult);

                    return deferred.promise;
                },

                handleClientLoad: function () {
                    gapi.auth.init(function () { });
                    window.setTimeout(this.checkAuth, 1);
                },

                checkAuth: function() {
                    gapi.auth.authorize({
                        client_id: config.clientId,
                        scope: config.scopes,
                        immediate: true
                    }, this.handleAuthResult );
                },

                handleAuthResult: function(authResult) {
                    if (authResult && !authResult.error) {
                        var data = {};
                        $rootScope.$broadcast("google:authenticated", authResult);
                        googleApiBuilder.runClientLoadedCallbacks();
                        deferred.resolve(data);
                    } else {
                        deferred.reject(authResult.error);
                    }
                }
            }
        };


    })

    .service("googlePlus", function(googleApiBuilder, $rootScope) {

        var self = this;

        googleApiBuilder.afterClientLoaded(function() {
            gapi.client.load('plus', 'v1', function() {
                self.getPeople = googleApiBuilder.build(gapi.client.plus.people.get);
                self.getCurrentUser = function() {
                    return self.getPeople({userId: "me"});
                }
                $rootScope.$broadcast("googlePlus:loaded")
            });
        });
    })
