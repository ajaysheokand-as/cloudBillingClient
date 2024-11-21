# Use a base image with necessary tools

FROM amazonlinux:latest



# Update packages and install required software

RUN yum update -y && yum install -y nginx



# Copy Nginx configuration file

COPY nginx.conf /etc/nginx/nginx.conf



# Expose port 80

EXPOSE 80



# Start Nginx service when the container starts

CMD ["nginx", "-g", "daemon off;"] 
