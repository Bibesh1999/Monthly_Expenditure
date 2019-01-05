   //Budget controller
   
    var budgetController = (function(){
     //Some code
     
     var Expense=function(id,description,value){
      this.id=id;
      this.description=description;
      this.value=value;  
      this.percentage=-1;
     };

     Expense.prototype.calcPercentage=function(totalIncome){
        
         if(totalIncome>0){
             this.percentage=Math.round((this.value / totalIncome) * 100);
             
         }else 
         {
             this.percentage=-1;
         }
      };

      Expense.prototype.getPercentage=function(){
        return this.percentage;

      };
 
      var Income= function(id,description,value) {
        this.id=id;
        this.description=description;
        this.value=value;
     };

    var calculateaTotal=function(type){
    var sum=0;
    data.allItems[type].forEach(function(cur){
    sum=sum+ cur.value;
    });
    data.totals[type]=sum;
    };

    var data={
         allItems : {
            exp:[],
            inc:[]
        },
        totals:{
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1,
    
    };
    
    return {
    addItem:function(type,des,val){
       var newItem,ID;

    //Create new ID
      if(data.allItems[type].length>0)
      {
        ID=data.allItems[type][data.allItems[type].length-1].id+1;
      }
      else
      {
          ID=0;
      }
             
    //Create new Item
       if(type=='exp')
       {
        newItem= new Expense(ID,des,val);
       }
       else if(type=='inc')
       {
        newItem=new Income(ID,des,val);
       }
        //Push it to data structure
       data.allItems[type].push(newItem);

       //return the new item
        return newItem;

       
     },
    
    deleteItem:function(type,id){ 
    var ids,index;
    
    ids=data.allItems[type].map(function(current){
        return current.id;
    });
    index=ids.indexOf(id);
    if(index!==-1)
    {
        data.allItems[type].splice(index,1);
    }
    },
    calculateBudget:function()
    {
        //calculate total income and expenses
          calculateaTotal('exp');
          calculateaTotal('inc');

        //calculate the budget : income - expenses
        //console.log(data.totals.inc);
        //console.log(data.totals.exp);

       data.budget=data.totals.inc - data.totals.exp;
       //console.log(data.budget);

        //calculate the percentage of income that we spent 
        if(data.budget>0)
        {
        data.percentage=Math.round((data.totals.exp / data.totals.inc)*100);
        }else{
            data.percentage=-1;
        }
        },

        calculatePercentages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages:function(){
            var allPerc=data.allItems.exp.map(function(cur){
                //console.log(data.totals.inc);
                return cur.getPercentage();
            }); 
            return allPerc;
        },
        getbudget:function()
    {
    return {
        budget:data.budget,
        totalInc:data.totals.inc,
        totalExp:data.totals.exp,
        percentage:data.percentage

    }
    },
    testing:function(){
        console.log(data);
    }
};
})();



//UI controller
var UIcontroller=(function(){
    //some code
    var DOM={
    inputType:'.add__type',
    inputDescription:'.add__description',
    inputValue:'.add__value',
    addbtn:'.add__btn',
    incomeContainer:'.income__list',
    expensesContainer:'.expenses__list',
    budgetLabel:'.budget__value',
    incomeLabel:'.budget__income--value',
    expenseLabel:'.budget__expenses--value',
    percentageLabel:'.budget__expenses--percentage',
    container:'.container',
    expensesPercLabel:'.item__percentage',
    dateLabel:'.budget__title--month'
   

};
var nodeListForEach=function(list,callback){
     for (var i=0;i<list.length;i++)
     {
         callback(list[i],i);
     }
    };


 return {
       getInput: function (){ 
            return {
         type:document.querySelector(DOM.inputType).value,
         description:document.querySelector(DOM.inputDescription).value,
          value:parseFloat(document.querySelector(DOM.inputValue).value)
     };
    },
     addListItem:function(obj,type)
     {  var html,newHTML,element;
       //create HTML strings with placeholder text 
       if(type==='inc'){
           element=DOM.incomeContainer;
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else if(type==='exp'){
            element=DOM.expensesContainer;
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
       //replace the placeholder text with some actual data 
       newHTML=html.replace('%id%',obj.id);
       newHTML=newHTML.replace('%description%',obj.description);
       newHTML=newHTML.replace('%value%',obj.value);
    



       //insert the html into DOM
       document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);

     },
      deleteItemList:function(SelectorId){
      var el=document.getElementById(SelectorId);
      el.parentNode.removeChild(el);

     },


     clearFields:function()
     {
      var fields,fieldsArr;

      fields= document.querySelectorAll(DOM.inputDescription + ',' + DOM.inputValue);

      fieldsArr= Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current,index,array) {
         current.value="";
      });
      fieldsArr[0].focus();
     },
      
    displayBudget:function(obj){
    document.querySelector(DOM.budgetLabel).textContent=obj.budget;
    document.querySelector(DOM.incomeLabel).textContent=obj.totalInc;
    document.querySelector(DOM.expenseLabel).textContent=obj.totalExp;
    //console.log(obj.totalExp);
    if(obj.percentage>0)
    {
        document.querySelector(DOM.percentageLabel).textContent=obj.percentage+'%';
    }
    else
    {
        document.querySelector(DOM.percentageLabel).textContent="__";
    }
   }, 
    displayPercentage:function(percentages){
      
    var fields=document.querySelectorAll(DOM.expensesPercLabel);
    
    

    nodeListForEach(fields,function(current,index){
        
        if(percentages[index]>0)
        {
            current.textContent=percentages[index]+'%';
        }
        else{
            current.textContent='___';
        }
        
    });
    },
     displayMonth:function(){
         var now,year,month,months;
          now =new Date();
          months=['January','February','March','April','May','June','July','August','September','October','November','December'];
          month=now.getMonth();
         year=now.getFullYear();
         document.querySelector(DOM.dateLabel).textContent=months[month] +' '+ year;
        

     },
     changedType:function(){
      var fields=document.querySelectorAll(
          DOM.inputType+','+
          DOM.inputDescription+','+
          DOM.inputValue);
     
     nodeListForEach(fields,function(cur){
         cur.classList.toggle('red-focus');

     });
     document.querySelector(DOM.addbtn).classList.toggle('red');
    
     },
    getDOM: function(){
        return DOM;
    } 
    }; 
})();

//Global app controller

//Controller
var controller=( function(budgetCtrl,UICtrl) {
//some code
var setUpEventListeners=function()
{ 
    var dom=UICtrl.getDOM();
    document.querySelector(dom.addbtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress', function(event){

    //console.log(event);
    if(event.keyCode==13 || event.which==13)
    {
    //console.log("ENTER is PRESSED.");
    ctrlAddItem();
   }
  });
  document.querySelector(dom.container).addEventListener('click',ctrlDeleteItem);
  document.querySelector(dom.inputType).addEventListener('change',UICtrl.changedType);
  };

var updateBudget=function()
{
    //budget calculate 
      budgetCtrl.calculateBudget();
    
    //return the budget
       var budget=budgetCtrl.getbudget();

    //display the budget on the UI
       UICtrl.displayBudget(budget);
};
var updatePercentage=function()
{ 
    // 1. calculate percentages
        budgetCtrl.calculatePercentages();
        
    // 2.Read percentage from the budget controller
        var percentages= budgetCtrl.getPercentages();
      
       
    // 3. Update the percentage in UI
         UICtrl.displayPercentage(percentages);
};


var ctrlAddItem=function(){

    var input;
    // 1.  Get the input data
    input= UICtrl.getInput();
    if(input.description !=="" && ! isNaN(input.value) && input.value>0 ){

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type,input.description,input.value);

    //3. add the item to the UI
    UICtrl.addListItem(newItem,input.type);

    //4. clear the fields 
    UICtrl.clearFields();

    //5. calculate the budget
    updateBudget();

    //6. Calculate and update budget
    updatePercentage();
}
 
};
var ctrlDeleteItem=function(event){
   var itemID,splitId,type,id;
   itemID= event.target.parentNode.parentNode.parentNode.parentNode.id;
   if(itemID)
   {
     splitId=itemID.split('-');
     type=splitId[0];
     id=parseInt(splitId[1]);

     //1. delete the item from the data structure
          budgetCtrl.deleteItem(type,id);
     
     //2. delete the data from the UI
          UICtrl.deleteItemList(itemID);
     
     //3. Update and display the new Budget 
          updateBudget();

     // 4.Calculate and update budget
          updatePercentage();  
   }
  };
return {
    init:function() {
        console.log("Application has started.");
        UICtrl.displayMonth();
        UICtrl.displayBudget({
        budget:0,
        totalInc:0,
        totalExp:0,
        percentage:-1
     })
        setUpEventListeners();
    }
};
})(budgetController,UIcontroller);

controller.init();