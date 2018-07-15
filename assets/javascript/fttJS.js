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

// $('#search-button').click(function(){

//   var user = firebase.auth().currentUser;

//   database.ref('users/' + user.uid).update({
//       clicked: user.uid
//     });
// });



// most use vegetables. This array is use to search the api ingridients array and get only the vegetables 
// from the api.
var commonVegetables = ['artichoke','eggplant','asparagus','sprouts','beans','chickpeas','garbanzos', 
                       'lentils','lima','peas','broccoli','brussels', 'cabbage','kohlrabi', 
                       'cauliflower','celery','endive','fiddleheads','fennel','chard','collard', 
                       'kale','spinach','quinoa','anise','basil','caraway','cilantro','chamomile', 
                       'dill','fennel','lavender','lemon','marjoram','oregano','parsley','rosemary', 
                       'sage','thyme','lettuce','arugula','mushroom','chives','garlic','leek',
                        'onion','shallot','scallion','pepper','jalapeño','habanero','paprika', 
                        'carrot','celeriac','daikon','ginger','parsnip','rutabaga','turnip', 
                        'radish','sweetcorn','squash','zucchini','cucumber','pumpkin','tomato',
                         'tubers','jicama','artichoke','potato','quandong','sunchokes','sweet', 
                         'potato','yam','corn','ginger'
];

var pluralCommonVegetables = [];

function pluralVegetables(){
    for(var i = 0; i<commonVegetables.length; i++){
        pluralCommonVegetables[i] = commonVegetables[i] + "s";
    }
}

pluralVegetables();

// is an array that is going to holds an object
var completeRecipe = [];

var offset = 0;

var chickenCount = 0;
var meatCount = 0;
var seafoodCount = 0;
var vegetableCount = 0;


//----------------------------------------------------------------------------------------------------------


//keyword indicate if is chicken, beef, seafood or vegetable . 

function apiCall(keyWord, searchIngredients){
    var count = 0;
    var i = 0;
    var returnValue = 0;

    var queryURL = "https://api.edamam.com/search?q="+ keyWord +
                   "&app_id=fa7bd258&app_key=b36c8cc028e4fbcecf60788a8a784756&to=1000&from="+ offset +""
    ;
              
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response){

        var r = response.hits[i].recipe; 

        var obj = { primary: response.q,
                    name: r.label,
                    image: r.image,
                    ingredients: r.ingredientLines,
                    instructions: r.url
        }
        count = searchArray(searchIngredients, obj);      
        if(count === 1 || returnValue === 3) {
            completeRecipe.push(obj);
            i++;
            returnValue++;
        }
        else{
            i++;
        }
      
    })
    console.log(completeRecipe);
    return returnValue;
}// end apicall



//------------------------------------------------------------------------------------
//array1 variable is the user input and the object contains the value of the api ingredients
function searchArray(array1, object){
   
    var tem = [];
    var temStr;
    var str;
    var k = 0;

    for(var i=0; i<object.ingredients.length; i++){

        temStr = format(object.ingredients[i]);

        for(var j=0; j<temStr.length; j++){

            if(commonVegetables.indexOf(temStr[j])  != -1 || pluralCommonVegetables.indexOf(temStr[j])  != -1){

                tem[k] = temStr[j];
                k++;
            }
           
        }
        
    } 
    
   var x = equalIngredients(array1, tem);
   return x;
}

// this function makes sure the api ingredients split and push into an array
// x holds the value of the api ingredients 
function format(x){
    var y = x.split(" ");
    var z = [];

    for(var i = 0; i<y.length; i++){
       
        
            if(y[i].indexOf(",")  == -1){
                z.push(y[i]);
            // console.log(y[i]);
            }
            else {
            
                //console.log(y[i].substring(0, y[i].length-1));
                z.push(y[i].substring(0, y[i].length-1));
                
            }
        
    }
   // console.log(z);
    return z;
}


//finds out how many elements does the user input has that are equal to the api list
function equalIngredients(userArray, apiArray){
 
    var x =-1;
    var e = 0;


        if(apiArray.length === 1 || apiArray.length === 2){
            x = 1;
        }

        else if(apiArray.length === 3 || apiArray.length === 4 ){
            e = count(userArray, apiArray);
           
            if(e >= 2 ){
                x = 1;
            }
        }

        else if(apiArray.length >= 5 ){

            e = count(userArray, apiArray);
            
            if(e >=3){
               x = 1;
            }
        }

        else{
            x = -1;
        }

 
    return x;
    
}

//function uses the length of the coutn arrry to  get how many ingredients are the same
function count(u, v){
    var count = [];
    for(var j = 0; j<u.length; j++){
        for(var k = 0; k<v.length; k++){
            if(u[j]===v[k] || u[j]+"s" === v[k]){
                count.push(u[j]);
            }

        }
    }
   
 return count.length;
}


//----------------------------------------------------------------------------------------------------
//general search will only give an array from the user which will be pass as useIinput 
//the user than will get 3 recipe for each of: chicken, meat, seafood, vegetables.
//The results will be append to an object base on how many vegetables does the recipe has and 
// and at least more then half matches the user input.
//-----------------------------------------------------------------------------------------------------
function generalSearch(userinput){
    

    if(chickenCount !=3){
        //call api
        chickenCount = apiCall("chicken", userinput);
        offset++;

    }

    if(meatCount !=3){
        //call api
        meatCount = apiCall("meat", userinput);
        offset++;

    }
    if(seafoodCount !=3){
        //call api
        seafoodCount = apiCall("seafood", userinput);
        offset++;
    }

    if(vegetableCount !=3){
        //call api
        vegetableCount = apiCall("vegetables", userinput);
        offset++;

    }

    
}

console.log(completeRecipe);

$('#search-button').on("click",function(){

    var userInput = $('#input-search').val().trim();

    var userArray = userInput.split();

    console.log(userInput);
    generalSearch(userArray);

})

