import {mkdir,copyFile,cp,rm} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {resolve,dirname} from 'node:path'
const root=fileURLToPath(new URL('../',import.meta.url))
const output=resolve(root,'dist')
if(dirname(output)!==resolve(root))throw new Error('Hosting output must be inside this workspace')
await rm(output,{recursive:true,force:true})
const directory=resolve(output,'.openai')
await mkdir(directory,{recursive:true})
await cp(new URL('../frontend/dist/',import.meta.url),new URL('../dist/client/',import.meta.url),{recursive:true})
await mkdir(new URL('../dist/server/',import.meta.url),{recursive:true})
await copyFile(new URL('../backend/dist/index.js',import.meta.url),new URL('../dist/server/index.js',import.meta.url))
await copyFile(new URL('../.openai/hosting.json',import.meta.url),new URL('../dist/.openai/hosting.json',import.meta.url))
