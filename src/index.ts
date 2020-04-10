import inquirer from 'inquirer';
import {Client} from "./models/league-client";
import {sleep} from "./utility/sleep";
import color from 'kleur';

const main = async () => {
  const gameIdRegex = /^\d+$/;
  const client = new Client;

  if (!await client.isClientRunning()) {
    // Attempt to start the client automatically
    console.log("Your LoL Client is not running, attempting to open from default install location");

    try {
      await client.openClient();

      console.log("Successfully launched client... it can take a while for the client to be ready for us to start downloading replays.");
    }catch (e) {
      console.log(color.red("Could not launch client automatically, please start your league client before continuing"));
    }
  }

  console.log("Waiting for client connection...");

  await client.connect()
    .then(_ => console.log(color.green("Client connection achieved")));

  while (true) {
    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'gameId',
        message: 'Enter the Game ID of the replay you\'d like to watch',
        validate: value => !gameIdRegex.test(value) ? `Game ID must be a sequence of numbers, e.g. 4285830692` : true,
      }
    ]);

    try {
      console.log(`Attempting to download replay for ${response.gameId}, sit tight`);
      await client.watchReplay(response.gameId);

      console.log(color.green("Opening replay... please wait"))
    } catch (e) {
      console.log(color.red("Could not download replay, make sure the Game ID you entered is valid and belongs to the region your LoL Client is associated with" + e.message));
    }

    await sleep(2000);
  }
};

main();
