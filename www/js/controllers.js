// angular.module('coolapp-constants',[])
// .constant('config', {
//   apiUrl: 'saikat'
// });

// var URI_PATH = {
//     api: "saikat"
// };

// var cool = angular.module('coolapp-constants',[]);
// cool.value('config', {
//     appName: 'My App',
//     appVersion: 2.0,
//     apiUrl: 'http://www.google.com?api'
// });


var my_app = angular.module('app.controllers', []);

my_app.constant("apiUrl","http://192.168.5.202/lunchmaker/api/");
     
my_app.controller('dashboardCtrl',['$scope', '$http', '$ionicPopup', '$state', '$ionicHistory','apiUrl', function($scope, $http, $ionicPopup, $state, $ionicHistory, apiUrl) {
  console.log("API: "+apiUrl);
  $scope.foil = "no";
  var user_id = window.localStorage.getItem('id');
  console.log(user_id);
  $http.get(apiUrl+'todays_menu.php')
  .then(function(resp) {
  console.log(resp);
	$scope.menu_one_name = resp.data.menus[0].name+" ("+resp.data.menus[0].price+")";
	$scope.menu_one_id = resp.data.menus[0].id;
	$scope.menu_two_name = resp.data.menus[1].name+" ("+resp.data.menus[1].price+")";
	$scope.menu_two_id = resp.data.menus[1].id;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })
  $http.get(apiUrl+'check_order.php?uid='+user_id)
  .then(function(resp){
    $scope.orderValue = resp.data.placed_order;
    if($scope.orderValue=='yes'){
      $scope.statusVal = false;
    }
    else{
      $scope.statusVal = true;
    }
  })
  $http.get(apiUrl+'total_unpaid.php?uid='+user_id).then(function(resp) {
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
    user_id = window.localStorage.getItem('id');
    $http.get(apiUrl+'check_order.php?uid='+user_id)
    .then(function(resp){
      $scope.orderValue = resp.data.placed_order;
      if($scope.orderValue=='yes'){
        var mypop = $ionicPopup.alert({
          title: 'You already palced order',
          buttons: [{
               text: '<b>Ok</b>',
               type: 'button-dark'
            }]
        });
      }
      else{
        if($scope.menu==0){
          var mypop = $ionicPopup.alert({
                title: 'Invalid Menu Selected',
                buttons: [{
                 text: '<b>Ok</b>',
                 type: 'button-dark'
               }]
             });
        }
        else{
          if(angular.isDefined($scope.menu)){
            var req = {
             method: 'POST',
             url: apiUrl+'place_order.php',
             headers: {
               'Content-Type': undefined
             },
             data: { uid: user_id, mid: $scope.menu, foil: $scope.foil, status: 'unpaid' }
           }
           console.log(req);
           $http(req)
           .then(function(responses){
                var mypop = $ionicPopup.alert({
                  title: 'Order Placed Successfully',
                  buttons: [{
                   text: '<b>Ok</b>',
                   type: 'button-dark'
                 }]
               });
                mypop.then(function(res){
                //console.log('http://192.168.0.103/saikat/lunchtracker/api/total_unpaid.php?uid='+user_id);
                $http.get(apiUrl+'total_unpaid.php?uid='+user_id)
                .success(function(newItems) {
                  $scope.items = newItems.count;
                  $scope.total_due = "BDT " + newItems.count;
                  $ionicHistory.clearCache();
                  $state.go($state.current);
                })
                .finally(function() {
                 // Stop the ion-refresher from spinning
                 $scope.$broadcast('scroll.refreshComplete');
               });
                $http.get(apiUrl+'check_order.php?uid='+user_id)
                .then(function(resp){
                  $scope.orderValue = resp.data.placed_order;
                  if($scope.orderValue=='yes'){
                    $scope.statusVal = false;
                  }
                  else{
                    $scope.statusVal = true;
                  }
                });
              });
          //$timeout(function() {mypop.close();},3000);
        });
          }
          else{
            var mypop = $ionicPopup.alert({
              title: 'please select your menu',
              buttons: [{
                 text: '<b>Ok</b>',
                 type: 'button-dark'
              }]
            });
          mypop.then(function(res){
            console.log('Tapped!', res);
          });
        }
        }
    }
  })
};

  $scope.doRefresh = function() {
    user_id = window.localStorage.getItem('id');
    $http.get(apiUrl+'todays_menu.php')
      .then(function(resp) {
      console.log(resp);
      $scope.menu_one_name = resp.data.menus[0].name+" ("+resp.data.menus[0].price+")";
      $scope.menu_one_id = resp.data.menus[0].id;
      $scope.menu_two_name = resp.data.menus[1].name+" ("+resp.data.menus[1].price+")";
      $scope.menu_two_id = resp.data.menus[1].id;
        // For JSON responses, resp.data contains the result
      }, function(err) {
        console.error('ERR', err);
        // err.status will contain the status code
      })
    $http.get(apiUrl+'total_unpaid.php?uid='+user_id)
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
}]);

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
   
my_app.controller('ordersCtrl', ['$scope', '$http', 'apiUrl', function($scope, $http, apiUrl) {
  var user_id = window.localStorage.getItem('id');
  $http.get(apiUrl+'users_order.php?uid='+user_id)
  .then(function(resp) {
    $scope.values = resp.data.orders;
    $ionicHistory.clearCache();
    $state.go($state.current, {}, { reload: true });
    // For JSON responses, resp.data contains the result
  }, function(err) {
    // err.status will contain the status code
  })
  $scope.doRefresh = function() {
    $http.get(apiUrl+'users_order.php?uid='+user_id)
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
}]);
   
my_app.controller('paymentCtrl',  ['$scope', '$http','apiUrl', function($scope, $http, apiUrl) {
  var user_id = window.localStorage.getItem('id');
  $http.get(apiUrl+'total_spent.php?uid='+user_id).then(function(resp) {
  $scope.total_spent = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $http.get(apiUrl+'total_unpaid.php?uid='+user_id).then(function(resp) {
  $scope.total_due = "BDT "+resp.data.count;
    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $http.get(apiUrl+'total_paid.php?uid='+user_id).then(function(resp) {
  $scope.total_paid = "BDT "+resp.data.count;

    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $scope.doRefresh = function() {
    $http.get(apiUrl+'total_spent.php?uid='+user_id).then(function(resp) {
    $scope.total_spent = "BDT "+resp.data.count;
      // For JSON responses, resp.data contains the result
    }, function(err) {
      console.error('ERR', err);
    $scope.val = "Error";
      // err.status will contain the status code
    })
    $http.get(apiUrl+'total_unpaid.php?uid='+user_id).then(function(resp) {
  $scope.total_due = "BDT "+resp.data.count;

    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
  $scope.val = "Error";
    // err.status will contain the status code
  })
  $http.get(apiUrl+'total_paid.php?uid='+user_id).then(function(resp) {
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
}]);
   
my_app.controller('logOutCtrl', function($scope, $state) {
  window.localStorage.removeItem('id');
  console.log(window.localStorage.getItem('id'));
  console.log('cleared');
  $state.go('login');
});

my_app.controller('loginCtrl',['$scope', '$http', '$ionicPopup', '$ionicHistory', '$state', 'apiUrl', function($scope, $http, $ionicPopup, $ionicHistory, $state, apiUrl){
  $ionicHistory.clearCache();
  var user_id = window.localStorage.getItem('id');
  console.log("User ID:"+user_id);
  if(user_id!=null){
    console.log("logged in");
  }
  else{
    console.log("logged out");
  }
  $scope.data = {};
  $scope.login = function(){
    var login = apiUrl+"login.php?email="+$scope.data.email+"&password="+$scope.data.password;
    console.log(login);
    $http.get(login).then(function(resp) {
      console.log(resp.data);
      $scope.val = resp.data;
      console.log($scope.val);
      if($scope.val.status=='success'){
        console.log($scope.val.user_id);
        window.localStorage.setItem('id',$scope.val.user_id);
        $state.go('menu.dashboard');
      }
      else{
        $ionicPopup.alert({
          title: 'Log In failed!',
          template: 'Please check your credential'
        });
      }
      // For JSON responses, resp.data contains the result
    }, function(err) {
      console.error('ERR', err);
      $scope.val = "Error";
      // err.status will contain the status code
    })
    // LoginFactory.getAllUsers($scope.data.email, $scope.data.password)
    // .success(function(responses){
    //   $scope.val = responses;
    //   alert($scope.val);
    //   if($scope.val.status=='success'){
    //     alert($scope.val.user_id);
    //     window.localStorage.setItem('id',$scope.val.user_id);
    //     $state.go('menu.dashboard');
    //   }
    //   else{
    //     alert("Error");
    //     var alertPopup = $ionicPopup.alert({
    //       title: 'Log In failed!',
    //       template: 'Please check your credential'
    //     });
    //   }
    // })
    // .error(function(responses){
    //   $scope.err = responses;
    //   alert($scope.err);
    // });
    // LoginService.loginUser($scope.data.email, $scope.data.password)
    // .success(function(data){
    //   $state.go('menu.dashboard');
    // })
    // .error(function(data){
    //   var alertPopup = $ionicPopup.alert({
    //     title: 'Log In failed!',
    //     template: 'Please check your credential'
    //   });
    // });
  }
}]);
 