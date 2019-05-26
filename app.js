var budgetController = (function(){
    //some code
    //Constructor function for expense objects
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    //Constructor function for income objects
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    
    //data structure for storing user input
    var data = {
        
        //Object that stores expenses/income input
        allItems: {
            exp: [],
            inc: []
        },
        
        //Object that retains totals for expenses/income
        totals: {
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, des, val) {
            var newItem;
            
            //Assigns a new ID based on the ID of the last item in either inc or exp
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            
            
            //Create new item: inc/exp
            if (type === 'exp'){
               newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            //Add the new item to data
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        testing: function(){
            console.log(data);
        }
        
    };
    
    
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
    
    var setupEventListeners = function(){
        //invoking method to access HTML classes from UI controller module
        var DOM = UICtrl.getDOMstrings();
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
        
    };
    
    
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        //Get the field input data
        var input = UICtrl.getInput();
        
        //Add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        //Add the item to the UI
        
        //Calculate the budget
        
        //Display the budget on the UI    
    };
    
    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }
    
})(budgetController,UIController);

controller.init();