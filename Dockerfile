FROM nginx:alpine

COPY index.html /usr/share/nginx/html/
COPY mentions-legales.html /usr/share/nginx/html/
COPY politique-confidentialite.html /usr/share/nginx/html/
COPY cgu.html /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
