"use strict";

export class Contact {
    private _fullName: string;
    private _contactNumber: string;
    private _email: string;
    /**
     * Constructs a new contact instance
     * @param fullName
     * @param contactNumber
     * @param email
     */
    constructor(fullName: string, contactNumber: string, email: string) {
        this._fullName = fullName;
        this._contactNumber = contactNumber;
        this._email = email;
    }

    /**
     * Gets the full name of the contact instance
     * @returns {string}
     */
    get fullName(): string {
        return this._fullName;
    }

    /**
     * Gets the contact number of the contact
     * @returns {string}
     */
    get contactNumber(): string {
        return this._contactNumber;
    }

    /**
     * Gets the email address of the contact
     * @returns {string}
     */
    get email(): string {
        return this._email;
    }

    /**
     * Sets the full name of the contact instance
     * @param fullName
     */
    set fullName(fullName) {
        if (fullName.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * Sets the contact number of the contact
     * @param contactNumber
     */
    set contactNumber(contactNumber: string) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(contactNumber)) {
            throw new Error("Invalid contact number: Must be 10 digit number in the form of 555-555-5555");
        }
        this._contactNumber = contactNumber;
    }

    set Email(email: string) {
        const emailRegex = /^[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email: Must be in valid email format");
        }
        this._email = email;
    }

    toString(): string{
        return `Full Name: ${this._fullName}\nContact Number: ${this._contactNumber}\nEmail: ${this._email}\n`;
    }

    serialize(): string | null{
        if (!this._fullName || !this._email || !this._contactNumber) {
            console.error("One or more contact properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this.contactNumber},${this.email}`;
    }

    deserialize(data: string): void{
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