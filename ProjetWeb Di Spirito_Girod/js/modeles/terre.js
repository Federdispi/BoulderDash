import { Sprite } from "./sprite.js";

export class Terre extends Sprite
{
    /**
     * Constructor
     * @param {Map} map : Map de jeu
     * @param {Coordonnee} coordonnee : Coordonnee de la terre sur la map
     */
    constructor(map, coordonnee)
    {
        super("terre", map, coordonnee);
    }
}