var budgetController = (function(){
    //some code
})();


var UIController = (function() {
    //some code
})();


var controller = (function(budgetCtrl, UICtrl){
    //some input from the other 2 controllers
    document.querySelector('.add__btn').addEventListener('click', function(){
        console.log('TEST')
    })
})(budgetController,UIController);