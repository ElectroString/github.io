"use strict";
export class Opportunity {
    _name;
    _description;
    _date;
    constructor(name, description, date) {
        this._name = name;
        this._description = description;
        this._date = date;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get date() {
        return this._date;
    }
    set name(name) {
        if (name.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
    }
    set description(description) {
        if (description.trim() === "") {
            throw new Error("Invalid description: Must be non-empty string");
        }
    }
    set date(date) {
        if (date.trim() === "") {
            throw new Error("Invalid date: Must be non-empty string");
        }
    }
    toString() {
        return `Name: ${this._name}\nDescription: ${this._description}\nDate: ${this._date}\n`;
    }
    serialize() {
        if (!this._name || !this._description || !this._date) {
            console.error("One or more contact properties are missing or invalid");
            return null;
        }
        return `${this._name},${this._description},${this._date}`;
    }
    deserialize(data) {
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray = data.split(",");
        this._name = propertyArray[0];
        this._description = propertyArray[1];
        this._date = propertyArray[2];
    }
}
//# sourceMappingURL=Opportunity.js.map