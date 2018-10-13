angular.module('App', []).controller('CrudCtrl',function($scope, $http, $window) {
    $scope.entity = {}

    var arrayUrl = getUrlVars();
    var url_user = service_user +'/'+ arrayUrl.ID;
    var url_graphic = service_PaymentDocument + '?idUserGraphic=' + arrayUrl.ID; 

    //obtener datos de usuario
    var userReq = new XMLHttpRequest();
    userReq.open("GET", url_user, false);
    userReq.send(null);
    var userJson = JSON.parse(userReq.responseText); //variable con datos de usuario


    // Obtener transacciones mediante método GET para tabla
    $scope.getData = function() 
    {
        $http.get(url_graphic)
        .then(function(response){
            if(response.status == 204){
                toastr.info("No posee transacciones registradas");
                $scope.JsonData = response.data;

            }else{
                $scope.JsonData = response.data;
                getPagination('#datatable-responsive');                
            }           
        }, function (error) {
            toastr.error("Ocurrió un error al intentar leer el registro");
            console.log(error);
        });        
    }
    $scope.getData();
    

          var xhReq = new XMLHttpRequest();
          xhReq.open("GET", url_graphic, false);
          xhReq.send(null);
          var da = JSON.parse(xhReq.responseText);
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