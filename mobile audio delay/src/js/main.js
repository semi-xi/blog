
let audio = document.querySelector('#audio1');

function play(){
    audio.play();
    document.addEventListener('touchstart',play,false);
    document.querySelector('.timelog').innerHTML='开始播放'+(i++);
}
audio.play();
document.addEventListener('touchstart',play);
let i=0;
let audio2 = document.querySelector('#audio2');
audio2.addEventListener('canplaythrough',loadAudio)

function loadAudio(){
        document.querySelector('.timelog').innerHTML = '加载完成';

}
document.querySelector('.btn-play').addEventListener('click',function(ev) {

    audio.play();
    // audio2.play();
    document.querySelector('.timelog').innerHTML='开始播放'+(i++);
    ev.stopPropagation();
    return false;
})
