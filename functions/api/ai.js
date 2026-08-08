// functions/api/ai.js
// 同源代理：接收 /api/ai/* 请求，转发到真实 AI 网关 https://ai.nflshcchat.cc.cd
// 真实接口：
//   POST /chat/completions  兼容 OpenAI 的聊天
//   POST /search            搜索查询

const TARGET_ORIGIN = 'https://ai.nflshcchat.cc.cd';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

export async function onRequest(context) {
    const { request } = context;

    // 处理预检 OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    // 去掉 /api/ai 前缀，得到真实网关路径（如 /chat/completions、/search）
    let path = url.pathname.replace(/^\/api\/ai/, '');
    if (!path.startsWith('/')) path = '/' + path;

    const targetUrl = `${TARGET_ORIGIN}${path}`;

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: request.body,
        });

        const contentType = response.headers.get('content-type') || 'application/json';
        const body = contentType.includes('application/json')
            ? JSON.stringify(await response.json())
            : await response.text();

        return new Response(body, {
            status: response.status,
            headers: {
                'Content-Type': contentType,
                ...CORS_HEADERS,
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...CORS_HEADERS,
            },
        });
    }
}

// 兼容旧式导出
export async function onRequestOptions() {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
}
