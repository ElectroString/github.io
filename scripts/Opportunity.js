"use strict";

class Opportunity {
    /**
     * Constructs a new contact instance
     * @param name
     * @param description
     * @param date
     */
    constructor(name = "", description = "", date = "") {
        this._name = name;
        this._description = description;
        this._date = date;
    }

    /**
     * Gets the full name of the contact instance
     * @returns {string}
     */
    get name() {
        return this._name;
    }

    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get description() {
        return this._description;
    }

    /**
     * Gets the email address of the contact
     * @returns {string}
     */
    get date() {
        return this._date;
    }

    /**
     * Sets the full name of the contact instance
     * @param name
     */
    set name(name) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
    }

    /**
     * Sets the contact number of the contact
     * @param description
     */
    set description(description) {
        if (typeof description !== "string" || description.trim() === "") {
            throw new Error("Invalid description: Must be non-empty string");
        }
    }
    set date(date) {
        if (typeof date !== "string" || date.trim() === "") {
            throw new Error("Invalid date: Must be non-empty string");
        }
    }
    toString(){
        return `Name: ${this._name}\nDescription: ${this._description}\nDate: ${this._date}\n`;
    }

    // Serializes contact details into a string (csv) format suitable for storage
    serialize(){
        if (!this._name || !this._description || !this._date) {
            console.error("One or more contact properties are missing or invalid");
            return null;
        }
        return `${this._name},${this._description},${this._date}`;
    }
    deserialize(data){
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray = data.split(",");
        this._name = propertyArray[0];
        this._description = propertyArray[1];
        this._date = propertyArray[2];
    }
}