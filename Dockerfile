FROM node:11.9.0

COPY public /public
COPY content /content
COPY package.json /package.json
COPY presentation.js /presentation.js

RUN npm install

EXPOSE 3000

CMD [ "node", "presentation.js" ]