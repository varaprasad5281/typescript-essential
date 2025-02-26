"use strict";
// Observable (Subject) class
class Observable {
    constructor() {
        this.observers = [];
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter((obs) => obs !== observer);
    }
    notifyObservers(data) {
        this.observers.forEach((observer) => observer.update(data));
    }
}
// Concrete Observer: Logger
class Logger {
    update(data) {
        console.log(`Logger received request: ID=${data.id}, Type=${data.type}`);
    }
}
// Concrete Observer: Notifier
class Notifier {
    update(data) {
        console.log(`Notifier received request: Notifying users about request ID=${data.id}`);
    }
}
// Usage example
const requestObservable = new Observable();
const logger = new Logger();
const notifier = new Notifier();
requestObservable.addObserver(logger);
requestObservable.addObserver(notifier);
// Example Request
const newRequest = {
    id: 1,
    type: "API_CALL",
    payload: { message: "Fetch user data" },
};
// Notify observers
requestObservable.notifyObservers(newRequest);
