"use strict";

import {LoadHeader} from "./header.js";
type RouteMap = {[key: string]: string};
export class Router {
private routes: RouteMap;
    constructor(routes: RouteMap) {
        this.routes = routes;
        this.init();
    }

    init(): void {
        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });
    }

    navigate(path: string): void {
        location.hash = path;
    }

    loadRoute(path: string): void {
        console.log(`[INFO] Loading route: ${path}`);

        // basePath = "/edit#contact_123456"
        const basePath = path.split("#")[0];
        if (!this.routes[basePath]) {
            console.log(`[WARNING] Route not found: ${basePath}, redirecting to 404`);
            location.hash = "/404";
        }

        console.log(`[INFO] Base Path: ${basePath}`);

        fetch(this.routes[basePath])
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${this.routes[basePath]}`);
                }
                return response.text();
            })
            .then((html) => {
                const mainElement = document.querySelector("main");
                if (mainElement) {
                    mainElement.innerHTML = html;
                } else {
                    console.warn("No <main> element found");
                }
                LoadHeader().then(() => {
                    // Dispatch a custom event to notify that a new route has successfully loaded
                    document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
                });
            })
            .catch((error) => {
                console.error(`[ERROR] Error loading page: ${error}`);
            });
    }

}