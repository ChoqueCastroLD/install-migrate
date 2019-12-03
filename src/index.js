#!/usr/bin/env node

const fs = require('fs');

const path = require('path');

console.log(__dirname);



const dir = (...relative) => path.resolve(__dirname, ...relative);
const cwd = (...relative) => path.resolve(process.cwd(), ...relative);

async function main() {

    fs.mkdirSync(cwd('src'), {
        recursive: true
    });
    fs.mkdirSync(cwd('src', 'migrations'), {
        recursive: true
    });


    const template = fs.readFileSync(dir('template.js'));
    const database = fs.readFileSync(dir('create_database.js'));

    fs.writeFileSync(cwd('src', 'migrations', '.template.js'), template);
    fs.writeFileSync(cwd('src', 'migrations', '0000000000000-create-database.js'), database);

    const envExists = fs.existsSync(cwd('.env'));

    let package = JSON.parse(fs.readFileSync(cwd('package.json')).toString());

    package.scripts = {
        ...package.scripts,
        "migration:init": "migrate init --migrations-dir ./src/migrations",
        "migration:create": "migrate create --migrations-dir ./src/migrations --template-file ./src/migrations/.template.js",
        "migration:list": "migrate list --migrations-dir ./src/migrations",
        "migration:up": "migrate up --migrations-dir ./src/migrations --env ./.env",
        "migration:down": "migrate down --migrations-dir ./src/migrations --env ./.env"
    }
    package.dependencies = {
        ...package.dependencies,
        "migrate": "^1.6.2"
    }

    fs.writeFileSync(cwd('package.json'), JSON.stringify(package, undefined, 4));

    if (envExists) {
        console.log(`
            Ensure these variables have values in your .env file:
            
            DB_DATABASE=
            DB_HOST=
            DB_USER=
            DB_PASSWORD=
        `);
    } else {
    
fs.writeFileSync(cwd('.env'), `DB_DATABASE=MyDatabase
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=`);

    }
}


main()
    .then(() => console.log("Done, success. "))
    .catch((e) => console.log("Error, try again later. ", e))
    .finally(() => process.exit());