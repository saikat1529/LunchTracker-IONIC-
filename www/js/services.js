angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

<<<<<<< HEAD
.factory('LoginFactory', function($http){
	return {
		getAllUsers: function(name, pw){
		    var url = 'http://192.168.0.103/saikat/lunchtracker/api/login.php?email='+name+'&password='+pw;
			var validation = $http.get(url);
			alert(validation.data.message);
			return validation;
		}
	};
})

.service('BlankService', [function(){

}])

.service('LoginService', function($q, $http, $ionicPopup){
	return {
		loginUser: function(name, pw){
			var deferred = $q.defer();
			var promise = deferred.promise;
			var req = {
		       method: 'POST',
		       url: 'http://192.168.0.103/saikat/lunchtracker/api/login.php',
		       headers: {
		         'Content-Type': undefined
		       },
		       data: { email: name, password: pw }
		      }
		      http(req).then(function(response){
		      	var mypop = $ionicPopup.alert({
		          title: 'Order Placed Successfully',
		        });
		      });
			if(name == 'saikat' && pw == 'tisha'){
				deferred.resolve('Welcome '+name+'!');
			}
			else{
				deferred.reject('Wrong Credential!');
			}
			promise.success = function(fn){
				promise.then(fn);
				return promise;
			}
			promise.error = function(fn){
				promise.then(null, fn);
				return promise;
			}
			return promise;
		}
	}
});
=======
.service('BlankService', [function(){

}]);
>>>>>>> 033bd3b868ecd3c7c44126356c699d8c3bdd6f63

