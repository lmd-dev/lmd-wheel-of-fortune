import { DrawableWheelFactory } from "../models/drawable-wheel-factory";
import { CanvasWheel } from "./canvas-wheel";
import { DrawableWheel } from "../models/drawable-wheel";

/**
 * Class responsible to create a Wheel drawable on the HTMLCanvas
 */
export class CanvasWheelFactory implements DrawableWheelFactory
{
    //2D Context of the canvas
    private _canvasContext : CanvasRenderingContext2D;
    public get canvasContext() : CanvasRenderingContext2D {return this._canvasContext; }

    /**
     * Constructor
     * @param canvasContext 2D context to use 
     */
    constructor(canvasContext: CanvasRenderingContext2D)
    {
        this._canvasContext = canvasContext;
    }
    
    /**
     * Creates a drawable wheel
     * @returns Created wheel
     */
    createWheel(): DrawableWheel
    {
        return new CanvasWheel(this.canvasContext);
    }
}