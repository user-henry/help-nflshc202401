// functions/api/ai.js
// 代理 AI Search 请求，解决 CORS 问题

export async function onRequest(context) {
    const { request } = context;
    
    // 获取请求路径
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/ai', '');
    
    // 只处理 POST 请求
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
        });
    }
    
    // 目标 AI Search 公开端点
    const targetUrl = `https://2c177107-5a66-4ac2-bf55-04f0bcad8fef.search.ai.cloudflare.com${path}`;
    
    try {
        // 转发请求到 AI Search
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: request.body,
        });
        
        const data = await response.json();
        
        // 返回响应并添加 CORS 头
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}
