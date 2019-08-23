try {
    (require("./src/utils/LoaderPrototypes.js")).loader();
} catch (e) {
    console.log(e)
}

const client = new (require("./src/Client.js"))({
    autoReconnect: true,
    fetchAllMembers: true,
    disableEveryone: false,
    restWsBridgeTimeout: 10000,
    restTimeOffset: 2000,
    messageCacheMaxSize: 2024,
    messageCacheLifetime: 1680,
    messageSweepInterval: 1680,
    disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking']
})

client.connect();