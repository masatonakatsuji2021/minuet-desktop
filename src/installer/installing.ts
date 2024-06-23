import * as https from "https";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";

export const Installing = async (event : Electron.IpcMainEvent) => {

    const nodeJsUrl = "https://nodejs.org/dist/v16.15.1/node-v16.15.1-x64.msi";
    const fileName = path.basename(nodeJsUrl);

    const file = fs.createWriteStream(fileName);
    event.reply("reply-from-main", {
        type: "add",
        message: "Download Node.js (Ver : v16.15.1)\n",
    });

    const req = https.request(nodeJsUrl, {}, (res) => {
        res.pipe(file);
        const maxLength : number = parseInt(res.headers["content-length"]);

        let data;
        res.on("data", (chk)=>{
            data += chk;
            event.reply("reply-from-main", {
                type: "change",
                message: "Downloading... " + (Math.floor((data.length / maxLength) * 100)).toString() + "%",
            });
        });

        res.on("end", ()=>{
            event.reply("reply-from-main", {
                type: "change",
                message: "Downloading... 100%",
            });

            event.reply("reply-from-main", {
                type: "add",
                message: "Save.",
            });

            event.reply("reply-from-main", {
                type: "add",
                message: "Node.js Download Complete!",
            });

            installNodeJs();
        });
    });
    req.end();

    const installNodeJs = ()=>{
        exec(fileName , (error)=> {

            /*
            if (error) {
                event.reply("reply-from-main", {
                    type: "add",
                    message: ".... Node.js Install Falide.",
                });
            }
            else {
            */
                event.reply("reply-from-main", {
                    type: "add",
                    message: ".... Node.js Install Exit.",
                });        
                minuetNpmInstall();
            // }
        });        

    };

    const minuetNpmInstall = ()=>{

        const installJson = {
            description: "minuet desktop installed.",
            repository: "git*https://github.com/masatonakatsuji2021/minuet-server.git",
            license: "MIT",
        };

        fs.writeFileSync("/minuet/package.json", JSON.stringify(installJson, null, "  "));

        event.reply("reply-from-main", {
            type: "add",
            message:"Minuet NPM Package Install.",
        });

        let status = true;
        const child = exec("cd /minuet && npm i git+https://github.com/masatonakatsuji2021/minuet-server.git");

        child.stdout.on('data', (data) => {
            event.reply("reply-from-main", {
                type: "add",
                message: data.toString().trim(),
            });
        });

        child.stderr.on("data", (err)=>{
            if (err.toString().indexOf("You should commit this file.") === -1) {
                status = false;
            }
            event.reply("reply-from-main", {
                type: "add",
                message: err.toString(),
            });
        });

        child.stdout.on("end", () => {
            let type = "complete";
            let message = "Complete!";
            if (!status) {
                type = "error";
                message = "Failed!";
            }
            event.reply("reply-from-main", {
                type: type,
                message: "......Install " + message,
            })
        });
              
    };

};