"use strict";
export class Registration {
    _fullName;
    _email;
    _position;
    constructor(fullName, email, position) {
        this._fullName = fullName;
        this._email = email;
        this._position = position;
    }
    get fullName() {
        return this._fullName;
    }
    get position() {
        return this._position;
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
    set position(position) {
        if (position.trim() === "") {
            throw new Error("Invalid position: Must be non-empty string");
        }
        this._position = position;
    }
    set Email(email) {
        const emailRegex = /^[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email: Must be in valid email format");
        }
        this._email = email;
    }
    toString() {
        return `Full Name: ${this._fullName}\nEmail: ${this._email}\nPosition: ${this._position}\n`;
    }
    serialize() {
        if (!this._fullName || !this._email || !this._position) {
            console.error("One or more contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._email},${this._position}`;
    }
    deserialize(data) {
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray = data.split(",");
        this._fullName = propertyArray[0];
        this._email = propertyArray[1];
        this._position = propertyArray[2];
    }
}
//# sourceMappingURL=Registration.js.map