class Todo {
  selectors = {
    data: "todo",
  };
  localStorageKey = "item";
  constructor() {
    this.dataElement = document.querySelector(this.selectors.root);
    this.state = {
      items: this.getItemsFromLocalStorage(),
    };
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
}
