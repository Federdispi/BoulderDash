import { ControleurMap } from "../controleurs/controleur-map.js";
import { VueMap } from "../vues/vue-map.js";

class Application 
{
    //controleur
    #controleurMap;

    //vue
    #vueMap;

    /**
     * Constructeur
     */
    constructor()
    {
        this.#controleurMap = new ControleurMap();
        this.#vueMap = new VueMap(this.#controleurMap);
    }
}

window.addEventListener('load', function() {
    const app = new Application();
});