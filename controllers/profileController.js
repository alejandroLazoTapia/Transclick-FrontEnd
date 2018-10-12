angular.module('App', []).controller('ProfileCtrl',function($scope, $http, $window) {
    $scope.profile = {}

    var arrayUrl = getUrlVars();

    var url = service_user  + '/' + arrayUrl.ID; 

    // Obtener usuario mediante método GET
    getDataProfile = function() 
    {
        $http.get(url)
        .then(function(response){
            console.log(response.data);
            $scope.profile = response.data;
            var birth_date = new Date($scope.profile.birth_date);
            $scope.profile.birth_date = birth_date.getMonth() + "/" + birth_date.getDate() + "/" + birth_date.getFullYear(); 
            
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }
    
    getDataProfile();


	}
);