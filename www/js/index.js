/*

COURSE: MAD9022 App Dev II
PROJECT: Secret Messenger
AUTHORS: Pair 11
DATE: Wednesday, April 26 2017

DEVELOPMENT NOTES:

    search for word todo === 'to do' items

    search for word test === stuff that will change as app gets more features complete 

    search for word ios === will change when putting on phone (testing in browser platform)

    search for word perhaps === notes about structure of code, possible imporovements
    
    There is a makePage in each module, however the program is not using
    the ratchet/push.js, therefore the html elements are not created and
    destroyed html changes.  perhaps 
        move querySelector stuff to an initPage
        and rename makePage to showPage
        
    perhaps better fetch fail messages to user. alert "internet disconnected"
    
    
CODE DOCUMENTATION:
    
    This app is divided into modules.  Those modules are assigned to these var:
*/

var app = null;

var loginPage = null;

var messageList = null;

var createMessage = null;

var messageDetail = null;

//=============================================================================
//=============================================================================
//
app = (function(){
    'use strict';
    var app =  {};

    // public    
    app.user_id = -1;
    app.user_guid = -1;
    
    // ------------------------------------------------------------------------
    // initialize
    document.addEventListener('deviceready', onDeviceReady);    
    function onDeviceReady(ev) {

        // perhaps: move to modules
        app.messageListPage = document.getElementById("messageList");        
        app.createMessagePage = document.getElementById("messageSend");        
        app.messageDetailsPage = document.getElementById("messageDetails");
        
        // start page
        loginPage.makePage();
    }
    app.doFetch = function(url, formData, callback){
        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});
        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(callback)
            .catch(function(err){
                console.log('fetch error');
                console.log(err.message);
            
            });
    }
    // ------------------------------------------------------------------------    
    return app;
})();



//=============================================================================
//=============================================================================
//
// login
//
loginPage = (function(){
    'use strict';
    var module = {};
    
    // private. html elements
    var unIn = null;
    var emIn = null;
    var lgBtn = null;
    var rgBtn = null;

    // for testing purposes only
    var userName = "gordi";
    var userEmail = "kerr0215@algonquincollege.com"
    //

    // ------------------------------------------------------------------------
    // login click event
    //
    module.clickLg = function(ev){
        ev.preventDefault();

        //"name": "login",
        //"endpoint": "login.php",
        //"desc": "login to a user account",
        //"requires": ["user_name", "email"]

        var url = "http://griffis.edumedia.ca/mad9022/steg/login.php";
        var formData = new FormData();
        formData.append("user_name", unIn.value);
        formData.append("email", emIn.value);
        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});

        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(loginDataFunction)
            .catch(function(err){
                console.log("fetch error");
                console.log(err.message);
            });
    }
    var loginDataFunction = function(data){
            
        app.user_id = data.user_id;
        app.user_guid = data.user_guid;

        messageList.makePage();
            
    };
    

    // ------------------------------------------------------------------------
    // register click event
    //
    module.clickRg = function(ev){
        ev.preventDefault();

        //"name": "register",
        //"endpoint": "register.php",
        //"desc": "create a user account",
        //"requires": ["user_name", "email"]

        var url = "http://griffis.edumedia.ca/mad9022/steg/register.php";
        var formData = new FormData();
        formData.append("user_name", unIn.value);
        formData.append("email", emIn.value);
        var request = new Request(url, {method: "POST", mode: "cors", body: formData,});

        fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(registerDataFunction)
            .catch(function(err){
                console.log('fetch error');
                console.log(err.message);
            });
        
        
    }
    var registerDataFunction = function(data){
        console.log(data);
    }
    
    // ------------------------------------------------------------------------
    // login page
    //
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

    
    // ------------------------------------------------------------------------
    return module;
})();



//=============================================================================
//=============================================================================
//
// message list
//
messageList = (function(){
    'use strict';
    var module = {};
    
    // private
    var createBtn = null;
    var listElement = null;
    
    
    // ------------------------------------------------------------------------
    // message list page
    //
    module.makePage = function(){
        console.log('messageList.makePage()');
        
        // switch on modal
        app.messageListPage.classList.add("active");
        
        createBtn = document.getElementById("createBtn");
        createBtn.addEventListener("click", clickCreate);
        
        listElement = document.getElementById("review-list");
        
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
            .then(messageListFunction)
            .catch(function(err){
                console.log('fetch error');
                console.log(err.message);
            
            });

    }
    var clickCreate = function(ev){
        console.log('messageList _clickCreate()');
        
        ev.preventDefault();
        createMessage.makePage();
    }
    var messageListFunction = function(data){
        console.log('message list', data);
        
        listElement.innerHTML = "";
        
        data.messages.forEach(msg=>{
            var li = document.createElement('li');
            listElement.appendChild(li);
            li.className = "table-view-cell";

            var a = document.createElement('a');
            li.appendChild(a);
            a.className = "name";
            
            a.textContent = msg.user_name;
            a.addEventListener("click", clickViewMessage);
            a.setAttribute("messageid", msg.msg_id);
            
            //a.textContent = msg.user_name + " " + msg.sender_id;
            
            //var a = document.createElement('a');
            //<span class="name"><a href="#msg-list.php">Bob Smith</a></span> 
            //<a class="navigate-right pull-right" href="review.html"> tap to view email
            //<span class="dob">March 10</span>
        });
    }    
    var clickViewMessage = function(ev){
        ev.preventDefault();
        var msg_id = ev.currentTarget.getAttribute("messageid");
        app.messageListPage.classList.remove("active");
        messageDetails.makePage(msg_id);
    }

    // ------------------------------------------------------------------------
    return module;
})();



//=============================================================================
//=============================================================================
//
// create message
//
createMessage = (function(){
    'use strict';
    var module = {};
    
    // private. html elements
    var backBtn = null;
    var sendBtn = null;
    var popover = null;
    var photoElement = null;
    var canvasElement = null;
    
    // private flag
    var imageTaken = false;
    
    // ------------------------------------------------------------------------
    // create message page
    //
    module.makePage = function(){
        console.log('createMessage.makePage()');
        
        // switch on modal
        app.createMessagePage.classList.add("active");

        backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", clickBack);
        
        // perhaps: delay this connection until user list comes back.
        sendBtn = document.getElementById("sendBtn");
        sendBtn.addEventListener("click", clickSend);

        // ----- 
        // message is to... fill user list selector
        popover = document.querySelector("#popover select");
        popover.innerHTML = "";
        
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
            .then(userListFunction)
            .catch(function(err){
                console.log('fetch error');
                console.log(err.message);
            
            });
        // -----
        
        photoElement = document.querySelector("#displayPhoto img");
        photoElement.addEventListener("click", clickTakePicture);
        
        canvasElement = document.querySelector("#displayPhoto canvas");
        
        
        
    }
    var clickBack = function(ev){
        ev.preventDefault();
        app.createMessagePage.classList.remove("active");
    }
    var userListFunction = function(data){
        var o = null;
        data.users.forEach(user=>{
            o = document.createElement('option');
            o.textContent = user.user_name;
            o.value = user.user_id;
            popover.appendChild(o);
        });
    }
    var clickTakePicture = function(ev){
        ev.preventDefault();
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.PNG,
            mediaType: Camera.MediaType.PICTURE,
            pictureSourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            targetWidth: 300,
            targetHeight: 300,
        }    

        // this is a trick to move the popup when it appears.
        // just before calling the camera.getPicture();
        // keep checking for it ten times per second until it is found.
        //function doTimeout(){
        //    setTimeout(function(){
        //        console.log("timeout");
        //        var popup = document.querySelector('.cordova-camera-capture');
        //        if (popup){
        //            globalCameraPreview = true;
        //            createImageButton.style.display = 'none';
        //            var popupbutton = popup.querySelector("button");
        //            popupbutton.classList.add("CameraButton");
        //            var node = document.createElement('br');
        //            popup.insertBefore(node, popupbutton)
        //            placePreview(document.body.removeChild(popup));  
        //            return;
        //        }
        //        doTimeout();
        //    }, 100);        
        //
        //}
        //doTimeout();
        //
        navigator.camera.getPicture(onSuccess, onFail, options);
    }
    function onSuccess (imageData){
        //globalImageData = imageData;
        //globalCameraPreview = false;
        
        //photoElement.src = imageData;
        photoElement.addEventListener('load', function(ev){
            
            var ctx = canvasElement.getContext('2d');

            var w = photoElement.width;
            var h = photoElement.height;
            canvasElement.style.width = w + 'px';
            canvasElement.style.height = h + 'px';
            canvasElement.width = w;
            canvasElement.height = h;

            ctx.drawImage(photoElement, 0, 0);
    
            imageTaken = true;
            
        });
        // this will change for ios
        photoElement.src = "data:image/png;base64," + imageData;        
    }
    function onFail (ev){
        console.log('camera.getPicture Fail');
        //globalCameraPreview = false;
    }
    
    
    // ------------------------------------------------------------------------
    // send message click event
    //
    var clickSend = function(ev){
        ev.preventDefault();
        
        if(!imageTaken){
            alert ("Take a picture by clicking on the blue square.");
            return;
        }
        
        //"name": "sendMessages",
        //"endpoint": "msg-send.php",
        //"desc": "upload an image to send to a user. User must be logged in. The image field must be a file.",
        //"requires": ["user_id", "user_guid", "recipient_id", "image"]
        
        var url = "http://griffis.edumedia.ca/mad9022/steg/msg-send.php";
        var formData = new FormData();

        formData.append("user_id", app.user_id);
        formData.append("user_guid", app.user_guid);
        
        // for testing purposes - send to self
        formData.append("recipient_id", app.user_id);
        // todo - read select option - the actual selection

        // -----
        // the image
        //var blob = dataURLtoBlob(canvasElement.src);
        var blobTemporary = null;
        canvasElement.toBlob(function(blob){
            blobTemporary = blob;
            formData.append('image', blobTemporary, 'sample.png');
            
            app.doFetch(url, formData, sendMessagesResult);
        });
        // -----
        
    }
    var sendMessagesResult = function (data){
        console.log('send messages result, ', data);  
    };

    // ------------------------------------------------------------------------
    return module;
})();



//=============================================================================
//=============================================================================
//
// message details
//
messageDetails = (function(){
    'use strict';
    var module = {};
    
    // private
    var receivedPhoto = null;
    
    // ------------------------------------------------------------------------
    // message detail page
    //
    module.makePage = function(messageid){
        console.log('messageDetails.makePage(', messageid, ')');
        
        // switch on modal
        app.messageDetailsPage.classList.add("active");
        
        receivedPhoto = document.getElementById("receivedPhoto");
        
        //"name": "getMessage",
        //"endpoint": "msg-get.php",
        //"desc": "get the single image for the message. User must be logged in.",
        //"requires": ["user_id", "user_guid", "message_id"]

        var url = "http://griffis.edumedia.ca/mad9022/steg/msg-get.php";
        var formData = new FormData();

        formData.append("user_id", app.user_id);
        formData.append("user_guid", app.user_guid);
        formData.append("message_id", messageid);
        
        app.doFetch(url, formData, messageDataFunction);
    }
    var messageDataFunction = function(data){
        console.log("the message", data);
        receivedPhoto.src = "http://griffis.edumedia.ca/mad9022/steg/"+data.image;
    };
        
    // ------------------------------------------------------------------------
    return module;
})();
