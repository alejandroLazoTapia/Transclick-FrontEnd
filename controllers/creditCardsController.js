angular.module('App', []).controller('CreditCardsCtrl',function($scope, $http, $window) {
    $scope.JsonData = {}

    var arrayUrl = getUrlVars();
    //Se utiliza para desplegar info del usuario
    $scope.infoUser = arrayUrl;

    var url = service_creditCards  + '?idUser=' + arrayUrl.ID; 

    // Obtener tarjetas mediante método GET
    $scope.getData = function() 
    {
        $scope.loading = true;
        $http.get(url)
        .then(function(response){
            if(response.status == 204){
                toastr.info("No posee medios de pago registrados");
                $scope.JsonData = response.data;

            }else{
                $scope.JsonData = response.data;
                $scope.clear();
                //console.log("Tarjetas registradas: " + response.data.length);    
                //Recorre los registros del JSON y genera HTML credit cards
            }
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });         
    }
    
    $scope.getData();
  
     
    //Función para insertar o modificar registros
     $scope.save = function(JsonCard)
        {
            var validate = validateInput();
                 
            if (validate.status == true){
                var index = JsonCard;
                //console.log(index);
    
                $scope.entity = $scope.JsonCard;            
                $scope.entity.index = JsonCard;
                var codeSecure = $scope.JsonCard.secure_code;            
                //$scope.entity.secure_code =  encrypt(codeSecure);
                       
                //Formato fecha de expiración de las tarjetas
                var fechaExpiracion  = $scope.JsonCard.expiration;
                var date = new Date(fechaExpiracion);
                var yearExp = date.getFullYear();
                var monthExp = date.getMonth()+1;
                                
                // Generar request al servicio
                var datos = $scope.entity;
    
                //Valido si el ID es null para iniciar y crear
                if (datos.id == undefined){
                    //Si es la primera tarjeta registrada queda predeterminada 
                    var num = $scope.JsonData.length;
                    if (num > 0){
                        datos.selected = "N";
                    }else{
                        datos.selected = "Y";
                    }
    
                    datos.id= 0;
                    datos.status = "A";
                    datos.id_user = Number(arrayUrl.ID);
                    datos.month_expiration = monthExp;
                    datos.year_expiration = yearExp;
                }
    
                var url = service_creditCards  + '/' + $scope.entity; 
                console.log(num);
                if(num < 2){
                    $scope.loading = true;
                    $http.post(url,datos,config)      
                    .then(function (response) {
                        $scope.clear();
                        $scope.getData();
                        $('#modal').modal('hide');                    
                        toastr.success('Registro guardado exitosamente');
                        //console.log(response);
        
                    }, function (error) {
                        toastr.error("Ocurrió un error al intentar insertar el registro");
                        console.log(error);
                    }).finally(function() {
                        // called no matter success or failure
                        $scope.loading = false;
                    }); 
                }else{
                    toastr.info('Supera el límite de tarjetas registradas.');
                }    
            }else{
                toastr.info(validate.message);  

            }
        };     

           //Función para insertar o modificar registros
     $scope.disable = function(index)
     {
        $scope.loading = true;

         $scope.entity = $scope.JsonData[index];
         //$scope.entity.index = index;   
                                 
         // Generar request al servicio
         var datos = $scope.entity;
        
         //Valido si el ID es null para iniciar y crear
         if (datos.id == ''){
             datos.status= 'A';
         }else{
             datos.status = 'I';
         }

         var url = service_creditCards  + '/' + $scope.entity; 

         console.log(datos);

            $http.post(url,datos,config)      
            .then(function (response) {
                $scope.getData();
                toastr.success('Registro eliminado exitosamente');
                //console.log(response);

            }, function (error) {
                toastr.error("Ocurrió un error al intentar quitar el registro");
                console.log(error);
            }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });  
             
     };   
     
    //Función para insertar o modificar registros
    $scope.predetermine = function(index)
    {
        $scope.entity = $scope.JsonData[index];
        //$scope.entity.index = index;   
                                
        // Generar request al servicio
        var datosSelect = $scope.entity;

        var fullData = $scope.JsonData;

        $scope.loading = true;
        //Recorre y actualiza las tarjetas a predeterminadas
        for(var k in fullData) {
            fullData[k].selected = "N";
            //console.log(fullData[k]);

             var url = service_creditCards  + '/' + fullData[k]; 
             $scope.loading = true;
             $http.post(url,fullData[k],config)      
             .then(function (response) {
                 $scope.getData();
             }, function (error) {
                 toastr.error("Ocurrió un error al intentar quitar el registro");
                 console.log(error);
             }).finally(function() {
                 $scope.loading = false;
             });  
         }
         //Fin de la actualizaciòn de las tarjetas

        //Valido si el ID es null para iniciar y crear
        if (datosSelect.id == ''){
            datosSelect.selected= 'N';
        }else{
            datosSelect.selected = 'Y';
        }   

        console.log(datosSelect);
         var url = service_creditCards  + '/' + $scope.entity; 
             $scope.loading = true;
             $http.post(url,datosSelect,config)      
             .then(function (response) {
                 $scope.getData();
                 toastr.success('Tarjeta ' + datosSelect.card_number  + ' ha sido activada');
                 //console.log(response);
             }, function (error) {
                 toastr.error("Ocurrió un error al intentar quitar el registro");
                 console.log(error);
             }).finally(function() {
                 $scope.loading = false;
             });              
    };    
                  
       
    $scope.clear = function(data) {
        $scope.JsonDataUser = {};
        $scope.JsonCard = {};
        $scope.entity = {};
        // Filter through the selected items if needed
        }; 
    
    //Valida los campos ingresados en el formulario  
    function validateInput(){
        var obj =[];
        obj.status = true;
        obj.message = "";
        
        if ($('#txtcardnumber').val() == ''){
            obj.status = false;
            obj.message = "Ingrese Nº tarjeta.";
        }else if($('#datexpiration').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese fecha de expiración.";
        }else if($('#txtname').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese nombre.";        
        }else if($('#txtlastname').val() == ''){
            obj.status = false;
            obj.message = "Ingrese apellido.";
        }else if($('#txtcode').val()  == ''){
            obj.status = false;
            obj.message = "Ingrese código de seguridad.";
        }
            return obj;
        };      
     
	}
);