"use strict";
// This is here so I can Commit a change
// API KEY = fsq3AEw+NZgNcEqAQOhibwWKNqqH5p5/TZNPgPXHK870v3w=
//IIFE  - Immediately Invoked Functional Expression
import {LoadHeader, updateActiveNavLink} from "./header.js";
import {Router} from "./router.js";
import {Registration} from "./Registration.js";
import {Opportunity} from "./Opportunity.js";
import {Events} from "./Events.js";
import {Contact} from "./Contact.js";

//import Chart from '../node_modules/chart.js/auto/auto.js'
//import {Chart} from "../node_modules/chart.js/auto/auto.mjs";


const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contacts": "views/pages/Contacts.html",
    "/login": "views/pages/login.html",
    "/privacyPolicy": "views/pages/privacyPolicy.html",
    "/register": "views/pages/register.html",
    "/opportunities": "views/pages/opportunities.html",
    "/termsOfService": "views/pages/termsOfService.html",
    "/statistics": "views/pages/statistics.html",
    "/gallery": "views/pages/gallery.html",
    "/events": "views/pages/events.html",
    "/eventsPlanning": "views/pages/eventsPlanning.html",
    "/404": "views/pages/404.html"
};
const protectedRoutes = [
    "/statistics",
    "/eventsPlanning"
];

const router = new Router(routes);
(function (){
    function CheckLogin(): void {
        console.log("Checking user login status");
        const loginLink = document.getElementById("login") as HTMLAnchorElement;
        if (!loginLink) {
            console.warn("No login link found");
            return;
        }
        const userSession = sessionStorage.getItem("user");
        if (userSession) {
            loginLink.innerHTML = "Log Out";
            loginLink.href = "#";
            loginLink.addEventListener("click", (event) => {
                event.preventDefault();
                sessionStorage.removeItem("user");
                router.loadRoute("/login");
                location.hash = "/login";
            });
            const messageArea = document.getElementById("loginMessage");
            if (messageArea) {
                const userDisplayName = JSON.parse(userSession).displayName;
                messageArea.innerHTML = `Welcome to ${document.title}, ${userDisplayName}!`;
            }
        } else {
            const planningNav = document.getElementById("PlanningNav") as HTMLLIElement;
            planningNav.remove();
            const statisticsNav = document.getElementById("StatisticsNav") as HTMLLIElement;
            statisticsNav.remove();
            const currentPath = location.hash.slice(1) || "/";
            if (protectedRoutes.includes(currentPath)){
                console.warn("Redirecting due to invalid credentials");
                router.loadRoute("/login");
                location.hash = "/login";
            }
        }
    }

    function DisplayLoginPage(){
        console.log("Calling DisplayLoginPage...")
        const messageArea = document.getElementById("messageArea") as HTMLElement;
        const loginButton = document.getElementById("loginButton") as HTMLButtonElement;
        const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement;
        messageArea.style.display = "none";
        if (!loginButton){
            console.error("No login button was found");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const username = (document.getElementById("username") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value.trim();
            try{
                const response = await fetch("Data/Users.json");
                if (!response.ok){
                    throw new Error(`HTTP error: status ${response.status}`);
                }
                const jsonData = await response.json();
                const users = jsonData.users;
                if(!Array.isArray(users)){
                    throw new Error("Data error: data is not in proper format");
                }
                let authenticatedUser = null;
                for (const user of users){
                    if(user.username === username && user.password === password){
                        authenticatedUser = user;
                        break;
                    }
                }
                if (authenticatedUser !== null){
                    sessionStorage.setItem("user", JSON.stringify({
                        "displayName":authenticatedUser.displayName,
                        "emailAddress":authenticatedUser.emailAddress,
                        "username":authenticatedUser.username
                    }));
                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    router.loadRoute("/home");
                    location.hash = "/home";
                }else{
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again.";
                    document.getElementById("username")?.focus();
                    (document.getElementById("username") as HTMLInputElement).select();
                }
            }catch (error){
                console.error(error);
            }
        });
        cancelButton.addEventListener("click", (event) => {
            (document.getElementById("loginForm") as HTMLFormElement).reset();
            location.href = "Index.html";
        })
    }

    function DisplayRegisterPage(){
        console.log("Calling DisplayRegisterPage...")
    }

    function DisplayHomePage() {
        console.log("Calling DisplayingHomePage...");

        let opportunitiesButton = document.getElementById("opportunitiesBtn") as HTMLButtonElement;
        opportunitiesButton.addEventListener("click",function(){
            location.href = "opportunities.html";
        });

        displayStickyFooter()

    }

    async function GetEvents(query: string){
        const apiKey = "fsq3AEw+NZgNcEqAQOhibwWKNqqH5p5/TZNPgPXHK870v3w=";
        const location = (document.getElementById("searchLocation") as HTMLInputElement).value;
        const searchRadius = 60000;
        //const query = document.getElementById("searchCategory").value;
        const open_at = (document.getElementById("searchDate") as HTMLInputElement).value;
        const sort = (document.getElementById("sort") as HTMLInputElement).value;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: apiKey
            }
        };

        let url = `https://api.foursquare.com/v3/places/search?query=${query}&near=${location}&open_at=${open_at}T1400&sort=${sort}`;

        try{
            const response = await fetch(url,options)
            if(!response.ok){
                throw new Error("Failed to fetch event data");
            }

            let results = await response.json();
            results = results.results;
            console.log(results);
            return results;
        }catch(error){
            console.error("Error calling foursquare for event data");
            return null;
            //document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";
        }

    }

    function displayStickyFooter() {
        let footerContent = document.getElementsByTagName("footer")[0];
        let footerNavBar = `
<nav class="navbar sticky-bottom bg-body-tertiary ">
  <div class="container-fluid ">
    <a class="navbar-brand" href="#/privacyPolicy">Privacy Policy</a>
    <a class="navbar-brand" href="#/termsOfService">Terms of Service</a>
  </div>
</nav>
<style>
.sticky-bottom{
position:fixed;
bottom: 0;
}
</style>`;
        footerContent.innerHTML = footerNavBar;
    }

    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayingProductsPage...");
        let opportunity = [new Opportunity("Bugs", "Research Ants", "Jun 21st 2025"),
            new Opportunity("Animals", "Research Wolves", "Nov 31st 2025"),
            new Opportunity("Plants", "Research the Wild Berry", "July 15th 2025")];

        let index = 1;
        let opportunityList = document.getElementById("opportunityList") as HTMLElement;
        let displayData ="";
        for (const OPPORTUNITY of opportunity) {

            displayData +=`<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${OPPORTUNITY.name}</td>
                                    <td>${OPPORTUNITY.description}</td>
                                    <td>${OPPORTUNITY.date}</td>
                                    <td><button class="btn btn-primary registerBtn" data-bs-target="#registerModal" data-bs-toggle="modal" id = "${OPPORTUNITY.name}">Register for ${OPPORTUNITY.name} here!</button></td>
                                    <td></td>
                                 </tr>`;
            index++;
        }
        opportunityList.innerHTML = displayData;

        // Bugs Registration
        let bugsBTN = document.getElementById("Bugs") as HTMLButtonElement;
        bugsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel") as HTMLElement;
            modal.innerHTML = "Register For Bugs";
        });

        // Animals Registration
        let animalsBTN = document.getElementById("Animals") as HTMLButtonElement;
        animalsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel") as HTMLElement;
            modal.innerHTML = "Register For Animals";
        });
        displayStickyFooter();

        // Plants Registration
        let PlantsBTN = document.getElementById("Plants") as HTMLButtonElement;
        PlantsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel") as HTMLElement;
            modal.innerHTML = "Register For Plants";

        });

        let registerBTN = document.getElementById("sendButton") as HTMLButtonElement;
        registerBTN.addEventListener("click", function(event){
            event.preventDefault();
            console.log("In register BTN");
            let fullName = document.getElementById("fullName") as HTMLInputElement;
            let position = document.getElementById("position") as HTMLInputElement;
            let email = document.getElementById("email") as HTMLInputElement;
            let registration = new Registration(fullName.value, email.value, position.value);
            if (registration.serialize()) {
                console.log("IN SERIALIZATION");
                let key = `registration_${Date.now()}`;
                console.log(key);
                localStorage.setItem(key, registration.serialize() as string);
                window.alert("Thank you for Registering!!");
            }
        });
        displayStickyFooter();
    }

    async function DisplayEventsPage() {
        console.log("Calling DisplayingEventsPage...");
        let searchBtn = document.getElementById("searchButton") as HTMLButtonElement;
        let keys = Object.keys(localStorage);
        let searchField = "";
        //console.log(keys);
        for(const key of keys){
            if (key === "search_input"){
                console.log(`Key found ${key}`);
                searchField = localStorage.getItem(key) as string;
                localStorage.removeItem(key);
                break;
            }
        }
        (document.getElementById("searchCategory") as HTMLInputElement).value = searchField;
        let eventList = document.getElementById("eventList") as HTMLElement;
        let events = "";

        let eventsArray = await FormatEvents((document.getElementById("searchCategory") as HTMLInputElement).value);
        console.log("After format Events...")
        console.log(eventsArray);
        eventsArray.forEach(updateList);

        // Update Array
        /*
        let eventsArray = [new Event("Fun with Java", new Date("2025-02-04"), "101 Computers road", "Workshop")];
        eventsArray.push(new Event("Beach cleaning", new Date("2025-03-03"), "Rubbish beach", "Cleanup"));
        eventsArray.push(new Event("Charity auction", new Date("2025-03-04"), "Rubbish beach conference hall", "Fundraiser"));
        eventsArray.push(new Event("Fundraising 101", new Date("2025-03-04"), "International Space Station", "Workshop"));
        eventsArray.forEach(updateList);*/
        if (events === ""){
            // Change to generic Response
            events += `<li>No events of the category ${searchField} were found</li>`;
        }
        eventList.innerHTML = events;

        searchBtn.addEventListener("click", async function (event){
            events = "";
            event.preventDefault();
            let eventsArray = await FormatEvents((document.getElementById("searchCategory") as HTMLInputElement).value);
            eventsArray.forEach(updateList);
            eventList.innerHTML = events;
            /*let key = "search_input";
            let searchCategory = document.getElementById("searchCategory");
            let field = searchCategory.value;
            localStorage.setItem(key, field);*/
        })

        function updateList(event: Events){
            //if(event.eventCategory.toLowerCase().startsWith(searchField.toLowerCase())){
            console.log(`Adding event of category ${event.eventCategory.toLowerCase()} using search input ${searchField.toLowerCase()}`);
            events += `<li>${event.toString()}</li>`;``
            //}
        }
        displayStickyFooter();
    }

    async function FormatEvents(query: string){
        let apiResults = await GetEvents(query);
        console.log(apiResults);
        let eventsArray = [];
        if(apiResults!==null && Array.isArray(apiResults)){
            //
            for(const event of apiResults){
                console.log(event.hours_popular);
                let day = getDay((document.getElementById("searchDate") as HTMLInputElement).value);
                eventsArray.push(new Events(event.name,day,event.location.address,event.categories[0].name));
            }
        }
        console.log(eventsArray);
        return eventsArray;

    }

    function getDay(day: string){
        console.log("Running Get Day...");
        if(day ==="1"){
            return "Monday";
        }
        else if(day==="2"){
            return "Tuesday";
        }
        else if(day==="3"){
            return "Wednesday";
        }
        else if(day==="4"){
            return "Thursday";
        }
        else if(day==="5"){
            return "Friday";
        }
        else if(day==="6"){
            return "Saturday";
        }
        else if(day==="7"){
            return "Sunday";
        }
        else{
            return "not found"
        }
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayingAboutPage...");
        displayStickyFooter();
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContactPage...");
        let sendButton = document.getElementById("sendButton") as HTMLButtonElement;
        let subscribeBox = document.getElementById("subscribeCheckBox") as HTMLInputElement;
        sendButton.addEventListener("click", function(){
            if(subscribeBox.checked){
                let fullName = document.getElementById("fullName") as HTMLInputElement;
                let contactNumber = document.getElementById("contactNumber") as HTMLInputElement;
                let email = document.getElementById("email") as HTMLInputElement;
                let contact = new Contact(fullName.value, contactNumber.value, email.value);
                if(contact.serialize()){
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize() as string);
                }
            }
        });
        const userSession = sessionStorage.getItem("user");
        if (userSession){
            const feedbackForm = document.getElementById("feedback");
            if (feedbackForm) {
                feedbackForm.classList.add("col-lg-6","col-md-10","col-sm-12","mb-4");
                const inputGroup = document.createElement("div");
                inputGroup.classList.add("input-group-text", "mb-3");
                const inputSpan = document.createElement("span");
                inputSpan.classList.add("input-group-text");
                inputSpan.textContent = "Feedback";
                inputGroup.append(inputSpan);
                const inputArea = document.createElement("input");
                inputArea.type = "text";
                inputArea.classList.add("form-control");
                inputArea.id = "feedbackInput";
                inputArea.name = "feedbackInput";
                inputArea.ariaDescription = "Feedback";
                inputArea.ariaLabel = "Feedback";
                inputGroup.append(inputArea);
                feedbackForm.append(inputGroup);
                const submitIcon = "<i class=\"fa-solid fa-paper-plane\"></i>";
                const submitButton = document.createElement("button");
                submitButton.type = "submit";
                submitButton.id = "feedbackSubmit";
                submitButton.name = "feedbackSubmit";
                submitButton.innerHTML = `${submitIcon} Submit`;
                submitButton.classList.add("btn","btn-primary");
                submitButton.addEventListener("click", (event) =>{
                    event.preventDefault();
                    const inputVal = inputArea.value;
                    if (inputVal){
                    const username = JSON.parse(userSession).username;
                    const feedback = JSON.stringify({
                        "username": username,
                        "message": inputArea.value
                    });
                    window.alert(`Feedback sent by ${username}`);
                    } else {
                        window.alert("Input given was blank");
                    }
                });
                feedbackForm.append(submitButton);
                const cancelIcon = "<i class=\"fa-solid fa-ban\"></i>"
                const cancelButton = document.createElement("button");
                cancelButton.type = "reset";
                cancelButton.id = "feedbackCancel";
                cancelButton.name = "feedbackCancel";
                cancelButton.innerHTML = `${cancelIcon} Cancel`;
                cancelButton.classList.add("btn", "btn-warning");
                cancelButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    inputArea.value = "";
                });
                feedbackForm.append(cancelButton);
            } else {
                console.warn("No feedback form found");
            }
        } else{
            console.warn("No user found");
        }
        displayStickyFooter();
    }

    function DisplayTOSPage(){
        console.log("Calling DisplayingTOSPage...");
        displayStickyFooter();
    }

    function DisplayPrivacyPolicyPage(){
        console.log("Calling DisplayingPrivacyPolicyPage...");
        displayStickyFooter();
    }

    async function DisplayGalleryPage(){
        console.log("Calling DisplayingGalleryPage...");
        try{
             fetch('imageLoader.json').then(response => response.json()).then(data => data.forEach((photo: {[key: string]: string}) => {
                        const imgElement = document.createElement('img');
                        imgElement.src = photo.imageUrl;
                        imgElement.alt = photo.description;
                        imgElement.title = photo.title;

                        // Add event listener for the lightbox
                        imgElement.addEventListener('click', () => openLightbox(photo));
                        const gallery = document.getElementById("gallery") as HTMLElement;
                        gallery.appendChild(imgElement);
                    }))
                 .catch(error => console.error('Error loading images:', error));
            const lightbox = document.getElementById('lightbox') as HTMLElement;
            const lightboxImage = document.getElementById('lightbox-image') as HTMLImageElement;
            const lightboxTitle = document.getElementById('lightbox-title') as HTMLElement;
            const lightboxDescription = document.getElementById('lightbox-description') as HTMLElement;
            const closeBtn = document.getElementById('close') as HTMLButtonElement;

            function openLightbox(photo: {[key: string]: string}) {
                lightbox.style.display = 'flex';
                lightboxImage.src = photo.imageUrl;
                lightboxImage.alt = photo.description;
                lightboxTitle.textContent = photo.title;
                lightboxDescription.textContent = photo.description;
            }


            closeBtn.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });


            lightbox.addEventListener('click', (event) => {
                if (event.target === lightbox) {
                    lightbox.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('Error loading gallery:', error);
        }
        displayStickyFooter();
    }// Gallery Code referenced from ChatGPT

    async function DisplayStatisticsPage(){
        console.log("Calling DisplayingStatisticsPage...");
        const ctx = document.getElementById("myChart") as HTMLElement;
        const {Chart} = await import("chart.js"); //
        fetch('monthlyRegistrations.json')
            .then(response => response.json())
            .then((data) => {
                const ctx = document.getElementById("myChart") as HTMLCanvasElement;

                if (!ctx){
                    console.error('Canvas element not found');
                    return;
                }
                const myChart = new Chart(ctx,{
                    type: 'line',
                    data: {
                        labels: data.labels,
                        datasets: [{
                            label: 'Monthly Registrations',
                            //backgroundColor: data.backgroundColor,
                            //borderColor: data.borderColor,
                            data: data.data,
                            //borderWidth: data.borderWidth
                        }]
                    },
                    options: {
                        animations:{
                            tension:{
                                duration: 1000,
                                easing:'linear',
                                from:0.5,
                                to: 0,
                                loop: true
                            }
                        },
                        scales: {
                            y:{
                                beginAtZero: true
                            }
                        }
                    }
                })
            })

    }

    function displayEventsPlanningPage(){
        console.log("Calling DisplayingEventsPlanningPage...");
        let eventsList :string = "";
        let textLine : string = "";
        let eventsText = document.getElementById("eventsPlanningItems") as HTMLElement;
        fetch('Data/eventsPlanning.json')
            .then(response => response.json())
            .then(data => {
                let eventsList = "";  // Initialize the eventsList variable to collect event HTML content
                data.events.forEach((event: { [key: string]: string }) => {  // Access the 'events' property of 'data'
                    let textLine = `<p> Name: ${event.eventName} Location: ${event.Location} Date: ${event.Date} Time: ${event.Time} Description: ${event.Description}</p>`;
                    eventsList += textLine;  // Append each event's HTML to the eventsList string
                });

                // After the loop, you can insert eventsList into the HTML
                const eventsText = document.getElementById('eventsPlanningItems');
                if (eventsText) {
                    eventsText.innerHTML = eventsList;
                }
            })
            .catch(error => console.error('Error loading events:', error));
        eventsText.innerHTML = eventsList;

        document.getElementById("submitButton")?.addEventListener("click", (event) => {
            event.preventDefault();
            if (!(document.getElementById("eventName") as HTMLInputElement).value || !(document.getElementById("Description") as HTMLInputElement).value ||
                !(document.getElementById("Date") as HTMLInputElement).value || !(document.getElementById("Time") as HTMLInputElement).value ||
                !(document.getElementById("Location") as HTMLInputElement).value){
                    window.alert("All fields must be filled out");
                }
            else{
                textLine = `<p> Name: ${(document.getElementById("eventName") as HTMLInputElement).value} Location:
                ${(document.getElementById("Location") as HTMLInputElement).value} Date: ${(document.getElementById("Date") as HTMLInputElement).value} 
                Time: ${(document.getElementById("Time") as HTMLInputElement).value} Description: ${(document.getElementById("Description") as HTMLInputElement).value}</p>`;

                eventsText.innerHTML += textLine;
            }
        });
    }

    function handlePageLogin(path: string) {
        switch (path) {
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            case "/opportunities":
                DisplayOpportunitiesPage();
                break;
            case "/events":
                DisplayEventsPage();
                break;
            case "/contacts":
                DisplayContactPage();
                break;
            case "/termsOfService":
                DisplayTOSPage();
                break;
            case "/privacyPolicy":
                DisplayPrivacyPolicyPage();
                break;
            case "/gallery":
                DisplayGalleryPage();
                break;
            case "/statistics":
                DisplayStatisticsPage();
                break;
            case "/eventsPlanning":
                displayEventsPlanningPage();
                break;
            default:
                console.warn(`[WARNING] Incorrect path: ${path}`);
        }
    }
    function UpdateTitle(path: string){
        switch (path) {
            case "/":
            case "/home":
                document.title = "Home";
                break;
            case "/about":
                document.title = "About";
                break;
            case "/login":
                document.title = "Login";
                break;
            case "/register":
                document.title = "Register";
                break;
            case "/opportunities":
                document.title = "Opportunities";
                break;
            case "/events":
                document.title = "Events";
                break;
            case "/contacts":
                document.title = "Contacts";
                break;
            case "/termsOfService":
                document.title = "Terms of Service";
                break;
            case "/privacyPolicy":
                document.title = "Privacy Policy";
                break;
            case "/gallery":
                document.title = "Gallery";
                break;
            case "/statistics":
                document.title = "Statistics";
                break;
            case "/eventsPlanning":
                document.title = "Events Planning";
                break;
            default:
                console.warn(`[WARNING] Incorrect path: ${path}`);
        }
    }

    document.addEventListener("routeLoaded", (event) => {
        if (!(event instanceof CustomEvent)||typeof event.detail !== 'string'){
            console.warn("Recieved an invalid RouteLoaded event");
            return;
        }
        const newPath = event.detail;
        console.log(`[INFO] New route loaded: ${newPath}`);

        LoadHeader().then(() => {
            UpdateTitle(newPath);
            CheckLogin();
            handlePageLogin(newPath);
        });
    });
    async function Start() {
        console.log("App Starting...");

        // Load header first, then run CheckLogin
        await LoadHeader();
        CheckLogin();
        updateActiveNavLink();

        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
    }
    // Listens for the "load" event, calls the Start function when it does
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})();