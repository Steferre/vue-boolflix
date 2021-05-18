/*
Milestone 1:
Creare un layout base con una searchbar (un input e un button) in cui possiamo
scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il
bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni
film trovato:
1. Titolo
2. Titolo Originale
3. Lingua
4. Voto
----------------------------------------------------------------------------------------
Milestone 2
Trasformiamo la stringa statica della lingua in una vera e propria bandiera della
nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della
nazione ritornata dall’API (le flag non ci sono in FontAwesome).
Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca
dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando
attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di
risposta diversi, simili ma non sempre identici)
----------------------------------------------------------------------------------------
Milestone 3:
In questa milestone come prima cosa aggiungiamo la copertina del film o della serie
al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo
perché poi potremo generare da quella porzione di URL tante dimensioni diverse.
Dovremo prendere quindi l’URL base delle immagini di TMDB:
https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare
(troviamo tutte le dimensioni possibili a questo link:
https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la
parte finale dell’URL passata dall’API.
Esempio di URL:
https://image.tmdb.org/t/p/w342/wwemzKWzjKYJFfCeiB57q3r4Bcm.png
Trasformiamo poi il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da
permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5,
lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze
piene (o mezze vuote :P)
--------------------------------------------------------------------------------------
Milestone 4:
Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp,
creando un layout completo simil-Netflix:
● Un header che contiene logo e search bar
● Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma
di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio
la poster_path con w342)
● Andando con il mouse sopra una card (on hover), appaiono le informazioni
aggiuntive già prese nei punti precedenti più la overview
*/
const app = new Vue({
    el:'#mainContainer',
    data: {
        userSearch: "",
        filmsList: null,
        seriesList: null,
        fullSerieCast: null,
        urlFirstPart: "https://api.themoviedb.org/3/",
        api_key_path: "?api_key=70420ad26ad9fc16d1d09445d6c02437",
        //firstHalfSrcPath: "https://image.tmdb.org/t/p/w154"
    },
    methods: {
        getNewUrl() {
            let modifiedUrl = `${this.urlFirstPart}search/movie${this.api_key_path}&query=${this.userSearch}`

            console.log(modifiedUrl)

            axios.get(modifiedUrl)
                .then((resp) => {
                    console.log(resp.data.results)

                    this.filmsList = resp.data.results
            })


            let seriesUrl = `${this.urlFirstPart}search/tv${this.api_key_path}&query=${this.userSearch}`
            
            axios.get(seriesUrl)
                .then((resp) => {
                    this.seriesList = resp.data.results
            })

            this.userSearch = ""
        },
        getCountryFlag(target) {
            // faccio un obj mappa che presenta come chiavi le lingue parlate e come valori degli array che contengono
            // i paesi dove viene parlata quella lingua
            const lang_country = {
                'en': ['us','gb','ca'],
                'fr': ['fr','be','lu','ca'],
                'es': ['es','ar','bo','co','mx'],
                'it': ['it'],
                'ru': ['ru'],
                'de': ['de','at'],
                'pt': ['pt','br'],
                'ja': ['jp'],
                'ko': ['kr'],
                'el': ['gr'],
                'sv': ['se']        
            };

            const defaultFlag = "flag-icon-us";
            const language = target.original_language;

            const countryFlag = Object.keys(lang_country).includes(language) ? `flag-icon-${lang_country[language][0]}` : defaultFlag;

            return countryFlag;
        },
        getStarsRating(target) {
            // prendo la media del voto del film o della serie
            // ottengo il voto da 1 a 10 che devo dividere per 2
            // in quanto le stelle devono essere da 1 a 5
            // con il parseInt lo lascio intero  
            const vote = Math.round(target.vote_average / 2);

            // creo un array da trasfomare in stelle
            const stars = [];
            
            for(let i = 0; i < 5; i++) {
                if(i < vote) {
                    stars.push(1);
                } else {
                    stars.push(0);
                }
            }

            return stars;
        },
        createPoster(type) {
            //${film.poster_path}
            const initialPath = "https://image.tmdb.org/t/p/";
            const posterWidth = "w342";
            const searchedType = type.poster_path;

            if(searchedType) {
                return `${initialPath}${posterWidth}${searchedType}`;
            } else {
                return "../img/img_coomingSoon.png";
            }
        },
        getFullMovieCast(film) {
            if(film.actors) {
                return
            }
            
            axios.get(`${this.urlFirstPart}movie/${film.id}/credits${this.api_key_path}`)
                .then((resp) => {
                    console.log(resp.data.cast);
                    this.$set(film, "actors",  resp.data.cast.splice(0,5));
                });
            this.$set(film, "isVisible", true)

        },
        getSerieCast(serie) {
            if(serie.actors) {
                return
            }
    
            axios.get(`${this.urlFirstPart}tv/${serie.id}/credits${this.api_key_path}`)
            .then((resp) => {
                this.$set(serie, "actors", resp.data.cast.splice(0,5));    
            })
            this.$set(serie, "isVisible", true)
        }
    },
    computed: {
    },
    mounted() { 
    }

})
/*
 getNewUrl(type) {
            let typeOfSearch = "";
            if(type.adult) {
                typeOfSearch = "movie";
            } else {
                typeOfSearch = "tv";
            }

            let customUrl = `${this.urlFirstPart}search/${typeOfSearch}${this.api_key_path}&query=${this.userSearch}`

            console.log(customUrl)

            axios.get(customUrl)
                .then((resp) => {
                    console.log(resp.data.results)

                    this.filmList = resp.data.results
            })

        },
*/
        /*
        getFullMovieCast(type) {
            // type puo' essere o film o serie
            // ma nella chiamata axios film deve essere movie
            // e serie deve essere tv
            let typeOfSearch;

            if(type === "film") {
                typeOfSearch = "movie";
            } else if(type === "serie") {
                typeOfSearch = "tv";
            }

            if(type.actors) {
                return
            }
            
            axios.get(`${this.urlFirstPart}${typeOfSearch}/${type.id}/credits${this.api_key_path}`)
                .then((resp) => {
                    console.log(resp.data.cast);
                    this.$set(type, "actors",  resp.data.cast.splice(0,5));
                });
            this.$set(type, "isVisible", true)

            onOff(film) {
            
                film.isVisible = !film.isVisible;
        },
        */