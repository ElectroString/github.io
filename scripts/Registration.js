"use strict";

class Registration {
    /**
     * Constructs a new contact instance
     * @param fullName
     * @param position
     * @param email
     */
    constructor(fullName = "", email = "", position = "") {
        this._fullName = fullName;
        this._email = email;
        this._position = position;
    }

    /**
     * Gets the full name of the contact instance
     * @returns {string}
     */
    get fullName() {
        return this._fullName;
    }

    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get position() {
        return this._position;
    }

    /**
     * Gets the email address of the contact
     * @returns {string}
     */
    get email() {
        return this._email;
    }

    /**
     * Sets the full name of the contact instance
     * @param fullName
     */
    set fullName(fullName) {
        if (typeof fullName !== "string" || fullName.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
    }

    /**
     * Sets the contact number of the contact
     * @param position
     */
    set contactNumber(position) {
        if (typeof position !== "string" || position.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
    }

    set Email(email) {
        const emailRegex = /^[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email: Must be in valid email format");
        }
        this._email = email;
    }

    toString(){
        return `Full Name: ${this._fullName}\nEmail: ${this._email}\nPosition: ${this._position}\n`;
    }

    // Serializes contact details into a string (csv) format suitable for storage
    serialize(){
        if (!this._fullName || !this._email || !this._position) {
            console.error("One or more contact properties are missing or invalid");
            //console.log("Serialization Incomplete")
            return null;
        }
        return `${this._fullName},${this._email},${this._position}`;
    }

    deserialize(data){
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray = data.split(",");
        this._fullName = propertyArray[0];
        this._email = propertyArray[1];
        this._position = propertyArray[2];
    }
}