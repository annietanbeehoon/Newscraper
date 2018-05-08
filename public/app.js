$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + "<br />" + data[i].title + "<br />" + "<a target=' _blank' href=" + data[i].link + ">" + "http://www.businessinsider.com" + data[i].link + "</a>" + "</p>");
    }
  });
$(document).on("click", "p", function(){
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .done(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        // $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
            $('#notes').append("<button data-id='" + data._id + "' id='deletenote'>Delete note</button>");
        }
    });
  });

  $(document).on("click", "#savenote", function() {
      var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
        
            body: $("#bodyinput").val()
        }
    })
    .done(function(data) {
        console.log(data);
        $("#notes").empty();
    });

    // $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  // Set up action for the delete note button so....
  // click button - on click
  // point to note's id
  // run a POST request to change then empty val

  $(document).on("click", "#deletenote", function(){
      var thisId = $(this).attr('data-id');
    
      $.ajax({
          method: "DELETE",
          url: "/articles/" + thisId,
          data: {
              body: $("#bodyinput").val()
          }
      })
      .done(function(data){
          //verify it is the correct data
          console.log(data);
          $('#notes').empty();
      });
      $('#bodyinput').val(" ");
    });


