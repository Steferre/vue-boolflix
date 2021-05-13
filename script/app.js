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
*/
const app = new Vue({
    el:'#mainContainer',
    data: {
        userSearch: "",
        filmsList: []
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

        }, 
        
    },
    computed: {},
    mounted() {  
    }

})