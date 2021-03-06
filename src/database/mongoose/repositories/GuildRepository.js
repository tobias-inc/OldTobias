const MongoRepository = require('../MongoRepository.js')
const GuildSchema = require('../schemas/GuildSchema.js')

module.exports = class GuildRepository extends MongoRepository {
    constructor(mongoose) {
        super(mongoose, mongoose.model('Guild', GuildSchema))
    }

    parse(entity) {
        return {
            language: process.env.LANG_ROOT,
            prefix: process.env.PREFIX,

            ...(super.parse(entity) || {})
        }
    }
    async addChannelFilter(channel, regex, action) {
        return this.r.table("filters").insert({
          guild: channel.guild.id,
          channel: channel.id,
          regex: regex,
          action: action
        }).run();
      };
}