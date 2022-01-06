import { Settings } from "./settings";
import { Wheel } from "./wheel";

/**
 * Represents a drawable Wheel
 */
export abstract class DrawableWheel extends Wheel
{
    //Colors used to fill sectors
    protected _sectorColors: string[];
    public get sectorColors(): string[] { return this._sectorColors; }

    //Angle of each sector
    private _sectorAngle : number;
    public get sectorAngle() : number {return this._sectorAngle; }

    //Font size used to display text on sectors
    private _sectorFontSize : number;
    public get sectorFontSize() : number {return this._sectorFontSize; }
    public set sectorFontSize(value : number) { this._sectorFontSize = value; }

    //Number of tick on each sector
    private _tikPerSector: number;
    public get tikPerSector() : number {return this._tikPerSector; }
    public set tikPerSector(value : number) { this._tikPerSector = Math.max(value, 1); }
    
    /**
     * Constructor
     */
    public constructor()
    {
        super();

        this._sectorColors = [];
        this._sectorAngle = Math.PI * 2;
        this._sectorFontSize = 12;
        this._tikPerSector = 1;

        this.setSectorColors();
    }

    /**
     * Sets the settings of the wheel
     * @param settings Settings to apply
     */
    setSettings(settings: Settings)
    {
        super.setSettings(settings);

        this.setSectorColors(settings.colors);
        this._tikPerSector = settings.tickPerSector;
        this._sectorFontSize = settings.fontSize;
    }

    /**
     * Set the values to display on the wheel
     * @param values Values to display
     */
    setValues(values: string[])
    {
        super.setValues(values);

        this.prepare();
    }
    
    /**
     * Sets the colors used to fill the sectors of the wheel
     * @param colors Colors to use
     */
    public setSectorColors(colors: string[] = [])
    {
        this._sectorColors.length = 0;

        if(colors.length && colors[0] !== "")
            this._sectorColors.push(...colors);  
        else
            this._sectorColors.push("#ff8181", "#81dcff", "#81ffa2", "#ffef81", "#ff81ea", "#a681ff", "#ffa74d", "#4be1b8");
    }

    /**
     * Prepares computed data before drawing
     */
    protected prepare()
    {
        this._sectorAngle = (Math.PI * 2) / (this.values.length || 1);
    }

    /**
     * Draws the wheel
     */
    abstract draw(): void;
}