import {readFile,readdir} from 'node:fs/promises'
import assert from 'node:assert/strict'
const root=new URL('../',import.meta.url)
const folder=repo=>new URL(repo+'/packages/shared/',root)
const left=folder('frontend'),right=folder('backend')
const files=await readdir(new URL('src/',left))
assert.deepEqual(files.sort(),(await readdir(new URL('src/',right))).sort(),'Shared contract file lists differ')
for(const file of ['package.json',...files.map(name=>'src/'+name)]) {
 assert.equal(await readFile(new URL(file,left),'utf8'),await readFile(new URL(file,right),'utf8'),`Shared contract differs: ${file}`)
}
console.log('Frontend and backend shared contract snapshots match.')
