import {expect} from 'chai';
import {Client} from "../src/models/league-client";
import {readdirSync} from 'fs';

const replayExists = async (client: Client, gameId: number) => {
    const path = await client.getRoflsFolder();
    let regex = new RegExp(`.*?-${gameId}\.rofl\$`);

    return readdirSync(path)
      .some(f => regex.test(f))
};

describe('replay tests', () => {
    const client = new Client();
    const testGameId = 294735528;

    it('should be able to retrieve rofls folder', async function() {
        const roflsFolder = await client.getRoflsFolder();

        expect(roflsFolder).to.be.a('string').of.length.above(1);
    });

    it('should be able to download a replay', async function() {
        this.timeout(10000);
        // Delete the replay if it already exists.
        // await deleteReplay(client, testGameId);

        await client.downloadReplay(testGameId);

        // Check if the replay exists
        expect(await replayExists(client, testGameId)).to.be.true;
    });
});
