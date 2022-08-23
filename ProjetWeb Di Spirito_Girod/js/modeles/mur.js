import { Sprite } from "./sprite.js";

export class Mur extends Sprite
{
    /**
     * Constructeur
     * @param {Map} map : Map de jeu
     * @param {Coordonnee} coordonnee : Coordonnee du mur sur la map
     */
    constructor(map, coordonnee)
    {
        super("mur", map, coordonnee);
    }
}