class Todo {
  localStorageKey = "item";
  constructor() {
    this.dataElement = document.querySelector(".todo");
    this.totalCount = document.querySelector(".todo-length");
    this.checkedCount = document.querySelector(".todo-checked");
    this.listElement = document.querySelector(".todo-list");
    this.itemElement = document.querySelector(".todo-item");
    this.addButtonElement = document.querySelector(".add-button");
    this.deleteButtonElement = document.querySelector(".delete-button");
    this.newTaskValueElement = document.getElementById("new-task");
    this.todoContentElement = document.querySelector(".todo-content");

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
    this.totalCount.textContent = this.state.items.length;
    this.checkedCount.textContent = this.state.items.filter(
      (item) => item.isChecked === true
    ).length;

    this.listElement.innerHTML = this.state.items
      .map(
        ({ id, title, isChecked }) => `
       <li class="todo-item">
          <div class="todo-content">
            <input type="checkbox" class="todo-item__checkbox" id=${id} ${
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

  deleteItem(id) {
    this.state.items = this.state.items.filter((item) => item.id !== id);
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
    if (target.matches(".todo-item__checkbox")) {
      this.toggleHandler(target.id);
    }
  };
  onClickHandler = ({ target }) => {
    if (target.matches(".delete-button")) {
      const itemCheckbox = document.querySelector(".todo-item__checkbox");
      setTimeout(() => {
        this.deleteItem(itemCheckbox.id);
      }, 300);
    }
  };

  events() {
    this.addButtonElement.addEventListener("click", this.taskFormSubmit);
    this.listElement.addEventListener("change", this.onChange);
    this.listElement.addEventListener("click", this.onClickHandler);
  }
}
new Todo();
