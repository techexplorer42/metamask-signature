all:
	make -C ../ build
	rm -rf ./build
	cp -r ../build .
	heroku container:push web -a signmepls
	heroku container:release web -a signmepls

update:
	docker build -t amine2029/signmepls .
	docker push amine2029/signmepls
