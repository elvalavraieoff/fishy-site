exports.handler = async () => {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!res.ok) throw new Error(`Discord API ${res.status}`);

    const guilds = await res.json();
    const serverCount = guilds.length;

    const userEstimate = serverCount * 20;

    // Récupération du nombre de commandes slash du bot
    let commandCount = 0;
    try {
      const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
      const cmdRes = await fetch(`https://discord.com/api/v10/applications/${CLIENT_ID}/commands`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      if (cmdRes.ok) {
        const commands = await cmdRes.json();
        commandCount = Array.isArray(commands) ? commands.length : 0;
      }
    } catch (_) {}

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        servers: serverCount,
        users: userEstimate,
        commands: commandCount
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
