
$('#backToHome').click(function(){
   showHome();
});

$('#deliverOrder').click(function(){
    orderCompleted();
});

$('#mic').click(function(){
    if(recognizing == false){
        recognition.start();
    }else{
        recognition.stop();
        setTimeout(function(){
            recognition.start();
        },1000);
    }
});

function showHome(){
    $('#order_home').hide();
    $('#tables_home').show();
}