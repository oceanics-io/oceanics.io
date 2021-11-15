import katex from "katex";
import React from "react";
import type {FC} from "react";

export interface IEquation {
    text: string;
}

/**
 * For more complete implementation see: https://github.com/zzish/react-latex/blob/master/src/latex.js
 */
const Equation: FC<IEquation> = ({text}) => {
    return (
        <span dangerouslySetInnerHTML={{__html: katex.renderToString(text, {output: "mathml"})}} />
    )
}

Equation.displayName = "InlineEquation"
export default Equation