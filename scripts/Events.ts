"use strict";

export class Events {
private _eventName: string;
private _date: string;
private _location: string;
private _eventCategory: string;
    constructor(eventName: string, date: string, location: string, eventCategory: string) {
        this._eventName = eventName;
        this._date = date;
        this._location = location;
        this._eventCategory = eventCategory;
    }

    get eventName(): string{
        return this._eventName;
    }

    get date(): string{
        return this._date;
    }

    get location(): string{
        return this._location;
    }

    get eventCategory(): string{
        return this._eventCategory;
    }

    set eventName(eventName: string){
        this._eventName = eventName;
    }

    set date(date: string){
        this._date = date;
    }

    set location(location: string){
        this._location = location;
    }

    set eventCategory(eventCategory: string){
        this._eventCategory = eventCategory;
    }

    toString(): string{
        const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return `${this._eventName} is open on ${this._date} at ${this._location}. Destination type: ${this._eventCategory}`;
    }

    serialize(): string | null{
        if(!this._eventName || !this._date || !this._location || !this._eventCategory){
            console.error("One or more event properties are missing or invalid");
            return null;
        }
        return `${this.eventName},${this._date.toString()},${this._location},${this._eventCategory}`;
    }
}