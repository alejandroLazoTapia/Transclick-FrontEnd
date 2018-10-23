angular.module('App', []).controller('ProfileCtrl',function($scope, $http, $window) {

    var arrayUrl = getUrlVars();
    var url_profile = service_user  + '/' + arrayUrl.ID; 
    var url_bonus = service_bonus + '?idUserGraphic=' + arrayUrl.ID; 
    var url_pays = service_PaymentDocument + '?idUser=' + arrayUrl.ID; 
    var url_consumption= service_consumption + '?idUser=' + arrayUrl.ID; 


    // Obtener usuario mediante método GET
    getDataProfile = function() 
    {
        $http.get(url_profile)
        .then(function(response){
            console.log(response.data);
            $scope.infoProfile = response.data[0];                    
            $scope.profile = response.data[0];                    
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }    
    getDataProfile();

        // Obtener pagos mediante método GET para tabla
        $scope.getDataConsumption = function() 
        {
            $http.get(url_consumption)
            .then(function(response){
                if(response.status == 204){
                    //toastr.info("No posee transacciones registradas");
                    $scope.JsonPays = response.data;
                }else{
                    $scope.JsonPays = response.data;
                }           
            }, function (error) {
                //toastr.error("El Usuario Ingresado No Posee Pagos registrados");
                console.log(error);
            });        
        }
        $scope.getDataConsumption();

    // Obtener bonus mediante método GET para tabla
    $scope.getDataBonus = function() 
    {
        $http.get(url_bonus)
        .then(function(response){
            var totalMeses = 0;
            var promedioBonus = 0;
            var valUltimoMes = 0;

            if(response.status == 204){
                //toastr.info("No posee transacciones registradas");
                $scope.JsonBonus = response.data;
                $scope.totalBonus = totalMeses;
                $scope.PromedioBonus = promedioBonus;

            }else{
                response.data.forEach(function (obj) {
                    totalMeses += parseInt(obj.monto);
                });
                
                promedioBonus = parseInt(totalMeses/response.data.length);
                valUltimoMes = parseInt(response.data[0].monto);
                $scope.PromedioBonus = promedioBonus;

                porcentaje = parseInt((valUltimoMes*100) / promedioBonus)-100;
                
                if  (valUltimoMes < promedioBonus)
                { 
                    $("#percentBonus").addClass("fa fa-sort-desc");
                    $("#colorPercentBonus").addClass("red");                    
                    $scope.porcentajeBonus = porcentaje + "%";
                }else{
                    $("#percentBonus").addClass("fa fa-sort-asc");
                    $("#colorPercentBonus").addClass("green");                    
                    $scope.porcentajeBonus = "+" + porcentaje + "%";
                }
            }           
        }, function (error) {
            //toastr.error("El Usuario Ingresado No Posee Pagos registrados");
            console.log(error);
        });        
    }
    $scope.getDataBonus();

    // Obtener pagos mediante método GET para tabla
    $scope.getDataPays = function() 
    {
        $http.get(url_pays)
        .then(function(response){
            var totalMeses = 0;
            var porcentaje = 0;
            var promedioPays = 0;
            var valUltimoMes = 0;

            if(response.status == 204){
                //toastr.info("No posee transacciones registradas");
                $scope.JsonPays = response.data;
                $scope.totalPays = totalMeses;
                $scope.PromedioPays = promedioPays;

            }else{
                response.data.forEach(function (obj) {
                    totalMeses += parseInt(obj.total_mes);
                });

                promedioPays = parseInt(totalMeses/response.data.length);
                valUltimoMes = parseInt(response.data[0].total_mes);
                $scope.PromedioPays = promedioPays;

                porcentaje = parseInt((valUltimoMes*100) / promedioPays)-100;

                if  (valUltimoMes < promedioPays)
                { 
                    $("#percentPays").addClass("fa fa-sort-desc");
                    $("#colorPercentPays").addClass("red");                    
                    $scope.porcentajePays = porcentaje + "%";
                }else{
                    $("#percentPays").addClass("fa fa-sort-asc");
                    $("#colorPercentPays").addClass("green");                    
                    $scope.porcentajePays = "+" + porcentaje + "%";
                }

            }           
        }, function (error) {
            //toastr.error("El Usuario Ingresado No Posee Pagos registrados");
            console.log(error);
        }); 
    }
    $scope.getDataPays();


      //Función para insertar o modificar registros
      $scope.save = function(profile)
      {
          var index = profile;
          console.log(index);

          $scope.entity = $scope.profile;            
          $scope.entity.index = profile;
          var password = $scope.profile.password;
          $scope.entity.password =  encrypt(password);
                          
          // Generar request al servicio
          var datos = $scope.entity;
         
          //Valido si el ID es null para iniciar y crear
          if (datos.id == ''){
              datos.id= 0;
          }

          var url = service_user  + '/' + $scope.entity; 

          console.log(datos);

          if($scope.entity.name != ''){
              if($scope.entity.last_name != ''){
                  $http.post(url,datos,config)      
                  .then(function (response) {
                      getDataProfile();
                      toastr.success('Registro guardado exitosamente');
                      console.log(response);
  
                  }, function (error) {
                      toastr.error("Ocurrió un error al intentar insertar el registro");
                      console.log(error);
                  }); 
              }else{
                  toastr.warning("Debe ingresar apellido");    	
              }               
          }else{
              toastr.warning("Debe ingresar nombre");    	
          }
 
      };     
     
} 
);