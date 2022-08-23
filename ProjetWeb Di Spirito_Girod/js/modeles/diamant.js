import { Sprite } from "./sprite.js";

export class Diamant extends Sprite
{
    /**
     * Constructeur
     * @param {Map} map : Map de jeu
     * @param {Coordonnee} coordonnee : Coordonnee du diamant sur la map
     */
    constructor(map, coordonnee)
    {
        super("diamant", map, coordonnee);
    }
}