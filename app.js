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
    
    //private function for calculating total values
    //accepts either exp/inc for 'type'
    var calculateTotal = function(type){
        var sum = 0;
        //iterate over all objects stored in data (either inc/exp)
        //update sum to include the value in each type-object
        data.allItems[type].forEach(function(current){
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    }
    
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
        },
        budget: 0,
        percentage: -1 //default to -1 instead of 0, since 0 is interpreted as 'falsy'
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
        
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income spent
            //only if we have a positive budget
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function(){
            console.log(data);
        }
        
    };
    
    
})();


var UIController = (function() {
    //some code
    //Object for storing the HTML classes found in index.html
    //Saves us from future edits
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return {
        //Method for returning (3) user inputs from interface
        getInput: function() {
            return {
                type : document.querySelector(DOMstrings.inputType).value, //either inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value) //returns float instead of string
            };
    
        },
        
        //Function for adding expenses/income to the UI
        addListItem: function(obj, type){
            var html, newHTML, element;
            
            //Create HTML string with placeholder text
            //sets var html to a string that we pulled from index.html
            //some alterations implemented for ease of replacing: %id%, %description%, and %value%
            if (type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
                
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            
            //Replace the placeholder text with data
            // Searches the html string for a substring, replaces it with values pulled from corresponding object in data structure
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            
            
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        
        //Function for clearing the "Add description" and "Value" fields after inputting a value
        clearFields: function(){
            var fields;
            
            //Pulls a nodelist
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            console.log(fields);
            
            //uses a list function (stored in the prototype of arrays) named slice to convert the list-type fields to an array?
            var fieldsArr = Array.prototype.slice.call(fields);
            console.log(fieldsArr);
            
            //clears the Array (leaving fields blank)
            //alternative to using a for-loop
            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });
            
            //Returns the text cursor to the "Add Description Box"
            fieldsArr[0].focus();
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
        
        //If the button is pressed, execute function ctrlAddItem
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        //If the enter key is hit, execute function ctrlAddItem
        document.addEventListener('keypress', function(event) {

            //Keys on a keyboard are assigned particular keycodes
            //The keycode for 'Enter/Return' is 13
            //Not all browsers use keycodes, and instead use 'which'
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
        
    };
    
    var updateBudget = function(){
        //Calculate the budget
        budgetCtrl.calculateBudget();
        
        //Return the budget
        var budget = budgetCtrl.getBudget();
        
        //Display the budget
        console.log(budget);
    }
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        //Get the field input data
        var input = UICtrl.getInput();
        
        //validates user input in fields
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //Clears the fields
            UICtrl.clearFields();

            //Calculate and update the budget
            updateBudget();

            //Display the budget on the UI 
        }
        
   
    };
    
    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }
    
})(budgetController,UIController);

controller.init();