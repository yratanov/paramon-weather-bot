Telegram bot built on https://github.com/telegraf/telegraf

## Deploy docker image:

```
docker build -t yratanov/paramon-pogoda-bot .
docker push yratanov/paramon-pogoda-bot
```


On the server:
```
docker pull yratanov/paramon-pogoda-bot
docker stop paramon-pogoda-bot
docker rm paramon-pogoda-bot
docker run -d --name paramon-pogoda-bot -e TELEGRAM_TOKEN=<token> yratanov/paramon-pogoda-bot
```
