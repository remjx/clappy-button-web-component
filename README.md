# Clappy Button
<a name="readme-top"></a>

<div align="center">
  <img src="https://clappy-button-web-component.s3.amazonaws.com/github-readme-images/logo-1189px-322px-v1.png" alt="Clappy Button Logo" width="400"></img>
  <p align="center">
    The Like button evolved. Made for Bitcoin.
  </p>
  <br />
  <img src="https://clappy-button-web-component.s3.amazonaws.com/github-readme-images/light-mode-1-x-10-cent-demo.gif" alt="Demo" width="96" height="187"></img>
  <br />
  <a href="https://github.com/github_username/repo_name">🔗 Interactive Demo</a>
</div>

## Features

- 100% free and open-source
- TBD License
- Themable (use the built-in Light and Dark themes, or create your own)

### Coming soon

- Wallet plugins

## Usage

### Color Theming

Pre-built `theme`s:

- `light`
- `dark`

Custom theme can be specified using css:

```css
  clappy-button::part(custom-theme) {
    --background: #e6e6e6;
    --counter-background: #000;
    --counter-label: #fff;
    --confetti-primary: #2599ff;
    --confetti-secondary: #fdcb01;
    --hand: #000;
    --loading: #ababab;
    --loading-background: white;
    --success: #4bb543;
    --fail: #fc100d;
    --button-border: transparent;
  }
```

### React

```

import { useEffect } from 'react'
import '@remjx/clappy-button-wc'

function App() {

  function handleMessage(message) {
    if (message.data.app === 'clappy-button' && message.data.event === 'loading' && message.data.instanceId === 'cb1') {
      sendPayment()
    }
  };

  async function sendPayment() {
    const demoResult = 'fail'
    try {
      const result = await new Promise((resolve, reject) => {
        setTimeout(demoResult === 'success' ? resolve : demoResult === 'fail' ? reject : null, 2000)
      })
      window.postMessage({ app: 'clappy-button', event: 'success', instanceId: 'cb1' }) // TODO: move this to helper function / api "result: success"
    } catch (err) {
      window.postMessage({ app: 'clappy-button', event: 'fail', instanceId: 'cb1' }) // TODO: move this to helper function / api "result: success"
    }
  }

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [])
  
  return (
    <div className="App" on>
        <div style={{ marginTop: '75px' }}>
          <clappy-button instanceid="cb1" currencycode="USD" currencysymbol="$" amountperclap="0.01" theme="light"></clappy-button>
        </div>
    </div>
  );
}

```

...


## Contribute

Please feel free to open [issues](https://github.com/remjx/clappy-button-web-component/issues) and [pull requests](https://github.com/remjx/clappy-button-web-component/pulls).


## License

Distributed under the [TBD] License. See `LICENSE.txt` for more information.


## Maintainers

remjx - [twitter](https://twitter.com/remjxd) | [website](https://remjx.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Donations

https://coindrop.to/clappy-button

## Follow Us

[Twitter](https://twitter.com/clappybutton)