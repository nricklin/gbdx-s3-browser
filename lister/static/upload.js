$(function(){

  

  var fileChooser = document.getElementById('file-chooser');
  var button = document.getElementById('upload-button');
  var results = document.getElementById('results');

  button.addEventListener('click', function() {
    var file = fileChooser.files[0];
    if (file) {
      results.innerHTML = '';

      var params = {Key: superprefix + subprefix + file.name, ContentType: file.type, Body: file};

      // create a progress bar and attach it to the dom
      var containingdiv = document.createElement("div");
      var newContent = document.createTextNode(file.name);
      containingdiv.appendChild(newContent);

      var span = document.createElement("span");
      var spanContent = document.createTextNode(" - Uploading");
      span.appendChild(spanContent);
      containingdiv.appendChild(span);

      var newprogresscontainer = document.createElement("div")
      newprogresscontainer.className = "progress";

      var newprogressdiv = document.createElement("div");
      newprogressdiv.className = "progress-bar progress-bar-warning progress-bar-striped";
      newprogressdiv.setAttribute('aria-valuemin', "0");
      newprogressdiv.setAttribute('aria-valuemax', "100");
      newprogressdiv.setAttribute('style', "width: 0%");
      newprogressdiv.setAttribute('id', file.name);

      newprogresscontainer.appendChild(newprogressdiv);

      containingdiv.appendChild(newprogresscontainer);

      $('#upload_progress_container')[0].appendChild(containingdiv);


      bucket.upload(params, function (err, data) {
        if (err) {
            span.innerHTML = '';
            span.appendChild(document.createTextNode(" - ERROR"));
            span.style.fontWeight = 'bold';
        } else {
            span.innerHTML = '';
            span.appendChild(document.createTextNode(" - Complete"));
            span.style.fontWeight = 'bold';
        }
        //results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
      }).on('httpUploadProgress', function (progress) {
          //console.log(progress);
          var percent = progress.loaded / progress.total * 100;
          newprogressdiv.setAttribute('style', "width: " + percent+'%');
          //console.debug(newprogressdiv);
          //newprogressdiv.css('width', percent+'%');

      });

    } else {
      bootbox.alert("Nothing to upload.", function() {
        });
    }
  }, false);


});