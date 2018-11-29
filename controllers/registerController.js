//Valida los campos ingresados en el formulario  
function validateInput(){
var obj =[];
obj.status = true;
obj.message = "";

var fullname = $('#name').val();
var nameArray = fullname.split(' ');

if ($('#typeDocument').val() == ''){
  obj.status = false;
  obj.message = "Debe seleccionar tipo documento.";
}else if ($('#numberDocument').val() == ''){
  obj.status = false;
  obj.message = "Debe ingresar número documento.";
}else if (nameArray[0] == '' || nameArray[0] == undefined){
  obj.status = false;
  obj.message = "Debe ingresar nombre.";
}else if(nameArray[1] == '' || nameArray[1] == undefined){
  obj.status = false;
  obj.message = "Debe ingresar apellido.";
}else if($('#email').val()  == ''){
  obj.status = false;
  obj.message = "Debe ingresar email.";
}else if(!IsEmail($('#email').val())){
  obj.status = false;
  obj.message = "Email inválido.";
}else if($('#sex').val()  == ''){
  obj.status = false;
  obj.message = "Debe seleccionar género.";
}else if($('#birthdate').val()  == ''){
  obj.status = false;
  obj.message = "Debe ingresar fecha de nacimiento.";
}else if($('#password').val()  == ''){
  obj.status = false;
  obj.message = "Debe ingresar password.";
}else if($('#password').val().length < 4){
  obj.status = false;
  obj.message = "Password debe contener mínimo 4 caracteres.";
}
return obj;
} 


var app = angular.module('MyApp', []);
app.controller('Register', function ($scope, $http, $window) {

// Al ejecutar el evento click en login
$scope.ButtonClick = function () {

  var validate = validateInput();

  // Validar campos solicitados
  if (validate.status == true){        

  //Se asigna formato de fecha internacional
  var fecha = $scope.birthdate;
  var fechaformat = fecha.format("yyyy-mm-dd'T'HH:MM:ss");
  // Encriptar contraseña antes de almacenarla
  var passencrip = window.btoa($scope.password);

  var fullname = $scope.name;
  var nameArray = fullname.split(' ');

  // GET: api/Users?email=PRUEBA@HOTMAIL.COM

  $scope.ExistUser = function() 
  {
    $scope.loading = true;
    urlServiceUser = service_user + '?email=' + $scope.email.toUpperCase()	;

      $http.get(urlServiceUser)
      .then(function(response){
        //console.log(response.status);
          var existUser;
          existUser =response.status;

          //Valido si se registro un usuario con el email
          if(existUser == 204){
              // Generar request al servicio
            var datos = { "id_perfil": 1, "id_doc_type": $scope.typeDocument,  "num_document": $scope.numberDocument, "name": nameArray[0], "last_name": nameArray[1], "email": $scope.email, "sex": $scope.sex, "birth_date": fechaformat, "password": passencrip };
            var request = $.post(service_user , datos);
            // Si el request est� OK
            request.done(function (jqXHR, textStatus, errorThrown) {             
              //console.log(jqXHR);
        
                if (textStatus == "success") {
                    toastr.success('Usuario registrado exitosamente.');  
                    
                    //Inicio envío email
                    var subject="Bienvenido a TransClick";
                    var message = "Bienvenid@ " +nameArray[0]+ " a nuestra plataforma TransClick, en donde podras realizar tus viajes de maneras mas sencilla, rápida y segura.";
                    var urlEmail = service_email+"?emailTo="+$scope.email+"&nameTo="+nameArray[0]+"&emailFrom=TransClick@gmail.com&nameFrom=TransClick&subject="+subject+"&message="+message;
                    var UrlEncodeEmail = encodeURI(urlEmail);
                    console.log(UrlEncodeEmail);
                    $http.post(urlEmail)      
                    .then(function (response) {
                        //$scope.getData();
                        //toastr.success('Registro enviado exitosamente');
                        console.log(response);
    
                    }, function (error) {
                        toastr.error("Ocurrió un error al intentar enviar el registro");
                        console.log(error);
                    });
                    //Fin envío email

                } else {
                    // si el login es incorrecto creo la sesion en falso y doy anuncio de credenciales invalidad.
                  toastr.error("Error:" + errorThrown);
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
            toastr.error("Email ya se encuentra registrado");
          }
      }, function (error) {
          toastr.error("Ocurrió un error al intentar leer el registro");
          console.log(error);
      }).finally(function() {
        // called no matter success or failure
        $scope.loading = false;

    });         
  }

$scope.ExistUser();
  
}else{
  toastr.info(validate.message);  
                  
} 
}

// Redireccionar al formulario de registro
$scope.ButtonRedirect = function () {
  $window.location.href = getAbsolutePath() + "/login.html";
}
});