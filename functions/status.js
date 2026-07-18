export async function onRequest(context) {
    const { request, env } = context;

    // APIキー（Cloudflareの環境変数に設定）
    const API_KEY = env.API_KEY;

    // ------------------------
    // GET /status
    // ------------------------
    if (request.method === "GET") {

        const raw = await env.STATUS.get("server");

        if (!raw) {
            return Response.json({
                online: false,
                name: "yusk0's 1.6 server",
                map: "-",
                players: 0,
                maxplayers: 10,
                vac: true,
                os: "Windows"
            });
        }

        const data = JSON.parse(raw);

        // 最終更新から15秒以上ならOFFLINE
        const now = Date.now();

        if (now - data.last_update > 15000) {

            data.online = false;

            data.players = 0;

            data.map = "-";

        }

        delete data.last_update;

        return Response.json(data);
    }

    // ------------------------
    // POST /status
    // ------------------------
    if (request.method === "POST") {

        const key = request.headers.get("X-API-Key");

        if (key !== API_KEY) {

            return new Response("Unauthorized", {
                status: 401
            });

        }

        const body = await request.json();

        body.last_update = Date.now();

        await env.STATUS.put(
            "server",
            JSON.stringify(body)
        );

        return Response.json({
            success: true
        });

    }

    return new Response("Method Not Allowed", {
        status: 405
    });

}