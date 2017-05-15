angular.module('familyVideo', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home',{
            url:'/',
            templateUrl: "./views/home.html",
            controller: "homeCtrl"
        })
    .state('search', {
          url: '/search/:title',
          templateUrl: './views/search.html',
          controller: "searchCtrl"
        })
    .state('account', {
          url: '/account',
          templateUrl: './views/signIn.html',
          controller: "signInCtrl"
            })
    .state('createAccount', {
          url: '/account/create',
          templateUrl: './views/createAccount.html',
          controller: "createAccountCtrl"
            })
    .state('checkout', {
          url: '/checkout',
          templateUrl: './views/checkout.html',
          controller: "checkoutCtrl"
            })
    .state('verify', {
          url: '/checkout/verify',
          templateUrl: './views/verify.html',
          controller: "verifyCtrl"
            })
    .state('signedIn', {
          url: '/signedIn',
          templateUrl: './views/signedIn.html',
          controller: "signedInCtrl"
            })
    .state('accountCreated', {
          url: '/accountCreated',
          templateUrl: './views/accountCreated.html',
          controller: "accountCreatedCtrl"
        })
    .state('checkedOut', {
          url: '/checkedOut',
          templateUrl: './views/checkedOut.html',
          controller: "checkedOutCtrl"
        });

    $urlRouterProvider
        .otherwise('/');
});
