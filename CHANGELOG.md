# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.5.3"></a>
## [0.5.3](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.5.2...v0.5.3) (2018-12-07)


### Bug Fixes

* Add setting to specify child process and launcher logs path ([7296887](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/7296887))
* Ensure that the launcher log dir exists. Guard against exceptions attempting to open launcher-log file ([effa614](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/effa614))
* Guard against exception opening process log files ([aa88301](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/aa88301))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.5.1...v0.5.2) (2018-12-04)


### Bug Fixes

* Logs and startup with no basepath set ([7e2041f](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/7e2041f))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.5.0...v0.5.1) (2018-12-04)


### Bug Fixes

* **logs:** Use child process name instead of id in log filename ([b92ee2d](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/b92ee2d))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.4.0...v0.5.0) (2018-12-04)


### Features

* Option to write log files for each process ([4d16a8c](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/4d16a8c))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.3.0...v0.4.0) (2018-11-14)


### Bug Fixes

* Block child windows being opened ([64ec5f7](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/64ec5f7))
* downgrade bootstrap-vue to fix issue with input fields ([e867d81](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/e867d81))
* Update electron-builder ([ce514fb](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/ce514fb))
* various fixes ([2586499](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/2586499))


### Features

* **casparcg:** Make casparcg ping healthcheck optional ([7afaf74](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/7afaf74))
* Add a status default page to show an overview of every process status ([0dfbde2](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/0dfbde2))
* Add version string to bottom of settings page ([1f2e8e9](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/1f2e8e9))
* Convert hardcoded set of processes to be a table defined in the config. This will convert existing configs to the new format ([e916786](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/e916786))
* Option to allow deleting files within a staticPath. Useful for a folder setup for recordings ([f4caf94](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/f4caf94))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/nrkno/tv-automation-casparcg-launcher/compare/v0.2.0...v0.3.0) (2018-10-10)


### Bug Fixes

* auto scroll in newer electron ([c42aa0f](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/c42aa0f))
* guard against sending ipc messages while shutting down ([35f9854](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/35f9854))


### Features

* Improve casparcg timeouts. Detect and ignore system clock changes ([7e80ab6](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/7e80ab6))
* Improve logging to file ([dbe30bd](https://github.com/nrkno/tv-automation-casparcg-launcher/commit/dbe30bd))
