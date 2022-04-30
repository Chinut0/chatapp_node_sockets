# Node version to install
FROM node:16

# WORKDIR - where our app will live in the container
WORKDIR /usr/src/app

# COPY package and package-lock to the WORKDIR of the container to install dependecies
COPY package*.json ./

# Install dependencies into de container
RUN npm install

# COPY to the WORKDIR all my code
COPY . .

# Expose the port that the app is runnig
# EXPOSE 3000

# Run Seeder
# Start app dev
CMD ["npm", "run", "dev"]

# CMD ["npm", "run", "seed"] && ["npm", "run", "dev"]

# ADD run_local.sh /
# RUN chmod +x /run_local.sh
# CMD ["run_local.sh"]