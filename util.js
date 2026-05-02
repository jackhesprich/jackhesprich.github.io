let iconGrid = document.querySelector('#iconGrid');

let icons = [
    {
        name: "comics",
        title: "Comics",
        alt: "Comics created by me!"
    },
    {
        name: "design",
        title: "Graphic Design",
        alt: "My graphic design work."
    },
    {
        name: "webdev",
        title: "Website Design & Development",
        alt: "My webdev work."
    },
    {
        name: "character",
        title: "Character Design",
        alt: "My character design work."
    },
    {
        name: "graphics",
        title: "3D Graphics & Shader Programming",
        alt: "My graphics and shader programming work."
    },
    {
        name: "writing",
        title: "Creative Writing",
        alt: "My creative writing."
    },
];

icons.forEach(icon => {
    let htmlString = (
        `<div class="iconContainer" onclick="window.location.href='./portfolio/` + icon.name + `.html'"><h3>` + icon.title + `</h3>`
        + `<div class="icon"><img src="./assets/icons/` + icon.name + `.png" class="iconImg" alt="` + icon.alt + `">`
        + `<img src="./assets/icons/hover/`+ icon.name + `_hover.png" class="hoverImg" alt="` + icon.alt + `"></div></div>`
    );
    iconGrid.innerHTML += htmlString;
});