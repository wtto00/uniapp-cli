FROM node:20

WORKDIR /data

COPY packages/common/dist /data/common/dist
COPY packages/common/package.json /data/common/

COPY packages/cli/bin /data/cli/bin
COPY packages/cli/dist /data/cli/dist
COPY packages/cli/package.json /data/cli/

COPY packages/android/dist /data/android/dist
COPY packages/android/package.json /data/android/

RUN sed -i "s/workspace\:\^/file\:\.\.\/common/" "android/package.json" \
  && sed -i "s/workspace\:\^/file\:\.\.\/common/" "cli/package.json"

RUN npm config set registry https://registry.npmmirror.com

RUN cd common && npm install
RUN cd android && npm install
RUN cd cli && npm install

RUN npm i -g ./cli

RUN echo "PATH=\$PATH:/usr/local/lib/node_modules" >> ~/.bashrc

CMD [ "/bin/bash" ]