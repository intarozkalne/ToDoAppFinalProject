const clear = document.querySelector(".clear");
const dateElement = document.querySelector("#date");
const list = document.querySelector("#list");
const input = document.querySelector("#input");

//Classes names
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//variables
let LIST = [];

//get item localstorage
let data = localStorage.getItem("ToDo");

//check if data is not empty
if (data){
    LIST = JSON.parse(data);
    loadList(LIST); //load the list to the user interface
    countTasks()
}else{
    LIST = [];
    }

//load items to the user's interface
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.done);
    });
    countTasks()
 }

//clear the local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

//show date
// const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
// const today = new Date();
//today.setHours(0,0,0,0)
// dateElement.innerHTML = today.toLocaleTimeString(undefined,options);

let weekDays = new Array(7);
        weekDays[0] = "Sunday";
        weekDays[1] = "Monday";
        weekDays[2] = "Tuesday";
        weekDays[3] = "Wednesday";
        weekDays[4] = "Thursday";
        weekDays[5] = "Friday";
        weekDays[6] = "Saturday";

const today = new Date();
let weekDay = weekDays[today.getDay()];
let localDate = weekDay +", " + ((today.getDate() >= 10 ) ? today.getDate() : '0'+today.getDate())
                +"."+(((today.getMonth()+1) >= 10 ) ? (today.getMonth()+1) : '0'+(today.getMonth()+1))
                +"."+today.getFullYear();

dateElement.innerHTML = localDate;


function countTasks(){
    let sum = 0
    for (i=0; i<LIST.length;i++){
        if (LIST[i].done ==false)
          sum++;
    
    }

   const tasksCounts = document.querySelector("#tasksCount");
   tasksCounts.innerHTML = `You have ${sum} of ${LIST.length} tasks`
}

//addToDo
function addToDo(toDo, done){
   
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const position = "beforeend"
    const item = `
                <li class="item">
                    <i class="co fa ${DONE}" job="complete"></i>
                    <p class="text ${LINE}" contenteditable="true" job="changeText">${toDo}</p>
                    <i class="de fa fa-close" job="delete"></i>
                </li>
                `;

    list.insertAdjacentHTML(position, item);
}

//add an item to the list user enter key
document.addEventListener("keyup",function(event){
    if(event.keyCode == 13){
        addToDoList()
    }
});

document.querySelector(".add").addEventListener("click", function(event){
    // console.info(event)
    addToDoList();
});

function addToDoList(){
    const toDo = input.value;       

//if the input is not empty
        if(toDo){
            addToDo(toDo, false);

            LIST.push({
                name:toDo,
                done:false,
            });

 //add item to localstorage
            localStorage.setItem("ToDo", JSON.stringify(LIST));

        }
        input.value = "";
        countTasks()

    };

//complete to do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);
    // console.info(LIST.findIndex(function(list){return list.name===element.parentNode.innerText}))
    
    let index = LIST.findIndex(function(list){return list.name===element.parentNode.innerText})
    LIST[index].done = LIST[index].done ? false :true;
}

//remove to do
function removeToDo(element){
    let index = LIST.findIndex(function(list){return list.name===element.parentNode.innerText})
    LIST.splice([index],1);
    element.parentNode.parentNode.removeChild(element.parentNode);
      
    countTasks()
}

//target the items created dynamicaly
list.addEventListener("click", function(event){
    const element = event.target; //return the clicked element inside list
    let elementJob;
    if ( element.attributes.job !== undefined ){
      elementJob = element.attributes.job.value; //complete or delete - (check the attribute job value)
    }else{
      elementJob = "";
    }
    
    if (elementJob =="complete"){
        completeToDo(element);
    }else if (elementJob == "delete"){
        removeToDo(element);
    }else if (elementJob == "changeText"){
        changeText(element);
    }
    //add item to localstorage(this code must be added where the LIST array is updated)
    localStorage.setItem("ToDo", JSON.stringify(LIST));
    countTasks();
});

function changeText(element){
// list.addEventListener("input",function(element){
    // console.info(element.innerText)
    let index = LIST.findIndex(function(list){return list.name===element.innerText})
    // console.info(index)
    list.addEventListener("focusout",function(event){
    const element = event.target;
    // console.log(element.innerText);
    LIST[index].name = element.innerText;
    //console.log(localStorage);
    localStorage.setItem("ToDo", JSON.stringify(LIST));
    // console.log(localStorage);
    }); 
};
