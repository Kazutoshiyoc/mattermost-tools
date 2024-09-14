# mattermost-tools
Tools for convenient use of Mattermost

## Dependencies
mattermost-tools
- Puppeteer
    - Node.js

## QuickStart

### Installation
* Clone this repository.
```
cd ~; git clone https://github.com/Kazutoshiyoc/mattermost-tools.git
```
* Install [Nodejs](https://nodejs.org/), a server-side JavaScript engine.
* Install [Puppeteer](https://pptr.dev/), a JavaScript library for controling browser.
```
cd ~/mattermost-tools; npm init
npm install puppeteer
```

### Automatically invite multiple users to a specific channel
```
node autoInvite2channel.js "Site_URL" "LoginID" "LoginPassword" "Channel_URL" "UserID_1 UserID_2 UserID_3 ..."
```
