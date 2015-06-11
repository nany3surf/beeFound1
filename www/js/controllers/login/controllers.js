/**
 * Created by danielalorenzo on 3/6/15.
 */
angular.module('loginController', [])
    .controller('LoginController', function($scope, googleapi) {

        // This flag we use to show or hide the button in our HTML.
    /*    $scope.signedIn = false;
        $scope.message = null;*/

        $scope.client_id = '943071059112-ml56hbmgg8uhjam96bjhq66kotbj491a.apps.googleusercontent.com';
        $scope.client_secret = 'vVfNlfcgAsY3AwbQBbXntk8P';
        $scope.redirect_uri = 'http://localhost';
        /*scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.login',*/
        $scope.scope = 'https://www.googleapis.com/auth/userinfo.profile';

        $scope.clickMe = function(clickEvent){
            console.log('entro con el click');
            /* Show the consent page */
            googleapi.authorize({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret,
                redirect_uri: $scope.redirect_uri,
                scope: $scope.scope
            }).done(function() {
                console.log("correcto login");
                /* Show the greet view if access is granted */
                $scope.showGreetView();

            }).fail(function(data) {
                console.log("fail login");
                /* Show an error message if access was denied */
                $('#login p').html(data.error);
            });
        }

        $scope.showLoginView = function(){
            console.log("entro en show login");
            $('#googleOut').hide();
            $('#greet').hide();
            $('#googleIn').show();
        }

        $scope.showGreetView = function() {
            console.log("entro en show greet");
            $('#googleIn').hide();
            $('#googleOut').show();
            $('#greet').show();

            /* Get the token, either from the cache or by using the refresh token. */
            googleapi.getToken({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret
            }).then(function(data) {
                /* Pass the token to the API call and return a new promise object */
                return googleapi.userInfo({ access_token: data.access_token });
            }).done(function(user) {
                /* Display a greeting if the API call was successful */
                $('#greet h1').html('Hello ' + user.name + '!');
                $('#disconnect a').on('click', function() {
                    $scope.onLogoutButtonClick();
                });
            }).fail(function() {
                /* If getting the token fails, or the token has been revoked, show the login view. */
                $scope.showLoginView();
            });
        }

        $scope.onLoginButtonClick = function() {
            /* Show the consent page */
            googleapi.authorize({
                client_id: $scope.client_id,
                client_secret: $scope.client_secret,
                redirect_uri: $scope.redirect_uri,
                scope: $scope.scope
            }).done(function() {
                /* Show the greet view if access is granted */
                $scope.showGreetView();

            }).fail(function(data) {
                /* Show an error message if access was denied */
                $('#login p').html(data.error);
            });
        }

        $scope.onLogoutButtonClick = function() {

            /*  Check if we have a valid token cached or if we can get a new one using a refresh token.
                Get the token, either from the cache or by using the refresh token.
             */
            googleapi.getToken({
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
                    },
                    error: function(e) {
                        $('#disconnect p').html(data.error);
                    }
                });
            });
        };

        googleapi.getToken({
            client_id: $scope.client_id,
            client_secret: $scope.client_secret
        }).done(function() {
            /* Show the greet view if we get a valid token */
            console.log("entro en done");
            $scope.showGreetView();
        }).fail(function() {
            console.log("entro en fail");
            /* Show the login view if we have no valid token */
            $scope.showLoginView();
        });

    });