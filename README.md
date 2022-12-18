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

Clappy Button is a [web component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) that can be embedded on any web page that supports JavaScript and HTML.


## API

### Parameters

`<clappy-button>` accepts the following parameters as HTML attributes:

- `amountperclap` - Each time user claps, total amount will be incremented by this value e.g. `"0.01"`
- `currencycode` / `currencysymbol`
  - if `currencycode` is specified, it will be used as a suffix in the amount e.g. 1 USD
  - if `currencysymbol` is specified, it will be used as a prefix in the amount e.g. $1
- `theme` - `"light"` and `"dark"` are the current built-in themes, or you can create your own (see below)
- `instanceid` - Unique identifier if there are multiple clappy buttons on the same page e.g. `post-id-1`
- `claponlymode` - If you only want to use the clap animation & clap event (no counter, loader, or success/fail animations), set this to `"true"`.
- `amountmax` - amount maximum, typically set equal to the user's current spendable balance.

Example:

```html
<clappy-button
  amountperclap="0.01"
  currencycode="USD"
  currencySymbol="$"
  theme="light"
  instanceid="post-id-1"
  amountmax="0.101"
></clappy-button>
```

> Note: attributes are case sensitive and must be defined in all lowercase e.g. `instanceid` is valid, `instanceId` is invalid.

### Events

Communication between your app and Clappy Button is made via [Window message events](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event).

Window Message Events emitted from Clappy Button to [listen for in your app](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event):
  - `clap` - sent with each clap. `eventData` includes with `instanceId` and `amount`. 
  - `loading` - sent when user is finished clapping. `eventData` includes `instanceId` and `amount`.

Window Message Events to [emit from your app](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) to control Clappy Button animations:
  - `success` - triggers success animation
  - `fail` - triggers fail animation

## Framework Implementation Examples

### React

```jsx

import { useEffect } from 'react'
import '@remjx/clappy-button-wc' // TODO: finalize package name & publish

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
      <clappy-button instanceid="cb1" currencysymbol="$" amountperclap="0.01"></clappy-button>
    </div>
  );
}

```

## Custom Theme

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

MIT License. See [`LICENSE.md`](https://github.com/remjx/clappy-button-web-component/blob/main/LICENSE.md) for more information.

## Maintainers

remjx - [twitter](https://twitter.com/remjxd) | [website](https://remjx.com)

## Donations

[coindrop.to/clappy-button](https://coindrop.to/clappy-button) << Also built by remjx :)

## Follow Clappy Button

[Twitter @clappybutton](https://twitter.com/clappybutton)