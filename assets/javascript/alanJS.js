// initialize firebase
var config = {
    apiKey: "AIzaSyB1BH62fLuhWMRqicNNsOvjg2vGuRPN9Xg",
    authDomain: "fridge-to-table-50547.firebaseapp.com",
    databaseURL: "https://fridge-to-table-50547.firebaseio.com",
    projectId: "fridge-to-table-50547",
    storageBucket: "fridge-to-table-50547.appspot.com",
    messagingSenderId: "316217867019"
  };
  firebase.initializeApp(config);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInFlow: 'popup',
  signInSuccessUrl: 'aneesIndex.html',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ], 
    callbacks: {

      signInSuccessWithAuthResult: function(authResult, signInSuccessUrl){
        var user = authResult.user;
        // var credential = authResult.credential;
        // var isNewUser = authResult.additionalUserInfo.isNewUser;
        // var providerID = authResult.additionalUserInfo.providerId;
        // var operationType = authResult.operationType;
        console.log(authResult);
        writeUserData(user.uid);
        return true;
      },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        signInFailure: function(error) {
          // For merge conflicts, the error.code will be
          // 'firebaseui/anonymous-upgrade-merge-conflict'.
          if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
            return Promise.resolve();
          }
          // The credential the user tried to sign in with.
          var cred = error.credential;
          // Copy data from anonymous user to permanent user and delete anonymous
          // user.
          // ...
          // Finish sign-in after data is copied.
          return firebase.auth().signInWithCredential(cred);
        },
        uiShown: function() {
          document.getElementById('loader').style.display = 'none';
        }
      }
    });

var player;

var ytApiKey = 'AIzaSyCovUogj28E2sli9kqZZ_AVJrEEL-1X5x4';
var searchTerm = {q: 'roast beef'};
var sQueryURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&key=' + ytApiKey + '&' + $.param(searchTerm);

// to play video, get the id and input it as the v parameter in this url: https://www.youtube.com/watch?v=VideoIDGoesHere

$.ajax({

  url: sQueryURL,
  method: 'GET'
}).then(function(response){
  console.log(response);
  console.log(sQueryURL);
  onYouTubeIframeAPIReady();
});

var user = firebase.auth().currentUser;

// detect that a user has signed in or out

firebase.auth().onAuthStateChanged(function(user){

  if (user){
    writeUserData(user.uid);
  }
  else{
    console.log("no user signed in");
  }
});

//get a reference to the databse
var database = firebase.database();

function writeUserData(userID) {

  database.ref('users/' + userID).set({
    myUserID: userID
  });
}

var player;
function onYouTubeIframeAPIReady(){

  player = new YT.Player('player', {
    videoId: 'M7lc1UVf-VE'
  });
}

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

$('#search-button').click(function(){

  var user = firebase.auth().currentUser;

  database.ref('users/' + user.uid).update({
      clicked: user.uid
    });
});



