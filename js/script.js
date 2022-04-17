

/*Obtenemos los contenedores para las tarjetas pokemon y para la ventana modal que mostrará 
el pokemon que buscamos */

const pokedex = document.getElementById("poke_container");
const btnPokedex = document.getElementById("btn-pokedex");
const btnPokemon = document.getElementById("btn-search-pokemon");
const flecha_left = document.getElementById("arrow-left");
const flecha_right = document.getElementById("arrow-right");
const generacion = document.getElementById("gen");
const btn_modal = document.getElementById("btn-modal");

const modal = document.getElementById("modal");


window.addEventListener("load", () => {

/*Botón con el que llamamos a la función que obtiene todos los pokemons de la api */
btnPokedex.addEventListener("click", () => {
    getAllPokemon();
});

/*Botón con el que llamamos a la función que nos devolverá un único pokemon y lo mostrará en una 
ventana modal */
btnPokemon.addEventListener("click", (e) => {
    e.preventDefault();

    let busqueda = document.getElementById("nombre").value;
    if(busqueda != ""){
        if(searchPokemon(busqueda.toLowerCase())){
            document.getElementById("modal-container").classList.add("active");
            document.getElementById("nombre").value = "";
        }else{
            console.log("No encontrado");
        }
    }
})

/*Evento de escucha vinculado a la flecha derecha, con el que aumentaremos la generación de pokemons
que queremos mostrar */
flecha_right.addEventListener("click", () => {
    let gen = generacion.innerHTML;
    
    if(gen < 8){//generación máxima
        gen++;
        generacion.textContent = gen;
    }
});

/*Evento de escucha vinculado a la flecha izquierda, con el que disminuiremos la generación de pokemons
que queremos mostrar */
flecha_left.addEventListener("click", () => {
    let gen = generacion.innerHTML;
    
    if(gen > 1){//generación mínima
        gen--;
        generacion.textContent = gen;
    }
});

/*Botón con el que cerramos la ventana modal en la que se muestra el pokemón que se quiere buscar */
btn_modal.addEventListener("click", () => {
    
    document.getElementById("name-modal").textContent = "";
    document.getElementById("img-modal").src = "";
    document.getElementById("num-modal").textContent = "";
    document.getElementById("tipo-modal").textContent = "";
    document.getElementById("estadisticas").innerHTML = `<h4 class="stats-header">Estadísticas iniciales</h4>`;
    
    document.getElementById("modal-container").classList.remove("active");

});


});



//Diccionario de colores segun el tipo del pokemon
const color_type = {
	fire: '#e53800',
	grass: '#8FD594',
	electric: '#FFE43B',
	water: '#7E97C0',
	ground: '#CAAC4D',
	rock: '#d4d3d4',
	fairy: '#fceaff',
	poison: '#9D5B9B',
	bug: '#EAFD71',
	dragon: '#97b3e6',
	psychic: '#FF96B5',
	flying: '#CDCDCD',
	fighting: '#FF5D5D',
	ghost: '#d5accd',
	steel: '#545e60',
	ice: '#9DCFDD',
    dark:'#ccc',
	normal: '#F5F5F5'
};

//Rango de pokemons por generación, hasta el momento hay 8 generaciones
const pokemonGen = {
    1:[1, 151],
    2:[152, 251],
    3:[252, 386],
    4:[387, 493],
    5:[494, 649],
    6:[650, 721],
    7:[722, 809],
    8:[810, 898]
};

/*Obtenemos todos los pokemons de la generación seleccionada */
const getAllPokemon = async () => {
    removePokemons();
    let gen = pokemonGen[document.getElementById("gen").innerHTML];
    for(let i = gen[0]; i <= gen[1]; i++){
        await getPokemonForId(i);
    }
};

/*Obtenemos el pokemon indicado por su id y creamos la tarjeta en el html */
const getPokemonForId = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const rest = await fetch(url);
    const pokemon = await rest.json();
    createCardPokemon(pokemon);
};

// const getAllPokemon = () => {
//     removePokemons();
//     let gen = pokemonGen[document.getElementById("gen").innerHTML];
//     const promesas = [];
//     for(let i = gen[0]; i <= gen[1]; i++){
//         const url = `https://pokeapi.co/api/v2/pokemon/${i}/`;
//         promesas.push(fetch(url).then((res) => res.json()));
//     }

//     Promise.all(promesas).then(results => {
//         results.forEach(resultado => {
//             createCardPokemon(resultado);
//         })
//     });
// }

/*Eliminamos todos los pokemons que haya en pantalla */
const removePokemons = () => {
    let cardsPokemon = document.getElementsByClassName("card_pokemon");
    let deletePokemons = [];
    for(let i = 0; i < cardsPokemon.length; i++){
        const cardPokemon = cardsPokemon[i];
        deletePokemons = [...deletePokemons, cardPokemon];
    }
    deletePokemons.forEach((delPokemon) => delPokemon.remove());
};

/*Función con la que buscaremos un pokemon en la api */
const searchPokemon = async id =>{
    removePokemons();
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    const rest = await fetch(url);
    if(rest.ok){
        const pokemon = await rest.json();
        createModal(pokemon);
        return true;
    }
    return false;
};

function createModal(pokemon){

    document.getElementById("name-modal").textContent = pokemon.name[0].toUpperCase()+pokemon.name.slice(1);
    document.getElementById("img-modal").src = pokemon.sprites.front_default;
    document.getElementById("num-modal").textContent = `# ${pokemon.id.toString().padStart(3, 0)}`;

    let type = "";
    let tarjeta = document.getElementById("card-modal");
    if(pokemon.types.length == 1){
        tarjeta.style.backgroundColor = color_type[pokemon.types[0].type.name];
        type += pokemon.types[0].type.name[0].toUpperCase() + pokemon.types[0].type.name.slice(1);
    }else{
        tarjeta.style.background = `linear-gradient(-45deg, ${color_type[pokemon.types[0].type.name]}, ${color_type[pokemon.types[1].type.name]})`;
        let i = 0;
        pokemon.types.forEach(tipo => {
            if(i == 0){
                type += tipo.type.name[0].toUpperCase() + tipo.type.name.slice(1);
            }else{
                type+= `/ ${tipo.type.name[0].toUpperCase() + tipo.type.name.slice(1)}`;
            }
            i++;
        });
    }
    document.getElementById("tipo-modal").textContent = type;

        /*Por cada estadística vamos a tener dos elementos y un contenedor para ellos */
        pokemon.stats.forEach(stat => {
            const stat_container = document.createElement('div'); //contenedor del nombre y valor de la estadistica
            stat_container.classList.add('stat-container');
    
            //Elemento para el nombre de la estadística
            const stat_name = document.createElement('span');
            stat_name.classList.add('stat-name');
            stat_name.textContent = stat.stat.name;
    
            //Elemento para el valor de la estadística
            const stat_valor = document.createElement('span');
            stat_valor.classList.add('stat-valor');
            stat_valor.textContent = stat.base_stat;
    
            //agregamos al elemento contenedor
            stat_container.appendChild(stat_name);
            stat_container.appendChild(stat_valor);
    
            document.getElementById("estadisticas").appendChild(stat_container);
        });

}

/*Función con la que crearemos una tarjeta por cada pokemon que obtengamos de
la BBDD */
function createCardPokemon(pokemon){
    
    const card = document.createElement('div');//Creamos la tarjeta

    card.classList.add('card_pokemon');//Le agregamos una clase al elemento creado
    card.setAttribute("data-id", pokemon.id);

    const imgPokemon = document.createElement('div');//div que contendrá la imagen del pokemon
    imgPokemon.classList.add('img_pokemon');

    const imagen = document.createElement('img');//creamos el elemento img para la imagen
    /*al atributo src de la imagen le indicamos la ruta donde se 
    encuentra la imagen en la BBDD*/
    imagen.src = pokemon.sprites.front_default;

    //ponemos el elemento img dentro del contenedor imgPokemon
    imgPokemon.appendChild(imagen);

    /*Le damos formato a como se muestra el número del pokemon */
    const num_pokemon = document.createElement('h4');
    num_pokemon.classList.add('num-pokemon')

    /*El id lo pasamos a un string y le indicamos que debe tener ceros delante hasta tener tres caracteres */
    num_pokemon.textContent = `# ${pokemon.id.toString().padStart(3, 0)}`;

    /*Obtenemos el nombre del pokemon y le ponemos la primera letra en mayusculas */
    const name_pokemon = document.createElement('h3');
    name_pokemon.classList.add('name-pokemon');
    name_pokemon.textContent = pokemon.name[0].toUpperCase()+pokemon.name.slice(1);

    /*Obtenemos el tipo del pokemon */
    const type_pokemon = document.createElement('h4');
    type_pokemon.classList.add('tipo-pokemon');

    // let type = "";

    // /*Como hay pokemons que tienen más de un tipo, vamos a darle un poco de formato */
    // if(pokemon.types.length == 1){//sólo tiene un tipo
    //     type += pokemon.types[0].type.name;

    // }else{//posee más de un tipo
    //     let i = 0;
    //     pokemon.types.forEach(tipo => {
    //         if(i == 0){
    //             type += tipo.type.name;
    //         }else{
    //             type += ` / ${tipo.type.name}`;
    //         }
    //         i++
    //     });
    // }
    //Utilizando la función map evitamos escribir el código anterior.
    let type = pokemon.types.map((t) => t.type.name).join(' / ');
    
    type_pokemon.textContent = type;

    // /*Ahora que sabemos como obtener el tipo del pokemon, vamos a aprovechar para ponerle
    // el color de fondo de la tarjeta, el color del tipo principal del pokemon */
    // const bg_color = color_type[pokemon.types[0].type.name];
    // card.style.backgroundColor = bg_color;

    if(pokemon.types.length == 1){
        card.style.backgroundColor = color_type[pokemon.types[0].type.name];
    }else{
        card.style.background = `linear-gradient(-45deg, ${color_type[pokemon.types[0].type.name]}, ${color_type[pokemon.types[1].type.name]})`;
    }


    /*Obtenemos las estadísticas iniciales del pokemon */
    //creamos un contenedor para las estadísticas
    const stats_pokemon = document.createElement('div');
    stats_pokemon.classList.add("stats-pokemon");
    //stats_pokemon.style.backgroundColor = bg_color;

    //Para que las estadísticas se muestren con el mismo fondo repetimos el código
    if(pokemon.types.length == 1){
        stats_pokemon.style.backgroundColor = color_type[pokemon.types[0].type.name];
    }else{
        stats_pokemon.style.background = `linear-gradient(-45deg, ${color_type[pokemon.types[0].type.name]}, ${color_type[pokemon.types[1].type.name]})`;
    }

    const estadisticas = document.createElement('h4');
    estadisticas.classList.add("stats-header");
    estadisticas.textContent = 'Estadísticas iniciales';
    stats_pokemon.appendChild(estadisticas);

    /*Por cada estadística vamos a tener dos elementos y un contenedor para ellos */
    pokemon.stats.forEach(stat => {
        const stat_container = document.createElement('div'); //contenedor del nombre y valor de la estadistica
        stat_container.classList.add('stat-container');

        //Elemento para el nombre de la estadística
        const stat_name = document.createElement('span');
        stat_name.classList.add('stat-name');
        stat_name.textContent = stat.stat.name;

        //Elemento para el valor de la estadística
        const stat_valor = document.createElement('span');
        stat_valor.classList.add('stat-valor');
        stat_valor.textContent = stat.base_stat;

        //agregamos al elemento contenedor
        stat_container.appendChild(stat_name);
        stat_container.appendChild(stat_valor);

        stats_pokemon.appendChild(stat_container);
    });
        

    card.appendChild(name_pokemon);
    card.appendChild(imgPokemon);
    card.appendChild(num_pokemon);
    card.appendChild(type_pokemon);
    card.appendChild(stats_pokemon);


    pokedex.appendChild(card);
}