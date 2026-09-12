import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'
const root=fileURLToPath(new URL('..',import.meta.url))
const npmCli=process.env.npm_execpath
if(!npmCli)throw new Error('Start with npm run dev.')
const children=['backend','frontend'].map(directory=>spawn(process.execPath,[npmCli,'--prefix',directory,'run','dev'],{cwd:root,stdio:'inherit'}))
let stopping=false
function stop(code=0){
  if(stopping)return
  stopping=true
  for(const child of children){
    if(!child.pid)continue
    if(process.platform==='win32')spawn('taskkill',['/PID',String(child.pid),'/T','/F'],{stdio:'ignore'})
    else child.kill('SIGTERM')
  }
  process.exitCode=code
}
for(const child of children){child.on('error',()=>stop(1));child.on('exit',code=>stop(code??1))}
process.on('SIGINT',()=>stop())
process.on('SIGTERM',()=>stop())
