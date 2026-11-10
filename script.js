//Variables DOM
let buttonStart = document.querySelector(".iniciar");
let buttonReinicio = document.querySelector(".reiniciar");
let buttonMas = document.querySelector(".mas");
let buttonMenos = document.querySelector(".menos");
let contador = document.querySelector(".contador");
let enlaces = document.querySelectorAll(".navegacion a");
let btnDetenerAlarma = document.querySelector(".btn-detener-alarma");
let btnTarea = document.querySelector(".btn-tareas");
let panelTareas = document.getElementById("panel-tareas");
let valorInput = document.getElementById("input-tarea");
let btnAgregar = document.getElementById("btn-agregar");
let listaTareas = document.getElementById("lista-tareas");
let btnBuscar = document.getElementById("btn-buscar");
let fases = document.querySelector(".fases");
//Variables de uso interno
let segundosTotal = 0;
let tiempoActual = 1500;
let tiempoResta = 0;
let intervalo = null
let nFases = 0
//Sonido Alarma
const sonidoAlarma = new Audio("imagenes/lesiakower-lo-fi-alarm-clock-243766.mp3");

//Función para formatear el tiempo
function formateoTiempo(segundosTotal){
    const horas = Math.floor(segundosTotal/3600);
    const minutos = Math.floor((segundosTotal % 3600) / 60);
    const segundos = Math.floor(segundosTotal % 60);

    const h = String(horas).padStart(2,'0');
    const m = String(minutos).padStart(2,'0');
    const s = String(segundos).padStart(2,'0');

    return contador.textContent = `${h}:${m}:${s}`;
}
//Llamamos a la función
formateoTiempo(tiempoActual);

//A travñes de un bucle accedemos a los tiempos de cada opción
enlaces.forEach(enlace =>{
    enlace.addEventListener("click", (e) =>{
        e.preventDefault();
        if(intervalo != null) return;

        segundosTotal = parseInt(enlace.getAttribute('data-tiempo'));

        if(tiempoActual != segundosTotal){
            const confirmar = confirm("¿Estas seguro de que quieres cambiar el modo?")
    
        if(!confirmar) return;
        }

        const ruta = enlace.getAttribute("data-imagen");
        
            document.body.style.backgroundImage = `url('${ruta}')` ;

        tiempoActual = segundosTotal;
        tiempoResta = 0;
        formateoTiempo(tiempoActual);
    })

});


//Iniciar el evento para contar el tiempo
buttonStart.addEventListener("click", () =>{

        if(tiempoResta <= 0) {
            tiempoResta = tiempoActual;
        }

    if(nFases == 4 && buttonStart.textContent.includes("Cambiar Relajación Larga")) {
        // Buscamos el enlace del descanso largo en la navegación (el que tiene data-tiempo="900")
        const enlaceRelajacionLarga = document.querySelector('.navegacion a[data-tiempo="900"]');
        
        if(enlaceRelajacionLarga) {
            segundosTotal = parseInt(enlaceRelajacionLarga.getAttribute('data-tiempo'));
            const ruta = enlaceRelajacionLarga.getAttribute("data-imagen");
            
            // Cambiamos el fondo
            document.body.style.backgroundImage = `url('${ruta}')`;

            // Actualizamos los tiempos
            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }

        // Restauramos el botón a su estado normal de Play y limpiamos las fases
        nFases = 0;
        fases.textContent = "Fase " + nFases;
        buttonStart.classList.remove("bi-arrow-down-up");
        buttonStart.classList.add("bi-caret-right-fill");
        buttonStart.textContent = ""; // Limpiamos el texto extra si lo hubiera, manteniendo solo el icono
        return;
    }

    if(nFases == 4) {
        alert("Tomate un descanso!") 
        buttonStart.classList.remove("bi-caret-right-fill");
        buttonStart.classList.add("bi-arrow-down-up");
        buttonStart.textContent = " Cambiar Relajación Larga"
        return;
    }
    buttonStart.classList.remove("bi-caret-right-fill")
    buttonStart.classList.add("bi-app");
    buttonMas.style.display = "none";
    buttonMenos.style.display = "none";

    if(intervalo == null){

    if(tiempoResta <= 0) {
            tiempoResta = tiempoActual;
    }

    intervalo = setInterval(() =>{
        if(tiempoResta > 0){
        tiempoResta--;
        formateoTiempo(tiempoResta)
    }else{
        clearInterval(intervalo);
        intervalo = null;
        sonidoAlarma.loop = true; 
        sonidoAlarma.play();
        if(tiempoActual >= 10){
            nFases++;
        }
        fases.textContent = "Fase " + nFases;
        btnDetenerAlarma.style.display = "inline-block";
        buttonStart.style.display = "none";
    }
    },1000);
    }else{
        buttonStart.classList.remove("bi-app")
        buttonStart.classList.add("bi-caret-right-fill");
        clearInterval(intervalo);
        intervalo = null;
        buttonMas.style.display = "block";
        buttonMenos.style.display = "block";
    }

});

//Reiniciamos el contador al valor con el que arranco
buttonReinicio.addEventListener("click", () =>{
    if(intervalo != null) return alert("Deten el cronometro para reiniciar!");
    tiempoResta = tiempoActual;
    formateoTiempo(tiempoActual); // Llamamos a la función para no perder el formato
});

//Botón para detener la alarma cuando suene
btnDetenerAlarma.addEventListener("click", () =>{
            sonidoAlarma.pause();//Pausamos el sonido
            sonidoAlarma.currentTime = 0 //Lo ponemos a 0
            sonidoAlarma.loop = false; // Después de pausar ponemos el bucle en false

            //Reiniciamos los valores
            buttonStart.classList.remove("bi-app")
            buttonStart.classList.add("bi-caret-right-fill");
            buttonMas.style.display = "block";
            buttonMenos.style.display = "block";
            btnDetenerAlarma.style.display = "none";
            buttonStart.style.display = "inline";
            formateoTiempo(tiempoActual);

        if(tiempoActual >= 1500 && nFases != 4){
       
        const enlaceRelajacionCorta = document.querySelector('.navegacion a[data-tiempo="300"]');
        
        if(enlaceRelajacionCorta) {
            segundosTotal = parseInt(enlaceRelajacionCorta.getAttribute('data-tiempo'));
            const ruta = enlaceRelajacionCorta.getAttribute("data-imagen");
            
            // Cambiamos el fondo
            document.body.style.backgroundImage = `url('${ruta}')`;

            // Actualizamos los tiempos
            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }
    }else if(tiempoActual <= 600 && nFases != 4){  
        const enlaceConcentracion = document.querySelector('.navegacion a[data-tiempo="1500"]');
        
        if(enlaceConcentracion) {
            segundosTotal = parseInt(enlaceConcentracion.getAttribute('data-tiempo'));
            const ruta = enlaceConcentracion.getAttribute("data-imagen");
            
            document.body.style.backgroundImage = `url('${ruta}')`;

            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }
    }else {
        formateoTiempo(tiempoActual);
    }
});

//Botón para aumentar el tiempo del cronometro
buttonMas.addEventListener("click", () =>{
    tiempoActual += 30;
    segundosTotal = tiempoActual;
    tiempoResta = tiempoActual;   
    formateoTiempo(tiempoActual);
})

//Evento para restar Tiempo al cronometro sin que pasa de 0
buttonMenos.addEventListener("click", () =>{
    if(tiempoActual > 0){
        tiempoActual -= 30;
        segundosTotal = tiempoActual;
        tiempoResta = tiempoActual;   
        formateoTiempo(tiempoActual);   
    }
})

//Evento para mostrar y Ocultar
btnTarea.addEventListener("click", () =>{
    if(panelTareas.style.display == "none"){
        panelTareas.style.display = "block";
    }else{
        panelTareas.style.display = "none";
    }
})
//Botón para agregar tareas
btnAgregar.addEventListener("click", () =>{
    
    if(valorInput.value == "") return; // valor vacío -> NADA

    let li = document.createElement("li") //Creamos li en DOM
    let buttonEliminar = document.createElement("button") // Creamos botón Eliminar
    buttonEliminar.innerHTML = `<i style="font-size:1em;" class="bi bi-trash"></i>`; //Agregamos el icono
    li.textContent = valorInput.value; //Agregamos el valor del input
    listaTareas.appendChild(li); // y añadimos al li
    li.appendChild(buttonEliminar); // el Botón lo agregamos al li también

    //Evento par eliminar la tarea
    buttonEliminar.addEventListener("click", () =>{
        li.remove();
    })
    valorInput.value = "";
})

document.addEventListener("DOMContentLoaded", () =>{
    panelTareas.style.display = "none";
    fases.textContent = "Fase 0";   
})







