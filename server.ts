import { Application, Router,RouterContext } from "https://deno.land/x/oak/mod.ts";
import {valoresEntrenamientos,net} from "./index.ts";
import {Factor, 
    FactorUnidad,TiposFactores} from './tabuladorBigFive.ts'
const router = new Router();
await net.train(valoresEntrenamientos);
 
router
  .get("/", (context) => {
    context.response.body = //html
    `
    <!DOCTYPE html>
        <html>
        <head>
        <style>
            p,
            label {
                font: 1rem 'Fira Sans', sans-serif;
            }

            input {
                margin: .4rem;
            }
        </style>
        </head>
        <body>
            <h1>Bienvenido a IA big five</h1>
           <form method ="post" >
           <div>
            <input type="range" name="extraversion"
                    min="0" max="5">
            <label for="extraversion">extraversion</label>
            </div>
            <div>
            <input type="range" name="amabilidad"
                    min="0" max="5">
            <label for="amabilidad">amabilidad</label>
            </div>
            <div>
            <input type="range" name="conciencia"
                    min="0" max="5">
            <label for="conciencia">conciencia</label>
            </div>
            <div>
            <input type="range" name="neuroticismo"
                    min="0" max="5">
            <label for="neuroticismo">neuroticismo</label>
            </div>
            <div>
            <input type="range" name="apertura"
                    min="0" max="5">
            <label for="apertura">apertura</label>
            </div>
 
            <input type="submit" value="ver miedo" />
           </form>
        </body>
    </html>
    `;
  })
  .post("/", async(context:RouterContext)=>{//https://doc.deno.land/builtin/stable#URLSearchParams
    const { value } = context.request.body();
    const params  = await value;
    console.log(params)
    let [...factores]  = params.entries()
    // for (const [key, value] of params.entries()) {
    //     console.log(key, value);
    // }
    // console.log(factores)

    let numerosFactores = Object.fromEntries(factores.map((f:string[])=>[f[0],Number(f[1])]))//
    
    // console.log({numerosFactores})
    let resultado = net.run(numerosFactores);
    console.log({resultado})
      context.response.body = //html
      `
      <!DOCTYPE html>
          <html>
          <head>
          <style>
              p,
              label {
                  font: 1rem 'Fira Sans', sans-serif;
              }
  
              input {
                  margin: .4rem;
              }
          </style>
          </head>
          <body>
              <h1>Miedo hablar en publico</h1>
              <p>
               ${factores.map((f:string[][])=>f[0]+": "+f[1]).join("</br>")}
                </p>
             <p>Su miedo a hablar en publico de 1 a 100 es ${(resultado.s*100).toFixed(2)}% </p>
          </body>
      </html>
      `
  })

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });