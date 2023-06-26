# Changelog

### [1.0.2](https://github.com/rmolinamir/config-service/compare/@config-service/aws-v1.0.0...${npm.name}-v1.0.2) (2023-06-26)


### Bug Fixes

* **aws:** removing leading forward slash from s3 key, if any ([ab1bbcd](https://github.com/rmolinamir/config-service/commit/ab1bbcd141c442d4393e66d4a43ef4f9ce5d1f53))
* **peerdependencies:** fixed core package peer dependency of the aws and nestjs packages ([2395603](https://github.com/rmolinamir/config-service/commit/239560349d98b3769484b8eba8206e908454f2fa))

### [1.0.1](https://github.com/rmolinamir/config-service/compare/@config-service/aws-v1.0.0...${npm.name}-v1.0.1) (2023-06-26)


### Bug Fixes

* **peerdependencies:** fixed core package peer dependency of the aws and nestjs packages ([2395603](https://github.com/rmolinamir/config-service/commit/239560349d98b3769484b8eba8206e908454f2fa))

## 1.0.0 (2023-06-26)


### Features

* **aws:** new AWS loader to load configurations using AWS services ([63651ef](https://github.com/rmolinamir/config-service/commit/63651ef0fd612af10385ab807f41e79b31128657))
* **config-service:** alpha ([c47818e](https://github.com/rmolinamir/config-service/commit/c47818e69970c275b471df692e67f1516e980195))
* **config-service:** v0.0.0 ([7249f6c](https://github.com/rmolinamir/config-service/commit/7249f6c159cea186e7c774f669b692addcad0463))
* **config-service:** v0.0.0 ([7e32c46](https://github.com/rmolinamir/config-service/commit/7e32c468d854bf2330c9c538d92a33e79ed62716))
* **core:** nodenext moduleResolution and module method is now private ([d6a26cf](https://github.com/rmolinamir/config-service/commit/d6a26cf9f02f21f6d594ab29a8b4dfb490cc7155))
* **core:** refactored the whole API for better dev experience ([85ac9c9](https://github.com/rmolinamir/config-service/commit/85ac9c97274efc8fcf48f6d50e94a39ab98a8364))
* **core:** the config loader is now a dependency of the config service ([f4ff6f3](https://github.com/rmolinamir/config-service/commit/f4ff6f33121131ccd9d42bdea46bb30c2aa024dd))
* **nestjs:** config service global module not being exported ([1b8603c](https://github.com/rmolinamir/config-service/commit/1b8603c3460f86ebb9cfea138b8a7b7716fa3f9b))
* **nestjs:** configServiceModule forRoot options is now optional ([59a64d5](https://github.com/rmolinamir/config-service/commit/59a64d55a571a13b44c1b007e0d2be2af633f3be))
* **nestjs:** nodenext moduleResolution and refactor to adapt to the new core API ([25fa0c9](https://github.com/rmolinamir/config-service/commit/25fa0c983f332ab7947a19809a3af5ab14474ed4))
* **nestjs:** refactored to adapt to the latest config service changes ([b010d44](https://github.com/rmolinamir/config-service/commit/b010d4487fec66e00556f9f236335c0159430d30))
* **registry:** location not found error messages are now more informative ([6bea99c](https://github.com/rmolinamir/config-service/commit/6bea99cd7c560deea00f9bebdb0805988eee21ba))
* **testing:** testing package improvements ([2a2dfa9](https://github.com/rmolinamir/config-service/commit/2a2dfa90e13df699165d845b0bed2cbf26d65ffa))
* **typestack:** added new IsType validator to validate nested objects ([2f27fcb](https://github.com/rmolinamir/config-service/commit/2f27fcbeb815b8a4bad0f3a8332bbc6c11ad0f89))


### Bug Fixes

* **configmoduleasyncfactory:** can now provide more than just strings ([ff9a410](https://github.com/rmolinamir/config-service/commit/ff9a4106f670da10ccdbf3a1b118bcf147da76f4))
* **configserviccoremodule:** fixed config service being loaded twice ([1a516be](https://github.com/rmolinamir/config-service/commit/1a516beebd6c5cb3632d89ff0019301078696e12))
* **package.json:** fixed package.json main and types dir ([6fed718](https://github.com/rmolinamir/config-service/commit/6fed71832de4e0cb668b534a654ab20d4dd227ed))
* **typestack:** fixed index exports ([64aa237](https://github.com/rmolinamir/config-service/commit/64aa237ae561850cedd14a11c3379c15027ee15e))