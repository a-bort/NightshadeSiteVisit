$(document).ready(function() {
  console.log("hola");
  
  var now = new Date();

  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);

  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $("#visitDate").val(today);
  $("#visitDuration").val(60);
  
  $("#visit-form").on("submit", function(e){
    e.preventDefault();
    
    let form = e.currentTarget;
    
    let url = form.action;
    
    try {
      let formFields = new FormData(form);
      //Create an object from the form data entries
      let formDataObject = Object.fromEntries(formFields.entries());
      // Format the plain form data as JSON
      let formDataJsonString = JSON.stringify(formDataObject);
      $.ajax("/sitevisit/create", {
        data: formDataJsonString,
        contentType : 'application/json',
        type: 'POST',
        success: function(data){
          console.log("success");
          console.log(data);
        }
      }).fail(function(data){
        console.log("failure");
        console.log(data);
      });
      
      console.log(formDataJsonString);
    }
    catch (error){
      console.error(`An has occured ${error}`);
    }
  });
});

