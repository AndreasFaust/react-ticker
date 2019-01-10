# react-ticker

> React component, that moves text, images and videos infinitely like a newsticker.

[![NPM](https://img.shields.io/npm/v/react-ticker.svg)](https://www.npmjs.com/package/react-ticker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Coming soon!

## ToDo

- Start & stop
- Rreplace windowWidth with Ticker-width

- Example Page
- Write docs

## Props

| **Name**  | **Type**         | **Default** | **Description**                                                                                                                                                                                                                                                                                                                                                   |
| :-------- | :--------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| speed     | number           | `5`         |                                                                                                                                                                                                                                                                                                                                                                   |
| direction | string           | `toLeft`    | Opposite direction: `toRight`                                                                                                                                                                                                                                                                                                                                     |
| mode      | string           | `chain`     | `chain` By default, the elements follow one and another immediately. <br> `await` A new element appears as soon as the previous one has disappeared completely. <br> `smooth` A new element appears as soon as the previous one starts to disappear.                                                                                                              |
| height    | string or number | `auto`      | **Auto-height:** By default, the Ticker will adapt the height of its highest visible child. **Fixed height:** Alternatively you can give it a fixed height: A number will be set as pixels, a string can be everything.                                                                                                                                           |
| offset    | string or number | `0`         | By default, the first element in the Ticker will align to the Tickers left side. <br> **Fixed Offset:** A number will move the Ticker's first child to the right by n pixel. <br> **Relative Offset:** The offset can also be defined in percent of the Ticker’s width. <br> **Run-in:** The string `run-in` hides the first element, so the Ticker starts empty. |
| move      | boolean          | `true`      | Set to `false` stops the Ticker.                                                                                                                                                                                                                                                                                                                                  |

## License

MIT © [https://github.com/AndreasFaust](https://github.com/https://github.com/AndreasFaust)
