import { Sujet } from "../../patterns/sujet.js";
import { Map } from "./../modeles/map.js"

export class ControleurMap extends Sujet
{
    //Map gérée par le contrôleur
    #map;

    /**
     * Constructeur
     */
    constructor()
    {
        super();
        this.#map = new Map();
    }

    get map() { return this.#map; }

    nouvellePartie(fichier)
    {
        if(fichier)
        {
            let donnees;
            fetch(fichier).then(response => response.text()).then(data => donnees = data).then(() => {
                this.#map.nouvellePartie(donnees);
                this.notifier();
            });
        }
        else
        {
            this.#map.nouvellePartie();
            this.notifier();
        }
    }

    addFichier(fichier)
    {
        this.#map.addFichier(fichier);
        this.notifier;
    }

    sauvegarderPartie()
    {
        this.#map.sauvegarderPartie();
        this.notifier();
    }

    reprendrePartie()
    {
        this.#map.reprendrePartie();
        this.notifier();
    }

    deplacerDroite()
    {
        this.#map.deplacerDroite();
        this.notifier();
    }

    deplacerGauche()
    {
        this.#map.deplacerGauche();
        this.notifier();
    }

    deplacerBas()
    {
        this.#map.deplacerBas();
        this.notifier();
    }

    deplacerHaut()
    {
        this.#map.deplacerHaut();
        this.notifier();
    }

    Victoire()
    {
        this.#map.Victoire();
        this.notifier();
    }
}