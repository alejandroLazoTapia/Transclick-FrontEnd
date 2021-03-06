angular.module('App', []).controller('ProfileCtrl',function($scope, $http, $window) {

    var arrayUrl = getUrlVars();
    var url_profile = service_user  + '/' + arrayUrl.ID; 
    var url_bonus = service_bonus + '?idUserGraphic=' + arrayUrl.ID; 
    var url_pays = service_PaymentDocument + '?idUser=' + arrayUrl.ID; 
    var url_consumption= service_consumption + '?idUser=' + arrayUrl.ID; 

    var today = new Date()
    $scope.today = today;


    // Obtener usuario mediante método GET
    getDataProfile = function() 
    {
        $scope.loading = true;
        $http.get(url_profile)
        .then(function(response){
            //console.log(response.data);
            $scope.infoProfile = response.data[0];                    
            $scope.profile = response.data[0];  
            

        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });        
    }    

    getDataProfile();

        // Obtener pagos mediante método GET para tabla
        $scope.getDataConsumption = function() 
        {
            $scope.loading = true;
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
            }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });          
        }
        $scope.getDataConsumption();

    // Obtener bonus mediante método GET para tabla
    $scope.getDataBonus = function() 
    {
        $scope.loading = true;
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
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });       
    }
    $scope.getDataBonus();

    // Obtener pagos mediante método GET para tabla
    $scope.getDataPays = function() 
    {
        $scope.loading = true;
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
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });  
    }
    $scope.getDataPays();


      //Función para insertar o modificar registros
      $scope.save = function(profile)
      {
        var validate = validateInput();
        if(validate.status == true){
            $scope.loading = true;          
            $scope.entity = $scope.profile;            
            var password = $scope.entity.passwordDecrypt;
            $scope.entity.password =  encrypt(password);
            $scope.entity.birth_date =  $scope.entity.dateString;
                            
            // Generar request al servicio
            var datos = $scope.entity;
           
            //Valido si el ID es null para iniciar y crear
            if (datos.id == ''){
                datos.id= 0;
            }
  
            if($scope.entity.name != ''){
                if($scope.entity.last_name != ''){
                    $http.post(service_user,datos,config)      
                    .then(function (response) {
                       $scope.clear();
                          getDataProfile();
                          var queryString = "ID=" + datos.id +"&PROFILE=" +datos.id_perfil+"&NAME=" +datos.name+"&LAST_NAME=" + datos.last_name;         
                          var queryStringEncrypt = encrypt(queryString);
                          $window.location.href = getAbsolutePath() + "/profile.html?" + queryStringEncrypt;
                          $('#modal').modal('hide');
                          toastr.success('Registro guardado exitosamente');  
                    }, function (error) {
                        toastr.error("Ocurrió un error al intentar insertar el registro");
                        console.log(error);
                    }).finally(function() {
                      // called no matter success or failure
                      $scope.loading = false;
                  }); 
                }else{
                    toastr.warning("Debe ingresar apellido");    	
                }               
            }else{
                toastr.warning("Debe ingresar nombre");    	
            }
   
        }else{
            toastr.info(validate.message);  
        }
         
      };
      
          //Función para editar registros
     $scope.edit = function()
     {
        $scope.entity = $scope.profile;

        var pass = $scope.entity.password;
        $scope.entity.passwordDecrypt = decrypt(pass);   
        
        var birth = $scope.entity.birth_date;
        $scope.entity.dateString = new Date(birth);

        console.log($scope.entity.passwordDecrypt);
        console.log($scope.entity.dateString);

        console.log($scope.entity);
     }

     $scope.clear = function(data) {
        $scope.profile = {};
        $scope.entity = {};
        // Filter through the selected items if needed
     }; 
     
    //Valida los campos ingresados en el formulario  
    function validateInput(){
        var obj =[];
        obj.status = true;
        obj.message = "";
        var now = new Date();
        var nowBirth = new Date($('#birthdate').val());        
        
        console.log(now);
        console.log(nowBirth);

        if ($('#txtname').val() == ''){
            obj.status = false;
            obj.message = "Ingrese nombre.";
        }else if($('#txtlastname').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese apellido."; 
        }else if($('#birthdate').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese fecha de nacimiento.";        
        }else if(nowBirth  > now){
            obj.status = false;
            obj.message = "Fecha de nacimiento futura inválida.";        
        }else if(!IsEmail($('#txtemail').val())){
            obj.status = false;
            obj.message = "Email inválido.";
        }else if($('#password').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese contraseña.";
        }
            return obj;
        };      
     
} 
);