import {Factor, 
    FactorUnidad,TiposFactores,PersonalidadBigFive} from './tabuladorBigFive.ts'

import brainJs from 'https://cdn.skypack.dev/brain.js';
let archivoDatos:string = "data/Investigación correlación big-five hablar en publico .csv";
const decoder = new TextDecoder('utf-8');
let dataCsv = await decoder.decode(await Deno.readFile(archivoDatos));
let data:string[][] = dataCsv.slice(1,dataCsv.length).split('"\n"').map(f=>f.split('","'))
// console.log(data)
function cambiarNumeracion(n:number):number{

    switch (n) {
        case 1:
            return 5;
            break;
        case 2:
            return 4;
        break;
        case 3:
            return 3;
        break;
        case 4:
            return 2;
            break;
        case 5:
            return 1;
        break;
    
        default:
            return n
        break;
    }

}
let bigFiveData:number[][] = data.slice(1).map(f=>f.slice(2,12).map(c=> cambiarNumeracion(Number (c[0]))))
// console.log({bigFiveData})
let bigFiveDataProcesado = bigFiveData.map(respuesta=> {

    let construyendoPersonalidad:TiposFactores = {// saco los valores de la tabla para convertirlos en sus respectivos factores
        extraversion:new FactorUnidad([{ t:5,p:respuesta[5],n:undefined},{t:5,p:undefined,n:respuesta[0]}]),//    fila[6]-fila[1]
        amabilidad:new FactorUnidad([{ t:5,p:respuesta[1],n:undefined},{t:5,p:undefined,n:respuesta[6]}]),//    fila[2]-fila[7]
        conciencia:new FactorUnidad([{ t:5,p:respuesta[2],n:undefined},{t:5,p:undefined,n:respuesta[7]}]),//    fila[3]-fila[8]
        neuroticismo:new FactorUnidad([{ t:5,p:respuesta[8],n:undefined},{t:5,p:undefined,n:respuesta[3]}]),//    fila[9]-fila[4]
        apertura:new FactorUnidad([{ t:5,p:respuesta[4],n:undefined},{t:5,p:undefined,n:respuesta[9]}]),//    fila[5]-fila[10]
    }
    let personalidadBigFive = new PersonalidadBigFive(construyendoPersonalidad).personalidad()
    return personalidadBigFive
} )

console.log({bigFiveDataProcesado})

let miedoPublico:string[][] = data.slice(1).map(f=>f.slice(12,data[0].length-1))
// console.log({miedoPublico})
let convertirValores:number[][] = miedoPublico.map((f)=> f.map(c=> c=="Sí"?1:c=="No"?0:1))

let sumatoriaMiedoPUblico:number[]= convertirValores.map((f)=>f.reduce((a,b)=>a+b))
console.log({sumatoriaMiedoPUblico})

export const net = new brainJs.NeuralNetwork();
export const valoresEntrenamientos = bigFiveDataProcesado.map((fila,index)=> {// los valores se van a dividir por el maximo valor que se puede alcanzar en cada test psicologico
   let creandoMatriz =  Object.entries(fila).map(f=>[f[0],f[1].p/5])
//    console.log( {creandoMatriz})
   creandoMatriz = Object.fromEntries(creandoMatriz)
//    console.log( {creandoMatriz})

    return { input: creandoMatriz, output: {s:sumatoriaMiedoPUblico[index]/13} }
})
console.log({valoresEntrenamientos})
net.train(valoresEntrenamientos);
// valoresEntrenamientos.forEach(f=>{
//     console.log(f)
//     const output = net.run(f.input); // { white: 0.99, black: 0.002 }
//     console.log(output)
// })

export let run=net.run;