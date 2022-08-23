import { Sprite } from "./sprite.js";

export class Rocher extends Sprite
{
    /**
     * Constructeur
     * @param {Map} map : Map de jeu
     * @param {Coordonnee} coordonnee : Coordonnee du rocher sur la map
     */
    constructor(map, coordonnee)
    {
        super("rocher", map, coordonnee);
    }
}