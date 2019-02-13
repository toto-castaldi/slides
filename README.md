# slides

shows a list o Markdown files as a Web presentation

put your files in the content folder

    > docker build . -t slides
    > docker run -it -p 3000:3000 slides
    > google-chrome http://localhost:3000
