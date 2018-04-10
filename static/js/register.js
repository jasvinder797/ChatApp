console.log = function(){};  /*disable all console log */

function saveRecord(){
    var str = window.location.href;
    var id=str.split("id=")[1]
    var order = new Object();
    order.name = document.getElementById('add_name').value;
    order.pass = document.getElementById('add_pass').value;
    order.phone =document.getElementById('add_phone').value;
    order.token =id;
    document.getElementById('add_name').value ="";
    document.getElementById('add_pass').value = "";
    document.getElementById('add_phone').value = "";
//    alert(JSON.stringify(order))
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) 
    {
        ajaxRequest.onreadystatechange = ajaxResponse;
        ajaxRequest.open("POST", "/api/user/register/");
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

