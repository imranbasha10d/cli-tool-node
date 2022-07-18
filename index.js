#! /usr/bin/env node
import fetch from 'node-fetch'
import { program } from 'commander';
import fs from 'fs';

function printPopularJoke(){
    const jokeArray = fs.readFileSync('jokes.txt', 'utf8').split('\n');
    let jokesCounts = {};
    for (let i = 0; i < jokeArray.length-1; i++) {
        let line = jokeArray[i];
        if (jokesCounts.hasOwnProperty(line)) {
            let existingCount = jokesCounts[line];
            jokesCounts[line] = existingCount + 1;
        } else {
            jokesCounts[line] = 1;
        }
    }
    let popularJoke = "";
    let jokeCount = 0;
    Object.keys(jokesCounts).forEach((key) => {
        if (!popularJoke) {
            popularJoke = key;
            jokeCount = jokesCounts[key];
        }
        if (jokesCounts[key] > jokeCount) {
            popularJoke = key;
            jokeCount = jokesCounts[key];
        }
    })
    console.log(popularJoke);
}
async function getJokes(search, options) {
    console.log(`testing ${search}`);
    let url = "https://icanhazdadjoke.com/search?term=";

    if (search) {
        url += `${search}`;
    }

    await fetch(url, { headers: { Accept: "text/plain" } }).then(async (response) => {
        const data = await response.text();
        if (!data) {
            console.log('No jokes for that search query were found');
        }
        fs.appendFile('jokes.txt', data + "\n", function (err) {
            if (err) {
                console.log('Error while adding jokes into txt');
            } else {
                console.log('Jokes added into jokes.txt file');
                if (options.leaderboard) printPopularJoke();
            }
        });
    })
}

program.command('jokes')
    .argument("[search]", "Search keyword")
    .description('Get the jokes')
    .option("-l, --leaderboard", "Get most popular joke")
    .action(getJokes);

program.parse(process.argv)