FROM node:18 AS base

RUN mkdir -p /workspace/
RUN mkdir -p /workspace/transactions-service

WORKDIR /workspace/transactions-service

FROM base AS build_transactions-service

WORKDIR /workspace/transactions-service

COPY ./transactions-service/package.json /workspace/transactions-service/
COPY ./transactions-service/package-lock.json /workspace/transactions-service/
RUN npm install

COPY ./transactions-service /workspace/transactions-service/
RUN npm run build
# Copy source code
USER node
# Start the application
COPY --from=build /workspace/transactions-service/dist ./dist

CMD ["dist/index.js"]
# CMD ["npm", "run", "server"]
