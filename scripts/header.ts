"use strict";

/**
 * Loads the navbar into the current page header
 * @returns {Promise<void>}
 */
export async function LoadHeader(): Promise<void> {
    console.log("[INFO] Loading Header...");

    return fetch("../views/components/Header.html")
        .then(response => response.text())
        .then(data => {
            const headerElement = document.querySelector('header');
            if (headerElement) {
                headerElement.innerHTML = data;
                updateActiveNavLink();
            }
        })
        .catch(error => console.error(`[ERROR] Unable to load header: ${error}`));
}

/**
 * Updates the navbar to set the active link to the current page
 */
export function updateActiveNavLink() {
    console.log("[INFO] UpdateActiveNavLink called...");

    // Get the current path
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {

        const linkPath = link.getAttribute("href")?.replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}