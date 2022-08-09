import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body, html{
        background: #000000;
        font-size: large;
        font-family: monospace;
        color: #CCCCCC;
        margin: 0;
        position: absolute;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }

    .map-popup {
        background: #202020FF;
        height: fit-content;
        border: solid 0.1rem;
        border-radius: 0.3rem;
        font-family:inherit;
        font-size: inherit;
        padding: 0;
        color: #CCCCCC;
    }

    .map-popup div {
        background: none;
        height: fit-content;
        border: none;
        margin: 0;
        padding: 0;
        float: left;
    }
`;

export default GlobalStyle;