angular.module('App', []).controller('CrudCtrl',function($scope, $http, $window) {
    $scope.entity = {}

    var arrayUrl = getUrlVars();
    var url_user = service_user +'/'+ arrayUrl.ID;
    var url_table= service_consumption + '?idUser=' + arrayUrl.ID; 
    var url_graphic= service_consumption + '?idUserGraphic=' + arrayUrl.ID; 

    //obtener datos de usuario
    var userReq = new XMLHttpRequest();
    userReq.open("GET", url_user, false);
    userReq.send(null);
    var userJson = JSON.parse(userReq.responseText); //variable con datos de usuario  

    // Obtener transacciones mediante método GET
    $scope.getData = function() 
    {
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
            toastr.error("El Usuario Ingresado No Posee transacciones registradas");
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
          var cant_trx=[];

          for (i = 0; i < da.length; i++) {
            var me= new Array(da[i].ano+" - "+da[i].mes);
            mesAno.push(me);

            var ca_tx=new Array(da[i].cant_trx);
            cant_trx.push(ca_tx)

            var serie = new Array(da[i].mes+'<br> CANTIDAD TRX: '+da[i].cant_trx, da[i].Total);
            console.log(serie);
            dat.push(serie);
            console.log(dat);
          }
        
          
             

     $(function($){
            $('#grafico').highcharts({
            title: {
                text: 'Resumen de Transacciones'
            },
            subtitle: {
                text: 'Total / Mes'
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