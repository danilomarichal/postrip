$(".go-back").on('click', function(){
  window.history.go(-1);
});


//---------------------------------------------------------


var callAjax = function(){
  var key="xxxxxxxxxxxxxxxxxxx";
    $.ajax({
        url:"https://newsapi.org/v1/articles?source=national-geographic&sortBy=top&apiKey="+key,
        method:"GET",
        success: function(data){

var title1 = data.articles[0].title;
var description1 = data.articles[0].description;
var image1 = data.articles[0].urlToImage;
var link1 = data.articles[0].url;

var title2 = data.articles[1].title;
var description2 = data.articles[1].description;
var image2 = data.articles[1].urlToImage;
var link2 = data.articles[1].url;

var title3 = data.articles[2].title;
var description3 = data.articles[2].description;
var image3 = data.articles[2].urlToImage;
var link3 = data.articles[2].url;

var title4 = data.articles[3].title;
var description4 = data.articles[3].description;
var image4 = data.articles[3].urlToImage;
var link4 = data.articles[3].url;

var title5 = data.articles[4].title;
var description5 = data.articles[4].description;
var image5 = data.articles[4].urlToImage;
var link5 = data.articles[4].url;

var title6 = data.articles[5].title;
var description6 = data.articles[5].description;
var image6 = data.articles[5].urlToImage;
var link6 = data.articles[5].url;

  $('#title_one').text(title1);
  $('#image_one').attr('src',image1);
  $('#desc_one').text(description1);
  $('#link0').attr('href',data.articles[0].url );

  $('#title_two').text(title2);
  $('#image_two').attr('src',image2);
  $('#desc_two').text(description2);
  $('#link1').attr('href',data.articles[1].url );

  $('#title_three').text(title3);
  $('#image_three').attr('src',image3);
  $('#desc_three').text(description3);
  $('#link2').attr('href',data.articles[2].url );

  $('#title_four').text(title4);
  $('#image_four').attr('src',image4);
  $('#desc_four').text(description4);
  $('#link3').attr('href',data.articles[3].url );

  $('#title_five').text(title5);
  $('#image_five').attr('src',image5);
  $('#desc_five').text(description5);
  $('#link4').attr('href',data.articles[4].url );

  $('#title_six').text(title6);
  $('#image_six').attr('src',image6);
  $('#desc_six').text(description6);
  $('#link5').attr('href',data.articles[5].url );

    }
  });
}
callAjax();

//----------------------------------------------

var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg1');
var ima = document.getElementById('myImg2');
var imag = document.getElementById('myImg3');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}
ima.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}
imag.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
}


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


