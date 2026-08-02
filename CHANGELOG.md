# Changelog

## [0.0.2](https://github.com/bitcraft-apps/rental-studio/compare/rental-studio-v0.0.1...rental-studio-v0.0.2) (2026-08-02)


### Features

* add base layout with Tailwind CSS v4, HTMX, and Hono JSX ([#32](https://github.com/bitcraft-apps/rental-studio/issues/32)) ([4cdeda8](https://github.com/bitcraft-apps/rental-studio/commit/4cdeda8708041738136f211902a12828d67445e0))
* add CI/CD pipeline with GitHub Actions and Dokku deployment ([95edd65](https://github.com/bitcraft-apps/rental-studio/commit/95edd653288aa22c82687a930215cc2e843175d0))
* add Docker setup for development and production ([#24](https://github.com/bitcraft-apps/rental-studio/issues/24)) ([ae27038](https://github.com/bitcraft-apps/rental-studio/commit/ae27038ecadec9db1ddaffde62f3f31b1d399043))
* add Drizzle ORM with database schema and migrations ([#31](https://github.com/bitcraft-apps/rental-studio/issues/31)) ([1135ae2](https://github.com/bitcraft-apps/rental-studio/commit/1135ae21d798c9c7c1a64d307dc2f70e1fa3ee46))
* add Hono skeleton with routing, middleware, and error handling ([#30](https://github.com/bitcraft-apps/rental-studio/issues/30)) ([dfc08c4](https://github.com/bitcraft-apps/rental-studio/commit/dfc08c4c5817caf848fc48178daf4b557919ceda))
* add subdomain tenant middleware ([#36](https://github.com/bitcraft-apps/rental-studio/issues/36)) ([8410b40](https://github.com/bitcraft-apps/rental-studio/commit/8410b4066edcfb428bd612b4556c8c4c8a6b9c47))
* complete Dokku deployment setup ([#27](https://github.com/bitcraft-apps/rental-studio/issues/27)) ([455c6ac](https://github.com/bitcraft-apps/rental-studio/commit/455c6ac84a0766b5728800f47cc3dfa171c803a1)), closes [#5](https://github.com/bitcraft-apps/rental-studio/issues/5)
* initialize monorepo with Bun workspaces ([#22](https://github.com/bitcraft-apps/rental-studio/issues/22)) ([5d26927](https://github.com/bitcraft-apps/rental-studio/commit/5d26927031c4c71147c7f461fb77a504f7122cee))
* Setup Biome for linting and formatting ([#23](https://github.com/bitcraft-apps/rental-studio/issues/23)) ([679c7cf](https://github.com/bitcraft-apps/rental-studio/commit/679c7cfdf83067836da041b359b225283b270467))


### Bug Fixes

* add missing database package to Dockerfile ([#34](https://github.com/bitcraft-apps/rental-studio/issues/34)) ([d918137](https://github.com/bitcraft-apps/rental-studio/commit/d9181378f56011a3c564d211a7395fcf10bb312b))
* hardcode environment URLs (secrets not allowed in environment.url) ([baefc75](https://github.com/bitcraft-apps/rental-studio/commit/baefc7579543eb3384c1050e04da0f7dc893d92d))
* simplify deploy workflow to avoid reusable workflow issues ([9b6c573](https://github.com/bitcraft-apps/rental-studio/commit/9b6c573434aa3a765ad45116088c7496b2d96893))
* use full refspec for Dokku push ([#28](https://github.com/bitcraft-apps/rental-studio/issues/28)) ([7b841ea](https://github.com/bitcraft-apps/rental-studio/commit/7b841ea413e0831fd709507edf4d32aa848f02db))
