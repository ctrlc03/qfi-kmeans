# Makefile

install:
	yarn install

build:
	yarn build

test_ts:
	yarn test:ts

test_circom:
	yarn test:circom 

plot:
	chmod +x plotting.sh
	./plotting.sh

all: install build test_ts test_circom plot

.PHONY: install build test_ts test_circom plot