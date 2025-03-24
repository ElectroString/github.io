"use strict";
export async function LoadHeader() {
    console.log("[INFO] Loading Header...");
    return fetch("views/components/header.html")
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
export function updateActiveNavLink() {
    console.log("[INFO] UpdateActiveNavLink called...");
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href")?.replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add('active');
        }
        else {
            link.classList.remove('active');
        }
    });
}
//# sourceMappingURL=header.js.map