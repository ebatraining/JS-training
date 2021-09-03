
jQuery(function ($) {

    // 書籍一覧データ
    var all_books = [];

    // 書籍JSONを取得して書籍一覧を表示
    $.ajax({
        type: "GET",
        url: "http://test.eba-library.tokyo/book_json.php",
        dataType:"json",
        success: function(data){
          all_books = data;
          showBooks(data)
        }
      });

    // カテゴリ選択イベント
    $("a.category").on('click', function() {
      var category_no = $(this).attr('data-category_no');
      var data = [];
      if (category_no) {
        // カテゴリーでフィルタ
        for(var i = 0; i < all_books.length; ++i) {
          var book = all_books[i];
          if (book['category_no'] == category_no) {
            data.push(book);
          }
        }
      } else {
        data = all_books;
      }

      showBooks(data);

    });
    
    /**
     * 書籍一覧を表示します。
     * @param array 書籍JSON
     * @return void
     */
    function showBooks(data) {
      // 書籍一覧クリア
      $('#book-list').empty();

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

          var class_name = "";
          switch (book['category_no']) {
            case "1":
              class_name = "primary";
              break;
            case "2":
              class_name = "secondary";
              break;
            case "3":
              class_name = "success";
              break;
            case "4":
              class_name = "danger";
              break;
            case "5":
              class_name = "warning";
              break;
            default:
              class_name = "info";
          }

          var category = ' <span class="badge badge-pill badge-' + class_name +'">' + book['category_name'] + '</span>';
          var title = $('<p class="card-text">' + book['book_title'] + category + '</p>')

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