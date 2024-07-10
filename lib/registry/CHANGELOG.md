# Changelog

## [1.0.4](https://github.com/rmolinamir/config-service/compare/@config-service/registry-v1.0.3...${npm.name}-v1.0.4) (2024-07-10)


### Features

* **aws:** new AWS loader to load configurations using AWS services ([63651ef](https://github.com/rmolinamir/config-service/commit/63651ef0fd612af10385ab807f41e79b31128657))
* **core:** the config loader is now a dependency of the config service ([f4ff6f3](https://github.com/rmolinamir/config-service/commit/f4ff6f33121131ccd9d42bdea46bb30c2aa024dd))
* **nestjs:** configServiceModule forRoot options is now optional ([59a64d5](https://github.com/rmolinamir/config-service/commit/59a64d55a571a13b44c1b007e0d2be2af633f3be))
* **nestjs:** refactored to adapt to the latest config service changes ([b010d44](https://github.com/rmolinamir/config-service/commit/b010d4487fec66e00556f9f236335c0159430d30))
* **testing:** testing package improvements ([2a2dfa9](https://github.com/rmolinamir/config-service/commit/2a2dfa90e13df699165d845b0bed2cbf26d65ffa))
* **typestack:** added new IsType validator to validate nested objects ([2f27fcb](https://github.com/rmolinamir/config-service/commit/2f27fcbeb815b8a4bad0f3a8332bbc6c11ad0f89))


### Bug Fixes

* **aws:** removing leading forward slash from s3 key, if any ([ab1bbcd](https://github.com/rmolinamir/config-service/commit/ab1bbcd141c442d4393e66d4a43ef4f9ce5d1f53))
* **peerdependencies:** fixed core package peer dependency of the aws and nestjs packages ([2395603](https://github.com/rmolinamir/config-service/commit/239560349d98b3769484b8eba8206e908454f2fa))
