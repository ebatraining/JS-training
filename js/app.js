
jQuery(function ($) {
    $.ajax({
        type: "GET",
        url: "http://test.eba-library.tokyo/book_json.php",
        dataType:"json",
        success: function(data){
          console.log(data);
        }
      });
});