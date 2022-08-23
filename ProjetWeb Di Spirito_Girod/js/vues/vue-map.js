import { Observateur } from "../../patterns/observateur.js";
import { Sprite } from "../modeles/sprite.js";


export class VueMap extends Observateur
{
    //controleur
    #controleurMap;

    /**
     * Constructeur
     * @param { ControleurMap } controleurMap: controleur
     */
    constructor(controleurMap)
    {
        super();
        this.#controleurMap = controleurMap;
        this.#controleurMap.ajouterObservateur(this);
        // this.mettreAJour();
        this.afficherMenu();

        document.addEventListener('keydown', (event) => {
            if(event.key == 'd' || event.key == 'D')
                this.#controleurMap.deplacerDroite();
            else if(event.key == 'a' || event.key == 'q' || event.key == 'A' || event.key == 'Q')
                this.#controleurMap.deplacerGauche();
            else if(event.key == 's' || event.key == 'S')
                this.#controleurMap.deplacerBas();
            else if(event.key == 'w' || event.key == 'z' || event.key == 'W' || event.key == 'Z')
                this.#controleurMap.deplacerHaut();
        });
    }

    afficherMenu(){
        //Création du menu
        const titre = document.createElement("h1");
        titre.textContent = "Boulder Dash";

        const start = document.createElement("button");
        start.textContent = "Nouvelle Partie";

        const resume = document.createElement("button");
        resume.textContent = "Reprendre";

        const fileUpload = document.createElement("label");
        fileUpload.innerHTML = "Importer un niveau";
        fileUpload.className = "file-upload";
        const importer = document.createElement("input");
        importer.type = "file";

        //Affichage du menu
        const menu = document.querySelector("menu");
        menu.appendChild(titre);
        menu.appendChild(start);
        menu.appendChild(resume);
        menu.appendChild(fileUpload);
        fileUpload.appendChild(importer);

        //Démarrage d'une partie
        start.addEventListener("click", () => {
            //Création du menu du jeu
            const menu = document.querySelector("menu");
            menu.innerHTML = "";
            const upper_menu = document.createElement("div");
            const restart = document.createElement("button");
            restart.textContent = "Recommencer la partie";
            const exporter = document.createElement("button");
            exporter.textContent = "Exporter";
            const accueil = document.createElement("button");
            accueil.textContent = "Accueil";

            //Affichage du menu du jeu
            upper_menu.appendChild(restart);
            upper_menu.appendChild(exporter);
            upper_menu.appendChild(accueil);
            menu.appendChild(upper_menu);

            restart.addEventListener("click", () => {
                if (confirm ("Voulez-vous recommencer la partie ? ")) {
                    this.#controleurMap.nouvellePartie();
                } 
            });
           
            accueil.addEventListener("click", () => {
                if (confirm("Voulez-vous retourner à l'accueil")) {
                    const mapHTML = document.querySelector("map");
                    mapHTML.innerHTML = "";
                    const compteur = document.querySelector("compteur");
                    compteur.innerHTML = ""; 
                    menu.innerHTML = "";
                    menu.appendChild(titre);
                    menu.appendChild(start);
                    menu.appendChild(resume);
                    menu.appendChild(importer);
                    menu.appendChild(fileUpload);
                } 
            });
            
            exporter.addEventListener("click", () => {
                if (confirm("Voulez-vous sauvegarder votre partie ?")) {
                this.#controleurMap.sauvegarderPartie();

                }
            });
            
            this.#controleurMap.nouvellePartie();
        });
        
        //Reprendre une partie
        resume.addEventListener("click", () => {
            //Création du menu du jeu
            const menu = document.querySelector("menu");
            menu.innerHTML = "";
            const upper_menu = document.createElement("div");
            const restart = document.createElement("button");
            restart.textContent = "Recommencer la partie";
            const exporter = document.createElement("button");
            exporter.textContent = "Exporter";
            const accueil = document.createElement("button");
            accueil.textContent = "Accueil";

            //Affichage du menu du jeu
            upper_menu.appendChild(restart);
            upper_menu.appendChild(exporter);
            upper_menu.appendChild(accueil);
            menu.appendChild(upper_menu);

            restart.addEventListener("click", () => {
                if (confirm ("Voulez-vous recommencer la partie ? ")) {
                    this.#controleurMap.nouvellePartie();
                } 
            });
           
            accueil.addEventListener("click", () => {
                if (confirm("Voulez-vous retourner à l'accueil")) {
                    const mapHTML = document.querySelector("map");
                    mapHTML.innerHTML = "";
                    const compteur = document.querySelector("compteur");
                    compteur.innerHTML = ""; 
                    menu.innerHTML = "";
                    menu.appendChild(titre);
                    menu.appendChild(start);
                    menu.appendChild(resume);
                    menu.appendChild(importer);
                    menu.appendChild(fileUpload);
                } 
            });
            
            exporter.addEventListener("click", () => {
                if (confirm("Voulez-vous sauvegarder votre partie ?")) {
                    this.#controleurMap.sauvegarderPartie();
                }
            });
            this.#controleurMap.reprendrePartie();
        });
        
        //Importer une partie
        importer.addEventListener("change", (file) => {
            //Création du menu de jeu 
            const menu = document.querySelector("menu");
            menu.innerHTML = "";

            const upper_menu = document.createElement("div");
            const restart = document.createElement("button");
            restart.textContent = "Recommencer la partie";

            const accueil = document.createElement("button");
            accueil.textContent = "Accueil";

            const exporter = document.createElement("button");
            exporter.textContent = "Exporter";
            

            //Affichage du menu de jeu 
            upper_menu.appendChild(restart);
            upper_menu.appendChild(exporter);
            upper_menu.appendChild(accueil);
            menu.appendChild(upper_menu);

            let fullPath = importer.value;
            if(fullPath) {
                let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
                let filename = fullPath.substring(startIndex);
                if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
                    filename = filename.substring(1);
                }
                this.#controleurMap.nouvellePartie(filename);
            }


            restart.addEventListener("click", () => {
                if (confirm ("Voulez-vous recommencer la partie ? ")) {
                    this.#controleurMap.nouvellePartie();
                } 
            });
            
            
            
            
            accueil.addEventListener("click", () => {
                if (confirm("Voulez-vous retourner à l'accueil")) {
                    const mapHTML = document.querySelector("map");
                    mapHTML.innerHTML = "";
                    menu.innerHTML = "";
                    const compteur = document.querySelector("compteur");
                    compteur.innerHTML = "";
                    menu.appendChild(titre);
                    menu.appendChild(start);
                    menu.appendChild(resume);
                    menu.appendChild(importer);
                    fileUpload.appendChild(importer);
                    menu.appendChild(fileUpload);
                } 
            });
            
            exporter.addEventListener("click", () => {
                if (confirm("Voulez-vous sauvegarder votre partie ?")) {
                    this.#controleurMap.sauvegarderPartie();
                }
            });
            

        });
        

    }

    /**
     * Affiche la map dans l'état actuel
     */
    afficherMap()
    {
        //Récupère la balise où représenter la map et vide son contenu
        const mapHTML = document.querySelector("map");
        mapHTML.innerHTML = "";

        //Création des différents affichages 
        const compteur = document.querySelector("compteur");
        const pas = document.createElement("pas");
        const total = document.createElement("nombre");
        compteur.innerHTML = "Diamants collectes :  " + this.#controleurMap.map.diamantCollectes;
        pas.innerHTML = "Nombres de pas : " + this.#controleurMap.map.stepsCounter;
        total.innerHTML = "Nombre total de diamants : " + this.#controleurMap.map.diamantTotal;

        compteur.appendChild(pas);
        compteur.appendChild(total);
       
        //Récupère la map gérer par le controleur
        const map = this.#controleurMap.map;
        
        //Pour chaque ligne de la map...
        map.grille.forEach(ligne =>
        {
            //Création d'une div qui contiendra les cellules de la ligne
            const ligneHTML = document.createElement("div");

            //Pour chaque cellule de la ligne
            ligne.forEach(sprite =>
            {
                //Création d'un div représentant la case de la map
                const carreHTML = document.createElement("div");

                //Si un sprite est présente sur la case (!= null)
                if(sprite)
                    carreHTML.className = sprite.type;

                //Ajout de la case HTML à la ligne HTML
                ligneHTML.appendChild(carreHTML);
            });

            //Ajout de la ligne HTML à la map HTML
            mapHTML.appendChild(ligneHTML);
        });
    }

    /**
     * Actualise la vue
     */
    mettreAJour()
    {
        this.afficherMap();
    }
}