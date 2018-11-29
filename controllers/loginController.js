

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

  var urlLogin = service_login + "email=" + $scope.email + "&pass=" + passencrip;
  //console.log(urlLogin);
  $scope.loading = true;
  $http.get(urlLogin)
  .then(function(response){
      
      //console.log(request.status);                   
      if (response.status == 200) {
        var entity = response.data;

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
          
      } else if (response.status == 204) {
          // si el login es incorrecto creo la sesion en falso y doy anuncio de credenciales invalidad.
        toastr.error("Credenciales inválidas");
      }

  }, function (error) {
      toastr.error("Ocurrió un error al intentar leer el registro");
      console.log(error);
  }).finally(function() {
      // called no matter success or failure
      $scope.loading = false;
  });

}else{  
  toastr.info(validate.message);  
                 
} 
}

  // Obtener usuario mediante método GET
  getLogin = function() 
  {
        
  } 

// Redireccionar al formulario de registro
$scope.ButtonRedirect = function () {
  $window.location.href = getAbsolutePath() + "/register.html";
}
});