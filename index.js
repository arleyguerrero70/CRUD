const db = firebase.firestore();

const taskForm = document.getElementById('task-form');
const taskContainer = document.getElementById('task-container'); 

let editStatus = false;
let id = '';

const saveTask = (tittle, description) =>
    db.collection('task').doc().set({
        tittle,
        description
    });

const getTask = () => db.collection('task').get();

const getTasks = (id) => db.collection('task').doc(id).get();

const onGetTask = (callback) => db.collection('task').onSnapshot(callback);

const deleteTask = id => db.collection('task').doc(id).delete();

const updateTask = (id, updateTask) => 
    db.collection('task').doc(id).update(updateTask);

window.addEventListener('DOMContentLoaded', async (e) => {    
    onGetTask((querySnapshot) =>{
        taskContainer.innerHTML = '';
            querySnapshot.forEach((doc) => {                
                const task = doc.data(); 
                task.id = doc.id;       
                taskContainer.innerHTML +=  
                    `<div class="card card-body mt-2 bg-primary border-light">
                        <h3 class="h5">${task.tittle}</h3>
                        <p>${task.description}</p>
                        <div>
                            <button class="btn btn-warning mt-2 btnEdit" data-id="${task.id}">Editar</button>
                            <button class="btn btn-danger mt-2 btn-delete" data-id="${task.id}">Eliminar</button>
                        </div>    
                    </div>`;

                    const btnDelete = document.querySelectorAll('.btn-delete');
                    btnDelete.forEach(btn => {
                        btn.addEventListener('click', async (e)=>{
                        await deleteTask(e.target.dataset.id);
                        console.log(e.target.dataset.id);
                        });
                    });
                    
                    const btnEdit = document.querySelectorAll('.btnEdit');
                    btnEdit.forEach(btn => {
                        btn.addEventListener('click', async (e) => {
                        const doc = await getTasks(e.target.dataset.id);                          
                        const task = doc.data();

                        editStatus = true;
                        id = doc.id;
                        
                        taskForm['text-tittle'].value = task.tittle;
                        taskForm['text-description'].value = task.description;
                        taskForm['btn-task-form'].innerText = 'Actualizar información';
                        });
                    });
            });  
    });   
    
});

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tittle = taskForm['text-tittle'];
    const description = taskForm['text-description'];

    if(!editStatus){
        await saveTask(tittle.value, description.value);
    }else{
        await updateTask(id, {
            tittle: tittle.value, 
            description: description.value
        });
    }

    editStatus = false;
    id = '';
    taskForm['btn-task-form'].innerText = 'Crear Tarea';


    

    taskForm.reset();
    tittle.focus();

   
    console.log(tittle, description)
})