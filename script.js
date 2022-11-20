
const ListaColecciones ='./Recursos/colecciones.json';

// Clase cartas
class cCarta {
    constructor(nombre, imagen, pareja) {      
      this.nombre = nombre;
      this.imagen = imagen;
      this.pareja = pareja;
    }
};

var coleccion =0;

var cCartasColeccion = [];
var cCartasTablero = [];

var partida = {
    estado: false,
    movimientos: 0,
    cartaSeleccionada1: 0,
    cartaSeleccionada2: 0,
    parejas: 0,
    resultado: 0,
    max_movimientos: 9999
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
    const lConf2 = ret[coleccion].path;
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

        //document.getElementById("card" + (idx + 1)).style.backgroundImage = "url('" + cCartasTablero[idx].imagen + "')";
        document.getElementById("card" + (idx + 1)).style.backgroundImage = "";


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
        //console.log(partida);

        // Condicion habilitada o no de carta
        if ((document.getElementById(pCartaSeleccionada).style.backgroundImage === "") && (partida.cartaSeleccionada1 === 0 || partida.cartaSeleccionada2 === 0)) {            

            document.getElementById("card" + idx).style.backgroundImage = "url('" + cCartasTablero[idx-1].imagen + "')";

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
                 
                } else {
                 
                    setTimeout(fBorrarImagen,300,partida.cartaSeleccionada1,partida.cartaSeleccionada2);
                   
                }

                partida.cartaSeleccionada1 = 0 
                partida.cartaSeleccionada2 = 0 
                partida.movimientos = partida.movimientos + 1
                document.getElementsByClassName("moves")[0].innerHTML = partida.movimientos + " moves"
                
            }

            // final de juego
   
            if ((partida.parejas === 8) || (partida.movimientos >= partida.max_movimientos)){                
                setTimeout(() => {        
                    fFinalJuego()
                }, 1000)
                
            }
        }

    }    

    //console.log(partida);

};


function fFinalJuego () {

    partida.estado = false
    partida.parejas = 0
    partida.cartaSeleccionada1 = 0 
    partida.cartaSeleccionada2 = 0 

    if (partida.parejas === 8) {
        partida.resultado = "ganado"
    } else {
        partida.resultado = "perdido"    
    }

    alert("Final de Partida. Has " + partida.resultado + "!!!")    

    document.getElementById("listacolecciones").disabled = false;             
    fDificultadFinal();

    document.getElementById("iniciar").className = ""; 
    document.getElementById("listacolecciones").className = "";
   
   
};

function fBorrarImagen (Carta1, Carta2) {        
    document.getElementById('card' + Carta1).style.backgroundImage = ""
    document.getElementById('card' + Carta2).style.backgroundImage = ""
}

function fMostrarPanel () {

    var idx = 0;
        
    for (idx=0; idx < cCartasTablero.length ; idx++) {        
        document.getElementById("card" + (idx + 1)).style.backgroundImage = "url('" + cCartasTablero[idx].imagen + "')";
    }

    setTimeout(() => {         
        var idx = 0;        
        for (idx=0; idx < cCartasTablero.length ; idx++) {        
            document.getElementById("card" + (idx + 1)).style.backgroundImage = "";
        }
    }, 3000)
}

async function fIniciarJuego () {        

    partida.estado = false;
    partida.parejas = 0
    partida.cartaSeleccionada1 = 0 
    partida.cartaSeleccionada2 = 0 
    partida.movimientos = 0

    document.getElementsByClassName("moves")[0].innerHTML = partida.movimientos + " moves"
    document.getElementById("listacolecciones").disabled = true;  // Bloqueo de la lista    
    coleccion = document.getElementById("listacolecciones").value;

    let ret = await fCargarColeccion()
    fMostrarPanel();

    partida.estado = true;
    fDificultadInicio();    

    document.getElementById("iniciar").className = "jugando"; 
    document.getElementById("listacolecciones").className = ".listaActiva"; 

}

async function fCargarListaColecciones() {

    let ret = await fLeerFicheroJson(ListaColecciones)   
    
    coleccion = 0;
    document.getElementById("listacolecciones").innerHTML = "";    

    for (var idx=0; idx < ret.length ; idx++) {        
        coleccion.nombre = ret[idx].titulo;  
        var x = document.getElementById("listacolecciones"); //seleccion select
        var option = document.createElement("option");
        option.text = ret[idx].titulo;
        option.value = idx;
        x.add(option);
    }
}


function fDificultadInicio () {

    let combo = document.getElementsByName("dificultad");    

    for(let idx=0 ; idx< combo.length; idx++) {
        if (combo[idx].checked === true) {
            partida.max_movimientos = combo[idx].value                        
        }
        combo[idx].disabled = true;
    }    
}


function fDificultadFinal () {

    let combo = document.getElementsByName("dificultad");    

    for(let idx=0 ; idx< combo.length; idx++) {        
        combo[idx].disabled = false;
    }    
}

///

fCargarListaColecciones();
fCargarColeccion();

