{{TOC}}

# 1. Vidéo

Hans Rosling's 200 Countries, 200 Years, 4 Minutes - The Joy of Stats (BBC Four)

<iframe width="560" height="315" src="https://www.youtube.com/embed/jbkSRLYSojo" frameborder="0" allowfullscreen></iframe>

## Données
Les données de cette vidéo sont disponibles sur le site de Gapminder.
Source: https://www.gapminder.org/data/

En fouillant un peu on trouve des documents comportant la liste, pays par pays et année par année, des données dont on a besoin et que l’on peut télécharger au format CSV.

On observe la structure de ces fichiers : quelle est la « clé primaire » ? Comment sont renseignées les données ?

Il faut aussi se procurer la liste des continents, ou la renseigner à la main.

Le nettoyage des données, la jointure etc, sont des opérations délicates. Le résultat est présent ici dans deux fichiers, aux formats CSV (`recent.csv`) et JSON (`by_year.json`). On observe leur format, leur structure.

# 2. Découverte de d3.js

Le site d3js.org montre une panoplie d'exemples. Observer, discuter. L'histoire de D3 est assez intéressante aussi pour nous journalistes et auteurs de logiciels libres.

# 3. Utiliser Github, gists, bl.ocks.org et blockbuilder.org

Pour bien travailler sur le Web il faut en général un serveur, un éditeur de texte, etc. On souhaite aussi conserver une trace (un historique) de tout ce que l'on fait, pouvoir faire des modifications et voir les résultats rapidement.

Une approche est d'utiliser un site comme Github, dans lequel on a pouvoir créer des petits projets qui seront immédiatement visibles, modifiables en ligne, versionnés et archivés.

Sans entrer dans les détails, le mieux est d'essayer tout de go: 
http://blockbuilder.org/

Ce site est connecté à tout l'écosystème de `d3.js`.

Voir ensuite comment créer un compte Github, un gist, et faire le lien entre bl.ocks.org, gists et blockbuilder.

Le bookmarklet s'avèrera très pratique !


# 4. Charger les données dans une page web

Pour charger des données dans une page web, il faut passer par le langage Javascript.

Commençons tout de suite par une structure de page Web classique, contenant deux scripts ([`page1.html`](page1.html)). L’un est d3.js, l’autre un script personnalisable, dans lequel on va pouvoir développer.

Dans ce script, commençons tout de suite par charger nos données :

```
d3.csv('recent.csv', function(data) {
    console.log(data);
});
```

On observe :
1. La page reste vide
2. On ouvre l’inspecteur
3. il faut que `d3.min.js` soit présent
4. Si tout se passe bien, les données apparaissent dans la console.

### Que s’est-il passé ?

#### `d3.csv`
`d3.csv` est une fonction de d3 qui facilite la lecture des fichiers au format CSV.
Elle demande au navigateur de charger le fichier dont on lui a donné l’adresse.
Elle analyse ensuite le contenu du fichier (un long texte avec des virgules et des sauts de ligne), pour le transformer en une structure de données.
Elle appelle ensuite une fonction de rappel.
#### Fonction de rappel
Aussi nommée « callback », cette fonction est appelée une fois que `d3.csv` a fini de charger et d’analyser les données. Elle passe alors cette structure de données comme argument pour notre fonction.
À l’intérieur de la fonction de rappel, la structure de données est accessible via la variable `data`.
La fonction de rappel est ici une « fonction anonyme », elle est définie localement, pour un usage unique.
Cette fonction fait une seule chose : elle envoie la variable reçue à la fonction `console.log`.

On observe les données telles qu’elles sont affichées dans la console.

1. Cela se présente sous la forme d’une liste d’objets Javascript (`object`)
2. Chaque objet est une structure comportant plusieurs attributs, dont les clés sont les années (1950 à 2015); une clé supplémentaire est « Total population ».
3. Les valeurs sont parfois vides (`""`); parfois un nombre entre guillemets (`"23098"`).
4. Quant au champ « Total population », il contient le nom du pays ! C’est parce que notre CSV n’est pas parfaitement normé. On fera un nouvel ajustement.


*À noter : Formats de fichiers.*
- d3 offre des outils pour ouvrir d’autres formats de fichiers pour des données structurées : les principaux sont XML, CSV (et ses variantes TSV de DSV), et JSON. On ne peut pas ouvrir directement un fichier Excel ou LibreOffice.
- Mais ce n’est pas une liste limitative pour autant. Les navigateurs modernes permettent d’ouvrir beaucoup d’autres types de fichiers. Des images bien sûr (avec les technologies SVG ou canvas), mais aussi des fichiers sons ou vidéo, pour faire du traitement ou des visualisations en direct.
- Exemple de traitement d'image : http://bl.ocks.org/mbostock/0d20834e3d5a46138752f86b9b79727e
- Exemple de traitement de son avec Audio API : http://bl.ocks.org/eesur/6ad4ee84c81b664353a7



# 5. Nettoyer et préparer les données

Comme on a vu précédemment, les données initiales étaient fournies sous forme de nombres entre guillemets. Il a fallu convertir ces valeurs en nombres.

Javascript propose plusieurs méthodes pour cela : explicitement `parseInt(x)` retournera le nombre entier indiqué dans la chaîne de caractère `x`, et `parseFloat(x)` la même chose pour un nombre à virgule.

Mais le plus simple est souvent d’utiliser la conversion automatique des types : la notation `+x` transforme la chaîne `x` en nombre.

Commençons par récupérer pour chaque pays, son nom, et sa population la plus récente ([`page2.html`](page2.html)).

Dans la fonction de rappel de `d3.csv`, on va traiter la liste de données `data` avec la méthode `.map()`. Cette méthode emploie une autre fonction de rappel, à laquelle elle passe un par un les objets de notre liste. Et elle compose une autre liste avec les valeurs renvoyées par cette fonction.

```
    data
    .map(function(d) {
        var e = {
            nom: d.key,
            population: +d.population,
        };
        return e;
    });
```

Maintenant que les données sont chargées et analysées, il devient possible d'en faire quelque chose.

Commençons par les trier, puis prendre les dix plus gros pays, et les afficher à l'écran.
```
    data2 = data.sort(function(a,b) {
        return d3.descending(a.population, b.population);
    })
    .slice(0,10)
    .forEach(function(d) {
        d3.select('body')
          .append('p')
          .html(d.nom+': '+d.population);
    })
    ;
```

La fonction de tri est un peu compliquée : elle appelle une fonction de d3 qui renvoie 1, 0 ou -1 selon l'ordre des valeurs qu'on lui passe. C'est l'équivalent de :
```
if (a.population < b.population) return -1;
if (a.population > b.population) return 1;
return 0; // cas de l'égalité entre les deux valeurs
```

Note: On peut remplacer `d3.descending` par `d3.ascending` si on veut trier dans l'ordre croissant.

`.slice(0,10)` nous permet de ne prendre que 10 valeurs en partant de la première (index = 0).

`.forEach(…)` va faire une boucle sur la liste des 10 résultats, et les passer un par à sa fonction de rappel.

Celle-ci utilise `d3.select` pour identifier le `body` de la page Web, lui rajouter un élément `p` (paragraphe), et lui mettre la chaîne de caractères (nom + population) comme contenu HTML.



# 6. Jointure de données (data-binding)

Cette méthode de création de nos éléments visuels (ici, des paragraphes), est un peu fruste. En effet, si on modifie nos données (par exemple en changeant l'année de référence), les paragraphes ne vont pas se modifier…

Or c’est là que `d3` devient puissant : il propose un ensemble de techniques, qui permettent de créer des animations visuelles, ou proposer de l'interaction à l'utilisateur. Et pour cela, il faut tout d'abord lier les données aux éléments visuels.

Cette méthode consiste à remplacer le code précédent par la construction un peu plus abstraite que voici ([`page3.html`](page3.html)).

```
        var pays = d3.select('body')
            .selectAll('p')
            .data(data2);

        var enter = pays
            .enter()
            .append('p');

        enter
            .html(function (d) {
                return d.nom + ': ' + d.population;
            });
```

### Qu'est-ce qui s'est passé ?
- `forEach` a disparu : c'est désormais `d3` qui s'occupe de gérer les listes, les boucles etc.
- `d3.select('body')` est fait au début, et non dans la boucle : on se positionne d'abord sur le « conteneur » dans lequel se trouveront nos éléments représentant les données.
- `.selectAll('p')` demande à `d3` de faire une sélection de tous les paragraphes se trouvant dans notre conteneur. Pour l'instant il n'y en a aucun, notre sélection est purement virtuelle.
- `.data(data2)` relie nos données à cette sélection virtuelle. C'est le _data-binding_ : cela indique à `d3` qu'on veut avoir un élément `p` par élément de la liste de données `data2`.

À partir de là, `d3` crée un objet (que l'on mémorise dans la variable `pays`), qui contient plusieurs sous-sélections. Ces sous-sélections vont nous permettre de synchroniser nos données avec les éléments du graphique.
- `pays`, la sélection initiale des éléments qui sont déjà là (vide);
- `pays.enter()` liste les éléments qui viennent d'arriver et qu'il faut créer;
- `pays.exit()` liste les éléments qui viennent de partir et qu'il faut supprimer.

Pour le moment, nous n'avons que des éléments à créer. (La sélection initiale est vide, et il n'y a aucun élément qui aurait disparu.)

La séquence ci-dessous crée les éléments en question.

```
    pays.enter()
        .append('p')
```

La séquence qui suit applique une fonction de rappel à chacun des éléments. La fonction de rappel reçoit la _donnée associée_ à l'élément, et le résultat est envoyé dans son code HTML.

```
    enter.html(function (d) {
        return d.nom + ': ' + d.population;
    })
```

Le point le plus important est celui-ci : les données sont désormais enregistrées en tant que telles dans les éléments visuels qui les représentent. Le lien créé est solide et permet toutes les manipulations. Et si l'on modifie les données, l'opération `data()` sait conserver ces liaisons.


# 7. Un exemple (simpliste) d'interaction avec les données

Dans cet exemple ([`page4.html`](page4.html)), on modifie simplement la création des éléments `p` :

```
        pays
            .enter()
            .append('p');
            .html(function(d,i) {
               return 'pays numéro ' + i;
            })
            .on('click', function (d) {
                var texte = d.nom + ': ' + d.population;
                alert( texte );
                this.innerHTML = texte;
            });
```

Que s'est-il passé ? Simplement, lors de la création du paragraphe, on lui donne un code HTML qui indique le rang du pays, et on écoute l'événement "click".

Si un click est réalisé, la callback est appelée, elle reçoit comme argument `d`, la donnée associée à l'élément cliqué.
`var texte = d.nom + ': ' + d.population; alert( texte );` montre ces données.

`this` permet de retrouver l'élément lui-même, et de le manipuler avec du Javascript normal. Pour un code plus homogène, on peut remplacer cette ligne par `d3.select(this).html( texte );`

### Observer
Avec l'inspecteur, observer les attributs de nos paragraphes, et retrouver l'endroit où sont enregistrées les données liées aux éléments `p`.


# 8. Visualisation graphique

Après les paragraphes, on va représenter nos données avec des ronds. Pour cela il faut d'abord apprendre à utiliser SVG.

SVG (pour “scalable vector graphics”) est un format similaire à HTML, où l'on trouve des balises emboîtées les unes dans les autres. Ces balises ne représentent pas des paragraphes et des titres, mais des ronds, des traits, des carrés, des surfaces…

Les éléments suivants nous seront utiles :
- `<svg>`: conteneur principal de notre image
- attributs importants: `width`, `height` (largeur et hauteur)
- `<g>`: groupe d'élements, (aussi appelé « couche » ou « calque » dans le langage des logiciel de graphisme)
- attributs importants: `transform: translate(x,y)` (déplacer ce groupe de x pixels vers la droite et y vers le bas, à partir du point (0,0) en haut à gauche).
- `<circle>`: un cercle, ou un disque
- attributs importants: `r` (rayon); `cx, cy` (coordonnées du centre); `fill` (couleur de remplissage); `stroke` (couleur de contour).

SVG en propose bien d'autres : `<line>`: plusieurs points reliés par une ligne, `<rect>`: rectangle (ou carré), etc.

Chaque élément graphique de SVG peut être modifié, déplacé, mis à l'échelle, colorié etc, par simple modification des ses attributs ou de son style CSS.

La [`page5.html`](page5.html) donne un exemple de contenu SVG.

Observer le code et manipuler les attributs des différents éléments dans l'inspecteur pour voir comment ils affectent le graphique.


# 9. Visualisation graphique de nos données

Pour faire un graphique avec nos données, il suffit dès lors de combiner les techniques de data-binding de `d3` avec le format SVG. Ce qui est fait [`page6.html`](page6.html)

```
    <svg width=640 height=400>
        <g transform="translate(320,200)"></g>
    </svg>
```

Ce morceau de notre page Web définit un SVG, avec un calque positionné en son centre.

```
        pays
            .enter()
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', function (d) {
                    return 0.005 * Math.sqrt(d.population);
                })
            .attr('fill', 'transparent')
            .attr('stroke', 'red');
```

Ici au lieu d'ajouter un `p`on ajoute un cercle, dont le rayon est proportionnel à la racine carrée de la population en 2015. On le rend transparent avec une bordure rouge.

Sans aucun changement, le code qui rendait nos paragraphes clicables rend désormais nos ronds clicables : l'interaction avec SVG se programme exactement comme celle avec HTML.

# 10. Les échelles

Un bout du code précédent s'avère particulièrement sale :
`return 0.005 * Math.sqrt(d.population);`

En effet, il présuppose plusieurs choses: 
1. que l'on sait dans quelle étendue se trouvent les valeurs de la population (astuce : quel est le pays le plus peuplé?);
2. Que l'on veut une racine carrée (pour que la surface du disque qui figure une population soit proportionnelle à la population : surface = πr^2^);
3. que l'on sait en combien de pixels on doit transformer chaque valeur.

Mais observons le rôle de ce bout de code : il s'agit de transformer une dimension numérique en une variable visuelle.

Jacques Bertin, le fameux géographe, avait déterminé de façon scientifique l'ensemble des variables visuelles qu'il était possible d'activer sur un graphique.

Ces dimensions sont les suivantes :
- X et Y (les deux dimensions du plan)
- TAILLE
- VALEUR (intensité du clair au foncé)
- GRAIN (texture)
- COULEUR
- ORIENTATION (vers le haut, le bas, angle de 30°…)
- FORME (carré, rond, triangle…)

Le rayon de notre cercle (`r`) correspond à la variable visuelle TAILLE. Le bout de code ci-dessus est une fonction qui permet d'affecter une variable visuelle à une dimension des données.

`d3` généralise ce principe en définissant des _échelles_ (_scales_), qui ont un domaine (en entrée, _domain_) et une étendue (en sortie, _range_), et convertissent donc des information de leur dimension « données » à leur dimension « visuelle ».

Ainsi par exemple on écrirait de préférence ([`page7.html`](page7.html)) :

```
        var rayon =d3.scaleSqrt()
            .domain([ 0, d3.max(data2, function(d) {
                return d.population;
            }) ])
            .range([ 0, 200 ]);
```

et puis, plus bas :
```
           .attr('r', function(d) {
                    return rayon(d.population);
                })
```

Notre graphique est alors défini par des données, qui sont liées à des éléments du SVG (ou du HTML) ; des échelles permettent de définir, pour chaque élément, les variables visuelles qui lui correspondent.

Plusieurs types d'échelles sont proposés de façon standard par `d3`; linéaire, logarithmique, à seuils ; mais aussi des échelles de temps (prenant en compte les jours, mois, heure d'hiver etc), ou encore de couleur, où l'étendue n'est pas un nombre mais un code de couleur HTML.

Une échelle très pratique est `d3.scale.category10()`. On la découvre [`page8.html`](page8.html). Elle prend en domaine n'importe quelle valeur (ici, le nom du pays), et son étendue est une liste de 10 couleurs, qu'elle parcourt dans l'ordre.

```
       var categorie = d3.scaleOrdinal(d3.schemeCategory10);
…/…
       … .attr('r', function (d) {
                    return rayon(d.population);
                })
         .attr('fill', function (d) {
                    return categorie(d.nom);
                })
```

Le code suivant vise à sélectionner les ronds dont le rayon serait au moins de 5 pixels; on filtre donc les données _par rapport à une variable visuelle_:
```
     data2 = data2.filter(function (d) {
                return rayon(d.population) > 5;
            });
```


# 11. Sur ces principes, construisons notre graphique

On voit que la construction du graphique se ramène à deux questions :

Quelles sont les variables visuelles dont nous avons besoin pour la visualisation des pays ? Comment les calculer ?

Comment trouver leurs valeurs ? (Quelles sont les dimensions des données qui leur correspondent ? Comment les récupérer ?)


### Liste des variables visuelles, des données correspondantes, et définition des échelles.
- nom du pays => texte en survol (pas d'échelle)
- population => rayon, échelle en racine carrée
- abscisse => richesse du pays (PIB per capita), échelle logarithmique
- ordonnée => espérance de vie (en années), échelle linéaire


### Liste des dimensions à extraire des données
- nom du pays (placé dans la première colonne du fichier CSV)
- population
- PIB per capita
- espérance de vie

Après une telle analyse, on se rend compte que notre graphique peut être conçu indépendamment des fichiers de données !


# 12. Créer les échelles

Maintenant que nous avons notre liste de données à afficher, et avons extrait les dimensions, nous pouvons créer les échelles pour les transformer en variables visuelles ([`page9.html`](page9.html)).

### nom du pays
=> texte en survol (pas d'échelle)
on utilisera ici simplement un `<title>` en SVG, avec sa syntaxe particulière.

### population
=> rayon, échelle en racine carrée
```
var rayon =d3.scaleSqrt()
    .domain([0, d3.max(data, function (d) {
        return d.pop;
    })])
    .range([0, 200]);
```
### abscisse (x)
=> richesse du pays (PIB per capita), échelle logarithmique
```
var x = d3.scaleLog()
    .domain(d3.extent(data, function (d) {
        return d.richesse;
    }))
    .range([0, 640]);
```
### ordonnée
=> espérance de vie (en années), échelle linéaire
```
var y = d3.scaleLinear()
    .domain(d3.extent(data, function (d) {
        return d.sante;
    }))
    .range([0, 400]);
```

### couleur
```
var categorie = d3.scaleOrdinal(d3.schemeCategory10);
```

On applique alors ces variables visuelles
```
    .attr('cx', function (d) {
            return x(d.richesse);
        })
    .attr('cy', function (d) {
            return y(d.sante);
        })
    .attr('r', function (d) {
            return rayon(d.pop);
        })
    .attr('fill', function (d) {
            return categorie(d.nom);
        })
```

c'est un peu le bazar, mais on retrouve bien nos pays !

Dans la [`page10.html`](page10.html), on fait quelques tout petits ajustements :

On agrandit le SVG et le premier groupe `g` sert à faire des marges de 30px :
```
-    <svg width=640 height=400>
-        <g transform="translate(320,200)"></g>
+    <svg width=680 height=420>
+        <g transform="translate(30,30)"></g>
```

Le rayon des cercles devient moins délirant :
```
          rayon …
-                .range([0, 200]);
+                .range([0, 40]);
```

On inverse la courbe des `y` car en SVG, l'axe des `y` est tourné vers le bas :
```
          y …
-                .range([0, 400]);
+                .range([400, 0]);
```


## 13. Ajout des axes, légendes…

D3 offre un module pour créer les axes ([`page11.html`](page11.html)); cela évite un travail fastidieux, d'autant que ces fonctions utilisent directement les échelles `d3.scale.…` pour avoir les bons réglages !

Référence: [SVG-Axes](https://github.com/d3/d3/wiki/SVG-Axes)


Prévoir le style de nos axes :
```
<style>
        .axis path {
            stroke: black;
            fill: none;
        }
        .tick line {
            stroke: #444;
        }
        .tick text {
            font-size: x-small;
        }
        text {
            font-size: smaller;
        }
</style>
```

créer l'axe des `y`:
```
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(8)
    .orient("left")
```

et l'appliquer sur le graphe
```
.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(yAxis)
```

et pour finir, ajouter et positionner le nom des axes:
```
.append('text')
    .text('PIB par habitant')
    .attr('transform', 'translate(640,-8)')
    .attr('text-anchor', 'end')
```

### 14. Paramétrer le graphe

Essayons maintenant de changer la valeur de la variable `t`: `var t = 1950;` et `var t = 2015;` nous donnent des graphes très différents.

On va rendre cela paramétrable depuis la page ([`page12.html`](page12.html)).

Tout d'abord, cela implique de définir un nouvel « état » de l'information. Le plus simple est que cet état soit défini comme l'état d'un élément de la page. L'élément le plus indiqué est un _slider_ (thermomètre ou tirette).
```
<input type=range value="2015" min="1950" max="2015" step="1">
```
et on lit sa valeur comme suit :
```
d3.select("input[type=range]")[0].value
```

On met tout cela dans deux fonctions qui nous permettent de ne plus nous en soucier. La première, qui ajoute le slider à la page, la seconde qui renvoie sa valeur.

```
d3.select('body')
    .append('div')
    .html('<input type=range value=2015 min=1950 max=2015 step=1>');
function annee() {
    return d3.select("input")[0][0].value;
}
```

Avec un peu de CSS en plus, et une fonction qui relève le changement d'état et l'affiche, on a désormais une tirette qui affiche l'année !

# 15. Reformatage du code

Il s'agit maintenant de mettre à jour les données en fonction de l'année courante.

Pour cela, il faut reprendre tout le code et isoler ce qui sert la première fois (création des bulles), de ce qui sert en permanence (mise en place des variables visuelles de chacun des bulles).

Ce reformatage est une opération moins difficile qu'il n'y paraît, mais il faut bien prendre garde à ne changer que ce qui dot changer. Ici les axes vont rester fixes, les bulles doivent changer de place et de forme, mais conserver la même couleur ([`page13.html`](page13.html)).

Une difficulté particulière est que les années ne possèdent pas toutes des données associées. Il faut donc dans ces cas-là prendre des valeurs proches (nous l'avons fait lors du nettoyage 🌶).

# 16. Animation automatique

En cliquant sur la date, on va déclencher une animation automatique de la barre des dates, qu'on suspendra dès que l'utilisateur recliquera sur la tirette ou sur la date ([`page14.html`](page14.html)).

On en profite pour faire quelques réglages supplémentaires :

- un léger filet blanc autour des ronds (en CSS)
```
circle {
    stroke: white;
    stroke-width: 0.6;
}
```
- on trie les pays par population décroissante, de manière à ce qu'on petit ne soit pas éclipsé par un gros 
```
data.sort(function(a,b) {
    return d3.descending(a.pop, b.pop);
});
```

# 17. Ajout de tooltips

On utilise le plugin `d3-tip` pour créer des bulles au survol ([`page15.html`](page15.html)).
```
<script src="./d3-tip.js"></script>
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return d.nom;
    });
d3.select('svg>g').call(tip);
```

Le code qui le déclenche est ajouté aux bulles après leur création (dans la partie `.enter`) :
```
    pays
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
```


# 18. Ajout d'une ligne de temps

On crée une ligne vide, et une fonction qui lui donne sa forme entre les dates 1960 et 2015 ([`page16.html`](page16.html)). 
```
    d3.select('svg>g')
        .append('path')
        .attr('class', 'timeline');

    function create_line(d) {
        var l = line(d);
        d3.selectAll('path.timeline')
            .transition()
            .attr('d', l(d3.range(1960-1, 2015+1)));
    }
    
    var line = function (d) {
        return d3.line()
            .x(function (t) {
                return x(valeur(d.richesse, t));
            })
            .y(function (t) {
                return y(valeur(d.sante, t));
            })
            .curve(d3.curveBasis);
    }

```

et au survol d'un pays, on appelle cette fonction :
```
    .on('mouseover', function (d) {
        tip.show(d);
        create_line(d);
     })
```

# 19. Toutes les lignes de temps
Une variante consiste à afficher plusieurs lignes de temps, mais si on en met trop ça devient illisible ([`page17.html`](page17.html)).

```
pays.each(create_line);
```

Par contre si on colore les lignes de temps avec la couleur du pays, et si on ajuste le rayon des bulles (`'r': 2.5`), on obtient une visualisation assez intéressante.  ([`page18.html`](page18.html)).

On dispose maintenant d'une base pour tester toutes sortes de designs graphiques et pour interroger nos données.


# 20. Conclusion

Ce parcours dans le code d'un exemple `d3.js` ne fait que montrer une possibilité graphique parmi les très nombreuses offertes par cet outil de programmation.

Le plus important est de comprendre qu'il existe des méthodes de représentation visuelle qui sont fondées scientifiquement, dont on sait qu'elles sont efficaces pour communiquer auprès du public, efficaces aussi pour manipuler les données de façon interactive à l'écran, avec un retour immédiat ; ces approches permettent aussi de trouver de nouvelles intuitions. Un observateur avisé doté des bons outils trouvera de nouvelles questions à se poser, de nouveaux sujets à creuser, de nouvelles représentations à formuler.

La méthodologie et le code vont ensemble, main dans la main, et d3.js est codé de façon à permettre de respecter les bonnes méthodes. Qui plus est, il est assez versatile pour permettre de faire de belles visualisations, sur un plan esthétique.

Par le truchement des formats CSV et SVG, une développeuse, une journaliste et une artiste / graphiste habituée à des outils de dessin vectoriel peut travailler ensemble de façon très fluide et constructive. C'est ce que je vous souhaite !


## Pour aller plus loin

- traitement de données avec D3
  http://learnjsdata.com/
- Gapminder data
  https://www.gapminder.org/data/
- pokeapi
  https://pokeapi.co/
- créer un fichier de données unique avec toutes les années même manquantes
- positionner l'année en bonne vue
- travailler sur les baisses fortes (les mettre en évidence, les relier à l'histoire : guerres, épidémie, famine…)
