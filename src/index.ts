interface Env {
	MY_BUCKET: R2Bucket,
	AUTH_TOKEN: string,
  }
  
  function objectNotFound(objectName: string): Response {
	return new Response(`<html><body>R2 object "<b>${objectName}</b>" not found</body></html>`, {
	  status: 404,
	  headers: {
		'content-type': 'text/html; charset=UTF-8'
	  }
	})
  }
  
  export default {
	async fetch(request: Request, env: Env): Promise<Response> {
	  const url = new URL(request.url)
	  const objectName = url.pathname.slice(1)

	  if (request.headers.get('Authorization') !== env.AUTH_TOKEN && request.method !== 'GET' && request.method !== 'HEAD') {
		return new Response(JSON.stringify({
			error: "AUTHORISEDN'T",
			message: "unless you know what the developer's one true desire is, you cannot access this API - so go away"
		}), { status: 401, headers: {
			'content-type': 'application/json; charset=UTF-8'
		} });
	  }
  
	  console.log(`${request.method} object ${objectName}: ${request.url}`)
  
	  if (request.method === 'GET' || request.method === 'HEAD') {
		if (url.hostname !== 'img.martindev.com' && url.hostname !== 'img.martindev.xyz' && url.hostname !== 'img.mbfrias.workers.dev' && url.hostname !== 'r2-proxy.mbfrias.workers.dev') return new Response(JSON.stringify({
			error: "WRONG HOSTNAME",
			message: "this hostname does not support object retrieval - you silly goose!"
		}), { status: 400 });
		if (objectName === '') {
		  if (request.method == 'HEAD') {
			return new Response(undefined, { status: 400, headers: {
				'content-type': 'text/html; charset=UTF-8'
			} });
		  }
  
		  const options: R2ListOptions = {
			prefix: url.searchParams.get('prefix') ?? undefined,
			delimiter: url.searchParams.get('delimiter') ?? undefined,
			cursor: url.searchParams.get('cursor') ?? undefined,
			include: ['customMetadata', 'httpMetadata'],
		  }
		  console.log(JSON.stringify(options))
  
		  const listing = await env.MY_BUCKET.list(options)
		  return new Response(JSON.stringify(listing), {headers: {
			'content-type': 'application/json; charset=UTF-8',
		  }})
		}
  
		if (request.method === 'GET') {
		  const object = await env.MY_BUCKET.get(objectName, {
			range: request.headers,
			onlyIf: request.headers,
		  })
  
		  if (object === null) {
			return objectNotFound(objectName)
		  }
  
		  const headers = new Headers()
		  object.writeHttpMetadata(headers)
		  headers.set('etag', object.httpEtag)
		  if (object.range) {
			headers.set("content-range", `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`)
		  }
		  const status = object.body ? (request.headers.get("range") !== null ? 206 : 200) : 304
		  return new Response(object.body , {
			headers,
			status
		  })
		}
  
		const object = await env.MY_BUCKET.head(objectName)
  
		if (object === null) {
		  return objectNotFound(objectName)
		}
  
		const headers = new Headers()
		object.writeHttpMetadata(headers)
		headers.set('etag', object.httpEtag)
		return new Response(null, {
		  headers,
		})
	  }
	  if (request.method === 'PUT' || request.method == 'POST') {
		if (url.hostname !== 'upload.img.martindev.com' && url.hostname !== 'upload.img.martindev.xyz' && url.hostname !== 'r2-proxy.mbfrias.workers.dev') return new Response(JSON.stringify({
			error: "WRONG HOSTNAME",
			message: "this hostname does not support object uploading - you silly goose!"
		
		}), { status: 400, headers: {
			'content-type': 'application/json; charset=UTF-8'
		} });
		const object = await env.MY_BUCKET.put(objectName, request.body, {
		  httpMetadata: request.headers,
		})
		return new Response(JSON.stringify({
			success: true,
			message: "object uploaded successfully",
			url: `https://img.martindev.xyz/${object.key}`
		}), {
		  headers: {
			'etag': object.httpEtag,
		  }
		})
	  }
	  if (request.method === 'DELETE') {
		await env.MY_BUCKET.delete(url.pathname.slice(1))
		return new Response()
	  }
  
	  return new Response(`Unsupported method`, {
		status: 400
	  })
	}
  }