# Clappy Button
<a name="readme-top"></a>

<div align="center">
  <img src="https://clappy-button-web-component.s3.amazonaws.com/github-readme-images/logo-1189px-322px-v1.png" alt="Clappy Button Logo" width="400"></img>
  <p align="center">
    The Like button evolved.
  </p>
  <br />
  <img src="https://clappy-button-web-component.s3.amazonaws.com/github-readme-images/light-mode-1-x-10-cent-demo.gif" alt="Demo" width="96" height="187"></img>
  <!-- <br /> -->
  <!-- <a href="https://github.com/github_username/repo_name">🔗 Interactive Demo</a> -->
</div>

## Introduction

Clappy Button is a [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that can be embedded on any web page that supports JavaScript.

## API

`<clappy-button>` accepts the following attributes:

- `instanceid` - Unique identifier to distinguish between multiple clappy buttons on the same page e.g. `post-1`
- `amountperclap` - Each time user claps, total amount will be incremented by this value e.g. `"0.01"`
- `currencycode` - Currency code e.g. `"USD"`
- `currencysymbol` - Currency symbol e.g. `"$"`
- `theme` - `"light"` or `"dark"`. Alternatively, leave this blank and specify a custom theme (see Custom)

Example:

```html
<script src="[to be uploaded]/clappy-button.js"></script>

<clappy-button
  instanceid="post-id-1"
  amountperclap="0.01"
  currencycode="USD"
  currencySymbol="$"
  theme="light"
>
```

> Attributes are case sensitive and must be defined in all lowercase i.e. `instanceid` is valid but `instanceId` is invalid.

Interactions between your app and Clappy Button must be made via [window message events](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event).

Incoming message events:
  - `clap` - sent after each clap with `instanceId` and `amount`
  - `loading` - sent when loading animation starts with `instanceId` and `amount`

Outbound message events:
  - `success` - triggers success animation
  - `fail` - triggers fail animation

## Examples

### React

```jsx

import { useEffect } from 'react'
import '@remjx/clappy-button-wc'

function App() {

  async function confirmPayment() {
    confirm()
      .then(result => {
        window.postMessage({ app: 'clappy-button', event: 'success', instanceId: 'cb1' })
      })
      .catch(error => {
        window.postMessage({ app: 'clappy-button', event: 'fail', instanceId: 'cb1' })
      })
  }

  function handleWindowMessage(message) {
    if (message.data.app === 'clappy-button' && message.data.event === 'loading' && message.data.instanceId === 'cb1') {
      confirmPayment()
    }
  };
  useEffect(() => {
    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [])
  
  return (
    <div style={{ marginTop: '75px' }}>
      <clappy-button instanceid="cb1" currencycode="USD" currencysymbol="$" amountperclap="0.01" theme="light"></clappy-button>
    </div>
  );
}

```

### Custom Theme

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

## Contribute

[Feature requests](https://github.com/remjx/clappy-button-web-component/issues/new), [issues](https://github.com/remjx/clappy-button-web-component/issues) and [pull requests](https://github.com/remjx/clappy-button-web-component/pulls) are welcome!


## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Maintainers

remjx - [twitter](https://twitter.com/remjxd) | [website](https://remjx.com)


## Donations

https://coindrop.to/clappy-button

## Follow Us

[Twitter](https://twitter.com/clappybutton)

<p align="right">(<a href="#readme-top">back to top</a>)</p>