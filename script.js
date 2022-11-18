
const ListaColecciones ='./Recursos/colecciones.json';

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

async function fLeerColeccion () {

    let ret = await fLeerFicheroJson(ListaColecciones)

    // v0 - Solo Primera colección

    // path tiene el path de la coleccion
    const lConf1 = "./Recursos/";
    const lConf2 = ret[0].path;
    const lConf3 = "/parejas.json";

    var pathColeccionConf = lConf1 + lConf2 + lConf3;

    ret = await fLeerFicheroJson(pathColeccionConf)    

    let imgCount=1;
    ret.forEach(element => {            
        
        let imagen = lConf1 + lConf2 + "/" + element.Imagen; 
        document.getElementById("card" + imgCount ).style.backgroundImage = "url('" + imagen + "')";

        imgCount++;
    });

};

fLeerColeccion();