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
*/
const app = new Vue({
    el:'#mainContainer',
    data: {
        userSearch: "",
        filmsList: [],
        seriesList: []
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
        getCountryFlag() {
            // faccio un obj mappa che presenta come chiavi le lingue parlate e come valori degli array che contengono
            // i paesi dove viene parlata quella lingua
            const lang_country = {
                'en': ['us','gb','ca'],
                'fr': ['fr','be','lu','ca'],
                'es': ['es','ar','bo','co','mx'],
                'it': ['it'],
                'ru': ['ru'],
                'de': ['de','at'],
                'pt': ['pt','br']          
            };
        } 
        
    },
    computed: {},
    mounted() {  
    }

})