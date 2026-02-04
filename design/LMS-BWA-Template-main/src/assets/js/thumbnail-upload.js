document.addEventListener("DOMContentLoaded", function () {
    const input = document.querySelector(".thumbnail-input");
    const img = document.querySelector(".thumbnail-preview");

    input.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                img.src = e.target.result;
                img.classList.remove("hidden"); // Show the image if it's hidden
            };

            reader.readAsDataURL(file);
        }
    });
});