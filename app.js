var budgetController = (function(){
    //some code
    //Constructor function for expense objects
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //default percentage of the budget used
    };
    
    //Provide a prototype callback method for all expense objects to determine their percentage of the budget
    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
        
    };
    
    //Prototype callback method for accessing the expense object's percentage
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    
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
    
    //Returns an object so that the controller can access the capabilities within the budgetController module
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
        
        //removes the inc/exp object from the data structure
        //must be passed type (either inc/exp) and the id that you want removed
        deleteItem: function(type, id){
            var ids, index;
            
            //invokes the array of either inc/exp objects with data.allItems[type]
            //map iterates over an array and alters it, returning ids instead of objects
            ids = data.allItems[type].map(function(current){
                //objects have 3 values: .id, .description, .value
                //we want an array of IDs
                return current.id;
            });
            
            //Having returned an array of IDs, we want the index position of the ID
            //indexOf() returns -1 if the id is not found
            index = ids.indexOf(id);
            
            //Delete the type-object at index only if it was found
            //splice(start, how_many)
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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
        
        //invokes the expense-object prototype method calculatePercentage on each item in the exp array
        //This updates all the percentages that each object takes of the overall budget
        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        
        //invokes the expense-object prototype method getPercentage on each item in the exp array
        //returns an array filled with all of the percentage values using the .map() method
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
            
            var numSplit, int, dec;
            
            /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands
            
            2310.4567 -> +2310.46
            2000 -> 2,000.00
            */
            num = Math.abs(num);
            num = num.toFixed(2); //adds exactly 2 decimal spaces after the period. Part of the number prototype
            
            numSplit = num.split('.'); //Puts num into a 2-element array
            int = numSplit[0];
            if(int.length > 3) {
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3);
            };
            dec = numSplit[1];
            
            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
            
        };
    
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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
                
            } else if (type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            }
            
            //Replace the placeholder text with data
            // Searches the html string for a substring, replaces it with values pulled from corresponding object in data structure
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));
            
            
            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },
        
        //To delete from the UI, we need to select the appropriate ID under class "income__list"/"expense__list"
        //Will be passed itemID var from controller.ctrlDeleteItem()
        deleteListItem: function(selectorID) {
            //Define the ID to be deleted
            var el = document.getElementById(selectorID);
            //Since it is a child, go up to its appropriate parent tier and then remove it
            el.parentNode.removeChild(el);
            //Note that the above 2 lines could be written as follows:
            //document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
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
        
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp'; 
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        displayPercentages: function(percentages){
            //Don't know how many exp items will be on the list, so we use .querySelectorAll()
            //var fields is a nodeList, since in the DOM tree all elements are nodes
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            //Instead of converting a nodeList to an array via .slice(), let's just alter the HTML directly
            //Leverages callback functions
            //nodeListForEach is going to be an anonymous function that takes in a nodeList and a method for arguments
            var nodeListForEach = function(list, callback){
                for (var i = 0; i < list.length; i++){
                    //for each item in the list, call the method and pass the current element in the nodeList and its index
                    callback(list[i], i);
                }
            };
            
            //Execute nodeListForEach on var fields with the following callback function
            nodeListForEach(fields, function(current, index){
                //If the value in the percentages array at the given index is greater than 0...
                if (percentages[index] > 0) {
                    //alter the current node value to the percentage stored in the percentages[index] array
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        
        displayMonth: function() {
            
            var now, year, months;
            //stores current YYYY MM DD
            now = new Date(); 
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth(); //Returns a zero-based int: 0 = Jan, 11 = Dec
            year = now.getFullYear(); //Returns YYYY
            
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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
        
        
        //Using event delegation, we setup a listener for deletion clicks
        //We needed event delegation because the elements in the HTML code do not exist yet
        //The elements populate after the user inputs entries
        //This also saves us from having to add event listeners to each element as they are made
        //invokes the function ctrlDeleteItem
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
    };
    
    var updateBudget = function(){
        //Calculate the budget
        budgetCtrl.calculateBudget();
        
        //Return the budget
        var budget = budgetCtrl.getBudget();
        
        //Display the budget
        UICtrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        //calculate percentages
        budgetCtrl.calculatePercentages();
        //read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        //update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    };
    
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
            updatePercentages();
            
        }
        
   
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        //Uses DOM traversal to find the ID of the elements listed
        //i.e. the object ID is stored in an elevated tier from where the button is nested
        //Stored 4 tiers up, hence invoking parentNode so many times
        //ID will return as 'inc-#' or 'exp-#'
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        //if the ID exists (evaluates to 'true')...
        if (itemID) {
            //make an array from the string, storing inc/exp into [0] and the ID-value into [1]
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            
            //delete item from the UI
            UICtrl.deleteListItem(itemID);
            
            //Update and show the new budget
            updateBudget();
            
            //Update and shoe the new percentages
            updatePercentages();
        };
    };
    
    return {
        init: function() {
            console.log('Application has started');
            //Initializes the app with all values onscreen set to default values
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }
    
})(budgetController,UIController);

controller.init();