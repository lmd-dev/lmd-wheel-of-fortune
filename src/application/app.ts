import { CanvasWheelFactory } from "../canvas/canvas-wheel-factory";
import { ControllerWheel } from "../controllers/controller-wheel";
import { View } from "../views/view";

/**
 * Class responsible ofr the application
 */
class WheelApplication
{
    //Main controller of the application
    private _controller : ControllerWheel;
    public get controller() : ControllerWheel {return this._controller; }
    
    //MAin view of the application
    private _view : View;
    public get view() : View {return this._view; }

    /**
     * Constructor
     */
    constructor()
    {
        this._controller = new ControllerWheel();
        this._view = new View(this.controller);

        this._controller.initWheel(new CanvasWheelFactory(this.view.getCanvasContext()));
    }
}

/**
 * Entry point of the application
 */
window.addEventListener("load", () =>
{
    const app = new WheelApplication();
});

