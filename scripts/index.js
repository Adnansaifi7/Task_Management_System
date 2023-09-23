
const state = {
    taskList : [],
};

// DOM- docuent object
const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body"); 

const htmlTaskContent = ({id, title, description, type,url}) =>  `
 <div class= col-md-6, col-lg-4,  mt-3 id=${id}, key= ${id}>
 <div class = "card hadow-sm  task_card">
 <div class = "card-header d-flex gap-2 justify-content-end task_card_header">

 <button type = "button" class = "btn btn-outline-info mr-2" name=${id} onclick ='editTask.apply(this,arguments)'>
 <i class = "fas fa-pencil-alt" name=${id}></i>
 </button>

 <button type = "button" class = "btn btn-outline-danger mr-2" name=${id} onclick ='deleteTask.apply(this,arguments)'>
 <i class = "fas fa-trash-alt" name=${id}></i>
 </button>
 </div>
 <div class = "card-body">
 ${
    url ?
    `<img width= "100%" height="150px" style = "object-fit: cover; object-position: center" 
    src = ${url} alt= "card-image-cap" class = "card-image-top md-3 roundeed-lg">`
     : 
     `<img width= "100%" height="150px" style = "object-fit: cover; object-position: center" 
     src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSihqBiHRNok3c5auncSFWJT83S7jcXjLVlsczWTq2x&s" 
     alt= "card-image-cap" class = "card-image-top md-3 roundeed-lg">`  
}
 <h4 class = "task_card_title"> ${title} </h4>
 <p class= "descriptiom trim-3-lines text-muted" data-gram_editor= 'false'>
 ${description} </p>
 <div class = 'tags text-white d-flex flex-wrap'>
 <span class ='badge bg-primary m-1'>${type} </span>

 </div>
 </div>
 <div class = 'card-footer'>
 <button type = "button"
 class = 'btn btn-outline-primary float-right>
 data-bs-toggle = 'modal'
 data-bs-target = '#showTask'
 id = ${id}
 onclick = 'openTask.apply(this, arguments)'
 >
 Open Task
 </button>
 </div>
 </div>
 </div>
`;
const htmlModalContent = ({id,title,description , url}) =>{
    const date = new Date(parseInt());
    return `
    <div id = ${id} >
    ${
        url ? 
        `<img width = '100%' src ='${url}' alt = 'card img cap' class = 'img-fluid place_holer_image mb-3' />`
        :
        `<img width= "100%" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSihqBiHRNok3c5auncSFWJT83S7jcXjLVlsczWTq2x&s" alt= "card-image-cap" class = "card-image-top md-3 roundeed-lg">`

    }
    <h2 class = 'my-3'> ${title} </h2>
    <p class = 'lead' > ${description} </p>
    `;
};

const updateLocalStorage = () => {
    localStorage.setItem(
        "tasks",
         JSON.stringify({
            tasks: state.taskList,
        })
    );
};



const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks)

    if(localStorageCopy) state.tasks= localStorageCopy.tasks;
    state.taskList.map((cardDate) =>{
        taskContents.insertAdjacentHTML ("beforeend", htmlTaskContent(cardDate));
    });
};

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById("imageUrl").value,
        title:document.getElementById("taskTitle").value,
        description:document.getElementById("taskDescription").value,
        type:document.getElementById("tags").value,
    };
    
    if(input.title === "" || input.description === "" || input.type===""){
        return alert("Please fill all the fields");
    }

    taskContents.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({
            ...input,
            id,
        })
    );
    state.taskList.push({...input, id});
    updateLocalStorage();
};

const openTask = (e) => {
    if(!e) e = window.event;

    const getTask = state.taskList.find(({id} ) => id=== e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);
};


const deleteTask = (e) => {
if(!e) e= window.event;
const targetID = e.target.getAttribute("name");
const type = e.target.tagName;
const removeTask = state.taskList.filter(({id}) => id !== targetID);
state.taskList= removeTask;

updateLocalStorage();
if(type === "BUTTON"){
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode
    )
}
return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
    )
}

const editTask = (e) => {
    if(!e) e = window.event;

    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if(type ==="BUTTON"){
        parentNode= e.target.parentNode.parentNode;
    }else{
        parentNode= e.target.parentNode.parentNode.parentNode;
    }

    taskTitle = parentNode.childNode[3].childNode[3];
    taskDescription = parentNode.childNode[3].childNode[5];
    taskType = parentNode.childNode[3].childNode[7].childNode[1];
     submitButton = parentNode.childNode[5].childNode[1];

    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
    submitButton.removeAttribute("data-bs-toggle");
    submitButton.removeAttribute("data-bs-target");
    submitButton.innerHTML= "Save Changes";
};

const saveEdit = (e) => {
    if(!e) e = window.event;

    const targetID= e.target.id;
    const parentNode= e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNode[3].childNode[3];
    const taskDescription = parentNode.childNode[3].childNode[5];
    const taskType = parentNode.childNode[3].childNode[7].childNode[1];
    const submitButton = parentNode.childNode[5].childNode[1];

    const updateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };
       
    let stateCopy = state.taskList;
       stateCopy = stateCopy.map((task) => 
        task.id === targetID ? {
            id : task.id,
            title: updateData.taskTitle,
            description: updateData.taskDescription,
            type : updateData.taskType,
            url : task.url,
        } :
            task
    );

    state.taskList = stateCopy;
    updateLocalStorage();
    
    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML= "Open Task";
};

const searchTask = (e) => {
    if(!e) e = window.event;

    while(taskContents.firstChild){
        taskContents.removeChild(taskContents.firstChild);
    }

    const resultData = state.taskList.filter(({title}) => {
        return title.includes(e.target.value.toLowerCase());
    });
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });
};


