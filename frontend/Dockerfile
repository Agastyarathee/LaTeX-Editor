# Dev-only Dockerfile (less recommended for prod)
#FROM node:20-slim
##WORKDIR /frontend
#COPY . .
#RUN apt-get update && apt-get install -y git && apt-get clean
#RUN npm install
#EXPOSE 5173
#CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

#CMD ["tail" "-f" "/dev/null"]
# Build Stage
FROM node:18-alpine as builder

WORKDIR /frontend
COPY . .
RUN npm install
#RUN npm run build

# Nginx Stage
FROM nginx:alpine

# Copy build output to Nginx html folder
COPY --from=builder /frontend/dist /usr/share/nginx/html

# Optional: Replace default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
