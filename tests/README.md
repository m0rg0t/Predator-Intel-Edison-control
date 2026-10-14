# Portable source regressions

Run with Node 24:

```sh
node tests/light-announcements.test.cjs
```

Runs the pure helper and extracts only the actual lightButton callback text into an inert VM with synthetic sensor values and a recording playSong function. It never imports or evaluates main.js initialization. Exercises every light threshold and independent temperatures, guaranteeing exactly one existing sound asset. No GPIO, servo, audio, timers, native modules or network are initialized.

These tests do not build or validate the historical application SDK/device runtime. Original platform targets, dependencies and vendor binaries are unchanged. The .NET harness has no package feeds or external test packages.
