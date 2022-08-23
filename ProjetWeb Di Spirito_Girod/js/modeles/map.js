import { Coordonnee } from "./coordonnee.js";
import { Diamant } from "./diamant.js";
import { Joueur } from "./joueur.js";
import { Mur } from "./mur.js";
import { Rocher } from "./rocher.js";
import { Terre } from "./terre.js";

export class Map
{
    //Grille de la Map
    #grille;
    //Joueur
    #joueur;
    //Liste des rochers
    #rochers;
    //Compteur de diamants
    #diamantCounter;
    //Compteur de diamants collectés
    #diamantsCollectes;
    //Diamants totals du niveau 
    #diamantTotal;
    //Compteur de pas
    #stepsCounter;
    //Animation du personnage
    #animCounter;
    //Dernier mouvement
    #lastStep;
    //Grille de caractères
    #grilleTexte;
    //Liste des niveaux de base
    #niveaux
    //Numéro du niveau
    #numNiveau

    /**
     * Constructeur
     */
    constructor()
    {
        this.#grille = [];
        this.#grilleTexte = [];
        this.#rochers = [];
        this.#diamantCounter = 0;
        this.#diamantTotal = 0;
        this.#diamantsCollectes = 0;
        this.#stepsCounter = 0;
        this.#animCounter = 0;
        this.#niveaux = [];
        this.#numNiveau = 0;
        this.addFichier('map1.txt');
        this.addFichier('map2.txt');
        this.addFichier('map3.txt');
        this.#lastStep = '';
        this.#joueur = new Joueur(this, new Coordonnee({x: 1, y: 1}));
        this.initialiserGrille();

        this.#grilleTexte = this.#niveaux[this.#numNiveau];
    }

    get grille() { return this.#grille;}
    get diamantTotal() {return this.#diamantTotal;}
    get diamantCollectes() {return this.#diamantsCollectes;}
    get stepsCounter() {return this.#stepsCounter;}

    /**
     * Démarre une nouvelle partie
     */
    nouvellePartie(donnees)
    {
        if(donnees)
        {
            this.#grilleTexte = [];
            let lignes = donnees.match(/[^\r\n]+/g);
            lignes.forEach((ligne, index) => {
                let line = ligne.split('');
                this.#grilleTexte.push(line);
            });
            this.#numNiveau = -1;
        }
        this.#grille = [];
        this.#rochers = [];
        this.#diamantCounter = 0;
        this.#diamantsCollectes = 0;
        this.#diamantTotal = 0;
        this.#stepsCounter = 0;
        this.#animCounter = 0;
        this.#lastStep = '';
        this.#joueur = new Joueur(this, new Coordonnee({x: 1, y: 1}));
        this.initialiserGrille();
        this.placerSprite();
    }

    addFichier(fichier)
    {
        let tab = [];
        let donnees;
        fetch(fichier).then(response => response.text()).then(data => donnees = data).then( () => {
            let lignes = donnees.match(/[^\r\n]+/g);
            lignes.forEach((ligne, index) => {
                let line = ligne.split('');
                tab.push(line);
            });
        });
        this.#niveaux.push(tab);
    }

    /**
     * Initialise la grille avec 32x16 cases vides
     */
    initialiserGrille()
    {
        this.#grille = [];

        for(let iLigne = 0; iLigne < 16; ++iLigne)
        {
            let ligne = [];

            for(let iColonne = 0; iColonne < 32; ++iColonne)
            {
                ligne.push(null);
            }

            this.#grille.push(ligne);
        }
    }

    /**
     * Sauvegarde la partie courante
     */
    sauvegarderPartie() {
        let text = "";
        this.#grille.forEach(ligne => {
            ligne.forEach(sprite => {
                if(sprite === null)
                    text += ' ';
                else if(sprite.type === "diamant")
                    text += 'D';
                else if(sprite.type === "mur")
                    text += 'M';
                else if(sprite.type === "rocher")
                    text += 'R';
                else if(sprite.type === "terre")
                    text += 'T';
                else
                    text += 'P';
            });
            text += '\n';
        });

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "BoulderDash.txt");
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
        localStorage.setItem("BoulderDash.txt", element);
    }

    /**
     * Récupération de la dernière partie joué
     */
    reprendrePartie() {
        var element = document.querySelector('a');
        localStorage.getItem(element);
    }

    /**
     * Place les différents sprites de la map en fonction du fichier .txt
     */
    placerSprite()
    {
        for(let iLigne = 0; iLigne < 16; iLigne++)
        {
            for(let iColonne = 0; iColonne < 32; iColonne++)
            {
                if(this.#grilleTexte[iLigne][iColonne] === ' ')
                {
                    this.#grille[iLigne][iColonne] = null;
                }
                else if(this.#grilleTexte[iLigne][iColonne] === 'D')
                {
                    this.#grille[iLigne][iColonne] = new Diamant(this, new Coordonnee({x: iColonne, y: iLigne}));
                    this.#diamantCounter++;
                    this.#diamantTotal++;
                }
                else if(this.#grilleTexte[iLigne][iColonne] === 'P')
                    this.#grille[iLigne][iColonne] = this.#joueur;
                else if(this.#grilleTexte[iLigne][iColonne] === 'M')
                    this.#grille[iLigne][iColonne] = new Mur(this, new Coordonnee({x: iColonne, y: iLigne}));
                else if(this.#grilleTexte[iLigne][iColonne] === 'R')
                    this.#rochers.push(new Rocher(this, new Coordonnee({x: iColonne, y: iLigne})));
                else if(this.#grilleTexte[iLigne][iColonne] === 'T')
                    this.#grille[iLigne][iColonne] = new Terre(this, new Coordonnee({x: iColonne, y: iLigne}));
                    
            }
        }
        this.#rochers.forEach(rocher => {
            this.#grille[rocher.coordonnee.y][rocher.coordonnee.x] = rocher;
        });
    }

    /**
     * Deplace le joueur vers la droite
     */
    deplacerDroite()
    {
        //Dans le cas où la case de droite est vide
        if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 1] === null)
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x + 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture

           if(this.#lastStep === 'd' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'd';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "droite" + this.#animCounter;
        }
        //Dans le cas où la case de droite est de la terre
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 1].type === "terre")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x + 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'd' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'd';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "droite" + this.#animCounter;
        }
        //Dans le cas où la case de droite est un rocher
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 1].type === "rocher")
        {
            //Si la case à droite du rocher est vide
            if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 2] === null)
            {
                this.#rochers.forEach(rocher => {
                    if(rocher.coordonnee.x === this.#joueur.coordonnee.x + 1 && rocher.coordonnee.y === this.#joueur.coordonnee.y)
                    {
                        rocher.coordonnee = new Coordonnee({x: this.#joueur.coordonnee.x + 2, y: this.#joueur.coordonnee.y});
                        this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 2] = rocher;
                    }
                });
                this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
                this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x + 1, y: this.#joueur.coordonnee.y});
                let coordonnee = this.#joueur.coordonnee;
                this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
                this.#stepsCounter++;
                //On change la texture
               if(this.#lastStep === 'd' && this.#animCounter < 2)
                    this.#animCounter++;
                else
                    this.#animCounter = 0;
                this.#lastStep = 'd';
                this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "droite" + this.#animCounter;
            }
        }
        //Dans le cas où la case de droite est un diamant
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x + 1].type === "diamant")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x + 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'd' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'd';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "droite" + this.#animCounter;

            this.#diamantsCollectes++;
                this.Victoire();
        }
        this.deplacerRocher();
    }        

    /**
     * Deplace le joueur vers la gauche
     */
    deplacerGauche()
    {
        //Dans le cas où la case de gauche est vide
        if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 1] === null)
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x - 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'g' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'g';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "gauche" + this.#animCounter;
        }
        //Dans le cas où la case de gauche est de la terre
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 1].type === "terre")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x - 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'g' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'g';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "gauche" + this.#animCounter;
        }
        //Dans le cas où la case de gauche est un rocher
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 1].type === "rocher")
        {
            //Si la case à gauche du rocher est vide
            if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 2] === null)
            {   
                this.#rochers.forEach(rocher => {
                    if(rocher.coordonnee.x === this.#joueur.coordonnee.x - 1 && rocher.coordonnee.y === this.#joueur.coordonnee.y)
                    {
                        rocher.coordonnee = new Coordonnee({x: this.#joueur.coordonnee.x - 2, y: this.#joueur.coordonnee.y});
                        this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 2] = rocher;
                    }
                });
                this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
                this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x - 1, y: this.#joueur.coordonnee.y});
                let coordonnee = this.#joueur.coordonnee;
                this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
                this.#stepsCounter++;
                //On change la texture
                if(this.#lastStep === 'g' && this.#animCounter < 2)
                    this.#animCounter++;
                else
                    this.#animCounter = 0;
                this.#lastStep = 'g';
                this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "gauche" + this.#animCounter;
            }
        }
        //Dans le cas où la case de gauche est un diamant
        else if(this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x - 1].type === "diamant")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x - 1, y: this.#joueur.coordonnee.y});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'g' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'g';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "gauche" + this.#animCounter;

            this.#diamantsCollectes++;
                this.Victoire();
        }
        this.deplacerRocher();
    }        

    /**
     * Deplace le joueur vers le bas
     */
    deplacerBas()
    {
        //Dans le cas où la case d'en dessous est vide
        if(this.#grille[this.#joueur.coordonnee.y + 1][this.#joueur.coordonnee.x] === null)
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y + 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'b' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'b';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "bas" + this.#animCounter;
        }
        //Dans le cas où la case d'en dessous est de la terre
        else if(this.#grille[this.#joueur.coordonnee.y + 1][this.#joueur.coordonnee.x].type === "terre")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y + 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'b' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'b';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "bas" + this.#animCounter;
        }
        //Dans le cas où la case d'en dessous est un diamant
        else if(this.#grille[this.#joueur.coordonnee.y + 1][this.#joueur.coordonnee.x].type === "diamant")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y + 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'b' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'b';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "bas" + this.#animCounter;

            this.#diamantsCollectes++;
                this.Victoire();
        }
        this.deplacerRocher();
    }

    /**
     * Deplace le joueur vers le haut
     */
     deplacerHaut()
     {
        //Dans le cas où la case du dessus est vide
        if(this.#grille[this.#joueur.coordonnee.y - 1][this.#joueur.coordonnee.x] === null)
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y - 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'h' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'h';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "haut" + this.#animCounter;
        }
        //Dans le cas où la case du dessus est de la terre
        else if(this.#grille[this.#joueur.coordonnee.y - 1][this.#joueur.coordonnee.x].type === "terre")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y - 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'h' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'h';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "haut" + this.#animCounter;
        }
        //Dans le cas où la case du dessus est un diamant
        else if(this.#grille[this.#joueur.coordonnee.y - 1][this.#joueur.coordonnee.x].type === "diamant")
        {
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x] = null;
            this.#joueur.coordonnee = new Coordonnee({x:this.#joueur.coordonnee.x, y: this.#joueur.coordonnee.y - 1});
            let coordonnee = this.#joueur.coordonnee;
            this.#grille[coordonnee.y][coordonnee.x] = this.#joueur;
            this.#diamantsCollectes++;
            this.#stepsCounter++;
            //On change la texture
            if(this.#lastStep === 'h' && this.#animCounter < 2)
                this.#animCounter++;
            else
                this.#animCounter = 0;
            this.#lastStep = 'h';
            this.#grille[this.#joueur.coordonnee.y][this.#joueur.coordonnee.x].type = "haut" + this.#animCounter;
                this.Victoire();
        }
     }

    /**
     * Fonction récursive qui déplace le rocher vers le bas
     */
    deplacerRocher()
    {
        this.#rochers.forEach(rocher => {
            if(this.#grille[rocher.coordonnee.y + 1][rocher.coordonnee.x] === null)
            {
                rocher.coordonnee = new Coordonnee({x: rocher.coordonnee.x, y: rocher.coordonnee.y + 1});
                this.#grille[rocher.coordonnee.y - 1][rocher.coordonnee.x] = null;
                this.#grille[rocher.coordonnee.y][rocher.coordonnee.x] = rocher;
                if(this.#grille[rocher.coordonnee.y + 1][rocher.coordonnee.x] === this.#joueur)
                {
                    this.#grille[rocher.coordonnee.y + 1][rocher.coordonnee.x].type = "mort";
                    this.nouvellePartie();
                }
                return this.deplacerRocher();
            }
        });
        return;
    }


    /**
     * Condition de Victoire
     */
    Victoire(){
        if (this.#diamantTotal == this.#diamantsCollectes){
            if(this.#numNiveau === 0 || this.#numNiveau === 1)
            {
                this.#numNiveau++;
                this.#grilleTexte = this.#niveaux[this.#numNiveau];
                this.nouvellePartie();
            }
            else
            {
                alert("Vous avez gagné !");
                this.#numNiveau = 0;
                this.#grilleTexte = this.#niveaux[this.#numNiveau];
                this.nouvellePartie();
            }
        }
    }
}