
const ListaColecciones ='./Recursos/colecciones.json';

// Clase cartas
class cCarta {
    constructor(nombre, imagen, pareja) {      
      this.nombre = nombre;
      this.imagen = imagen;
      this.pareja = pareja;
    }
};

var cCartasColeccion = [];
var cCartasTablero = [];

var partida = {
    estado: false,
    movimientos: 0,
    cartaSeleccionada1: 0,
    cartaSeleccionada2: 0,
    parejas: 0
};

function fNumAleatorio(pValorMax) {
    return Math.floor(Math.random() * pValorMax);
};

async function fLeerFicheroJson (pFichero) {

    let retorno = "";    
    
    await fetch(pFichero)
        .then((response) => response.json())
        .then((json) => {                   
            retorno=json;          
            }    
        );

    return retorno
};

async function fCargarColeccion () {

    

    let ret = await fLeerFicheroJson(ListaColecciones)

    // v0 - Solo Primera colección

    // path tiene el path de la coleccion
    const lConf1 = "./Recursos/";
    const lConf2 = ret[0].path;
    const lConf3 = "/parejas.json";

    var pathColeccionConf = lConf1 + lConf2 + lConf3;

    ret = await fLeerFicheroJson(pathColeccionConf);

    cCartasColeccion = [];

    //console.log(cCartasColeccion);

    let imgCount=1;
    ret.forEach(element => {            

        let lCarta = new cCarta();
        lCarta.nombre = element.Nombre;
        lCarta.imagen = lConf1 + lConf2 + "/" + element.Imagen; 
        lCarta.pareja = element.Pareja;

        cCartasColeccion.push(lCarta);

        imgCount++;

    });

    fDistribuirCartasAleatorio();

};

function fDistribuirCartasAleatorio () {

    cCartasTablero = [];

    var idx = fNumAleatorio (cCartasColeccion.length)

    do {
        cCartasTablero.push(cCartasColeccion[idx]);
        cCartasColeccion.splice(idx,1);
        idx = fNumAleatorio (cCartasColeccion.length)
    } while (cCartasColeccion.length > 0);

    for (idx=0; idx < cCartasTablero.length ; idx++) {        

        //console.log(cCartasTablero[idx].imagen);
        //console.log("done");

        document.getElementById("card" + (idx + 1)).style.backgroundImage = "url('" + cCartasTablero[idx].imagen + "')";
        //document.getElementById("card" + (idx + 1)).addEventListener('click', event => {
        //    fSeleccionarCarta(event.target.id);          
        //}, false)

        document.getElementById("card" + (idx + 1)).removeEventListener('click',fSeleccionarCarta);
        document.getElementById("card" + (idx + 1)).addEventListener('click',fSeleccionarCarta);
    };
    
};

function fSeleccionarCarta () {

    var pCartaSeleccionada = event.target.id;

    if (partida.estado == true) {

        var idx = pCartaSeleccionada.replace('card','');

        //debugger;        

        // Condicion habilitada o no de carta
        if (document.getElementById(pCartaSeleccionada).style.backgroundImage != "") {

            if ((partida.cartaSeleccionada1 === 0) && (partida.cartaSeleccionada1 != idx)) {
                partida.cartaSeleccionada1 = idx;
            } 
            else {
                if ((partida.cartaSeleccionada2 === 0) && (partida.cartaSeleccionada2 != idx)  && (partida.cartaSeleccionada1 != idx)) {
                    partida.cartaSeleccionada2 = idx;
                }
            }

            if (partida.cartaSeleccionada2 != 0) {
                if (cCartasTablero[partida.cartaSeleccionada1-1].pareja === cCartasTablero[partida.cartaSeleccionada2-1].pareja) {
                    
                    partida.parejas = partida.parejas + 1

                    // Condicion habilitada o no de carta
                    document.getElementById('card' + partida.cartaSeleccionada1).style.backgroundImage = ""
                    document.getElementById('card' + partida.cartaSeleccionada2).style.backgroundImage = ""

                } else {
                    //console.log(pCartaSeleccionada);
                }

                partida.cartaSeleccionada1 = 0 
                partida.cartaSeleccionada2 = 0 
                partida.movimientos = partida.movimientos + 1
                document.getElementsByClassName("moves")[0].innerHTML = partida.movimientos + " moves"
                
            }

            if (partida.parejas === 8) {
                partida.estado = false
                partida.parejas = 0
                partida.cartaSeleccionada1 = 0 
                partida.cartaSeleccionada2 = 0 
                alert("Final de Partida")
            }
        }

    }    

    //console.log(partida);

};

function fIniciarJuego () {        

    partida.estado = true;
    partida.parejas = 0
    partida.cartaSeleccionada1 = 0 
    partida.cartaSeleccionada2 = 0 
    partida.movimientos = 0
    document.getElementsByClassName("moves")[0].innerHTML = partida.movimientos + " moves"

    fCargarColeccion();
}

///

fCargarColeccion();

