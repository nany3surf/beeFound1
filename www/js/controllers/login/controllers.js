angular.module('loginController', ["BEEFound.services.Authentication"])

    .controller('loginController', ['$scope', 'googleApi', function ($scope, googleApi) {

        $scope.client_id = '943071059112-ml56hbmgg8uhjam96bjhq66kotbj491a.apps.googleusercontent.com';
        $scope.client_secret = 'vVfNlfcgAsY3AwbQBbXntk8P';
        $scope.redirect_uri = 'http://localhost';
        $scope.scope = 'https://www.googleapis.com/auth/userinfo.profile';
        $scope.signedIn = false;

        $(document).on('click', '#login a', function() {
            $('#disconnect').hide();
            $scope.onLoginButtonClick();
        });

        $(document).on('click', '#disconnect a', function() {
            $scope.onLogoutButtonClick();
        });

        $scope.showLoginView = function() {
            $('#disconnect').hide();
            $('#greet').hide();
            $('#login').show();
        };

        $scope.showGreetView = function() {
            $('#login').hide();
            $('#disconnect').show();
            $('#greet').show();

            /* Get the token, either from the cache or by using the refresh token. */
            googleApi.getToken({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret
            }).then(function(data) {
                /* Pass the token to the API call and return a new promise object */
                return googleApi.userInfo({ access_token: data.access_token });
            }).done(function(user) {
                /* Display a greeting if the API call was successful */
                $('#greet h1').html('Hello ' + user.name + '!');
                $scope.signedIn = true;
            }).fail(function() {
                /* If getting the token fails, or the token has been revoked, show the login view. */
                $scope.showLoginView();
                $scope.signedIn = false;
            });
        };

        $scope.onLoginButtonClick = function() {
            /* Show the consent page */
            googleApi.authorize({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret,
                redirect_uri: $scope.redirect_uri,
                scope: $scope.scope
            }).done(function() {
                /* Show the greet view if access is granted */
                $scope.showGreetView();
                $scope.signedIn = true;

            }).fail(function(data) {
                /* Show an error message if access was denied */
                $('#login p').html(data.error);
            });
        };

        $scope.onLogoutButtonClick = function() {

            /*  Check if we have a valid token cached or if we can get a new one using a refresh token.
                Get the token, either from the cache or by using the refresh token.
             */
            googleApi.getToken({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret
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
                        $scope.showLoginView();
                        accessToken = null;
                        $scope.signedIn = false;
                    },
                    error: function(e) {
                        $('#disconnect p').html(data.error);
                    }
                });
            });
        };

/*        *//* Check if we have a valid token cached or if we can get a new one using a refresh token. *//*
        googleApi.getToken({
            client_id: $scope.client_id,
            client_secret: $scope.client_secret
        }).done(function() {
            *//* Show the greet view if we get a valid token *//*
            $scope.showGreetView();
            $scope.signedIn = true;
        }).fail(function() {
            *//* Show the login view if we have no valid token *//*
            $scope.showLoginView();
            $scope.signedIn = false;
        });*/

    }]
);