FROM node:alpine as BUILD_IMAGE
WORKDIR /
COPY package.json yarn.lock ./
# install dependencies 
RUN yarn install --frozen-lockfile
COPY . .
# build
RUN yarn build
# remove dev dependencies
RUN npm prune --production
FROM node:alpine
WORKDIR /
# copy from build image
COPY --from=BUILD_IMAGE /package.json ./package.json
COPY --from=BUILD_IMAGE /node_modules ./node_modules
COPY --from=BUILD_IMAGE /.next ./.next
COPY --from=BUILD_IMAGE /public ./public
COPY .env .env
EXPOSE 3000
CMD ["yarn", "start"]