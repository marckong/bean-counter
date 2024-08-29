FROM golang:1.22.6-bullseye AS build
WORKDIR /build
COPY go.mod go.sum ./
RUN --mount=type=cache,target="/root/.cache/go-build" \
  go mod download
COPY server ./server
ENV CGO_ENABLED=0
ENV GOCACHE=/root/.cache/go-build
RUN --mount=type=cache,target="/root/.cache/go-build" \
  go build -o a.out ./server
RUN chmod +x ./server

FROM node:22-alpine AS build-frontend
WORKDIR /build
COPY packag*.json ./
RUN npm ci
COPY postcss.config.cjs tsconf*.json vite.config.ts index.html .env.* ./
COPY ui ./ui
COPY public ./public
RUN npm run build

FROM scratch
EXPOSE 8080
WORKDIR /
ENV IS_PROD=true
COPY --from=build /build/a.out /server
COPY --from=build-frontend /build/dist /dist
ENTRYPOINT [ "/server" ]
