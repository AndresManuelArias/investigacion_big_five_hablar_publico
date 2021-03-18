# extraversión: 1r, 6
# amabilidad: 2, 7R
# conciencia: 3, 8R
# Neuroticismo: 4R, 9.
# apertura: 5, 10R


base_datos <- read.csv("data/Investigación correlación big-five hablar en publico .csv")
# base_datos[,"BFI.10..1..Es.reservado."] <- factor(base_datos[,"BFI.10..1..Es.reservado."], levels = c("1. Totalmente de acuerdo","2. De acuerdo","3. Ni acuerdo ni en desacuerdo","4. En desacuerdo","5. Totalmente en desacuerdo","No","Sí","5","4","3","2","1"))
# base_datos[,"BFI.10..1..Es.reservado."] 
# base_datos[,"BFI.10..1..Es.reservado."] == "1. Totalmente de acuerdo"
# base_datos[,"BFI.10..1..Es.reservado."][base_datos[,"BFI.10..1..Es.reservado."] == "1. Totalmente de acuerdo"] 
# base_datos[,"BFI.10..1..Es.reservado."][base_datos[,"BFI.10..1..Es.reservado."] == "1. Totalmente de acuerdo"] <- "5"

# for(columna in names(base_datos)){
#     base_datos[,columna] <- factor(base_datos[,columna], levels = c("1. Totalmente de acuerdo","2. De acuerdo","3. Ni acuerdo ni en desacuerdo","4. En desacuerdo","5. Totalmente en desacuerdo","No","Sí","5","4","3","2","1","0"))
#     base_datos[,columna][base_datos[,columna] == "1. Totalmente de acuerdo"] <- "5"
#     base_datos[,columna][base_datos[,columna] == "2. De acuerdo"] <- "4"
#     base_datos[,columna][base_datos[,columna] == "3. Ni acuerdo ni en desacuerdo"] <- "3"
#     base_datos[,columna][base_datos[,columna] == "4. En desacuerdo"] <- "2"
#     base_datos[,columna][base_datos[,columna] == "5. Totalmente en desacuerdo"] <- "1"
#     base_datos[,columna][base_datos[,columna] == "No"] <- "0"
#     base_datos[,columna][base_datos[,columna] == "Sí"] <- "1"
# }
clearnDatosBigFive <- function(fila){
    coleccionDatos <- c()
    for(col in fila){
        if("1. Totalmente de acuerdo"  == col ){
            coleccionDatos <- c(coleccionDatos,5)           
        }else if("2. De acuerdo" == col){
            coleccionDatos <- c(coleccionDatos,4)           
        }else if("3. Ni acuerdo ni en desacuerdo" == col){
            coleccionDatos <- c(coleccionDatos,3)           
        }else if("4. En desacuerdo" == col){
            coleccionDatos <- c(coleccionDatos,2)           
        }else if("5. Totalmente en desacuerdo" == col){
            coleccionDatos <- c(coleccionDatos,1)           
        }
    }
    coleccionDatos
}
# extraversión: 1r, 6
extraversion <- function(fila){
    fila[6]-fila[1]
}
# amabilidad: 2, 7R
amabilidad <- function(fila){
    fila[2]-fila[7]
}
# conciencia: 3, 8R
conciencia <- function(fila){
    fila[3]-fila[8]
} 
# Neuroticismo: 4R, 9.
neuroticismo<- function(fila){
    fila[9]-fila[4]
} 
# apertura: 5, 10R
apertura <- function(fila){
    fila[5]-fila[10]
} 
bigFivePersona <- function(fila){
    fila <- clearnDatosBigFive(fila)
    c(extraversion=extraversion(fila),amabilidad=amabilidad(fila),conciencia= conciencia(fila),neuroticismo=neuroticismo(fila),apertura=apertura(fila))
}
bigFive <- function(baseDatos){
    apply(baseDatos,1,function(fila){bigFivePersona(fila)})
}
miedoPublicoPersona <- function(fila){
    coleccionDatos <- c()
    for(col in fila){
        if(col == "Sí"){
             coleccionDatos <- c(coleccionDatos,1)           
        }else if(col == "No"){
             coleccionDatos <- c(coleccionDatos,0)           

        }
    }
  sum(coleccionDatos)
}

miedoPublico <- function(baseDatos){
    apply(baseDatos,1,miedoPublicoPersona)
}

miedoPublicoYBigFivePersona<-function(baseDatos1,baseDatos2){
    five<- bigFivePersona(baseDatos1)
    personmiedo <- miedoPublicoPersona(baseDatos2)  
    c(five,miedo_publico=personmiedo)
}
todosMiedoPublicoYBigFivePersona<-function(baseDatos){
    apply(baseDatos,1,function(fila){
        miedoPublicoYBigFivePersona(fila[3:12],fila[13:25])
    } )
}


# clearnDatosBigFive(base_datos[1,3:12])
# bigFivePersona(base_datos[1,3:12])
# resultadoMiedo <- miedoPublicoPersona(base_datos[1,13:25])
# miedoPublico(base_datos[,13:25])
# bigFive(base_datos[,3:12])
# agre= miedoPublicoYBigFivePersona(base_datos[1,3:12],base_datos[1,13:25])


tabla = todosMiedoPublicoYBigFivePersona(base_datos)


for(factor in c("extraversion","amabilidad","conciencia","neuroticismo","apertura")){
    titulo = factor
    png(file = paste("graficos/correlacion/",titulo, ".png"))    
    plot(tabla[factor,],tabla["miedo_publico",],xlab=factor,ylab="miedo hablar en publico",col="blue")
    abline(lm(tabla["miedo_publico",] ~ tabla[factor,]),col="red")
    correlacion <-  cor(tabla["miedo_publico",],tabla[factor,])    
    print(titulo)
    print(correlacion)
    legend("bottomleft",col=c("red"),legend =c(correlacion), lwd=3, bty = "n")
    dev.off()   
}
for(factor in c("miedo_publico","extraversion","amabilidad","conciencia","neuroticismo","apertura")){
    png(file = paste("graficos/histograma/histograma_",factor, ".png"))   
    hist(tabla[factor,],ylab=factor,xlab="N people",freq=FALSE,col="lightcyan", main=paste("Histograma ",factor))
    lines(density(tabla[factor,]),col="red",lwd=2)
    dev.off() 
}  

for(fila in  c(1:nrow(base_datos))){
    print(fila)
    print(tabla[,fila])
    print(base_datos[fila,26])
    png(file = paste("graficos/individual/persona_",base_datos[fila,26], ".png"))   
    barplot(tabla[,fila],ylab='puntajes',xlab="factor", main=paste(base_datos[fila,26]),legend.text=TRUE,col=c("pink","cyan","red","green","blue","yellow"))
    dev.off() 
}

