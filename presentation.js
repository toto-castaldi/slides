const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const developing = process.env.DEVELOP || false;
const marked = require('marked');
const contentFolder =  process.cwd() + (process.env.CONTENT_FOLDER || '/content/');
let contentFiles = [];
const markedOptions = {

}

marked.setOptions(markedOptions);

const wrapHtml = (body) => {
    return `
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Content</title>
                <link rel="stylesheet" href="/content/content.css">
            <head>
            <body>
                ${body}
            </body>
        </html>
    `;
};

app.use(express.static('public'));

app.get('/index.json', (req, res) => {
    fs.readFile(contentFolder + 'index.json', 'utf8', (err, contents) => {
        if (err) {
            console.error(err);
            res.status(500);
        } else {
            res.send(contents);
        }

    });
});

app.get('/content/content.css', (req, res) => {
    fs.readFile(contentFolder + 'content.css', 'utf8', (err, contents) => {
        if (err) {
            console.error(err);
            res.status(500);
        } else {
            res.send(contents);
        }

    });
});

app.get('/content/:fileIndex', (req, res) => {
    const filePath = contentFiles[req.params.fileIndex]; 
    console.debug(`return file content ${filePath}`);
    fs.readFile(filePath, 'utf8', (err, contents) => {
        if (err) {
            console.error(err);
            res.status(500);
        } else {
            const html = wrapHtml(marked(contents));
            console.debug(html);
            res.send(html);
            console.log(developing);
            if (developing) reloadContentFolder();
        }

    });

});

app.get('/slidesInfo.json', (req, res) => {
    res.send(JSON.stringify({
        max : contentFiles.length
    }));
});

const reloadContentFolder = (callback) => {
    fs.readdir(contentFolder, (err, items) => {
        if (err) {
            console.error(err);
        } else {
            contentFiles = [];
            items.sort().forEach(file => {
                if (file.endsWith('.md')) { 
                    contentFiles.push(contentFolder + file);
                }
            });
            console.log(contentFiles);
            if (callback) callback();
        }
    });
}

reloadContentFolder(() => {
    app.listen(port, () => console.log(`open presentation at http://localhost:${port}/index.html`));
});



