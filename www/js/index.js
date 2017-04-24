/*

COURSE: MAD9022 App Dev II
PROJECT: Secret Messenger
AUTHORS: Pair 11
DATE: Monday, April 24 2017

*/

var app = null;
var loginPage = null;

//=========================================================

app = (function(){
    'use strict';
    var app =  {};

    app.user_id = -1;
    app.user_guid = -1;
    
    /* ---------------------------------------------------- */       
    
    document.addEventListener('deviceready', onDeviceReady);    
    function onDeviceReady(ev) {

        app.messageList = document.getElementById("messageList");        
        
        loginPage.makePage();
    }

    /* ---------------------------------------------------- */       
    
    
    
    return app;
})();









//=========================================================

loginPage = (function(){
    'use strict';
    var module = {};
    
    var unIn = null;
    var emIn = null;
    var lgBtn = null;
    var rgBtn = null;

    // for testing purposes only
    var userName = "gordi";
    var userEmail = "kerr0215@algonquincollege.com"
    //

    module.clickLg = function(ev){
        ev.preventDefault();

        var url = "http://griffis.edumedia.ca/mad9022/steg/login.php";
        var formData = new FormData();
        formData.append("user_name", unIn.value);
        formData.append("email", emIn.value);
        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});

        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
            
            
                // this code path
                
                app.user_id = data.user_id;
                app.user_guid = data.user_guid;
            
                messageList.makePage();
            
                //
                        
                s = "code: "+data.code;
                console.log(s);
                
                
            })
            .catch(function(err){
                alert(err.message);
            });
    }
    
    module.clickRg = function(ev){
        ev.preventDefault();

        var url = "http://griffis.edumedia.ca/mad9022/steg/register.php";
        var formData = new FormData();
        formData.append("user_name", unIn.value);
        formData.append("email", emIn.value);
        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});

        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                console.log(data);
            })
            .catch(function(err){
                alert(err.message);
            });
        
        
    }
    
    module.makePage = function(){
        //console.log("making login page.");
        unIn = document.getElementById("unIn");
        emIn = document.getElementById("emIn");

        // for testing only
        unIn.value = userName;
        emIn.value = userEmail;
        //
        
        lgBtn = document.getElementById("lgBtn");
        lgBtn.addEventListener("click", module.clickLg);
        rgBtn = document.getElementById("rgBtn");
        rgBtn.addEventListener("click", module.clickRg);
        
    }

    return module;
})();








//=========================================================

messageList = (function(){
    'use strict';
    var module = {};
    
    module.makePage = function(){
        
        // switch on modal
        app.messageList.classList.add("active");
        
        //"name": "listMessages",
        //"endpoint": "msg-list.php",
        //"desc": "get the list of messages for a user from the queue. User must be logged in",
        //"requires": ["user_id", "user_guid"]
        
        var url = "http://griffis.edumedia.ca/mad9022/steg/msg-list.php";
        var formData = new FormData();

        formData.append("user_id", app.user_id);
        formData.append("user_guid", app.user_guid);

        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});
        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(function(data){

            // this code path
                console.log(data);
                //    module.clickLg = function(ev){
                //        ev.preventDefault();
            
            })
            .catch(function(err){
                alert(err.message);
            });

    }

    return module;
})();
