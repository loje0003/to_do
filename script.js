"use strict";

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const button = document.getElementById("add-btn");

// Hent fra localStorage, eller start med tom array
const todoArr = JSON.parse(localStorage.getItem("stupid_array")) || [];

// Vis eksisterende opgaver ved start
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
  todoArr.push(todoObj); //Vi tilføjer opgaven til todoArr
  localStorage.setItem("stupid_array", JSON.stringify(todoArr)); // arrayet bliver gemt i localStorage, men først konverteret til en streng med JSON.stringify().
}

function showTaskArr() {
  listContainer.innerHTML = "";
  // Sorter først: ikke-færdige opgaver først, færdige opgaver til sidst
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

//bruger forEach() til at gå igennem alle opgaverne i arrayet
// For hver opgave opretter vi et <li> med:
// data-id → opgavens unikke id
// class="checked" hvis opgaven er færdig
// span med × → slet-knap

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    const id = e.target.getAttribute("data-id");

    const todo = todoArr.find((todo) => todo.id === id);
    todo.done = !todo.done;

    updateStorage();
    showTaskArr();

    // Vi bruger event delegation: vi lytter på hele <ul> (listContainer) i stedet for hvert <li>.
    // Hvis vi klikker på LI:
    // Find opgaven i arrayet via data-id
    // Skift done fra true → false eller omvendt
    // Opdater localStorage og vis listen igen
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
// Hvis vi klikker på SPAN (×):
// Find opgavens index i arrayet
// Brug splice() til at slette opgaven
// Opdater localStorage og vis listen igen

function updateStorage() {
  localStorage.setItem("stupid_array", JSON.stringify(todoArr));
}
