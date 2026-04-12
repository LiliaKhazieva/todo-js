class Todo {
  localStorageKey = "item";
  constructor() {
    this.dataElement = document.querySelector(".todo");
    this.totalCount = document.querySelector(".todo-length");
    this.checkedCount = document.querySelector(".todo-checked");
    this.listElement = document.querySelector(".todo-list");
    this.itemElement = document.querySelector(".todo-item");
    this.todoInput = document.querySelector(".todo-input");
    this.addButtonElement = document.querySelector(".add-button");
    this.deleteButtonElement = document.querySelector(".delete-button");
    this.newTaskValueElement = document.getElementById("new-task");
    this.todoContentElement = document.querySelector(".todo-content");
    this.todoLabel = document.querySelector(".todo-item__label");
    this.editButton = document.querySelector(".edit-button");

    this.searchInput = document.getElementById("search-task");

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
        if (isEditing === true) {
          return `
           <li class="todo-item" id=${id}>
               <div class="todo-content">
                 <input type="checkbox" class="todo-item__checkbox" id=${id} ${
            isChecked ? "checked" : ""
          } />
                   <input type="text" class="todo-input" value="${title}">
               </div>

               <div class="buttons">
                 <button class="save-button" aria-label="Save" title="Save"  id=${id}>Save</button>
                 <button class="close-button" aria-label="Close" title="Close">x</button>
               </div>
             </li>
            `;
        } else {
          return `
            <li class="todo-item" id=${id}>
               <div class="todo-content">
                 <input type="checkbox" class="todo-item__checkbox" id=${id} ${
            isChecked ? "checked" : ""
          } /> 
      
              <label class="todo-item__label">${title}</label>
               </div>
               <div class="buttons">
                 <button class="edit-button" aria-label="Edit" title="Edit" id=${id}></button>
                 <button class="delete-button" aria-label="Delete" title="Detele"></button>
               </div>
             </li>
         `;
        }
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
          isEditing: !item.isEditing,
        };
      }
      return item;
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
    } else {
      alert("Поле не может быть пустым. Введите значение");
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
    this.searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase(); // Получаем текст из инпута [1]

      // 3. Ищем задачу
      const filteredTasks = this.state.items.filter(
        (task) => task.title.toLowerCase().includes(searchTerm) // Проверяем вхождение
      );
      if (filteredTasks.length === 0) {
        this.render(this.state.items);
      } else {
        this.render(filteredTasks);
      }
    });
  }

  onChange = ({ target }) => {
    if (target.matches(".todo-item__checkbox")) {
      this.toggleHandler(target.id);
    }
  };
  onClickHandler = (e) => {
    if (e.target && e.target.classList.contains("delete-button")) {
      const taskDiv = e.target.closest(".todo-item");
      this.deleteItem(taskDiv.id);
    } else {
      console.log("error");
    }
  };

  saveInputChange(id) {
    const newTitle = document.querySelector(".todo-input").value;
    this.state.items = this.state.items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          title: newTitle,
          isEditing: !item.isEditing,
        };
      }
      return item;
    });
    this.setDataToLocalStorage();
    this.render();
  }

  onChangeEdit = (e) => {
    if (e.target && e.target.classList.contains(".buttons")) {
      // const taskDiv = e.target.closest(".buttons");
      console.log("success");
      // this.editTaskHandler(taskDiv.id);
    } else {
      console.log("error");
    }
  };

  onChangeSave = (e) => {
    if (e.target.matches(".save-button")) {
      const itemCheckbox = document.querySelector(".todo-item__checkbox");
      this.saveInputChange(itemCheckbox.id);
    }
  };

  onClose = (e) => {
    if (e.target && e.target.classList.contains("close-button")) {
      const taskDiv = e.target.closest(".todo-item");
      this.editTaskHandler(taskDiv.id);
    } else {
      console.log("error");
    }
  };

  events() {
    this.addButtonElement.addEventListener("click", this.taskFormSubmit);
    this.listElement.addEventListener("change", this.onChange);
    this.listElement.addEventListener("click", this.onClickHandler);
    this.listElement.addEventListener("click", this.onClose);
    this.listElement.addEventListener("click", this.onClose);
    this.listElement.addEventListener("click", (e) => {
      console.log(e.target);

      if (e.target && e.target.classList.contains("edit-button")) {
        const taskDiv = e.target.closest(".todo-item");
        this.editTaskHandler(taskDiv.id);
      } else {
        console.log("error");
      }
      // this.onChangeEdit;
    });
    this.listElement.addEventListener("click", (e) => {
      console.log(e.target);

      if (e.target && e.target.classList.contains("save-button")) {
        const taskDiv = e.target.closest(".todo-item");
        this.saveInputChange(taskDiv.id);
      } else {
        console.log("error");
      }
      // this.onChangeEdit;
    });
  }
}
new Todo();
