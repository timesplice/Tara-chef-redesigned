// progressbar.js@1.0.0 version is used
// Docs: http://progressbarjs.readthedocs.org/en/1.0.0/

function add_progress(progress_bar_id,progress_status,estimated_time,tableName){
    var progressHtml='<div id="container" style="position:relative">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 230.057 230.057">'+
                                        '<path fill-opacity="0" stroke-width="1" stroke="#bbb" d="M225.579,83.315l-32.147-41.258c-7.817-10.032-19.594-15.785-32.312-15.785h-21.204c-2.939,0-5.565,1.836-6.574,4.597  c-3.257,8.909-11.822,14.895-21.313,14.895s-18.055-5.986-21.313-14.895c-1.009-2.761-3.635-4.597-6.574-4.597H65.937  c-12.717,0-24.495,5.753-32.312,15.786L1.479,83.315c-1.397,1.793-1.837,4.152-1.179,6.328c0.658,2.176,2.331,3.897,4.488,4.615    l44.558,14.845v87.682c0,3.866,3.134,7,7,7h117.366c3.866,0,7-3.134,7-7v-87.682l44.558-14.845c2.157-0.718,3.83-2.439,4.488-4.615      c6.295,11.832,18.761,19.491,32.41,19.491c13.649,0,26.115-7.66,32.411-19.491h16.681c8.371,0,16.123,3.787,21.269,10.39   "/>'+
                                        '<path id="progress_'+progress_bar_id+'" fill-opacity="0" stroke-width="3" stroke="#ED6A5A" d="M225.579,83.315l-32.147-41.258c-7.817-10.032-19.594-15.785-32.312-15.785h-21.204c-2.939,0-5.565,1.836-6.574,4.597  c-3.257,8.909-11.822,14.895-21.313 14.895s-18.055-5.986-21.313-14.895c-1.009-2.761-3.635-4.597-6.574-4.597H65.937  c-12.717,0-24.495,5.753-32.312,15.786L1.479,83.315c-1.397,1.793-1.837,4.152-1.179,6.328c0.658,2.176,2.331,3.897,4.488,4.615    l44.558,14.845v87.682c0,3.866,3.134,7,7,7h117.366c3.866,0,7-3.134,7-7v-87.682l44.558-14.845c2.157-0.718,3.83-2.439,4.488-4.615      c6.295,11.832,18.761,19.491,32.41,19.491c13.649,0,26.115-7.66,32.411-19.491h16.681c8.371,0,16.123,3.787,21.269,10.39   "/>'+
                        '</svg>'+
                        '<div id="text_'+progress_bar_id+'" style="text-align:center;position: absolute; left: 50%; top: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); font-size: 2rem;">'+tableName+'</div>'+
                    '</div>';
    document.getElementById(progress_bar_id).innerHTML=progressHtml;
    var bar = new ProgressBar.Path('#progress_'+progress_bar_id, {
        strokeWidth: 6,
        easing: 'easeInOut',
        duration: 1400,
        color: '#fff',
        trailColor: '#fff',
        trailWidth: 1,               
    });
    bar.setText = function(val){
        document.getElementById('text_'+progress_bar_id).innerHTML = val;
    };

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
     
     var text=parseInt(elapsedTime/60)+":"+parseInt(elapsedTime%60);

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


function blink(table,color){
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