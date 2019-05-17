var budgetController = (function(){
    //some code
})();


var UIController = (function() {
    //some code
    //Object for storing the HTML classes
    //Saves us from future edits
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    }
    return {
        //Method for returning (3) user inputs from interface
        getInput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value, //either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : document.querySelector(DOMstrings.inputValue).value
            };
    
        },
        
        //Get method for other modules to access DOMstrings
        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();


var controller = (function(budgetCtrl, UICtrl){
    //some input from the other 2 controllers
    
    //invoking method to access HTML classes from UI controller module
    var DOM = UICtrl.getDOMstrings();
    
    var ctrlAddItem = function() {
        //Get the field input data
        var input = UICtrl.getInput();
        console.log(input);
        
        //Add the item to the budget controller
        
        //Add the item to the UI
        
        //Calculate the budget
        
        //Display the budget on the UI    
        console.log('It works')
    }
    
    //If the button is pressed
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
    //If the enter key is hit
    document.addEventListener('keypress', function(event) {
        
        //Keys on a keyboard are assigned particular keycodes
        //The keycode for 'Enter/Return' is 13
        //Not all browsers use keycodes, and instead use 'which'
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
        
    });
})(budgetController,UIController);