import {createServer} from 'node:http'
import {Readable} from 'node:stream'
import {readFile, stat} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {resolve, extname, sep} from 'node:path'
import {handleRequest} from './app.ts'

const host = process.env.HOST || '127.0.0.1', port = Number(process.env.PORT || 3001)
const publicRoot = fileURLToPath(new URL('../../dist/client/', import.meta.url))
const mime: Record<string, string> = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon'}
async function assets(request: Request) {
  let path: string
  try {path = decodeURIComponent(new URL(request.url).pathname)} catch {return new Response('Bad path', {status: 400})}
  const target = resolve(publicRoot, '.' + (path === '/' ? '/index.html' : path))
  if (!target.startsWith(publicRoot.endsWith(sep) ? publicRoot : publicRoot + sep)) return new Response('Forbidden', {status: 403})
  try {
    if (!(await stat(target)).isFile()) return new Response('Not found', {status: 404})
    return new Response(await readFile(target), {headers: {'Content-Type': mime[extname(target)] || 'application/octet-stream'}})
  } catch {return new Response('Build the frontend first, or use npm run dev.', {status: 404})}
}
const server = createServer(async (incoming, outgoing) => {
  try {
    const headers = new Headers()
    for (const [key, value] of Object.entries(incoming.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value)
    const init: RequestInit & {duplex?: 'half'} = {method: incoming.method, headers}
    if (!['GET', 'HEAD'].includes(incoming.method || 'GET')) {init.body = Readable.toWeb(incoming) as ReadableStream<Uint8Array>; init.duplex = 'half'}
    const request = new Request(`http://${host}:${port}${incoming.url || '/'}`, init)
    const path = new URL(request.url).pathname
    const response = path === '/api' || path.startsWith('/api/') ? await handleRequest(request, process.env) : await assets(request)
    outgoing.statusCode = response.status
    response.headers.forEach((value, key) => {if (key !== 'set-cookie') outgoing.setHeader(key, value)})
    const cookies = response.headers.getSetCookie(); if (cookies.length) outgoing.setHeader('Set-Cookie', cookies)
    if (request.method === 'HEAD' || !response.body) outgoing.end()
    else {
      const stream = Readable.fromWeb(response.body as import('node:stream/web').ReadableStream)
      stream.on('error', () => outgoing.destroy())
      outgoing.on('close', () => stream.destroy())
      stream.pipe(outgoing)
    }
  } catch {outgoing.statusCode = 500; outgoing.end('Request could not be completed.')}
})
server.requestTimeout = 120000
server.listen(port, host, () => {
  const address = server.address()
  console.log(`KampüsKit API: http://${host}:${typeof address === 'object' && address ? address.port : port}`)
})
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => server.close(() => process.exit(0)))
