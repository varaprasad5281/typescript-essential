// Observer class
class Observer<T> {
  private handlers: {
    next?: (value: T) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  };
  private isUnsubscribed: boolean;
  private _unsubscribe?: () => void;

  constructor(handlers: {
    next?: (value: T) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next(value: T): void {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: Error): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }
      this.unsubscribe();
    }
  }

  complete(): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }
      this.unsubscribe();
    }
  }

  unsubscribe(): void {
    this.isUnsubscribed = true;
    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

// Observable class
class Observable<T> {
  private _subscribe: (observer: Observer<T>) => () => void;

  constructor(subscribe: (observer: Observer<T>) => () => void) {
    this._subscribe = subscribe;
  }

  static from<U>(values: U[]): Observable<U> {
    return new Observable<U>((observer) => {
      values.forEach((value) => observer.next(value));
      observer.complete();
      return () => console.log("Unsubscribed");
    });
  }

  subscribe(obs: {
    next?: (value: T) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): { unsubscribe: () => void } {
    const observer = new Observer(obs);
    observer["_unsubscribe"] = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

// Constants
const HTTP_POST_METHOD = "POST";
const HTTP_GET_METHOD = "GET";

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// User type
interface User {
  name: string;
  age: number;
  roles: string[];
  createdAt: Date;
  isDeleted: boolean;
}

// Request type
interface Request {
  method: string;
  host: string;
  path: string;
  body?: User;
  params?: Record<string, string>;
}

// Response type
interface Response {
  status: number;
}

// Mock user data
const userMock: User = {
  name: "User Name",
  age: 26,
  roles: ["user", "admin"],
  createdAt: new Date(),
  isDeleted: false,
};

// Mock requests
const requestsMock: Request[] = [
  {
    method: HTTP_POST_METHOD,
    host: "service.example",
    path: "user",
    body: userMock,
    params: {},
  },
  {
    method: HTTP_GET_METHOD,
    host: "service.example",
    path: "user",
    params: {
      id: "3f5h67s4s",
    },
  },
];

// Handlers
const handleRequest = (request: Request): Response => {
  console.log("Handling request:", request);
  return { status: HTTP_STATUS_OK };
};

const handleError = (error: Error): Response => {
  console.error("Error occurred:", error.message);
  return { status: HTTP_STATUS_INTERNAL_SERVER_ERROR };
};

const handleComplete = (): void => console.log("Complete");

// Create an observable from mock requests
const requests$ = Observable.from<Request>(requestsMock);

// Subscribe to the observable
const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

// Unsubscribe
subscription.unsubscribe();
