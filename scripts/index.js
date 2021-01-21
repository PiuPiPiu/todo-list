document.addEventListener('DOMContentLoaded', function () {

  const state = getStoredStateOrDefault({
    counter: 0
  })
  const count = JSON.parse(localStorage.getItem('count'))
  const returnObj = JSON.parse(localStorage.getItem('list_items'))
  const returnState = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {}

  let elementOfList

  if (Object.keys(returnObj).length !== 0) {
    for (key in returnObj) {
      if (returnState[key] == 'true') {
        elementOfList = '<div class="element-todo-list"><div class="success element_of_list"><input type="checkbox" onclick="checkTask(this)" checked class="checkbox_task" id = "' + key + '">' + returnObj[key] + '</div><i onclick="removeTask(this)" class="fas fa-times" style="display:none"></i></div></div>'
        
      } else {
        elementOfList = '<div class="element-todo-list"><div class="element_of_list"><input type="checkbox" onclick="checkTask(this)" class="checkbox_task" id = "' + key + '">' + returnObj[key] + '</div><i onclick="removeTask(this)" class="fas fa-times"></i></div></div>'
      }
      $('.input_list').append(elementOfList)
    }
    gaugePhotoDisplay('block', 'none', 'none', 'block')
  } else {
    gaugePhotoDisplay('none', 'block', 'none', 'none')
  }


  const $gauge = document.querySelector('.gauge')
  setGaugePercent($gauge, state.counter)



if (state.counter == 100) {
  gaugePhotoDisplay('none', 'none', 'block', 'none')
}

document.getElementsByClassName('count_task')[0].style.display = 'block'
countToDo.textContent = countOfTask + " tasks to do"


})


// ------------------------------Необходимые переменные------------------------------
const newTask = document.querySelector('.input_text') //нужна при добавлении тасков в todo
const addTaskbtn = document.querySelector('.add_task') // переменная для +
const state = getStoredStateOrDefault({
  counter: 0
}) //число в кольце
const $gauge = document.querySelector('.gauge') //переменная для кольца
const btnNewDay = document.querySelector('.new_day_button') //переменная для кнопки new day
let countToDo = document.querySelector('.count_task') // переменная для отображ-я кол-ва тасков под кольцом
let listItems = localStorage.getItem('list_items') ? JSON.parse(localStorage.getItem('list_items')) : {} // таски в базе
let countOfTask = localStorage.getItem('count') ? JSON.parse(localStorage.getItem('count')) : 0 //переменная для подсчёта тасков в базе
let id = localStorage.getItem('id_task') ? JSON.parse(localStorage.getItem('id_task')) : 1 //id таска в базе
let stateSuccess = localStorage.getItem('state_success') ? JSON.parse(localStorage.getItem('state_success')) : {} //состояния чекбокса в базе
// ------------------------------Функции и слушатели------------------------------

// ф-я отображения картинок, круга и счётчика задач
function gaugePhotoDisplay(a, b, c, d) {
  document.getElementsByClassName('gauge')[0].style.display = a
  document.getElementsByClassName('new_day_screen')[0].style.display = b
  document.getElementsByClassName('all_down_screen')[0].style.display = c
  document.getElementsByClassName('count_task')[0].style.display = d
}

//ф-ии для расчёта значений кольца
function gaugeMin(gaugeCounter) {
  state.counter = Math.min(gaugeCounter, 100)
  saveState(state)
  setGaugePercent($gauge, state.counter)
}

function gaugeMax(gaugeCounter) {
  state.counter = Math.max(gaugeCounter, 0)
  saveState(state)
  setGaugePercent($gauge, state.counter)
}


newTask.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && inputValid()) {
    saveTask()
    gaugePhotoDisplay('block', 'none', 'none', 'block')
  }
})


addTaskbtn.addEventListener("click", (e) => {
  if (inputValid()) {
    saveTask()
    gaugePhotoDisplay('block', 'none', 'none', 'block')
  }
})


btnNewDay.addEventListener("click", (e) => {
  localStorage.clear()
  window.location.reload()
})


function inputValid() {
  return (newTask.value !== "") && (newTask.value !== " ")
}

//ф-я для записи тасков в базу
function saveTask() {
  listItems[id] = newTask.value
  localStorage.setItem('list_items', JSON.stringify(listItems))
  addTask(newTask.value)
  newTask.value = ""
}


function addTask(taskValue) {
  countOfTask++
  localStorage.setItem('count', JSON.stringify(countOfTask))
  let elementOfList = '<div class="element-todo-list"><div class="element_of_list"><input type="checkbox" onclick="checkTask(this)" class="checkbox_task" id = "' + id + '">' + taskValue + '</div><i onclick="removeTask(this)" class="fas fa-times" ></i></div></div>'
  $('.input_list').append(elementOfList)
  id++
  localStorage.setItem('id_task', JSON.stringify(id))
  countToDo.textContent = countOfTask + " tasks to do"
  if (state.counter !== 0) {
    gaugeMax(Object.keys(stateSuccess).length * 100 / countOfTask)
  }
}


function removeTask(obj) {
  countOfTask--
  localStorage.setItem('count', JSON.stringify(countOfTask))

  for (key in listItems) {
    if (obj.parentElement.children[0].children[0].id == key) {
      delete listItems[key]
    }
  }
  for (key in stateSuccess) {
    if (obj.parentElement.children[0].children[0].id == key) {
      delete stateSuccess[key]
    }
  }
  localStorage.setItem("list_items", JSON.stringify(listItems))
  localStorage.setItem("state_success", JSON.stringify(stateSuccess))
  obj.parentElement.remove()
  if (state.counter == 0) {
    state.counter = 0
    saveState(state)
    setGaugePercent($gauge, state.counter)
  } else {
    gaugeMax(Object.keys(stateSuccess).length * 100 / countOfTask)
    if (state.counter == 100) {
      localStorage.clear()
      gaugePhotoDisplay('none', 'none', 'block', 'none')
    }
  }
  if (countOfTask == 0) {
    gaugePhotoDisplay('none', 'block', 'none', 'none')
    localStorage.setItem('id_task', JSON.stringify(1))
    id = localStorage.getItem('id_task')
  }
  countToDo.textContent = countOfTask + " tasks to do"
}


function checkTask(obj) {
  if (!obj.parentElement.classList.contains('success')) {
    obj.parentElement.classList.add('success')
    stateSuccess[obj.parentElement.children[0].id] = "true"
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    gaugeMin(state.counter + 100 / countOfTask)
    gaugePhotoDisplay('block', 'none', 'none', 'block')
    obj.parentElement.parentElement.children[1].style.display = 'none'
    if (state.counter == 100) {
      gaugePhotoDisplay('none', 'none', 'block', 'none')
    }

  } else {
    for (key in stateSuccess) {
      if (key == obj.id) {
        delete stateSuccess[key]
      }
    }
    localStorage.setItem("state_success", JSON.stringify(stateSuccess))
    obj.parentElement.classList.remove('success')
    obj.parentElement.parentElement.children[1].style.display = 'block'
    gaugeMax(state.counter - 100 / countOfTask)
    gaugePhotoDisplay('block', 'none', 'none', 'block')
  }
}