
jQuery(function ($) {

    // 書籍JSONを取得して書籍一覧を表示
    $.ajax({
        type: "GET",
        url: "http://test.eba-library.tokyo/book_json.php",
        dataType:"json",
        success: function(data){
          showBooks(data)
        }
      });

    
    /**
     * 書籍一覧を表示します。
     * @param array 書籍JSON
     * @return void
     */
    function showBooks(data) {
      // 配列を3個ずつスライスした配列を作る
      var size = 3;
      var books = [];
      for(var i = 0; i < data.length; i += size){
      　var row = data.slice(i, i + size);
        books.push(row);
      }

      // HTMLタグに変換して出力
      for(var i = 0; i < books.length; i++) {

        var list = books[i];

        // 3個づつdiv.rowタグで囲む
        var row = $('<div class="row"></div>');
        for(var k = 0; k < list.length; k++) {
          var book = list[k];
          
          // Bootstrapのcardでコーディングする
          var col = $('<div class="col-lg-4"></div>');
          var card = $('<div class="card"></div>');
          var image = $('<img class="card-img-top" src="' + book['book_image'] + '">');
          var body = $('<div class="card-body"></div>');
          var title = $('<p class="card-text">' + book['book_title'] + '</p>')

          $(body).append(title);

          $(card).append(image);
          $(card).append(body);
          $(col).append(card);

          $(row).append(col);
        }

        // 書籍一覧に1行（3冊）追加
        $('#book-list').append(row);
      }
    }
});