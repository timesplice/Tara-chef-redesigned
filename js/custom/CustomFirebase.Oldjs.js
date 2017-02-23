var hotelId =  "hotel1";
var presentHotelOrder=null;
var presentUserOrder={};
var presentOrderBill=0;

var orderNames=[];
var playOrderVoiceFlag=false;


$(document).ready(function(){
	$('#order_home').hide();
    init_firebase();
    //changeChefResponseFormSubmit();
});

function init_firebase(){
    var config = {
        apiKey: "AIzaSyCFjW6xEudW7EpMRQk6IjMymfNLCfgo-Vw",
        authDomain: "tara-66080.firebaseapp.com",
        databaseURL: "https://tara-66080.firebaseio.com",
        storageBucket: "tara-66080.appspot.com",
        messagingSenderId: "711981923636"
    };
    firebase.initializeApp(config);
    firebase.auth().signOut();
    firebase.auth().signInWithEmailAndPassword('a@a.com', 'aa11aa').catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);          
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("user email:",user.email,user);
          //read_from_firebase();
          read_tables_from_firebase();
    
        }
    });
    
}

function read_tables_from_firebase(){
    //get list of tables from db for this hotel
	console.log("reading tables from firebase");
    var path=('tables/' + hotelId);
    //var path=('users');
	firebase.database().ref(path).once('value').then(function(snapshot) {
		if(snapshot!=null){
			//update_template_from_firebase( snapshot.val().data );
            //console.log("Tables:",snapshot);
            snapshot.forEach(function(childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                add_table_to_hotel(childKey,childData);
            });
        }
	});

    //addFireBaseEventListeners();    
}

function add_table_to_hotel(tableId,table){
    console.log('table:'+tableId, table);
    create_progress_bar(tableId);
    progressBars[tableId]=(addProgressBar('#'+tableId,0,table.tableName));
}

function create_progress_bar(tableId){
    var custom_html='<div class="w3-quarter w3-border w3-border-white w3-text-white">'+
                        '<div class="w3-center">'+   
                            '<div id="'+tableId+'"></div>'+
                        '</div>'+
                    '</div>';

    var custom_html='<div class="col-md-3 custom_cell" id="'+tableId+'">'+                        
                    '</div>';
    
    $('#tables_home').append(custom_html);
}

