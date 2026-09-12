import {createClient} from '@supabase/supabase-js'
const url=import.meta.env.VITE_SUPABASE_URL
const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const configured=!!(url&&key)
export const supabase=configured?createClient(url,key,{auth:{flowType:'pkce',detectSessionInUrl:false,persistSession:true,autoRefreshToken:true}}):null
export const authRedirect=()=>window.location.origin+'/'
let callbackPromise:Promise<void>|undefined
function replaceRoute(path:string){window.history.replaceState({},'',path);window.dispatchEvent(new PopStateEvent('popstate'))}
export function handleAuthCallback(){return callbackPromise??=exchangeCallback()}
async function exchangeCallback(){if(!supabase)return;const url=new URL(window.location.href);const code=url.searchParams.get('code');const kind=url.searchParams.get('flow');const error=url.searchParams.get('error_description');if(error){sessionStorage.setItem('auth_error',error);replaceRoute(url.pathname+'#/giris');return}if(code){const {error}=await supabase.auth.exchangeCodeForSession(code);if(error)sessionStorage.setItem('auth_error',error.message);replaceRoute(url.pathname+(error?'#/giris':kind==='recovery'?'#/sifre-yenile':'#/app'))}}
