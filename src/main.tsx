import React from 'react'
import ReactDOM from 'react-dom/client'
import {MotionConfig} from 'motion/react'
import InvitationEntrance from './components/InvitationEntrance'
import './style.css'
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><MotionConfig reducedMotion="user"><InvitationEntrance/></MotionConfig></React.StrictMode>)
