"use strict";
import { LoadHeader, updateActiveNavLink } from "./header.js";
import { Router } from "./router.js";
import { Registration } from "./Registration.js";
import { Opportunity } from "./Opportunity.js";
import { Events } from "./Events.js";
import { Contact } from "./Contact.js";
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
(function () {
    function CheckLogin() {
        console.log("Checking user login status");
        const loginLink = document.getElementById("login");
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
        }
        else {
            const planningNav = document.getElementById("PlanningNav");
            planningNav.remove();
            const statisticsNav = document.getElementById("StatisticsNav");
            statisticsNav.remove();
            const currentPath = location.hash.slice(1) || "/";
            if (protectedRoutes.includes(currentPath)) {
                console.warn("Redirecting due to invalid credentials");
                router.loadRoute("/login");
                location.hash = "/login";
            }
        }
    }
    function DisplayLoginPage() {
        console.log("Calling DisplayLoginPage...");
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        messageArea.style.display = "none";
        if (!loginButton) {
            console.error("No login button was found");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                const response = await fetch("Data/Users.json");
                if (!response.ok) {
                    throw new Error(`HTTP error: status ${response.status}`);
                }
                const jsonData = await response.json();
                const users = jsonData.users;
                if (!Array.isArray(users)) {
                    throw new Error("Data error: data is not in proper format");
                }
                let authenticatedUser = null;
                for (const user of users) {
                    if (user.username === username && user.password === password) {
                        authenticatedUser = user;
                        break;
                    }
                }
                if (authenticatedUser !== null) {
                    sessionStorage.setItem("user", JSON.stringify({
                        "displayName": authenticatedUser.displayName,
                        "emailAddress": authenticatedUser.emailAddress,
                        "username": authenticatedUser.username
                    }));
                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    router.loadRoute("/home");
                    location.hash = "/home";
                }
                else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again.";
                    document.getElementById("username")?.focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error(error);
            }
        });
        cancelButton.addEventListener("click", (event) => {
            document.getElementById("loginForm").reset();
            location.href = "Index.html";
        });
    }
    function DisplayRegisterPage() {
        console.log("Calling DisplayRegisterPage...");
    }
    function DisplayHomePage() {
        console.log("Calling DisplayingHomePage...");
        let opportunitiesButton = document.getElementById("opportunitiesBtn");
        opportunitiesButton.addEventListener("click", function () {
            location.href = "opportunities.html";
        });
        displayStickyFooter();
    }
    async function GetEvents(query) {
        const apiKey = "fsq3AEw+NZgNcEqAQOhibwWKNqqH5p5/TZNPgPXHK870v3w=";
        const location = document.getElementById("searchLocation").value;
        const searchRadius = 60000;
        const open_at = document.getElementById("searchDate").value;
        const sort = document.getElementById("sort").value;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: apiKey
            }
        };
        let url = `https://api.foursquare.com/v3/places/search?query=${query}&near=${location}&open_at=${open_at}T1400&sort=${sort}`;
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error("Failed to fetch event data");
            }
            let results = await response.json();
            results = results.results;
            console.log(results);
            return results;
        }
        catch (error) {
            console.error("Error calling foursquare for event data");
            return null;
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
        let opportunityList = document.getElementById("opportunityList");
        let displayData = "";
        for (const OPPORTUNITY of opportunity) {
            displayData += `<tr>
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
        let bugsBTN = document.getElementById("Bugs");
        bugsBTN.addEventListener("click", function () {
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Bugs";
        });
        let animalsBTN = document.getElementById("Animals");
        animalsBTN.addEventListener("click", function () {
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Animals";
        });
        displayStickyFooter();
        let PlantsBTN = document.getElementById("Plants");
        PlantsBTN.addEventListener("click", function () {
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Plants";
        });
        let registerBTN = document.getElementById("sendButton");
        registerBTN.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("In register BTN");
            let fullName = document.getElementById("fullName");
            let position = document.getElementById("position");
            let email = document.getElementById("email");
            let registration = new Registration(fullName.value, email.value, position.value);
            if (registration.serialize()) {
                console.log("IN SERIALIZATION");
                let key = `registration_${Date.now()}`;
                console.log(key);
                localStorage.setItem(key, registration.serialize());
                window.alert("Thank you for Registering!!");
            }
        });
        displayStickyFooter();
    }
    async function DisplayEventsPage() {
        console.log("Calling DisplayingEventsPage...");
        let searchBtn = document.getElementById("searchButton");
        let keys = Object.keys(localStorage);
        let searchField = "";
        for (const key of keys) {
            if (key === "search_input") {
                console.log(`Key found ${key}`);
                searchField = localStorage.getItem(key);
                localStorage.removeItem(key);
                break;
            }
        }
        document.getElementById("searchCategory").value = searchField;
        let eventList = document.getElementById("eventList");
        let events = "";
        let eventsArray = await FormatEvents(document.getElementById("searchCategory").value);
        console.log("After format Events...");
        console.log(eventsArray);
        eventsArray.forEach(updateList);
        if (events === "") {
            events += `<li>No events of the category ${searchField} were found</li>`;
        }
        eventList.innerHTML = events;
        searchBtn.addEventListener("click", async function (event) {
            events = "";
            event.preventDefault();
            let eventsArray = await FormatEvents(document.getElementById("searchCategory").value);
            eventsArray.forEach(updateList);
            eventList.innerHTML = events;
        });
        function updateList(event) {
            console.log(`Adding event of category ${event.eventCategory.toLowerCase()} using search input ${searchField.toLowerCase()}`);
            events += `<li>${event.toString()}</li>`;
            ``;
        }
        displayStickyFooter();
    }
    async function FormatEvents(query) {
        let apiResults = await GetEvents(query);
        console.log(apiResults);
        let eventsArray = [];
        if (apiResults !== null && Array.isArray(apiResults)) {
            for (const event of apiResults) {
                console.log(event.hours_popular);
                let day = getDay(document.getElementById("searchDate").value);
                eventsArray.push(new Events(event.name, day, event.location.address, event.categories[0].name));
            }
        }
        console.log(eventsArray);
        return eventsArray;
    }
    function getDay(day) {
        console.log("Running Get Day...");
        if (day === "1") {
            return "Monday";
        }
        else if (day === "2") {
            return "Tuesday";
        }
        else if (day === "3") {
            return "Wednesday";
        }
        else if (day === "4") {
            return "Thursday";
        }
        else if (day === "5") {
            return "Friday";
        }
        else if (day === "6") {
            return "Saturday";
        }
        else if (day === "7") {
            return "Sunday";
        }
        else {
            return "not found";
        }
    }
    function DisplayAboutPage() {
        console.log("Calling DisplayingAboutPage...");
        displayStickyFooter();
    }
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");
        let sendButton = document.getElementById("sendButton");
        let subscribeBox = document.getElementById("subscribeCheckBox");
        sendButton.addEventListener("click", function () {
            if (subscribeBox.checked) {
                let fullName = document.getElementById("fullName");
                let contactNumber = document.getElementById("contactNumber");
                let email = document.getElementById("email");
                let contact = new Contact(fullName.value, contactNumber.value, email.value);
                if (contact.serialize()) {
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
        const userSession = sessionStorage.getItem("user");
        if (userSession) {
            const feedbackForm = document.getElementById("feedback");
            if (feedbackForm) {
                feedbackForm.classList.add("col-lg-6", "col-md-10", "col-sm-12", "mb-4");
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
                submitButton.classList.add("btn", "btn-primary");
                submitButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    const inputVal = inputArea.value;
                    if (inputVal) {
                        const username = JSON.parse(userSession).username;
                        const feedback = JSON.stringify({
                            "username": username,
                            "message": inputArea.value
                        });
                        window.alert(`Feedback sent by ${username}`);
                    }
                    else {
                        window.alert("Input given was blank");
                    }
                });
                feedbackForm.append(submitButton);
                const cancelIcon = "<i class=\"fa-solid fa-ban\"></i>";
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
            }
            else {
                console.warn("No feedback form found");
            }
        }
        else {
            console.warn("No user found");
        }
        displayStickyFooter();
    }
    function DisplayTOSPage() {
        console.log("Calling DisplayingTOSPage...");
        displayStickyFooter();
    }
    function DisplayPrivacyPolicyPage() {
        console.log("Calling DisplayingPrivacyPolicyPage...");
        displayStickyFooter();
    }
    async function DisplayGalleryPage() {
        console.log("Calling DisplayingGalleryPage...");
        try {
            fetch('imageLoader.json').then(response => response.json()).then(data => data.forEach((photo) => {
                const imgElement = document.createElement('img');
                imgElement.src = photo.imageUrl;
                imgElement.alt = photo.description;
                imgElement.title = photo.title;
                imgElement.addEventListener('click', () => openLightbox(photo));
                const gallery = document.getElementById("gallery");
                gallery.appendChild(imgElement);
            }))
                .catch(error => console.error('Error loading images:', error));
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            const lightboxTitle = document.getElementById('lightbox-title');
            const lightboxDescription = document.getElementById('lightbox-description');
            const closeBtn = document.getElementById('close');
            function openLightbox(photo) {
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
        }
        catch (error) {
            console.error('Error loading gallery:', error);
        }
        displayStickyFooter();
    }
    async function DisplayStatisticsPage() {
        console.log("Calling DisplayingStatisticsPage...");
        const ctx = document.getElementById("myChart");
        const { Chart } = await import("chart.js");
        fetch('monthlyRegistrations.json')
            .then(response => response.json())
            .then((data) => {
            const ctx = document.getElementById("myChart");
            if (!ctx) {
                console.error('Canvas element not found');
                return;
            }
            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                            label: 'Monthly Registrations',
                            data: data.data,
                        }]
                },
                options: {
                    animations: {
                        tension: {
                            duration: 1000,
                            easing: 'linear',
                            from: 0.5,
                            to: 0,
                            loop: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    }
    function displayEventsPlanningPage() {
        console.log("Calling DisplayingEventsPlanningPage...");
        let eventsList = "";
        let textLine = "";
        let eventsText = document.getElementById("eventsPlanningItems");
        fetch('Data/eventsPlanning.json')
            .then(response => response.json())
            .then(data => {
            let eventsList = "";
            data.events.forEach((event) => {
                let textLine = `<p> Name: ${event.eventName} Location: ${event.Location} Date: ${event.Date} Time: ${event.Time} Description: ${event.Description}</p>`;
                eventsList += textLine;
            });
            const eventsText = document.getElementById('eventsPlanningItems');
            if (eventsText) {
                eventsText.innerHTML = eventsList;
            }
        })
            .catch(error => console.error('Error loading events:', error));
        eventsText.innerHTML = eventsList;
        document.getElementById("submitButton")?.addEventListener("click", (event) => {
            event.preventDefault();
            if (!document.getElementById("eventName").value || !document.getElementById("Description").value ||
                !document.getElementById("Date").value || !document.getElementById("Time").value ||
                !document.getElementById("Location").value) {
                window.alert("All fields must be filled out");
            }
            else {
                textLine = `<p> Name: ${document.getElementById("eventName").value} Location:
                ${document.getElementById("Location").value} Date: ${document.getElementById("Date").value} 
                Time: ${document.getElementById("Time").value} Description: ${document.getElementById("Description").value}</p>`;
                eventsText.innerHTML += textLine;
            }
        });
    }
    function handlePageLogin(path) {
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
    function UpdateTitle(path) {
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
        if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') {
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
        await LoadHeader();
        CheckLogin();
        updateActiveNavLink();
        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})();
//# sourceMappingURL=app.js.map