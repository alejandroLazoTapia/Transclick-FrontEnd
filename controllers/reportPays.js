angular.module('App', []).controller('CrudCtrl',function($scope, $http, $window) {
    $scope.entity = {}

    var arrayUrl = getUrlVars();
    //Se utiliza para desplegar info del usuario
    $scope.infoUser = arrayUrl;

    var url_user = service_user +'/'+ arrayUrl.ID;
    var url_table = service_PaymentDocument + '?idUser=' + arrayUrl.ID; 

    var url_graphic = service_PaymentDocument + '?idUserGraphic=' + arrayUrl.ID; 

    //obtener datos de usuario
    var userReq = new XMLHttpRequest();
    userReq.open("GET", url_user, false);
    userReq.send(null);
    var userJson = JSON.parse(userReq.responseText)[0]; //variable con datos de usuario


    // Obtener transacciones mediante método GET para tabla
    $scope.getData = function() 
    {
        $scope.loading = true;
        $http.get(url_table)
        .then(function(response){
            if(response.status == 204){
                toastr.info("No posee transacciones registradas");
                $scope.JsonData = response.data;

            }else{
                $scope.JsonData = response.data;
                getPagination('#datatable-responsive');                
            }           
        }, function (error) {
            toastr.error("El Usuario Ingresado No Posee Pagos registrados");
            console.log(error);
        }).finally(function() {
            // called no matter success or failure
            $scope.loading = false;
        });        
    }
    $scope.getData();


    $scope.view = function(index) 
          {
            var data = $scope.JsonData[index];
            console.log(data);
       
            var queryString = "mes=" + data.mes +"&"+"ano="+data.ano+"&"+"descuento="+data.descuento+"&"+"neto="+data.neto+"&"+"iva="+data.iva+"&"+"total_mes="+data.total_mes+"&"+"estado_boleta="+data.estado_boleta+"&"+"id_boleta="+data.id_boleta+"&"+"id_usuario="+data.id_usuario;         
            var queryStringEncrypt = window.btoa(queryString);
             $window.open(getAbsolutePath() + "/billPays.html?" + queryStringEncrypt);
          }
    

          var xhReq = new XMLHttpRequest();
          xhReq.open("GET", url_graphic, false);
          xhReq.send(null);
          var da = JSON.parse(xhReq.responseText); ""
          console.log(da);
          var dat = [];
          var mesAno = [];

          for (i = 0; i < da.length; i++) {
            var me= new Array(da[i].ano+' - '+da[i].mes);
            mesAno.push(me);

            var serie = new Array(da[i].mes+'<br>ESTADO BOLETA: '+da[i].estado_boleta, da[i].total_mes);
            console.log(serie);
            dat.push(serie);
            console.log(dat);
          }
        
          
             

     $(function($){
            $('#grafico').highcharts({
            title: {
                text: 'Resumen de Pagos'
            },
            subtitle: {
                text: 'Total / Boleta'
            },
            xAxis: {
                min: 0,
                title: {
                    text: 'Mes'
                },
                categories:mesAno,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Consumos ($)'
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">'+userJson.name+' '+userJson.last_name+': </td></tr>' +
                    '<td style="padding:0"><b>Total: ${point.y:.0f}</b></td></tr>',

                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: 
            [{
                type: 'column',
                name: userJson.name+' '+userJson.last_name,
                data: dat
               }
            ]     

        });
    });
});