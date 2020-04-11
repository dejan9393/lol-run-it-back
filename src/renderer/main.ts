'use strict';
import {Client} from "../main/models/league-client";

const title = document.createElement('title');
title.innerHTML = 'LoL - Run it Back!';
document.head.appendChild(title);

const container = document.querySelector('#app');

import './components/run-it-back-app';

const app: any = document.createElement('run-it-back-app');
app.client = new Client;

container.appendChild(app);
