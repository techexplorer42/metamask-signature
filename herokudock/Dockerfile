FROM amine2029/signmepls

#remove old  build if any
RUN rm -rf /build

#copy new build
COPY ./build /build

#serve it
CMD serve -s /build
