
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

// variable controls the minimun ingridiants we want to have on a search
var ingredientCount = 3;
var offset = 0;


//----------------------------------------------------------------------------------------------------------


//keyword indicate if is chicken, beef, seafood or vegetable . 

function apiCall(keyWord, searchIngredients){
    var count = 0;
    var i = 0;
    var returnValue = 0;

    var queryURL = "https://api.edamam.com/search?q="+ keyWord +
                   "&app_id=17487a38&app_key=3fd9c70aefdd3c029f018cb69009d471&to=1000&from="+ offset +""
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
        if(count === 1) {
            commonVegetables.push(obj);
            i++;
            returnValue++;
        }
        else{
            i++;
        }
      
    })

    return returnValue;
}// end apicall



//------------------------------------------------------------------------------------
//array1 variable is the user input and the object contains the value of the api ingredients
function searchArray(array1, object){
   
    console.log(object);
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
    console.log(apiArray);
    console.log(userArray);
    var x =-1;
    var e = 0;


        if(apiArray.length === 1 || apiArray.length === 2){
            x = 1;
        }

        else if(apiArray.length === 3 || apiArray.length === 4 ){
            e = count(userArray, apiArray);
            console.log(e);
            if(e >= 2 ){
                x = 1;
            }
        }

        else if(apiArray.length >= 5 ){

            e = count(userArray, apiArray);
            console.log(e);
            if(e >=3){
               x = 1;
            }
        }

        else{
            x = -1;
        }

   console.log(x);

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
    console.log(count);
 return count.length;
}


//----------------------------------------------------------------------------------------------------
//general search will only give an array from the user which will be pass as useIinput 
//the user than will get 3 recipe for each of: chicken, meat, seafood, vegetables.
//The results will be append to an object base on how many vegetables does the recipe has and 
// and at least more then half matches the user input.
//-----------------------------------------------------------------------------------------------------
function generalSearch(userinput){
    var chickenCount = 0;
    var meatCount = 0;
    var seafoodCount = 0;
    var vegetableCount = 0;

    if(chickenCount !=3){
        //call api
        chickenCount = apiCall("chicken", userinput);

    }

    if(meatCount !=3){
        //call api
        chickenCount = apiCall("meat", userinput);


    }
    if(seafoodCount !=3){
        //call api
        chickenCount = apiCall("seafood", userinput);

    }

    if(vegetableCount !=3){
        //call api
        chickenCount = apiCall("vegetables", userinput);

    }
}


$('#submit-button').on("click", function(event){
    event.preventDefault();

    var userInput = $('#input-search').val().trim();

    var userArray = userInput.split();

    console.log(userInput);
    generalSearch(userArray);

});

//$('#submit-button').click(apiCall);