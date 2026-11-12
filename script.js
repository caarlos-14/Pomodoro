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

//Variables del Modal Personalizado
const modalPersonalizado = document.getElementById("custom-modal");
const modalMensaje = document.getElementById("modal-mensaje");
const modalBotones = document.getElementById("modal-botones");

//Variables de uso interno
let segundosTotal = 0;
let tiempoActual = 1500;
let tiempoResta = 0;
let intervalo = null;
let nFases = 0;

//Sonido Alarma
const sonidoAlarma = new Audio("imagenes/lesiakower-lo-fi-alarm-clock-243766.mp3");

//Funciones para simular Alert y Confirm mediante Promesas
function miAlert(mensaje) {
    return new Promise((resolve) => {
        modalMensaje.textContent = mensaje;
        modalBotones.innerHTML = `<button class="btn-modal-aceptar">Aceptar</button>`;
        modalPersonalizado.style.display = "flex";

        const btnAceptar = modalBotones.querySelector(".btn-modal-aceptar");
        btnAceptar.onclick = () => {
            modalPersonalizado.style.display = "none";
            resolve();
        };
    });
}

function miConfirm(mensaje) {
    return new Promise((resolve) => {
        modalMensaje.textContent = mensaje;
        modalBotones.innerHTML = `
            <button class="btn-modal-aceptar">Aceptar</button>
            <button class="btn-modal-cancelar">Cancelar</button>
        `;
        modalPersonalizado.style.display = "flex";

        const btnAceptar = modalBotones.querySelector(".btn-modal-aceptar");
        const btnCancelar = modalBotones.querySelector(".btn-modal-cancelar");

        btnAceptar.onclick = () => {
            modalPersonalizado.style.display = "none";
            resolve(true);
        };

        btnCancelar.onclick = () => {
            modalPersonalizado.style.display = "none";
            resolve(false);
        };
    });
}

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

//A través de un bucle accedemos a los tiempos de cada opción
enlaces.forEach(enlace =>{
    enlace.addEventListener("click", async (e) =>{
        e.preventDefault();
        if(intervalo != null) return;

        segundosTotal = parseInt(enlace.getAttribute('data-tiempo'));

        if(tiempoActual != segundosTotal){
            const confirmar = await miConfirm("¿Estas seguro de que quieres cambiar el modo?");
            if(!confirmar) return;
        }

        const ruta = enlace.getAttribute("data-imagen");
        
        document.body.style.backgroundImage = `url('${ruta}')`;

        tiempoActual = segundosTotal;
        tiempoResta = 0;
        formateoTiempo(tiempoActual);
    });
});

//Iniciar el evento para contar el tiempo
buttonStart.addEventListener("click", async () =>{

    if(tiempoResta <= 0) {
        tiempoResta = tiempoActual;
    }

    if(nFases == 4 && buttonStart.textContent.includes("Cambiar Relajación Larga")) {
        const enlaceRelajacionLarga = document.querySelector('.navegacion a[data-tiempo="900"]');
        
        if(enlaceRelajacionLarga) {
            segundosTotal = parseInt(enlaceRelajacionLarga.getAttribute('data-tiempo'));
            const ruta = enlaceRelajacionLarga.getAttribute("data-imagen");
            
            document.body.style.backgroundImage = `url('${ruta}')`;

            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }

        nFases = 0;
        fases.textContent = "Fase " + nFases;
        buttonStart.classList.remove("bi-arrow-down-up");
        buttonStart.classList.add("bi-caret-right-fill");
        buttonStart.textContent = ""; 
        return;
    }

    if(nFases == 4) {
        await miAlert("Tomate un descanso!"); 
        buttonStart.classList.remove("bi-caret-right-fill");
        buttonStart.classList.add("bi-arrow-down-up");
        buttonStart.textContent = " Cambiar Relajación Larga";
        return;
    }
    
    buttonStart.classList.remove("bi-caret-right-fill");
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
                formateoTiempo(tiempoResta);
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
        }, 1000);
    } else {
        buttonStart.classList.remove("bi-app");
        buttonStart.classList.add("bi-caret-right-fill");
        clearInterval(intervalo);
        intervalo = null;
        buttonMas.style.display = "block";
        buttonMenos.style.display = "block";
    }
});

//Reiniciamos el contador al valor con el que arranco
buttonReinicio.addEventListener("click", async () =>{
    if(intervalo != null) {
        await miAlert("Deten el cronometro para reiniciar!");
        return;
    }
    tiempoResta = tiempoActual;
    formateoTiempo(tiempoActual); 
});

//Botón para detener la alarma cuando suene
btnDetenerAlarma.addEventListener("click", () =>{
    sonidoAlarma.pause();
    sonidoAlarma.currentTime = 0;
    sonidoAlarma.loop = false; 

    buttonStart.classList.remove("bi-app");
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
            
            document.body.style.backgroundImage = `url('${ruta}')`;

            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }
    } else if(tiempoActual <= 600 && nFases != 4){  
        const enlaceConcentracion = document.querySelector('.navegacion a[data-tiempo="1500"]');
        
        if(enlaceConcentracion) {
            segundosTotal = parseInt(enlaceConcentracion.getAttribute('data-tiempo'));
            const ruta = enlaceConcentracion.getAttribute("data-imagen");
            
            document.body.style.backgroundImage = `url('${ruta}')`;

            tiempoActual = segundosTotal;
            tiempoResta = tiempoActual;
            formateoTiempo(tiempoActual);
        }
    } else {
        formateoTiempo(tiempoActual);
    }
});

//Botón para aumentar el tiempo del cronometro
buttonMas.addEventListener("click", () =>{
    tiempoActual += 30;
    segundosTotal = tiempoActual;
    tiempoResta = tiempoActual;   
    formateoTiempo(tiempoActual);
});

//Evento para restar Tiempo al cronometro sin que pasa de 0
buttonMenos.addEventListener("click", () =>{
    if(tiempoActual > 0){
        tiempoActual -= 30;
        segundosTotal = tiempoActual;
        tiempoResta = tiempoActual;   
        formateoTiempo(tiempoActual);   
    }
});

//Evento para mostrar y Ocultar
btnTarea.addEventListener("click", () =>{
    if(panelTareas.style.display == "none"){
        panelTareas.style.display = "block";
    }else{
        panelTareas.style.display = "none";
    }
});

//Botón para agregar tareas
btnAgregar.addEventListener("click", () =>{
    if(valorInput.value == "") return;

    let li = document.createElement("li");
    let buttonEliminar = document.createElement("button");
    buttonEliminar.innerHTML = `<i style="font-size:1em;" class="bi bi-trash"></i>`;
    li.textContent = valorInput.value;
    listaTareas.appendChild(li);
    li.appendChild(buttonEliminar);

    buttonEliminar.addEventListener("click", () =>{
        li.remove();
    });
    valorInput.value = "";
});

document.addEventListener("DOMContentLoaded", () =>{
    panelTareas.style.display = "none";
    fases.textContent = "Fase 0";   
});