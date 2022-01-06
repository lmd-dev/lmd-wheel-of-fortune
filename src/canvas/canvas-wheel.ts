import { DrawableWheel } from "../models/drawable-wheel";

/**
 * Represents a wheel drawable on a canvas
 */
export class CanvasWheel extends DrawableWheel
{
    //Context to use to draw the wheel
    private _ctx: CanvasRenderingContext2D;
    public get ctx(): CanvasRenderingContext2D { return this._ctx; }

    /**
     * Constructor
     * @param canvasContext 2d Context to use to draw the wheel
     */
    constructor(canvasContext: CanvasRenderingContext2D)
    {
        super();

        this._ctx = canvasContext;
    }

    /**
     * Draws the wheel
     */
    draw()
    {
        this.ctx.font = `${this.sectorFontSize}px Arial`;
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";

        this.drawBackground();

        this.ctx.save();

        const startSectorOffset = (this.values.length === 1 ? Math.PI : -Math.PI / 2);

        this.ctx.rotate(this.angle + startSectorOffset);

        for (let iSector = 0; iSector < this.values.length; ++iSector)
        {
            this.ctx.save();
            this.ctx.rotate(this.sectorAngle * iSector);

            this.drawSector(iSector);

            this.ctx.restore();
        }

        this.ctx.beginPath();
        this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "#000";
        this.ctx.fillStyle = "#eddba8";
        this.ctx.fill();

        this.ctx.restore();

        this.drawArrow();
    }

    /**
     * Draws the background of the wheel (to have a shadow on the back)
     */
    drawBackground()
    {
        this.ctx.save();

        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "#000";
        this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#eddba8";
        this.ctx.fill();

        this.ctx.restore();
    }

    /**
     * Draws a sector of the wheel
     * @param iSector Index of the sector to draw
     */
    drawSector(iSector: number)
    {
        this.ctx.beginPath();

        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.radius, 0);
        this.ctx.arc(0, 0, this.radius, 0, this.sectorAngle);

        this.ctx.rotate(this.sectorAngle);
        this.ctx.moveTo(this.radius, 0);
        this.ctx.lineTo(0, 0);

        let iColor = iSector % this.sectorColors.length;
        if(iSector !== 0 && iSector === this.values.length - 1 && iColor === 0 && this.sectorColors.length > 1)
            ++iColor;

        this.ctx.fillStyle = this.sectorColors[iColor];
        this.ctx.fill();
        this.ctx.stroke();

        //Tik tik tik
        const tikAngle = this.sectorAngle / this.tikPerSector;
        for (let iTik = 0; iTik < this.tikPerSector; ++iTik)
        {
            this.ctx.rotate(-tikAngle);
            this.ctx.beginPath()
            this.ctx.arc(this.radius - 10, 0, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = "#444444";
            this.ctx.fill();
        }

        this.ctx.rotate(this.sectorAngle / 2);
        this.ctx.fillStyle = "#000";
        const textWidth = this.ctx.measureText(this.values[iSector]).width;

        this.ctx.fillText(this.values[iSector], this.radius / 2, 0);
    }

    /**
     * Draw the tick arrow on the top of the wheel
     */
    drawArrow()
    {
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = "#000";
        this.ctx.fillStyle = "red";
        this.ctx.translate(0, -this.radius + 10);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(10, -20);
        this.ctx.lineTo(-10, -20);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
    }
}