import {wedding as w} from '../config/wedding'
export const ease=[0.22,1,0.36,1] as const
export const asset=(path:string)=>/^(https?:|data:|blob:)/.test(path)?path:`${import.meta.env.BASE_URL}${path.replace(/^\//,'')}`
export const eventDate=(date:string,time='00:00')=>new Date(`${date}T${time}:00${w.timeZoneOffset}`)
export const formatDate=(date:string,options:Intl.DateTimeFormatOptions={day:'numeric',month:'long',year:'numeric'})=>new Intl.DateTimeFormat('en-GB',{...options,timeZone:w.timeZone}).format(eventDate(date))
export const formatTime=(date:string,time:string)=>new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:w.timeZone}).format(eventDate(date,time))
export function youtubeId(value:string){try{const u=new URL(value);if(u.hostname==='youtu.be')return u.pathname.split('/')[1];if(['youtube.com','www.youtube.com','m.youtube.com'].includes(u.hostname))return u.searchParams.get('v')||u.pathname.match(/\/(?:embed|shorts)\/([\w-]+)/)?.[1]||null}catch{}return null}
