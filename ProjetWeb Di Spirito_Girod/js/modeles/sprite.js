import { Coordonnee } from "./coordonnee.js"

export class Sprite
{
    //Type de sprite
    #type;
    //Map de jeu
    #map;
    //Coordonnee du sprite sur la map
    #coordonnee;

    /**
     * Constructeur
     * @param {string} type : Type de sprite (MUR, DIAMANT, TERRE, ROCHER, JOUEUR)
     * @param {Map} map: Map de jeu
     * @param {Coordonnee} coordonnee : coordonne du sprite sur la map
     */
    constructor(type, map, coordonnee)
    {
        this.#type = type;
        this.#map = map;
        this.#coordonnee = new Coordonnee(coordonnee);
    }

    set coordonnee(value) { this.#coordonnee.x = value.x; this.#coordonnee.y = value.y; }
    get coordonnee() { return this.#coordonnee; }

    set type(value) { this.#type = value; }
    get type() { return this.#type; }

    get map() { return this.#map; }
}