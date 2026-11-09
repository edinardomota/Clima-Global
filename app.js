const $=id=>document.getElementById(id);
let current={name:"Itaboraí",admin:"Rio de Janeiro",country:"Brasil",latitude:-22.7444,longitude:-42.8594};
const codeText={0:"Céu limpo",1:"Predominantemente limpo",2:"Parcialmente nublado",3:"Nublado",45:"Nevoeiro",48:"Nevoeiro com geada",51:"Garoa leve",53:"Garoa moderada",55:"Garoa intensa",61:"Chuva fraca",63:"Chuva moderada",65:"Chuva forte",71:"Neve fraca",73:"Neve moderada",75:"Neve forte",80:"Pancadas de chuva",81:"Pancadas moderadas",82:"Pancadas fortes",95:"Trovoadas",96:"Trovoadas e granizo",99:"Trovoadas fortes"};
function iconFor(code){if([0,1].includes(code))return"☀️";if([2,3].includes(code))return"⛅";if([45,48].includes(code))return"🌫️";if([95,96,99].includes(code))return"⛈️";if(code>=51)return"🌧️";if(code>=71&&code<=77)return"❄️";return"☁️"}
async function loadWeather(){
  $("status").textContent="Atualizando previsão…";
  try{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${current.latitude}&longitude=${current.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;
    const r=await fetch(u);if(!r.ok)throw Error("Serviço indisponível");const d=await r.json(),c=d.current;
    $("place").textContent=[current.name,current.admin,current.country].filter(Boolean).join(", ");
    $("temp").textContent=Math.round(c.temperature_2m)+"°";
    $("description").textContent=codeText[c.weather_code]||"Condição variável";
    $("feels").textContent=`Sensação de ${Math.round(c.apparent_temperature)}°`;
    $("weatherIcon").textContent=iconFor(c.weather_code);
    $("humidity").textContent=c.relative_humidity_2m+"%";
    $("wind").textContent=Math.round(c.wind_speed_10m)+" km/h";
    $("rain").textContent=(d.daily.precipitation_probability_max[0]??0)+"%";
    $("updated").textContent="Atualizado: "+new Date(c.time).toLocaleString("pt-BR");
    $("forecast").innerHTML=d.daily.time.map((date,i)=>`<div class="day"><small>${i===0?"Hoje":new Date(date+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short"})}</small><div class="ico">${iconFor(d.daily.weather_code[i])}</div><b>${Math.round(d.daily.temperature_2m_max[i])}°</b><em>${Math.round(d.daily.temperature_2m_min[i])}°</em><small style="display:block;margin-top:6px">💧 ${d.daily.precipitation_probability_max[i]??0}%</small></div>`).join("");
    $("status").textContent="Previsão conectada • Open-Meteo";
  }catch(e){$("status").textContent="Não foi possível atualizar agora. Verifique sua conexão e tente novamente."}
}
async function searchCity(){
 const q=$("citySearch").value.trim();if(!q)return;
 $("status").textContent="Buscando cidade…";
 try{
  const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=pt&format=json`);
  const d=await r.json();if(!d.results?.length)throw Error("Cidade não encontrada");
  const x=d.results[0];current={name:x.name,admin:x.admin1||"",country:x.country||"",latitude:x.latitude,longitude:x.longitude};
  $("citySearch").value="";await loadWeather();document.querySelector('[data-tab="home"]').click();
 }catch(e){$("status").textContent=e.message==="Cidade não encontrada"?e.message:"Erro ao buscar cidade."}
}
async function locateMe(){
 if(!navigator.geolocation){$("status").textContent="Seu navegador não oferece localização.";return}
 $("status").textContent="Solicitando sua localização…";
 navigator.geolocation.getCurrentPosition(async pos=>{
  current={name:"Minha localização",admin:"",country:"",latitude:pos.coords.latitude,longitude:pos.coords.longitude};await loadWeather();
 },()=>{$("status").textContent="Permissão de localização negada. Você pode pesquisar uma cidade."},{enableHighAccuracy:true,timeout:12000});
}
async function loadNews(){
 $("newsList").innerHTML='<div class="placeholder">Buscando manchetes recentes…</div>';
 try{
  const query=encodeURIComponent('(weather OR climate OR storm OR flood OR drought OR hurricane)');
  const url=`https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=ArtList&format=json&sort=DateDesc&maxrecords=12`;
  const r=await fetch(url);if(!r.ok)throw Error();const d=await r.json();
  const articles=(d.articles||[]).filter(a=>a.title&&a.url);
  if(!articles.length)throw Error();
  $("newsList").innerHTML=articles.map(a=>`<a class="newsitem" href="${a.url}" target="_blank" rel="noopener"><small>${(a.source||"Fonte internacional")+" · "+(a.seendate||"").slice(0,8)}</small><b>${escapeHtml(a.title)}</b><p>${escapeHtml(a.domain||"Abrir notícia original")} ↗</p></a>`).join("");
 }catch(e){$("newsList").innerHTML='<div class="placeholder">Não foi possível carregar as manchetes agora. Tente novamente mais tarde.</div>'}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".screen").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.tab).classList.add("active");if(b.dataset.tab==="news")loadNews()}));
$("searchBtn").addEventListener("click",searchCity);$("citySearch").addEventListener("keydown",e=>{if(e.key==="Enter")searchCity()});$("locate").addEventListener("click",locateMe);$("refreshNews").addEventListener("click",loadNews);
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
loadWeather();

