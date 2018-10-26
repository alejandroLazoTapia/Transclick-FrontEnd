
angular.module('App', []).controller('ClaimsCtrl',function($scope, $http, $window) {
        
    $scope.JsonData = {}
    var arrayUrl = getUrlVars();

    var url_claims = service_claims  + '?idUser=' + arrayUrl.ID; 

    console.log(url_claims);
    // Obtener motivos mediante método GET
    $scope.getReasons = function() 
    {
        $http.get(service_claimsReasons)
        .then(function(response){
            $scope.reasonsJson =  response.data;
            console.log(response.data);                
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }

    $scope.getReasons();

    // Obtener motivos mediante método GET
    $scope.getStatus = function() 
    {
        $http.get(service_claimStatus)
        .then(function(response){
            $scope.StatusJson =  response.data;
            //console.log(response.data);                
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }

    $scope.getStatus();

    $scope.getData = function() 
    {
        $http.get(url_claims)
        .then(function(response){
            if(response.status == 204){
                toastr.info("No posee medios de pago registrados");
                $scope.JsonData = response.data;
            }else{
                $scope.JsonData = response.data;
                $scope.clear();
            }           
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }

    $scope.getData();

    //Función para insertar o modificar registros
    $scope.send = function(JsonForm)
    {
        $scope.entity = $scope.JsonForm;            
        $scope.entity.index = JsonForm;

                        
        // Generar request al servicio
        var datos = $scope.entity;
        
        //Valido si el ID es null para iniciar y crear
        if (datos.index == undefined){        
            datos.id= 0;
            datos.id_status = 1;
            datos.id_user = Number(arrayUrl.ID);
            datos.fecha = getSysdate();
        }

        console.log(datos);

        var url = service_claims  + '/' + datos; 

        console.log(datos);

        if($scope.entity.id_reason != undefined){
                $http.post(url,datos,config)      
                .then(function (response) {
                    $scope.getData();
                    toastr.success('Formulario generado exitosamente');
                    console.log(response);

                }, function (error) {
                    toastr.error("Ocurrió un error al intentar insertar el registro");
                    console.log(error);
                });             
        }else{
            toastr.warning("Debe seleccionar motivo");    	
        }

    };  

           
    $scope.clear = function(data) {
        $scope.JsonForm = {};
        $scope.entity = {};
     }; 

	}
);
