/**
 Total = 
 I=introversion
 E=extroversion
 Total = I+E

 I = total-E
 E = total-I

 el factor negativo  utilizara esta formula
 I = total-E
el factor positivo utilizar formula
 E = total-I
donde total va a ser el masimo posible de la pregunta

despues sacar el promedio de ese factor
 */
export interface Factor {
    t:number// el valor total de todo el valor
    p:number|undefined// el valor que tiene relacion con ese factor
    n:number|undefined // es el valor contrario de ese valor
    //[nombre:string]:number|undefined// solo dos factores

}

let nivelarValoresFaltantes =  (f:Factor):Factor => {
        let objectArray = [...Object.entries(f)]
        // console.log(objectArray)
       let sumas=  objectArray.map(o=>o[1]==undefined?0:o[1]).reduce((a,b)=>a+b)-f.t
        // console.log({sumas})
        let valoresIndefinidos = objectArray.filter(o=>o[1]==undefined).map(o=>o[1]=f.t-sumas)
        // console.log({valoresIndefinidos})
         let agregarValorFaltante = objectArray.map(o=>{
            //  console.log({o})
            if(!o[1]){
                o[1]=valoresIndefinidos[0]
            }
            return o
        })
        // console.log({agregarValorFaltante})
        // agregarValorFaltante.forEach(o=>{
        //     // f[o[0]]=o[1]
        //     console.log({o})
        // })
        let nuevo = Object.fromEntries(agregarValorFaltante)
        // console.log({nuevo})
    //    console.log (f)      
       f =  nuevo as   Factor    
        return f
}

export interface  TiposFactores {
    extraversion:FactorUnidad|number
    amabilidad:FactorUnidad|number
    conciencia:FactorUnidad|number
    neuroticismo:FactorUnidad|number
    apertura:FactorUnidad|number
    
}
// export interface extroIntro extends Factor {
//     "i":number
//     "e":number
// }
export class FactorUnidad{
    private totales:number[]=[]
    #factores:Factor[]=[];
    #promedioFactores:Factor={t:0,p:0,n:0}
    constructor(factores:Factor[]){
        // console.log(factores)
        this.#factores = factores.map(nivelarValoresFaltantes)
        // console.log("f",this.#factores)
        let longitud:number = this.#factores.length
            let promedioFactores = this.#factores
            .map((f:Factor):[number,number,number]=> [f.t?f.t:0,f.p?f.p:0,f.n?f.n:0] )
            .reduce((a:[number,number,number],b:[number,number,number])=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]])
            .map((f:number)=>{
                return f/longitud
            } )
        let [t,p,n]=promedioFactores
        this.#promedioFactores = {t,p,n}
        // console.log("promedioFactores",this.#promedioFactores)


    }
    totalesM():number[]{
        return  this.totales
    }
    factores():Factor[]{
        return this.#factores 
    }
    promedioFactores():Factor{
        return this.#promedioFactores 
    }
}
export class PersonalidadBigFive{
    #personalidad:TiposFactores={
        extraversion:0,
        amabilidad:0,
        conciencia:0,
        neuroticismo:0,
        apertura:0
    }
    #personalidadTodosDatos:TiposFactores={
        extraversion:0,
        amabilidad:0,
        conciencia:0,
        neuroticismo:0,
        apertura:0
    }
    constructor(construyendoPersonalidad:TiposFactores){
       
        let factores5 = [...Object.entries(construyendoPersonalidad)].map(f=>{//saco el promedio de los valores totales positivo o negativo de cada factor
  
            let promedioFactores = f[1].promedioFactores()
            console.log({promedioFactores})
       
            // let [t,p,n]=promedioFactores
            // console.log({t,p,n})
            let myMap = new Map([
                [f[0], promedioFactores]
            ]);
            // console.log(myMap)
            
            console.log("myMap:",Object.fromEntries(myMap))
           return Object.fromEntries(myMap)
        })
        let [extraversion,
            amabilidad,
            conciencia,
            neuroticismo,
            apertura ]= factores5.map(fila=> fila[Object.keys(fila)[0]])
        console.log({factores5}) 
        this.#personalidad = {extraversion,
            amabilidad,
            conciencia,
            neuroticismo,
            apertura};
         [extraversion,
            amabilidad,
            conciencia,
            neuroticismo,
            apertura ]= factores5;
        this. #personalidadTodosDatos = {extraversion,
            amabilidad,
            conciencia,
            neuroticismo,
            apertura};
    }
    personalidad():TiposFactores{
        return  this.#personalidad 
    }
    personalidadTodosDatos():TiposFactores{
        return this.#personalidadTodosDatos
    }
}
let factores:Factor[] =[ {p:7,t:10,n:undefined}]
let factorUnidad = new  FactorUnidad(factores)
console.log(factorUnidad.totalesM())
console.log(factorUnidad.factores())
console.log( new  FactorUnidad([ {p:7,t:10,n:undefined}]).factores())
console.log( new  FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]).factores())
console.log(new PersonalidadBigFive( {// saco los valores de la tabla para convertirlos en sus respectivos factores
    extraversion:new FactorUnidad([{ t:5,p:3,n:undefined},{t:5,p:undefined,n:3}]),//    fila[6]-fila[1]
    amabilidad:new FactorUnidad([{ t:5,p:3,n:undefined},{t:5,p:undefined,n:3}]),//    fila[2]-fila[7]
    conciencia:new FactorUnidad([{ t:5,p:3,n:undefined},{t:5,p:undefined,n:3}]),//    fila[3]-fila[8]
    neuroticismo:new FactorUnidad([{ t:5,p:3,n:undefined},{t:5,p:undefined,n:3}]),//    fila[9]-fila[4]
    apertura:new FactorUnidad([{ t:5,p:3,n:undefined},{t:5,p:undefined,n:3}]),//    fila[5]-fila[10]
}))
// let construyendoPersonalidad:TiposFactores = {
//     extraversion:new FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]),
//     amabilidad:new FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]),
//     conciencia:new FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]),
//     neuroticismo:new FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]),
//     apertura:new FactorUnidad([ {p:7,t:10,n:undefined},{n:9,t:10,p:undefined}]),
// }

// console.log(construyendoPersonalidad.extraversion.factores())
// console.log(construyendoPersonalidad.amabilidad.factores())
// console.log(construyendoPersonalidad.conciencia.factores())
// console.log(construyendoPersonalidad.neuroticismo.factores())
// console.log(construyendoPersonalidad.apertura.factores())