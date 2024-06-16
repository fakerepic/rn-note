# rn-note

Notes app built with react native, currently available for both ios and android.

## roadmap

- [x] real-time sync
- [x] offline first
- [x] rich text support
- [x] dark mode
- [x] attachment support
- [x] orgnization method
- [x] full-text search
- [x] ai-powered search
- [ ] ...

## dev scripts

- install dependencies
  ```bash
  yarn
  ```
- dev with expo go

  ```bash
  yarn start
  yarn start --clear -c # clear cache
  ```

  For more details, see instructions in the terminal.

- build android apk (within dev client) and install

  ```bash
  yarn android
  ```

- build android apk (release ) and install

  ```bash
  yarn android:release
  ```

- generate pocketbase types
  ```bash
  yarn codegen
  ```

## notice

- It is recommended to use physical devices for testing, as the app may not work properly in the simulator.
- Make sure `EXPO_PUBLIC_PB_URL` is set correctly in `.env`
