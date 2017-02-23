// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

function add_progress(progress_bar_id,progress_status,estimated_time,tableName){
    progress_bar_id='#'+progress_bar_id;
    var bar = new ProgressBar.Circle(progress_bar_id, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1400,
        color: '#000',
        trailColor: '#000',
        trailWidth: 1,
        svgStyle: null,
        step: function(state, circle) {
            //circle.setText(circle.value());\
            circle.setText(tableName);
        }
    });

    bar.animate(progress_status);  // Number from 0.0 to 1.0
    return bar;
}

var progress_bars={};
var progress_bars_loop={};
var progress_bar_blink={};
//elapsedTime and estimated_time in seconds
function loop_progress(tableId,elapsedTime,estimatedTime,voicePlayed) {
     var progressPercentage = (elapsedTime*1.0/estimatedTime);
     console.log('loop table:'+tableId);
     console.log('loop elapsed time:'+elapsedTime);
     console.log('loop waiting time:'+estimatedTime);
     console.log('progressPercentage:'+progressPercentage)

     
     if(progressPercentage<0.50){
        progress_bars[tableId]._opts.color = '#ffffff';
     }else if(progressPercentage<0.75){
        progress_bars[tableId]._opts.color = '#e67e22';
     }else if(progressPercentage<0.90){
        progress_bars[tableId]._opts.color = '#e74c3c';
     }else if(progressPercentage >= 0.90){
         console.log(voicePlayed);
         if(voicePlayed == false){
            speechSynthesis.speak(new SpeechSynthesisUtterance("Hurry, Its time to deliver food to "+tableId)); 
            //playStaticVoice([""]);
            voicePlayed = true;
         }
     }
     //console.log('before update:',progress_bars[tableId],progress_bars[tableId].options.series[0]);
     
     var text=elapsedTime/60+":"+elapsedTime%60;

     progress_bars[tableId].animate(progressPercentage);
     progress_bars[tableId].setText( text );
     $("#"+tableId).css("background-color", '#ededed');

   if (elapsedTime > estimatedTime) {
     if(progressPercentage >= 100)
        $("#"+tableId).css("background-color", 'red');
        
        progress_bars[tableId].animate(0);
        progress_bars[tableId].setText( text );
     /*setTimeout(function() {
       loop(0,progress)
     }, 3000)*/     
     return;
   }else if( progress_bars_loop[tableId] == false ){        
        return;
   } else {
     //console.log('updated bar:',progress_bars[tableId],progress_bars[tableId].options.series[0]);
     setTimeout(function() {
       loop_progress(tableId,elapsedTime+1,estimatedTime)
     }, 1000);

   }
 }


function blinkOld(table,color){
    $("#"+table).css("background-color", '#ededed');
    if(progress_bar_blink[table] == false)
        return;
    $("#"+table).css("background-color", color);
    $("#"+table).fadeOut('slow', function(){
        $(this).fadeIn('slow', function(){        
            blink(table,color);
            //console.log('hello')
        });
    });
}

function blink(table,color){
    $("#"+table+" > svg > path:nth-child(2)").attr("fill-opacity", '100');
    
    $("#"+table+" > svg > path:nth-child(2)").attr("fill", '#ededed');
    if(progress_bar_blink[table] == false)
        return;
    $("#"+table+" > svg > path:nth-child(2)").attr("fill", color);
    $("#"+table+" > svg > path:nth-child(2)").fadeOut('slow', function(){
        $(this).fadeIn('slow', function(){        
            blink(table,color);
            //console.log('hello')
        });
    });
}