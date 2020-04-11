# LoL Run It Back!

A simple tool for playing back League of Legends replays from the command line.

Works while match history is down!

Only works for replaying games on the current patch.

## Demo

![Run It Back Demo Gif](demo/demo.gif)

## Installation

### From Source
```
git clone https://github.com/dejan9393/lol-run-it-back.git

yarn install
```

To run the tool, simply run:

`yarn dev`

### Direct Download Links

* [Windows](https://github.com/dejan9393/lol-run-it-back/releases/latest/download/LoLRunItBackSetup.exe)
* [MacOS X](https://github.com/dejan9393/lol-run-it-back/releases/latest/download/LoLRunItBackSetup.dmg)

## Watch replays
The app will ask you for the Game ID of the match that you're trying to retrieve the replay for.

To get this, you can use pretty much any online service out there, most of them will have the Game ID of all the matches they displayed
right on the page or in the URL.

For example, if you click into a match on leagueofgraphs, the Game ID can be found in the URL, e.g.: https://www.leagueofgraphs.com/match/oce/292006709  

## Troubleshooting
Run It Back requires the LoL client to be running, as it communicates to the LoL API via the client.

It will automatically attempt to open your client from the default path. If this doesn't work, open the client manually and then run the tool.

## Misc

This software is obviously completely free to use.
If run it back has helped you out and you're feeling generous, feel free to [buy me a beer](https://paypal.me/dlukic93) 🍻
