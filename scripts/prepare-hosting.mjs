import {mkdir,copyFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
const directory=fileURLToPath(new URL('../dist/.openai/',import.meta.url))
await mkdir(directory,{recursive:true})
await copyFile(new URL('../.openai/hosting.json',import.meta.url),new URL('../dist/.openai/hosting.json',import.meta.url))
