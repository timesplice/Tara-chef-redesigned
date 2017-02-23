var api_uni_id=1234567889;
var present_question_state="";
var present_to_show_order=null;
var orderNamesAndOrders={};
function send_to_api_ai(query) {
        recognition.stop();
	  console.log('sending to api.ai:',query);
	  
	  var baseUrl = "https://api.api.ai/v1/";
	  var accessToken="cb1651ee42bc436aa5fd87b4916271b2";
	  var v=20150910;
	  var sessionId=api_uni_id;
	  api_uni_id=api_uni_id-1;
	  var lang="en";
      $.ajax({
        type: "GET",
        url: baseUrl + "query",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + accessToken
        },
        data: {query: query, v:v, sessionId:sessionId, lang: lang },
        success: function(data) {
          console.log('api result',data);
		  process_api_ai_results(data);
        },
        error: function() {
          console.log('error')
        }
      });
}

function process_api_ai_results(data){
    switch(data.result.action.toLowerCase()){
        case 'yes':
            switch(present_question_state){
                case 'show order yes no':
                    playStaticVoice([data.result.fulfillment.speech],false);
                    if(present_to_show_order != null){
                        openTableOrder(present_to_show_order);
                    }
                    break;
                case "speak out order":
                    playOrderNames();
                    playStaticVoice(["how long will it take to deliver food"],false);
                    break;
            }
            break;
        case 'no':
            switch(present_question_state){
                case 'show order yes no':
                    playStaticVoice([data.result.fulfillment.speech],false);
                    break;
                case "speak out order":
                    //playStaticVoice(["do you"])
                    playStaticVoice([data.result.fulfillment.speech],false);
                    playStaticVoice(["how long will it take to deliver food"],true);
                    break;
            }
            break;
        case 'gotohome':
            playStaticVoice([data.result.fulfillment.speech],false);
            showHome();
            break;
        case 'showorder':
            playStaticVoice([data.result.fulfillment.speech],false);
            openTableOrder(orderNamesAndOrders[data.result.parameters.tableName]);
            break;
        case 'getestimatedtime':
             playStaticVoice([data.result.fulfillment.speech],false);
            break;
        
    }
}