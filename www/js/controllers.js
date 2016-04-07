angular.module('app.controllers', [])
     
.controller('dashboardCtrl',['$scope', '$http', '$ionicPopup', '$timeout', function($scope, $http, $ionicPopup, $timeout) {

  $scope.foil = "no";
	$http.get('http://192.168.5.202/lunchmaker/api/todays_menu.php')
  .then(function(resp) {
	$scope.menu_one_name = resp.data.menus[0].name+" ("+resp.data.menus[0].price+")";
	$scope.menu_one_id = resp.data.menus[0].id;
	$scope.menu_two_name = resp.data.menus[1].name+" ("+resp.data.menus[1].price+")";
	$scope.menu_two_id = resp.data.menus[1].id;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
  $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6').then(function(resp) {
  $scope.total_due = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  // $scope.radioChange = function(item) {
  //   $scope.menu_id = item;
  //   alert(item);
  //   alert($scope.menu_id);
  // } 
  $scope.submit = function(){
    if(angular.isDefined($scope.menu)){
        var req = {
       method: 'POST',
       url: 'http://192.168.5.202/lunchmaker/api/place_order.php',
       headers: {
         'Content-Type': undefined
       },
       data: { uid: '6', mid: $scope.menu, foil: $scope.foil, status: 'unpaid' }
      }
      $http(req)
      .then(function(responses){
        var mypop = $ionicPopup.alert({
          title: 'Order Placed Successfully',
        });
        mypop.then(function(res){
          $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6')
         .success(function(newItems) {
           $scope.items = newItems.count;
           $scope.total_due = "BDT " + newItems.count;
           $ionicHistory.clearCache();
            $state.go($state.current, {}, { reload: true });
         })
         .finally(function() {
           // Stop the ion-refresher from spinning
           $scope.$broadcast('scroll.refreshComplete');
         });
        });
        //$timeout(function() {mypop.close();},3000);
      });
    }
    else{
      var mypop = $ionicPopup.alert({
          title: 'please select your menu',
        });
        mypop.then(function(res){
          console.log('Tapped!', res);
        });
    }
    // var req = {
    //  method: 'POST',
    //  url: 'http://192.168.5.202/lunchmaker/api/place_order.php',
    //  headers: {
    //    'Content-Type': undefined
    //  },
    //  data: { uid: '6', mid: $scope.menu, foil: $scope.foil, status: 'unpaid' }
    // }
    // $http(req)
    // .then(function(responses){
    //   var mypop = $ionicPopup.alert({
    //     title: 'Order Placed Successfully',
    //   });
    //   mypop.then(function(res){
    //     $state.go('app.fooDestinationView')
    //     console.log('Tapped!', res);
    //   });
    //   //$timeout(function() {mypop.close();},3000);
    // });
  };

  $scope.doRefresh = function() {
    $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6')
     .success(function(newItems) {
       $scope.items = newItems.count;
       $scope.total_due = "BDT " + newItems.count;
       $ionicHistory.clearCache();
        $state.go($state.current, {}, { reload: true });
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  // $scope.doRefresh = function() {
  //   $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6')
  //    .success(function(resp) {
  //      $scope.total_due = "BDT "+resp.data.count;
  //      alert($scope.total_due);
  //    })
  //    .finally(function() {
  //      // Stop the ion-refresher from spinning
  //      $scope.$broadcast('scroll.refreshComplete');
  //    });
  // };

  //$scope.menu = $scope.menu_one_id;
  //alert($scope.menu_one_id);
}])

// .controller('MyController', function($scope, $http) {
//   $scope.items = [1,2,3];
//   $scope.doRefresh = function() {
//     $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6')
//      .success(function(newItems) {
//        $scope.items = newItems.count;
//        $scope.total_due = "BDT " + newItems.count;
//        alert($scope.total_due);
//        $ionicHistory.clearCache();
//         $state.go($state.current, {}, { reload: true });
//      })
//      .finally(function() {
//        // Stop the ion-refresher from spinning
//        $scope.$broadcast('scroll.refreshComplete');
//      });
//   };
// })


// .controller('dashboard_submit',['$scope', '$http', '$ionicPopup', '$timeout', function($scope, $http, $ionicPopup, $timeout) { 
//   var data = null; 
  
//   $scope.submit = function(){
//     var req = {
//      method: 'POST',
//      url: 'http://192.168.5.202/lunchmaker/api/place_order.php',
//      headers: {
//        'Content-Type': undefined
//      },
//      data: { uid: '6', mid: $scope.menu, foil: $scope.foil, status: 'unpaid' }
//     }
//     $http(req)
//     .then(function(responses){
//       var mypop = $ionicPopup.alert({
//         title: 'Order Placed Successfully',
//       });
//       mypop.then(function(res){
//         $state.go('app.fooDestinationView')
//         console.log('Tapped!', res);
//       });
//       //$timeout(function() {mypop.close();},3000);
//     });
//   };
// }])


// .controller('PlaylistsCtrl', function($scope, $ionicPopup, $timeout) {
//   $scope.data = {}

//   // Triggered on a button click, or some other target
//   $scope.showPopup = function() {
//     var alertPopup = $ionicPopup.alert({
//       title: 'Dont eat that!',
//       template: 'It might taste good'
//     });
//     alertPopup.then(function(res) {
//       console.log('Thank you for not eating my delicious ice cream cone');
//     });
//   };
// })

// .controller('dashboardCtrl-due', function($scope, $http) {
// 	// $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6').then(function(resp) {
// 	// $scope.total_due = "BDT "+resp.data.count;
//  //    // For JSON responses, resp.data contains the result
//  //  }, function(err) {
//  //    console.error('ERR', err);
// 	// $scope.val = "Error";
//  //    // err.status will contain the status code
//  //  })
// })
   
.controller('ordersCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('http://192.168.5.202/lunchmaker/api/users_order.php?uid=6')
  .then(function(resp) {
    $scope.values = resp.data.orders;
    $ionicHistory.clearCache();
    $state.go($state.current, {}, { reload: true });
    // For JSON responses, resp.data contains the result
  }, function(err) {
    // err.status will contain the status code
  })
  $scope.doRefresh = function() {
    $http.get('http://192.168.5.202/lunchmaker/api/users_order.php?uid=6')
      .then(function(resp) {
        $scope.values = resp.data.orders;
        // For JSON responses, resp.data contains the result
      }, function(err) {
        // err.status will contain the status code
      })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
}])
   
.controller('paymentCtrl',  ['$scope', '$http', function($scope, $http) {
  $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6').then(function(resp) {
  $scope.total_due = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $http.get('http://192.168.5.202/lunchmaker/api/total_paid.php?uid=6').then(function(resp) {
  $scope.total_paid = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $scope.doRefresh = function() {
    $http.get('http://192.168.5.202/lunchmaker/api/total_unpaid.php?uid=6').then(function(resp) {
  $scope.total_due = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $http.get('http://192.168.5.202/lunchmaker/api/total_paid.php?uid=6').then(function(resp) {
  $scope.total_paid = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
}])
   
.controller('logOutCtrl', function($scope) {

})
 