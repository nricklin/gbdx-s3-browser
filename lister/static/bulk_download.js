function download_files(files) {
    function download_next(i) {
        if(i >= files.length) {
            return;
        }
        var a = document.createElement('a');
        a.href = files[i];
        a.target = '_parent';
        // Use a.download if available, it prevents plugins from opening.
        if ('download' in a) {
            a.download = files[i].filename;
        }
        // Add a to the doc for click to work.
        (document.body || document.documentElement).appendChild(a);
        if (a.click) {
            a.click(); // The click method is supported by most browsers.
        } else {
            $(a).click(); // Backup using jquery
        }
        // Delete the temporary link.
        a.parentNode.removeChild(a);
        // Download the next file with a small timeout. The timeout is necessary
        // for IE, which will otherwise only download the first file.
        setTimeout(function () { download_next(i + 1); }, 400);
    }
    // Initiate the first download.
    download_next(0);
}



$(function(){

// handle click on the delete button
$("a#bulkdownloadselected").click(function() {
    // get all selected checkboxes
    var selected = [];
    $( "input:checked" ).each(function() {
        selected.push($(this).attr('value'));
    });

    // remove "../" and "./" from the list
    var index = selected.indexOf("../");
    if (index > -1) {
        selected.splice(index, 1);
    }
    var index = selected.indexOf("./");
    if (index > -1) {
        selected.splice(index, 1);
    }

    if (selected.length == 0) {
        bootbox.alert("Nothing to download.", function() {
        });
        return;
    }

    // Confirm with the user:
    bootbox.confirm("Are you sure you want to bulk-download these objects?", function(result) {
        if (!result) { return; }
    

        // loop over each key and download all keys matching it with a prefix
        
        for (var i = 0; i < selected.length; i++) {
            keys_to_download = superprefix + subprefix + selected[i];

            var subbucket = new AWS.S3({params: {
                Bucket: bucketName, 
                Prefix: keys_to_download
                }
            });
            subbucket.listObjects(function (err, data) {
                if (err) {
                    //document.getElementById('status').innerHTML =
                    //'Could not load objects from S3';
                    //window.location.href = '/login.html';
                } else {
                    
                    var urls_to_download = [];
                    for (var j = 0; j < data.Contents.length; j++) {
                        
                        params = {Bucket: bucketName, Key: data.Contents[j].Key, Expires: 900};
                        url = bucket.getSignedUrl('getObject', params);
                        urls_to_download.push(url);
                                                
                    }
                    //console.debug(urls_to_download);
                    download_files(urls_to_download);

                    
                }

            
                
            });
        }
        

    }); 

    



});

});