import type {Point} from './place-ranking'
export const mapsConfigured=Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
let loading:Promise<void>|null=null
export function loadMaps(){
 if(loading)return loading
 if(!mapsConfigured)return Promise.reject(new Error('Harita bağlantısı henüz yapılandırılmadı.'))
 loading=new Promise<void>((resolve,reject)=>{
  const win=window as unknown as {kampuskitMapsReady?:()=>void;gm_authFailure?:()=>void}
  const script=document.createElement('script')
  const fail=()=>{clearTimeout(timer);loading=null;script.remove();reject(new Error('Google Maps yüklenemedi. Bağlantıyı veya Google Cloud API ve alan adı izinlerini kontrol et.'))}
  const timer=setTimeout(fail,20000)
  win.kampuskitMapsReady=()=>{clearTimeout(timer);resolve()}
  win.gm_authFailure=()=>{fail();window.dispatchEvent(new Event('kampuskit:maps-error'))}
  script.src='https://maps.googleapis.com/maps/api/js?'+new URLSearchParams({key:import.meta.env.VITE_GOOGLE_MAPS_API_KEY,v:'quarterly',loading:'async',language:'tr',region:'TR',callback:'kampuskitMapsReady'})
  script.async=true;script.onerror=fail;document.head.append(script)
 })
 return loading
}
export interface GooglePlace {id:string;name:string;address:string;point:Point;price:number|null;rating:number|null;count:number;url:string;attributions:{name:string;url:string|null}[]}
export async function nearbyPlaces(center:Point,radius:number,category:string):Promise<GooglePlace[]>{
 await loadMaps()
 const {Place,SearchNearbyRankPreference}=await google.maps.importLibrary('places') as google.maps.PlacesLibrary
 const {places}=await Place.searchNearby({fields:['id','displayName','formattedAddress','location','priceLevel','rating','userRatingCount','googleMapsURI','attributions'],locationRestriction:{center,radius:Math.min(5000,Math.max(500,radius))},includedPrimaryTypes:[category],maxResultCount:20,rankPreference:SearchNearbyRankPreference.DISTANCE})
 const prices:Record<string,number>={FREE:0,INEXPENSIVE:1,MODERATE:2,EXPENSIVE:3,VERY_EXPENSIVE:4}
 return places.filter(p=>p.location).map(p=>({id:p.id,name:p.displayName||'İsimsiz mekan',address:p.formattedAddress||'',point:p.location!.toJSON(),price:p.priceLevel!=null?(prices[p.priceLevel]??null):null,rating:p.rating??null,count:p.userRatingCount??0,url:p.googleMapsURI||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.displayName||'')+'&query_place_id='+encodeURIComponent(p.id),attributions:(p.attributions||[]).map(a=>({name:a.provider||"Google Maps",url:a.providerURI}))}))
}
