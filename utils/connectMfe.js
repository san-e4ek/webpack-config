module.exports = (name) => {
  return `promise new Promise((resolve, reject) => {
    const host = window.envConfig.urls.mfe.${name}

    const remoteConfigUrl = host + '/config.js'
    const scriptConfig = document.createElement('script')
    scriptConfig.src = remoteConfigUrl

    scriptConfig.onload = () => {

      const remoteUrl = host + '/remoteEntry.js'
      const script = document.createElement('script')
      script.src = remoteUrl
      script.onload = () => {
        const proxy = {
          get: (request) => window.${name}.get(request),
          init: (arg) => {
            try {
              return window.${name}.init(arg)
            } catch(e) {
              console.log('Невозможно смонтировать микрофронтенд ${name} ', e)
            }
          }
        }
        resolve(proxy)
      }
      script.onerror = function () {
        reject(new Error('Невозможно загрузить модуль микрофронтенда из: ' + script.src));
      }

      document.head.appendChild(script);
    }

    scriptConfig.onerror = function () {
      reject(new Error('Невозможно загрузить конфиг для микрофронтенда из: ' + scriptConfig.src));
    }
    
    document.head.appendChild(scriptConfig);

  }).catch(e => console.log('Ошибка загрузки микрофронта ${name}', e))`;
};
