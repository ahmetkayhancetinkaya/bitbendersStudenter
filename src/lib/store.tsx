import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from 'react'
import type {ReactNode} from 'react'
import type {Session} from '@supabase/supabase-js'
import {useLocation} from 'react-router-dom'
import {supabase,handleAuthCallback} from './supabase'
import {createExampleData,demoProfile,demoUser} from './seed'
import {emptyData,tableNames} from './types'
import type {DatabaseState,Profile,TableName,TableRows,Internship} from './types'
import {validateUpload} from './domain'
type WriteInput<K extends TableName>=Partial<TableRows[K]>
interface Store {data:DatabaseState;profile:Profile|null;session:Session|null;userId:string|null;demo:boolean;ready:boolean;loading:boolean;error:string;notice:string;universityId:string;setUniversityId:(id:string)=>void;refresh:()=>Promise<void>;notify:(text:string)=>void;save:<K extends TableName>(table:K,row:WriteInput<K>,id?:string)=>Promise<void>;remove:(table:TableName,id:string)=>Promise<void>;saveProfile:(row:Omit<Profile,'id'>)=>Promise<void>;upload:(file:File,bucket:'notes'|'listing-images')=>Promise<string>;download:(bucket:string,path:string,name:string)=>Promise<void>}
const Context=createContext<Store|null>(null)
export function StoreProvider({children}:{children:ReactNode}){
const location=useLocation(),demo=location.pathname.startsWith('/demo')
const sampleData=useMemo(createExampleData,[])
const [imported,setImported]=useState<Internship[]>([])
const examples=useMemo(()=>({...sampleData,internships:[...imported,...sampleData.internships]}),[sampleData,imported])
useEffect(()=>{let alive=true;if(demo&&supabase)void supabase.rpc('public_imported_internships').then(({data,error})=>{if(alive&&!error)setImported(data as Internship[])});return()=>{alive=false}},[demo])
const [data,setData]=useState(emptyData),[profile,setProfile]=useState<Profile|null>(null),[session,setSession]=useState<Session|null>(null),[ready,setReady]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[universityId,setUniversity]=useState(examples.universities[0].id)
const sessionRef=useRef<Session|null>(null),epoch=useRef(0),refreshSequence=useRef(0),universityOwner=useRef<string|null>(null)
const notify=useCallback((text:string)=>setNotice(text),[])
useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),4500);return()=>clearTimeout(t)},[notice])
useEffect(()=>{const owner=demo?'demo':session?.user.id;if(!owner||(!demo&&!profile))return;if(universityOwner.current===owner)return;universityOwner.current=owner;const options=demo?examples.universities:data.universities;const saved=localStorage.getItem('kampuskit.university.'+owner);setUniversity(options.some(u=>u.id===saved)?saved!:(demo?demoProfile:profile)!.university_id)},[demo,session?.user.id,profile,examples,data.universities])
const setUniversityId=(id:string)=>{setUniversity(id);localStorage.setItem('kampuskit.university.'+(demo?'demo':sessionRef.current?.user.id||'guest'),id)}
const refresh=useCallback(async()=>{const client=supabase,user=sessionRef.current?.user,version=epoch.current,request=++refreshSequence.current;if(!client||!user)return
try{const result=await Promise.all(tableNames.map(async table=>{const {data:rows,error}=await client.from(table).select(table==='reminder_jobs'?'id,calendar_id,user_id,state,last_error':'*');if(error)throw error;return[table,rows] as const}));const p=await client.from('profiles').select('*').eq('id',user.id).maybeSingle();if(p.error)throw p.error;if(version!==epoch.current||request!==refreshSequence.current)return;setData(Object.fromEntries(result) as unknown as DatabaseState);setProfile(p.data as Profile|null);setError('')}catch(err){if(version===epoch.current&&request===refreshSequence.current)setError('Veriler yüklenemedi. Bağlantıyı kontrol edip yeniden dene. '+errorText(err))}finally{if(version===epoch.current&&request===refreshSequence.current)setLoading(false)}},[])
useEffect(()=>{let alive=true;const apply=(s:Session|null)=>{if(!alive)return;const changed=sessionRef.current?.user.id!==s?.user.id;if(changed){epoch.current++;setData(emptyData());setProfile(null);setError('')}sessionRef.current=s;setSession(s);setReady(true);if(s){setLoading(changed);void refresh()}}
if(!supabase){setReady(true);return}const client=supabase;void handleAuthCallback().then(()=>client.auth.getSession()).then(({data,error})=>{if(error)setError(error.message);apply(data.session)})
const {data:sub}=client.auth.onAuthStateChange((_event,s)=>{setTimeout(()=>apply(s),0)})
return()=>{alive=false;epoch.current++;sub.subscription.unsubscribe()}},[refresh])
useEffect(()=>{if(!session||demo)return;const onFocus=()=>void refresh();window.addEventListener('focus',onFocus);const timer=setInterval(onFocus,60000);return()=>{clearInterval(timer);window.removeEventListener('focus',onFocus)}},[session,demo,refresh])
function requireClient(){if(demo)throw new Error('Bu alan örnek içeriklerle gezilir. Kendi kayıtlarını oluşturmak için hesabına giriş yap.');if(!supabase||!sessionRef.current)throw new Error('İşlemi kaydetmek için hesabına giriş yap.');return supabase}
async function save<K extends TableName>(table:K,row:WriteInput<K>,id?:string){const client=requireClient();const result=id?await client.from(table).update(row as Record<string, unknown>).eq('id',id).select('id'):await client.from(table).insert({...row,user_id:sessionRef.current!.user.id}).select('id');if(result.error)throw result.error;if(!result.data?.length)throw new Error('Bu kaydı değiştirme yetkin bulunmuyor.');await refresh();notify(id?'Değişiklikler kaydedildi.':'Kaydedildi.')}
async function remove(table:TableName,id:string){const client=requireClient();const {data,error}=await client.from(table).delete().eq('id',id).select('id');if(error)throw error;if(!data?.length)throw new Error('Kayıt bulunamadı veya yetkin yok.');await refresh();notify('Kayıt silindi.')}
async function saveProfile(row:Omit<Profile,'id'>){const client=requireClient();const {error}=await client.from('profiles').upsert({...row,id:sessionRef.current!.user.id});if(error)throw error;setUniversityId(row.university_id);await refresh();notify('Profilin kaydedildi.')}
async function upload(file:File,bucket:'notes'|'listing-images'){const client=requireClient();validateUpload(file,bucket);const extension=file.type==='application/pdf'?'pdf':file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';const path=sessionRef.current!.user.id+'/'+crypto.randomUUID()+'.'+extension;const {error}=await client.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type});if(error)throw error;return path}
async function download(bucket:string,path:string,name:string){const client=requireClient();const {data,error}=await client.storage.from(bucket).download(path);if(error)throw error;const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000)}
const value:Store={data:demo?examples:data,profile:demo?demoProfile:profile,session,userId:demo?demoUser:session?.user.id??null,demo,ready,loading,error:demo?'':error,notice,universityId,setUniversityId,refresh,notify,save,remove,saveProfile,upload,download}
return <Context.Provider value={value}>{children}</Context.Provider>}
export function useStore(){const store=useContext(Context);if(!store)throw new Error('Store missing');return store}
export function errorText(err:unknown){if(err&&typeof err==='object'&&'message' in err)return String(err.message);return 'İşlem tamamlanamadı. Yeniden deneyebilirsin.'}
