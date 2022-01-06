import { Observer } from "./observer";


export class Notifier
{
    //Observers to notify
    private _observers: Observer[];

    /**
     * Constructor
     */
    constructor()
    {
        this._observers = [];
    }

    /**
     * Adds an observer to the notifier
     * @param observer 
     */
    addObserver(observer: Observer)
    {
        this._observers.push(observer);
    }

    /**
     * Notifies each observer
     */
    notify()
    {
        this._observers.forEach((observer) => { observer.notify(); });
    }
    
}