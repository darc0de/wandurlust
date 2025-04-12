// set up responsiveness of website


// const mediaQuery = window.matchMedia('(max-width: 992px)');
const mediaQuerylg = window.matchMedia('(max-width: 992px)');
const mediaQuerysm = window.matchMedia('(max-width: 768px)');

const togglePara = document.querySelector('#toggle-div-p');
const toggleDiv = document.querySelector('.toggle-div');
const toggleBtn = document.querySelector('.toggle-div input');

// turnon toggle btn when it's parenat div toggleDiv clicked
toggleDiv.addEventListener("click", () => {
    console.log("toggle div clicked");
    toggleBtn.checked = !toggleBtn.checked;
});
// preventing double bubbling 
toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops the click from bubbling up to parent
});

const handleScreenChangesm = (e) => {
    if(e.matches){    
        const filterWrapper = document.querySelector('.filters-wrapper');
        const filterDiv = document.querySelector('.filter-div');
        const parentDivFilterToggle = document.createElement('div');

        parentDivFilterToggle.classList.add('parent-div-filter-toggle');
        filterWrapper.insertAdjacentElement('afterend', parentDivFilterToggle);

        parentDivFilterToggle.appendChild(filterDiv);
        parentDivFilterToggle.appendChild(toggleDiv);

        parentDivFilterToggle.style.display = "flex";   
        parentDivFilterToggle.style.marginBottom = "0.3rem";   
        parentDivFilterToggle.style.justifyContent = "space-evenly";   
        parentDivFilterToggle.style.gap = "1rem";   
        toggleDiv.style.textWrap = "no-wrap";   
        document.querySelector('#toggle-div-p').style.textWrap = "no-wrap"; 
        document.querySelector('#toggle-div-p').style.width = "auto"; 
        // toggleDiv.style.minWidth = "15rem";  
    }
}

handleScreenChangesm(mediaQuerysm);
mediaQuerysm.addEventListener('change', handleScreenChangesm);



const handleScreenChangelg = (e) => {
    if(e.matches){    
        togglePara.style.width = "5.4rem";
        togglePara.style.fontSize = "0.85rem";
    }
}

handleScreenChangelg(mediaQuerylg);
mediaQuerylg.addEventListener('change', handleScreenChangelg);



