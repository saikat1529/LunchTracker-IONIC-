angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract:true
  })

  .state('menu.dashboard', {
    url: '/dashboard',
    views: {
      'side-menu21': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

<<<<<<< HEAD
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
  })

=======
>>>>>>> 033bd3b868ecd3c7c44126356c699d8c3bdd6f63
  .state('menu.orders', {
    url: '/orders',
    views: {
      'side-menu21': {
        templateUrl: 'templates/orders.html',
        controller: 'ordersCtrl'
      }
    }
  })

  .state('menu.payment', {
    url: '/payment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/payment.html',
        controller: 'paymentCtrl'
      }
    }
  })

  .state('menu.logOut', {
    url: '/logout',
    views: {
      'side-menu21': {
        templateUrl: 'templates/logOut.html',
        controller: 'logOutCtrl'
      }
    }
  })

<<<<<<< HEAD
$urlRouterProvider.otherwise('/login')
=======
$urlRouterProvider.otherwise('/side-menu21/dashboard')
>>>>>>> 033bd3b868ecd3c7c44126356c699d8c3bdd6f63

  

});