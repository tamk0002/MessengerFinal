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

    /* ---------------------------------------------------- */       
    document.addEventListener('deviceready', onDeviceReady);
    
    function onDeviceReady(ev) {
        window.addEventListener('push', onRatchetPush);        

        app.messageList = document.getElementById("messageList");
        
        
        loginPage.makePage();
    }
    
    function onRatchetPush(ev){        
        
        let content = document.querySelector('.content');
        console.log('push', content.id);
        
        //        switch(content.id){
        //            case 'listPeople':                
        //                people.makePage()
        //                break;
        //            case 'listGifts':
        //                gifts.makePage();
        //                break;
        //        };
    }

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
                console.log(data);
                app.messageList.classList.add("active");
            })
            .catch(function(err){
                alert(err.message);
            });
    }
    
    module.clickRg = function(ev){
        ev.preventDefault();
        //        var messageList = document.getElementById("messageList");
        //        messageList.classList.add("active");

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
        console.log("making login page.");
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
