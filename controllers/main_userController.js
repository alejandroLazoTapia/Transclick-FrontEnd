
angular.module('App', []).controller('CrudCtrl',function($scope, $http, $window) {
    $scope.entity = {}

        // Obtener tipo documento mediante método GET
        $scope.getProfile = function() 
        {
            $scope.loading = false;
            $http.get(service_profiles)
            .then(function(response){
                //$scope.JsonDocType =  JSON.stringify(response.data);
                $scope.JsonProfile =  response.data;
                //console.log("------------tipo documento-------------");
                //console.log($scope.JsonDocType);
                //console.log(response.data);                
            }, function (error) {
                toastr.error("Ocurrió un error al intentar leer el registro");
                console.log(error);
            }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });       
        }

    // Obtener tipo documento mediante método GET
    $scope.getDocumentType = function() 
    {
        $scope.loading = true;

        $http.get(service_documentType)
        .then(function(response){
            //$scope.JsonDocType =  JSON.stringify(response.data);
            $scope.JsonDocType =  response.data;
            //console.log("------------tipo documento-------------");
            //console.log($scope.JsonDocType);
            //console.log(response.data);
            
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });          
    }

    // Obtener todos los usuarios mediante método GET
    $scope.getData = function() 
    {
        $scope.loading = true;

        $http.get(service_user)
        .then(function(response){
            $scope.getProfile();
            $scope.getDocumentType();            
            $scope.JsonData = response.data;
            //$scope.JsonData.password = $window.atob(response.data.password.toString());
            getPagination('#datatable-responsive');
            //console.log(response.data);
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });         
    }
    
    $scope.getData();
    $scope.entity.disabled == true;

    //Función para cargar datos por id usuario
    $scope.getDataByUser = function(index) 
    {
        $scope.loading = true;

        $scope.entity = $scope.JsonData[index];
        $scope.entity.index = index;            
        
        var pass = $scope.JsonData[index].password;
        $scope.entity.passwordDecrypt = decrypt(pass);   

        var birth = $scope.entity.birth_date;
        console.log(birth);
        $scope.entity.dateString = new Date(birth);

        var url = service_user + '/' + $scope.entity.id; 

        $http.get(url)
        .then(function(response){
            $scope.getProfile();
            $scope.getDocumentType();                       
            $scope.JsonDataUser = response.data[0];
            var passEnc = $scope.JsonDataUser.password;
            $scope.JsonDataUser.password = decrypt(passEnc); 

        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });        
    }
    

    //Función para editar registros
     $scope.edit = function(index)
     {
        var fila = index + 1;
        $("table tr:eq("+fila+") #optPerfil").removeAttr("disabled");
        $("table tr:eq("+fila+") #optTypeDoc").removeAttr("disabled");

        $scope.entity = $scope.JsonData[index];
        var pass = $scope.JsonData[index].password;
        $scope.entity.passwordDecrypt = decrypt(pass);   

        var birth = $scope.entity.birth_date;
        console.log(birth);
        $scope.entity.dateString = new Date(birth);


        $scope.entity.index = index;
        $scope.entity.editable = true;     
        $scope.entity.disabled = false; 
        console.log($scope.entity);
	 }
   
    
     //Función para eliminar registros
    $scope.delete = function(index)
        {
            $scope.loading = true;
            $scope.entity = $scope.JsonData[index];
            $scope.entity.index = index;            
            var url = service_user + '/' + $scope.entity.id; 
            console.log(url); 

            $http.delete(url, config)      
            .then(function (response) {
                $scope.JsonData.splice(index,1);
                toastr.success('Registro eliminado exitosamente');
                $scope.getData();
                console.log(response);
            }, function (error) {
                toastr.error("Ocurrió un error al intentar eliminar el registro");
                console.log(error);
            }).finally(function() {
                // called no matter success or failure
                $scope.loading = false;
            });  
        }
     
     
    //Función para insertar o modificar registros
     $scope.save = function(entity)
        {
            $scope.entity = $scope.entity;            
            var password = $scope.entity.passwordDecrypt;
            $scope.entity.password =  encrypt(password);
                            
            // Generar request al servicio
            var datos = $scope.entity;
           
            //Valido si el ID es null para iniciar y crear
            if (datos.id == ''){
                datos.id= 0;
            }

            //console.log(datos);

            if($scope.entity.id_doc_type != undefined){
                if($scope.entity.sex != undefined){
                    $scope.loading = true;
                    $http.post(service_user,datos,config)      
                    .then(function (response) {
                        $scope.clear();                        
                        $scope.getData();
                        $('#modal').modal('hide');
                        toastr.success('Registro guardado exitosamente');
                        console.log(response);
    
                    }, function (error) {
                        toastr.error("Ocurrió un error al intentar insertar el registro");
                        console.log(error);
                    }).finally(function() {
                        // called no matter success or failure
                        $scope.loading = false;
                    });  
                }else{
                    toastr.warning("Debe seleccionar sexo");    	
                }               
            }else{
                toastr.warning("Debe seleccionar tipo documento");    	
            }
   
        };     
       
    //Función para agregar filas a la tabla    
     $scope.add = function()
        {        
            $scope.JsonData.push({
            id : "",
            name : "",
            last_name: "",
            id_doc_type: "",
            id_perfil:"",
            num_document:"",
            sex:"",
            password:"",
            email:"",
            editable:true,
            disabled: false           
        })
        };

        $scope.removeSelect = function(){           
            var newDataList=[];
            angular.forEach($scope.JsonData,function(entity){
            if(!entity.selected){
                newDataList.push(entity);
            }
            else{
                //Extrae item seleccionados
                console.log(entity.id);  
                var url = service_user + '/' + entity.id; 
                $scope.loading = true;

                $http.delete(url, config)      
                .then(function (response) {
                    $scope.getData();
                    toastr.success('Registro eliminado exitosamente');
                    console.log("Delete user: "+ entity.id)
                }, function (error) {
                    toastr.error("Ocurrió un error al intentar eliminar el registro");
                    console.log(error);
                }).finally(function() {
                    // called no matter success or failure
                    $scope.loading = false;
                }); 
            }
        });    $scope.JsonData=newDataList;        
        };      

     
    //Función para insertar o modificar registros
    $scope.cancel = function(index)
    {
        var fila = index + 1;
        $("table tr:eq("+ fila +") #optPerfil").attr("disabled", true);
        $("table tr:eq("+ fila +") #optTypeDoc").attr("disabled", true);

        
        $scope.JsonData[index].editable = false; 
        $scope.JsonData[index].disabled = true;                                   
        $scope.entity = $scope.JsonData[index];
        $scope.entity.index = index;


    };     
   
     $scope.clear = function(data) {
        $scope.JsonDataUser = {};
        $scope.entity = {};
        // Filter through the selected items if needed
     }; 


	}
);