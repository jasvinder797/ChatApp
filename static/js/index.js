console.log = function(){};  /*disable all console log */
localStorage.setItem(email, "");
var email="";
var socket = io.connect('');
var color = "", sendTo="";
var imgSelected=0;
var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#00B3E6', 
     '#3366E6', '#999966', '#99FF99', '#B34D4D',
      '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
      '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
      '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
      '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
      '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
      '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
      '#FF3380',  '#66E64D', '#4D80CC', '#9900B3', 
      '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
function randomColor(){
    for (var i = colorArray.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * colorArray.length);
        return colorArray[randomIndex];
    }
}
socket.on("userList",function(ulist){
    //var user = document.getElementById("users");
    var str1 = "";
    for(var i=0; i<ulist.length; i++){
        var id =ulist[i].id;
        str1 += '<a  href="javascript:setID(\'' + id + '\')" ><li style="color:'+ulist[i].color+'">'+ulist[i].name+'</li></a>';   
    }
    document.getElementById("userListOnline").innerHTML  = str1;
})
function setID(id){
   sendTo = id;
    alert(id)
}

function connectUser(userName,email){
    color = randomColor();
    socket.emit('login',userName,email,color);
}  
function sendMessage(){
    // alert(decodeURIComponent(imgSrc))
     var message = document.getElementById('message').value;
    if(imgSelected==1){
         if(sendTo==""){
            var imgSrc = $('#myImg').attr('src');
             //alert(imgSrc)
            socket.emit('sendImgMsg',localStorage.getItem('email'), localStorage.getItem('name'),imgSrc,color); 
            $('#tempDiv').remove();
            imgSelected=0;
         }
        else{
            alert("individual")
            socket.emit('sendImgMsgInd',localStorage.getItem('email'), localStorage.getItem('name'),imgSrc,color); 
            $('#tempDiv').remove();
        }
       
    }
    else{
        if(sendTo==""){
            socket.emit('sendMessage',localStorage.getItem('email'), localStorage.getItem('name'),message,color);
        }
        else{
             alert("individual")
            socket.emit('sendToIndividual',{toId: sendTo, from:localStorage.getItem('name'),fromEmail:localStorage.getItem('email'),msg:message,clr:color});
        }
    }
     document.getElementById('message').value = "";
  }
function sendImgMsg(imgSrc){
   // alert(decodeURIComponent(imgSrc))
    socket.emit('sendImgMsg',localStorage.getItem('name'),imgSrc,color);
  }
socket.on("sendMsg",function(data){
  
    if(data.email==localStorage.getItem('email'))
    {
        var str = '<li style="color:'+data.clr+'; text-align: right;">'+data.msg+' : '+data.from+'</li>';
    }
    else
    {
        var str = '<li style="color:'+data.clr+'; text-align: left;">'+data.from+' : '+data.msg+'</li>';
    }
    $("#oList").append(str);
   
})
socket.on("out",function(ulist){
    var str = "";
    for(var i=0; i<ulist.length; i++){
        var id =ulist[0].id;
        str = '<a  href="javascript:setID(\'' + id + '\')" ><li style="color:'+ulist[i].color+'">'+ulist[i].name+'</li></a>';   
    }
    document.getElementById('userListOnline').innerHTML = str;
   
})
socket.on("displayMsg",function(email,userName,message,color,id){
    if(email==localStorage.getItem('email'))
    {
        var str = '<li style="color:'+color+'; text-align: right;">'+message+' : '+userName+'</li>';
        $("#oList").append(str);
    }
    else
    {
        var str = '<li style="color:'+color+'; text-align: left;">'+userName+' : '+message+'</li>';
        $("#oList").append(str);
    }
})
socket.on("displayImg",function(email,userName,img,color,id){
    if(email==localStorage.getItem('email'))
    {
        var timestamp = new Date().getUTCMilliseconds();
        var str = '<li style="color:'+color+'; text-align: right;"><img id="'+timestamp+'" width="300px" height="200px" align="middle">  : '+userName+'</li>';
        $("#oList").append(str);
        var Img = document.getElementById(timestamp);
        Img.src = decodeURIComponent(img);
     
    }
    else
    {
       var timestamp = new Date().getUTCMilliseconds();
        var str = '<li style="color:'+color+'; text-align: left;"><p>'+userName+' : <img id="'+timestamp+'" width="300px" height="200px" align="middle"></p</li>';
        $("#oList").append(str);
        var Img = document.getElementById(timestamp);
        Img.src = decodeURIComponent(img);
    }
})
$(window).on('keydown', function(e) {
  if (e.which == 13) {
    sendMessage();
    return false;
  }
});
window.onload = function() {
    if(localStorage.getItem('email')==null){
       CloseInput()
    }
    else{
        if(localStorage.getItem('admin')=="Admin"){
            showAdmin();
        }
        else{
            showNonAdmin();
        }
        connectUser(localStorage.getItem('name'),localStorage.getItem('email'));
    }
}
function createOList(obj){
     var data = JSON.parse(obj);
     var rowString ="";
     for(var i=0;i<data.data.length;i++){
        var id =data.data[i].id;
        rowString +='<li>'+data.data[i].name +'</li>';
    }
    var varChat =  document.getElementById('OnlineList');
    varChat.innerHTML= rowString;
}
function getUserList(){
      var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
            ajaxRequest.onreadystatechange = ajaxResponse;
            ajaxRequest.open("GET", "api/user/"); // Where?
            ajaxRequest.send(null);
    }

    function ajaxResponse() {
        if(ajaxRequest.readyState != 4) {
              console.log("its in process")
        }
        else if(ajaxRequest.status == 200){
            createList(ajaxRequest.response);
            }
        
        else{
            alert("Its in Error");
        }
    }
}
function saveRecord(){
    var order = new Object();
    order.name = document.getElementById('add_name').value;
    order.pass = document.getElementById('add_pass').value;
    order.phone =document.getElementById('add_phone').value;
    order.email =document.getElementById('add_email').value;
    document.getElementById('add_name').value ="";
    document.getElementById('add_pass').value = "";
    document.getElementById('add_phone').value = "";
    document.getElementById('add_email').value = "";
//    alert(JSON.stringify(order))
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) 
    {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/api/user/");
        ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(JSON.stringify(order));  
    }
    function ajaxResponse() {
        if(ajaxRequest.readyState != 4)
        {
            console.log("its in process")

        }else if(ajaxRequest.status == 200){
            alert(this.responseText);
            onload(); 
        }
        else{
            console.log("Error")
        }
         
  }
}

function createList(obj){

     var data = JSON.parse(obj);
   // alert(obj);
     /*Convert string data to JSON Oject*/
     var rowString ="";
     for(var i=0;i<data.data.length;i++){
         var id =data.data[i].id;
         if(data.data[i].admin){
             rowString +='<tr><td id="tt">'+data.data[i].name +'</td><td id="tt">'+data.data[i].phone +'</td><td id="tt">'+data.data[i].email +'</td><td id="tt">Admin</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
         }
         else{
              rowString +='<tr><td id="tt">'+data.data[i].name +'</td><td id="tt">'+data.data[i].phone +'</td><td id="tt">'+data.data[i].email +'</td><td id="tt">Non Admin</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
         }
         
        }
      
    document.getElementById('empTable').innerHTML = rowString;
}

function requestForDelete(id){
 //  alert(id);
   var choice =  confirm("Are you sure, you want to delete this record")
   if (choice == true) {
       deleteRecord(id);
    }           
}

function deleteRecord(id){
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) 
    {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("DELETE", "/api/user/"+id);
        ajaxRequest.send(null);
    }
    function ajaxResponse() {//This gets called when the readyState changes.
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }
        else if(ajaxRequest.status == 200){
            alert(this.responseText);
            onload();  /*===Record delted complete load the data again*/
        }
        else{
            console.log("Error")
        }
  }
}

function updateRecord(id){
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("GET", "/api/user/"+id);
        ajaxRequest.send(null);
    }
    function ajaxResponse() {//This gets called when the readyState changes.
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }else if(ajaxRequest.status == 200){
            createForm(ajaxRequest.response,id);
        }
        else{
            console.log("Error")
        }
  }
}
function login(){
    var obj = new Object();
    obj.pass = document.getElementById('login_pass').value;
    obj.email =document.getElementById('login_email').value;
    document.getElementById('login_pass').value = "";
    document.getElementById('login_email').value = "";
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/api/user/login");
        ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(JSON.stringify(obj));
    }
    function ajaxResponse() {//This gets called when the readyState changes.
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }else if(ajaxRequest.status == 200){
           //alert(this.responseText);
            afterLogin(ajaxRequest.response)
        }
        else{
            console.log("Error")
        }
  }
}
function afterLogin(obj){
    var data = JSON.parse(obj);
    if(data.success){
        if(data.data.admin){
            email = data.data.email;
            localStorage.setItem('email', email);
            localStorage.setItem('name', data.data.name);
            localStorage.setItem('admin', "Admin");
            alert(data.message);
            showAdmin();
            connectUser(data.data.name,email);
        }
        else{
            email = data.data.email;
            localStorage.setItem('email', email);
            localStorage.setItem('name', data.data.name);
            localStorage.setItem('admin', "Non Admin");
            alert(data.message);
            showNonAdmin();
            connectUser(data.data.name,email);
           
        }
    }
    else{
        alert(data.message);
    }
   
}

//user invitation
function inviteUser(){
    var obj = new Object();
    obj.type = document.getElementById('invite_type').value;
    obj.email =document.getElementById('invite_email').value;
    obj.aemail =localStorage.getItem('email');
    var eml = obj.email;
    //alert(email);
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/api/invite/");
        ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(JSON.stringify(obj));
    }
    function ajaxResponse() {//This gets called when the readyState changes.
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }
        else if(ajaxRequest.status == 200){
            afterInvite(ajaxRequest.response,eml);
        }
        else{
            console.log("Error")
        }
  }
}
function afterInvite(obj,eml){
    var data = JSON.parse(obj);
    if(data.flag){
        var cc = confirm(data.message);
        if (cc == true){
            inviteAgain(eml);
        } 
        else{
            //do nothing 
        }
    }
    else{
        alert(data.message)
    }
}
function inviteAgain(eml){
    var obj = new Object();
    obj.email =eml;
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/api/invite/resend");
        ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(JSON.stringify(obj));
    }
    function ajaxResponse() {//This gets called when the readyState changes.
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }else if(ajaxRequest.status == 200){
            alert(this.responseText);
        }
        else{
            console.log("Error")
        }
  }
}
function createForm(obj,id){
    var data = JSON.parse(obj);   
    var formString ="";
    //$("#editor").show();
    $("#addEmp").hide();
    document.getElementById('name').value=data.name;
    document.getElementById('city').value=data.city;
    document.getElementById('phone').value=data.phone;
    document.getElementById('email').value=data.email;
    formString += '<br> <button onclick="updateRec(\'' + id + '\');" class="btn btn-info">Update</button> <button onclick="CloseInput();" class="btn btn-default">Cancel</button>';
    document.getElementById('btn').innerHTML = formString; 
}
function updateRec(id){
    var order = new Object();
    order.name = document.getElementById('name').value;
    order.city = document.getElementById('city').value;
    order.phone =document.getElementById('phone').value;
    order.email =document.getElementById('email').value;
    //alert(JSON.stringify(order))
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("PUT","/api/user/"+id);
        ajaxRequest.setRequestHeader("Content-Type", "application/json");// Where?
        ajaxRequest.send(JSON.stringify(order));       
    }
    function ajaxResponse(){
        if(ajaxRequest.readyState != 4){
            console.log("its in process")
        }
        else if(ajaxRequest.status == 200) {
             alert(this.responseText);
            onload(); 
        }
        else{
            console.log("Error")
        }
  }
}

function CloseInput(){
    $("#formLogin").show();
    $("#afterLogin").hide();
}
function showLogin(){
    $("#formLogin").show();
    $("#afterLogin").hide();
}
function showAdmin(){
    $("#formLogin").hide();
    $("#afterLogin").show();
    $("#users").hide();
    $("#userList").hide();
     $("#invite").show();
}
function showUser(){
    $("#invite").hide();
    $("#users").show();
    $("#chatContainer").hide();
    getUserList();
}
function showChat(){
    $("#invite").hide();
    $("#users").hide();
     $("#chatContainer").show();
     $("#chat_window").show();
    $("#userList").show();
}
function showInvite(){
    $("#invite").show();
    $("#users").hide();
    $("#chatContainer").hide();   
}
function showNonAdmin(){
    $("#formLogin").hide();
    $("#afterLogin").show();
    $("#chatContainer").show();
     $("#chat_window").show();
    $("#invite").hide();
    $("#users").hide();
    $(".dd").hide();
    
}
//for chat.....
function logout(){
    localStorage.clear();
    onload();
}

$("#upfile1").click(function () {
    $("#file1").trigger('click');
});

var imageData="";
$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            var totalBytes = this.files[0].size
            var _size = Math.floor(totalBytes/1000);
             if(_size<500){
                  reader.onload = imageIsLoaded;
                }else{
                    alert("Image size uploaded should not exceed 2 MB")
                 }
             reader.readAsDataURL(this.files[0]);
        }
    });
});
function imageIsLoaded(e) {
    imageData = e.target.result
    var str = '<center><div id="tempDiv" class="container" style="width:300px; height:200px;"><img id="myImg" width="300px" height="200px" align="middle"><div class="centered">Click Send to send</div> <span class="cancel" onclick="removeDiv()">X</span></div></center>';
    $("#oList").append(str);
    var Img = document.getElementById("myImg");
    Img.src = e.target.result;
    imgSelected=1;
    
};
function removeDiv(){
     $('#tempDiv').remove();
    imgSelected=0;
}

