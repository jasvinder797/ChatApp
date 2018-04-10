console.log = function(){};  /*disable all console log */
var email="";
window.onload = function() {
   CloseInput();
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
    alert(data.data[0].name);
     /*Convert string data to JSON Oject*/
     var rowString ="";
     for(var i=0;i<data.length;i++){
         var id = data[i].id;
         if(data[i].admin){
             rowString +='<tr><td id="tt">'+data[i].name +'</td><td id="tt">'+data[i].phone +'</td><td id="tt">'+data[i].email +'</td><td id="tt">Admin</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
         }
         else{
              rowString +='<tr><td id="tt">'+data[i].name +'</td><td id="tt">'+data[i].phone +'</td><td id="tt">'+data[i].email +'</td><td id="tt">Non Admin</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
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
            alert(this.responseText);
            afterLogin(ajaxRequest.response)
        }
        else{
            console.log("Error")
        }
  }
}
function afterLogin(obj){
    
    var data = JSON.parse(obj);   
    email = data.email;
    if(data.admin){
        showAdmin();
    }
   // alert(data.name)
}
//user invitation
function inviteUser(){
    var obj = new Object();
    obj.type = document.getElementById('invite_type').value;
    obj.email =document.getElementById('invite_email').value;
    obj.aemail =email;
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
function inviteAgain(eml)
{
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
}
function showUser(){
    $("#invite").hide();
    $("#users").show();
    getUserList();
}
function showInvite(){
    $("#invite").show();
    $("#users").hide();
}
//other js
//$("#userList").click(function(){
//   showUser()
//       // event.preventDefault();
//});
//$("#register").click(function(event){
//    CloseInput();
//        event.preventDefault();
//});

