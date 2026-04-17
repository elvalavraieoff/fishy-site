exports.handler = async () => {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  try {
    const res = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!res.ok) throw new Error(`Discord API ${res.status}`);

    const guilds = await res.json();
    const serverCount = guilds.length;

    // Estimation utilisateurs : somme des membres approximatifs
    // Discord ne permet pas de tout récupérer sans intent GUILD_MEMBERS
    const userEstimate = serverCount * 20;

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        servers: serverCount,
        users: userEstimate
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