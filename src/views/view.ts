import { ControllerWheel } from "../controllers/controller-wheel";
import { Observer } from "../patterns/observer";

/**
 * Main view of the application
 */
export class View implements Observer
{
    //Main controller of the application
    private _controller: ControllerWheel;

    //Canvas used to draw the wheel
    private _canvas: HTMLCanvasElement;

    //Timestamp of the last wheel update
    private _lastUpdate: number;

    //Index of the last listened tick
    private _lastTick: number;

    /**
     * Constructor
     * @param controller 
     */
    constructor(controller: ControllerWheel)
    {
        this._controller = controller;
        this._controller.addObserver(this);

        this._canvas = document.querySelector("canvas") as HTMLCanvasElement;

        if (!this._canvas)
            throw "No canvas found";

        this.resize();
        this.refresh();

        this._lastUpdate = performance.now();
        this._lastTick = -1;

        this.initEvents();

        this.notify();
    }

    /**
     * Notify function of hte view
     */
    notify()
    {
        this.displaySettings();
        this.draw();
    }

    /**
     * Initializes main events of the view
     */
    initEvents()
    {
        window.addEventListener("resize", () => { this.resize(); });
        document.getElementById("btn-launch-wheel")?.addEventListener("click", () => { this.launch(); });
        document.getElementById("btn-settings")?.addEventListener("click", () => { this.openSettings(); });
        document.getElementById("btn-save-settings")?.addEventListener("click", () => { this.saveSettings(); });
        document.getElementById("btn-cancel-settings")?.addEventListener("click", () => { this.closeSettings(); });

        document.getElementById("lstPlayers")?.addEventListener("input", () => { this.setPlayersValues() });
        document.getElementById("lstPresents")?.addEventListener("input", () => { this.setPresentsValues() });

        document.querySelectorAll('input[type="radio"]').forEach((item, index) => {
            item.addEventListener("click", () => {
                if(index === 0)
                {
                    this.setPlayersValues();
                }
                else
                    this.setPresentsValues();
            })
        })
    }

    /**
     * Display settings values
     */
    displaySettings()
    {
        const settings = this._controller.settings;

        (document.getElementById("txt-min-speed") as HTMLInputElement).value = settings.minSpeed.toString(); 
        (document.getElementById("txt-random-speed") as HTMLInputElement).value = settings.randomSpeed.toString(); 
        (document.getElementById("txt-tick-per-sector") as HTMLInputElement).value = settings.tickPerSector.toString(); 
        (document.getElementById("txt-font-size") as HTMLInputElement).value = settings.fontSize.toString(); 
        (document.getElementById("lst-colors") as HTMLTextAreaElement).value = settings.colors.join("\r"); 
        (document.getElementById("lst-players") as HTMLTextAreaElement).value = settings.players.join("\r"); 
        (document.getElementById("lst-presents") as HTMLTextAreaElement).value = settings.presents.join("\r"); 
    }

    /**
     * Save settings
     */
    saveSettings()
    {
        const settings = {
            minSpeed: parseInt((document.getElementById("txt-min-speed") as HTMLInputElement).value), 
            randomSpeed: parseInt((document.getElementById("txt-random-speed") as HTMLInputElement).value), 
            tickPerSector: parseInt((document.getElementById("txt-tick-per-sector") as HTMLInputElement).value),
            fontSize: parseInt((document.getElementById("txt-font-size") as HTMLInputElement).value),
            colors: (document.getElementById("lst-colors") as HTMLTextAreaElement).value.trim().split("\n"),
            players: (document.getElementById("lst-players") as HTMLTextAreaElement).value.trim().split("\n"),
            presents: (document.getElementById("lst-presents") as HTMLTextAreaElement).value.trim().split("\n"),
        }

        this._controller.updateSettings(settings);
        this.closeSettings();
    }

    /**
     * Opens settings dialog
     */
    openSettings()
    {
        (document.getElementById("settings") as HTMLDivElement).classList.add("active");
    }

    /**
     * Closes settings dialog
     */
    closeSettings()
    {
        (document.getElementById("settings") as HTMLDivElement).classList.remove("active");
    }

    /**
     * Gets the 2D context of the canvas
     * @returns 
     */
    getCanvasContext(): CanvasRenderingContext2D
    {
        const canvasContext = this._canvas?.getContext("2d");

        if (!canvasContext)
            throw "No canvas context found.";

        return canvasContext;
    }

    /**
     * Set wheel values from players list
     */
    setPlayersValues()
    {
        if ((document.querySelectorAll('input[type="radio"]')[0] as HTMLInputElement).checked)
        {
            const values = (document.getElementById("lst-players") as HTMLTextAreaElement).value.trim().split("\n");
            this._controller.setValues(values);
            this.saveSettings();
            this.draw();
        }
    }

    /**
     * Set wheel values from presents list
     */
    setPresentsValues()
    {
        if ((document.querySelectorAll('input[type="radio"]')[1] as HTMLInputElement).checked)
        {
            const values = (document.getElementById("lst-presents") as HTMLTextAreaElement).value.trim().split("\n");
            this._controller.setValues(values)
            this.saveSettings();
            this.draw();
        }
    }

    /**
     * Resizes the canvas
     */
    resize()
    {
        this._canvas.width = this._canvas.clientWidth;
        this._canvas.height = this._canvas.clientHeight;
    }

    /**
     * Launch the wheel
     */
    launch()
    {
        if (this._controller.wheel)
        {
            this._lastUpdate = performance.now();
            this._controller.wheel.launch();
        }
    }

    /**
     * Refresh the drawing
     */
    refresh()
    {
        const t = performance.now();
        this._controller.wheel?.update(t - this._lastUpdate);
        this._lastUpdate = t;

        this.draw();

        this.manageAudioTik();

        requestAnimationFrame(() => { this.refresh(); });
    }

    /**
     * Draws the scene
     */
    draw()
    {
        const ctx = this.getCanvasContext();

        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (this._controller.wheel)
        {
            ctx.save();
            ctx.translate(this._canvas.width / 2, this._canvas.height / 2);

            this._controller.wheel.radius = Math.min(this._canvas.width, this._canvas.height) / 2 - 20;
            this._controller.wheel.draw();

            ctx.restore();
        }
    }

    /**
     * Play audio file when new tick is detected
     */
    manageAudioTik()
    {
        if (this._controller.wheel)
        {
            const wheel = this._controller.wheel;

            const angle = wheel.angle + (Math.PI / 2);
            const tikAngle = wheel.sectorAngle / wheel.tikPerSector;

            const newTick = Math.floor(angle / tikAngle);

            if (this._lastTick !== -1)
            {
                if (newTick != this._lastTick)
                {
                    this._lastTick = newTick;
                    (document.querySelector("audio") as HTMLAudioElement).play();
                }
            }
            else
            {
                this._lastTick = newTick;
            }
        }
    }
}