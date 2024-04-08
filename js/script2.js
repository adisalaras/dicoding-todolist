const todos=[];
const RENDER_EVENT='render-todo';
const SAVED_EVENT ='saved-todo'; //perubahan data sukses di perbarui
const STORAGE_KEY = 'TODO_APPS';

function generateId(){ 
    return + new Date(); //mendapatkan timestamp pada js
}

function generateTodoObject(id, task, timestamp, isCompleted) { //membuat object baru
    return{
        id,
        task,
        timestamp,
        isCompleted
    }
}

function findTodo(todoId){
    for(const todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId){
    for(const index in todos){
        if(todos[index].id=== todoId){
            return index;
        }
    }
    return -1;
}



function isStorageExist(){
    if(typeof(Storage) === undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function saveData(){
    if(isStorageExist()){ //CEK APAKAH DIDUKUNG local storage ada atau tidak
        const parsed = JSON.stringify(todos); //konversi data object ke strig agar dapat disimpan
        localStorage.setItem(STORAGE_KEY, parsed); //menyimpan data ke storage key
        document.dispatchEvent(new Event(SAVED_EVENT)); //mempermudah traking saat terjadi peruahan data
    }
}

function loadDataFromStorage(){
    const serializedData=localStorage.getItem(STORAGE_KEY); //ambil data dengan format json
    let data = JSON.parse(serializedData); //parse data json menjadi object

    if(data !== null){ 
        for (const todo of data){ 
            todos.push(todo); //masukan data ke array todos selama tidak null
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT)); //untuk memperbarui tampilan
}

function makeTodo(todoObject){
    const textTitle= document.createElement('h2'); //membuat objek DOM 
    textTitle.innerText= todoObject.task;

    const textTimestamp=document.createElement('p');
    textTimestamp.innerText=todoObject.timestamp;

    const textContainer=document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', 'todo', `todo-${todoObject.id}`);

    

    if(todoObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function()
        {
            
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button')

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);

    }else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    
    return container;

}

function addTodo(){
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo,timestamp,false); //generate = helper
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(todoId)
    {
        const todoTarget= findTodo(todoId);
        if(todoTarget == null) return;

        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
function removeTaskFromCompleted(todoId){
    const todoTarget = findTodoIndex(todoId);

    if(todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(todoId){
    const todoTarget=findTodo(todoId);

    if(todoTarget == null) return;

    todoTarget.isCompleted= false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function() //menjalankan kode didalam listener ketika event DOMContentLoaded dijalankan
{

    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event){
        event.preventDefault();
        addTodo();
    });
    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function(){
    const uncompletedTODOList=document.getElementById('todos');
    uncompletedTODOList.innerHTML='';

    const completedTODOList=document.getElementById('completed-todos')
    completedTODOList.innerHTML='';

    for(const todoItem of todos){
        const todoElement=makeTodo(todoItem);
        if(!todoItem.isCompleted)
        uncompletedTODOList.append(todoElement);
    else
    completedTODOList.append(todoElement);
    }
});




document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
    
    
});


document.addEventListener(RENDER_EVENT,function(){
        const uncompletedTODOList=document.getElementById('todos');
        uncompletedTODOList.innerHTML='';

        for(const todoItem of todos){
            const todoElement=makeTodo(todoItem);
            if(!todoItem.isCompleted){
                uncompletedTODOList.append(todoElement);
            }
        }
    });

    

   









