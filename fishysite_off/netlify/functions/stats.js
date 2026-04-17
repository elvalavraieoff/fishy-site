exports.handler = async () => {
  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

  try {
    // Récupère tous les serveurs
    const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds?limit=200', {
      headers: { Authorization: `Bot ${BOT_TOKEN}` }
    });

    if (!guildsRes.ok) throw new Error(`Discord API ${guildsRes.status}`);

    const guilds = await guildsRes.json();
    const serverCount = guilds.length;

    let totalUsers = 0;
    for (const guild of guilds) {
      const guildRes = await fetch(`https://discord.com/api/v10/guilds/${guild.id}?with_counts=true`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
      });
      if (guildRes.ok) {
        const guildData = await guildRes.json();
        totalUsers += guildData.approximate_member_count ?? 0;
      }
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        servers: serverCount,
        users: totalUsers
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
