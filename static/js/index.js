console.log = function(){};  /*disable all console log */

window.onload = function() {
   CloseInput();
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

     var data = JSON.parse(obj)  /*Convert string data to JSON Oject*/
     var rowString ="";
     for(var i=0;i<data.length;i++){
         var id = data[i]._id;
         if(data[i].active){
             rowString +='<tr><td id="tt">'+data[i].name +'</td><td id="tt">'+data[i].phone +'</td><td id="tt">'+data[i].email +'</td><td id="tt">Yes</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
         }
         else{
              rowString +='<tr><td id="tt">'+data[i].name +'</td><td id="tt">'+data[i].phone +'</td><td id="tt">'+data[i].email +'</td><td id="tt">No</td><td id="tt"><button onclick="updateRecord(\'' + id + '\')" class="btn btn-info test">Edit</button> <button onclick="requestForDelete(\'' + id + '\')" class="btn btn-warning">Delete</button></td></tr>';
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
        ajaxRequest.open("POST", "/api/user/login/");
        ajaxRequest.setRequestHeader("Content-Type", "application/json");
        ajaxRequest.send(JSON.stringify(obj));
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
   
      $("#addEmp").show();
       $("#formLogin").hide();
}
function showLogin(){
   
      $("#addEmp").hide();
       $("#formLogin").show();
}

//other js
$("#login").click(function(event){
    showLogin();
        event.preventDefault();
});
$("#register").click(function(event){
    CloseInput();
        event.preventDefault();
});

