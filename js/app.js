  // 書籍一覧データ
var all_books = [];

/**
 * 書籍詳細をダイアログ表示します。
 * @param int book_no 書籍番号
 * @return void
 */
function showBookDetail(book_no) {
    // 書籍番号と一致するデータを検索
    var book = jQuery.grep(all_books, function(n, i){
      return n.book_no == book_no;
    });

    var html = '<table class="book-detail"><tr><th>著者</th><td>' + book[0].book_author + '</td></tr>'
                + '<tr><th>出版日</th><td>' + book[0].book_publish_date + '</td></tr></table>'

    // sweetalert2によるダイアログ表示
    Swal.fire({
      title: book[0].book_title,
      width: 600,
      html: html,
      imageWidth: 240,
      imageUrl: book[0].book_image,
      footer: '<a href="' + book[0].book_url + '" target="_blank"><i class="fas fa-external-link-square-alt"></i> Amazonでチェック</a>'
    })
}

jQuery(function ($) {

    // 書籍JSONを取得して書籍一覧を表示
    $.ajax({
        type: "GET",
        url: "http://test.eba-library.tokyo/book_json.php",
        dataType:"json",
        success: function(data){
          all_books = data;
          // 新着一覧(スライダー)生成
          showNewBooks(data);
          // 書籍一覧を表示
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
     * @param array data 書籍JSON
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

      // ページネーションの組み込み
      $('#book-pager').pagination({
        dataSource: books,
        pageSize: 3,          // 1ページは3行（3x3=9冊）表示
        callback: changePage  // ページがめくられた時に呼ばれる関数
      });

    }

    /**
     * 書籍一覧のページ切替を行います。
     * @param array books 書籍JSON(3行づつスライスされた配列)
     * @return void
     */
     function changePage(books) {
      // ページクリア
      $('#book-list').empty();

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
          var image = $('<a href="javascript:showBookDetail(' + book['book_no'] + ')">'
                          + '<img class="card-img-top" src="' + book['book_image'] + '"></a>');
          var body = $('<div class="card-body"></div>');

          // カテゴリー名を色分けしてラベル表示
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

    /**
     * 新着一覧を表示します。
     * @param array books 書籍JSON
     * @return void
     */
     function showNewBooks(books) {
      books.sort(function ( a, b ){
          // 出版日によるソート関数
          var ret = 0;
          if( a.book_publish_date < b.book_publish_date ){ ret = 1; }
          else if( a.book_publish_date > b.book_publish_date ){ ret = -1; }
          return ret;
      });

      // TOP10件のタグ生成
      for(var i = 0; i < 10; ++i) {
        var book = books[i];
        var slide = $('<div class="swiper-slide"><a href="javascript:showBookDetail(' + book['book_no'] + ')">'
                        + '<img class="card-img-top" src="' + book.book_image + '"></a></div>');
        $('div.swiper-wrapper').append(slide);
      }

      // スライダー生成
      var swiper = new Swiper(".new-book-swiper", {
        slidesPerView : 6,
        spaceBetween : 10,
        slidesPerGroup : 1,
        loop : true,
        loopFillGroupWithBlank : false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation : {
          nextEl : '.swiper-button-next',
          prevEl : '.swiper-button-prev',
        },
      });
    }

});