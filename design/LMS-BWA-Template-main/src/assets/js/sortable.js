document.querySelectorAll('.sortable-list').forEach(list => {
    Sortable.create(list, {
        animation: 300,
    });
});