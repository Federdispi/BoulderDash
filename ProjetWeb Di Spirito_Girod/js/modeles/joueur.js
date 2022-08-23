import { Sprite } from "./sprite.js";

export class Joueur extends Sprite
{
    /**
     * Constructeur
     * @param {Map} map : Map du jeu
     * @param {Coordonnee} coordonnee : Coordonnee du joueur sur la map
     */
    constructor(map, coordonnee)
    {
        super("joueur", map, coordonnee);
    }
}