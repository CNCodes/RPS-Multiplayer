var config = {
    apiKey: "AIzaSyBcbt6FzoNDjtoFASvrxnVEewYPpgKEbr8",
    authDomain: "rps-homework-60087.firebaseapp.com",
    databaseURL: "https://rps-homework-60087.firebaseio.com",
    projectId: "rps-homework-60087",
    storageBucket: "",
    messagingSenderId: "891311258882"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var loginName;

  var player1Wins = 0;
  var player2Wins = 0;

  var player1Losses = 0;
  var player2Losses = 0;

  var player1chosen = false;
  var player2chosen = false;

  var playerNumber;

  function submitMessage(){
      $('#submit-message').on('click', function(event){
 
          event.preventDefault();


          var messageData = $('#message-input').val();
          console.log(messageData);
          $('#message-input').val('');
          
          database.ref('messages').set({
              currentMessage: messageData,
          })

      })
  }

  function generateChoices(playerNumber, loginName){
    var rockDiv = $('<div>').addClass('row justify-content-center');
    var paperDiv = $('<div>').addClass('row justify-content-center');
    var scizzorsDiv = $('<div>').addClass('row justify-content-center');

    var chooseRock = $('<p>').addClass('btn text-center choice-button').text('Rock');
    var choosePaper = $('<p>').addClass('btn text-center choice-button').text('Paper');
    var chooseScizzors = $('<p>').addClass('btn text-center choice-button').text('Scizzors');

    chooseRock.data('value', "rock");
    choosePaper.data('value', "paper");
    chooseScizzors.data('value', 'scizzors');
    $('#player'+playerNumber+'-name').text(loginName);
    rockDiv.append(chooseRock);
    paperDiv.append(choosePaper);
    scizzorsDiv.append(chooseScizzors);
    $('#player-'+playerNumber+'-options').append(rockDiv).append(paperDiv).append(scizzorsDiv);

  }

  function choicePicked(){
      $('.choice-button').on('click', function(){

        var choiceValue = $(this).data('value');

          if (playerNumber === 1) {
              
              database.ref('player1/choice').set({
                  value: choiceValue,
              });

              database.ref('turn').set({
                  value: 2
              });
          } else if (playerNumber === 2) {
              database.ref('player2/choice').set({
                  value: choiceValue
              });

              database.ref('turn').set({
                  value: 0
              });
          }
      })
  }

  function checkWinner(option1, option2) {
      if(option1 === "rock" && option2 === "paper") {
          alert("player2 wins!");
          player2Wins++;
          player1Losses++;
      } else if(option1 === "rock" && option2 === "rock") {
          alert("tie game!!");
      } else if(option1 ==="rock" && option2 ==="scizzors") {
          alert("player1 wins!!");
          player1Wins++;
          player2Losses++;
      } else if(option1 === "paper" && option2 === "scizzors") {
           alert("player2 wins!");
           player2Wins++;
           player1Losses++;
      } else if(option1 === "paper" && option2 === "paper") {
           alert("tie game!!");
      } else if(option1 ==="paper" && option2 ==="rock") {
           alert("player1 wins!!");
           player1Wins++;
           player2Losses++;
      } else if(option1 === "scizzors" && option2 === "rock") {
           alert("player2 wins!");
           player2Wins++;
           player1Losses++;
      } else if(option1 === "scizzors" && option2 === "scizzors") {
           alert("tie game!!");
      } else if(option1 ==="scizzors" && option2 ==="paper") {
           alert("player1 wins!!");
           player1Wins++;
           player2Losses++;
    }
  }


 $(document).ready(function() {

    submitMessage();

    $('#loginButton').on('click', function(){

    loginName = $('#login-name').val().trim()
        
    if(player1chosen === false){

        database.ref('player1').set({

            playerName: loginName,
            losses: player1Losses,
            wins: player1Wins
                
        });

    playerNumber = 1;

    $('#login').hide();

            
    } else if (player1chosen === true && player2chosen === false) {

        database.ref('player2').set({

            playerName: loginName,
            losses: player2Losses,
            wins: player2Wins

        });

        playerNumber = 2;

        $('#login').hide();

    }
});


});
database.ref().onDisconnect().remove();

database.ref('messages').on('value', function(snapshot){
    var justTyped = snapshot.child('currentMessage').val();
    var breakHere = $('<br>');
    var currentSentence = document.createElement("P");
    
    $(currentSentence).text(justTyped);

    $(currentSentence).addClass('col-xs-12')

    console.log(currentSentence);
    console.log(justTyped);
   
    if(playerNumber === 1) {
        $(currentSentence).attr('style', 'color: blue');
    } else if(playerNumber === 2){
        $(currentSentence).attr('style', 'color: red');
    }
    $('#message-display').append(currentSentence).append(breakHere);
}) 

database.ref().on('value', function(snapshot){

    console.log(snapshot.child('player1').exists());
    console.log(!snapshot.child('player2').exists());

    if(snapshot.child('player1').exists() && !snapshot.child('player2').exists()){

        player1chosen = true;

        $('#player1-name').text(snapshot.child('player1/playerName').val())

    } else if(snapshot.child('player2').exists()&& !snapshot.child('turn').exists()) {

        player2chosen = true;

        $('#player2-name').text(snapshot.child('player2/playerName').val())

        database.ref('turn').set({
            value: 1
        })
        
    } else if (snapshot.child('turn').exists()) {
        if(snapshot.child('turn/value').val() == 1 && !snapshot.child('player1/choice').exists()) {
            if(playerNumber === 1) {
                alert("It is your turn!");
                generateChoices(playerNumber, loginName);
                choicePicked();
            } else {
                alert("Wait for player 1 to choose!");
            }
        } else if(snapshot.child('turn/value').val() == 2 && !snapshot.child('player2/choice').exists()) {
            if(playerNumber === 1) {
                alert("Wait for player 2 to choose!");
               // $('#player-1-options').hide();
            } else {
                alert("It is your turn!");
                generateChoices(playerNumber, loginName)
                choicePicked();
            }
        } else if(snapshot.child('turn/value').val() == 0) {
            checkWinner(snapshot.child('player1/choice/value').val(), snapshot.child('player2/choice/value').val());
            database.ref().remove();
            $('#player-' + playerNumber + '-options').empty();
            if(playerNumber == 1) {
                database.ref('player1').set({
                    playerName: loginName,
                    wins: player1Wins,
                    losses: player1Losses
                });
            } else if(playerNumber == 2) {
                database.ref('player2').set({
                    playerName: loginName,
                    wins: player2Wins,
                    losses: player2Losses
                })
            }
        }
    }
})