"use strict";

export class Registration {
    private _fullName: string;
    private _email: string;
    private _position : string;
    /**
     * Constructs a new contact instance
     * @param fullName
     * @param position
     * @param email
     */
    constructor(fullName: string, email: string, position: string) {
        this._fullName = fullName;
        this._email = email;
        this._position = position;
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
    get position(): string {
        return this._position;
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
    set fullName(fullName: string) {
        if (fullName.trim() === "") {
            throw new Error("Invalid full name: Must be non-empty string");
        }
        this._fullName = fullName;
    }

    /**
     * Sets the contact number of the contact
     * @param position
     */
    set position(position: string) {
        if (position.trim() === "") {
            throw new Error("Invalid position: Must be non-empty string");
        }
        this._position = position;
    }

    set Email(email: string) {
        const emailRegex = /^[^\s@]+@[\s@]+.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email: Must be in valid email format");
        }
        this._email = email;
    }

    toString(): string{
        return `Full Name: ${this._fullName}\nEmail: ${this._email}\nPosition: ${this._position}\n`;
    }

    // Serializes contact details into a string (csv) format suitable for storage
    serialize(): string | null{
        if (!this._fullName || !this._email || !this._position) {
            console.error("One or more contact properties are missing or invalid");
            //console.log("Serialization Incomplete")
            return null;
        }
        return `${this._fullName},${this._email},${this._position}`;
    }

    deserialize(data: string): void{
        if (data.split(",").length !== 3) {
            console.error("Invalid data format for deserializing data");
            return;
        }
        const propertyArray: string[] = data.split(",");
        this._fullName = propertyArray[0];
        this._email = propertyArray[1];
        this._position = propertyArray[2];
    }
}