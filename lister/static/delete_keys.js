$(function(){

// handle click on the delete button
$("a#deleteselected").click(function() {
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
        bootbox.alert("Nothing to delete.", function() {
        });
        return;
    }

    // Confirm with the user:
    bootbox.confirm("Are you sure you want to delete these objects?", function(result) {
        if (!result) { return; }
    

        // loop over each key and delete all keys matching it with a prefix
        var objects_to_delete = [];
        for (var i = 0; i < selected.length; i++) {
            key_to_delete = superprefix + subprefix + selected[i];

            var subbucket = new AWS.S3({params: {
                Bucket: bucketName, 
                Prefix: key_to_delete
                }
            });
            subbucket.listObjects(function (err, data) {
                if (err) {
                    //document.getElementById('status').innerHTML =
                    //'Could not load objects from S3';
                    //window.location.href = '/login.html';
                } else {
                    
                    for (var j = 0; j < data.Contents.length; j++) {
                        objects_to_delete.push( { "Key":  data.Contents[j].Key } );
                    }
                }
                //console.debug(objects_to_delete);
                var deleteparams = {
                    Bucket: bucketName, /* required */
                    Delete: { /* required */
                        Objects: objects_to_delete,
                        Quiet: true
                    }
                };
                bucket.deleteObjects(deleteparams, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     window.location.reload();           // successful response
                });
            });
        }

    }); 

    //console.debug("delete" + objects_to_delete);
    





});

});