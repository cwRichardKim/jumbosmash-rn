# JumboSmash

We spent a year building a full-fledged dating app that only worked for Tufts Seniors during Senior Week. 1 million swipes within 24 hours, 5 million by the end of the week, 80% adoption, 25k+ matches.  [\[Read More\]](https://blog.cwrichardkim.com/we-spent-a-year-building-a-dating-app-that-only-lasts-one-week-e6e1a10cedb3)

![preview](http://i.imgur.com/pxyT5iJ.png)

## Disclaimer:
We've removed all sensitive files from the project and it's history, so it's unlikely to run or build correctly.  If you'd like to build this for whatever reason, please contact us and we might be able to help (but probably not... we have lives n stuff idk).

If you're on a post-2017 jumbosmash team, please do not use this code, the whole point of the tradition is to build it from scratch.  See [this post](https://github.com/jumbosmash/tradition) for more information.

## Team:
- Richard Kim: Team lead, mobile developer
- Elif Kınlı: Backend / Server guru
- Jared Moskowitz: Mobile dev, chat master
- Jade Chan: Mobile dev, auth wrangler
- Shanshan Duan: Designer, goddess
- Bruno Olmedo: Designer, single
- Justin Sullivan: Web master, oh so very handsome

## Tech overview:
- Backend: Firebase (image hosting, auth, chat) and Heroku (user information, most of the logic)
- Frontend: Facebook's ReactNative (iOS and Android) + various dependencies listed in podfile and package
- Static Website: ScrollMagic, Justin's sweat and tears, hosted on GitHub
- Distribution / Beta testing: Fastlane

## Architecture Overview:
This may help you understand how we built this.  It's **very** simplified:

![Overview](http://i.imgur.com/O5Xwkhv.png)

## Versions:
```
react-native-cli: 1.0.0
react-native: 0.42.3
npm: 3.10.6
node: 4.5.0
cocoapods: 1.2.1
```

## Building
You can try running `./make` but I highly doubt it will work.  We had to make some custom edits into our dependencies that weren't tracked via git.  Also, we pulled some sensitive files from this repository.
