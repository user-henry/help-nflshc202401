// _worker.js —— help-nflshc202401 静态资产 Worker 的请求拦截器
// 处理 /api/ai/* 代理到真实 AI 网关 ai.nflshcchat.cc.cd，其余请求回退静态资产。
// 注意：此文件必须在 Worker 构建/部署时作为入口生效（wrangler.toml 中 main = "_worker.js" 或 assets 配置），
// 否则静态资产模式下不会执行。

const TARGET_ORIGIN = 'https://ai.nflshcchat.cc.cd';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理预检
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    // 代理 /api/ai/* -> ai.nflshcchat.cc.cd（去掉 /api/ai 前缀）
    if (url.pathname.startsWith('/api/ai')) {
      let path = url.pathname.replace(/^\/api\/ai/, '');
      if (!path.startsWith('/')) path = '/' + path;
      const target = TARGET_ORIGIN + path;

      try {
        const upstream = await fetch(target, {
          method: request.method,
          headers: { 'Content-Type': 'application/json' },
          body: request.body,
        });
        const contentType = upstream.headers.get('content-type') || 'application/json';
        const body = contentType.includes('application/json')
          ? JSON.stringify(await upstream.json())
          : await upstream.text();
        return new Response(body, {
          status: upstream.status,
          headers: { 'Content-Type': contentType, ...CORS },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...CORS },
        });
      }
    }

    // 其余请求交给静态资产（不在此处理，由平台回退）
    // 静态资产模式下，未匹配的可由 runtime 处理；此处直接尝试 fetch 原始请求
    return fetch(request);
  },
};
