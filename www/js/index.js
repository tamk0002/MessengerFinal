/*

COURSE: MAD9022 App Dev II
PROJECT: Secret Messenger
AUTHORS: Pair 11
DATE: Monday, April 24 2017

*/

var app = null;
var loginPage = null;
var messageList = null;
var createMessage = null;

//=========================================================

app = (function(){
    'use strict';
    var app =  {};

    app.user_id = -1;
    app.user_guid = -1;
    
    /* ---------------------------------------------------- */       
    
    document.addEventListener('deviceready', onDeviceReady);    
    function onDeviceReady(ev) {

        app.messageListPage = document.getElementById("messageList");        
        app.createMessagePage = document.getElementById("messageSend");        
        
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
                        
                //                s = "code: "+data.code;
                //                console.log(s);
                
                
            })
            .catch(function(err){
                console.log("fetch error");
                console.log(err.message);
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
                console.log('fetch error');
                console.log(err.message);
            });
        
        
    }
    
    module.makePage = function(){
        //console.log("making login page.");
        unIn = document.getElementById("unIn");
        emIn = document.getElementById("emIn");

        // for testing only - could be used for something like a localStorage option
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
    
    var createBtn = null;
    
    var clickCreate = function(ev){
        console.log('messageList _clickCreate()');
        
        ev.preventDefault();
        createMessage.makePage();
    }
    
    module.makePage = function(){
        console.log('messageList.makePage()');
        
        // switch on modal
        app.messageListPage.classList.add("active");
        
        createBtn = document.getElementById("createBtn");
        createBtn.addEventListener("click", clickCreate);
        
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
                console.log('fetch error');
                console.log(err.message);
            
            });

    }

    return module;
})();







//=========================================================

createMessage = (function(){
    'use strict';
    var module = {};
    var backBtn = null;
    
    var clickBack = function(ev){
        ev.preventDefault();
        app.createMessagePage.classList.remove("active");
    }

    module.makePage = function(){
        console.log('createMessage.makePage()');
        
        // switch on modal
        app.createMessagePage.classList.add("active");

        backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", clickBack);
        
        var popover = document.querySelector("#popover select");
        
        
        //"name": "listUsers",
        //"endpoint": "user-list.php",
        //"desc": "get a list of users and their ids. User must be logged in.",
        //"requires": ["user_id", "user_guid"]
        
        var url = "http://griffis.edumedia.ca/mad9022/steg/user-list.php";
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
                //                console.log('list of users');
                                console.log(data);
                //    module.clickLg = function(ev){
                //        ev.preventDefault();
                var o = null;
                data.users.forEach(user=>{
                    o = document.createElement('option');
                    o.textContent = user.user_name;
                    o.value = user.user_id;
                    popover.appendChild(o);
                });
            
            })
            .catch(function(err){
                console.log('fetch error');
                console.log(err.message);
            
            });
    }
    
    var sendMessages = function(ev){
        
        //"name": "sendMessages",
        //"endpoint": "msg-send.php",
        //"desc": "upload an image to send to a user. User must be logged in. The image field must be a file.",
        //"requires": ["user_id", "user_guid", "recipient_id", "image"]
        
        var url = "http://griffis.edumedia.ca/mad9022/steg/msg-send.php";
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
                console.log('fetch error');
                console.log(err.message);
            
            });

    }

    return module;
})();
