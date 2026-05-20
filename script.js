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
    this.todoLabel = document.querySelector(".todo-item__label");
    this.editButton = document.querySelector(".edit-button");
    this.searchInput = document.getElementById("search-task");
    this.searchButton = document.querySelector(".search-button");

    this.checkboxElement = document.querySelector(".todo-item__checkbox");
    this.state = {
      items: this.getItemsFromLocalStorage(),
    };
    this.render();
    this.events();
    this.init();
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
      .map(({ id, title, isChecked, isEditing }) => {
        return `<li class="todo-item" id=${id}>
               <div class="todo-content">
                 <input type="checkbox" class="todo-item__checkbox" id=${id} ${
          isChecked ? "checked" : ""
        } />
          ${
            isEditing
              ? `<input type="text" class="todo-input" value=${title}/>`
              : `<label class="todo-item__label">${title}</label>`
          }
               </div>
     
               <div class="buttons">
               
                 <button class=${
                   isEditing ? "save-button" : "edit-button"
                 } aria-label="Save" id=${id}>${
          isEditing ? "Save" : ""
        }</button>
                 <button class=${
                   isEditing ? "close-button" : "delete-button"
                 } aria-label=${isEditing ? "Close" : "Delete"}> ${
          isEditing ? "Close" : ""
        }</button>
               </div>
             </li> 
            `;
      })
      .join("");
  }

  addItem(title) {
    this.state.items.push({
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title,
      isChecked: false,
      isEditing: false,
    });
    this.setDataToLocalStorage();
    this.render();
  }

  editTaskHandler(id) {
    this.state.items = this.state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          isEditing: true,
        };
      }
      return item;
    });
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
    console.log(newTaskItem);

    if (newTaskItem.trim().length > 0) {
      this.addItem(newTaskItem);
      this.newTaskValueElement.value = "";
    }
  };

  init() {
    // Добавление слушателя события на Enter
    this.newTaskValueElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && this.newTaskValueElement.value.trim() !== "") {
        console.log(e);
        this.taskFormSubmit(e);
        this.newTaskValueElement.value = ""; // Очистка поля
      }
    });
    // this.searchInput.addEventListener("input", (e) => {
    //   console.log(e.target.value);
    //   const searchTerm = e.target.value.toLowerCase(); // Получаем текст из инпута [1]

    //   // 3. Ищем задачу

    //   if (filteredTasks.length === 0) {
    //     this.render(this.state.items);
    //   } else {
    //     this.render(filteredTasks);
    //   }
    // });
  }

  onSearchHandler(e) {
    e.preventDefault();
    console.log(e.target);
    const qwerty = document.getElementById("search-task").value;
    this.state.items = this.state.items.filter(
      (task) => task.title.toLowerCase().includes(qwerty.toLowerCase()) // Проверяем вхождение
    );
    console.log(this.state.items);

    // if (filteredTasks.length === 0) {
    //   this.searchInput.value = "";
    // } else {
    //   alert("Not found");
    // }
  }

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

  saveInputChange(id) {
    const newTitle = document.querySelector(".todo-input").value;

    const taskIndex = this.state.items.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
      this.state.items[taskIndex].title = newTitle;
      this.state.items = this.state.items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isEditing: false,
          };
        }
        return item;
      });
    }
    this.setDataToLocalStorage();
    this.render();
  }

  onChangeEdit = (e) => {
    if (e.target.matches(".edit-button")) {
      console.log(e.target);
      const itemCheckbox = document.querySelector(".todo-item__checkbox");
      this.editTaskHandler(itemCheckbox.id);
    }
  };

  onChangeSave = (e) => {
    if (e.target.matches(".save-button")) {
      console.log(e.target);
      const itemCheckbox = document.querySelector(".todo-item__checkbox");
      this.saveInputChange(itemCheckbox.id);
    }
  };

  events() {
    this.addButtonElement.addEventListener("click", this.taskFormSubmit);
    this.searchButton.addEventListener("click", this.onSearchHandler);
    this.listElement.addEventListener("change", this.onChange);
    this.listElement.addEventListener("click", this.onClickHandler);
    this.listElement.addEventListener("click", this.onChangeEdit);
    this.listElement.addEventListener("click", this.onChangeSave);
  }
}
new Todo();
