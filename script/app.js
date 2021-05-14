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

*/
const app = new Vue({
    el:'#mainContainer',
    data: {
        userSearch: "",
        filmsList: [],
        seriesList: [],
        //firstHalfSrcPath: "https://image.tmdb.org/t/p/w154"
    },
    methods: {
        getNewUrl() {
            let modifiedUrl = `https://api.themoviedb.org/3/search/movie?api_key=70420ad26ad9fc16d1d09445d6c02437&query=${this.userSearch}`

            console.log(modifiedUrl)

            axios.get(modifiedUrl)
                .then((resp) => {
                    console.log(resp.data.results)

                    this.filmsList = resp.data.results
            })

            let seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=70420ad26ad9fc16d1d09445d6c02437&query=${this.userSearch}`
            
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
            //prendo la media del voto del film o della serie
            const vote = target.vote_average;
            // cosi' ottengo il voto da 1 a 10 
            // adesso lo trasformo in un voto intero
            const intVote = parseInt(vote);
            // converto il voto in stelle ma devono essere da 1 a 5 stelle
            // quindi divido il voto intero per 2
            const voteToStars = parseInt(intVote / 2);
            return voteToStars;
        },
    },
    computed: {},
    mounted() {  
    }

})