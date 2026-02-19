"use strict";

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const button = document.getElementById("add-btn");
const todoArr = JSON.parse(localStorage.getItem("stupid_array")) || [];

showTaskArr();

button.addEventListener("click", addTask);

function addTask() {
  if (inputBox.value === "") {
    alert("you must write something!");
    return;
  }

  const toDoObj = {
    text: inputBox.value,
    done: false,
    id: crypto.randomUUID(),
    antal: 1,
  };

  addNameToModel(toDoObj);
  inputBox.value = "";
  showTaskArr();
}

function addNameToModel(todoObj) {
  todoArr.push(todoObj);
  localStorage.setItem("stupid_array", JSON.stringify(todoArr));
}

function showTaskArr() {
  listContainer.innerHTML = "";
  const sortedArr = [...todoArr].sort((a, b) => a.done - b.done);

  sortedArr.forEach((elm) => {
    listContainer.innerHTML += `
      <li data-id="${elm.id}" class="${elm.done ? "checked" : ""}">
        ${elm.text}

          <label>
          Antal:
          <input 
            type="number" 
            class="amount-input"
            min="1"
            value="${elm.antal || 1}">
        </label>
         <span>\u00d7</span>
      </li>
    `;
  });
}

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const id = e.target.getAttribute("data-id");

    const todo = todoArr.find((todo) => todo.id === id);
    todo.done = !todo.done;

    updateStorage();
    showTaskArr();
  } else if (e.target.tagName === "SPAN") {
    const li = e.target.parentElement;
    const id = li.getAttribute("data-id");

    const index = todoArr.findIndex((todo) => todo.id === id);
    todoArr.splice(index, 1);

    updateStorage();
    showTaskArr();
  } else if (e.target.classList.contains("amount-input")) {
    const li = e.target.closest("li");
    const id = li.getAttribute("data-id");

    const todo = todoArr.find((todo) => todo.id === id);
    todo.antal = Number(e.target.value);

    updateStorage();
  }
});

function updateStorage() {
  localStorage.setItem("stupid_array", JSON.stringify(todoArr));
}
