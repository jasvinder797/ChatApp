console.log = function(){};  /*disable all console log */

window.onload = function() {
   var str = window.location.href;
    var id=str.split("id=")[1]
   // alert(id);
    var obj = new Object();
    var ajaxRequest = new XMLHttpRequest();
    if (ajaxRequest) {
			ajaxRequest.onreadystatechange = ajaxResponse;
			ajaxRequest.open("PUT", "api/user/"+id); // Where?
            ajaxRequest.setRequestHeader("Content-Type", "application/json");
            ajaxRequest.send(JSON.stringify(obj));
    }

    function ajaxResponse() {
        if(ajaxRequest.readyState != 4) {
              console.log("its in process")
        }
        else if(ajaxRequest.status == 200){
             alert(this.responseText);
            window.location.href = "index.html";    
        }
        
        else{
            alert("Its in Error");
        }
    }
}
