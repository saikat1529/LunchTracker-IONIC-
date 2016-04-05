angular.module('app.controllers', [])
     
.controller('dashboardCtrl', function($scope, $http) {
	$http.get('http://localhost/lunchmaker/api/todays_menu.php').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
})
   
.controller('ordersCtrl', function($scope) {

})
   
.controller('paymentCtrl', function($scope) {

})
   
.controller('logOutCtrl', function($scope) {

})
 