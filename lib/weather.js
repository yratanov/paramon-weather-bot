const http = require('http');

function fetchWeather(city, resolve, reject) {
  return http.get(`http://api.openweathermap.org/data/2.5/find?q=${encodeURIComponent(city)}&APPID=0b0c5b25311c459209556d01b5f0c99f&type=like&lang=ru&units=metric`,
    function(res) {
      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = 'Not found';
      } else if (!/^application\/json/.test(contentType)) {
        error = 'Bad response';
      }

      if (error) {
        reject(error);
        return res.resume();
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(rawData);
          let d = parsedData.list.map((data) => {
            const { temp } = data.main;
            const sign = temp > 0 ? '+' : '';
            const descriptions = data.weather.map(weather => weather.description);
            return { descriptions, sign, temp, name: data.name, city, id: data.id, country: data.sys.country };
          });
          resolve(d);
        } catch (e) {
          console.error(e.message);
        }
      });
    });
}

module.exports = (bot) =>
  bot.on('inline_query', function({ inlineQuery, answerInlineQuery }) {
    let city = inlineQuery.query.trim();
    if (!city) {
      city = 'Krasnoyarsk,ru';
    }

    return new Promise((resolve, reject) => fetchWeather(city, resolve, reject))
      .then((results) => {
        return answerInlineQuery(results.map(({ city, sign, temp, descriptions, name, country, id }) => {
          return {
            id: id + Math.random(),
            title: `${name}, ${country} ${sign}${temp.toFixed(2)}˚`,
            message_text: `${sign}${temp.toFixed(2)}˚, ${descriptions.join(', ')} в ${name}, ${country}`,
            type: 'article'
          };
        }));
      }).catch(console.warn);
  });
