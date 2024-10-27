const taskLists = document.querySelectorAll('.task-list')
const backlogTasks = document.querySelector('#backlog .task-list')
const doingTasks = document.querySelector('#doing .task-list')
const doneTasks = document.querySelector('#done .task-list')
const discardTasks = document.querySelector('#discard .task-list')
// const titleInput = document.querySelector('#title')
// const descriptionInput = document.querySelector('#description')
const submitButton = document.querySelector('#submit-button')
const errorContainer = document.querySelector('.error-container')

const addTaskBtn = document.querySelector('.header__button--new-task')

const currentUser = JSON.parse(localStorage.getItem('currentUser')) || [];


if(currentUser.role !== 'admin') {
  addTaskBtn.classList.add('none')
}

let tasks = [
  {
    id: 0,
    title: 'Fix submit button',
    description:
      'The submit button has stopped working since the last release.',
    state: 'backlog'
  },
  {
    id: 1,
    title: "Change text on T and C's",
    description:
      'The terms and conditions need updating as per the business meeting.',
    state: 'done'
  },
  {
    id: 2,
    title: 'Change banner picture',
    description:
      'Marketing has requested a new banner to be added to the website.',
    state: 'doing'
  },
]


localStorage.setItem('tasks', JSON.stringify(tasks));


const currentTasks = JSON.parse(localStorage.getItem('tasks')) || [];


taskLists.forEach((taskList) => {  
  taskList.addEventListener('dragover', dragOver)
  taskList.addEventListener('drop', dragDrop)
})

function createTask(taskId, title, description, state) {
  
  const taskCard = 
    `
        <div class="task-container task-container--${state}" draggable="true" data-task-id="${taskId}" data-task-state=${state}>
          <div class="task-decor"></div>
          <div class="task-header__wrapper">
            <div class="task-header">${title}</div>
            <div class="task-details">
              <img src="./img/task-detail.svg" alt="" />
            </div>
          </div>
          <div class="task-footer">
            <div class="task-date">до 15.09.2024</div>
            <div class="task-comment">
              <img src="./img/task-comment.svg" alt="" />
              1
            </div>
          </div>
        </div> 
      `

  let taskCardDrag
  if(state === 'backlog'){
    backlogTasks.insertAdjacentHTML('afterbegin', taskCard)
    taskCardDrag = document.querySelector('.task-container--backlog')
    taskCardDrag.querySelector('.task-decor').style.backgroundColor = '#FF5959';
  }
  if(state === 'doing'){
    doingTasks.insertAdjacentHTML('afterbegin', taskCard)
    taskCardDrag = document.querySelector('.task-container--doing')
    taskCardDrag.querySelector('.task-decor').style.backgroundColor = '#597EFF';
  }
  if(state === 'done'){
    doneTasks.insertAdjacentHTML('afterbegin', taskCard)
    taskCardDrag = document.querySelector('.task-container--done')
    taskCardDrag.querySelector('.task-decor').style.backgroundColor = '#59FFCD';
  }
  if(state === 'discard'){
    discardTasks.insertAdjacentHTML('afterbegin', taskCard)
    taskCardDrag = document.querySelector('.task-container--discard')
    taskCardDrag.querySelector('.task-decor').style.backgroundColor = '#FF59EE';
  }
  
  taskCardDrag.addEventListener('dragstart', dragStart)
}

function addColor(column) {
  let color
  switch (column) {
    case 'backlog':
      color = '#FF5959'
      break
    case 'doing':
      color = '#597EFF'
      break
    case 'done':
      color = '#59FFCD'
      break
      case 'discard':
      color = '#FF59EE'
      break
    default:
      color = '#FF5959'
  }
  return color
}

function addTasks() {
  currentTasks.forEach((task) => 
   createTask(task.id, task.title, task.description, task.state)
  )
}

addTasks()

let elementBeingDragged

function dragStart() {
  elementBeingDragged = this  
}

function dragOver(e) {
  e.preventDefault()
}

function dragDrop() {
  const columnId = this.parentNode.id  
  let decor = elementBeingDragged.querySelector('.task-decor')
  decor.style.backgroundColor = addColor(columnId)
  elementBeingDragged.setAttribute('data-task-state', columnId)
  this.append(elementBeingDragged)
  let taskId = elementBeingDragged.getAttribute('data-task-id')

  console.log(currentTasks);
  

  currentTasks.forEach(task => {
    if (task.id === +taskId) {
      task.state = columnId
    } 
  })


  localStorage.setItem('tasks', JSON.stringify(currentTasks));
  
}

function showError(message) {
  const errorMessage = document.createElement('p')
  errorMessage.textContent = message
  errorMessage.classList.add('error-message')
  errorContainer.append(errorMessage)

  setTimeout(() => {
    errorContainer.textContent = ''
  }, 2000)
}

function addTask(e) {
  e.preventDefault()
  const filteredTitles = tasks.filter((task) => {
    return task.title === titleInput.value
  })

  if (!filteredTitles.length) {
    const newId = tasks.length
    tasks.push({
      id: newId,
      title: titleInput.value,
      description: descriptionInput.value,
      state: 'backlog'
    })
    createTask(newId, titleInput.value, descriptionInput.value)
    titleInput.value = ''
    descriptionInput.value = ''
  } else {
    showError('Title must be unique!')
  }
}
submitButton.addEventListener('click', addTask)

function deleteTask() {
  const headerTitle = this.parentNode.firstChild.textContent

  const filteredTasks = tasks.filter((task) => {
    return task.title === headerTitle
  })

  tasks = tasks.filter((task) => {
    return task !== filteredTasks[0]
  })
  
  this.parentNode.parentNode.remove()
}
