document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#startDate", {
    enableTime: true,
    time_24hr: true,
    dateFormat: "d.m.Y H:i",
    locale: "ru",
    minDate: "today",
  });
  const dayOfWeekElement = document.querySelector(".main-header");
  const dateElement = document.querySelector(".header-group__sub-header");

  function updateDate() {
    const now = new Date();
    const daysOfWeek = [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ];
    const dayOfWeek = daysOfWeek[now.getDay()];
    const dayOfMonth = now.getDate();
    const months = [
      "Января",
      "Февраля",
      "Марта",
      "Апреля",
      "Мая",
      "Июня",
      "Июля",
      "Августа",
      "Сентября",
      "Октября",
      "Ноября",
      "Декабря",
    ];
    const month = months[now.getMonth()];

    dayOfWeekElement.textContent = dayOfWeek;
    dateElement.textContent = `${dayOfMonth} ${month}`;
  }

  updateDate();
});

const floatButton = document.querySelector(".float-button");
const modal = document.querySelector("#modal");
const createForm = document.querySelector("#create-form");
const todoList = document.querySelector(".todo_list");
const cancelButton = document.querySelector(".form-button--secondary");
const searchField = document.querySelector(".search-field__input");

let todos = [];
const STORAGE_KEY = "todos";
let searchQuery = "";
let currentFilter = "all";

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const storedTodos = localStorage.getItem(STORAGE_KEY);
  if (storedTodos) {
    todos = JSON.parse(storedTodos);
    renderTodos();
  }
}
function parseCustomDateString(dateStr) {
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split(".");
  const [hours, minutes] = timePart.split(":");

  return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
}

function createTodoElement(todo) {
  const listItem = document.createElement("li");
  listItem.classList.add("todo-block");
  listItem.dataset.todoId = todo.id;

  const label = document.createElement("label");
  label.classList.add("checkbox");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.done;
  const checkIcon = document.createElement("span");
  checkIcon.classList.add("checkbox__check-icon");
  checkIcon.innerHTML =
    '<img src="./assets/svg/Selected icon.svg" alt="check" />';
  label.appendChild(checkbox);
  label.appendChild(checkIcon);

  const dataDiv = document.createElement("div");
  dataDiv.classList.add("todo-block__data");
  const dateParagraph = document.createElement("p");
  dateParagraph.classList.add("todo-block__date");
  const parsedDate = parseCustomDateString(todo.date);
  const formattedDate = parsedDate.toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  dateParagraph.textContent = formattedDate;
  const titleHeading = document.createElement("h3");
  titleHeading.classList.add("todo-block__title");
  titleHeading.textContent = todo.description;
  dataDiv.appendChild(dateParagraph);
  dataDiv.appendChild(titleHeading);

  listItem.appendChild(label);
  listItem.appendChild(dataDiv);

  checkbox.addEventListener("change", () => {
    todo.done = checkbox.checked;
    saveTodos();
    renderTodos();
  });

  return listItem;
}

function renderTodos() {
  todoList.innerHTML = "";

  const filteredTodos = todos
    .filter((todo) => {
      if (currentFilter === "active") return !todo.done;
      if (currentFilter === "completed") return todo.done;
      return true;
    })
    .filter((todo) =>
      todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  filteredTodos.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoList.appendChild(todoElement);
  });
}

loadTodos();

createForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const descriptionInput = document.getElementById("description");
  const startDateInput = document.getElementById("startDate");

  const description = descriptionInput.value.trim();
  const date = startDateInput.value;

  const selectedDate = new Date(date);
  const now = new Date();

  if (selectedDate < now) {
    alert("Нельзя выбрать дату в прошлом.");
    return;
  }

  if (description) {
    const newTodo = {
      id: Date.now(),
      description: description,
      date: date,
      done: false,
    };

    todos.push(newTodo);
    saveTodos();
    renderTodos();
    modal.classList.remove("active");
    createForm.reset();
  } else {
    alert("Пожалуйста, введите описание задачи.");
  }
});

cancelButton.addEventListener("click", () => {
  modal.classList.remove("active");
  createForm.reset();
});

const filterButtons = document.querySelectorAll(".split-button__button");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    splitButtonClickHandler(button);
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

function splitButtonClickHandler(button) {
  const allButtons = document.querySelectorAll(".split-button__button");

  allButtons.forEach((btn) => {
    btn.classList.remove("split-button__button--active");
  });

  button.classList.add("split-button__button--active");
}

floatButton.addEventListener("click", () => {
  modal.classList.add("active");
});
searchField.addEventListener("input", function () {
  searchQuery = searchField.value;
  renderTodos();
});
