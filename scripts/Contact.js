"use strict";
export class Contact {
    _fullName;
    _contactNumber;
    _email;
    constructor(fullName, contactNumber, email) {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._email = email;
    }
    get fullName() {
        return this._fullName;
    }
    get contactNumber() {
        return this._contactNumber;
    }
    get email() {
        return this._email;
    }
    set fullName(fullName) {
        if (fullName.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
        this._fullName = fullName;
    }
    set contactNumber(contactNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid contact number: Must be 10 digit number in the form of 555-555-5555");
        }
        this._contactNumber = contactNumber;
    }
    set Email(email) {
        const emailRegex = /^[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email: Must be in valid email format");
        }
        this._email = email;
    }
    toString() {
        return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail: ${this._email}\n`;
    }
    serialize() {
        if (!this._fullName || !this._email || !this._contactNumber) {
            console.error("One or more contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this.contactNumber},${this.email}`;
    }
    deserialize(data) {
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray = data.split(",");
        this._fullName = propertyArray[0];
        this._contactNumber = propertyArray[1];
        this._email = propertyArray[2];
    }
}
//# sourceMappingURL=Contact.js.map