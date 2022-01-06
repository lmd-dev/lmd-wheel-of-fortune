import { Settings } from "./settings";

/**
 * Represents a Wheel
 */
export class Wheel
{
    //Radius of the wheel
    private _radius: number;
    public get radius(): number { return this._radius; };
    public set radius(value: number) { this._radius = value; }

    //Values to display on each sector of the wheel
    private _values: string[];
    public get values(): string[] { return this._values; };

    //Min spped of rotation
    private _minSpeed : number;
    public get minSpeed() : number {return this._minSpeed; }
    public set minSpeed(value : number) { this._minSpeed = value; }
    
    //Max random speed of rotation (added to the min speed)
    private _randomSpeed : number;
    public get randomSpeed() : number {return this._randomSpeed; }
    public set randomSpeed(value : number) { this._randomSpeed = value; }
    
    //Current angle of the wheel
    private _angle: number;
    public get angle(): number { return this._angle; };

    //Initial speed of the wheel (when it is launched)
    private _initialSpeed: number;
    public get initialSpeed(): number { return this._initialSpeed; };
    
    //Current speed of the wheel
    private _currentSpeed: number;
    public get currentSpeed(): number { return this._currentSpeed; };
    
    /**
     * Constructor
     */
    constructor()
    {
        this._radius = 150;
        this._values = [];
        this._angle = 0;
        this._initialSpeed = 0;
        this._currentSpeed = 0;
        this._minSpeed = 10000;
        this._randomSpeed = 10000;
    }

    /**
     * Resets wheel position
     */
    reset()
    {
        this._angle = 0;
        this._currentSpeed = 0;
        this._initialSpeed = 0;
    }

    /**
     * Sets properties of the wheel
     * @param settings 
     */
    setSettings(settings: Settings)
    {
        this._minSpeed = settings.minSpeed;
        this._randomSpeed = settings.randomSpeed;
    }

    /**
     * Sets the values to display on the wheel
     * @param values 
     */
    setValues(values: string[])
    {
        this.values.length = 0;
        this.values.push(...values);
    }

    /**
     * Starts the rotation of the wheel
     */
    launch()
    {
        this._initialSpeed = Math.random() * this.randomSpeed + this.minSpeed;
        this._currentSpeed = this._initialSpeed;
    }

    /**
     * Updates the position of the wheel
     * @param elapsedTime Elapsed time (ms) from the last update
     */
    update(elapsedTime: number)
    {
        if(this.initialSpeed > 0 && this.currentSpeed > 0)
        {
            const step = (this.currentSpeed * Math.PI) / (30 * this.initialSpeed);

            this._angle += step;

            this._currentSpeed -= elapsedTime;
        }
    }
}