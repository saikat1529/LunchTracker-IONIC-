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
}]);

my_app.controller('menuCtrl',['$scope', '$state', function($scope, $state){
  $scope.settings = function(){
    $state.go('menu.settings');
  };
}]);

my_app.controller('settingCtrl',['$scope', '$state', function($scope, $state){
  $scope.navChangePass = function(){
    $state.go('menu.password');
  };
}]);

// MD. SHIHAB UDDIN you will be working on this part

//SNIPPET STARTS HERE

my_app.controller('registrationCtrl',['$scope','$state', function($scope, $state){
  //You Will be working on this platform
}])

//SNIPPET ENDS HERE

my_app.controller('passwordCtrl',['$scope', '$state', 'apiUrl', '$http','$ionicPopup', '$ionicHistory', function($scope, $state, apiUrl, $http, $ionicPopup, $ionicHistory){
  user_id = window.localStorage.getItem('id');
  $scope.change_password = function(){
    if($scope.data.new_password==$scope.data.retype_password){
      var req = apiUrl+"change_password.php?uid="+user_id+"&current_password="+$scope.data.current_pass+"&new_password="+$scope.data.new_password;
      $http.get(req)
      .then(function(resp) {
        $scope.values = resp.data.result;
        $scope.message = resp.data.message;
        if($scope.values==1){
          var mypop = $ionicPopup.alert({
              title: 'Password Changed Successfully',
              buttons: [{
               text: '<b>Ok</b>',
               type: 'button-dark'
             }]
           });
          mypop.then(function(resp){
            $ionicHistory.clearCache();
            $state.go('login');
            });
        }
        else{
          var mypop = $ionicPopup.alert({
              title: 'Password Not Changed Successfully',
              buttons: [{
               text: '<b>Ok</b>',
               type: 'button-dark'
             }]
           });
        }
        // For JSON responses, resp.data contains the result
      }, function(err) {
        // err.status will contain the status code
        alert(err);
      })
    }
    else{
      var mypop = $ionicPopup.alert({
        title: 'New Password didn\'t matched',
        buttons: [{
         text: '<b>Ok</b>',
         type: 'button-dark'
       }]
     });
    }
  }
}]);
   
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
        var mypop = $ionicPopup.alert({
                title: 'Wrong Credential Entered',
                buttons: [{
                 text: '<b>Ok</b>',
                 type: 'button-dark'
               }]
             });
      }
      // For JSON responses, resp.data contains the result
    }, function(err) {
      console.error('ERR', err);
      $scope.val = "Error";
      // err.status will contain the status code
    })
  }
  $scope.register = function(){
    $state.go('registration');
  }
}]);
 