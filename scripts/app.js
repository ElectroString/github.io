"use strict";
// This is here so I can Commit a change

//IIFE  - Immediately Invoked Functional Expression
(function (){

    function DisplayHomePage() {
        console.log("Calling DisplayingHomePage...");

        let opportunitiesButton = document.getElementById("opportunitiesBtn");
        opportunitiesButton.addEventListener("click",function(){
            location.href = "opportunities.html";
        });

        displayStickyFooter()

    }

    function displayStickyFooter() {
        let footerContent = document.getElementsByTagName("footer")[0];
        let footerNavBar = `
<nav class="navbar sticky-bottom bg-body-tertiary ">
  <div class="container-fluid ">
    <a class="navbar-brand" href="../privacyPolicy.html">Privacy Policy</a>
    <a class="navbar-brand" href="../termsOfService.html">Terms of Service</a>
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
        let bugsBTN = document.getElementById("Bugs");
        bugsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Bugs";
        });

        // Animals Registration
        let animalsBTN = document.getElementById("Animals");
        animalsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Animals";
        });
        displayStickyFooter();

        // Plants Registration
        let PlantsBTN = document.getElementById("Plants");
        PlantsBTN.addEventListener("click", function(){
            let modal = document.getElementById("registerModalLabel");
            modal.innerHTML = "Register For Plants";

        });

        let registerBTN = document.getElementById("sendButton");
        registerBTN.addEventListener("click", function(){
            event.preventDefault();
            console.log("In register BTN");
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

    function DisplayEventsPage() {
        console.log("Calling DisplayingEventsPage...");
        let searchBtn = document.getElementById("searchButton");
        let keys = Object.keys(localStorage);
        let searchField = "";
        //console.log(keys);
        for(const key of keys){
            if (key === "search_input"){
                console.log(`Key found ${key}`);
                searchField = localStorage.getItem(key);
            }
        }
        let eventList = document.getElementById("eventList");
        let events = "";
        let eventsArray = [new Event("Fun with Java", new Date("2025-02-04"), "101 Computers road", "Workshop")];
        eventsArray.push(new Event("Beach cleaning", new Date("2025-03-03"), "Rubbish beach", "Cleanup"));
        eventsArray.push(new Event("Charity auction", new Date("2025-03-04"), "Rubbish beach conference hall", "Fundraiser"));
        eventsArray.push(new Event("Fundraising 101", new Date("2025-03-04"), "International Space Station", "Workshop"));
        eventsArray.forEach(updateList);
        if (events === ""){
            events += `<li>No events of the category ${searchField} were found</li>`;
        }
        eventList.innerHTML = events;
        searchBtn.addEventListener("click", function (){
            let key = "search_input";
            let searchCategory = document.getElementById("searchCategory");
            let field = searchCategory.value;
            localStorage.setItem(key, field);
        })
        function updateList(event){
            if(event.eventCategory.toLowerCase().startsWith(searchField.toLowerCase())){
                console.log(`Adding event of category ${event.eventCategory.toLowerCase()} using search input ${searchField.toLowerCase()}`);
                events += `<li>${event.toString()}</li>`;
            }
        }
        displayStickyFooter();
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayingAboutPage...");
        displayStickyFooter();
    }

    function DisplayContactPage(){
        console.log("Calling DisplayContactPage...");
        let sendButton = document.getElementById("sendButton");
        let subscribeBox = document.getElementById("subscribeCheckBox");
        sendButton.addEventListener("click", function(){
            if(subscribeBox.checked){
                let fullName = document.getElementById("fullName");
                let contactNumber = document.getElementById("contactNumber");
                let email = document.getElementById("email");
                let contact = new Contact(fullName.value, contactNumber.value, email.value);
                if(contact.serialize()){
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
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

    // Function run when webpage opens
    function Start() {
        console.log("Starting App...");

        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Opportunities":
                DisplayOpportunitiesPage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Terms of Service":
                DisplayTOSPage();
                break;
            case "Contacts":
                DisplayContactPage();
                break;
            case "Privacy Policy":
                DisplayPrivacyPolicyPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
        }

    }
    window.addEventListener("load",Start);

})()

