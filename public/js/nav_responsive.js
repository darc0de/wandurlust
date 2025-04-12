
// handling responsiveness of nav bar
const mediaQueryForNavbar = window.matchMedia('(max-width: 885px)');

const handleScreenChangeForNavbar = (e) => {
    if(e.matches){    
        const inputDiv = document.querySelector('.input-div');
        const overlay = document.querySelector('body #overlay');
        const searchIconNavbarDivBtn = document.querySelector('#search-icon-navbar-div');

        // remove navHomeDiv from navWrapperLogoHome and append just after navWrapperLogoHome
        const navWrapperLogoHome = document.querySelector('.nav-wrapper-logo-home');
        const navHomeDiv = document.querySelector('.nav-home-div'); 
        if(navWrapperLogoHome.contains(navHomeDiv)){
            navWrapperLogoHome.removeChild(navHomeDiv);
        }else{
            navWrapperLogoHome.appendChild(navHomeDiv);
        }
        navWrapperLogoHome.insertAdjacentElement('afterend', navHomeDiv);

        // create navSearchAccountDiv and append child navSearchDiv and navAccountDiv
        const navSearchAccountDiv = document.createElement('div');
        navSearchAccountDiv.classList.add('nav-serach-account-div');
        const navSearchDiv = document.querySelector('.nav-search-div');
        const navAccountDiv = document.querySelector('.nav-account-div');
        navSearchAccountDiv.appendChild(navSearchDiv);
        navSearchAccountDiv.appendChild(navAccountDiv);
        // place navSearchAccountDiv just after navHomeDiv
        document.querySelector(".navbar2").appendChild(navSearchAccountDiv);

    
        navSearchAccountDiv.style.display = "flex";
        navSearchAccountDiv.style.gap = "1rem";

        

        // fuction that show-hide search input according to clicking of search btn 
        const handleSearchToggle = () => {
            console.log("search click");
            inputDiv.classList.toggle("show-hide");
            if(inputDiv.classList.contains("show-hide")){
                inputDiv.style.display = "flex";
                // overlay.style.opacity = "1";
                overlay.style.display = "initial";
                
                overlay.addEventListener('click', () => {
                    inputDiv.style.display = "none";
                    overlay.style.display = "none";
                    // overlay.style.opacity = "1";
                    inputDiv.classList.remove("show-hide");
                });
            }else{
                inputDiv.style.display = "none";
                overlay.style.display = "none";
                // overlay.style.opacity = "1";
            }
        }
        searchIconNavbarDivBtn.addEventListener('click', handleSearchToggle);

    }
}

handleScreenChangeForNavbar(mediaQueryForNavbar);
mediaQueryForNavbar.addEventListener('change', handleScreenChangeForNavbar);

// =================================================== //

const accountOptionsList = document.querySelector(".nav-account-div ul");
const accountIcon = document.querySelector('.account-icon');

accountIcon.addEventListener("click" , () => {
    console.log("clicked");
    accountOptionsList.classList.toggle("nav-account-menu");
    if(accountOptionsList.classList.contains("nav-account-menu")){
        accountOptionsList.style.display = "initial";
        document.addEventListener('click' , (e)=> {

            if( !accountIcon.contains(e.target) && !accountOptionsList.contains(e.traget)){
                accountOptionsList.style.display = "none";
                accountOptionsList.classList.remove("nav-account-menu");
            }
        });
    } else{
        accountOptionsList.style.display = "none";
    }
    
});

