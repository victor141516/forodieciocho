FROM ghcr.io/flaresolverr/flaresolverr:latest

USER root
RUN apk add --no-cache xvfb
USER node

COPY init.sh init.sh
CMD [ "./init.sh" ]