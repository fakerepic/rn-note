# rn-note

Notes app built with react native, currently available for both ios and android.

## roadmap

- [x] real-time sync
- [x] offline first
- [x] rich text support
- [x] dark mode
- [ ] attachment support
- [ ] orgnization method
- [ ] full-text search
- [ ] ai-powered search
- [ ] ...

## dev scripts

- install dependencies
  ```bash
  yarn
  ```
- dev

  ```bash
  yarn start
  yarn start --clear -c # clear cache
  ```

- build android release apk

  ```bash
  yarn build
  ```

- generate pocketbase types
  ```bash
  yarn codegen
  ```

## notice

- Make sure `EXPO_PUBLIC_PB_URL` is set correctly in `.env`
