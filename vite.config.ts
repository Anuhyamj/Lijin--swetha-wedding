import {defineConfig,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {wedding as w} from './src/config/wedding'
export default defineConfig(({mode})=>{const env=loadEnv(mode,process.cwd(),'');const url=(env.VITE_SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:'')).replace(/\/$/,'');return {base:'./',plugins:[react(),tailwindcss(),{name:'wedding-meta',transformIndexHtml(html){return html.replaceAll('__SITE_URL__',url).replaceAll('__TITLE__',`${w.couple.first} &amp; ${w.couple.second} | Wedding Invitation`)}}],build:{chunkSizeWarningLimit:600}}})
