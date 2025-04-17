FROM node:22-bullseye-slim AS build

WORKDIR /var/cache/backend

RUN corepack enable && corepack prepare yarn@stable --activate
RUN chown node:node /var/cache/backend

USER node

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

RUN yarn build

FROM build AS dependencies

RUN yarn workspaces focus --production

FROM gcr.io/distroless/nodejs:22 AS app

ARG NODE_ENV="production" PORT=3000

ENV NODE_ENV=${NODE_ENV} PORT=${PORT}

WORKDIR /srv/app

COPY --from=dependencies /var/cache/backend/node_modules ./node_modules
COPY --from=build /var/cache/backend/dist ./

EXPOSE ${PORT}

CMD ["/srv/app/main.js"]
