$(function(){

// add new folder field on clicking plus
$("a#add").click(function() {
    document.getElementById("newfolder").style.display="inline-block";
    document.getElementById("newfolder").focus();
    document.getElementById("plusbutton").style.display="none";
});

// remove new folder field on clicking outside it
$("#newfolder").focusout(function() {
    document.getElementById("newfolder").style.display="none";
    document.getElementById("newfolder").value="";
    document.getElementById("plusbutton").style.display="inline-block";
});

// keypress inside newfolder text area
$("#newfolder").keypress(function(e) {
    // any key press in the text area
    var code = e.keyCode || e.which;
    if (code == 13) {  // if I've pressed enter
        e.preventDefault();


        var folder = document.getElementById("newfolder").value;
        folder = folder.replace(/^\/*|\/*$/g, '');   // remove trailing and beginning slashes
        folder = folder.replace(/\/+/g, '\/');       // replace multiple /// with /
        folder = folder + '/';  // add a final slash

        key_to_create = superprefix + subprefix + folder;
        //console.debug(key_to_create);

        var params = {Key: key_to_create, Body: ' '};
        bucket.upload(params, function (err, data) {
            console.debug('folder created');
            // now refresh page
            window.location.href = window.location.href.replace(/#+/g, '') + folder;
        });
        
        return false;
    }
});

// make the input autogrow
$("input.autogrow").autoGrowInput({minWidth:2,comfortZone:8});


});