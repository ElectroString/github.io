"use strict";

class Event {

    constructor(eventName = "", date = new Date(), location = "", eventCategory = "") {
        this._eventName = eventName;
        this._date = date;
        this._location = location;
        this._eventCategory = eventCategory;
    }
    get eventName(){
        return this._eventName;
    }
    get date(){
        return this._date;
    }
    get location(){
        return this._location;
    }
    get eventCategory(){
        return this._eventCategory;
    }
    set eventName(eventName){
        this._eventName = eventName;
    }
    set date(date){
        this._date = date;
    }
    set location(location){
        this._location = location;
    }
    set eventCategory(eventCategory){
        this._eventCategory = eventCategory;
    }
    toString(){
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `${this._eventName} is taking place on ${days[this._date.getDay()]} ${months[this._date.getMonth()]} ${this._date.getDate()} at ${this._location}. Event type: ${this._eventCategory}`;
    }
    serialize(){
        if(!this._eventName || !this._date || !this._location || !this._eventCategory){
            console.error("One or more event properties are missing or invalid");
            return null;
        }
        return `${this.eventName},${this._date.toString()},${this._location},${this._eventCategory}`;
    }
}