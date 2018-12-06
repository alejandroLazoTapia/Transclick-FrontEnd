//Valida los campos ingresados en el formulario  
function validateInput(){
    var obj =[];
    obj.status = true;
    obj.message = "";
    
    if ($('#email').val() == ''){
      obj.status = false;
      obj.message = "Debe ingresar email.";
    }else if(!IsEmail($('#email').val())){
        obj.status = false;
        obj.message = "Email inválido.";
    }else if($('#password').val()  == ''){
      obj.status = false;
      obj.message = "Debe ingresar password.";
    }
    return obj;
    } 

function getUrlVars()
    {
        try {
            var vars = [], hash;
            var url = window.location.href.slice(window.location.href.indexOf('') + 1).split('&');
            var urlEncrypt = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

            if (urlEncrypt == undefined || urlEncrypt == '' || url == undefined || url == '') {
                window.location.href = getAbsolutePath() + "/page_404.html";
                return;
            }else
            {                    
                //console.log("----------------------");        
                //console.log("QueryString: " + urlEncrypt);
                var dec = window.atob(urlEncrypt);
                //console.log(dec);
                //console.log("----------------------");
                var hashes = dec.split('&');
                for(var i = 0; i < hashes.length; i++)
                {
                    hash = hashes[i].split('=');
                    //vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
            }
        }catch(err) {
            window.location.href = getAbsolutePath() + "/page_404.html";
        }
        return vars;        
    }


    function getUrlEncrypt()
    {
        var urlEncrypt = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

        return urlEncrypt;        
    }    
// Get Path ../
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/'));
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
};

function getMaxOfJson(jsonalreadyparsed, property) {
    var max = null;        
    for (var i=0 ; i<jsonalreadyparsed.length ; i++) {
            if(max == null){
                max = jsonalreadyparsed[i][property];
            } else {

            if (parseFloat(jsonalreadyparsed[i][property]) > max){

                max = jsonalreadyparsed[i][property];

            }

        }

    }
    return max;
};

function mayusc(e) {
    e.value = e.value.toUpperCase();
}

var config = 
{
    async: true,
    crossDomain: true,
    headers: 
    {
      'Content-Type': 'application/json; charset=utf-8', 
      'Accept': 'application/json' 

    }
};

function enabledBtnDelete(obj)
{
    if(obj.checked==true){            
        $("#removeBtn").attr("style", "visibility: visible");
    }else{
        $("#removeBtn").attr("style", "visibility: hidden");
    }
};

function encrypt(string)
{
    var enc = window.btoa(string);

    return enc;
};


function decrypt(string)
{
    var dec = window.atob(string);

    return dec;
};

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!regex.test(email)) {
      return false;
    }else{
      return true;
    }
    };

function getSysdate(){
    var currentdate = new Date();  
    var date = currentdate.toLocaleString("en-US", {timeZone: "America/Santiago"});  
    //console.log(date)
    return date;

};

function isMobile() { 
    var element = document.getElementById("body");


    if( navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    ){
        element.classList.add("ng-scope nav-md");
       return;
     }
    else {
        element.classList.add("ng-scope nav-sm");       
        return;
     }
   };

   (function (global) { 

    if(typeof (global) === "undefined") {
        throw new Error("window is undefined");
    }

    var _hash = "!";
    var noBackPlease = function () {
        global.location.href += "#";

        // making sure we have the fruit available for juice (^__^)
        global.setTimeout(function () {
            global.location.href += "!";
        }, 50);
    };

    global.onhashchange = function () {
        if (global.location.hash !== _hash) {
            global.location.hash = _hash;
        }
    };

    global.onload = function () {            
        noBackPlease();

        // disables backspace on page except on input fields and textarea..
        document.body.onkeydown = function (e) {
            var elm = e.target.nodeName.toLowerCase();
            if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
                e.preventDefault();
            }
            // stopping event bubbling up the DOM tree..
            e.stopPropagation();
        };          
    }

})(window);   

$("#show_password").hover(
    function functionName() {
      //Change the attribute to text
      $("#password").attr("type", "text");
      $(".mdi")
        .removeClass("mdi-eye")
        .addClass("mdi-eye-off");
    },
    function() {
      //Change the attribute back to password
      $("#password").attr("type", "password");
      $(".mdi")
        .removeClass("mdi-eye-off")
        .addClass("mdi-eye");
    }
  );