import {forwardRef,useImperativeHandle,useRef,useState} from 'react'
import {wedding as w} from '../config/wedding'
import {asset} from '../lib/utils'

export type MusicHandle={play:()=>void}

// Keep one audio element mounted across the cover transition. Calling play()
// directly in the opening click preserves the user gesture on mobile browsers.
const BackgroundMusic=forwardRef<MusicHandle,{visible:boolean}>(({visible},ref)=>{
 const audioRef=useRef<HTMLAudioElement>(null)
 const [playing,setPlaying]=useState(false)
 const play=()=>{
  const audio=audioRef.current
  if(!audio||!w.music.enabled)return
  audio.volume=Math.min(1,Math.max(0,w.music.volume))
  void audio.play().catch(()=>setPlaying(false))
 }
 useImperativeHandle(ref,()=>({play}))
 if(!w.music.enabled)return null
 const label=playing?w.music.pauseLabel:w.music.playLabel
 return <>
  <audio ref={audioRef} src={asset(w.music.src)} preload="none" loop={w.music.loop} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>setPlaying(false)}/>
  {visible&&<button type="button" className={`music-toggle${playing?' is-playing':''}`} aria-label={label} aria-pressed={playing} title={label} onClick={()=>{if(audioRef.current?.paused)play();else audioRef.current?.pause()}}>
   <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 17V6l10-2v11M10 9l10-2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/><ellipse cx="7" cy="17.8" rx="3" ry="2.3" fill="currentColor"/><ellipse cx="17" cy="15.8" rx="3" ry="2.3" fill="currentColor"/>{!playing&&<path d="M4 4l17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}</svg>
   <span className="music-state" aria-hidden="true"/>
  </button>}
 </>
})
BackgroundMusic.displayName='BackgroundMusic'
export default BackgroundMusic
