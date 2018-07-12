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

// code bellow is only use to test the methods
//-----------------------------------------------------------------------------------------------------------
//value is obtain from the user. This array will be use to find how many ingridients match  the recipe
var generalSearch = ["chicken", "carrot", "eggplan", "kale", "bean", "tomato"];

// value is obtain from the user if they want a specific ingridient chicken, beef, seafood, or vegetables.
var mainIngredient = "chicken"; 

//offset the results 
var fromOffset = 0;

var numOfResults = 5;


//----------------------------------------------------------------------------------------------------------


//keyword indicate if is chicken, beef, seafood or vegetable . 
//if the user is doing a advance search pass the main ingredient
// else pass "all"
function apiCall(keyWord, offset, searchIngredients){
    
    var main =["chicken", "meat", "seafood", "vegetable"];
    var ingridients = [];

    if(keyWord.toLowerCase() == "all"){
        
        for(var i = 0; i<main.length; i++){

            var queryURL = "https://api.edamam.com/search?q="+ keyWord +
                          "&app_id=17487a38&app_key=3fd9c70aefdd3c029f018cb69009d471&to=100&from="+ offset +""
            ;
        
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(function(response){
        
                console.log(response);
        
            })
        }//for

        
    }//if keyword

          /*  var queryURL = "https://api.edamam.com/search?q="+ keyWord +
                                "&app_id=17487a38&app_key=3fd9c70aefdd3c029f018cb69009d471&to=100&from="+ offset +""
            ;
                
            $.ajax({
                url: queryURL,
                method: 'GET'
            }).then(function(response){
        
                console.log(response);
        
            })*/

}// end apicall

//------------------------------------------------------------
//Testing code
x(generalSearch);
apiCall(mainIngredient, fromOffset, generalSearch);
//-------------------------------------------------------------





 