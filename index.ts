// Observer interface
interface Observer {
  update(data: any): void;
}

// Observable (Subject) class
class Observable {
  private observers: Observer[] = [];

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// Request type definition
interface Request {
  id: number;
  type: string;
  payload: Record<string, any>;
}

// User type definition
interface User {
  id: number;
  name: string;
  email: string;
}

// Concrete Observer: Logger
class Logger implements Observer {
  update(data: Request): void {
    console.log(`Logger received request: ID=${data.id}, Type=${data.type}`);
  }
}

// Concrete Observer: Notifier
class Notifier implements Observer {
  update(data: Request): void {
    console.log(
      `Notifier received request: Notifying users about request ID=${data.id}`
    );
  }
}

// Usage example
const requestObservable = new Observable();

const logger = new Logger();
const notifier = new Notifier();

requestObservable.addObserver(logger);
requestObservable.addObserver(notifier);

// Example Request
const newRequest: Request = {
  id: 1,
  type: "API_CALL",
  payload: { message: "Fetch user data" },
};

// Notify observers
requestObservable.notifyObservers(newRequest);
