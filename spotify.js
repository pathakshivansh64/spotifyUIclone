console.log("hello");
let currentsong = new Audio();
let songs;
let currfolder;


async function getsongs(folder) {
  //console.log("getfunc")
  //console.log(folder)
  currfolder=folder
  let a = await fetch(`http://127.0.0.1:5500/songs/${folder}`);
  let response = await a.text();
  //console.log(response)
  let element = document.createElement("div");
  element.innerHTML = response;
  // console.log(element)
  let tds = element.getElementsByTagName("a");
  songs = [];
  //console.log(tds)
  let myarr = Array.from(tds);
  //console.log(myarr)
  

  for (let index = 0; index < myarr.length; index++) {
    let element = myarr[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }
  //console.log(songs);
 let k=document
 .querySelector(".songlist");
 console.log("helooo   "+k.outerHTML);
  let songsUL = document
  .querySelector(".songlist")
  .getElementsByTagName("ul")[0];
  songsUL.innerHTML="";
for (const song of songs) {
  let songname = song.replaceAll("%20", " ");

  songsUL.innerHTML =
    songsUL.innerHTML +
    ` <li>
  <img class="invert size" src="music.svg" alt="music">
  <div> ${songname} </div>
  
    <h4>Play Now</h4>
    <img class="size" src="play.svg" alt="play">

  
  

</li>`;
}
//console.log("song")
//console.log(songs)


}

function convertSecondsToMinutesAndSeconds(seconds) {
 // console.log("sectomin")

  if(seconds<0 || isNaN(seconds))
  return "00:00"

  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);

  let formattedMinutes = String(minutes).padStart(2, "0");
  let formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

const playmusic = (track,pause=false) => {
  //console.log(track)
  //let audio = new Audio("/spotify/songs/"+track)
 // console.log("playmusic")
  currentsong.src = `/songs/${currfolder}` + track;
  if(!pause){
    currentsong.play();
    currentsong.volume=0.5;
    play.src = "pause.svg";
  }
 
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function main() {
  console.log("main")
   await getsongs('romance/')
   playmusic(songs[0],true)
 

  
 

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", function (event) {
      //console.log(e.querySelector('div').innerHTML)
     // console.log("clickedmusic")
      playmusic(e.querySelector("div").innerHTML.trim());
    });
  });

  play.addEventListener("click", () => {
   // console.log("clicked play")
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
  //  console.log("running currsong")
   document.querySelector(
      ".songtime"
    ).innerHTML = ` ${convertSecondsToMinutesAndSeconds(
      currentsong.currentTime
    )}/${convertSecondsToMinutesAndSeconds(currentsong.duration)}`

    document.querySelector(".circle").style.left = ((currentsong.currentTime)/(currentsong.duration)*99)+"%";
    if(currentsong.currentTime==currentsong.duration){
      play.src="play.svg"
    }

   
  });

  document.querySelector(".seekbar").addEventListener('click',e=>{
    //console.log("seekbarclicked")
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percent+"%"
    currentsong.currentTime=currentsong.duration * percent/100;
  })

  prev.addEventListener('click',function(e){
    
    //console.log("clicked prev")
    let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    if((index-1)>=0)
    playmusic(songs[index-1]);
  })

  next.addEventListener('click',function(e){
   // console.log("clicked next")
    console.log(currentsong.src.split('/').slice(-1)[0])
    console.log(songs)
    console.log(currentsong.src)
    let index = songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    
    if((index+1)<songs.length)
    playmusic(songs[index+1]);
  })
}

document.getElementById('range').addEventListener('change',function(e){
  console.log(e.target.value)
 // console.log("volume changed")
  currentsong.volume=(e.target.value)/100;
  if(currentsong.volume==0){
    document.querySelector('.volume').firstElementChild.src="mute.svg"
  }
  else if(currentsong.volume>0 && currentsong.volume <0.71){
    document.querySelector('.volume').firstElementChild.src="halfvol.svg"
  }
  else{
    document.querySelector('.volume').firstElementChild.src="volumes.svg"
  }

  
  
  
})

Array.from(document.getElementsByClassName("card1")).forEach(e=>{
  e.addEventListener('click',async item=>{
   // console.log("change")

     await getsongs(`${item.currentTarget.dataset.folder}/`);
   // console.log("change comeback")
   // console.log(songs)
     playmusic(songs[0],true);
    
    document.querySelector(".circle").style.left='0%'
    play.src = "play.svg";
  })
})

main();
