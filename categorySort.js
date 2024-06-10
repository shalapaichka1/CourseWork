function categorySort() {
    const categoryFilter = document.getElementById('categoryFilter');
    console.log(categoryFilter.value);

    renderOperationsData(categoryFilter.value);
}
