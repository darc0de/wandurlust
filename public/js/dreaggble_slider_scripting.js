const tabsBox = document.querySelector(".tabs-box");
const arrowIcons = document.querySelectorAll('.arrow i');
const leftArrow = document.querySelector('#left');
const rightArrow = document.querySelector('#right');
// const mediaQuery = window.matchMedia('(max-width: 992px)');

let isDragging = false;
let scrollAmount = 450;

console.log(window.innerWidth);
if(window.innerWidth >= "768" && window.innerWidth <= "992"){
    scrollAmount = 270;
    console.log(scrollAmount);
}
// const handleScreenChange1 = (e) => {
//     (e) => {
//         if(e.matches){
//             console.log("match");
//             scrollAmount = 0;
//         }
//     }
// }

// handleScreenChange1(mediaQuery);

// mediaQuery.addEventListener(
//     'change' , 
//     handleScreenChange1
// );

rightArrow.addEventListener('click', (e) => {
    console.log("right");
    console.log(scrollAmount);
    tabsBox.scrollLeft += scrollAmount;
    handleArrows();
});

leftArrow.addEventListener('click', (e) => {
    console.log(leftArrow.id)
    tabsBox.scrollLeft -= scrollAmount;
    handleArrows();
});

const dragging = (e) => {
    if(!isDragging) return;
    tabsBox.classList.add("dragging");
    tabsBox.scrollLeft -= e.movementX;
};

const dragStop = () => {
    isDragging = false;
    tabsBox.classList.remove("dragging");
};

const handleArrows = () => {
    let scrollLeft = Math.ceil(tabsBox.scrollLeft);
    let maxScroll  = tabsBox.scrollWidth - tabsBox.clientWidth;

    leftArrow.parentElement.style.display = tabsBox.scrollLeft <= 0 ? "none" : "flex";
    rightArrow.parentElement.style.display = scrollLeft >= maxScroll ? "none" : "flex";

};


tabsBox.addEventListener("scroll" , handleArrows);
window.addEventListener("resize", handleArrows);

tabsBox.addEventListener("mousedown", () => isDragging = true);
tabsBox.addEventListener("mouseup", dragStop);
tabsBox.addEventListener("mouseleave", dragStop);

tabsBox.addEventListener( "mousemove", dragging);

tabsBox.addEventListener("wheel", (e) => {
    // prevent vertical scrill
    e.preventDefault();

    // scroll horizontal instead
    tabsBox.scrollLeft += e.deltaY;
});