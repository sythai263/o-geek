# o-geek backend


### setup environment
- [install nvm](https://github.com/nvm-sh/nvm)
- install docker & docker-compose

### develop guide
- start database: `docker-compose up`
- using config node version: `nvm use`
- create env file: `cp .development.env.example .development.env`
- start src code: `npm run start:dev`

### migration
- create migration file: `npm run migration:generate social_profile_table`

### note
- đọc thêm trong package.json để có nhiều script hay
- đọc thêm về typeorm để biết cách config mà mapping entity của database vs object
- đọc thêm về concept hexagon

### recommend extension for vscode
- Code Spell Checker
- JavaScript/TypeScript
- Git Graph
- ESLint/TSLint