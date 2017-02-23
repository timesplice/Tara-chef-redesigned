var create_email = false;
var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;

var can_process_final_speech=false;
var previous_time=-1;

if (!('webkitSpeechRecognition' in window)) {
  showInfo('speech not supported');
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
	
    recognizing = true;
    showInfo('info_speak_now');
    
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    
    if (!final_transcript) {
      showInfo('info_nothing_to_print');
      return;
    }
    showInfo('info_mic_end');
	
	//restart_recognition();
	
	
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
	var final_transcript ='';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    
       final_transcript = capitalize(final_transcript);
	   final_transcript = linebreak(final_transcript);
	   interim_transcript = linebreak(interim_transcript);
     
     document.getElementById('mic_text').innerHTML = interim_transcript;
     $('#mic_text').css('color','#95a5a6');
		
        console.log("voice:"+interim_transcript)

       /* if(interim_transcript.trim().toLowerCase().indexOf('yes')>=0){
            playVoice();
            recognition.stop();
        }
        if(interim_transcript.trim().toLowerCase().indexOf('no')>=0){
            speechSynthesis.speak(new SpeechSynthesisUtterance("OK")); 
            recognition.stop();
        }*/

		if(final_transcript!=undefined && final_transcript.trim().length>0){
      document.getElementById('mic_text').innerHTML = final_transcript;     
      $('#mic_text').css('color','#000');
			/*if(final_transcript.toLowerCase().trim() == 'tara'){
					can_process_final_speech=true;
			}else{
				if(can_process_final_speech==true && final_transcript.trim().toLowerCase() != 'tara'){					
					send_to_api_ai(final_transcript.toLowerCase().replace('tara','').trim());
				}
			}*/
            send_to_api_ai(final_transcript.toLowerCase());			
		}
  };
  
  recognition.onstop = function(){
	  console.log('stoped');
  }
}

/*
function linebreak(s) {
	var two_line = /\n\n/g;
	var one_line = /\n/g;
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
*/

function linebreak(s) {
	var two_line = /\n\n/g;
	var one_line = /\n/g;
	return s.replace(two_line, ' ').replace(one_line, ' ');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}


function showInfo(s) {
	console.log('info:',s);
}

function restart_recognition(){
	try{
		recognition.start();
    }catch(err){
		recognition.stop();
	}
}
