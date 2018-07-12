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
  signInSuccessUrl: 'alanTestRedirect.html',
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

// var user = firebase.auth().currentUser;

// // detect that a user has signed in or out

// firebase.auth().onAuthStateChanged(function(user){

//   if (user){
//     console.log(user);
//     console.log(user.uid);
//     writeUserData(user.uid);
//   }
//   else{
//     console.log("no user signed in");
//   }
// });

//get a reference to the databse
var database = firebase.database();

function writeUserData(userID) {

  database.ref('users/' + userID).set({
    myUserID: userID
  });
}
// $('#register').click(function () {
//     var userEmail = $('#email').val().trim();
//     var userPassword = $('#password').val().trim();
//     firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         console.log(errorCode + errorMessage);
//         // ...
//       });

//       console.log(firebase.auth().currentUser);
//       firebase.auth().onAuthStateChanged(user => {
//         if(user) {
//           window.location = 'alanTestRedirect.html'; //After successful login, user will be redirected to home.html
//         }
//       });
// });

// $('#sign-in').click(function () {

//     var userEmail = $('#email').val().trim();
//     var userPassword = $('#password').val().trim();
//     firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//         console.log(errorCode + errorMessage);
//       });
// });

// $('#google-sign-in').click(function () {

//     firebase.auth()
   
//     .signInWithPopup(provider).then(function(result) {
//        var token = result.credential.accessToken;
//        var user = result.user;
         
//        console.log(token)
//        console.log(user)
//     }).catch(function(error) {
//        var errorCode = error.code;
//        var errorMessage = error.message;
         
//        console.log(error.code)
//        console.log(error.message)
//     });
// });




