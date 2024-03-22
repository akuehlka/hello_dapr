FROM node:21-alpine

# # Update package lists and upgrade installed packages
# RUN apk update && apk add --no-cache \
#     wget bash

# # Install dapr CLI
# RUN wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash

# # Install daprd
# ARG DAPR_BUILD_DIR
# COPY $DAPR_BUILD_DIR /opt/dapr
# ENV PATH="/opt/dapr/:${PATH}"
# RUN dapr init --slim

# Install app
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]