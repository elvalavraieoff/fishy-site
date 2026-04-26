export async function onRequest(context) {
  const BOT_TOKEN = context.env.DISCORD_BOT_TOKEN;
  const CLIENT_ID = context.env.DISCORD_CLIENT_ID;

  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!res.ok) throw new Error(`Discord API ${res.status}`);

    const guilds = await res.json();
    const serverCount = guilds.length;
    const userEstimate = serverCount * 20;

    // Récupération des commandes slash
    let commandCount = 0;
    try {
      const cmdRes = await fetch(`https://discord.com/api/v10/applications/${CLIENT_ID}/commands`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      if (cmdRes.ok) {
        const commands = await cmdRes.json();
        commandCount = Array.isArray(commands) ? commands.length : 0;
      }
    } catch (_) {}

    return new Response(JSON.stringify({
      servers: serverCount,
      users: userEstimate,
      commands: commandCount
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
