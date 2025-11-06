const scene=document.getElementById('scene');
const hotLamp=document.getElementById('hot-lamp');
const hotAC=document.getElementById('hot-ac');
const hotPlant=document.getElementById('hot-plant');
const hotCam=document.getElementById('hot-cam');
const lampGlow=document.getElementById('lampGlow');
const acDisplay=document.getElementById('acDisplay');
const acWind=document.getElementById('acWind');
const dropsWrap=document.getElementById('dropsWrap');
const camDot=document.getElementById('camDot');
const recordCircle=document.getElementById('recordCircle');
const btnLamp=document.getElementById('btnLamp');
const btnACToggle=document.getElementById('btnACToggle');
const tempRange=document.getElementById('tempRange');
const tempPanel=document.getElementById('tempPanel');
const btnWaterOff=document.getElementById('btnWaterOff');
const btnWaterPoco=document.getElementById('btnWaterPoco');
const btnWaterMedio=document.getElementById('btnWaterMedio');
const btnWaterMucho=document.getElementById('btnWaterMucho');
const btnCam=document.getElementById('btnCam');
const langSelect=document.getElementById('langSelect');

let lampOn=false,acOn=false,camOn=false;
let wateringMode='off';

// ======= DICCIONARIO MULTILENGUAJE =======
const dict = {
  es: {
    "panel.title": "Smart Home — Panel de Control",
    "cam.title": "📸 Cámara",
    "cam.small": "Activar indicador",
    "cam.button.on": "Activar cámara",
    "cam.button.off": "Desactivar cámara",

    "ac.title": "🌡️ Aire acondicionado",
    "ac.small": "Temperatura objetivo",
    "ac.button.on": "Encender aire",
    "ac.button.off": "Apagar aire",

    "lamp.title": "💡 Velador",
    "lamp.small": "Encender / Apagar",
    "lamp.button.on": "Encender",
    "lamp.button.off": "Apagar",

    "plant.title": "🌿 Riego",
    "plant.small": "Elegí intensidad o tocá la planta",
    "plant.off": "Apagar",
    "plant.poco": "Riego Poco",
    "plant.medio": "Riego Medio",
    "plant.mucho": "Riego Mucho"
  },
  en: {
    "panel.title": "Smart Home — Dashboard",
    "cam.title": "📸 Camera",
    "cam.small": "Activate indicator",
    "cam.button.on": "Activate camera",
    "cam.button.off": "Deactivate camera",

    "ac.title": "🌡️ Air Conditioner",
    "ac.small": "Target temperature",
    "ac.button.on": "Turn on AC",
    "ac.button.off": "Turn off AC",

    "lamp.title": "💡 Lamp",
    "lamp.small": "Turn on / off",
    "lamp.button.on": "Turn on",
    "lamp.button.off": "Turn off",

    "plant.title": "🌿 Watering",
    "plant.small": "Choose intensity or tap the plant",
    "plant.off": "Turn off",
    "plant.poco": "Low Water",
    "plant.medio": "Medium Water",
    "plant.mucho": "High Water"
  },
  pt: {
    "panel.title": "Smart Home — Painel de Controle",
    "cam.title": "📸 Câmera",
    "cam.small": "Ativar indicador",
    "cam.button.on": "Ativar câmera",
    "cam.button.off": "Desativar câmera",

    "ac.title": "🌡️ Ar-condicionado",
    "ac.small": "Temperatura alvo",
    "ac.button.on": "Ligar ar",
    "ac.button.off": "Desligar ar",

    "lamp.title": "💡 Abajur",
    "lamp.small": "Ligar / Desligar",
    "lamp.button.on": "Ligar",
    "lamp.button.off": "Desligar",

    "plant.title": "🌿 Irrigação",
    "plant.small": "Escolha a intensidade ou toque na planta",
    "plant.off": "Desligar",
    "plant.poco": "Pouca água",
    "plant.medio": "Média água",
    "plant.mucho": "Muita água"
  }
};

function updateLanguage(lang) {
  const t = dict[lang] || dict.es;

  document.getElementById("panelTitle").textContent = t["panel.title"];
  document.getElementById("camTitle").textContent = t["cam.title"];
  document.getElementById("camSmall").textContent = t["cam.small"];
  document.getElementById("btnCam").textContent = camOn ? t["cam.button.off"] : t["cam.button.on"];

  document.getElementById("acTitle").textContent = t["ac.title"];
  document.getElementById("acSmall").textContent = t["ac.small"];
  document.getElementById("btnACToggle").textContent = acOn ? t["ac.button.off"] : t["ac.button.on"];

  document.getElementById("lampTitle").textContent = t["lamp.title"];
  document.getElementById("lampSmall").textContent = t["lamp.small"];
  document.getElementById("btnLamp").textContent = lampOn ? t["lamp.button.off"] : t["lamp.button.on"];

  document.getElementById("plantTitle").textContent = t["plant.title"];
  document.getElementById("plantSmall").textContent = t["plant.small"];
  document.getElementById("btnWaterOff").textContent = t["plant.off"];
  document.getElementById("btnWaterPoco").textContent = t["plant.poco"];
  document.getElementById("btnWaterMedio").textContent = t["plant.medio"];
  document.getElementById("btnWaterMucho").textContent = t["plant.mucho"];
}



function positionOverlays(){
  const rScene=scene.getBoundingClientRect();
  function center(over,hot,dx=0,dy=0){
    const r=hot.getBoundingClientRect();
    const ow=over.offsetWidth,oh=over.offsetHeight;
    const cx=r.left+r.width/2-rScene.left-ow/2+dx;
    const cy=r.top+r.height/2-rScene.top-oh/2+dy;
    over.style.left=cx+'px';over.style.top=cy+'px';
  }
  center(lampGlow,hotLamp,0,-38);
  center(acDisplay,hotAC,0,0);
  const rAC=hotAC.getBoundingClientRect();
  const w=Math.max(120,rAC.width*0.7);
  acWind.style.width=w+'px';
  acWind.style.left=(rAC.left-rScene.left+rAC.width/2-w/2)+'px';
  acWind.style.top=(rAC.top-rScene.top+rAC.height+6)+'px';
  center(dropsWrap,hotPlant,0,-22);
  const rCam=hotCam.getBoundingClientRect();const dot=14,circ=44;
  camDot.style.width=camDot.style.height=dot+'px';
  if (window.innerWidth <= 600) {
  recordCircle.style.display = "none";
  recordCircle.style.opacity = "0";
  recordCircle.style.visibility = "hidden";
  return; // 🔥 evita que el JS siga reposicionando el recordCircle
}
  recordCircle.style.width=recordCircle.style.height=circ+'px';
  // Ajuste especial para móviles
// 🔹 Ajustes personalizados del círculo de la cámara
const ajusteX = 0;   // ➡️ positivo lo mueve a la derecha, negativo a la izquierda
const ajusteY = 0;   // ⬆️ negativo lo sube, positivo lo baja

recordCircle.style.left = (rCam.left - rScene.left + rCam.width / 2 - circ / 2 + ajusteX) + 'px';
recordCircle.style.top  = (rCam.top - rScene.top + rCam.height / 2 - circ / 2 + ajusteY) + 'px';
recordCircle.classList.add("recordCircle-offset");
}

function setLamp(state)
{lampOn=state;scene.classList.toggle('lamp-on',state);btnLamp.textContent=state?'Apagar':'Encender';}

function setAC(state)
{acOn=state;scene.classList.toggle('ac-on',state);btnACToggle.textContent=state?'Apagar aire':'Encender aire';
  tempRange.disabled=!state;}

function setTemp(val)
{tempPanel.textContent=val+'°C';acDisplay.textContent=val+'°C';}

function setWaterMode(mode)
{if(mode==='off')
  {wateringMode='off';scene.classList.remove('watering','watering-poco','watering-medio','watering-mucho');return;}
wateringMode=mode;scene.classList.add('watering');
scene.classList.remove('watering-poco','watering-medio','watering-mucho');
scene.classList.add('watering-'+mode);}


function setCam(state) {
  camOn = state;
  scene.classList.toggle('cam-on', state);

  const isMobile = window.innerWidth <= 600;
  const ledPc = document.getElementById('recordCircle');
  const ledMobile = document.getElementById('recordCircleMobile');

  // Actualiza el texto del botón
  btnCam.textContent = state ? 'Desactivar cámara' : 'Activar cámara';

  // 🔹 Solo muestra el LED correspondiente
  if (state) {
    if (isMobile) {
      ledMobile.classList.add('active');
      ledMobile.style.display = 'block';
      ledPc.style.display = 'none';
    } else {
      ledPc.classList.add('active');
      ledPc.style.display = 'block';
      ledMobile.style.display = 'none';
    }
  } else {
    ledPc.classList.remove('active');
    ledMobile.classList.remove('active');
    ledPc.style.display = 'none';
    ledMobile.style.display = 'none';
  }
}

// Eventos
hotCam.onclick = () => setCam(!camOn);
btnCam.onclick = () => setCam(!camOn);

  




hotLamp.onclick=()=>setLamp(!lampOn);btnLamp.onclick=()=>setLamp(!lampOn);
hotAC.onclick=()=>setAC(!acOn);btnACToggle.onclick=()=>setAC(!acOn);
tempRange.oninput=e=>{setTemp(e.target.value);if(!acOn)setAC(true);};
btnWaterOff.onclick=()=>setWaterMode('off');
btnWaterPoco.onclick=()=>setWaterMode('poco');
btnWaterMedio.onclick=()=>setWaterMode('medio');
btnWaterMucho.onclick=()=>setWaterMode('mucho');
hotPlant.onclick=()=>
  {const next=wateringMode==='off'?'poco':wateringMode==='poco'?'medio':wateringMode==='medio'?'mucho':'off';setWaterMode(next);};
hotCam.onclick=()=>setCam(!camOn);btnCam.onclick=()=>setCam(!camOn);

window.addEventListener('resize',positionOverlays);

window.addEventListener('load', () => {
  const savedLang = localStorage.getItem('lang') || 'es';
  langSelect.value = savedLang;
  positionOverlays();
  setLamp(false);
  setAC(false);
  setTemp(tempRange.value);
  setWaterMode('off');
  setCam(false);
  updateLanguage(savedLang);
});

langSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  updateLanguage(lang);
  localStorage.setItem('lang', lang); // guarda preferencia
});
