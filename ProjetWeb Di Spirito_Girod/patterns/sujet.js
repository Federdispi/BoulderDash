export class Sujet
{
    //Liste d'observateurs
    #observateurs;

    /**
     * Constructeur
     */
    constructor()
    {
        this.#observateurs = [];
    }

    ajouterObservateur(observateur)
    {
        this.#observateurs.push(observateur);
    }

    notifier()
    {
        this.#observateurs.forEach((observateur) => {
            observateur.mettreAJour();
        });
    }
}