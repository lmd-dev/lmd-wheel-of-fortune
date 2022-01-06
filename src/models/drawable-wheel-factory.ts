import { DrawableWheel } from "./drawable-wheel";

/**
 * Represents a factory that can create DrawableWheel
 */
export interface DrawableWheelFactory
{
    createWheel(): DrawableWheel;
}