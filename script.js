class Todo {
  selectors = {
    data: ".todo",
    list: ".list",
    newTaskValue: ".field__input",
    addButton: ".add-button",
  };
  localStorageKey = "item";
  constructor() {
    this.dataElement = document.querySelector(".todo");
    this.listElement = document.querySelector(".todo-list");
    this.addButtonElement = document.querySelector(".add-button");
    this.newTaskValueElement = document.getElementById("new-task");

    this.checkboxElement = document.querySelector(".todo-item__checkbox");
    this.state = {
      items: this.getItemsFromLocalStorage(),
    };
    this.render();
    this.events();
  }

  getItemsFromLocalStorage() {
    const data = localStorage.getItem(this.localStorageKey);
    if (!data) {
      return [];
    }
    try {
      const parsedData = JSON.parse(data);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch {
      console.error("Todo data parsed error");
      return [];
    }
  }

  setDataToLocalStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.state.items)
    );
  }

  render() {
    this.totalCount = this.state.items.length;
    this.listElement.innerHTML = this.state.items
      .map(
        ({ id, title, isChecked }) => `
       <li class="todo-item">
          <div class="todo-content">
            <input type="checkbox" class="todo-item__checkbox" id='${id}' ${
          isChecked ? "checked" : ""
        } />
            <label class="todo-item__label">${title}</label>
          </div>

          <div class="buttons">
            <button class="edit-button" aria-label="Edit" title="Edit"></button>
            <button class="delete-button" aria-label="Delete" title="Detele"></button>
          </div>
        </li>
    `
      )
      .join("");
  }

  addItem(title) {
    this.state.items.push({
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title,
      isChecked: false,
    });
    this.setDataToLocalStorage();
    this.render();
  }

  toggleHandler(id) {
    this.state.items = this.state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      }
      return item;
    });
    this.setDataToLocalStorage();
    this.render();
  }

  taskFormSubmit = (e) => {
    e.preventDefault();

    const newTaskItem = this.newTaskValueElement.value;
    if (newTaskItem.trim().length > 0) {
      this.addItem(newTaskItem);
      this.newTaskValueElement.value = "";
    }
  };

  onChange = ({ target }) => {
    if (target.matches(this.checkboxElement)) {
      this.toggleHandler(target.id);
    }
  };

  events() {
    this.addButtonElement.addEventListener("click", this.taskFormSubmit);
    this.listElement.addEventListener("change", this.toggleHandler);
  }
}
new Todo();
