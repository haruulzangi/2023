FROM  --platform=linux/amd64 node
# Install Chrome
RUN apt update \
    && apt install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt update \
    && apt install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libxshmfence-dev \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
RUN apt update \
    && wget -q -O - https://packagecloud.io/varnishcache/varnish60lts/gpgkey | apt-key add - \
    && sh -c 'echo "deb https://packagecloud.io/varnishcache/varnish60lts/debian/ buster main" >> /etc/apt/sources.list.d/varnishcache_varnish60lts.list' \
    && apt update \
    && apt install -y varnish apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

RUN dd if=/dev/urandom of=/etc/varnish/secret count=1

# Setup varnish and supervisord
COPY ./config/default.vcl /etc/varnish/cache.vcl

COPY ./config/start.sh /start.sh
RUN chmod +x /start.sh
# Setup app
RUN mkdir -p /app

# Add application
WORKDIR /app
COPY --chown=www-data:www-data hwplatform .

# Install dependencies
RUN npm install

# Expose the port application is reachable on
EXPOSE 1337

CMD /start.sh
