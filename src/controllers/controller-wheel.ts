import { Notifier } from "../patterns/notifier";
import { DrawableWheel } from "../models/drawable-wheel";
import { DrawableWheelFactory } from "../models/drawable-wheel-factory";
import { Settings } from "../models/settings";

/**
 * Main controller of the application
 */
export class ControllerWheel extends Notifier
{
    //The wheel of the application
    private _wheel : DrawableWheel | null;
    public get wheel() : DrawableWheel | null {return this._wheel; }

    //Settings of the application
    private _settings : Settings;
    public get settings() : Settings {return this._settings; }
    
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._wheel = null;
        this._settings = {
            colors: [],
            minSpeed: 2000,
            randomSpeed: 5000,
            players: [],
            presents: [],
            tickPerSector: 10,
            fontSize: 12
        };
        
        this.loadSettings();
    }

    /**
     * Init the wheel
     * @param wheelFactory 
     */
    initWheel(wheelFactory: DrawableWheelFactory)
    {
        this._wheel = wheelFactory.createWheel();
        this._wheel.setSettings(this._settings);
        this.notify();
    }

    /**
     * Load settings from local storage
     */
    loadSettings()
    {
        const data = localStorage.getItem("lmd-wheel-settings");

        if(data)
            this._settings = JSON.parse(data);        
    }

    /**
     * Saves current settings to the local storage
     */
    saveSettings()
    {
        localStorage.setItem("lmd-wheel-settings", JSON.stringify(this._settings));
    }

    /**
     * Updates the current settings
     * @param settings New settings to be applied
     */
    updateSettings(settings: Settings)
    {
        this._settings = settings;
        this.saveSettings();

        console.log(settings);
        this._wheel?.setSettings(this._settings);
        this.notify();
    }

    /**
     * Defines the values of the wheel
     * @param values Values to display on the wheel
     */
    setValues(values: string[])
    {
        this._wheel?.setValues(values);
    }
}