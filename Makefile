install:
	npm ci

publish:
	npm publish --dry-run

genDiff:
	npm link

lint: 
	npx eslint
	
test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8