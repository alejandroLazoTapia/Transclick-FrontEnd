
 function printDiv(nombreDiv) {
    var contenido= document.getElementById(nombreDiv).innerHTML;
    var contenidoOriginal= document.body.innerHTML;

    document.body.innerHTML = contenido;

    window.print();

    document.body.innerHTML = contenidoOriginal;
}

angular.module('App', []).controller('CrudCtrl',function($scope, $http, $window) {

    var data = getUrlVars();

    var url_user = service_user +'/'+ data.id_usuario;

    $scope.getUser = function() 
    {
        $http.get(url_user)
        .then(function(response){
            //console.log(response.data);
            $scope.user = response.data[0];                            
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }    
    $scope.getUser();


    $scope.getData = function() 
    {
        $scope.data = data;    
        console.log($scope.data);
    }
    $scope.getData();
    
  
});