# Tabber
Tabber is a small script POC for tracking how many tabs a user has open.

## How it works
Tabber uses localStorage with a little bit of help from StorageEvent and BeforeUnloadEvent.
Because localStorage exists across hosts, Tabber can track each time the webpage is loaded.