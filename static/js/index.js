console.log = function(){};  /*disable all console log */
localStorage.setItem(email, "");
var email="", userC ="";
var socket = io.connect('');
var color = "";
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
socket.on("userList",function(userName,color){
    //alert(userName); 
    //var user = document.getElementById("users");
    var str = '<center><li style="color:'+color+'">'+userName+' Connected</li></center>';
    $("#oList").append(str);
})
socket.on("disconnec",function(userName,color){
    //alert(userName); 
    //var user = document.getElementById("users");
    var str = '<center><li style="color:'+color+'">'+userName+' Disconnected</li></center>';
    $("#oList").append(str);
})
function connectUser(userName){
    color = randomColor();
    userC = userName;
    socket.emit('login',userName,color);
}  
function sendMessage(){
    var message = document.getElementById('message').value;
    socket.emit('sendMessage',localStorage.getItem('name'),message,color);
      document.getElementById('message').value = "";
  }
socket.on("displayMsg",function(userName,message,color){
    //console.log(userName); 
    if(userC==userName)
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
        showAdmin();
        connectUser(localStorage.getItem('name'));
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
    //alert(data.data[0].id);
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
            alert(data.message);
            showAdmin();
            connectUser(data.data.name);
        }
        else{
             alert("Non Admin")
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
}
function showInvite(){
    $("#invite").show();
    $("#users").hide();
    $("#chatContainer").hide();
    
}
//for chat.....
function logout(){
    localStorage.clear();
    onload();
}
