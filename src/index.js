#!/usr/bin/env node


const fs = require('fs');

const path = require('path');

const dir = (...relative) => {
console.log(path.resolve(__dirname, ...relative));
return path.resolve(__dirname, ...relative);}

async function main (){
    
    fs.mkdirSync(dir('src'), { recursive: true });
    fs.mkdirSync(dir('src', 'migrations'), { recursive: true });
    fs.mkdirSync(dir('src', 'models'), { recursive: true });

    const envExists = fs.existsSync(dir('.env'));
    
    if(envExists){
        console.log(`
            Add these lines to your .env:
            
            DB_DATABASE=
            DB_HOST=
            DB_USER=
            DB_PASSWORD=
        `);
    } else {
        fs.writeFileSync(dir('.env'), `DB_DATABASE=MyCustomDatabase
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=`)    
    }
    

}


main()
.then( () => console.log("Done, success. ") )
.catch( (e) => console.log("Error, try again later. ", e) )
.finally( () => process.exit() );