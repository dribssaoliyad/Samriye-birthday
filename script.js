const birthday = new Date('2026-10-27T00:00:00');
const $ = (id) => document.getElementById(id);
function updateCountdown(){
  const now = new Date();
  let diff = birthday - now;
  if(diff <= 0){
    $('days').textContent='♥'; $('hours').textContent='♥'; $('minutes').textContent='♥'; $('seconds').textContent='♥';
    $('countdownNote').textContent = now.toDateString() === birthday.toDateString()
      ? "It's your birthday today, my love! Happy birthday, Samri! ❤️"
      : "Your birthday has arrived — and you deserve to be celebrated every day. ❤️";
    return;
  }
  const d=Math.floor(diff/86400000); diff%=86400000;
  const h=Math.floor(diff/3600000); diff%=3600000;
  const m=Math.floor(diff/60000); const s=Math.floor((diff%60000)/1000);
  $('days').textContent=d; $('hours').textContent=String(h).padStart(2,'0');
  $('minutes').textContent=String(m).padStart(2,'0'); $('seconds').textContent=String(s).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

function confetti(count=100){
  const layer=$('confettiLayer'); const colors=['#87334a','#d98c9b','#e6bf83','#f2d9d4','#9e5267','#fff'];
  for(let i=0;i<count;i++){
    const piece=document.createElement('span'); piece.className='confetti';
    piece.style.left=Math.random()*100+'%'; piece.style.background=colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDelay=(Math.random()*0.8)+'s'; piece.style.animationDuration=(2.1+Math.random()*2)+'s';
    piece.style.transform=`rotate(${Math.random()*360}deg)`; layer.appendChild(piece);
    setTimeout(()=>piece.remove(),5000);
  }
}
$('openSurprise').addEventListener('click',()=>{
  $('letter').scrollIntoView({behavior:'smooth'});
  confetti(45); showToast('A little piece of my heart, just for you ❤️');
});
$('celebrate').addEventListener('click',()=>{confetti(140);showToast('Happy birthday, Samri! You deserve all the beautiful things 🎉')});
let candlesOut=0;
document.querySelectorAll('.candle').forEach(c=>c.addEventListener('click',()=>{
  if(c.classList.contains('lit')){c.classList.remove('lit');candlesOut++;
    if(candlesOut===3){$('wishMessage').textContent='Wish made! May all your beautiful dreams come true, my love. ❤️';confetti(100)}
    else $('wishMessage').textContent=`${3-candlesOut} candle${3-candlesOut===1?'':'s'} left… make your wish ✨`;
  }
}));
function openGift(){
  $('secretMessage').hidden=false;
  $('secretMessage').scrollIntoView({behavior:'smooth',block:'center'});
  confetti(70); showToast('A secret message, from me to you 💌');
}
$('giftBox').addEventListener('click',openGift);
$('giftBox').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGift()}});

function showToast(message){const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),3000)}

// A soft, original ambient tone is generated in the browser. No song file is bundled.
// Browsers require the user to tap the music button before audio can play.
let audioContext=null, musicNodes=[], musicOn=false, musicTimer=null, noteIndex=0;
const notes=[261.63,329.63,392.00,329.63,293.66,349.23,440.00,349.23];
function playNote(){
  if(!musicOn||!audioContext)return;
  const osc=audioContext.createOscillator(), gain=audioContext.createGain();
  osc.type='sine'; osc.frequency.value=notes[noteIndex++%notes.length];
  gain.gain.setValueAtTime(0.0001,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035,audioContext.currentTime+0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001,audioContext.currentTime+0.8);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+0.85);
}
$('musicToggle').addEventListener('click',async()=>{
  if(!musicOn){
    try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();await audioContext.resume();
      musicOn=true;$('musicToggle').setAttribute('aria-pressed','true');$('musicToggle').innerHTML='♫ <span>Music on</span>';
      playNote();musicTimer=setInterval(playNote,900);showToast('A soft little melody for you ♫');
    }catch(e){showToast('Audio is not available in this browser.');}
  }else{
    musicOn=false;clearInterval(musicTimer);if(audioContext)audioContext.suspend();
    $('musicToggle').setAttribute('aria-pressed','false');$('musicToggle').innerHTML='♫ <span>Music</span>';
  }
});
