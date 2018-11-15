

var app = angular.module('MyApp', []);
app.controller('Login', function ($scope, $http, $window) {

// Al ejecutar el evento click en login
$scope.LoginClick = function () {
  var validate = validateInput();

  // Validar campos solicitados
  if (validate.status == true){
    // Si el request esta OK
  // Encriptar contraseña para compararla con la almacenada
  var passencrip = window.btoa($scope.password);

  // Generar request al servicio
  var datos = { "email": $scope.email, "pass": passencrip };
  var request = $.get(service_login , datos);
  request.done(function (response, textStatus, errorThrown) { 
    
    try {

      //console.log(request.status);                   
      if (request.status == 200) {
        var entity = JSON.parse(request.responseText);

        // si el login es correcto creo la sesion en verdadero         
        var queryString = "ID=" + entity[0].id +"&PROFILE=" +entity[0].id_perfil+"&NAME=" +entity[0].name+"&LAST_NAME=" +entity[0].last_name;         
        var queryStringEncrypt = window.btoa(queryString);
        //console.log(queryString);
        //console.log(queryStringEncrypt); 
        if(entity[0].id_perfil == 2) {
          $window.location.href = getAbsolutePath() + "/view_admin/main_profile.html?" + queryStringEncrypt;
        }else{
          $window.location.href = getAbsolutePath() + "/view_user/profile.html?" + queryStringEncrypt;
        }              
          
      } else if (request.status == 204) {
          // si el login es incorrecto creo la sesion en falso y doy anuncio de credenciales invalidad.
        toastr.error("Credenciales inválidas");
      }  
    }catch(e){
      toastr.error("Error: "+ e.message);
    }
    finally {

    } 
  });


  // Si falla el Request
  request.fail(function (jqXHR, textStatus, errorThrown) {  
    console.log(textStatus + ": " + errorThrown);          
    if(jqXHR.status == 404){
      toastr.error("Credenciales inválidas.");
    }else if (jqXHR.status == 500) {
      toastr.warning("Error interno del servidor [500].");                    
    }else if (jqXHR.status == 0) {
      toastr.info("Verifique su conexión [0].");                    
    }          
  });

}else{  
  toastr.info(validate.message);  
                 
} 
}

// Redireccionar al formulario de registro
$scope.ButtonRedirect = function () {
  $window.location.href = getAbsolutePath() + "/register.html";
}
});