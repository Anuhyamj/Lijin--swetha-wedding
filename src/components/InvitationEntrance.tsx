import {useRef,useState} from 'react'
import {AnimatePresence,motion,useReducedMotion} from 'motion/react'
import App from '../App'
import BackgroundMusic,{type MusicHandle} from './BackgroundMusic'
import {wedding as w} from '../config/wedding'
import {ease,formatDate} from '../lib/utils'
import {Arrow,Heart} from './Atmosphere'

function BotanicalCorner(){return <svg className="entrance-botanical" viewBox="0 0 220 260" fill="none" aria-hidden="true"><path d="M12 250C24 184 51 141 93 103S164 40 202 10M50 157C22 127 29 103 24 80M92 104C89 71 104 45 107 28M137 66C164 76 184 65 204 57M29 203C60 198 79 181 84 162"/><path d="M45 165C16 162 9 140 15 122C34 128 43 144 45 165ZM61 139C66 114 78 103 92 104C92 125 79 139 61 139ZM106 91C115 66 131 58 145 63C140 83 123 92 106 91ZM147 57C145 34 157 19 170 17C173 34 161 50 147 57ZM34 195C35 171 28 160 17 157C12 174 20 189 34 195Z"/></svg>}

export default function InvitationEntrance(){
 const [opened,setOpened]=useState(!w.entrance.enabled)
 const reduced=useReducedMotion(),invitationRef=useRef<HTMLDivElement>(null),musicRef=useRef<MusicHandle>(null)
 const open=()=>{musicRef.current?.play();window.scrollTo({top:0,behavior:'instant'});setOpened(true)}
 return <><BackgroundMusic ref={musicRef} visible={opened}/><AnimatePresence mode="wait" initial={false}>{opened?
  <motion.div key="invitation" ref={invitationRef} tabIndex={-1} className="opened-invitation" initial={{opacity:reduced?1:0}} animate={{opacity:1}} transition={{duration:reduced?0:.65,ease}} onAnimationComplete={()=>invitationRef.current?.focus({preventScroll:true})}><App/></motion.div>:
  <motion.main key="entrance" className="invitation-entrance grain" aria-labelledby="entrance-names" exit={{opacity:0,scale:reduced?1:1.015}} transition={{duration:reduced?0:.65,ease}}>
   <div className="entrance-frame" aria-hidden="true"/>
   <BotanicalCorner/><div className="entrance-corner-mirror"><BotanicalCorner/></div>
   <div className="entrance-content">
    <p className="eyebrow entrance-kicker">{w.entrance.eyebrow}</p>
    <div className="entrance-seal" aria-hidden="true"><span>{w.couple.first[0]}<em>&</em>{w.couple.second[0]}</span><Heart/></div>
    <p className="eyebrow entrance-intro">{w.entrance.title}</p>
    <h1 id="entrance-names"><span>{w.couple.first}</span><em>&</em><span>{w.couple.second}</span></h1>
    <div className="entrance-ornament" aria-hidden="true"><span/><Heart/><span/></div>
    <p className="entrance-message">{w.entrance.message}</p>
    <button className="entrance-open" onClick={open}>{w.entrance.button}<Arrow/></button>
    <p className="eyebrow entrance-date">{formatDate(w.ceremony.date,{day:'numeric',month:'long',year:'numeric'})}</p>
   </div>
  </motion.main>
 }</AnimatePresence></>
}
